import React from "react";
import "../styles/NumberPad.css";

const NumberPad = ({ onNumberClick, disabledNumbers }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div>
      <div className="number-pad">
        {numbers.map((num) =>
          disabledNumbers.includes(num) ? null : (
            <button key={num} onClick={() => onNumberClick(num)}>
              {num}
            </button>
          )
        )}
      </div>
      <button className="delete-button" onClick={() => onNumberClick("")}>Delete</button>
    </div>
  );
};

export default NumberPad;
