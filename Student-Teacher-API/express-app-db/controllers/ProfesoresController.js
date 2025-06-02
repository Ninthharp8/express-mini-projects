import Profesor from '../models/Profesor.js';
import { validateProfesor } from '../helpers/ProfesoresValidator.js';

class ProfesoresController {
    async create(req, res) {
        try {
            const profesor = req.body;

            // Validar si los datos del profesor son correctos
            if (!validateProfesor(profesor)) {
                return res.status(400).json({ error: 'Datos de profesor inválidos' });
            }

            // Verificar si el profesor ya existe (comprobando la matrícula)
            const profesorExistente = await Profesor.findOne({ where: { numeroEmpleado: profesor.numeroEmpleado } });
            if (profesorExistente) {
                return res.status(409).json({ error: 'El profesor con este número de empleado ya existe' });
            }

            // Crear el nuevo profesor
            const newProfesor = await Profesor.create(profesor);
            res.status(201).json(newProfesor);
        } catch (error) {
            console.error("Error en create:", error);
            res.status(500).json({ error: 'Error al crear el profesor' });
        }
    }

    async getAll(req, res) {
        try {
            const profesores = await Profesor.findAll();
            res.status(200).json(profesores);
        } catch (error) {
            console.error("Error en getAll:", error);
            res.status(500).json({ error: 'Error al obtener los profesores' });
        }
    }

    async getON(req, res) {
        try {
            const profesor = await Profesor.findByPk(req.params.id);
            if (!profesor) return res.status(404).json({ error: 'Profesor no encontrado' });
            res.status(200).json(profesor);
        } catch (error) {
            console.error("Error en getON:", error);
            res.status(500).json({ error: 'Error al obtener el profesor' });
        }
    }

    async update(req, res) {
        try {
            const profesor = await Profesor.findByPk(req.params.id);
            if (!profesor) return res.status(404).json({ error: 'Profesor no encontrado' });

            await profesor.update(req.body);
            res.status(200).json(profesor);
        } catch (error) {
            console.error("Error en update:", error);
            res.status(400).json({ error: 'Error al actualizar el profesor' });
        }
    }

    async delete(req, res) {
        try {
            const profesor = await Profesor.findByPk(req.params.id);
            if (!profesor) return res.status(404).json({ error: 'Profesor no encontrado' });

            await profesor.destroy();
            res.status(200).json({ message: 'Profesor eliminado' });
        } catch (error) {
            console.error("Error en delete:", error);
            res.status(500).json({ error: 'Error al eliminar el profesor' });
        }
    }
}

export default new ProfesoresController();
