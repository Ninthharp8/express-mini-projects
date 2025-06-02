import express from 'express';
import ProfesoresController from '../controllers/ProfesoresController.js';

const route = express.Router();

route.get('/',ProfesoresController.getAll);
route.get('/:id',ProfesoresController.getON);
route.post('/',ProfesoresController.create);
route.put('/:id',ProfesoresController.update);
route.delete('/:id',ProfesoresController.delete);

route.delete('/', (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed' });
})

export default route;


