import {validateAlumno} from "../helpers/alumnosValidator.js";

let alumnos = [];
let alumnosIDCounter = 1;

class AlumnosController {
    constructor () {}

    // Ruta para método POST
    async create(req, res) {
        try {
            // Crear un nuevo alumno con ID único
            const alumno = { id: alumnosIDCounter++, ...req.body };
            
            // Validar los datos del alumno
            if (!validateAlumno(alumno)) {
                return res.status(400).json({ error: 'Datos de alumno inválidos' });
            }
            
            // Agregar el alumno al arreglo de alumnos
            alumnos.push(alumno);
            
            // Devolver el alumno creado como respuesta
            res.status(201).json(alumno);
        } catch (error) {
            console.error("Error en create:", error);
            res.status(500).send(error);
        }
    }

    // Ruta para método PUT
    async update(req, res) {
        try {
            const index = alumnos.findIndex((a) => a.id === parseInt(req.params.id));
            if (index === -1) return res.status(404).json({ error: 'Alumno no encontrado' });
            
            const updatedAlumno = { ...alumnos[index], ...req.body };
            
            // Validar los datos del alumno actualizado
            if (!validateAlumno(updatedAlumno)) {
                return res.status(400).json({ error: 'Datos de alumno inválidos' });
            }
            
            // Actualizar el alumno en el arreglo
            alumnos[index] = updatedAlumno;
            
            // Devolver el alumno actualizado
            res.status(200).json(updatedAlumno);
        } catch (error) {
            res.status(500).send(error);
            console.log("Error en update");
        }
    }

    // Ruta para método DELETE
    async delete(req, res) {
        try {
            const index = alumnos.findIndex((a) => a.id === parseInt(req.params.id));
            if (index === -1) return res.status(404).json({ error: 'Alumno no encontrado' });

            // Eliminar al alumno
            alumnos.splice(index, 1);
            res.status(200).json({ message: 'Alumno eliminado' });
        } catch (error) {
            res.status(500).send(error);
            console.log("Error en delete");
        }
    }

    // Ruta para GET con ID
    async getON(req, res) {
        try {
            const alumno = alumnos.find((a) => a.id === parseInt(req.params.id));
            if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });

            // Devolver el alumno encontrado
            res.status(200).json(alumno);
        } catch (error) {
            res.status(500).send(error);
            console.log("Error en getON");
        }
    }

    // Ruta para GET general
    async getAll(req, res) {
        try {
            // Devolver la lista completa de alumnos
            const alumnos = await alumnos.find();
            res.status(200).json(alumnos);
        } catch (error) {
            res.status(500).send(error);
            console.log("Error en getAll");
        }
    }
}

export default new AlumnosController();
