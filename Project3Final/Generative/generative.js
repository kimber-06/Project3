let video;


/* state variable
   false - no snapshot has been taken
   true - snapshot was taken */
let snapped = false;

let gradient1ColorPicker;
let gradient2ColorPicker;

function setup() {
  createCanvas(640, 480);
  // Set the colorMode to HSB instead of RGB
  colorMode(HSB, 360, 100, 100);

  // Instantiate the VIDEO object and hide the default HTML element overlay
  video = createCapture(VIDEO);
    video.position( 0, 0);

  // Create a button with "snap" text on it
  let snapButton = createButton("snap");

  // When we click the snap button, run the takeSnap function
  snapButton.mouseClicked(takeSnap);

  blendMode(LIGHTEST);
  noStroke();

  gradient1ColorPicker = createColorPicker("blue");
  gradient2ColorPicker = createColorPicker("orange"); // Fixed typo: gradinet2ColorPicker -> gradient2ColorPicker
}


// Run the gradientFilter function when we press the mouse
function mousePressed() {
  if (snapped === true) {
    gradientFilter();
    lensFlare();
  }
}

/* If we haven’t snapped a photo yet (snapped is false)
   freeze the current video frame on the canvas and update state */
function takeSnap() {
  if (snapped === false) {
    image(video, 0, 0);
    snapped = true;
    video.remove();
  }
}

// Draws circles filled with radial gradients when we click the screen
function lensFlare() {
  noStroke(); // Ensure stroke is off so fill colors render properly
  let diameter = random(50, 200);
  let h = random(150, 360);

  for (let d = diameter; d > 0; d -= 1) {
    fill(h, 90, 90);
    circle(mouseX, mouseY, d);
    h = (h + 1) % 360;
  }
}

// Draws a linear gradient on the screen using a for loop and lerpColor
function gradientFilter() {
  let s = color(gradient1ColorPicker.value());
  let e = color(gradient2ColorPicker.value());

  for (let y = 0; y < height; y += 1) {
    let amt = map(y, 0, height, 0, 1);
    let gradColor = lerpColor(s, e, amt);
    stroke(gradColor);
    line(0, y, width, y);
  }
}


