import React, { useState, useRef, useEffect, useCallback } from 'react';
import Card from './Card';
import { cardsData } from '../data/cards'

const shaffleCards = (array) => {
    for (let i = array.length; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * i);
        const currentIndex = i - 1;
        const tempEl = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempEl
    }
    
    return array;
}

const newCardsData= cardsData.map((c,i) => {
    const newC = {...c}
    newC.id = cardsData.length + i
    return newC
})

function Board() {
    const [openedCards, setOpenedCards] = useState([]);
    const [clearedCards, setClearedCards] = useState({});
    const [cards, setCards] = useState(shaffleCards(cardsData.concat(newCardsData)));
    const timer = useRef(null);

    const hanldeCardClick = (index) => {
        if(openedCards.length === 1){
            setOpenedCards(arr => [...arr, index]);
        }else if(openedCards.length === 0){
            setOpenedCards([index]);
        }

    };

    const evaluate = useCallback(() => {
        const [first, second] = openedCards;
        if(openedCards.length === 2 && cards[first].name === cards[second].name){
            setClearedCards(prevObj => {return {...prevObj, [cards[openedCards[0]].name]: true}})
            setOpenedCards([]);
        };
    }, [openedCards, cards])
    
    const isCardOpened = (id) => openedCards.includes(id);
    const isInActive = (name) => Boolean(clearedCards[name])

    useEffect(() => {
        if(openedCards.length === 2) {
            timer.current = setInterval(() => setOpenedCards([]),700);
        }

        return () => clearInterval(timer.current);
    }, [openedCards]);

    useEffect(() => {
        evaluate();
    }, [evaluate])

    
    return (
        <div className="board">
            {
                cards.map((card, inx) => <Card card={card} index={inx} click={hanldeCardClick} inActive={isInActive(card.name)} isFlipped={isCardOpened(inx)} key={inx}/>)
            }
        </div>
    )
}

export default Board
