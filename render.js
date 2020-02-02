const fs = require("fs");

function renderPaste(id, content, res) {
    var fileContent = fs.readFileSync("./template/paste.html", "utf8").toString();
    fileContent = fileContent.replace("$content", content).replace("$id", id);
    res.write(fileContent);
}

module.exports.renderPaste = renderPaste;