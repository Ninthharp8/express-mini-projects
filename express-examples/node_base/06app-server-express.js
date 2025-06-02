//Instalen las siguientes dependencias:
// "body-parser"
// "express"
// "ip"
// "mysql"
// "util"
//no olviden leer la presentación...

//Require de las dependencias en variables/constantes
	var express = require('express');	
	var bodyParser = require('body-parser');
	var mysql = require('mysql');
	const ipHandler = require('ip');

	//creamos instancia de express
	var app = express();

	//ejemplo de carga de modulo desde un archivo externo
	const erouting = require('./route_export.js');
	
	//habilitamos el parseo de URL
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	//Variable para creacion del route
	const router = express.Router();

	//Default route
	app.get('/', function (req, res) {
		return res.send({ error: false, message: 'Ruta predeterminada: Prueba node.js & mysql' })
	});

	app.use('/route_externa', erouting);
	/*
	prueben: 
	http://localhost:3000/
	http://localhost:3000/route
	http://localhost:3000/route/about
	*/
	
	
	//Ejemplo Configuracion de conexion MySQL
 	var dbDesarrollo = mysql.createConnection({
    	host: '127.0.0.1',
    	port: 3306,
    	user: 'root',
    	password: '',
    	database: 'prueba'
 	});

 	//Conectar a BD
	 dbDesarrollo.connect();
	 
 	//---------------------------------------------------------------------------------------------
	 //Ejemplo de procesamiento de una pila de llamada de funciones
	 //Se llama a console.log, y posteriormente (next) al metodo de la linea 63
	app.get('/api/recurso1', function (req, res, next) {
		console.log('Procesando y reenviando a una función callback');
		res.locals.param1 = "Parametro 1";
		res.locals.param2 = "Parametro 2";

	  	next();
	},
	function (req, res) {
		//res.setHeader('Content-Type', 'application/json');
		console.log(res.locals.param1);
		console.log(res.locals.param2);

		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/html; charset=utf-8');	

		res.write('<html>');
		res.write('<body>');

		res.write('<h1>Param 1 =>'+ res.locals.param1 + '</h1>');
		res.write('<h1>Param 2 =>'+ res.locals.param2 + '</h1>');

		res.write('</body>');
		res.write('</html>');
		res.end();
       
	});//fin:get()
	/*
	prueben: 
	http://localhost:3000/api/recurso1
	*/
	
	
 	//---------------------------------------------------------------------------------------------
 	//Ejemplo de un listado de callbacks enviado como parametros
	var fnOne = function (req, res, next) {
		console.log('Invocando desde la funcion fnOne');
		next();
	}//fin:

	var fnTwo = function (req, res, next) {
		console.log('Invocando desde la funcion fnTwo');
	  	next();
	}//fin:

	var fnThree = function (req, res) {
		res.send('Fin ejecución en cascada');
	}//fin:

	app.get('/api/recurso2', [fnOne, fnTwo, fnThree]);
	/*
	prueben: 
	http://localhost:3000/api/recurso2
	no olviden abrir su termina y probar en el navegador
	*/
 	//---------------------------------------------------------------------------------------------
	 

	 //---------------------------------------------------------------------------------------------
 	//Ejemplo de Routing 	
	router.use(function (req, res, next) {
		
		var sIPCliente = ipHandler.address();
		var sSqlInsert = "INSERT INTO bitacora(cip, cevento, cobservacion, dtcreacion) VALUES(?, ?, ?, CURRENT_TIMESTAMP)";

		console.log('IP cliente router =>'+ sIPCliente);
		console.log('Time:', Date.now());
	
		var aDatosInsert = [sIPCliente, 'Acceso cliente desde web', 'Registro evento'];
  	
	  	try {
	  		//Invocar peticion a la base para guardar un valor, usamos transacciones para la persistencia de datos
		  	dbDesarrollo.beginTransaction(function(errTran) {
			    if (errTran) { 
						throw errTran; 
				}
			    dbDesarrollo.query(sSqlInsert, aDatosInsert,function (error, results, fields) {	   	
		   			if (error) {		   				
		   				dbDesarrollo.rollback(function() { throw error; });
		   			}
			   		dbDesarrollo.commit(function(){});
			   		next();	    		
		    	});//fin:dbDesarrollo.query
			});//fin:beginTran
	  	} catch(exc) {	  		
	  		console.log(exc);
	  		res.send("Ocurrio un error en el procesamiento de la información");
	  	}	  	
	});//fin:use
	//---------------------------------------------------------------------------------------------
	
	// invocar datos/:id
	router.use('/datos/:id', function(req, res, next) {
		console.log('Request URL:', req.originalUrl);
		next();
	}, 
	function (req, res, next) {
		console.log('Tipo Petición:', req.method);
		next();
	});
	//---------------------------------------------------------------------------------------------
	// /user/:id path
	router.get('/datos/:id', function (req, res, next) {	  
	  	
			//Caso 1 procesar y finalizar la peticion
			//res.send("Se obtuvo get");
				
			let iid = req.params.id;

			//Caso 2
			if (iid > 0){
				res.locals.id = iid;
				next();
			}else{
				res.send("El parametro [id] debe ser mayor a 0 => Param [id]:" + iid);
			}
		}
		, function (_req, _res, next) {	

			let _iid = _res.locals.id;
			console.log('Procesando el next callback');	  	
			console.log("Parametro recibido desde request previo: " + _iid);		

			_res.statusCode = 200;
			_res.setHeader('Content-Type', 'text/html; charset=utf-8');	

			_res.write('<html>');
			_res.write('<body>');

			_res.write('<h1>Param [id] =>'+ _iid + '</h1>');			
			_res.write('</body>');
			_res.write('</html>');

		  	_res.send();
		}
	);//fin:get
	/*
	prueben:
	http://localhost:3000/datos/2
	http://localhost:3000/datos/0
	para ejemplificar el uso de next()
	*/
	//---------------------------------------------------------------------------------------------
	
	
	//Post, aqui pueden usar postman o alguna variante para ejecutarlo
	router.post('/datos', 
		function (request, response, _next) {		
			var oBodyDatos = request.body;			
			console.log(oBodyDatos);
			_next();	
		},
		function(req, res){

			console.log('Invocando desde el callback despues de la peticion post');
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/html; charset=utf-8');				
			res.send("Finalizado");
		}
	);//fin:post
	
	//Montar el raiz de peticiones del proyecto
	app.use('/', router);
 	//---------------------------------------------------------------------------------------------
 	
	
 	//---------------------------------------------------------------------------------------------
 	//---------------------------------------------------------------------------------------------
 	//Iniciar el servidor
	app.listen(3000, function () {
	 	console.log('Node app is running on port 3000');
	});
	//---------------------------------------------------------------------------------------------
 	//module.exports = app;