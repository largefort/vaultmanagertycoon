let caps = 0;
let food = 0;
let water = 0;
let vaultNumber = "";
let residents = [];
let rooms = [];
const SPECIAL = ["Strength", "Perception", "Endurance", "Charisma", "Intelligence", "Agility", "Luck"];
const marketplaceItems = [];
const techTree = [
    { id: 1, name: "Improved Food Production", cost: 100, effect: () => { foodProductionRate += 1; } },
    { id: 2, name: "Advanced Water Filtration", cost: 100, effect: () => { waterProductionRate += 1; } },
    { id: 3, name: "Efficient Energy Systems", cost: 150, effect: () => { capsProductionRate += 1; } }
];
let researchedTechs = [];
let foodProductionRate = 5;
let waterProductionRate = 5;
let capsProductionRate = 10;

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
    caps += capsProductionRate;
    food += foodProductionRate;
    water += waterProductionRate;
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
            SPECIAL: generateSPECIAL(),
            health: 100
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
    if (residents.length > 0) {
        const braveResident = residents[Math.floor(Math.random() * residents.length)];
        alert(`${braveResident.name} has handled the ${disaster}`);
        braveResident.health -= Math.floor(Math.random() * 20) + 1; // Reduces health by 1-20
        if (braveResident.health <= 0) {
            alert(`${braveResident.name} has died!`);
            residents = residents.filter(resident => resident.id !== braveResident.id);
        }
        renderResidents();
    } else {
        alert('No residents to handle the disaster!');
    }
}

// Tech Tree Logic
function openTechTree() {
    const techTreeContainer = document.createElement('div');
    techTreeContainer.id = 'tech-tree';
    techTreeContainer.innerHTML = '<h2>Tech Tree</h2><button onclick="closeTechTree()">X</button>';
    techTree.forEach(tech => {
        if (!researchedTechs.includes(tech.id)) {
            const techDiv = document.createElement('div');
            techDiv.className = 'tech';
            techDiv.innerHTML = `<p>${tech.name} - Cost: ${tech.cost} caps</p>`;
            const techButton = document.createElement('button');
            techButton.innerText = 'Research';
            techButton.onclick = () => {
                if (caps >= tech.cost) {
                    caps -= tech.cost;
                    tech.effect();
                    researchedTechs.push(tech.id);
                    updateResources();
                    document.body.removeChild(techTreeContainer);
                } else {
                    alert('Not enough caps to research this technology!');
                }
            };
            techDiv.appendChild(techButton);
            techTreeContainer.appendChild(techDiv);
        }
    });
    techTreeContainer.style.position = 'fixed';
    techTreeContainer.style.top = '20%';
    techTreeContainer.style.left = '20%';
    techTreeContainer.style.width = '60%';
    techTreeContainer.style.background = '#fff';
    techTreeContainer.style.border = '1px solid #000';
    techTreeContainer.style.padding = '20px';
    techTreeContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    techTreeContainer.style.zIndex = '1000';
    document.body.appendChild(techTreeContainer);
}

function closeTechTree() {
    const techTreeContainer = document.getElementById('tech-tree');
    if (techTreeContainer) {
        document.body.removeChild(techTreeContainer);
    }
}

const marketplaceItems = [];

function generateMarketplaceItems() {
    const itemNames = ["Water Purifier", "Food Processor", "Medkit", "Energy Cell", "Weapon"];
    for (let i = 0; i < 5; i++) {
        const item = {
            name: itemNames[Math.floor(Math.random() * itemNames.length)],
            cost: Math.floor(Math.random() * 100) + 50 // Random cost between 50 and 150 caps
        };
        marketplaceItems.push(item);
    }
}

function openMarketplace() {
    generateMarketplaceItems();
    const marketplaceContainer = document.createElement('div');
    marketplaceContainer.id = 'marketplace';
    marketplaceContainer.innerHTML = '<h2>Marketplace</h2><button onclick="closeMarketplace()">X</button>';
    marketplaceItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'market-item';
        itemDiv.innerHTML = `<p>${item.name} - Cost: ${item.cost} caps</p>`;
        const purchaseButton = document.createElement('button');
        purchaseButton.innerText = 'Buy';
        purchaseButton.onclick = () => {
            if (caps >= item.cost) {
                caps -= item.cost;
                // Add logic to handle purchased item
                updateResources();
                document.body.removeChild(marketplaceContainer);
            } else {
                alert('Not enough caps to buy this item!');
            }
        };
        itemDiv.appendChild(purchaseButton);
        marketplaceContainer.appendChild(itemDiv);
    });
    marketplaceContainer.style.position = 'fixed';
    marketplaceContainer.style.top = '20%';
    marketplaceContainer.style.left = '20%';
    marketplaceContainer.style.width = '60%';
    marketplaceContainer.style.background = '#fff';
    marketplaceContainer.style.border = '1px solid #000';
    marketplaceContainer.style.padding = '20px';
    marketplaceContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    marketplaceContainer.style.zIndex = '1000';
    document.body.appendChild(marketplaceContainer);
}

function closeMarketplace() {
    const marketplaceContainer = document.getElementById('marketplace');
    if (marketplaceContainer) {
        document.body.removeChild(marketplaceContainer);
    }
}

function openBreedingMenu() {
    const breedingMenu = document.createElement('div');
    breedingMenu.id = 'breeding-menu';
    breedingMenu.innerHTML = '<h2>Breed Residents</h2><button onclick="closeBreedingMenu()">X</button>';

    const residentsSelect1 = document.createElement('select');
    residents.forEach(resident => {
        const option = document.createElement('option');
        option.value = resident.id;
        option.innerText = resident.name;
        residentsSelect1.appendChild(option);
    });

    const residentsSelect2 = document.createElement('select');
    residents.forEach(resident => {
        const option = document.createElement('option');
        option.value = resident.id;
        option.innerText = resident.name;
        residentsSelect2.appendChild(option);
    });

    const breedButton = document.createElement('button');
    breedButton.innerText = 'Breed';
    breedButton.onclick = () => {
        const parent1Id = parseInt(residentsSelect1.value);
        const parent2Id = parseInt(residentsSelect2.value);
        if (parent1Id !== parent2Id) {
            breedResidents(parent1Id, parent2Id);
            document.body.removeChild(breedingMenu);
        } else {
            alert('Cannot breed the same resident!');
        }
    };

    breedingMenu.appendChild(residentsSelect1);
    breedingMenu.appendChild(residentsSelect2);
    breedingMenu.appendChild(breedButton);

    breedingMenu.style.position = 'fixed';
    breedingMenu.style.top = '20%';
    breedingMenu.style.left = '20%';
    breedingMenu.style.width = '60%';
    breedingMenu.style.background = '#fff';
    breedingMenu.style.border = '1px solid #000';
    breedingMenu.style.padding = '20px';
    breedingMenu.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    breedingMenu.style.zIndex = '1000';
    document.body.appendChild(breedingMenu);
}

function closeBreedingMenu() {
    const breedingMenu = document.getElementById('breeding-menu');
    if (breedingMenu) {
        document.body.removeChild(breedingMenu);
    }
}

function breedResidents(parent1Id, parent2Id) {
    const parent1 = residents.find(resident => resident.id === parent1Id);
    const parent2 = residents.find(resident => resident.id === parent2Id);

    const childName = prompt("Enter the child's name:");
    if (childName) {
        const child = {
            id: residents.length + 1,
            name: childName,
            SPECIAL: generateChildSPECIAL(parent1.SPECIAL, parent2.SPECIAL),
            health: 100,
            isChild: true,
            birthTime: Date.now()
        };
        residents.push(child);
        renderResidents();
        updateResources();
        setTimeout(() => matureChild(child.id), 3600000); // 1 hour in milliseconds
    }
}

function generateChildSPECIAL(parent1SPECIAL, parent2SPECIAL) {
    return SPECIAL.reduce((acc, attr) => {
        acc[attr] = Math.floor((parent1SPECIAL[attr] + parent2SPECIAL[attr]) / 2 + Math.random() * 5);
        return acc;
    }, {});
}

function matureChild(childId) {
    const child = residents.find(resident => resident.id === childId);
    if (child && child.isChild) {
        child.isChild = false;
        alert(`${child.name} has grown up and is now a mature resident!`);
        renderResidents();
    }
}

function saveGame() {
    const gameState = {
        caps,
        food,
        water,
        vaultNumber,
        residents,
        rooms,
        researchedTechs
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
        researchedTechs = gameState.researchedTechs;
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
