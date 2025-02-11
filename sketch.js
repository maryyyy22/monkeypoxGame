let playerImg, vaccineImg, virusImg, bgImg;
let player;
let vaccines = [];
let monkeypoxPeople = [];
let isLoaded = false;
let score = 0;
let level = 1;
let health = 100;
let gameWon = false;

function preload() {
  playerImg = loadImage('boy-removebg-preview.png', () => console.log('Player image loaded'), handleImageError);
  vaccineImg = loadImage('vacs-removebg-preview.png', () => console.log('Vaccine image loaded'), handleImageError);
  virusImg = loadImage('virus-removebg-preview.png', () => console.log('Virus image loaded'), handleImageError);
  bgImg = loadImage('back.png', () => {
    console.log('Background image loaded');
    isLoaded = true;
  }, handleImageError);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player();
  frameRate(60);
}

function draw() {
  if (!isLoaded) {
    displayLoading();
    return;
  }

  if (gameWon) {
    displayWinScreen();
    return;
  }

  background(bgImg);
  player.update();
  player.show();

  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 10, 10);
  text('Level: ' + level, width - 150, 10);
  text('Health: ' + health, 10, 40);

  checkLevelUp();

  handleCollisions();
  spawnVaccines();
  spawnMonkeypoxPeople();

  for (let v of vaccines) {
    v.show();
    v.update();
  }

  for (let m of monkeypoxPeople) {
    m.show();
    m.update();
  }

  if (level >= 50) {
    gameWon = true;
  }

  if (health <= 0) {
    gameOver();
  }
}

function touchMoved() {
  player.x = constrain(touchX - player.width / 2, 0, width - player.width);
  player.y = constrain(touchY - player.height / 2, 0, height - player.height);
  return false; // Prevent scrolling
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function displayLoading() {
  textSize(32);
  textAlign(CENTER, CENTER);
  text('Loading...', width / 2, height / 2);
}

function checkLevelUp() {
  if (score >= level * 10) {
    level++;
  }
}

function handleCollisions() {
  for (let i = vaccines.length - 1; i >= 0; i--) {
    if (player.hits(vaccines[i])) {
      score += 10;
      vaccines.splice(i, 1);
    }
  }

  for (let i = monkeypoxPeople.length - 1; i >= 0; i--) {
    if (player.hits(monkeypoxPeople[i])) {
      health -= 10;
      monkeypoxPeople.splice(i, 1);
    }
  }
}

function spawnVaccines() {
  if (frameCount % 60 === 0) {
    vaccines.push(new Vaccine());
  }
}

function spawnMonkeypoxPeople() {
  if (frameCount % 90 === 0) {
    monkeypoxPeople.push(new MonkeypoxPerson());
  }
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 80;
    this.width = 120;
    this.height = 120;
    this.speed = 5;
  }

  update() {
    this.x = constrain(this.x, 0, width - this.width);
    this.y = constrain(this.y, 0, height - this.height);
  }

  show() {
    image(playerImg, this.x, this.y, this.width, this.height);
  }

  hits(obstacle) {
    let d = dist(this.x + this.width / 2, this.y + this.height / 2, obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
    return d < this.width / 2 + obstacle.width / 2;
  }
}

class Vaccine {
  constructor() {
    this.x = random(width);
    this.y = -20;
    this.width = 60;
    this.height = 60;
    this.speed = 3;
  }

  update() {
    this.y += this.speed;
    if (this.y > height) vaccines.splice(vaccines.indexOf(this), 1);
  }

  show() {
    image(vaccineImg, this.x, this.y, this.width, this.height);
  }
}

class MonkeypoxPerson {
  constructor() {
    this.x = random(width);
    this.y = -20;
    this.width = 80;
    this.height = 80;
    this.speed = 2 + level * 0.2;
  }

  update() {
    this.y += this.speed;
    if (this.y > height) monkeypoxPeople.splice(monkeypoxPeople.indexOf(this), 1);
  }

  show() {
    image(virusImg, this.x, this.y, this.width, this.height);
  }
}

function handleImageError() {
  console.error('Error loading image');
  alert('There was an issue loading the images. Please check the file paths.');
}

function gameOver() {
  textSize(64);
  textAlign(CENTER, CENTER);
  fill(255, 0, 0);
  text('GAME OVER', width / 2, height / 2);
  noLoop();
}

function displayWinScreen() {
  textSize(64);
  textAlign(CENTER, CENTER);
  fill(0, 255, 0);
  text('YOU WIN!', width / 2, height / 2);
  noLoop();
}
