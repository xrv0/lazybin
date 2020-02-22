const express = require("express");
const bodyParser = require('body-parser')
const fs = require("fs");
const {Storage} = require('@google-cloud/storage');

const port = 3000;
const idLength = 4;
const CLOUD_BUCKET = "bucket-name";

const app = express();
const storage = new Storage();
const bucket = storage.bucket(CLOUD_BUCKET);

app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static(__dirname + '/public'));

/*
Handles post requests for saving pastes
*/
app.post("/paste_publish", function(req, res) {
    const id = generateID(idLength);
    let content = req.body.paste_content;
    let file = "/tmp/" + id + ".paste";

    fs.access(file, fs.constants.F_OK, (err => {
        if(err) {
            fs.appendFile(file, content, function (err) {
                if (err) {
                    console.log("An error occurred while creating/writing to paste file", err, file, content);
                    res.writeHead(500, {"Content-Type" : "text/plain"});
                    res.end("An unexpected server error occurred while saving your paste.")
                }else {
                    console.log("Paste " + id + " was created successfully. (at " + file + ")");
                    res.writeHead(301, {"Location" : "/p/" + id});
                    bucket.upload(file);
                    res.end();
                    setTimeout(function(){
                        fs.unlink(file, function(err) {
                            console.log("Deleted " + file + err);
                        });
                    }, 1500);
                }
            });
        }else {
            console.log("An error occured while creating/writing to paste file (paste with same id already exists)", err, file, content);
            res.writeHead(500, {"Content-Type" : "text/plain"});
            res.end("An unexpected server error occurred while saving your paste. (id already exists)")
        }
    }))
});

/*
Inserts the text into the paste template
*/
app.get("/p/*", function(req, res) {
    const id = req.url.slice(3);
    const gFile = bucket.file(id + ".paste");

    if(gFile.exists()) {
        pasteContent = Buffer.alloc(0);
        gFile.createReadStream()
            .on('data', function(chunk) {
                pasteContent = Buffer.concat([pasteContent, chunk]);
            })
            .on('end', function() {
                fs.readFile("./template/paste.html", function (error, content) {
                    res.send(content.toString().replace("$id", id).replace("$paste_content", pasteContent));
                });});
    }else {
        res.send("paste could not be found!");
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
