const colors = [
    { index: 0, rgb: "rgb(255, 0, 0)" },            // Red
    { index: 1, rgb: "rgb(0, 255, 0)" },            // Lime Green
    { index: 2, rgb: "rgb(0, 0, 255)" },            // Blue
    { index: 3, rgb: "rgb(255, 255, 0)" },          // Yellow
    { index: 4, rgb: "rgb(0, 255, 255)" },          // Cyan
    { index: 5, rgb: "rgb(255, 0, 255)" },          // Magenta
    { index: 6, rgb: "rgb(255, 165, 0)" },          // Orange
    { index: 7, rgb: "rgb(128, 0, 128)" },          // Purple
    { index: 8, rgb: "rgb(0, 128, 128)" },          // Teal
    { index: 9, rgb: "rgb(255, 192, 203)" },        // Pink
    { index: 10, rgb: "rgb(128, 128, 0)" },         // Olive
    { index: 11, rgb: "rgb(0, 0, 128)" },           // Navy
    { index: 12, rgb: "rgb(255, 215, 0)" },         // Gold
    { index: 13, rgb: "rgb(128, 0, 0)" },           // Maroon
    { index: 14, rgb: "rgb(64, 224, 208)" },        // Turquoise
    { index: 15, rgb: "rgb(230, 230, 250)" },       // Lavender
    { index: 16, rgb: "rgb(85, 107, 47)" },         // Dark Olive Green
    { index: 17, rgb: "rgb(255, 105, 180)" },       // Hot Pink
    { index: 18, rgb: "rgb(70, 130, 180)" },        // Steel Blue
    { index: 19, rgb: "rgb(240, 230, 140)" },       // Khaki
    { index: 20, rgb: "rgb(139, 0, 0)" },           // Dark Red
    { index: 21, rgb: "rgb(0, 191, 255)" },         // Deep Sky Blue
    { index: 22, rgb: "rgb(255, 127, 80)" },        // Coral
    { index: 23, rgb: "rgb(34, 139, 34)" },         // Forest Green
    { index: 24, rgb: "rgb(204, 204, 255)" },       // Periwinkle
    { index: 25, rgb: "rgb(65, 105, 225)" },        // Royal Blue
    { index: 26, rgb: "rgb(139, 69, 19)" },         // Saddle Brown
    { index: 27, rgb: "rgb(255, 99, 71)" },         // Tomato
    { index: 28, rgb: "rgb(0, 255, 127)" },         // Spring Green
    { index: 29, rgb: "rgb(30, 144, 255)" }         // Dodger Blue
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
            img.src = 'winner.png';
            document.body.append(img);
        }
        img.style.display = 'block'; // Show the image
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
    const weightedCells = calculatePercentages(playedColors); // Get the weighted percentages based on age
    const totalCells = 64; // Total number of cells
    const percentage = Math.floor(Math.random() * 16) + 10; // Random percentage between 10 and 25%
    const realNum = percentage / 100;
    const numOfCells = Math.max(1, Math.floor(totalCells * realNum)); // Determine how many cells to change
    const selectedCells = [];

    function weightedRandomCell() {
        // Create an array of cumulative weights
        let cumulativeWeights = [];
        let sum = 0;

        for (let color of weightedCells) {
            sum += color.percentage;
            cumulativeWeights.push(sum);
        }

        // Pick a random number between 0 and 100
        const rand = Math.random() * 100;

        // Find the index where the random number fits in the cumulative weights
        for (let i = 0; i < cumulativeWeights.length; i++) {
            if (rand < cumulativeWeights[i]) {
                return playedColors[i];
            }
        }
    }

    while (selectedCells.length < numOfCells) {
        // Pick a random color based on the weights
        let nextColor = weightedRandomCell();

        // Pick a random cell index matching that color
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

    // Hide the image
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

        // Create the image element
        let img = document.querySelector('#gameOverImage');
        if (!img) {
            img = document.createElement('img');
            img.id = 'gameOverImage';
            img.src = 'game_over.png';
            document.body.append(img);
        }
        img.style.display = 'block'; // Show the image

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
    let num = playedColors.length;
    for (let color of playedColors) {
        color.weight = num;
        num--;
    }
}
let sumOfWeights = 0;
