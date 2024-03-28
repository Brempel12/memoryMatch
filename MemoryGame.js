import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import { Audio } from 'expo-av';

//emojis for the game
const emojis = ["🍎", "🚀", "🏰", "👻", "🧩", "🎩", "🐲", "🔮", "🎨", "🛸"];
const doubledEmojis = [...emojis, ...emojis]; //set for pairs

const shuffleArray = (array) => {
    // Shuffle elements
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const MemoryGame = () => {
    const [cards, setCards] = useState(shuffleArray([...doubledEmojis]));
    const [openCards, setOpenCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [moveCount, setMoveCount] = useState(0);
    const [gameTime, setGameTime] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    // Sound effects
    const playSound = async (soundPath) => {
        const { sound } = await Audio.Sound.createAsync(soundPath);
        await sound.playAsync();
    };

    useEffect(() => {
        // Timer
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

    const restartGame = () => {
        // Restart game
        setCards(shuffleArray([...doubledEmojis]));
        setOpenCards([]);
        setMatchedCards([]);
        setMoveCount(0);
        setGameStarted(false);
    };

    const onCardPress = async (index) => {
        if (!gameStarted) setGameStarted(true);
        if (openCards.length === 2 || openCards.includes(index) || matchedCards.includes(index)) return;

        // Play card flip sound
        await playSound(require('./assets/flip.mp3'));

        const newOpenCards = [...openCards, index];
        setOpenCards(newOpenCards);

        if (newOpenCards.length === 2) {
            setMoveCount(moveCount + 1);
            const firstMatch = cards[newOpenCards[0]];
            const secondMatch = cards[newOpenCards[1]];
            if (firstMatch === secondMatch) {
                setMatchedCards((prev) => [...prev, ...newOpenCards]);
                // Play success sound for match found
                await playSound(require('./assets/success.mp3'));
                setOpenCards([]);
                if (matchedCards.length + 2 === cards.length) {
                    setGameStarted(false);
                    Alert.alert("Congratulations!", `You've matched all pairs in ${Math.round(gameTime / 1000)} seconds with ${moveCount + 1} moves!`);
                }
            } else {
                setTimeout(() => setOpenCards([]), 1000);
            }
        }
    };

    const renderCard = (card, index) => {
        // Render individual cards
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

    return (
        <View style={styles.container}>
            <Text style={styles.moveCounter}>Moves: {moveCount}</Text>
            <Text style={styles.timerText}>Time: {Math.round(gameTime / 1000)}s</Text>
            <View style={styles.grid}>
                {cards.map(renderCard)}
            </View>
            <Pressable onPress={restartGame} style={styles.restartButton}>
                <Text style={styles.restartButtonText}>Restart</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', width: 300, marginTop: 20 },
    card: { width: 60, height: 60, justifyContent: 'center', alignItems: 'center', margin: 5, backgroundColor: '#FAD02E', borderRadius: 10 },
    matchedCard: { backgroundColor: 'lightgreen' },
    cardText: { fontSize: 20 },
    timerText: { fontSize: 24, marginBottom: 10 },
    moveCounter: { fontSize: 24, color: '#fff' },
    restartButton: { marginTop: 20, backgroundColor: 'lightblue', padding: 10, borderRadius: 5 },
    restartButtonText: { fontSize: 20, color: '#333' },
});

export default MemoryGame;
