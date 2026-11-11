const PREVIEW_SIZE = 600;

const EXPORT_WIDTH = 3300;
const EXPORT_HEIGHT = 5100;

const MARGIN = 150;

let universe;

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

function setup() {

  createCanvas(
    PREVIEW_SIZE,
    PREVIEW_SIZE
  );

  noLoop();

  generateNewUniverse();
}

function draw(){}

// ------------------
// CREATE DATA
// ------------------

function createUniverse() {

  universe = {};

  universe.sun = {
    size: random(50,100),
    color: random(palette)
  };

  universe.stars = [];

  for(let i=0;i<800;i++){

    universe.stars.push({

      x: random(),
      y: random(),

      size: random(1,3),

      opacity: random(
        80,
        255
      )

    });
  }

  universe.nebula = [];

  for(let i=0;i<15;i++){

    universe.nebula.push({

      x: random(),
      y: random(),

      size: random(
        120,
        280
      ),

      color: random(palette)

    });
  }

  universe.planets = [];

  let orbitRadius =
    universe.sun.size + 40;

  let count =
    floor(random(6,10));

  for(let i=0;i<count;i++){

    universe.planets.push({

      orbitRadius,

      angle:
        random(TWO_PI),

      size:
        random(10,30),

      color:
        random(palette)

    });

    orbitRadius +=
      random(35,60);
  }
}

// ------------------
// DRAW ART
// ------------------

function generateArtwork(g){

  let contentX = 0;
  let contentY = 0;
  let contentW = g.width;
  let contentH = g.height;

  if(g.width === EXPORT_WIDTH){

    contentX = MARGIN;
    contentY = MARGIN;

    contentW =
      EXPORT_WIDTH -
      MARGIN * 2;

    contentH =
      EXPORT_HEIGHT -
      MARGIN * 2;
  }

  drawBackground(g);

  drawNebula(
    g,
    contentX,
    contentY,
    contentW,
    contentH
  );

  drawStars(
    g,
    contentX,
    contentY,
    contentW,
    contentH
  );

  let centerX =
    contentX +
    contentW / 2;

  let centerY =
    contentY +
    contentH / 2;

  let scale =
    contentW /
    PREVIEW_SIZE;

  drawSun(
    g,
    centerX,
    centerY,
    universe.sun.size * scale,
    universe.sun.color
  );

  for(let planet of universe.planets){

    let r =
      planet.orbitRadius *
      scale;

    drawOrbit(
      g,
      centerX,
      centerY,
      r,
      scale
    );

    let px =
      centerX +
      r *
      cos(
        planet.angle
      );

    let py =
      centerY +
      r *
      sin(
        planet.angle
      );

    drawPlanet(
      g,
      px,
      py,
      planet.size *
      scale,
      planet.color
    );
  }

  drawBorder(
    g,
    contentX,
    contentY,
    contentW,
    contentH,
    scale
  );
}

function drawBackground(g){

  for(let y=0;y<g.height;y++){

    let c =
      lerpColor(
        color(8,12,22),
        color(20,30,50),
        y/g.height
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
  x,
  y,
  w,
  h
){

  g.noStroke();

  universe.nebula.forEach(
    cloud=>{

      let c =
        color(
          cloud.color
        );

      c.setAlpha(20);

      g.fill(c);

      g.circle(
        x + cloud.x*w,
        y + cloud.y*h,
        cloud.size*(w/PREVIEW_SIZE)
      );
    }
  );
}

function drawStars(
  g,
  x,
  y,
  w,
  h
){

  g.noStroke();

  universe.stars.forEach(
    star=>{

      g.fill(
        255,
        star.opacity
      );

      g.circle(
        x + star.x*w,
        y + star.y*h,
        star.size*(w/PREVIEW_SIZE)
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
){

  let glow =
    color(col);

  glow.setAlpha(60);

  g.noStroke();

  g.fill(glow);

  g.circle(
    x,
    y,
    size*3
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
){

  g.noFill();

  g.stroke(
    255,
    120
  );

  g.strokeWeight(
    2 * scale
  );

  g.circle(
    x,
    y,
    radius*2
  );
}

function drawPlanet(
  g,
  x,
  y,
  size,
  col
){

  g.noStroke();

  g.fill(
    0,
    40
  );

  g.circle(
    x+size*.15,
    y+size*.15,
    size*1.2
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
  x,
  y,
  w,
  h,
  scale
){

  g.noFill();

  g.stroke(255);

  g.strokeWeight(
    4 * scale
  );

  g.rect(
    x,
    y,
    w,
    h
  );
}

// ------------------
// BUTTONS
// ------------------

function generateNewUniverse(){

  createUniverse();

  clear();

  generateArtwork(window);
}

function saveArtwork(){

  let pg =
    createGraphics(
      EXPORT_WIDTH,
      EXPORT_HEIGHT
    );

  generateArtwork(pg);

  save(
    pg,
    "telescopr-tabloid.png"
  );
}

async function savePDF(){

  let pg =
    createGraphics(
      EXPORT_WIDTH,
      EXPORT_HEIGHT
    );

  generateArtwork(pg);

  let img =
    pg.canvas.toDataURL(
      "image/png"
    );

  const { jsPDF } =
    window.jspdf;

  let pdf =
    new jsPDF({

      orientation:"portrait",

      unit:"in",

      format:[
        11,
        17
      ]

    });

  pdf.addImage(

    img,

    "PNG",

    0.5,
    0.5,

    10,
    16

  );

  pdf.save(
    "telescope-poster-tabloid.pdf"
  );
}