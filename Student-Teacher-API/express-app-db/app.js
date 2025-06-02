import dotenv from 'dotenv';
import express from 'express';
import alumnosRoutes from './routes/AlumnosRoutes.js'; // Renombrar para ser consistente
import profesoresRoutes from './routes/ProfesoresRoutes.js'; // Renombrar para ser consistente
import raiz from './routes/raiz.js';
import sequelize from './config/dbClient.js'; // Usar el nombre 'database.js' es más claro y estándar
import fileUpload from 'express-fileupload';

dotenv.config(); // Cargar variables de entorno desde .env

const app = express();
const PORT = process.env.PORT || 3000; // Usa la variable de entorno o el valor por defecto

// Middleware para analizar JSON
app.use(express.json());

// Middleware para manejo de archivos
app.use(fileUpload({
    useTempFiles: true, // Usar archivos temporales
    tempFileDir: '/tmp/', // Directorio temporal
}));

// Definición de rutas
app.use('/alumnos', alumnosRoutes);
app.use('/profesores', profesoresRoutes);
app.use('/', raiz);

// Captura de errores no manejados de forma global
app.use((err, req, res, next) => {
    console.error('Error no controlado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Sincronización de la base de datos y servidor
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos exitosa.');
        
        await sequelize.sync({ alter: true }); 
        console.log('Base de datos sincronizada correctamente.');

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        process.exit(1); // Finalizar la aplicación si la base de datos no se conecta
    }
})();
