const express = require('express');
const app = express();
const port = 3000;

app.use((req, res, next) => {
    // HARDENING: Siempre HTTPS (HSTS)
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    // Configuración de idioma para evitar símbolos raros
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    next();
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Always HTTPS - Hardening</title>
            <style>
                body { margin: 0; font-family: 'Segoe UI', sans-serif; background: #0a0f1c; color: #d1d5db; display: flex; align-items: center; justify-content: center; height: 100vh; }
                .card { background: #111827; padding: 40px; border-radius: 12px; border: 1px solid #22c55e; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                h1 { color: #22c55e; margin-bottom: 10px; }
                .status { font-family: monospace; background: #020617; padding: 10px; border-radius: 6px; color: #9ca3af; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🛡️ Hardening: Always HTTPS</h1>
                <p>La política <b>HSTS</b> ha sido inyectada correctamente.</p>
                <div class="status">Protocolo detectado: <span id="proto"></span></div>
            </div>
            <script>
                document.getElementById('proto').textContent = window.location.protocol.toUpperCase();
            </script>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`✅ Servidor Always HTTPS activo en puerto ${port}`);
});