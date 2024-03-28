const roomTypes = {
  'Bholoth Cemetry': { type: '(0)', reward: 1 },
  'The Outer Bailey': { type: '(0)', reward: 1 },
  'Abbos Lookout': { type: '(0)', reward: 1 },
  'Zotha\'s Gatehouse': { type: '(0)', reward: 1 },
  'Oakheart Hall': { type: '(0)', reward: 1 },
  'Forthstron River': { type: '(1)', reward: 1 },
  'The Vermin Hovel': { type: '(1)', reward: 1 },
  'The Lava Pools': { type: '(1)', reward: 1 },
  'Bloodsworn Crypt': { type: '(1)', reward: 1 },
  'The Barracks': { type: '(1)', reward: 1 },
  'The Cavern of Torhak': { type: '(1)', reward: 1 },
  'The Destitution': { type: '(2)', reward: 2 },
  'The Ending': { type: '(2)', reward: 2 },
  'The Placeholder': { type: '(2)', reward: 2 },
  'Amaranth Inn': { type: '(S)', reward: 0 },
  'Alewife Tavern': { type: '(S)', reward: 0 },
  'Althea the Healer': { type: '(S)', reward: 0 },
  'Izchak the Merchant': { type: '(S)', reward: 0 },
  'Catacomb Lord\'s Lair': { type: '(C)', reward: 0 }
};


const levelZeroRooms = ['Bholoth Cemetry', 'The Outer Bailey', 'Abbos Lookout', 'Zotha\'s Gatehouse', 'Oakheart Hall'];
const levelOneRooms = ['Forthstron River', 'The Vermin Hovel', 'The Lava Pools', 'Bloodsworn Crypt', 'The Barracks', 'The Cavern of Torhak'];
const levelTwoRooms = ['The Destitution', 'The Ending', 'The Placeholder'];
const specialRooms = ['Amaranth Inn', 'Alewife Tavern', 'Althea the Healer', 'Izchak the Merchant', 'Izchak the Merchant'];
const catacombLordRoom = ['Catacomb Lord\'s Lair'];


function getSelectedDifficulty() {
  const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
  for (const radio of difficultyRadios) {
    if (radio.checked) {
      return radio.value;
    }
  }
}

function generateLevelZeroOneDeck(excludeRoom, difficulty) {
  const deck = [];
  const levelZeroRoomsExcluded = levelZeroRooms.filter(room => room !== excludeRoom);

  if (difficulty === 'easy') {
    deck.push(...getRandomRooms(levelZeroRoomsExcluded, 2));
    deck.push(...getRandomRooms(levelOneRooms, 5));
  } else if (difficulty === 'medium') {
    deck.push(...getRandomRooms(levelZeroRoomsExcluded, 1));
    deck.push(...getRandomRooms(levelOneRooms, 6));
  } else if (difficulty === 'hard' || difficulty === 'impossible') {
    deck.push(...getRandomRooms(levelOneRooms, 6));
  }

  return deck;
}

function getRandomRooms(rooms, count) {
  const shuffledRooms = rooms.sort(() => 0.5 - Math.random());
  return shuffledRooms.slice(0, count);
}

function generateMainDeck(difficulty) {
  const deck = [];

  if (difficulty === 'easy' || difficulty === 'medium') {
    deck.push(...getRandomRooms(levelTwoRooms, 2));
  } else if (difficulty === 'hard') {
    deck.push(...getRandomRooms(levelTwoRooms, 3));
  } else if (difficulty === 'impossible') {
    deck.push(...getRandomRooms(levelTwoRooms, 5));
  }

  deck.push(...specialRooms);
  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
let flippedRooms = [];
let availableRooms = [];
function getRandomRoom(rooms) {
  const randomIndex = Math.floor(Math.random() * rooms.length);
  return rooms[randomIndex];
}

function fillGrid(difficulty) {
  flippedRooms = [];
  availableRooms = [];
  keyCount = 0;
  document.getElementById('key-count').textContent = keyCount;

  const cards = document.querySelectorAll('.card');
  let topLeftRoom;

  if (difficulty === 'hard' || difficulty === 'impossible') {
    topLeftRoom = getRandomRoom(levelOneRooms);
  } else {
    topLeftRoom = getRandomRoom(levelZeroRooms);
  }

  const levelZeroOneDeck = generateLevelZeroOneDeck(topLeftRoom, difficulty);
  const shuffledLevelZeroOneDeck = shuffleDeck(levelZeroOneDeck);

  const room1_2 = shuffledLevelZeroOneDeck.pop();
  const room2_1 = shuffledLevelZeroOneDeck.pop();

  const mainDeck = generateMainDeck(difficulty);
  const combinedDeck = [...shuffledLevelZeroOneDeck, ...mainDeck];
  const shuffledCombinedDeck = shuffleDeck(combinedDeck);

  const level1RoomIndex = shuffledCombinedDeck.findIndex(room => roomTypes[room].type === '(1)');
  const randomLevel1Room = shuffledCombinedDeck[level1RoomIndex];

  cards.forEach((card, index) => {
    const position = card.getAttribute('data-position');
    let room;
    let lockNumber = 0;

    if (position === '4-4') {
      room = catacombLordRoom[0];
      if (difficulty === 'easy') {
        lockNumber = 1;
      } else if (difficulty === 'impossible') {
        lockNumber = 3;
      } else {
        lockNumber = 2;
      }
    } else if (position === '1-1') {
      room = topLeftRoom;
      availableRooms.push('1-1');
    } else if (position === '1-2') {
      room = room1_2;
    } else if (position === '2-1') {
      room = room2_1;
    } else {
      room = shuffledCombinedDeck.pop();
      if (roomTypes[room].type === '(S)' || room === randomLevel1Room) {
        lockNumber = 1;
      }
    }

    card.setAttribute('data-room', room);
    card.setAttribute('data-lock', lockNumber);
    card.addEventListener('click', flipCard);

    if (lockNumber > 0) {
      card.querySelector('.lock-icon').dataset.number = lockNumber;
      card.querySelector('.lock-icon').style.display = 'block';
    }
  });

  updateBorders();
  updateCardCountDisplay();
}

let keyCount = 0;

function incrementKeys() {
  keyCount++;
  document.getElementById('key-count').textContent = keyCount;
}

function updateCardCountDisplay() {
  const level0Count = document.getElementById('level0-count');
  const level1Count = document.getElementById('level1-count');
  const level2Count = document.getElementById('level2-count');
  const specialCount = document.getElementById('special-count');
  const catacombCount = document.getElementById('catacomb-count');

  let level0 = 0;
  let level1 = 0;
  let level2 = 0;
  let special = 0;
  let catacomb = 0;

  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const room = card.getAttribute('data-room');
    const roomType = roomTypes[room].type;

    if (roomType === '(0)') {
      level0++;
    } else if (roomType === '(1)') {
      level1++;
    } else if (roomType === '(2)') {
      level2++;
    } else if (roomType === '(S)') {
      special++;
    } else if (roomType === '(C)') {
      catacomb++;
    }
  });

  level0Count.textContent = level0;
  level1Count.textContent = level1;
  level2Count.textContent = level2;
  specialCount.textContent = special;
  catacombCount.textContent = catacomb;
}

function flipCard() {
  const position = this.getAttribute('data-position');

  if (availableRooms.includes(position)) {
    const room = this.getAttribute('data-room');
    const roomType = roomTypes[room].type;
    const rewardKeys = roomTypes[room].reward;
    const lockNumber = parseInt(this.getAttribute('data-lock'));

    if (keyCount >= lockNumber) {
      keyCount -= lockNumber;
      document.getElementById('key-count').textContent = keyCount;
      this.querySelector('.lock-icon').style.display = 'none';
      this.innerHTML = `${room}<br>${roomType}`;
      this.classList.add('flipped');
      this.removeEventListener('click', flipCard);

      flippedRooms.push(position);
      availableRooms = availableRooms.filter(pos => pos !== position);

      const [x, y] = position.split('-').map(Number);
      const adjacentPositions = [`${x}-${y - 1}`, `${x}-${y + 1}`, `${x - 1}-${y}`, `${x + 1}-${y}`];
      adjacentPositions.forEach(pos => {
        if (!flippedRooms.includes(pos) && !availableRooms.includes(pos)) {
          availableRooms.push(pos);
        }
      });

      updateBorders();

      // Add reward keys to the key tracker
      keyCount += rewardKeys;
      document.getElementById('key-count').textContent = keyCount;
    } else {
      alert('Not enough keys to unlock this room!');
    }
  } else {
    alert('This room is not available to flip yet!');
  }
}

function decrementKeys() {
  if (keyCount > 0) {
    keyCount--;
    document.getElementById('key-count').textContent = keyCount;
  }
}

document.getElementById('decrement-keys').addEventListener('click', decrementKeys);




function updateBorders() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const position = card.getAttribute('data-position');
    if (flippedRooms.includes(position)) {
      card.style.border = '2px solid green';
    } else if (availableRooms.includes(position)) {
      card.style.border = '2px solid blue';
    } else {
      card.style.border = '1px solid #999';
    }
  });
}

document.getElementById('increment-keys').addEventListener('click', incrementKeys);

document.getElementById('start-game').addEventListener('click', () => {
  const difficulty = getSelectedDifficulty();
  fillGrid(difficulty);
  document.querySelector('.difficulty-menu').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
});

fillGrid();
