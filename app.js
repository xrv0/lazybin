const http = require("http");
const fs = require("fs");
const render = require("./render")
const port = 3000;

const server = http.createServer(function(req, res) {
	res.writeHead(200, {"Content-Type": "text/html"});

	if(req.url == "/") {
		//Serve homepage
	}else {
		var id = req.url.slice(1)
		fs.readFile("./pastes/" + id + ".paste", function(error, data) {
			if(error) {
				res.writeHead(404)
				res.write("This paste does not exist!")
				res.end()
			}else {
				render.renderPaste(id, data, res)
				res.end()
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
