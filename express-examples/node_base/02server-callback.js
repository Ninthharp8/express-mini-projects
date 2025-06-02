//Definir el uso de la libreria HTTP
var http = require("http");

//Definimos constantes
const hostname = '127.0.0.1';
const port = 3001;
//-----------------------------------------------------------------------------
function onRequest(request, response) {
	response.statusCode = 200;
	response.setHeader('Content-Type', 'text/plain; charset=utf-8');	
	response.write("Probando server con un callback");
	response.end();
}
//-----------------------------------------------------------------------------
http.createServer(onRequest).listen(
	port, hostname, () => {
	console.log('El servidor se está ejecutando en http://' + hostname +':'+ port + '/');
	}
);