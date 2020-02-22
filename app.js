const express = require("express");
const bodyParser = require('body-parser')
const fs = require("fs");

const port = 3000;
const app = express();
const idLength = 4;

app.use(bodyParser.urlencoded({extended: true })); 
app.use(express.static(__dirname + '/public'));

/*
Handles post requests for saving pastes
*/
app.post("/paste_publish", function(req, res) {
    const id = generateID(idLength);
    let content = req.body.paste_content;
    let file = "./pastes/" + id;

    fs.access(file, fs.constants.F_OK, (err => {
        if(err) {
            fs.appendFile(file, content, function (err) {
                if (err) {
                    console.log("An error occurred while creating/writing to paste file", err, file, content);
                    res.writeHead(500, {"Content-Type" : "text/plain"});
                    res.end("An unexpected server error occurred while saving your paste. Sorry ¯\_(ツ)_/¯")
                }else {
                    console.log("Paste " + id + " was created successfully. (at " + file + ")");
                    res.writeHead(301, {"Location" : "/p/" + id});
                    res.end();
                }
            });
        }else {
            console.log("An error occured while creating/writing to paste file (paste with same id already exists)", err, file, content);
            res.writeHead(500, {"Content-Type" : "text/plain"});
            res.end("An unexpected server error occurred while saving your paste. Sorry ¯\_(ツ)_/¯ (id already exists)")
        }
    }))
});

/*
Inserts the text into the paste template
*/
app.get("/p/*", function(req, res) {
    const id = req.url.slice(3);
    fs.readFile("./pastes/" + id, function(error, pasteContent) {
        if(error) {
            console.log(error);
            res.send("this paste does not seem to exist")
        }else {
            fs.readFile("./template/paste.html", function (error, content) {
                res.send(content.toString().replace("$id", id).replace("$paste_content", pasteContent.toString()))
            })
        }
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