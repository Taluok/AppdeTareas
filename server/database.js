import mysql from 'mysql2';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Crear una pool de conexiones con la base de datos MySQL
const pool = mysql
    .createPool({
        host: process.env.MYSQL_HOST, // Host de la base de datos
        user: process.env.MYSQL_USER, // Usuario de la base de datos
        password: process.env.MYSQL_PASSWORD, // Contraseña de la base de datos
        database: process.env.MYSQL_DATABASE, // Nombre de la base de datos
    })
    .promise(); // Utilizar promesas en lugar de callbacks

// Obtener un todo por ID (incluyendo los compartidos)
export async function getTodoByID(id) {
    const [rows] = await pool.query(
        `SELECT * FROM todos
        LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
        WHERE todos.user_id = ? OR shared_todos.shared_with_id = ?`,
        [id, id]
    );
    return rows;
}

// Obtener un todo específico por ID
export async function getTodo(id) {
    const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    return rows[0];
}

// Obtener un todo compartido por ID
export async function getSharedTodoById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM shared_todos WHERE id = ?',
        [id]
    );
    return rows[0];
}

// Obtener un usuario por ID
export async function getUserById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
    );
    return rows[0];
}

// Obtener un usuario por correo electrónico
export async function getUserByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}

// Crear un nuevo todo
export async function createTodo(user_id, title) {
    const [result] = await pool.query(
        'INSERT INTO todos (user_id, title) VALUES (?, ?)',
        [user_id, title]
    );
    const todoID = result.insertId;
    return getTodo(todoID);
}

// Eliminar un todo por ID
export async function deleteTodo(id) {
    const [result] = await pool.query(
        'DELETE FROM todos WHERE id = ?',
        [id]
    );
    return result;
}

// Actualizar el estado de completado de un todo
export async function toggleCompleted(id, value) {
    const newValue = value ? 1 : 0; // MySQL usa 1 para true y 0 para false
    const [result] = await pool.query(
        'UPDATE todos SET completed = ? WHERE id = ?',
        [newValue, id]
    );
    return result;
}

// Compartir un todo con otro usuario
export async function shareTodo(todo_id, user_id, shared_with_id) {
    const [result] = await pool.query(
        'INSERT INTO shared_todos (todo_id, user_id, shared_with_id) VALUES (?, ?, ?)',
        [todo_id, user_id, shared_with_id]
    );
    return result.insertId;
}
