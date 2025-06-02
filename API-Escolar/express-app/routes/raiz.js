import express from 'express';

const route = express.Router();


// Ruta raíz
route.get('/', (req, res) => {
    res.send('<h1>Servidor ejecutándose en http://localhost:3000<h1>');
});

export default route;