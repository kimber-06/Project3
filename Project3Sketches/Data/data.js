let myData;

// Iris color for each genre
let genreColors = {
    'Horror': "red",
    'Drama': "orange",
    'Comedy': "gold",
    'Sci-Fi': "mediumpurple",
    'Documentary': "teal",
    'Action': "royalblue",
    'Tragedy': "hotpink"
};

// Eye width for each runtime
let runtimeSizes = {
    'Over_60_min': 80,
    'Over_90_min': 110,
    'Over_120_min': 150
};

// How far the eyelid hangs down (0 = wide open, 1 = shut)
let locationLids = {
    'Theater': 0.05,
    'Streaming': 0.4
};

let months = ['January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'];

async function setup() {
    createCanvas(1000, 600);
    myData = await loadJSON('data.json');
    console.log(myData);

    // Pick a spot for each eye
    randomSeed(7);
    for (let i = 0; i < myData.length; i++) {
        let movie = myData[i];

        let w = runtimeSizes[movie.runtime] || 100;
        let h = w * 0.6;

        // try random spots until one doesn't overlap an eye we already placed
        for (let tries = 0; tries < 500; tries++) {
            movie.x = random(w / 2 + 20, width - w / 2 - 20);
            movie.y = random(h / 2 + 30, height - h / 2 - 20);

            let clear = true;
            for (let j = 0; j < i; j++) {
                let other = myData[j];
                let ow = runtimeSizes[other.runtime] || 100;
                let tooCloseX = abs(movie.x - other.x) < (w + ow) / 2 + 15;
                let tooCloseY = abs(movie.y - other.y) < (h + ow * 0.6) / 2 + 25;
                if (tooCloseX && tooCloseY) clear = false;
            }
            if (clear) break;
        }
    }
}

function draw() {
    background(220);

    // Ensure data is loaded before drawing
    if (!myData) return;

    for (let i = 0; i < myData.length; i++) {
        let movie = myData[i];
        let c = genreColors[movie.genre] || "gray";          // Fallback color if unmatched
        let size = runtimeSizes[movie.runtime] || 100;
        let closed = locationLids[movie.location] ?? 0.2;
        let lashes = months.indexOf(movie.month) + 1;         // January = 1 ... December = 12

        drawEye(movie.x, movie.y, c, size, closed, lashes, i);
    }
}

function drawEye(x, y, col, size, closed, lashes, i) {
    let w = size;
    let h = size * 0.6;

    // blink for a moment every 5 seconds (i makes each eye blink at a different time)
    let t = (millis() / 1000 + i * 0.7) % 5;
    let blink = t < 0.25 ? sin(PI * t / 0.25) : 0;
    let lid = closed + (1 - closed) * blink;

    push();
    translate(x, y);
    stroke(40, 30, 60);
    strokeWeight(3);

    // white of the eye
    fill(255);
    ellipse(0, 0, w, h);

    // iris and pupil look toward the mouse
    let irisR = h * 0.42;
    let dx = mouseX - x;
    let dy = mouseY - y;
    let d = max(1, dist(0, 0, dx, dy));
    let reach = min(1, d / 150);
    let ix = dx / d * reach * (w / 2 - irisR) * 0.8;
    let iy = dy / d * reach * (h / 2 - irisR) * 0.8;

    fill(col);
    circle(ix, iy, irisR * 2);
    noStroke();
    fill(20, 10, 30);
    circle(ix, iy, irisR);
    fill(255);
    circle(ix - irisR * 0.3, iy - irisR * 0.3, irisR * 0.3);

    // eyelid: a slice off the top of the eye
    let r = constrain(-1 + 2 * lid, -1, 0.98);
    stroke(40, 30, 60);
    fill(244, 181, 138);
    arc(0, 0, w, h, PI - asin(r), TWO_PI + asin(r), CHORD);

    // outline on top
    noFill();
    ellipse(0, 0, w, h);

    // eyelashes: one per month number
    strokeCap(ROUND);
    for (let k = 0; k < lashes; k++) {
        let a = lashes === 1 ? PI * 1.5 : map(k, 0, lashes - 1, PI * 1.15, PI * 1.85);
        let lx = cos(a) * w / 2;
        let ly = sin(a) * h / 2;
        line(lx, ly, lx * 1.25, ly * 1.25);
    }
    pop();
}