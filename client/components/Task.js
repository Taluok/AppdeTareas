import { View, Text, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as React from "react";

function CheckMark({ id, completed, toggleTodo }) {

    async function toggle(){
        const response = await fetch (`http://localhost:8080/todos/${id}`,{
            headers:{
                "X-api-key": "abcdef123456",
                "Content-Type" : "application/json",
            },
            method: "PUT",
            body: JSON.stringify({
                value: completed ? false : true,
            }),
        });
        const data = await response.json();
        toggleTodo(id);
        console.log(data);
    }

    return (
        <Pressable
            onPress={toggle}
            style={[styles.checkMark, { backgroundColor: completed ? "#0EA5E9" : "#E9E9EF" }]}
        />
    );
}

export default function Task({
    id,
    title,
    shared_with_id,
    completed,
    toggleTodo,
    clearTodo,
    handlePresentShared,
}) {
    const [isDeleteActive, setIsDeleteActive] = React.useState(false);

    async function deleteTodo(){
        const response = await fetch(`http://localhost:8080/todos/${id}`,{
            method:"DELETE",
        });
        clearTodo(id);
        console.log(response.status)
    }

    return (
        <TouchableOpacity onLongPress={() => setIsDeleteActive(true)} onPress={() => setIsDeleteActive(false)} activeOpacity={0.8} style={[styles.container]}>
            <View style={styles.containerTextCheckBox}>
                <CheckMark id={id} completed={completed} toggleTodo={toggleTodo} />
                <Text style={styles.text}>{title}</Text>
            </View>
            {shared_with_id !== null ? (
                <Feather
                    onPress={handlePresentShared}
                    name="users"
                    size={20}
                    color="#383839"
                />
            ) : (
                <Feather 
                    name="share"
                    size={20}
                    color="#383839"
                />
            )}
            {isDeleteActive && (
                <Pressable onPress={deleteTodo} style={styles.deleteButton}>
                    <Text style={{ color: "white", fontWeight: "bold"}}>x</Text>
                </Pressable>
            )}
        </TouchableOpacity>
    );
}

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
});

