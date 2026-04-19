const scoreDisplay = document.getElementById("score");
let score = 0;
scoreDisplay.textContent = score.toString();

const playground = document.querySelector("canvas");
playground.width = 300;
playground.height = 300;
const ctx = playground.getContext("2d");
ctx.lineJoin = "round";
ctx.fillStyle = "green";

//Generowanie węża
const startX = 150;
const startY = 150;
let snakeX = startX;
let snakeY = startY;
ctx.fillRect(snakeX, snakeY, 10, 10);
let snakeLocationArr = [{ snakeX, snakeY }];
const showSnake = () => {
  ctx.fillStyle = "green";
  //Usuwanie tyłu węża
  for (let index = 0; index < snakeLocationArr.length; index++) {
    const element = snakeLocationArr[index];
    ctx.clearRect(element.snakeX, element.snakeY, 10, 10);
  }
  //Usuwanie zbędnych elementów tablicy
  while (snakeLocationArr.length > score + 1) {
    snakeLocationArr.pop();
  }
  //Pęta wywołująca węża zależnie od jego długości
  for (let index = 0; index < snakeLocationArr.length; index++) {
    const element = snakeLocationArr[index];
    ctx.fillRect(element.snakeX, element.snakeY, 10, 10);
  }
  //Console log pozycji węża
};

let appleX;
let appleY;
const randomPlaceForApple = () => {
  ctx.fillStyle = "red";
  let validApplePlace = false;
  while (!validApplePlace) {
    appleX = Math.floor(Math.random() * (30 - 0)) * 10;
    appleY = Math.floor(Math.random() * (30 - 0)) * 10;
    if (
      !snakeLocationArr.some((el) => el.snakeX == appleX && el.snakeY == appleY)
    ) {
      validApplePlace = true;
      ctx.fillRect(appleX, appleY, 10, 10);
    }
  }
};
randomPlaceForApple(); //generuje pierwsze jabłko
const snakeAteApple = () => {
  if (appleX == snakeX && appleY == snakeY) {
    score++;
    scoreDisplay.textContent = score.toString();
    randomPlaceForApple();
    clearInterval(gameInterval);
    gameplay();
  }
};

//Przegrana
const resetGame = () => {
  clearInterval(gameInterval);
  snakeX = startX;
  snakeY = startY;
  currentDirection = null;
  isStart = false;
  snakeLocationArr = [{ snakeX, snakeY }];
  score = 0;
  scoreDisplay.textContent = score.toString();
  ctx.clearRect(0, 0, 300, 300);
  randomPlaceForApple();
  ctx.fillStyle = "green";
  ctx.fillRect(startX, startY, 10, 10);
  gameplay();
};
const gameLost = () => {
  //Wyjście poza mapę
  if (snakeX < 0 || snakeX >= 300 || snakeY < 0 || snakeY >= 300) {
    window.alert(
      `Przegrałeś poprzez wyjście poza mapę. Twój wynik to ${score}`,
    );
    resetGame();
    return;
  }
  //wejście głową w ogon
  const snakeHead = snakeLocationArr[0];
  if (
    snakeLocationArr
      .slice(1, snakeLocationArr.length)
      .some(
        (el) => snakeHead.snakeX == el.snakeX && snakeHead.snakeY == el.snakeY,
      )
  ) {
    window.alert(`Przegrałeś poprzez uderzenie w ogon. Twój wynik to ${score}`);
    resetGame();
  }
};

let currentDirection = null;
let lastDirection;
let isStart = false;
const stering = () => {
  //odbieranie informacji o wciśniętej strzałce
  document.addEventListener("keydown", (event) => {
    let pressedKey = event.key.toString();
    if (!pressedKey.startsWith("Arrow")) return;
    if (currentDirection === null) {
      currentDirection = pressedKey;
    } else if (lastDirection === "ArrowDown" && pressedKey !== "ArrowUp") {
      currentDirection = pressedKey;
    } else if (lastDirection === "ArrowUp" && pressedKey !== "ArrowDown") {
      currentDirection = pressedKey;
    } else if (lastDirection === "ArrowLeft" && pressedKey !== "ArrowRight") {
      currentDirection = pressedKey;
    } else if (lastDirection === "ArrowRight" && pressedKey !== "ArrowLeft") {
      currentDirection = pressedKey;
    }
    //Jeśli wciśnięto strzałkę to
    if (currentDirection != null) {
      isStart = true;
    }
  });
};
stering();
let gameInterval;

const gameplay = () => {
  const snakeSpeed = score <= 60 ? 100 - score : 40; // aktualizacja prędkości
  //Zmiana kierunku węża
  gameInterval = setInterval(() => {
    if (!isStart) return;
    switch (currentDirection) {
      case "ArrowRight":
        snakeX += 10;
        lastDirection = "ArrowRight";
        break;
      case "ArrowLeft":
        snakeX -= 10;
        lastDirection = "ArrowLeft";
        break;
      case "ArrowUp":
        snakeY -= 10;
        lastDirection = "ArrowUp";
        break;
      case "ArrowDown":
        snakeY += 10;
        lastDirection = "ArrowDown";
        break;
    }
    snakeLocationArr.unshift({ snakeX, snakeY }); //Dodawanie do tabeli pozycji węża
    snakeAteApple();
    gameLost();
    showSnake();
  }, snakeSpeed);
};
gameplay();