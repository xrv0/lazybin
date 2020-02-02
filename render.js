const fs = require("fs");
const pasteMissing = fs.readFileSync("./template/pasteMissing.html")
const index = fs.readFileSync('./template/index.html');

function renderPaste(id, content, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    var fileContent = fs.readFileSync("./template/paste.html", "utf8").toString();
    fileContent = fileContent.replace("$content", content).replace("$id", id);
    res.write(fileContent, function(err) { res.end(); });
}

function renderPasteMissing(res) {
    res.writeHead(404, {"Content-Type": "text/html"});
    res.write(pasteMissing, function(err) { res.end(); });
}

function renderPasteMissingRaw(res) {
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.write("this paste does not exist!", function(err) { res.end(); });
}

function renderPasteRaw(id, content, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write(content, function(err) { res.end(); });
}

function renderHomepage(res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(index, function(err) { res.end(); });
}

module.exports.renderPaste = renderPaste;
module.exports.renderPasteMissing = renderPasteMissing;
module.exports.renderPasteMissingRaw = renderPasteMissingRaw;
module.exports.renderPasteRaw = renderPasteRaw;
module.exports.renderHomepage = renderHomepage;