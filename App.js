import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import MemoryGame from './MemoryGame';
import HomeScreen from './HomeScreen';
import Instructions from './Instructions';
import Leaderboard from './Leaderboard';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('memory_game.db');

const App = () => {
    const [currentScreen, setCurrentScreen] = useState('Home');

    //create scores table on mount
    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, time INTEGER NOT NULL, moves INTEGER NOT NULL);',
                [],
                () => console.log('Table created successfully.'),
                (_, error) => console.log('Error creating table: ', error)
            );
        });
    }, []);

    //handle navigation between screens
    const handleNavigate = (screen) => {
        setCurrentScreen(screen);
    };

    // UI
    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                {/* Conditional rendering based on current screen */}
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
