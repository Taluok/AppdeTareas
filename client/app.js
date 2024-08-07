import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native"
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        const response = await fetch("http://localhost:8080/todos/1");
        const data = await response.json();
        setTodos(data);
    }

    return (
        <View style={style.container}>
            <SafeAreaView>
                <FlatList data={todos}
                keyExtractor={(todo) => todo.id}
                renderItem={({item}) => (
                    <Text>{item.title}</Text>
                )}
                ListHeaderComponent={() => <Text style={styles.title}>Today</Text>}
                contentContainerStyle={styles.contentContainerStyle} />
            </SafeAreaView>
            <StatusBar style="auto" />
        </View>
    )
}

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