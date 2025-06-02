import express from 'express';
import ProfesoresEndpoint from '../controllers/ControllersProfes.js';

const route = express.Router();

route.get('/',ProfesoresEndpoint.getAll);
route.get('/:id',ProfesoresEndpoint.getON);
route.post('/',ProfesoresEndpoint.create);
route.put('/:id',ProfesoresEndpoint.update);
route.delete('/:id',ProfesoresEndpoint.delete);

route.delete('/', (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed' });
})

export default route;


