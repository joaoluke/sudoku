export const saveVictory = (difficulty, seconds) => {
  const victories = JSON.parse(localStorage.getItem("sudokuVictories")) || [];
  victories.push({ date: new Date().toISOString(), difficulty, seconds });
  localStorage.setItem("sudokuVictories", JSON.stringify(victories));
};
