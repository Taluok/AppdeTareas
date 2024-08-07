import express from "express";
import {
    getTodo,
    shareTodo,
    deleteTodo,
    getTodosByID,
    createTodo,
    toggleCompleted,
    getUserByEmail,
    getTodoByID,
    getSharedTodoById,
    getUserById,
} from "./database.js"

import cors from "cors";

// Configuración de CORS para permitir solicitudes desde el frontend
const corsOption = {
    origin: "https://127.0.0.1:5173", // Origen permitido para las solicitudes
    methods: ["POST", "GET"], // Métodos permitidos
    credentials: true, // Permite el envío de cookies y cabeceras de autenticación
}

// Inicializa la aplicación Express
const app = express();
app.use(express.json()); // Middleware para parsear JSON en las solicitudes
app.use(cors(corsOption)) // Middleware para habilitar CORS con la configuración especificada

// Ruta para obtener todos los "todos" por ID
app.get("/todos/:id", async (req, res) => {
    try {
        const todos = await getTodosByID(req.params.id);
        res.status(200).send(todos);
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener los todos' });
    }
});

// Ruta para obtener un "todo" compartido por ID
app.get("/todos/shared_todos/:id", async (req, res) => {
    try {
        const todo = await getSharedTodoById(req.params.id);
        if (!todo) {
            return res.status(404).send({ error: 'Todo compartido no encontrado' });
        }
        const author = await getUserById(todo.user_id);
        const shared_with = await getUserById(todo.shared_with_id);
        res.status(200).send({ author, shared_with });
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener el todo compartido' });
    }
});

// Ruta para obtener un usuario por ID
app.get("/users/:id", async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        if (!user) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener el usuario' });
    }
});

// Ruta para actualizar el estado de completado de un "todo"
app.put("/todos/:id", async (req, res) => {
    const { value } = req.body;
    try {
        const todo = await toggleCompleted(req.params.id, value);
        res.status(200).send(todo);
    } catch (error) {
        res.status(500).send({ error: 'Error al actualizar el todo' });
    }
});

// Ruta para eliminar un "todo" por ID
app.delete("/todos/:id", async (req, res) => {
    try {
        await deleteTodo(req.params.id);
        res.send({ message: "Todo eliminado exitosamente" });
    } catch (error) {
        res.status(500).send({ error: 'Error al eliminar el todo' });
    }
});

// Ruta para compartir un "todo" con otro usuario
app.post("/todos/shared_todos", async (req, res) => {
    const { todo_id, user_id, email } = req.body;
    try {
        const userToShare = await getUserByEmail(email);
        if (!userToShare) {
            return res.status(404).send({ error: 'Usuario para compartir no encontrado' });
        }
        const sharedTodo = await shareTodo(todo_id, user_id, userToShare.id);
        res.status(201).send(sharedTodo);
    } catch (error) {
        res.status(500).send({ error: 'Error al compartir el todo' });
    }
});

// Ruta para crear un nuevo "todo"
app.post("/todos", async (req, res) => {
    const { user_id, title } = req.body;
    try {
        const todo = await createTodo(user_id, title);
        res.status(201).send(todo);
    } catch (error) {
        res.status(500).send({ error: 'Error al crear el todo' });
    }
});

// Inicia el servidor en el puerto 8080
app.listen(8080, () => {
    console.log("Servidor corriendo en el puerto 8080");
});




