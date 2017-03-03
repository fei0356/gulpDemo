// Node 服务

var express = require('express');
var app = express();
var ip = require("ip");
var opn = require("opn");
var exec = require("child-exec");
var livereload = require('livereload');
var fs = require("fs");

var replaceIncludeHtml = function (content){
	var reg = /<!--#include\s+file="(.*?)"\s+-->/;
	var match = content.match(reg);
	var ret = content;

	if (!!match) {
		ret = content.replace(match[0], fs.readFileSync("./" + match[1], "utf-8"));
		ret = replaceIncludeHtml(ret);
	}

	return ret;
};

var livereloadScript = "<script>document.write('<script src=\"http:\/\/' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1\"></' + 'script>')</script>";


app.get("/", function(req, res) {
	//res.redirect("./index.html");

	var htmls = function() {
		var dir = fs.readdirSync("./views/","utf-8");

		return dir.filter(function(name) {
			return name.match(/\.html$/);
		});

	}();

	var content = htmls.map(function(html) {
		
		return "<li><a href='./" + html + "'>" + html + "</a></li>";
	}).join("");

	res.end("<!doctype html><ul>" + content + "</ul>");


});

app.get("/*.html", function(req, res) {
	var url = req.url || "/index.html";
	var file = url.split("?")[0];

	var content = fs.readFileSync("./views" + file, "utf-8");
	var output = replaceIncludeHtml(content);

	output = output.replace("</body>", livereloadScript + "</body>")


	res.end(output);

});

app.get("/api/*", function(req, res) {
	var url = req.url;
	var file = url.split("?")[0];
	var content = fs.readFileSync("." + file, "utf-8");
	res.writeHead(200,{
		'Content-Type': 'text/plain;charset=utf-8'
	});
	res.end(content);
});

app.post("/api/*", function(req, res) {
	var url = req.url;
	var file = url.split("?")[0];
	var content = fs.readFileSync("." + file, "utf-8");
	res.writeHead(200,{
		'Content-Type': 'text/plain;charset=utf-8'
	});
	res.end(content);
});



app.use(express.static(__dirname + '/'));

// 开发状态url跳转
//var linkMap = JSON.parse(fs.readFileSync("./linkmap.json", "utf-8"));
//for(var link in linkMap){
//	(function(link) {
//		app.get(link, function(req, res) {
//			var url = req.url;
//			var query = url.split("?")[1];
//			res.redirect("/" + linkMap[link] + (query ? "?" + query : ""));
//		});
//	})(link)
//}



//livereload
var server = livereload.createServer({});
var files = [
	'/js/',
	'/css/',
	'/views/'
];
server.watch(files.map(function (item){
	return __dirname + item;
}))

var myIp = ip.address();
var port = 9000;
var url = "http://" + myIp + ":" + port;


app.listen(port);

opn(url);

exec("compass watch");
exec("gulp watch");