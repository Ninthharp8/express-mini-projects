import Alumno from '../models/Alumno.js';
import { validateAlumno } from '../helpers/alumnosValidator.js';
import {  PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/s3.js';
import fs from 'fs';

class AlumnosController {
    async create(req, res) {
        try {
            const alumnoData = req.body;
            const fotoPerfil = req.files?.fotoPerfil; 
            let fotoPerfilUrl = null;

            // Validar datos del alumno
            if (!validateAlumno(alumnoData)) {
                return res.status(400).json({ error: 'Datos de alumno incompletos' });
            }

            // Verificar si ya existe un alumno con la misma matrícula o correo
            const [alumnoExistente, correoExistente] = await Promise.all([
                Alumno.findOne({ where: { matricula: alumnoData.matricula } }),
                Alumno.findOne({ where: { correo: alumnoData.correo } })
            ]);

            if (alumnoExistente || correoExistente) {
                return res.status(409).json({
                    error: alumnoExistente ? 'El alumno con esta matrícula ya existe' : 'El correo ya está en uso'
                });
            }

            // Subir la foto a S3 si existe
            if (fotoPerfil) {
                try {
                    console.log("Archivo recibido:");
                    const fileName = fotoPerfil.name;


                    const uploadParams = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: `fotos/${alumnoData.matricula}-${Date.now()}-${fileName}`,
                        Body: fs.createReadStream(fotoPerfil.tempFilePath),
                        ContentType: fotoPerfil.mimetype,
                    };

                    await s3Client.send(new PutObjectCommand(uploadParams));

                    fotoPerfilUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
                    console.log("Imagen subida con éxito:");

                    // Limpia el archivo temporal
                    fs.unlinkSync(fotoPerfil.tempFilePath);
                } catch (error) {
                    console.error("Error al subir la imagen a S3:", error);
                    return res.status(500).json({ error: "Error al subir la foto de perfil" });
                }
            }

            // Crear el alumno
            const newAlumno = await Alumno.create({
                ...alumnoData,
                fotoPerfilUrl,
            });

            res.status(201).json(newAlumno);
        } catch (error) {
            console.error("Error en create:", error);
            res.status(500).json({ error: 'Error al crear el alumno' });
        }
    }

    async getAll(req, res) {
        try {
            const alumnos = await Alumno.findAll();
            res.status(200).json(alumnos);
        } catch (error) {
            console.error("Error en getAll:", error);
            res.status(500).json({ error: 'Error al obtener los alumnos' });
        }
    }

    async getON(req, res) {
        try {
            const alumno = await Alumno.findByPk(req.params.id);
            if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });
            res.status(200).json(alumno);
        } catch (error) {
            console.error("Error en getON:", error);
            res.status(500).json({ error: 'Error al obtener el alumno' });
        }
    }

    async update(req, res) {
        try {
            const alumno = await Alumno.findByPk(req.params.id);
            if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });

            await alumno.update(req.body);
            res.status(200).json(alumno);
        } catch (error) {
            console.error("Error en update:", error);
            res.status(400).json({ error: 'Error al actualizar el alumno' });
        }
    }

    async delete(req, res) {
        try {
            const alumno = await Alumno.findByPk(req.params.id);
            if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });

            await alumno.destroy();
            res.status(200).json({ message: 'Alumno eliminado' });
        } catch (error) {
            console.error("Error en delete:", error);
            res.status(500).json({ error: 'Error al eliminar el alumno' });
        }
    }
    
}

export default new AlumnosController();
