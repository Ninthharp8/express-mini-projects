export const validateAlumno = (alumno) => {
    // Validar y normalizar el promedio
    alumno.promedio = isNaN(alumno.promedio) ? 1 : parseFloat(alumno.promedio);
    alumno.password = isNaN(alumno.password) ? 1 : parseFloat(alumno.password);

    // Validar los campos requeridos
    if (
        typeof alumno.nombres !== 'string' || !alumno.nombres.trim() || alumno.nombres.length > 100 ||
        typeof alumno.apellidos !== 'string' || !alumno.apellidos.trim() || alumno.apellidos.length > 100 ||
        typeof alumno.matricula !== 'string' || !alumno.matricula.trim() || alumno.matricula.length > 50 ||
        typeof alumno.promedio !== 'number' || alumno.promedio < 0 || alumno.promedio > 10 ||
        typeof alumno.password !== 'number' || !alumno.password.trim() 
    ) {
        return false;
    }

    // Validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!alumno.correo || !emailRegex.test(alumno.correo)) {
        return false;
    }

    // Validar URL de foto de perfil si está presente
    if (alumno.fotoPerfilUrl && typeof alumno.fotoPerfilUrl !== 'string') {
        return false;
    }

    return true;
};
