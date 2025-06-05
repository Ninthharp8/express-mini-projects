# 🚀 Express Mini Projects

Este repositorio contiene mini proyectos desarrollados con **Node.js + Express**, cada uno acompañado de un pequeño proyecto Java con Maven usado para **probar su funcionalidad** mediante solicitudes HTTP.

Estos ejemplos están pensados para demostrar conceptos básicos de APIs REST, manejo de formularios y pruebas externas entre tecnologías.


##  Proyectos incluidos

### 1.  `Api-escolar`

**Descripción:**
- API REST con endpoints básicos como `/alumnos`, `/profesores`, etc.
- Maneja peticiones `GET` y `POST`.
- Respuestas en formato JSON.
- Una api para gestionar las consultas escolares.

**Tester Java:**
- Proyecto en Maven que realiza peticiones HTTP para verificar los endpoints.
- Uso de `HttpURLConnection` o librerías como Apache HttpClient.

## `Student-Teacher-API`

**Descripción:**
- API REST con endpoints básicos como `/alumnos`, `/profesores`, etc.
- Maneja peticiones `GET` y `POST`.
- Respuestas en formato JSON.
- Una API que extiende a Api escolar pero integrando funcinalidades de bases de datos en MySql para almacenar los datos de los alumnos y profesores.
- Bases de datos en mongoDB para el registro de asistencia.
- Se planea extender el proyecto para desplegarlo en AWS con lambdas, EC2, sistema de correspondencia, etc.

**Tester Java:**
- Proyecto en Maven que realiza peticiones HTTP para verificar los endpoints.
- Uso de `HttpURLConnection` o librerías como Apache HttpClient.

## `express-examples`

**Descripción:**
- Ejemplos basicos de la creacion de APIs con la libreria de NOdeJS Express
- Integran conexiones de bases de datos usando un ORM. 


## Requisitos
Node.js v18 o superior

Java JDK v17 o superior

Apache Maven 3.8+
