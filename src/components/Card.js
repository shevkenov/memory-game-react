import React from "react";
import pokeball from "../images/pokeball.png";

function Card({ card, isFlipped, click, index, inActive }) {
  return (
      !inActive ? (
        <div className={isFlipped ? "card is-flipped" : "card"}>
          <div className="card-face front" onClick={() => click(index)}>
            <img src={pokeball} alt="pokeball" />
          </div>
          <div className="card-face back">
            <img src={card.image.default} alt={card.name} />
          </div>
        </div>) : <div></div>
    
  );
}

export default Card;
