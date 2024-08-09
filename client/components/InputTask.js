import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Text,
    TextInput,
    StyleSheet,
    View,
    TouchableHighlight,
    KeyboardAvoidingView,
    Keyboard,
    Pressable,
    Animated,
    Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons"; 

export default function InputTask({ todos, setTodos }) {
    const [showEmojis, setShowEmojis] = useState(false); // Estado para controlar la visibilidad de los emojis
    const [messageBody, setMessageBody] = useState(""); // Estado para almacenar el texto ingresado
    const fadeAnim = useState(new Animated.Value(0.1))[0]; // Inicialización de la animación de opacidad

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardWillShow", () => {
            setShowEmojis(true);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        });
        const hideSubscription = Keyboard.addListener("keyboardWillHide", () => {
            setShowEmojis(false);
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        });
        return () => {
            showSubscription.remove(); 
            hideSubscription.remove(); 
        };
    }, [fadeAnim]);

    const handleSubmit = async () => {
        if (messageBody === "") {
            return;
        } else {
            const response = await fetch("http://localhost:8080/todos", { 
                headers: {
                    "x-api-key": "abcdef123456", 
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    user_id: 1,
                    title: messageBody,
                }),
            });
            const newTodo = await response.json();
            setTodos([...todos, { ...newTodo, shared_with_id: null }]);
            Keyboard.dismiss();
            setMessageBody(""); // Limpiar el campo de texto después de enviar
        }
    };

    const RenderEmoji = ({ emoji }) => {
        return (
            <TouchableHighlight
                activeOpacity={1}
                underlayColor={"transparent"}
                onPress={() => setMessageBody(messageBody + emoji)}
            >
                <Text style={styles.emoji}>{emoji}</Text> 
            </TouchableHighlight>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"} // Ajuste para el comportamiento del teclado según la plataforma
            style={{ flex: 1 }} // Asegúrate de que el KeyboardAvoidingView ocupe todo el espacio disponible
        >
            <View style={styles.container}>
                {showEmojis && (
                    <Animated.View
                        style={[
                            styles.emojisContainer,
                            {
                                opacity: fadeAnim, // Aplicación de la animación de opacidad
                            },
                        ]}
                    >
                        <RenderEmoji emoji="✅" />
                        <RenderEmoji emoji="🚨" />
                        <RenderEmoji emoji="📝" />
                        <RenderEmoji emoji="🎁" />
                        <RenderEmoji emoji="🎮" />
                        <RenderEmoji emoji="🎉" />
                        <RenderEmoji emoji="🏃‍♀️" />
                    </Animated.View>
                )}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.containerTextInput}
                        placeholder='Write a new task'
                        scrollEnabled={true}
                        onChangeText={setMessageBody}
                        value={messageBody} 
                    />
                    <Pressable onPress={handleSubmit}>
                        <AntDesign 
                            name="checkcircle"
                            size={40}
                            color={messageBody ? "black" : "#00000050"}
                            style={{ paddingLeft: 5 }}
                        />
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 0.2,
        borderTopColor: "#00000030",
        alignItems: "baseline", 
    },
    emojisContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "baseline", 
        justifyContent: "space-between",
        paddingLeft: 10,
        marginVertical: 10,
    },
    emoji: { 
        fontSize: 25,
        paddingVertical: 5,
        marginRight: 10,
    },
    containerTextInput: {
        width: windowWidth - 100,
        borderWidth: 1,
        borderRadius: 30,
        minHeight: 45,
        paddingHorizontal: 15,
        paddingTop: 8,
        fontSize: 16,
        paddingVertical: 5,
        borderColor: "lightgray",
        backgroundColor: "#fff",
        marginBottom: 5,
        fontWeight: "600",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
});
