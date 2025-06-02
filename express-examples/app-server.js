const express    = require('express');
const bodyParser = require('body-parser');
const jwt        = require('jsonwebtoken');
const mysql      = require('mysql');
const crypto     = require('crypto');
const config     = require('./configs/config');

const port = 3000;

const app = express();

const protectedRoute = express.Router(); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit:'10mb'}));

app.set('secret_key', config.CLAVE_SECRETA);
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// connection configurations
let dbConn = mysql.createConnection({
    host: '127.0.0.1',
    port:3306,
    user: 'root',
    password: '',
    database: 'prueba'
});

// connect to database
dbConn.connect(); 

//-----------------------------------------------------------------------------
//Home
app.get('/', (req, res) => res.send('Running node!'));

//Insertamos un usuario en la bd
//INSERT INTO usuario(cusuario, cpassword, dtfechacreacion, lactivo) VALUES('david', SHA1('david2022'), CURRENT_TIMESTAMP, 1);

//-----------------------------------------------------------------------------
//Generacion del Token JWT
app.post('/seguridad/tokenjwt', (req, res) => {
    
    let username = req.body.usuario;
    let password = req.body.password;

    let sQuerySelect = "select iid, cusuario, cpassword from usuario where lactivo = 1"; 
    let Sha1Pass = "";
    let sQueryInsert  = 'INSERT INTO tokens_jwt(ctoken, iid_usuario, cusuario, dtfecha_expira, lactivo) ';
        sQueryInsert += " VALUES(?, ?, ?, ?, ? )";

    let tokenData = { }
    let dtExpireToken = 0;

    res.setHeader('Content-Type', 'application/json');

    if((username != null && username != undefined) && (password != null && password != undefined)){
        sQuerySelect += " and cusuario = '" + username + "'";
        dbConn.query(
            sQuerySelect, 
            function (error, results, fields) {
                if(error){                    
                    throw error;
                }//fin:if
                else{
                    Sha1Pass = crypto.createHash('sha1').update(password).digest('hex');                    
                    if(results.length > 0){                                   
                        if(Sha1Pass == results[0].cpassword){

                            tokenData = {
                                usuario: results[0].cusuario       
                            }
                        
                            let dtExpire = new Date();
                            dtExpire.setSeconds(dtExpire.getSeconds() + config.EXPIRE_TOKEN);
                            //console.log(dtExpire);
                            dtExpireToken = config.EXPIRE_TOKEN;                     
                            let token = jwt.sign(tokenData, config.CLAVE_SECRETA , 
                                {                                    
                                    expiresIn:dtExpireToken
                                }
                            );

                            let aDataInsert = 
                                [token,results[0].iid, results[0].cusuario, dtExpire, 1];

                            dbConn.query(sQueryInsert, aDataInsert, (err, results, fields) => {
                                if (err) {
                                    //return console.error(err.message);
                                    throw err;
                                }                                
                                console.log('Insert Id:' + results.insertId);
                            });
                             
                            //dbConn.end();
                     
                            return res.status(201).send({
                                lError: false,
                                cError: "",
                                cToken: token
                            });                        
                        }//fin:if
                        else{
                            return res.status(200).send(
                                {           
                                    lError: true,
                                    cError: "El password es incorrecto",
                                    cToken: ""
                                }
                            ); 
                        }//fin:else  
                    }//fin:if
                    else{
                        return res.status(200).send(
                            {           
                                lError: true,
                                cError: "El usuario no se encuentra registrado.",
                                cToken: ""
                            }
                        );            
                    }//fin:else                                
                }//fin:else
            }
        );
    }//fin:else
    else{
        return res.status(400).send({           
            lError: true,
            cError: "Los parámetros [usuario] y [password] son obligatorios",
            cToken: ""
        }); 
    }//fin:else
});//post()


//-----------------------------------------------------------------------------
app.get('/seguridad/tokenjwt', (req, res) => {
    //let sToken = req.headers['authorization'];
    let sToken = req.headers['token'];

    res.setHeader('Content-Type', 'application/json');

    if(!sToken){
        return res.status(401).send(
            {
                lError: true,
                cError: "El token no fue enviado en la cabecera de la petición."
            }
        );
    };

    sToken = sToken.replace('Bearer ', '');

    try {
        jwt.verify(sToken, config.CLAVE_SECRETA, function(err, user) {
            if (err) {
                return res.status(401).send(
                    { 
                        lError: true,
                        error: 'El token ha caducado.'
                    }
                );
            }//fin:else 
            else {
                return res.status(200).send(
                    { 
                        lError: false,
                        cError: 'El token aun esta vigente.'
                    }
                );
            }//fin:else
        });
    }
    catch (ex) { 
        console.log(ex.message); 
    }   
});//fin:get()


//-----------------------------------------------------------------------------
//Ejemplo de creacion de middleware para procesar la peticiones antes de invocar los servicios
protectedRoute.use((req, res, next) => {    
    const sToken = req.headers['token'];

    if (sToken) {
        jwt.verify(sToken, app.get('secret_key'), (err, decoded) => {      
            if (err) {
                return res.json(
                    { 
                        lError: true,
                        cError: "El token es invalido." 
                    }
                );    
            } 
            else {
                req.decoded = decoded;    
                next();
            }
        });
    } //fin:if
    else {
        res.status(400).send(
            {
                lError: true,
                cError: "El token no fue enviado en la cabecera de la petición."
            }
        );
    }//fin:else
});// fin:else


//-----------------------------------------------------------------------------
//Accediendo a un recurso previa validacion del token
// app.get('/api/codigospostales', protectedRoute, (req, res) => {

//     let stQuery  = "select loc.iidmunicipio,";
//         stQuery += " (select cnombre from municipio where iidmunicipio = loc.iidmunicipio) as municipio, loc.icodigopostal ";
//         stQuery += " from localidades loc where loc.iidlocalidad > 0 and loc.lactivo = 1";
//         stQuery += " group by loc.iidmunicipio, loc.icodigopostal order by loc.icodigopostal asc";

//     dbDesarrollo.query(
//         stQuery, 
//         function (error, results, fields) {
//             if (error) throw error;    
//             res.setHeader('Content-Type', 'application/json');
//             return res.status(200).send(
//                 { 
//                     lError: false, 
//                     cError:"",
//                     aCodigos: results
//                 }                   
//             );              
//         }
//     );
// });
//-----------------------------------------------------------------------------


app.get('/api/datos', isAuthorized, (req, res) => {
    
    return res.json(
        { 
            lError: false, 
            cError:"", 
            cMensaje:"Sucess"
        }
    );
});//fin:get


//-----------------------------------------------------------------------------
function isAuthorized(req, res, next) {

    console.log(req.headers['token']);

    if (req.headers['token'] !== undefined && req.headers['token'] !== null) {
        
        let sToken = req.headers['token'];
        
        //let privateKey = fs.readFileSync('./private.pem', 'utf8');        
        jwt.verify(sToken, app.get("secret_key"), { algorithm: "HS256" }, (err, user) => {
            if (err) {                  
                return res.status(401).json(
                    {                        
                        lError: true, 
                        cError:"El token de seguridad ya expiró."
                    }
                );
            }//fin:if (err)     
            return next();
        })
    }//fin:if (typeof req.headers['token'] !== undefined && req.headers['token'] == null) 
    else {        
        //res.status(500).json({ error: "Not Authorized" });
        return res.status(400).json(
            {
                lError: true,
                cError: "El token no fue enviado en la cabecera de la petición."
            }
        );
    }//fin:else
}//fin:isAuthorized


//-----------------------------------------------------------------------------
/*
app.get('/api/demo', (req, res) => {
    
    getInformacionUsuario('david','').then(function(oData) {
        console.log(oData);
    }).catch((err) => 
        setImmediate(() => { 
            throw err; 
        })
    );
    
    return res.send();

});//fin:get
*/


app.post('/api/demo', (req, res) => {

    let username = req.body.usuario;
    let password = req.body.password;

    if((username != null && username != undefined) 
        && (password != null && password != undefined)
    ){
        getInformacionUsuario(username).then(function(oData) {
            console.log(oData);

            return res.json(oData);

        }).catch((err) => 
            setImmediate(() => { 
                throw err; 
            })
        );    
    }//fin:if
    else{
        return res.status(400).send({           
            lError: true,
            cError: "Los parámetros [usuario] y [password] son obligatorios",
            cToken: ""
        });
    }//fin:else    
});//fin:get


//-----------------------------------------------------------------------------
function getInformacionUsuario(_usuario){

    return new Promise(function(resolve, reject) {

        let oReturn = { "lError": "false", "cError": "", "iid" : 0, "cpassword": ""}
        let sQuerySelect = "select iid, cusuario, cpassword from usuario where lactivo = 1 and cusuario = ?"; 
        let Sha1Pass = "";

        let query_params = [_usuario];

        dbConn.query(sQuerySelect, query_params, function (err, rows, fields) {    
            if (err) {
                return reject(err);
            }//fin:if
            if(rows.length > 0){
                oReturn.lError = false;
                oReturn.iid = rows[0].iid;
                oReturn.cpassword = rows[0].cpassword;
            }//fin:if
            else{
                oReturn.lError = true;
                oReturn.cError = "No fue posible obtener la información del usuario";
            }//fin:else
            //resolve(rows);
            resolve(oReturn);
        });
    });
}//fin:getInformacionUsuario



//Montar raiz de peticiones del proyecto
//app.use('/', protectedRoute);

//Iniciar el servidor
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});