const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const express = require('express');
const mongoose = require('mongoose');
const { log } = require('console');
const app = express();

// Conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://josep3194:2PR1A1DUxuoHJR2S@motocapp.4btkjz5.mongodb.net/miDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDb'))
.catch(err => console.error ('Error de coneccion', err))

// Modelo de usuario
const User= mongoose.model('User',{
    username:{type:String, unique:true},
    password: String
})

// Middleware para parsear JSON
app.use(express.json())

// Ruta de registros

app.post('/register', async(req,res)=>{
    try{
        const user= new User(req.body);
        await user.save()
        res.status(201).send({success:true})
    }catch(error){
        res.status(400).send({error: error.message})
    }
})

// Iniciar servidor

const PORT=process.env.PORT || 3000
app.listen(PORT,()=> console.log(`Servidor en http://localhost:${PORT}`))

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