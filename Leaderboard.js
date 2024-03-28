import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

const Leaderboard = ({ onNavigate }) => {
    return (
        <View style={styles.container}>
            {/* Placeholder content */}
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
        backgroundColor: '#d3d3d3',
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

export default Leaderboard;
