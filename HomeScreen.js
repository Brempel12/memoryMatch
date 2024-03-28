import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const HomeScreen = ({ onNavigate }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Memory Match</Text>
            <Pressable style={[styles.button, styles.play]} onPress={() => onNavigate('Game')}>
                <Text>Play Game</Text>
            </Pressable>
            {/* Placeholder buttons for future screens */}
            <Pressable style={[styles.button, styles.instructions]} onPress={() => onNavigate('Instructions')}>
                <Text>Instructions</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.leaderboard]} onPress={() => onNavigate('Leaderboard')}>
                <Text>Leaderboard</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d3d3d3',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black',
    },
    button: {
        marginBottom: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        minWidth: 150,
        alignItems: 'center',
    },
    play: {
        backgroundColor: '#add8e6',
    },
    instructions: {
        backgroundColor: '#dda0dd',
    },
    leaderboard: {
        backgroundColor: '#90ee90',
    },
});

export default HomeScreen;
