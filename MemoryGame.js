import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Alert, Vibration } from 'react-native';
import { Audio } from 'expo-av';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('memory_game.db');

//emojis for game
const emojis = ["🍎", "🚀", "🏰", "👻", "🧩", "🎩", "🐲", "🔮", "🎨", "🛸"];
const doubledEmojis = [...emojis, ...emojis];

//shuffle array elements
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const MemoryGame = ({ onNavigate }) => {
    const [cards, setCards] = useState(shuffleArray([...doubledEmojis]));
    const [openCards, setOpenCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [moveCount, setMoveCount] = useState(0);
    const [gameTime, setGameTime] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [username, setUsername] = useState('');

    // Effect for game timer
    useEffect(() => {
        let interval;
        if (gameStarted) {
            const startTime = Date.now();
            interval = setInterval(() => {
                setGameTime(Date.now() - startTime);
            }, 1000);
        } else {
            setGameTime(0);
        }
        return () => clearInterval(interval);
    }, [gameStarted]);

    // Function to play sound effects
    const playSound = async (soundPath) => {
        const { sound } = await Audio.Sound.createAsync(soundPath);
        await sound.playAsync();
    };

    // Function to save the score to database
    const saveScore = (username) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO scores (username, moves, time) VALUES (?, ?, ?)`,
                [username, moveCount, Math.round(gameTime / 1000)],
                () => console.log('Score saved successfully'),
                (_, error) => console.log('Error saving score: ', error)
            );
        });
    };

    // Function to prompt the user for their username
    const promptUsername = () => {
        Alert.prompt(
            'Enter Username',
            'Please enter your username for the leaderboard:',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Submit',
                    onPress: (text) => {
                        setUsername(text);
                        saveScore(text);
                    },
                },
            ],
            'plain-text'
        );
    };

    // Function to restart the game
    const restartGame = () => {
        setCards(shuffleArray([...doubledEmojis])); // Reshuffle cards
        setOpenCards([]);
        setMatchedCards([]);
        setMoveCount(0);
        setGameTime(0);
        setGameStarted(false);
        setUsername('');
    };

    // Handler for card press
    const onCardPress = async (index) => {
        if (!gameStarted) setGameStarted(true);
        if (openCards.length === 2 || openCards.includes(index) || matchedCards.includes(index)) return;

        Vibration.vibrate(); // Haptic feedback
        await playSound(require('./assets/flip.mp3'));

        const newOpenCards = [...openCards, index];
        setOpenCards(newOpenCards);

        if (newOpenCards.length === 2) {
            setMoveCount(moveCount + 1);
            const firstMatch = cards[newOpenCards[0]];
            const secondMatch = cards[newOpenCards[1]];
            if (firstMatch === secondMatch) {
                setMatchedCards(prev => [...prev, ...newOpenCards]);
                await playSound(require('./assets/success.mp3')); // Success sound
                setOpenCards([]);
                if (matchedCards.length + 2 === cards.length) {
                    setGameStarted(false);
                    promptUsername();
                }
            } else {
                setTimeout(() => setOpenCards([]), 500);
            }
        }
    };

    // Function to render individual card
    const renderCard = (card, index) => {
        const isFlipped = openCards.includes(index) || matchedCards.includes(index);
        const isMatched = matchedCards.includes(index);
        return (
            <Pressable
                key={index}
                style={[styles.card, isMatched && styles.matchedCard]}
                onPress={() => onCardPress(index)}
            >
                <Text style={styles.cardText}>{isFlipped ? card : "MM"}</Text>
            </Pressable>
        );
    };

    // UI
    return (
        <View style={styles.fullScreen}>
            <View style={styles.container}>
                <Text style={styles.moveCounter}>Moves: {moveCount}</Text>
                <Text style={styles.timerText}>Time: {Math.round(gameTime / 1000)}s</Text>
                <View style={styles.grid}>
                    {cards.map(renderCard)}
                </View>
                <Pressable onPress={restartGame} style={styles.restartButton}>
                    <Text style={styles.restartButtonText}>Restart</Text>
                </Pressable>
                <Pressable onPress={() => onNavigate('Home')} style={styles.homeButton}>
                    <Text style={styles.homeButtonText}>Return to HomeScreen</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d3d3d3',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
        justifyContent: 'center',
    },
    card: {
        width: 80,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        backgroundColor: '#FAD02E',
        borderRadius: 15,
    },
    matchedCard: {
        backgroundColor: 'lightgreen',
    },
    cardText: {
        fontSize: 24,
    },
    timerText: {
        fontSize: 24,
        marginBottom: 10,
    },
    moveCounter: {
        fontSize: 24,
        color: '#fff',
    },
    restartButton: {
        marginTop: 20,
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 5,
    },
    restartButtonText: {
        fontSize: 20,
        color: '#333',
    },
    homeButton: {
        marginTop: 10,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    homeButtonText: {
        fontSize: 20,
        color: '#fff',
    },
});

export default MemoryGame;
