const colors = [
    { index: 0, rgb: "rgb(244, 67, 54)" },          // Red
    { index: 1, rgb: "rgb(76, 175, 80)" },          // Green
    { index: 2, rgb: "rgb(33, 150, 243)" },         // Blue
    { index: 3, rgb: "rgb(255, 235, 59)" },         // Yellow
    { index: 4, rgb: "rgb(0, 188, 212)" },          // Cyan
    { index: 5, rgb: "rgb(233, 30, 99)" },          // Pink
    { index: 6, rgb: "rgb(255, 152, 0)" },          // Orange
    { index: 7, rgb: "rgb(156, 39, 176)" },         // Purple
    { index: 8, rgb: "rgb(0, 150, 136)" },          // Teal
    { index: 9, rgb: "rgb(255, 193, 7)" },          // Amber
    { index: 10, rgb: "rgb(205, 220, 57)" },        // Lime
    { index: 11, rgb: "rgb(63, 81, 181)" },         // Indigo
    { index: 12, rgb: "rgb(255, 87, 34)" },         // Deep Orange
    { index: 13, rgb: "rgb(121, 85, 72)" },         // Brown
    { index: 14, rgb: "rgb(96, 125, 139)" },        // Blue Grey
    { index: 15, rgb: "rgb(238, 238, 238)" },       // Grey (light)
    { index: 16, rgb: "rgb(158, 158, 158)" },       // Grey (medium)
    { index: 17, rgb: "rgb(97, 97, 97)" },          // Grey (dark)
    { index: 18, rgb: "rgb(3, 169, 244)" },         // Light Blue
    { index: 19, rgb: "rgb(255, 64, 129)" },        // Hot Pink
    { index: 20, rgb: "rgb(255, 160, 0)" },         // Amber Dark
    { index: 21, rgb: "rgb(0, 131, 143)" },         // Cyan Dark
    { index: 22, rgb: "rgb(173, 20, 87)" },         // Deep Pink
    { index: 23, rgb: "rgb(67, 160, 71)" },         // Forest Green
    { index: 24, rgb: "rgb(197, 202, 233)" },       // Lavender
    { index: 25, rgb: "rgb(48, 63, 159)" },         // Royal Blue (Indigo)
    { index: 26, rgb: "rgb(93, 64, 55)" },          // Saddle Brown
    { index: 27, rgb: "rgb(239, 83, 80)" },         // Coral Red
    { index: 28, rgb: "rgb(0, 230, 118)" },         // Spring Green
    { index: 29, rgb: "rgb(41, 121, 255)" }         // Dodger Blue
];

let age = 1;
let points = 0;
const pointsElem = document.querySelector('#points');
let playedColors = [];
let playerAt = null;
let isClickable = true;

function getRandColor() {
    let color = {};
    color.index = Math.floor(Math.random() * colors.length);

    while (playedColors.some(c => c.index === color.index)) {
        color.index = Math.floor(Math.random() * colors.length);
    }

    color.rgb = colors[color.index].rgb;
    color.age = age;
    age++;
    playedColors.push(color);
    if (playedColors.length === 30) {
        let img = document.querySelector('#winner');
        if (!img) {
            img = document.createElement('img');
            img.id = 'winner';
            img.src = 'files/winner.png';
            document.body.append(img);
        }
        img.style.display = 'block';
    }

    return colors[color.index].rgb;
}

const allCells = document.querySelectorAll('.cell');
const defaultColor = getRandColor();
for (let cell of allCells) {
    cell.style.backgroundColor = defaultColor;
}

const polotno = document.querySelector(".polotno");
let isPlay = true;

function calculatePercentages(array) {
    if (!array.length) return [];

    const totalWeight = array.reduce((total, item) => total + item.weight, 0);

    let percentages = array.map(item => ({
        ...item,
        percentage: Math.floor((item.weight / totalWeight) * 100)
    }));

    let percentageSum = percentages.reduce((sum, item) => sum + item.percentage, 0);

    let difference = 100 - percentageSum;

    for (let i = 0; i < difference; i++) {
        percentages[i].percentage += 1;
    }

    return percentages;
}

function nextStepCells() {
    const weightedCells = calculatePercentages(playedColors);
    const totalCells = 64;
    const percentage = Math.floor(Math.random() * 16) + 10;
    const realNum = percentage / 100;
    const numOfCells = Math.max(1, Math.floor(totalCells * realNum));
    const selectedCells = [];

    function weightedRandomCell() {
        let cumulativeWeights = [];
        let sum = 0;

        for (let color of weightedCells) {
            sum += color.percentage;
            cumulativeWeights.push(sum);
        }

        const rand = Math.random() * 100;

        for (let i = 0; i < cumulativeWeights.length; i++) {
            if (rand < cumulativeWeights[i]) {
                return playedColors[i];
            }
        }
    }

    while (selectedCells.length < numOfCells) {
        let nextColor = weightedRandomCell();

        let cellIndex = Math.floor(Math.random() * totalCells);

        if (!selectedCells.includes(allCells[cellIndex])) {
            selectedCells.push(allCells[cellIndex]);
        }
    }

    return selectedCells;
}

polotno.addEventListener('click', () => {
    playedColors = [];
    points = 0;
    age = 1;
    pointsElem.innerText = points;
    const colorSelect = getRandColor();
    for (let cell of allCells) {
        cell.style.backgroundColor = colorSelect;
    }
    isPlay = true;
    isClickable = true;
    sumOfWeights = 0;
    boarderDefault();

    const img = document.querySelector('#gameOverImage');
    if (img) {
        img.style.display = 'none';
    }
    const img2 = document.querySelector('#winner');
    if (img2) {
        img2.style.display = 'none';
    }
});

function step(playerAt) {
    const cells = nextStepCells();
    const color = getRandColor();

    if (cells.includes(playerAt)) {
        for (let cell of cells) {
            cell.style.backgroundColor = color;
        }
        isPlay = false;
        isClickable = false;

        let img = document.querySelector('#gameOverImage');
        if (!img) {
            img = document.createElement('img');
            img.id = 'gameOverImage';
            img.src = 'files/game_over.png';
            document.body.append(img);
        }
        img.style.display = 'block';

        age = 1;
        sumOfWeights = 0;

        return;
    }

    if (isPlay) {
        for (let cell of cells) {
            cell.style.backgroundColor = color;
        }
        weightFunc();
        for (let color of playedColors) {
            if (playerAt.style.backgroundColor === color.rgb) {
                points += (color.weight) - 1;
            }
        }
        pointsElem.innerText = points;
    }
}

function boarderDefault() {
    for (let cell of allCells) {
        cell.style.borderColor = '#1d3557';
    }
}

for (let cell of allCells) {
    cell.addEventListener('click', (event) => {
        if (!isClickable) return;
        playerAt = event.target;
        boarderDefault();
        playerAt.style.borderColor = 'white';
        step(playerAt);
    });
}

function weightFunc() {
    for (let color of playedColors) {
        color.weight = color.age;
    }
}

let sumOfWeights = 0;