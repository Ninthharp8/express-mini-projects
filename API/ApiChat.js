import express, { json } from 'express';
const app = express();
const PORT = 3000;


app.use(json()); // Para leer JSON en el body de las solicitudes

// Arrays en memoria para almacenar alumnos y profesores
let alumnos = [];
let profesores = [];

// contadores para el ID
let alumnosIDCounter = 1;
let profesoresIDCounter = 1;

// Funciones de validación
const validateAlumno = (alumno) => {
  if (
    typeof alumno.nombres !== 'string' || !alumno.nombres ||
    typeof alumno.apellidos !== 'string' || !alumno.apellidos ||
    typeof alumno.matricula !== 'string' || !alumno.matricula ||
    typeof alumno.promedio !== 'number' || alumno.promedio < 0 || alumno.promedio > 10
  ) {
    return false;
  }
  return true;
};

const validateProfesor = (profesor) => {
  if (
    typeof profesor.nombres !== 'string' || !profesor.nombres ||
    typeof profesor.apellidos !== 'string' || !profesor.apellidos ||
    typeof profesor.numeroEmpleado !== 'string' || !profesor.numeroEmpleado ||
    typeof profesor.horasClase !== 'number' || profesor.horasClase < 0
  ) {
    return false;
  }
  return true;
};

// Endpoints de Alumnos
app.get('/alumnos', (req, res) => {
  res.json(alumnos);
});

app.get('/alumnos/:id', (req, res) => {
  const alumno = alumnos.find((a) => a.id === parseInt(req.params.id));
  if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });
  res.json(alumno);
});

app.post('/alumnos', (req, res) => {
  const alumno = { id: alumnosIDCounter++, ...req.body };
  if (!validateAlumno(alumno)) {
    return res.status(400).json({ error: 'Datos de alumno inválidos' });
  }
  alumnos.push(alumno);
  res.status(201).json(alumno);
});

app.put('/alumnos/:id', (req, res) => {
  const index = alumnos.findIndex((a) => a.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Alumno no encontrado' });

  const updatedAlumno = { ...alumnos[index], ...req.body };
  if (!validateAlumno(updatedAlumno)) {
    return res.status(400).json({ error: 'Datos de alumno inválidos' });
  }
  alumnos[index] = updatedAlumno;
  res.json(updatedAlumno);
});

app.delete('/alumnos/:id', (req, res) => {
  const index = alumnos.findIndex((a) => a.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Alumno no encontrado' });

  alumnos.splice(index, 1);
  res.status(200).json({ message: 'Alumno eliminado' });
});

// Endpoints de Profesores
app.get('/profesores', (req, res) => {
  res.json(profesores);
});

app.get('/profesores/:id', (req, res) => {
  const profesor = profesores.find((p) => p.id === parseInt(req.params.id));
  if (!profesor) return res.status(404).json({ error: 'Profesor no encontrado' });
  res.json(profesor);
});

app.post('/profesores', (req, res) => {
  const profesor = { id: profesoresIDCounter++, ...req.body };
  if (!validateProfesor(profesor)) {
    return res.status(400).json({ error: 'Datos de profesor inválidos' });
  }
  profesores.push(profesor);
  res.status(201).json(profesor);
});

app.put('/profesores/:id', (req, res) => {
  const index = profesores.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Profesor no encontrado' });

  const updatedProfesor = { ...profesores[index], ...req.body };
  if (!validateProfesor(updatedProfesor)) {
    return res.status(400).json({ error: 'Datos de profesor inválidos' });
  }
  profesores[index] = updatedProfesor;
  res.json(updatedProfesor);
});

app.delete('/profesores/:id', (req, res) => {
  const index = profesores.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Profesor no encontrado' });

  profesores.splice(index, 1);
  res.status(200).json({ message: 'Profesor eliminado' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
