import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Cargar las variables de entorno desde .env

const sequelize = new Sequelize(
    process.env.DB_NAME, // Nombre de la base de datos
    process.env.DB_USER, // Usuario
    process.env.DB_PASS, // Contraseña
    {
        host: process.env.DB_HOST, // URL de la base de datos
        dialect: process.env.DB_DIALECT, // Motor de base de datos
        logging: false, // Evitar mostrar las consultas SQL
    }
);

try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos de AWS exitosa.');
} catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
}

export default sequelize;
