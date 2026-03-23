const express = require("express");

const app = express();
const attackerApp = express();

const PORT = 3000;
const ATTACKER_PORT = 4000;

// Permitir peticiones desde el atacante
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:4000");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// Archivos estáticos del sitio principal
app.use(express.static(__dirname));

// HOME
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Endpoint para ver qué cookies recibió el servidor
app.get("/check-cookies", (req, res) => {
    const cookies = req.headers.cookie || "No se recibió ninguna cookie.";
    res.json({
        origin: "sitio-principal",
        cookiesReceived: cookies
    });
});

//
// ==============================
// HTTPONLY VULNERABLE
// ==============================
//
app.get("/httponly/vulnerable", (req, res) => {
    res.setHeader(
        "Set-Cookie",
        "sesionHttpOnly=vulnerable123; Path=/"
    );

    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>HttpOnly Vulnerable</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #fff5f5, #ffe3e3);
                    margin: 0;
                    padding: 0;
                    color: #333;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .card {
                    width: 90%;
                    max-width: 980px;
                    background: #fff;
                    border-radius: 18px;
                    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15);
                    overflow: hidden;
                }
                .header {
                    background: #c62828;
                    color: #fff;
                    padding: 1.5rem 2rem;
                }
                .header h1 {
                    margin: 0;
                    font-size: 2rem;
                }
                .content {
                    padding: 2rem;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .panel {
                    background: #fafafa;
                    border-radius: 14px;
                    padding: 1.5rem;
                    border: 1px solid #eee;
                }
                .panel h2 {
                    margin-top: 0;
                    color: #c62828;
                }
                .tag {
                    display: inline-block;
                    background: #fdecea;
                    color: #b71c1c;
                    padding: 0.4rem 0.8rem;
                    border-radius: 999px;
                    font-weight: bold;
                    margin: 0.3rem 0.3rem 0 0;
                }
                .btn {
                    display: inline-block;
                    margin-top: 1rem;
                    margin-right: 0.7rem;
                    padding: 0.8rem 1.2rem;
                    border-radius: 10px;
                    text-decoration: none;
                    font-weight: bold;
                    border: none;
                    cursor: pointer;
                }
                .btn-primary {
                    background: #c62828;
                    color: #fff;
                }
                .btn-primary:hover {
                    background: #a91f1f;
                }
                .btn-secondary {
                    background: #ff9800;
                    color: #fff;
                }
                .btn-secondary:hover {
                    background: #e68900;
                }
                .result {
                    margin-top: 1rem;
                    background: #fff3cd;
                    color: #856404;
                    border: 1px solid #ffe08a;
                    border-radius: 10px;
                    padding: 1rem;
                    min-height: 70px;
                    white-space: pre-wrap;
                    word-break: break-word;
                }
                .impact {
                    background: #fdecea;
                    border-left: 6px solid #c62828;
                    padding: 1rem;
                    border-radius: 10px;
                    margin-top: 1rem;
                }
                code {
                    background: #f1f3f5;
                    padding: 2px 6px;
                    border-radius: 6px;
                }
                @media (max-width: 800px) {
                    .content {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="header">
                    <h1>HttpOnly Vulnerable</h1>
                    <p>Cookie sin atributo <strong>HttpOnly</strong>.</p>
                </div>

                <div class="content">
                    <div class="panel">
                        <h2>Configuración aplicada</h2>
                        <div class="tag">Sin HttpOnly</div>
                        <div class="tag">JavaScript sí puede leerla</div>

                        <p>
                            Esta cookie fue creada sin el atributo <strong>HttpOnly</strong>,
                            así que JavaScript sí puede acceder a ella usando <code>document.cookie</code>.
                        </p>

                        <p><strong>Header enviado:</strong></p>
                        <p><code>Set-Cookie: sesionHttpOnly=vulnerable123; Path=/</code></p>

                        <div class="impact">
                            <strong>Impacto:</strong> si hubiera un XSS, un script malicioso podría leer la cookie.
                        </div>
                    </div>

                    <div class="panel">
                        <h2>Prueba real</h2>
                        <p>Pulsa el botón para leer <code>document.cookie</code> desde JavaScript:</p>

                        <button class="btn btn-primary" onclick="leerCookie()">Leer document.cookie</button>
                        <a class="btn btn-secondary" href="/http_only/index.html">Volver</a>

                        <div class="result" id="resultado">Aquí aparecerá el valor de document.cookie...</div>
                    </div>
                </div>
            </div>

            <script>
                function leerCookie() {
                    document.getElementById("resultado").innerText =
                        "Resultado de document.cookie:\\n\\n" + document.cookie;
                }
            </script>
        </body>
        </html>
    `);
});

//
// ==============================
// HTTPONLY PROTEGIDO
// ==============================
//
app.get("/httponly/protected", (req, res) => {
    res.setHeader(
        "Set-Cookie",
        "sesionHttpOnly=protegida123; Path=/; HttpOnly"
    );

    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>HttpOnly Protegido</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #f1fff3, #dff7e5);
                    margin: 0;
                    padding: 0;
                    color: #333;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .card {
                    width: 90%;
                    max-width: 980px;
                    background: #fff;
                    border-radius: 18px;
                    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15);
                    overflow: hidden;
                }
                .header {
                    background: #2e7d32;
                    color: #fff;
                    padding: 1.5rem 2rem;
                }
                .header h1 {
                    margin: 0;
                    font-size: 2rem;
                }
                .content {
                    padding: 2rem;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .panel {
                    background: #fafafa;
                    border-radius: 14px;
                    padding: 1.5rem;
                    border: 1px solid #eee;
                }
                .panel h2 {
                    margin-top: 0;
                    color: #2e7d32;
                }
                .tag {
                    display: inline-block;
                    background: #e8f5e9;
                    color: #1b5e20;
                    padding: 0.4rem 0.8rem;
                    border-radius: 999px;
                    font-weight: bold;
                    margin: 0.3rem 0.3rem 0 0;
                }
                .btn {
                    display: inline-block;
                    margin-top: 1rem;
                    margin-right: 0.7rem;
                    padding: 0.8rem 1.2rem;
                    border-radius: 10px;
                    text-decoration: none;
                    font-weight: bold;
                    border: none;
                    cursor: pointer;
                }
                .btn-primary {
                    background: #2e7d32;
                    color: #fff;
                }
                .btn-primary:hover {
                    background: #256628;
                }
                .btn-secondary {
                    background: #ff9800;
                    color: #fff;
                }
                .btn-secondary:hover {
                    background: #e68900;
                }
                .result {
                    margin-top: 1rem;
                    background: #e8f5e9;
                    color: #1b5e20;
                    border: 1px solid #b7e1bd;
                    border-radius: 10px;
                    padding: 1rem;
                    min-height: 70px;
                    white-space: pre-wrap;
                    word-break: break-word;
                }
                .impact {
                    background: #e8f5e9;
                    border-left: 6px solid #2e7d32;
                    padding: 1rem;
                    border-radius: 10px;
                    margin-top: 1rem;
                }
                code {
                    background: #f1f3f5;
                    padding: 2px 6px;
                    border-radius: 6px;
                }
                @media (max-width: 800px) {
                    .content {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="header">
                    <h1>HttpOnly Protegido</h1>
                    <p>Cookie configurada con <strong>HttpOnly</strong>.</p>
                </div>

                <div class="content">
                    <div class="panel">
                        <h2>Configuración aplicada</h2>
                        <div class="tag">HttpOnly</div>
                        <div class="tag">JavaScript no puede leerla</div>

                        <p>
                            Esta cookie fue creada con <strong>HttpOnly</strong>,
                            por lo que JavaScript no podrá verla con <code>document.cookie</code>.
                        </p>

                        <p><strong>Header enviado:</strong></p>
                        <p><code>Set-Cookie: sesionHttpOnly=protegida123; Path=/; HttpOnly</code></p>

                        <div class="impact">
                            <strong>Impacto:</strong> un script inyectado no podrá leer directamente esta cookie.
                        </div>
                    </div>

                    <div class="panel">
                        <h2>Prueba real</h2>
                        <p>Pulsa el botón para intentar leer <code>document.cookie</code> desde JavaScript:</p>

                        <button class="btn btn-primary" onclick="leerCookie()">Leer document.cookie</button>
                        <a class="btn btn-secondary" href="/http_only/index.html">Volver</a>

                        <div class="result" id="resultado">Aquí aparecerá el valor de document.cookie...</div>
                    </div>
                </div>
            </div>

            <script>
                function leerCookie() {
                    document.getElementById("resultado").innerText =
                        "Resultado de document.cookie:\\n\\n" + document.cookie;
                }
            </script>
        </body>
        </html>
    `);
});

//
// ==============================
// SAMESITE VULNERABLE
// ==============================
//
app.get("/samesite/vulnerable", (req, res) => {
    res.setHeader(
        "Set-Cookie",
        "sesionSameSite=vulnerable123; Path=/; SameSite=None; Secure"
    );

    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>SameSite Vulnerable</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #fff5f5, #ffe3e3);
                    margin: 0;
                    padding: 0;
                    color: #333;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .card {
                    width: 90%;
                    max-width: 980px;
                    background: #fff;
                    border-radius: 18px;
                    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15);
                    overflow: hidden;
                }
                .header {
                    background: #c62828;
                    color: #fff;
                    padding: 1.5rem 2rem;
                }
                .header h1 {
                    margin: 0;
                    font-size: 2rem;
                }
                .content {
                    padding: 2rem;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .panel {
                    background: #fafafa;
                    border-radius: 14px;
                    padding: 1.5rem;
                    border: 1px solid #eee;
                }
                .panel h2 {
                    margin-top: 0;
                    color: #c62828;
                }
                .tag {
                    display: inline-block;
                    background: #fdecea;
                    color: #b71c1c;
                    padding: 0.4rem 0.8rem;
                    border-radius: 999px;
                    font-weight: bold;
                    margin: 0.3rem 0.3rem 0 0;
                }
                .btn {
                    display: inline-block;
                    margin-top: 1rem;
                    margin-right: 0.7rem;
                    padding: 0.8rem 1.2rem;
                    border-radius: 10px;
                    text-decoration: none;
                    font-weight: bold;
                    border: none;
                    cursor: pointer;
                }
                .btn-primary {
                    background: #c62828;
                    color: #fff;
                }
                .btn-primary:hover {
                    background: #a91f1f;
                }
                .btn-secondary {
                    background: #ff9800;
                    color: #fff;
                }
                .btn-secondary:hover {
                    background: #e68900;
                }
                .result {
                    margin-top: 1rem;
                    background: #fff3cd;
                    color: #856404;
                    border: 1px solid #ffe08a;
                    border-radius: 10px;
                    padding: 1rem;
                    min-height: 70px;
                    white-space: pre-wrap;
                    word-break: break-word;
                }
                .impact {
                    background: #fdecea;
                    border-left: 6px solid #c62828;
                    padding: 1rem;
                    border-radius: 10px;
                    margin-top: 1rem;
                }
                code {
                    background: #f1f3f5;
                    padding: 2px 6px;
                    border-radius: 6px;
                }
                @media (max-width: 800px) {
                    .content {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="header">
                    <h1>SameSite Vulnerable</h1>
                    <p>Cookie configurada con <strong>SameSite=None</strong>.</p>
                </div>

                <div class="content">
                    <div class="panel">
                        <h2>Configuración aplicada</h2>
                        <div class="tag">SameSite=None</div>
                        <div class="tag">Secure</div>
                        <div class="tag">Más permisiva</div>

                        <p>
                            Esta cookie puede enviarse en contextos <strong>cross-site</strong>.
                            Eso la vuelve más riesgosa ante escenarios como <strong>CSRF</strong>.
                        </p>

                        <p><strong>Header enviado:</strong></p>
                        <p><code>Set-Cookie: sesionSameSite=vulnerable123; Path=/; SameSite=None; Secure</code></p>

                        <div class="impact">
                            <strong>Impacto:</strong> desde otro sitio, esta cookie sí puede viajar.
                        </div>
                    </div>

                    <div class="panel">
                        <h2>Prueba real</h2>
                        <p>
                            Ahora abre el sitio atacante para probar si esta cookie viaja desde otro origen:
                        </p>

                        <a class="btn btn-primary" href="http://localhost:4000/attacker?samesite=none" target="_blank">
                            Probar desde sitio atacante
                        </a>

                        <a class="btn btn-secondary" href="/same_site/index.html">
                            Volver
                        </a>

                        <div class="result">
                            Debes abrir el sitio atacante y pulsar el botón de ataque.
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});

//
// ==============================
// SAMESITE PROTEGIDO
// ==============================
//
app.get("/samesite/protected", (req, res) => {
    res.setHeader(
        "Set-Cookie",
        "sesionSameSite=protegida123; Path=/; SameSite=Strict"
    );

    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>SameSite Protegido</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #f1fff3, #dff7e5);
                    margin: 0;
                    padding: 0;
                    color: #333;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .card {
                    width: 90%;
                    max-width: 980px;
                    background: #fff;
                    border-radius: 18px;
                    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15);
                    overflow: hidden;
                }
                .header {
                    background: #2e7d32;
                    color: #fff;
                    padding: 1.5rem 2rem;
                }
                .header h1 {
                    margin: 0;
                    font-size: 2rem;
                }
                .content {
                    padding: 2rem;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .panel {
                    background: #fafafa;
                    border-radius: 14px;
                    padding: 1.5rem;
                    border: 1px solid #eee;
                }
                .panel h2 {
                    margin-top: 0;
                    color: #2e7d32;
                }
                .tag {
                    display: inline-block;
                    background: #e8f5e9;
                    color: #1b5e20;
                    padding: 0.4rem 0.8rem;
                    border-radius: 999px;
                    font-weight: bold;
                    margin: 0.3rem 0.3rem 0 0;
                }
                .btn {
                    display: inline-block;
                    margin-top: 1rem;
                    margin-right: 0.7rem;
                    padding: 0.8rem 1.2rem;
                    border-radius: 10px;
                    text-decoration: none;
                    font-weight: bold;
                    border: none;
                    cursor: pointer;
                }
                .btn-primary {
                    background: #2e7d32;
                    color: #fff;
                }
                .btn-primary:hover {
                    background: #256628;
                }
                .btn-secondary {
                    background: #ff9800;
                    color: #fff;
                }
                .btn-secondary:hover {
                    background: #e68900;
                }
                .result {
                    margin-top: 1rem;
                    background: #e8f5e9;
                    color: #1b5e20;
                    border: 1px solid #b7e1bd;
                    border-radius: 10px;
                    padding: 1rem;
                    min-height: 70px;
                    white-space: pre-wrap;
                    word-break: break-word;
                }
                .impact {
                    background: #e8f5e9;
                    border-left: 6px solid #2e7d32;
                    padding: 1rem;
                    border-radius: 10px;
                    margin-top: 1rem;
                }
                code {
                    background: #f1f3f5;
                    padding: 2px 6px;
                    border-radius: 6px;
                }
                @media (max-width: 800px) {
                    .content {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="header">
                    <h1>SameSite Protegido</h1>
                    <p>Cookie configurada con <strong>SameSite=Strict</strong>.</p>
                </div>

                <div class="content">
                    <div class="panel">
                        <h2>Configuración aplicada</h2>
                        <div class="tag">SameSite=Strict</div>
                        <div class="tag">Más restrictiva</div>
                        <div class="tag">Mejor defensa CSRF</div>

                        <p>
                            Esta cookie restringe el envío en contextos <strong>cross-site</strong>.
                        </p>

                        <p><strong>Header enviado:</strong></p>
                        <p><code>Set-Cookie: sesionSameSite=protegida123; Path=/; SameSite=Strict</code></p>

                        <div class="impact">
                            <strong>Impacto:</strong> desde otro sitio, esta cookie no debería viajar.
                        </div>
                    </div>

                    <div class="panel">
                        <h2>Prueba real</h2>
                        <p>
                            Ahora abre el sitio atacante para probar si esta cookie viaja desde otro origen:
                        </p>

                        <a class="btn btn-primary" href="http://localhost:4000/attacker?samesite=strict" target="_blank">
                            Probar desde sitio atacante
                        </a>

                        <a class="btn btn-secondary" href="/same_site/index.html">
                            Volver
                        </a>

                        <div class="result">
                            Debes abrir el sitio atacante y pulsar el botón de ataque.
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});

//
// ==============================
// SITIO ATACANTE
// ==============================
//
attackerApp.get("/attacker", (req, res) => {
    const mode = req.query.samesite || "none";
    const title = mode === "strict"
        ? "Ataque contra SameSite=Strict"
        : "Ataque contra SameSite=None";

    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${title}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: #111827;
                    color: white;
                    margin: 0;
                    padding: 0;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .card {
                    width: 90%;
                    max-width: 950px;
                    background: #1f2937;
                    border-radius: 18px;
                    box-shadow: 0 10px 25px rgba(0,0,0,.35);
                    padding: 2rem;
                }
                h1 {
                    margin-top: 0;
                    color: #facc15;
                }
                p {
                    line-height: 1.7;
                }
                .tag {
                    display: inline-block;
                    background: #374151;
                    color: #f9fafb;
                    padding: 0.4rem 0.8rem;
                    border-radius: 999px;
                    margin-right: 0.4rem;
                    margin-bottom: 0.8rem;
                    font-weight: bold;
                }
                button, a {
                    display: inline-block;
                    margin-top: 1rem;
                    margin-right: 0.7rem;
                    padding: 0.8rem 1.2rem;
                    border-radius: 10px;
                    border: none;
                    text-decoration: none;
                    font-weight: bold;
                    cursor: pointer;
                }
                button {
                    background: #dc2626;
                    color: white;
                }
                a {
                    background: #2563eb;
                    color: white;
                }
                .result {
                    margin-top: 1rem;
                    background: #0f172a;
                    border: 1px solid #334155;
                    border-radius: 12px;
                    padding: 1rem;
                    min-height: 70px;
                    white-space: pre-wrap;
                    word-break: break-word;
                }
                code {
                    background: #111827;
                    padding: 2px 6px;
                    border-radius: 6px;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>${title}</h1>

                <span class="tag">Origen atacante: localhost:4000</span>
                <span class="tag">Objetivo: localhost:3000</span>
                <span class="tag">Prueba cross-site</span>

                <p>
                    Esta página simula un <strong>sitio externo</strong>. Al pulsar el botón,
                    intentará enviar una petición al sitio principal para verificar si la cookie
                    del objetivo viaja o no en un contexto cross-site.
                </p>

                <p>
                    Endpoint objetivo: <code>http://localhost:3000/check-cookies</code>
                </p>

                <button onclick="lanzarAtaque()">Lanzar prueba cross-site</button>
                <a href="http://localhost:3000/same_site/index.html" target="_blank">Volver al módulo SameSite</a>

                <div class="result" id="resultado">Aquí aparecerá el resultado del ataque...</div>
            </div>

            <script>
                async function lanzarAtaque() {
                    try {
                        const response = await fetch("http://localhost:3000/check-cookies", {
                            method: "GET",
                            credentials: "include"
                        });

                        const data = await response.json();

                        document.getElementById("resultado").innerText =
                            "Cookies que recibió el servidor objetivo:\\n\\n" +
                            data.cookiesReceived;
                    } catch (error) {
                        document.getElementById("resultado").innerText =
                            "Ocurrió un error al hacer la petición cross-site.";
                    }
                }
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Sitio principal ejecutándose en http://localhost:${PORT}`);
});

attackerApp.listen(ATTACKER_PORT, () => {
    console.log(`Sitio atacante ejecutándose en http://localhost:${ATTACKER_PORT}`);
});