import { useEffect, useState } from "react";
import { Keyboard, View, Text, StyleSheet, Button, Alert } from "react-native";

export default function SharedTodoModalContext({
    id,
    title,
    shared_with_id,
    completed,
}){
    const [author, setAuthor] = useState({});
    const [sharedWith, setSharedWith] = useState({});
    useEffect(() => {
        fetchInfo();
    }, []);

    
}