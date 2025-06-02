import { validateProfesor } from "../helpers/ProfesValidator.js";

let profesores = [];
let profesoresIDCounter = 1;

class ProfesoresEndpoint {
    constructor (){}

    // Endpoint método GET para obtener un profesor por ID
    async getON(req, res){
        try {
            const profesor = profesores.find((p) => p.id === parseInt(req.params.id));
            if (!profesor) return res.status(404).json({"error":"profesor no encontrado"});
            res.status(200).json(profesor);
        } catch (error) {
            res.status(500).send(error);
            console.error("Error en:", error);
        }
    }

    // Endpoint método GET para obtener todos los profesores
    async getAll(req, res){
        try {
            res.status(200).json(profesores); 
        } catch (error) {
            res.status(500).send(error);
            console.error("Error en:", error);
        }
    }

    // Endpoint método POST para crear un nuevo profesor
    async create(req, res){
        try {
            const profesor = { id: profesoresIDCounter++, ...req.body };
            if (!validateProfesor(profesor)) {
                return res.status(400).json({ error: 'Datos de profesor inválidos' });
            }
            profesores.push(profesor);
            res.status(201).json(profesor);
        } catch (error) {
            console.error("Error en:", error);
            res.status(500).send(error);
        }
    }

    // Endpoint método PUT para actualizar un profesor existente
    async update(req, res){
        try {
            const index = profesores.findIndex((p) => p.id === parseInt(req.params.id));
            if (index === -1) return res.status(404).json({ error: 'Profesor no encontrado' });

            const updatedProfesor = { ...profesores[index], ...req.body };
            if (!validateProfesor(updatedProfesor)) {
                return res.status(400).json({ error: 'Datos de profesor inválidos' });
            }
            profesores[index] = updatedProfesor;
            res.status(200).json(updatedProfesor);
        } catch (error) {
            console.error("Error en:", error);
            res.status(500).send(error);
        }
    }

    // Endpoint método DELETE para eliminar un profesor
    async delete(req, res){
        try {
            const index = profesores.findIndex((p) => p.id === parseInt(req.params.id));
            if (index === -1) return res.status(404).json({ error: 'Profesor no encontrado' });

            profesores.splice(index, 1);
            res.status(200).json({ message: 'Profesor eliminado' });
        } catch (error) {
            res.status(500).send(error);
            console.error("Error en:", error);
        }
    }
}

export default new ProfesoresEndpoint();
