const colors = [
    { name: "Red", hex: "#FF0000" },
    { name: "Lime Green", hex: "#00FF00" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Yellow", hex: "#FFFF00" },
    { name: "Cyan", hex: "#00FFFF" },
    { name: "Magenta", hex: "#FF00FF" },
    { name: "Orange", hex: "#FFA500" },
    { name: "Purple", hex: "#800080" },
    { name: "Teal", hex: "#008080" },
    { name: "Pink", hex: "#FFC0CB" },
    { name: "Olive", hex: "#808000" },
    { name: "Navy", hex: "#000080" },
    { name: "Gold", hex: "#FFD700" },
    { name: "Maroon", hex: "#800000" },
    { name: "Turquoise", hex: "#40E0D0" },
    { name: "Lavender", hex: "#E6E6FA" },
    { name: "Dark Olive Green", hex: "#556B2F" },
    { name: "Hot Pink", hex: "#FF69B4" },
    { name: "Steel Blue", hex: "#4682B4" },
    { name: "Khaki", hex: "#F0E68C" },
    { name: "Dark Red", hex: "#8B0000" },
    { name: "Deep Sky Blue", hex: "#00BFFF" },
    { name: "Coral", hex: "#FF7F50" },
    { name: "Forest Green", hex: "#228B22" },
    { name: "Periwinkle", hex: "#CCCCFF" },
    { name: "Royal Blue", hex: "#4169E1" },
    { name: "Saddle Brown", hex: "#8B4513" },
    { name: "Tomato", hex: "#FF6347" },
    { name: "Spring Green", hex: "#00FF7F" },
    { name: "Dodger Blue", hex: "#1E90FF" }
];

let points = 0;
const pointsElem = document.querySelector('#points');
let playedColors = [];
let playerAt = null;
let isClickable = true; // Add this flag

function getRandColor() {
    let index = Math.floor(Math.random() * colors.length);
    while (playedColors.includes(index)) {
        index = Math.floor(Math.random() * colors.length);
    }
    playedColors.push(index);
    return `${colors[index].hex}`;
}

const allCells = document.querySelectorAll('.cell');
const defaultColor = getRandColor();
for (let cell of allCells) {
    cell.style.backgroundColor = defaultColor;
}

const polotno = document.querySelector(".polotno");
let isPlay = true;

function nextStepCells() {
    const percentage = Math.floor(Math.random() * 16) + 10;
    const realNum = percentage / 100;
    const numOfCells = Math.max(1, Math.floor(64 * realNum));
    const cells = [];
    while (cells.length < numOfCells) {
        let nextCellIndex = Math.floor(Math.random() * 64);
        if (!cells.includes(allCells[nextCellIndex])) {
            cells.push(allCells[nextCellIndex]);
        }
    }
    return cells;
}

polotno.addEventListener('click', () => {
    playedColors = [];
    points = 0; // Reset points when the game restarts
    pointsElem.innerText = points; // Update points display
    const colorSelect = getRandColor();
    for (let cell of allCells) {
        cell.style.backgroundColor = colorSelect;
    }
    isPlay = true;
    isClickable = true; // Reset to clickable
    boarderDefault();
});

function step(playerAt) {
    const cells = nextStepCells();
    const color = getRandColor();

    if (cells.includes(playerAt)) {
        isPlay = false;
        isClickable = false; // Set to unclickable
        setTimeout(() => {
            alert('you lost!');
        }, 150);
        return;
    }

    if (isPlay) {
        for (let cell of cells) {
            cell.style.backgroundColor = color;
        }
        points++; // Increment points
        pointsElem.innerText = points; // Update points display
    }
}

function boarderDefault() {
    for (let cell of allCells) {
        cell.style.borderColor = 'black';
    }
}

for (let cell of allCells) {
    cell.addEventListener('click', (event) => {
        if (!isClickable) return; // Check if clickable before proceeding
        playerAt = event.target;
        boarderDefault();
        playerAt.style.borderColor = 'white';
        step(playerAt);
    });
}
