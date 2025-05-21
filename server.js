const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

// Corregido a 'users' (plural)
const users = [
    { username: 'admin', password: '123' }
];

const server = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url, true);

    // Ruta de login (POST)
    if (pathname === '/login' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { username, password } = JSON.parse(body);
                const user = users.find(u => u.username === username && u.password === password);

                if (user) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        redirect: '/dashboard.html'  // Cambiado a .html
                    }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: false, 
                        error: 'Credenciales incorrectas' 
                    }));
                }
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'Datos inválidos' 
                }));
            }
        });
        return;
    }

    // Servir archivos estáticos
    const filePath = path.join(__dirname, 'public', 
        pathname === '/' ? 'login.html' : 
        pathname === '/dashboard' ? 'dashboard.html' : 
        pathname);
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Archivo no encontrado');
        } else {
            res.writeHead(200);
            res.end(content);  // Corregido: sin comillas
        }
    });
});

server.listen(8080, () => {
    console.log('Server corriendo en http://localhost:8080');
});