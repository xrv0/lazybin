const express = require("express");
const bodyParser = require('body-parser')
const fs = require("fs");

const port = 3000;
const app = express();
const idLength = 4;
const pasteDir = "./pastes/";

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use("/notfound", express.static(__dirname + "/public/notfound.html"));

/*
Handles post requests for saving pastes
*/
app.post("/paste_publish", publishPaste);

function publishPaste(req, res) {
    let id = generateID(idLength);
    let file = pasteDir + id;
    let expirationDate = "never";

    if(req.body.expiration_time != 0) {
        expirationDate = new Date(new Date().getTime() + req.body.expiration_time * 60000).getTime();
    }

    let paste = {
        content: req.body.paste_content,
        expirationDate: expirationDate,
        id: id
    };

    fs.access(file, fs.constants.F_OK, (err => {
        if(err) {
            fs.appendFile(file, JSON.stringify(paste), function (err) {
                if (err) {
                    console.log("An error occurred while creating/writing to paste file", err, file, content);
                    res.writeHead(500, {"Content-Type" : "text/plain"});
                    res.write("An unexpected server error occurred while saving your paste.")
                }else {
                    console.log("Paste " + id + " was created successfully. (at " + file + ")");
                    res.writeHead(301, {"Location" : "/p/" + id});
                }
                res.end();
            });
        }else {
            publishPaste(req, res);
        }
    }));
}

/*
Inserts the text into the paste template
*/
app.get("/p/*", function(req, res) {
    const id = req.url.slice(3);

    fs.readFile(pasteDir + id, function(error, data) {
        if(!error) {
            const parsedPaste = JSON.parse(data);
            const pasteContent = parsedPaste.content;
            const expirationDate = new Date(parsedPaste.expirationDate);

            if(isNaN(expirationDate.getTime()) || expirationDate.getTime() > new Date().getTime()) {
                fs.readFile("./template/paste.html", function (error, content) {
                    res.send(content.toString().replace("$id", id).replace("$paste_content", pasteContent.toString()))
                });
                return;
            }else {
                fs.unlink(pasteDir + id, () => {
                    console.log("Deleted out of date paste " + id + " Expiration Date: " + expirationDate + " Curr Date: " + new Date());
                });
            }
        }
        res.writeHead(301, {"Location" : "/notfound"});
        res.end();
    })
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