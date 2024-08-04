CREATE DATABASE appdetareas;

USE appdetareas;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRYMARY KEY, --Usuario por medio de ID , se incrementa cada vez que se crea un usuario, cuando creo un usuario paso nombre y email
    name VARCHAR (255),
    email VARCHAR (255) UNIQUE NOT NULL,
    password VARCHAR (255)
);

CREATE TABLE todos (
    id INT AUTO_INCREMENT PRYMARY KEY, 
    title VARCHAR(255),
    completed BOOLEAN DEFAULT false,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE --Coneccion entre usuarios y todos, con on delite cascade se eliminan todos los todos que el usuario creo
);

--Tabla de todos compartidos
CREATE TABLE shared_todos (
    id INT AUTO_INCREMENT PRYMARY KEY,
    todo_id INT,
    user_id INT,
    shared_with_id INT,
    FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_with_id) REFERENCES users(id) ON DELETE CASCADE,
)

--Insert two users into the users table
INSERT INTO users (name, email, password) VALUES ('Carlos', 'Carlos55@example.com', 'password1')
INSERT INTO users (name, email, password) VALUES ('Fernando', 'Fernando14@example.com', 'password2')

--Insert todos into the todos tables, associated with the first user
INSERT INTO todos (title, user_id)
VALUES
("Go for a morning run", 1),
("Work on proyect presentation", 1),
("Go grocery shopping", 1),
("Read 30 pages of book", 1),
("Ride bike to the park", 1),
("Cook dinner for family", 1),
("Practice yoga", 1),
("Listen to a podcast", 1),
("Clean the house", 1),
("Get 8 hours of sleep", 1)

--share todo 1 of user 1 with user 2
INSERT INTO shared_todos (todo_id, user_id, shared_with_id)
VALUES (1, 1, 2);

--Get todos including shared todos by id
SELECT todos.*, shared_todos.shared_with_id
FROM todos
LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
WHERE todos.user_id = [user_id] OR shared_todos.shared_with_id = [user_id];
