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

    return colors[color.index].rgb;
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
    points = 0;
    age = 1;
    pointsElem.innerText = points;
    const colorSelect = getRandColor();
    for (let cell of allCells) {
        cell.style.backgroundColor = colorSelect;
    }
    isPlay = true;
    isClickable = true;
    boarderDefault();
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
        setTimeout(() => {
            alert('you lost!');
        }, 150)
        age = 1;
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
        cell.style.borderColor = 'black';
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