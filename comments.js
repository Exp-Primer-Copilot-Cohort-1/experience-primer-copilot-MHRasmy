// Create web server

// Load the http module to create an http server.
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var comments = require('./comments.json');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    var path = url_parts.pathname;
    if (path == '/comments') {
        if (request.method == 'GET') {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(comments));
        }
        else if (request.method == 'POST') {
            var body = '';
            request.on('data', function (data) {
                body += data;
            });
            request.on('end', function () {
                var comment = qs.parse(body);
                comments.push(comment);
                response.writeHead(201, { "Content-Type": "application/json" });
                response.end(JSON.stringify(comment));
            });
        }
    }
    else {
        if (path == '/') {
            path = '/index.html';
        }
        fs.readFile(__dirname + path, function (error, data) {
            if (error) {
                response.writeHead(404, { "Content-Type": "text/plain" });
                response.end("Not found");
            } else {
                response.writeHead(200, { "Content-Type": "text/html" });
                response.end(data);
            }
        });
    }
});

// Listen on port 8000, IP defaults to
server.listen(8000);