import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MemoryGame from './MemoryGame';

const App = () => {
    return (
        <SafeAreaView style={styles.container}>
            <MemoryGame />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333',
    },
});

export default App;
