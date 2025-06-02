import express from 'express';
import routesAlumnos from './routes/RouteAlumnos.js';
import routesProfesores from './routes/RoutesProfes.js';
import raiz from './routes/raiz.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/alumnos',routesAlumnos);
app.use('/profesores',routesProfesores);
app.use('/',raiz);


try {
    app.listen(PORT,() =>{
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    })
} catch (error) {
    console.log(error);   
}
