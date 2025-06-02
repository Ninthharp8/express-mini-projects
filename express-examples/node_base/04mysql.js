var mysql = require('mysql');

var conexion = mysql.createConnection({
	host:'127.0.0.1',
	port:3306,
	user:'root',
	password:'',
	database:'prueba'
});

conexion.connect(function (error){
	//console.log(error);
	if (error){
		console.log('Problemas de conexion con mysql' + error);
	}else{
		console.log('coneccion success');
	}
});
