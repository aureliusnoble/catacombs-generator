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
  'Larkwrayth Prison': { type: '(1)', reward: 1 },
    'The Cavern of Torhak': { type: '(1)', reward: 1 },
      'Stormtryne Hall': { type: '(1)', reward: 1 },
        'Forbidden Ossuary': { type: '(1)', reward: 1 },
          'The Mitholaq Hive': { type: '(1)', reward: 1 },
            'Ruined Sanctuary': { type: '(1)', reward: 1 },
              'Moghath': { type: '(1)', reward: 1 },
                'Chagnar\'s Lair': { type: '(1)', reward: 1 },
                  'Wychward Burrow': { type: '(1)', reward: 1 },
  'The Phaoslay Realm': { type: '(2)', reward: 2 },
  'Krhlot': { type: '(2)', reward: 2 },
  'Shannotul': { type: '(2)', reward: 2 },
  'Monoliths to Xorkarst': { type: '(2)', reward: 2 },
    'Sepulcher of the Sisters': { type: '(2)', reward: 2 },
      'The Covert Monument': { type: '(2)', reward: 2 },
        'Athenoch Mortuary': { type: '(2)', reward: 2 },
          'Lair of the Coramel': { type: '(2)', reward: 2 },
            'Qurlathorm': { type: '(2)', reward: 2 },
  'Amaranth Inn': { type: '(S)', reward: 0 },
  'Alewife Tavern': { type: '(S)', reward: 0 },
  'Althea the Healer': { type: '(S)', reward: 0 },
  'Izchak the Merchant': { type: '(S)', reward: 0 },
  'Catacomb Lord\'s Lair': { type: '(C)', reward: 0 }
};


const levelZeroRooms = ['Bholoth Cemetry', 'The Outer Bailey', 'Abbos Lookout', 'Zotha\'s Gatehouse', 'Oakheart Hall'];
const levelOneRooms = ['Forthstron River', 'The Vermin Hovel', 'The Lava Pools', 'Bloodsworn Crypt', 'The Barracks', 'The Cavern of Torhak', 'The Cavern of Torhak', 'Stormtryne Hall', 'Forbidden Ossuary', 'The Mitholaq Hive', 'Ruined Sanctuary', 'Moghath',  'Chagnar\'s Lair', 'Wychward Burrow'];
const levelTwoRooms = ['The Phaoslay Realm', 'Krhlot', 'Shannotul',  'Monoliths to Xorkarst', 'Sepulcher of the Sisters','The Covert Monument','Athenoch Mortuary', 'Lair of the Coramel', 'Qurlathorm'];
const specialRooms = ['Amaranth Inn', 'Alewife Tavern', 'Althea the Healer', 'Izchak the Merchant', 'Izchak the Merchant'];
const catacombLordRoom = ['Catacomb Lord\'s Lair'];

function restartGame() {
  document.getElementById('game-container').style.display = 'none';
  document.querySelector('.difficulty-menu').style.display = 'block';
  keyCount = 0;
  document.getElementById('key-count').textContent = keyCount;
  flippedRooms = [];
  availableRooms = [];
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.innerHTML = '<div class="lock-icon"></div>';
    card.classList.remove('flipped');
    card.style.border = '1px solid #999';
    card.addEventListener('click', flipCard);
  });
}

document.getElementById('restart-game').addEventListener('click', restartGame);

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
    deck.push(...getRandomRooms(levelOneRooms, 6));
  } else if (difficulty === 'medium') {
    deck.push(...getRandomRooms(levelZeroRoomsExcluded, 1));
    deck.push(...getRandomRooms(levelOneRooms, 6));
  } else if (difficulty === 'hard' || difficulty === 'impossible') {
    deck.push(...getRandomRooms(levelOneRooms, 7));
  }

  return deck;
}

function getRandomRooms(rooms, count) {
  const shuffledRooms = rooms.sort(() => 0.5 - Math.random());
  return shuffledRooms.slice(0, count);
}

function generateMainDeck(difficulty) {
  const deck = [];

  if (difficulty === 'easy') {
    deck.push(...getRandomRooms(levelTwoRooms, 1));
  } else if (difficulty === 'medium') {
    deck.push(...getRandomRooms(levelTwoRooms, 2));
  } else if (difficulty === 'hard') {
    deck.push(...getRandomRooms(levelTwoRooms, 2));
  } else if (difficulty === 'impossible') {
    deck.push(...getRandomRooms(levelTwoRooms, 4));
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
  
    if (difficulty === 'easy') {
    keyCount = 1;
  }

  document.getElementById('key-count').textContent = keyCount;

  const cards = document.querySelectorAll('.card');
  let topLeftRoom;

  if (difficulty === 'impossible') {
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

cards.forEach((card, index) => {
  const position = card.getAttribute('data-position');
  let room;
  let lockNumber = 0;
  let displayText = ''; // Initialize a variable to hold the text to display on the card

  if (position === '4-4') {
    room = catacombLordRoom[0];
    displayText = 'Catacomb Lord\'s Lair'; // Set display text for Catacomb Lord's Lair
    if (difficulty === 'easy') {
      lockNumber = 0;
    } else if (difficulty === 'impossible') {
      lockNumber = 2;
          } else if (difficulty === 'hard') {
          lockNumber = 1;
    } else {
      lockNumber = 0;
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
  }

  card.setAttribute('data-room', room);
  // Apply lock only to rooms with type '(S)' or the Catacomb Lord's Lair '(C)'
  if (roomTypes[room].type === '(S)') {
    lockNumber = 2;
    displayText = 'Special Room'; // Set display text for special rooms
    card.querySelector('.lock-icon').dataset.number = lockNumber;
    card.querySelector('.lock-icon').style.display = 'block';
  } else if (roomTypes[room].type == '(C)') {
    card.querySelector('.lock-icon').dataset.number = lockNumber;
    card.querySelector('.lock-icon').style.display = 'block';
  }
  card.setAttribute('data-lock', lockNumber);
  card.innerHTML = `<div class="back">${displayText}</div>` + card.innerHTML; // Add the display text to the card's HTML
  card.addEventListener('click', flipCard);
});

  updateBorders();
  updateCardCountDisplay();
}


let keyCount = 0;


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



document.getElementById('start-game').addEventListener('click', () => {
  const difficulty = getSelectedDifficulty();
  fillGrid(difficulty);
  document.querySelector('.difficulty-menu').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
});

fillGrid();
