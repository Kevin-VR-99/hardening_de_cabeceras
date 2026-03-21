const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Servir archivos estáticos del proyecto
app.use(express.static(__dirname));

// ==============================
// RUTAS DE SAME SITE
// ==============================

// Caso vulnerable: SameSite=None
app.get("/samesite/vulnerable", (req, res) => {
    res.setHeader(
        "Set-Cookie",
        "sesionSameSite=vulnerable123; Path=/; SameSite=None; Secure"
    );

    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>SameSite Vulnerable</title>
            <style>
                body { font-family: Arial; background: #fff4f4; padding: 40px; }
                .box { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,.1); }
                h1 { color: #c62828; }
                code { background: #eee; padding: 3px 6px; border-radius: 5px; }
                a { display:inline-block; margin-top:15px; color:#1565c0; }
            </style>
        </head>
        <body>
            <div class="box">
                <h1>SameSite Vulnerable</h1>
                <p>Se configuró una cookie con <code>SameSite=None</code>.</p>
                <p>Esto permite que la cookie pueda viajar en contextos cross-site.</p>
                <p>Revisa DevTools → Application → Cookies o Network → Set-Cookie.</p>
                <a href="/same_site/index.html">Volver</a>
            </div>
        </body>
        </html>
    `);
});

// Caso protegido: SameSite=Strict
app.get("/samesite/protected", (req, res) => {
    res.setHeader(
        "Set-Cookie",
        "sesionSameSite=protegida123; Path=/; SameSite=Strict"
    );

    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>SameSite Protegido</title>
            <style>
                body { font-family: Arial; background: #f1fff3; padding: 40px; }
                .box { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,.1); }
                h1 { color: #2e7d32; }
                code { background: #eee; padding: 3px 6px; border-radius: 5px; }
                a { display:inline-block; margin-top:15px; color:#1565c0; }
            </style>
        </head>
        <body>
            <div class="box">
                <h1>SameSite Protegido</h1>
                <p>Se configuró una cookie con <code>SameSite=Strict</code>.</p>
                <p>Esto evita que la cookie se envíe fácilmente en solicitudes cross-site.</p>
                <p>Revisa DevTools → Application → Cookies o Network → Set-Cookie.</p>
                <a href="/same_site/index.html">Volver</a>
            </div>
        </body>
        </html>
    `);
});

// ==============================
// RUTAS DE HTTPONLY
// ==============================

// Vulnerable: cookie accesible por JS
app.get("/httponly/vulnerable", (req, res) => {
    res.setHeader(
        "Set-Cookie",
        "tokenVisible=abc123; Path=/"
    );

    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>HttpOnly Vulnerable</title>
            <style>
                body { font-family: Arial; background: #fff4f4; padding: 40px; }
                .box { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,.1); }
                h1 { color: #c62828; }
                .result { margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 8px; }
                a { display:inline-block; margin-top:15px; color:#1565c0; }
            </style>
        </head>
        <body>
            <div class="box">
                <h1>HttpOnly Vulnerable</h1>
                <p>Esta cookie fue creada <strong>sin</strong> el atributo HttpOnly.</p>
                <p>JavaScript puede leerla usando <code>document.cookie</code>.</p>
                <div class="result" id="resultado">Leyendo cookie...</div>
                <a href="/http_only/index.html">Volver</a>
            </div>

            <script>
                document.getElementById("resultado").innerText =
                    "Contenido de document.cookie: " + document.cookie;
            </script>
        </body>
        </html>
    `);
});

// Protegido: cookie NO accesible por JS
app.get("/httponly/protected", (req, res) => {
    res.setHeader(
        "Set-Cookie",
        "tokenProtegido=seguro456; Path=/; HttpOnly"
    );

    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>HttpOnly Protegido</title>
            <style>
                body { font-family: Arial; background: #f1fff3; padding: 40px; }
                .box { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,.1); }
                h1 { color: #2e7d32; }
                .result { margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 8px; }
                a { display:inline-block; margin-top:15px; color:#1565c0; }
            </style>
        </head>
        <body>
            <div class="box">
                <h1>HttpOnly Protegido</h1>
                <p>Esta cookie fue creada <strong>con</strong> el atributo HttpOnly.</p>
                <p>JavaScript ya no puede acceder directamente a esa cookie.</p>
                <div class="result" id="resultado">Leyendo cookie...</div>
                <a href="/http_only/index.html">Volver</a>
            </div>

            <script>
                document.getElementById("resultado").innerText =
                    "Contenido de document.cookie: " + document.cookie;
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});