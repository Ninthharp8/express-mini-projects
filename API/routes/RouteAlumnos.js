import express from 'express';
import AlumnosController  from '../controllers/ControllerAlumnos.js';

const route = express.Router();

route.get('/',AlumnosController.getAll);
route.get('/:id',AlumnosController.getON);
route.post('/',AlumnosController.create);
route.put('/:id',AlumnosController.update);
route.delete('/:id',AlumnosController.delete);

route.delete('/', (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed' });
})

export default route;