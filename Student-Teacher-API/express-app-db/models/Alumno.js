import { DataTypes } from 'sequelize';
import sequelize from '../config/dbClient.js';

const Alumno = sequelize.define('Alumno', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombres: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellidos: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    matricula: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    promedio: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false
    },
    correo:{
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    fotoPerfilUrl: {
        type: DataTypes.STRING,
        allowNull: true // Inicialmente puede estar vacío
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'alumnos',
    timestamps: false // No crea createdAt y updatedAt automáticamente
});

export default Alumno;
