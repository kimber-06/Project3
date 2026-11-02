let myData;
let runtimeColors = {
    'Over_60_min': "yellow",
    'Over_90_min': "blue",
    'Over_120_min': "purple"
};

async function setup() {
    createCanvas(1000, 400);
    myData = await loadJSON('data.json');
    console.log(myData);
}

function draw() {
    background(220);

    // Ensure data is loaded before drawing
    if (!myData) return;

    for (let i = 0; i < myData.length; i++) {
        let movie = myData[i];
        let x = (i + 1) * 100;
        let y = height / 2; // Position vertically in the center
        let c = runtimeColors[movie.runtime] || "gray"; // Fallback color if unmatched

       
        drawShape(x, y, c, movie.genre);
    }
}



function drawShape(x, y, col, genre) {
    fill(col);
    if (genre === 'Horror') {
        triangle(x - 20, y + 20, x, y - 20, x + 20, y + 20);
    } else if (genre === 'Drama') {
        circle(x, y, 40);
    } else if (genre === 'Comedy'){
        rectMode(CENTER);
        square(x, y, 40);
    } else if (genre === 'Sci-Fi'){
        star(0, 0, 30, 70, 5);
    } else if (genre === 'Documentary'){
        rect(30, 20, 55, 40);
    } else if (genre === 'Action'){
        
    }

}