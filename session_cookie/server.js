// server.js dentro de session_cookie

const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3002;

// Configuración de sesión
app.use(session({
    secret: "clave_super_segura",   // cámbiala por una cadena fuerte y aleatoria
    resave: true,                   // fuerza a guardar la sesión en cada request
    saveUninitialized: false,       // evita sesiones vacías
    cookie: {
        secure: false,              // en local debe ser false (true solo con HTTPS)
        maxAge: 1000 * 60 * 5       // cookie válida por 5 minutos
    }
}));

// Ruta principal (incrementa visitas y sirve index.html)
app.get("/", (req, res) => {
    if (req.session.visitas) {
        req.session.visitas++;
    } else {
        req.session.visitas = 1;
    }
    res.sendFile(path.join(__dirname,"index1.html"));
});

// Archivos estáticos (CSS, imágenes, JS)


// Ruta para mostrar datos de sesión
app.get("/session-info", (req, res) => {
    res.json({
        visitas: req.session.visitas || 0,
        mensaje: "Esta información se guarda en la cookie de sesión"
    });
});

// Arrancar servidor
app.listen(PORT, () => {
    console.log(`Servidor de session_cookie corriendo en http://localhost:${PORT}`);
});