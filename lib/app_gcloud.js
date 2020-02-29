const express = require("express");
const bodyParser = require('body-parser')
const fs = require("fs");
const {Storage} = require('@google-cloud/storage');

const port = 8080;
const idLength = 4;
const CLOUD_BUCKET = "lazbin-pastes";

const app = express();
const storage = new Storage();
const bucket = storage.bucket(CLOUD_BUCKET);

app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static(__dirname + '/public'));
app.use("/notfound", express.static(__dirname + "/public/notfound.html"));

/*
Handles post requests for saving pastes
*/
app.post("/paste_publish", publishPaste);

function publishPaste(req, res) {
    let id = generateID(idLength);
    let gFile = bucket.file(id);
    let file = "/tmp/" + id;
    let expirationDate = "never";

    if(req.body.expiration_time != 0) {
        expirationDate = new Date(new Date().getTime() + req.body.expiration_time * 60000).getTime();
    }

    let paste = {
        content: req.body.paste_content,
        expirationDate: expirationDate,
        id: id
    };

    gFile.exists((exists => {
        if(exists) {
            publishPaste(req, res);
        }else {
            fs.appendFile(file, JSON.stringify(paste), function (err) {
                if (err) {
                    console.log("An error occurred while creating/writing to paste file", err, file, content);
                    res.writeHead(500, {"Content-Type" : "text/plain"});
                    res.end("An unexpected server error occurred while saving your paste. Sorry")
                }else {
                    console.log("Paste " + id + " was created successfully. (at " + file + ")");
                    res.writeHead(301, {"Location" : "/p/" + id});
                    bucket.upload(file, () => {
                        res.end();
                    }).then(() => {
                        setTimeout(function(){
                            fs.unlink(file, function(err) {
                                console.log("Deleted " + file + err);
                            });
                        }, 500);
                    });
                }
            });
        }
    }));
};
/*
Inserts the text into the paste template
*/
app.get("/p/*", function(req, res) {
    const id = req.url.slice(3);
    const gFile = bucket.file(id);

    if(gFile.exists()) {
        let data = Buffer.alloc(0);

        gFile.createReadStream()
            .on('data', function(chunk) {
                data = Buffer.concat([data, chunk]);
            })
            .on('end', function() {
                const parsedPaste = JSON.parse(data);
                const pasteContent = parsedPaste.content;
                const expirationDate = new Date(parsedPaste.expirationDate);

                if(isNaN(expirationDate.getTime()) || expirationDate.getTime() > new Date().getTime()) {
                    fs.readFile("./template/paste.html", function (error, content) {
                        res.send(content.toString().replace("$id", id).replace("$paste_content", pasteContent.toString()))
                    });
                    return;
                }else {
                    gFile.delete(id, () => {
                        console.log("Deleted out of date paste " + id + " Expiration Date: " + expirationDate + " Curr Date: " + new Date());
                    });
                }
            });
    }else {
        res.writeHead(301, {"Location" : "/notfound"});
        res.end();
    }
});

/*
Generates a pseudo random ID with given length
 */
function generateID(length) {
    let result = "";
    const characters = `abcdefghijklmnopqrstuvwxyz123456789`;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

app.listen(port, function () {
    console.log('lazybin now listening for incoming requests on 0.0.0.0:' + port);
});
