const express = require("express");
const bodyParser = require('body-parser');
const helmet = require("helmet");
const fs = require("fs");
const crypto = require("crypto");

__dirname = __dirname + "/..";

const port = 3000;
const pasteDir = __dirname + "/pastes/";
const idSize = 6;

if(!fs.existsSync(pasteDir)) {
    fs.mkdirSync(pasteDir);
}

const pasteIDs = fs.readdirSync(pasteDir);
const app = express();

app.use(helmet());
app.use(bodyParser.json({
    limit: "600kb"
}));
app.use(express.static(__dirname + '/public'));
app.use("/", express.static(__dirname + "/public/"));
app.use("/p/*", express.static(__dirname + "/public/paste.html"));
app.use("/error", express.static(__dirname + "/public/error.html"));
app.use("/donate", express.static(__dirname + "/public/donate.html"));
app.use("/howitworks", express.static(__dirname + "/public/howitworks.html"));
app.use("/notfound", express.static(__dirname + "/public/notfound.html"));

/*
Handles post requests for saving pastes
*/
app.post("/paste_publish", publishPaste);
function publishPaste(req, res) {
    crypto.randomBytes(idSize, (err, randBuffer) => {
        if(err) {
            publishPaste(req, res);
        }

        const id = randBuffer.toString("base64").replace(/\//g,'_').replace(/\+/g,'-').replace(/=/g, "");
        const file = pasteDir + id;
        const expirationDate = req.body.expiration_time !== "0" ? new Date(new Date().getTime() + req.body.expiration_time * 60000).getTime() : "never";
        const paste = {
            content: req.body.content,
            expirationDate: expirationDate,
            highlighting: req.body.highlighting
        };

        if(pasteIDs.includes(id)) {
            publishPaste(req, res);
        }
        pasteIDs.push(id);
        fs.appendFile(file, JSON.stringify(paste), (err1) => {
            if (err) {
                console.error("An error occurred while creating paste file", err1, file, req.body);
                res.writeHead(500, {"Location" : "/error"});
            }else {
                res.writeHead(201, {"Location" : "/p/" + id});
            }
            res.end();
        });
    });
}

/*
Inserts the text into the paste template
*/
app.get("/fetch/*", (req, res) => {
    const id = req.url.slice(7);
    if(pasteIDs.includes(id)) {
        fs.readFile(pasteDir + id, (error, data) => {
            if(!error) {
                const parsedPaste = JSON.parse(data);
                const expirationDate = new Date(parsedPaste.expirationDate);
                delete parsedPaste.id;
                delete parsedPaste.expirationDate;

                if(isNaN(expirationDate.getTime()) || expirationDate.getTime() > new Date().getTime()) {
                    res.json(parsedPaste);
                }else {
                    fs.unlink(pasteDir + id, () => {});
                    res.writeHead(404, {"Location" : "/notfound"});
                }
            }else {
                res.writeHead(500, {"Location" : "/error"});
            }
            res.end();
        });
    }else {
        res.writeHead(404, {"Location" : "/notfound"});
        res.end();
    }
});

/*
Redirect all other urls to 404 page
 */
app.use("/*", express.static(__dirname + "/public/notfound.html"));

app.listen(port, function () {
    console.log('lazybin now listening for incoming requests on 0.0.0.0:' + port);
});