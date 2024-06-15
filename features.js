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
