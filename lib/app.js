const express = require("express");
const bodyParser = require('body-parser')
const fs = require("fs");
const crypto = require("../bin/crypto");

__dirname = __dirname + "/..";

const port = 3000;
const app = express();
const idLength = 4;
const pasteDir = __dirname + "/pastes/";
const pasteTemplate = fs.readFileSync("./template/paste.html").toString();
const pasteIDs = fs.readdirSync(pasteDir);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use("/notfound", express.static(__dirname + "/public/notfound.html"));
app.use("/error", express.static(__dirname + "/public/error.html"));

/*
Handles post requests for saving pastes
*/
app.post("/paste_publish", publishPaste);

function publishPaste(req, res) {
    let id = crypto.generateID(idLength);
    let file = pasteDir + id;
    let expirationDate = req.body.expiration_time != 0 ? new Date(new Date().getTime() + req.body.expiration_time * 60000).getTime() : "never";

    let paste = {
        content: req.body.paste_content,
        expirationDate: expirationDate,
        id: id,
        highlighting: (req.body.enable_highlighting === "on").toString()
    };

    if(pasteIDs.includes(id)) {
        publishPaste(req, res);
    }else {
        pasteIDs.push(id);
        fs.appendFile(file, JSON.stringify(paste), (err) => {
            if (err) {
                console.log("An error occurred while creating paste file", err, file, content);
                res.writeHead(301, {"Location" : "/error"});
            }else {
                console.log("Paste " + id + " was created successfully. (at " + file + ")");
                res.writeHead(301, {"Location" : "/p/" + id});
            }
            res.end();
        });
    }
}

/*
Inserts the text into the paste template
*/
app.get("/p/*", function(req, res) {
    const id = req.url.slice(3);

    fs.readFile(pasteDir + id, (error, data) => {
        if(!error) {
            const parsedPaste = JSON.parse(data);
            const pasteContent = parsedPaste.content;
            const expirationDate = new Date(parsedPaste.expirationDate);
            const pasteHighlighting = parsedPaste.highlighting;

            console.log(pasteHighlighting);


            if(isNaN(expirationDate.getTime()) || expirationDate.getTime() > new Date().getTime()) {
                res.end(pasteTemplate.replace("$id", id).replace("$paste_content", pasteHighlighting.toString() + "$" + pasteContent.toString()));
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

app.listen(port, function () {
    console.log('lazybin now listening for incoming requests on 0.0.0.0:' + port);
});