var os = require('os');

console.log('Sistema operativo: '+os.platform());
console.log('Versión del OS: '+os.release());
console.log('Memoria total: '+os.totalmem()+' bytes');
console.log('Memoria libre: '+os.freemem()+' bytes');

var http = require('http');
var port = 3000;

var manejador = function(request, response){
  console.log('Petición de: ' + request.url);
  response.end('Bye');
}

var server = http.createServer(manejador);

server.listen(port, function(){
  console.log('Escuchando en: ' + port);
})