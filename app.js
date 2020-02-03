const http = require("http");
const fs = require("fs");
const render = require("./render")
const port = 3000;
const index = fs.readFileSync('./template/index.html');

const server = http.createServer(function(req, res) {
	var url = req.url;

	if(url == "/") {
		render.renderHomepage(res);
	}else if(url.startsWith("/static/")) {
		render.serveStaticFile(url.slice(8), res)
	}else if(url.startsWith("/raw/")) {
		var id = url.slice(5)
		fs.readFile("./pastes/" + id + ".paste", function(error, data) {
			if(error) {
				render.renderPasteMissingRaw(res)
			}else {
				render.renderPasteRaw(id, data, res)
			}
		})
	}else {
		var id = url.slice(1)
		fs.readFile("./pastes/" + id + ".paste", function(error, data) {
			if(error) {
				render.renderPasteMissing(res)
			}else {
				render.renderPaste(id, data, res)
			}
		})
	}
})

server.listen(port, function(error) {
	if(error) {
		console.log("Something went wrong", error)	
	}else {
		console.log("Server successfully started and now listening on " + port)
	}
})
