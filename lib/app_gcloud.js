const express = require("express");
const bodyParser = require('body-parser');
const helmet = require("helmet");
const fs = require("fs");
const crypto = require("crypto");
const {Storage} = require('@google-cloud/storage');    

const helmet = require('helmet');

__dirname = __dirname + "/..";

const tmpPasteDir = "/tmp/";
const storage_bucket = "lazbin-pastes";
const pasteIDs = [];
const idSize = 6;
const port = 8080;

const storage = new Storage();
const bucket = storage.bucket(storage_bucket);
const app = express();

bucket.getFiles((err, files)=> {
    files.forEach(file => {
        pasteIDs.push(file.name);
    });
});

app.use(helmet());
app.use(bodyParser.json({
    limit: "650kb"
}));
app.use(express.static(__dirname + '/public'));
app.use("/", express.static(__dirname + "/public/index.html"));
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
        const file = tmpPasteDir + id;
        const expirationDate = req.body.expiration_time !== "0" ? new Date(new Date().getTime() + req.body.expiration_time * 60000).getTime() : "never";
        let paste = {
            content: req.body.content,
            expirationDate: expirationDate,
            highlighting: req.body.highlighting
        };

        if(pasteIDs.includes(id)) {
            publishPaste(req, res);
        }
        pasteIDs.push(id);
        fs.appendFile(file, JSON.stringify(paste), (err) => {
            if (err) {
                console.error("An error occurred while creating paste file", err, paste);
                res.writeHead(500, {"Location" : "/error"});
            }else {
                bucket.upload(file, ()=>{
                    fs.unlink(file, err => {
                        if(err) {
                            console.error("An error occurred while deleting a temp paste file", err);
                        }
                    });
                });
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
        const gFile = bucket.file(id);

        let readStream = gFile.createReadStream();
        let data = '';
        readStream.on('data', (d) => {
            data += d;
        }).on('end', ()=> {
            const parsedPaste = JSON.parse(data);
            const expirationDate = new Date(parsedPaste.expirationDate);
            delete parsedPaste.id;
            delete parsedPaste.expirationDate;

            if(isNaN(expirationDate.getTime()) || expirationDate.getTime() > new Date().getTime()) {
                res.json(parsedPaste);
            }else {
                res.writeHead(404, {"Location" : "/notfound"});
                gFile.delete().catch((reason => {
                    console.error("An error occurred while deleting an expired paste", id, reason);
                }));
            }
            res.end();
        });
    }else {
        res.writeHead(404, {"Location" : "/notfound"});
        res.end();
    }
});

/*
Redirect all other url to 404 page
 */
app.use("/*", express.static(__dirname + "/public/notfound.html"));

app.listen(port, function () {
    console.log('lazybin now listening for incoming requests on 0.0.0.0:' + port);
});