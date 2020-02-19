const express = require("express");
const bodyParser = require('body-parser')
const fs = require("fs");

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({extended: true })); 
app.use(express.static(__dirname + '/public'));

/*
Handles post requests for saving pastes
*/
app.post("/paste_publish", function(req, res) {
    console.log(req.body);
    let content = req.body.paste_content.split("%")[1];
    let id = req.body.paste_content.split("%")[0];
    let file = "./pastes/" + id + ".paste";

    if(!file || fs.existsSync(file)) {
        console.log("An error occured while creating/writing to paste file (id already exists)", file, content);
        res.writeHead(500, {"Content-Type" : "text/plain"});
        res.end("An unexpected server error occured while saving your paste. Sorry ¯\_(ツ)_/¯ (id already exists)")
        return;
    }

    fs.appendFile(file, content, function (err) {
        if (err) {
            console.log("An error occured while creating/writing to paste file", err, file, content);
            res.writeHead(500, {"Content-Type" : "text/plain"});
            res.end("An unexpected server error occured while saving your paste. Sorry ¯\_(ツ)_/¯")
        }else {
            console.log("Paste " + id + " was created successfully. (at " + file + ")");
            res.writeHead(301, {"Location" : "/p/" + id});
            res.end();
        }
    });
});

/*
Inserts the text into the paste template
*/
app.get("/p/*", function(req, res) {
    const id = req.url.slice(3);
    fs.readFile("./pastes/" + id + ".paste", function(error, pasteContent) {
        if(error) {
            console.log(error);
            res.send("this paste does not seem to exist")
        }else {
            fs.readFile("./template/paste.html", function (error, content) {
                res.send(content.toString().replace("$id", id).replace("$content", pasteContent.toString()))
            })
        }
    })
});

/*
Returns the raw text
*/
app.get("/raw/*", function(req, res) {
    const id = req.url.slice(5);
    fs.readFile("./pastes/" + id + ".paste", function(error, content) {
        if(error) {
            res.send("this paste does not exist" + error)
        }else {
            res.end(content);
        }
    })
});

app.listen(port, function () {
    console.log('lazybin now listening for incoming requests on 0.0.0.0:' + port);
});