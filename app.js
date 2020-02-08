const express = require("express");
const bodyParser = require('body-parser')
const fs = require("fs");

const port = 3000;
var app = express();

app.use(bodyParser.urlencoded({extended: true })); 
app.use(express.static('public'));

/*
Handles post requests for saving pastes
*/
app.post("/paste_publish", function(req, res) {
    content = req.body.paste_content;
    var file;
    var id;
    while(!file || fs.existsSync(file)) {
        id = generateUID(6);
        file = './pastes/' + id + ".paste"
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
    var id = req.url.slice(3);
    fs.readFile("./pastes/" + id + ".paste", function(error, content) {
        if(error) {
            console.log(error);
            res.send("this paste does not seem to exist")
        }else {
            res.end(content);
        }
    })
});

/*
Returns the raw text
*/
app.get("/raw/*", function(req, res) {
    var id = req.url.slice(5);
    fs.readFile("./pastes/" + id + ".paste", function(error, content) {
        if(error) {
            res.send("this paste does not exist" + error)
        }else {
            res.end(content);
        }
    })
});

/*
Generates u
*/
const UIDCharacters = 'abcdefghijklmnopqrstuvwxyz';
function generateUID(length) {
    var result = '';
    for (var i = 0; i < length; i++ ) {
       result += UIDCharacters.charAt(Math.floor(Math.random() * UIDCharacters.length));
    }
    return result;
}

app.listen(port, function () {
    console.log('lazybin now listening for incoming requests on 0.0.0.0:' + port);
});