const express = require("express");
const bodyParser = require('body-parser')
const fs = require("fs");

var app = express();

app.use(bodyParser.urlencoded({extended: true })); 
app.use(express.static('public'));

app.post("/paste_publish", function(req, res) {
    content = req.body.paste_content;
    var id = generateUID(6);
    fs.appendFile('./pastes/' + id + ".paste", content, function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
        res.writeHead(302, {"Location" : "/p/" + id});
        res.end();
    });
});

app.get("/p/*", function(req, res) {
    var id = req.url.slice(3);
    fs.readFile("./pastes/" + id + ".paste", function(error, content) {
        if(error) {
            res.send("this paste does not exist" + error)
        }else {
            res.end(content);
        }
    })
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

function generateUID(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}