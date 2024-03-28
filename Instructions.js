import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const Instructions = ({ onNavigate }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                <Text style={styles.boldText}>Welcome to Memory Match!</Text>{'\n'}
                The goal is to match all pairs of cards.{'\n'}
                Press on the first card of your choice and try to find the second card that matches with your first card.{'\n'}
                If you fail to do so, the cards will simply flip back over. Good luck and try to match them all in as few moves as possible!
            </Text>
            <Pressable onPress={() => onNavigate('Home')} style={styles.button}>
                <Text style={styles.buttonText}>Return to HomeScreen</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#d3d3d3',
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    boldText: {
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: 'red',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Instructions;
