//Definir el uso de la libreria HTTP
const http = require('http');

//Definimos constantes
const hostname = '127.0.0.1';
const port = 3000;

const manejador = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.end('¡Ejecutando servidor web en nodejs!\n');
});

manejador.listen(port, hostname, () => {
	console.log('Escuchando en el servidor: ' + hostname +':'+ port + '/');
});