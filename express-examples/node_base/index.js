//Definir el uso de la libreria HTTP
const http = require('http');

//Definimos constantes
const hostname = '127.0.0.1';
const port = 3000;

const manejador = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Ejecutando servidor web en nodejs\n');
});

manejador.listen(port, hostname, () => {
	console.log('Escuchando en el servidor: ' + hostname +':'+ port + '/');
});

//CallBack
const port2 = 3001;
//-----------------------------------------------------------------------------
function onRequest(request, response) {
	response.statusCode = 200;
	response.setHeader('Content-Type', 'text/plain');	
	response.write("Probando server con un callback");
	response.end();
}
//-----------------------------------------------------------------------------
http.createServer(onRequest).listen(
	port2, hostname, () => {
	console.log('El servidor se está ejecutando en http://' + hostname +':'+ port2 + '/');
	}
);