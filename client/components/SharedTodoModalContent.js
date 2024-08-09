import { useEffect, useState } from "react"; // Importa useEffect y useState de React
import { Keyboard, View, Text, StyleSheet, Button, Alert } from "react-native"; // Importa componentes de React Native

export default function SharedTodoModalContext({
    id,
    title,
    shared_with_id,
    completed,
}) {
    // Estado local para almacenar la información del autor y del usuario con el que se comparte
    const [author, setAuthor] = useState({});
    const [sharedWith, setSharedWith] = useState({});

    // useEffect para obtener la información cuando el componente se monta
    useEffect(() => {
        fetchInfo();
    }, []); // El array vacío asegura que useEffect se ejecute solo una vez al montar el componente

    // Función asíncrona para obtener la información del todo compartido
    async function fetchInfo() {
        const response = await fetch(
            `http://localhost:8080/todos/shared_todos/${id}`,
            {
                headers: {
                    "x-api-key": "abcdef123456",
                },
                method: "GET",
            }
        );
        // Obtiene la respuesta en formato JSON
        const { author, sharedWith } = await response.json();
        setAuthor(author); // Actualiza el estado con la información del autor
        setSharedWith(sharedWith); // Actualiza el estado con la información del usuario con el que se comparte
    }

    return (
        <View style={styles.contentContainer}>
            <Text style={[styles.title, { marginBottom: 20 }]}>Shared Tasks</Text>
            <Text style={[styles.title, { marginBottom: 20 }]}>"{title}"</Text>
            <Text style={styles.title}>Status</Text>
            <View
                style={[
                    styles.status,
                    { backgroundColor: completed === 1 ? "#4ade80" : "#f87171" },
                ]}
            >
                <Text style={[styles.title, { color: "white" }]}>
                    {completed === 1 ? "Completed" : "Incomplete"}
                </Text>
            </View>
            
        </View>
    );
}

// Estilos para los componentes
const styles = StyleSheet.create({
    contentContainer: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    status: {
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
});
