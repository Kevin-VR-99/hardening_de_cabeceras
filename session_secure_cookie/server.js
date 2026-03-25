// server.js dentro de session_secure_cookie

const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3003; // ahora en el puerto 3003

// Configuración de sesión con atributos seguros
app.use(session({
    secret: "clave_super_segura_y_unica", 
    resave: false,                        
    saveUninitialized: false,             
    cookie: {
        secure: false,                    // ⚠️ en local debe ser false (HTTPS requiere true)
        httpOnly: true,                   
        sameSite: "strict",               
        maxAge: 1000 * 60 * 5             
    }
}));

// Ruta principal (incrementa visitas y sirve index2.html)
app.get("/", (req, res) => {
    if (req.session.visitas) {
        req.session.visitas++;
    } else {
        req.session.visitas = 1;
    }
    res.sendFile(path.join(__dirname, "index2.html")); // <-- nombre actualizado
});

// Archivos estáticos
app.use("/static", express.static(__dirname));

// Ruta para mostrar datos de sesión
app.get("/session-info", (req, res) => {
    res.json({
        visitas: req.session.visitas || 0,
        mensaje: "Esta cookie está configurada con atributos de seguridad"
    });
});

// Arrancar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});