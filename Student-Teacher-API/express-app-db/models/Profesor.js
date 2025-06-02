import { DataTypes } from 'sequelize';
import sequelize from '../config/dbClient.js';

const Profesor = sequelize.define('Profesor', {
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
    numeroEmpleado: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    horasClase: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'profesores',
    timestamps: false // No crea createdAt y updatedAt automáticamente
});

export default Profesor;
