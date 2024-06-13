let caps = 0;
let food = 0;
let water = 0;
let vaultNumber = "";
let residents = [];
let rooms = [];

const SPECIAL = ["Strength", "Perception", "Endurance", "Charisma", "Intelligence", "Agility", "Luck"];

function formatNumber(num) {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1) + 'B';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + 'M';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + 'K';
    } else {
        return num.toString();
    }
}

function collectResources() {
    caps += 10;
    food += 5;
    water += 5;
    updateResources();
}

function updateResources() {
    document.getElementById('caps').innerText = formatNumber(caps);
    document.getElementById('food').innerText = formatNumber(food);
    document.getElementById('water').innerText = formatNumber(water);
    saveGame();
}

function buildRoom() {
    if (caps >= 50) {
        caps -= 50;
        const room = { id: rooms.length + 1, type: "Room" };
        rooms.push(room);
        renderRooms();
        updateResources();
    } else {
        alert('Not enough caps to build a room!');
    }
}

function renderRooms() {
    const roomsContainer = document.getElementById('rooms');
    roomsContainer.innerHTML = '';
    rooms.forEach(room => {
        const roomDiv = document.createElement('div');
        roomDiv.className = 'room';
        roomDiv.innerText = room.type;
        roomsContainer.appendChild(roomDiv);
    });
}

function addResident() {
    const name = prompt("Enter resident name:");
    if (name) {
        const resident = {
            id: residents.length + 1,
            name: name,
            SPECIAL: generateSPECIAL()
        };
        residents.push(resident);
        renderResidents();
        updateResources();
    }
}

function generateSPECIAL() {
    return SPECIAL.reduce((acc, attr) => {
        acc[attr] = Math.floor(Math.random() * 10) + 1;
        return acc;
    }, {});
}

function renderResidents() {
    const residentsContainer = document.getElementById('residents');
    residentsContainer.innerHTML = '';
    residents.forEach(resident => {
        const residentDiv = document.createElement('div');
        residentDiv.className = 'resident';
        residentDiv.innerText = `${resident.name} (S:${resident.SPECIAL.Strength}, P:${resident.SPECIAL.Perception}, E:${resident.SPECIAL.Endurance}, C:${resident.SPECIAL.Charisma}, I:${resident.SPECIAL.Intelligence}, A:${resident.SPECIAL.Agility}, L:${resident.SPECIAL.Luck})`;
        residentsContainer.appendChild(residentDiv);
    });
}

function openVaultNumberPrompt() {
    const number = prompt("Enter your Vault number:");
    if (number) {
        vaultNumber = number;
        document.getElementById('vault-number').innerText = vaultNumber;
        document.getElementById('welcome-message').innerText = `Welcome to Vault ${vaultNumber}, Overseer!`;
        saveGame();
    }
}

function produceResourcesAutomatically() {
    residents.forEach(resident => {
        caps += resident.SPECIAL.Intelligence;
        food += resident.SPECIAL.Agility;
        water += resident.SPECIAL.Endurance;
    });
    updateResources();
}

function randomDisaster() {
    const disasterChance = Math.random();
    if (disasterChance < 0.1) {
        const disaster = ["Rad-Roach Infestation", "Raider Invasion", "Rad-Scorpion Attack"][Math.floor(Math.random() * 3)];
        alert(`Disaster! ${disaster}`);
        handleDisaster(disaster);
    }
}

function handleDisaster(disaster) {
    // Implement simple logic to handle disasters
    if (residents.length > 0) {
        const braveResident = residents[Math.floor(Math.random() * residents.length)];
        alert(`${braveResident.name} has handled the ${disaster}`);
    } else {
        alert('No residents to handle the disaster!');
    }
}

function saveGame() {
    const gameState = {
        caps,
        food,
        water,
        vaultNumber,
        residents,
        rooms
    };
    localStorage.setItem('falloutTycoonSave', JSON.stringify(gameState));
}

function loadGame() {
    const savedState = localStorage.getItem('falloutTycoonSave');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        caps = gameState.caps;
        food = gameState.food;
        water = gameState.water;
        vaultNumber = gameState.vaultNumber;
        residents = gameState.residents;
        rooms = gameState.rooms;
        document.getElementById('vault-number').innerText = vaultNumber;
        document.getElementById('welcome-message').innerText = `Welcome to Vault ${vaultNumber}, Overseer!`;
        renderRooms();
        renderResidents();
        updateResources();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    setInterval(produceResourcesAutomatically, 5000); // Produces resources every 5 seconds
    setInterval(randomDisaster, 30000); // Checks for disaster every 30 seconds
});
