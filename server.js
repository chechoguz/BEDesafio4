const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',     
    host: 'localhost',
    database: 'likeme',
    password: 'clave', 
    port: 5432,
});

app.get('/posts', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM posts');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los posts' });
    }
});

app.post('/posts', async (req, res) => {
    const { titulo, url, img = url, descripcion } = req.body;

    try {
        const query = 'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [titulo, img, descripcion, 0];
        const { rows } = await pool.query(query, values);

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el post' });
    }
});

app.put('/posts/like/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Incrementar los likes del post con el ID especificado
        const query = 'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *';
        const values = [id];
        const { rows } = await pool.query(query, values);

        // Validar si el post existe
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        res.json(rows[0]); // Retorna el post actualizado
    } catch (error) {
        console.error("Error al incrementar likes:", error);
        res.status(500).json({ error: 'Error al incrementar likes' });
    }
});

app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Eliminar el post con el ID especificado
        const query = 'DELETE FROM posts WHERE id = $1 RETURNING *';
        const values = [id];
        const { rows } = await pool.query(query, values);

        // Validar si el post existe
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        res.json({ message: 'Post eliminado', post: rows[0] }); 
    } catch (error) {
        console.error("Error al eliminar post:", error);
        res.status(500).json({ error: 'Error al eliminar el post' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});