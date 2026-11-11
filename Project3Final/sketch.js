const PREVIEW_SIZE = 600;

const EXPORT_WIDTH = 3300;
const EXPORT_HEIGHT = 5100;


const palette = [
  "#91B98D",
  "#E5C079",
  "#D2BF58",
  "#8CBEB2",
  "#FFB70A",
  "#BDBEDC",
  "#DD4F5B",
  "#10B662",
  "#E39250",
  "#F1857B",
  "#6EC5E9",
  "#C5EFF7",
  "#BE90D4",
  "#29F1C3"
];


let universe;


function setup() {

  createCanvas(
    PREVIEW_SIZE,
    PREVIEW_SIZE
  );

  noLoop();

  generateNewUniverse();
}

function draw() {}


function createUniverse() {

  universe = {};

  universe.sun = {
    size: random(50, 100),
    color: random(palette)
  };


  universe.stars = [];

  for (let i = 0; i < 800; i++) {

    universe.stars.push({
      x: random(),
      y: random(),
      size: random(1, 3),
      opacity: random(50, 255)
    });
  }


  universe.nebula = [];

  for (let i = 0; i < 15; i++) {

    universe.nebula.push({
      x: random(),
      y: random(),
      size: random(120, 280),
      color: random(palette)
    });
  }


  universe.planets = [];

  let orbitRadius =
    universe.sun.size + 40;

  const planetCount =
    floor(random(5, 9));

  for (let i = 0; i < planetCount; i++) {

    universe.planets.push({

      orbitRadius: orbitRadius,

      angle: random(TWO_PI),

      size: random(10, 30),

      color: random(palette)

    });

    orbitRadius +=
      random(35, 60);
  }
}



function generateArtwork(g) {

  const scaleX =
    g.width / PREVIEW_SIZE;

  const scaleY =
    g.height / PREVIEW_SIZE;

  drawBackground(g);

  drawNebula(
    g,
    scaleX,
    scaleY
  );

  drawStars(
    g,
    scaleX,
    scaleY
  );

  const centerX =
    g.width / 2;

  const centerY =
    g.height / 2;

  drawSun(
    g,
    centerX,
    centerY,
    universe.sun.size * scaleX,
    universe.sun.color
  );

  universe.planets.forEach(
    planet => {

      drawOrbit(
        g,
        centerX,
        centerY,
        planet.orbitRadius * scaleX,
        scaleX
      );

      const px =
        centerX +
        planet.orbitRadius *
        scaleX *
        cos(planet.angle);

      const py =
        centerY +
        planet.orbitRadius *
        scaleX *
        sin(planet.angle);

      drawPlanet(
        g,
        px,
        py,
        planet.size * scaleX,
        planet.color
      );
    }
  );

  drawBorder(
    g,
    scaleX
  );
}



function drawBackground(g) {

  for (let y = 0; y < g.height; y++) {

    let t =
      map(
        y,
        0,
        g.height,
        0,
        1
      );

    let c =
      lerpColor(
        color(8, 12, 22),
        color(20, 30, 50),
        t
      );

    g.stroke(c);

    g.line(
      0,
      y,
      g.width,
      y
    );
  }
}



function drawNebula(
  g,
  scaleX,
  scaleY
) {

  g.noStroke();

  universe.nebula.forEach(
    cloud => {

      let c =
        color(
          cloud.color
        );

      c.setAlpha(20);

      g.fill(c);

      g.circle(
        cloud.x * g.width,
        cloud.y * g.height,
        cloud.size * scaleX
      );
    }
  );
}



function drawStars(
  g,
  scaleX,
  scaleY
) {

  g.noStroke();

  universe.stars.forEach(
    star => {

      g.fill(
        255,
        star.opacity
      );

      g.circle(
        star.x * g.width,
        star.y * g.height,
        star.size * scaleX
      );
    }
  );
}



function drawSun(
  g,
  x,
  y,
  size,
  col
) {

  let glow =
    color(col);

  glow.setAlpha(60);

  g.fill(glow);
  g.noStroke();

  g.circle(
    x,
    y,
    size * 3
  );

  g.fill(col);

  g.circle(
    x,
    y,
    size
  );
}


function drawOrbit(
  g,
  x,
  y,
  radius,
  scale
) {

  g.noFill();

  g.stroke(
    255,
    120
  );

  g.strokeWeight(
    1.5 * scale
  );

  g.circle(
    x,
    y,
    radius * 2
  );
}


function drawPlanet(
  g,
  x,
  y,
  size,
  col
) {

  g.noStroke();

  g.fill(
    0,
    40
  );

  g.circle(
    x + size * 0.15,
    y + size * 0.15,
    size * 1.2
  );

  g.fill(col);

  g.circle(
    x,
    y,
    size
  );
}


function drawBorder(
  g,
  scale
) {

  g.noFill();

  g.stroke(255);

  g.strokeWeight(
    6 * scale
  );

  g.rect(
    10 * scale,
    10 * scale,
    g.width - (20 * scale),
    g.height - (20 * scale)
  );
}



function generateNewUniverse() {

  createUniverse();

  clear();

  generateArtwork(window);
}

function saveArtwork() {

  const exportGraphic =
    createGraphics(
      EXPORT_WIDTH,
      EXPORT_HEIGHT
    );

  generateArtwork(
    exportGraphic
  );

  save(
    exportGraphic,
    "telescopr-tabloid.png"
  );
}