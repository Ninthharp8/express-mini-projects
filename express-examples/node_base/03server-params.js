var http 	= require('http');
var url 	= require('url');

const _port = 3002;
const _hostname = "localhost";

http.createServer(function (req, res) { 	
 	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	var qParams = url.parse(req.url, false).query;
	var sHtmlText = "";
  	for (const sKey in qParams) {
  		console.log(sKey, qParams[sKey])
  		sHtmlText += "<label>" + sKey + "</label>\n";
  		sHtmlText += "<input type='text' value='" + qParams[sKey] + "' readonly />\n<br/>";
		}
	
  	res.end(sHtmlText);

}).listen(_port, _hostname, () => {
	console.log('El servidor se está ejecutando en http://' + _hostname +':'+ _port + '/');
});
//listen(8090);
