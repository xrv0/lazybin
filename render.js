const fs = require("fs");
const cachedStaticFiles = {}
const staticDir = "./static/"

function renderPaste(id, content, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    var fileContent = fs.readFileSync("./template/paste.html", "utf8");
    fileContent = fileContent.replace("$content", content).replace("$id", id);
    res.end(fileContent);
}

function renderPasteMissing(res) {
    serveStaticFile("pasteMissing.html", res)
}

function renderPasteMissingRaw(res) {
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.end("this paste does not exist!");
}

function renderPasteRaw(id, content, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end(content);
}

function renderHomepage(res) {
    serveStaticFile("index.html", res)
}

function serveStaticFile(path, res) {
    path = staticDir + path;
    console.log(path)
    if(cachedStaticFiles[path]) {
        content = cachedStaticFiles[path];
    }else if(fs.existsSync(path)){
        content = fs.readFileSync(path, "utf8");
        cachedStaticFiles[path] = content;
    }else {
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.end("Content could not be found!");
        return;
    }

    var contentType = "text/plain";
    if(path.endsWith(".js")) {
        contentType = "text/javascript";
    }else if(path.endsWith(".html")) {
        contentType = "text/html"
    }

    res.writeHead(200, {"Content-Type": contentType});
    res.end(content)
}

module.exports.renderPaste = renderPaste;
module.exports.renderPasteMissing = renderPasteMissing;
module.exports.renderPasteMissingRaw = renderPasteMissingRaw;
module.exports.renderPasteRaw = renderPasteRaw;
module.exports.renderHomepage = renderHomepage;
module.exports.serveStaticFile = serveStaticFile;