import React, { useState, useRef, useEffect, useCallback } from "react";
import Card from "./Card";
import { cardsData } from "../data/cards";

const shaffleCards = (array) => {
  for (let i = array.length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    const tempEl = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = tempEl;
  }

  return array;
};

const newCardsData = cardsData.map((c, i) => {
  const newC = { ...c };
  newC.id = cardsData.length + i;
  return newC;
});

function Board() {
  const score = JSON.parse(localStorage.getItem("best-score")) || Number.POSITIVE_INFINITY;
  const [bestScore, setBestScore] = useState(score);
  const [openedCards, setOpenedCards] = useState([]);
  const [clearedCards, setClearedCards] = useState({});
  const [cards, setCards] = useState(
    shaffleCards(cardsData.concat(newCardsData))
  );
  const [moves, setMoves] = useState(0);
  const timer = useRef(null);

  const hanldeCardClick = (index) => {
    if (openedCards.length === 1) {
      setOpenedCards((arr) => [...arr, index]);
    } else if (openedCards.length === 0) {
      setOpenedCards([index]);
    }
  };

  const handleStartGame = () => {
    setCards(shaffleCards(cardsData.concat(newCardsData)));
    setClearedCards({});
    setOpenedCards([]);
    setMoves(0);
  };

  const evaluate = useCallback(() => {
    const [first, second] = openedCards;

    if (openedCards.length === 2 && cards[first].name === cards[second].name) {
      setClearedCards((prevObj) => {
        return { ...prevObj, [cards[openedCards[0]].name]: true };
      });
      setOpenedCards([]);
    }
  }, [openedCards, cards]);

  const isCardOpened = (id) => openedCards.includes(id);
  const isInActive = (name) => Boolean(clearedCards[name]);
  const checkCompletion = useCallback(() => {
    if (Object.keys(clearedCards).length === cardsData.length) {
      const highScore = Math.min(bestScore, moves);
      setBestScore(highScore);
      localStorage.setItem("best-score", highScore);
    }
  }, [clearedCards, moves, bestScore]);

  useEffect(() => {
    if (openedCards.length === 2) {
      setMoves((prev) => ++prev);
      timer.current = setInterval(() => {
        setOpenedCards([]);
      }, 700);
    }

    return () => clearInterval(timer.current);
  }, [openedCards]);

  useEffect(() => {
    evaluate();
    checkCompletion();
  }, [evaluate, checkCompletion]);

  return (
    <>
      <div className="board">
        {cards.map((card, inx) => (
          <Card
            card={card}
            index={inx}
            click={hanldeCardClick}
            inActive={isInActive(card.name)}
            isFlipped={isCardOpened(inx)}
            key={inx}
          />
        ))}
      </div>
      <div className="results">
        <p className="moves">
          <span>Moves: </span> {moves}
        </p>
        <p className="moves">
          <span>Best score: </span> {bestScore}
        </p>
      </div>
      <div className="restart-game">
        <button onClick={handleStartGame}>Restart</button>
      </div>
    </>
  );
}

export default Board;
