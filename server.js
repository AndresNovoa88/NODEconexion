const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000' // Solo permitir solicitudes desde este origen
}));

// Endpoint para manejar GET y POST
app.all('/api/getPage', (req, res) => {
    // Obtener el nombre del archivo desde el cuerpo o los parámetros de consulta
    const pageName = req.body.pageName || req.query.pageName;

    console.log('Received pageName:', pageName); // Para depuración

    // Validar si el nombre del archivo fue enviado
    if (!pageName) {
        return res.status(400).send('El nombre de la página es requerido');
    }

    // Construir la ruta completa del archivo
    const filePath = path.join(__dirname, pageName);

    // Verificar si el archivo solicitado es válido
    if (pageName !== 'pag1.html' && pageName !== 'pag2.html') {
        return res.status(400).send('Nombre de página inválido');
    }

    // Leer el archivo
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);

            // Manejar el caso cuando el archivo no se encuentra
            if (err.code === 'ENOENT') {
                return res.status(404).send('Archivo no encontrado');
            }
            
            // Manejar otros errores de lectura de archivo
            return res.status(500).send('Error al leer el archivo');
        }

        // Enviar el contenido del archivo si no hubo errores
        res.send(data);
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
