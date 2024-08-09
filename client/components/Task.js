import { View, Text, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as React from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import SharedTodoModalContext from "./SharedTodoModalContent";
import bottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet";
import TodoModalContent from "./TodoModalContent";

// Componente CheckMark para mostrar el botón de verificación de la tarea
function CheckMark({ id, completed, toggleTodo }) {
    // Función para manejar el cambio de estado de la tarea (completado/no completado)
    async function toggle() {
        try {
            // Realiza una solicitud PUT al servidor para actualizar el estado de la tarea
            const response = await fetch(`http://localhost:8080/todos/${id}`, {
                headers: {
                    "X-api-key": "abcdef123456",
                    "Content-Type": "application/json",
                },
                method: "PUT",
                body: JSON.stringify({ value: !completed }), // Cambia el estado de completado
            });
            const data = await response.json();
            toggleTodo(id); // Actualiza el estado de la tarea en el componente padre
            console.log(data); // Imprime la respuesta del servidor en la consola
        } catch (error) {
            console.error("Error updating todo:", error); // Manejo de errores
        }
    }

    return (
        // Componente Pressable para detectar toques y cambiar el estado de la tarea
        <Pressable
            onPress={toggle} // Llama a la función toggle al presionar
            style={[styles.checkMark, { backgroundColor: completed ? "#0EA5E9" : "#E9E9EF" }]} // Cambia el color según el estado de completado
        />
    );
}

// Componente Task para mostrar una tarea individual
export default function Task({
    id,
    title,
    shared_with_id,
    completed,
    toggleTodo,
    clearTodo,
    handlePresentShared,
}) {
    const [isDeleteActive, setIsDeleteActive] = React.useState(false); // Estado para controlar la visibilidad del botón de eliminar
    const BottomSheetModalRef = React.useRef(null);
    const sharedBottomSheetRef = React.useRef(null);
    const snapPoint = ["25%","48%","75%"];
    const snapPointShared = ["40%"];

    function handlePresentModal() {
        BottomSheetModalRef.current?.present();
    }

    function handlePresentShared(){
        sharedBottomSheetRef.current?.present();
    }

    // Función para manejar la eliminación de la tarea
    async function deleteTodo() {
        try {
            // Realiza una solicitud DELETE al servidor para eliminar la tarea
            const response = await fetch(`http://localhost:8080/todos/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                clearTodo(id); // Actualiza el estado en el componente padre para eliminar la tarea
                console.log("Todo deleted successfully"); // Imprime un mensaje de éxito
            } else {
                console.error("Failed to delete todo"); // Manejo de errores si la eliminación falla
            }
        } catch (error) {
            console.error("Error deleting todo:", error); // Manejo de errores
        }
    }

    return (
        // Componente TouchableOpacity para detectar toques largos y cortos
        <TouchableOpacity 
            onLongPress={() => setIsDeleteActive(true)} // Activa el botón de eliminar al mantener presionado
            onPress={() => setIsDeleteActive(false)} // Desactiva el botón de eliminar al soltar
            activeOpacity={0.8} 
            style={[styles.container]}
        >
            <View style={styles.containerTextCheckBox}>
                <CheckMark id={id} completed={completed} toggleTodo={toggleTodo} /> {/* Botón de verificación */}
                <Text style={styles.text}>{title}</Text> {/* Título de la tarea */}
            </View>
            {shared_with_id !== null ? ( // Muestra el ícono de compartir si la tarea está compartida
                <Feather
                    onPress={handlePresentShared} // Llama a handlePresentShared al presionar el ícono
                    name="users"
                    size={20}
                    color="#383839"
                />
            ) : (
                <Feather 
                    onPress={handlePresentModal} // Llama a handlePresentModal
                    name="share" // Muestra el ícono de compartir si la tarea no está compartida
                    size={20}
                    color="#383839"
                />
            )}
            {isDeleteActive && ( // Muestra el botón de eliminar si isDeleteActive es true
                <Pressable onPress={deleteTodo} style={styles.deleteButton}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>x</Text> {/* Botón de eliminar */}
                </Pressable>
            )}
            <BottomSheetModal ref={sharedBottomSheetRef}
                snapPoint={snapPointShared}
                backgroundStyle={{borderRadius: 50, borderWidth: 4}}>

                <SharedTodoModalContext
                id={id}
                title={title}
                shared_with_id={shared_with_id}
                completed={completed}
                />    
            </BottomSheetModal>
            <BottomSheetModal ref={bottomSheetModalRef} index={2} snapPoints={snapPoints} backgroundStyle={{borderRadius: 50, borderWidth: 4}}>
                <TodoModalContent id={id} title={title}></TodoModalContent>
            </BottomSheetModal>
        </TouchableOpacity>
    );
}

// Estilos para los componentes
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderRadius: 21,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    containerTextCheckBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkMark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: '#383839',
    },
    deleteButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
});



