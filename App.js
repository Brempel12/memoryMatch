import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import MemoryGame from './MemoryGame';
import HomeScreen from './HomeScreen';
import Instructions from './Instructions';
import Leaderboard from './Leaderboard';

const App = () => {
    const [currentScreen, setCurrentScreen] = useState('Home');

    const handleNavigate = (screen) => {
        setCurrentScreen(screen);
    };

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                {currentScreen === 'Home' && <HomeScreen onNavigate={handleNavigate} />}
                {currentScreen === 'Game' && <MemoryGame onNavigate={handleNavigate} />}
                {currentScreen === 'Instructions' && <Instructions onNavigate={handleNavigate} />}
                {currentScreen === 'Leaderboard' && <Leaderboard onNavigate={handleNavigate} />}
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d3d3d3',
    },
});

export default App;
