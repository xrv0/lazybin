const express = require("express");
const bodyParser = require('body-parser')
const fs = require("fs");
const crypto = require("../bin/crypto");
const {Storage} = require('@google-cloud/storage');
const sanitizer = require('sanitizer');

__dirname = __dirname + "/..";

const idLength = 4;
const tmpPasteDir = "/tmp/";
const pasteTemplate = fs.readFileSync("./template/paste.html").toString();
const storage_bucket = "lazbin-pastes";
const pasteIDs = [];

const port = 8080;
const app = express();
const storage = new Storage();
const bucket = storage.bucket(storage_bucket);

bucket.getFiles((err, files)=> {
    files.forEach(file => {
        pasteIDs.push(file.name);
    });
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use("/notfound", express.static(__dirname + "/public/notfound.html"));
app.use("/error", express.static(__dirname + "/public/error.html"));
app.use("/donate", express.static(__dirname + "/public/donate.html"));


/*
Handles post requests for saving pastes
*/
app.post("/paste_publish", publishPaste);

function publishPaste(req, res) {
    let id = crypto.generateID(idLength);
    let file = tmpPasteDir + id;
    let expirationDate = req.body.expiration_time != 0 ? new Date(new Date().getTime() + req.body.expiration_time * 60000).getTime() : "never";

    let paste = {
        content: sanitizer.escape(req.body.paste_content),
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
                console.log("An error occurred while creating paste file", err, paste);
                res.writeHead(301, {"Location" : "/error"});
            }else {
                res.writeHead(301, {"Location" : "/p/" + id});
                bucket.upload(file, ()=>{
                    res.end();
                    fs.unlink(file);
                });
            }
        });
    }
}

/*
Inserts the text into the paste template
*/
app.get("/p/*", (req, res) => {
    const id = req.url.slice(3);
    const gFile = bucket.file(id);

    let readStream = gFile.createReadStream();
    let data = '';
    readStream.on('data', (d) => {
        data += d;
    }).on('end', ()=> {
        const parsedPaste = JSON.parse(data);
        const pasteContent = parsedPaste.content;
        const expirationDate = new Date(parsedPaste.expirationDate);
        const pasteHighlighting = parsedPaste.highlighting;

        if(isNaN(expirationDate.getTime()) || expirationDate.getTime() > new Date().getTime()) {
            res.end(pasteTemplate.replace("$id", id).replace("$paste_content", pasteHighlighting.toString() + "$" + pasteContent.toString()));
            return;
        }else {
            gFile.delete().then(()=> {
                console.log("Deleted out of date paste " + id + " Expiration Date: " + expirationDate + " Curr Date: " + new Date());
            })
        }
        res.writeHead(301, {"Location" : "/notfound"});
        res.end();
    });
});

app.get("*", (req, res) => {
    res.writeHead(301, {"Location" : "/notfound"});
    res.end();
});

app.listen(port, function () {
    console.log('lazybin now listening for incoming requests on 0.0.0.0:' + port);
});