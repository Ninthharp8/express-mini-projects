export const validateProfesor = (profesor) => {
    
    if (
        typeof profesor.nombres !== 'string' || profesor.nombres.trim() === '' ||
        typeof profesor.apellidos !== 'string' || profesor.apellidos.trim() === '' ||
        typeof profesor.numeroEmpleado !== 'number' || profesor.numeroEmpleado <= 0 ||
        typeof profesor.horasClase !== 'number' || profesor.horasClase < 0
    ) {
        return false;
    }
    return true;
};

