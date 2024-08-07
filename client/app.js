import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Task from "./components/Task";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

// Componente principal de la aplicación
export default function App() {
    // Define un estado local llamado todos y una función para actualizarlo (setTodos)
    const [todos, setTodos] = useState([]);

    // useEffect se ejecuta cuando el componente se monta (similar a componentDidMount)
    useEffect(() => {
        fetchData(); // Llama a fetchData cuando el componente se monta
    }, []); // El array vacío [] asegura que useEffect se ejecute solo una vez

    // Función asíncrona para obtener datos de la API
    async function fetchData() {
        const response = await fetch("http://localhost:8080/todos/1"); // Realiza una petición GET a la API
        const data = await response.json(); // Convierte la respuesta a JSON
        setTodos(data); // Actualiza el estado con los datos obtenidos
    }

    function clearTodo(id) {
        setTodos(todos.filter((todos) => todos.id !== id));
    }

    function toggleTodo(id) {
        setTodos(
            todos.map((todos) =>
                todo.id === id
                    ? { ...todo, completed: todo.completed === 1 ? 0 : 1 }
                    : todo
            )
        )
    }

    return (
        <BottomSheetModalProvider>
            <View style={styles.container}>
                <SafeAreaView>
                    {/* FlatList para renderizar la lista de todos */}
                    <FlatList
                        data={todos} // Datos a renderizar
                        keyExtractor={(todo) => todo.id.toString()} // Función para extraer una clave única para cada elemento
                        renderItem={({ item }) => ( // Función para renderizar cada elemento de la lista
                            <Text>{item.title}</Text> // Renderiza el título del todo
                        )}
                        ListHeaderComponent={() => <Text style={styles.title}>Today</Text>} // Encabezado de la lista
                        contentContainerStyle={styles.contentContainerStyle} // Estilo para el contenedor de contenido
                    />
                </SafeAreaView>
                <StatusBar style="auto" /> {/* Barra de estado de Expo */}
            </View>
        </BottomSheetModalProvider>
    );
}

// Estilos para los componentes
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E9E9EF",
    },
    contentContainerStyle: {
        padding: 15,
    },
    title: {
        fontWeight: "800",
        fontSize: 28,
        marginBottom: 15,
    }
});
