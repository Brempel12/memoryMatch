import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('memory_game.db');

const Leaderboard = ({ onNavigate }) => {
    const [scores, setScores] = useState([]);
    const [sortByTime, setSortByTime] = useState(true);

    // Fetch leaderboard data from database
    useEffect(() => {
        fetchLeaderboard();
    }, [sortByTime]);

    const fetchLeaderboard = () => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM scores ORDER BY ${sortByTime ? 'time ASC' : 'moves ASC'} LIMIT 10;`,
                [],
                (_, { rows: { _array } }) => {
                    setScores(_array);
                },
                (_, error) => console.log('Error fetching scores: ', error)
        });
    };

    //reset the scoreboard
    const resetScores = () => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM scores;',
                [],
                () => {
                    fetchLeaderboard();
                },
                (_, error) => console.log('Error resetting scoreboard: ', error)
            );
        });
    };

    // UI
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.headerText, { width: '10%' }]}>#</Text>
                <Text style={[styles.headerText, { width: '40%' }]}>Username</Text>
                <Text style={[styles.headerText, { width: '25%' }]}>Time</Text>
                <Text style={[styles.headerText, { width: '25%' }]}>Moves</Text>
            </View>
            <FlatList
                data={scores}
                renderItem={({ item, index }) => (
                    <View style={styles.scoreRow}>
                        <Text style={[styles.scoreText, { width: '10%' }]}>{index + 1}</Text>
                        <Text style={[styles.scoreText, { width: '40%' }]}>{item.username}</Text>
                        <Text style={[styles.scoreText, { width: '25%' }]}>{item.time}s</Text>
                        <Text style={[styles.scoreText, { width: '25%' }]}>{item.moves}</Text>
                    </View>
                )}
                keyExtractor={item => item.id.toString()}
            />

            {/* Button to reset scoreboard */}
            <TouchableOpacity onPress={resetScores} style={styles.button}>
                <Text style={styles.buttonText}>Reset Scoreboard</Text>
            </TouchableOpacity>

            {/* Button to toggle sorting by time/moves */}
            <TouchableOpacity onPress={() => setSortByTime(!sortByTime)} style={styles.button}>
                <Text style={styles.buttonText}>Sort by {sortByTime ? 'Moves' : 'Time'}</Text>
            </TouchableOpacity>

            {/* Button to return to HomeScreen */}
            <TouchableOpacity onPress={() => onNavigate('Home')} style={styles.button}>
                <Text style={styles.buttonText}>Return to HomeScreen</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    scoreRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    scoreText: {
        fontSize: 16,
        textAlign: 'center',
    },
    button: {
        backgroundColor: 'steelblue',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '80%',
        alignSelf: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Leaderboard;
