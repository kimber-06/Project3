let video;

/* state variable
   false - no snapshot has been taken
   true - snapshot was taken */
let snapped = false;

let gradient1ColorPicker;
let gradient2ColorPicker;
let filterSelect; 
let clearButton;  // Button to clear out drawn flares
let saveButton;   // Button to download the image

// Variables to keep track of multiple lens flares
let snapshotImage; 
let flares = [];

// Performance buffer for instant duotone processing
let duotoneBuffer;

function setup() {
  createCanvas(640, 480);
  // Set the colorMode to HSB instead of RGB
  colorMode(HSB, 360, 100, 100);

  // Instantiate the VIDEO object and hide the default HTML element overlay
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide(); // Properly hides the extra video box below the canvas

  // Create an offscreen canvas buffer for handling the duotone filter instantly
  duotoneBuffer = createGraphics(640, 480);

  // Create a button with "snap" text on it
  let snapButton = createButton("snap");
  snapButton.position(10, height + 10);

  // When we click the snap button, run the takeSnap function
  snapButton.mouseClicked(takeSnap);

  gradient1ColorPicker = createColorPicker("blue");
  gradient1ColorPicker.position(70, height + 10);
  
  gradient2ColorPicker = createColorPicker("orange"); 
  gradient2ColorPicker.position(130, height + 10); 

  // Whenever the user shifts the color picker sliders, instantly re-render the scene
  gradient1ColorPicker.input(renderScene);
  gradient2ColorPicker.input(renderScene);

  // Create the dropdown menu for filters
  filterSelect = createSelect();
  filterSelect.position(190, height + 10);
  filterSelect.option("Normal");
  filterSelect.option("Grayscale");
  filterSelect.option("Negative");
  filterSelect.option("Dynamic Duotone"); 
  filterSelect.selected("Normal"); // Set default option
  
  // Whenever the user changes the filter dropdown, trigger a redraw
  filterSelect.changed(renderScene);

  // Create a button to clear flares off the canvas
  clearButton = createButton("clear flares");
  clearButton.position(325, height + 10);
  clearButton.mouseClicked(clearFlares);

  // Create a button to save the current canvas
  saveButton = createButton("save photo");
  saveButton.position(415, height + 10);
  saveButton.mouseClicked(saveCanvasPhoto);
}

function draw() {
  // If we haven't snapped a photo yet, keep showing the live video camera
  if (!snapped) {
    image(video, 0, 0);
  }
}

// When the user clicks the canvas, save the new flare location and rebuild the screen
function mousePressed() {
  // Ensure clicks happen on the canvas and not on the UI controls below it
  if (snapped === true && mouseY < height) {
    // Add the new flare's coordinates and random sizes/colors to our tracking array
    flares.push({
      x: mouseX,
      y: mouseY,
      diameter: random(50, 200),
      h: random(150, 360)
    });
    
    // Re-render everything in the correct order
    renderScene();
  }
}

/* Freeze the current video frame on the canvas, save it as an image, and clear the video stream */
function takeSnap() {
  if (snapped === false) {
    // 1. Draw the video onto the canvas one final time
    image(video, 0, 0);
    
    // 2. Capture the current canvas pixels and store it as a permanent graphic image asset
    snapshotImage = get(0, 0, width, height);
    
    snapped = true;
    video.remove(); // Delete the camera object to save computer memory
    
    // 3. Draw our starting filter over the newly frozen image
    renderScene();
  }
}

// Empties the flare collection array and updates the display instantly
function clearFlares() {
  if (snapped) {
    flares = []; // Reset the tracking array back to empty
    renderScene(); // Redraw the scene without any flares
  }
}

// Saves out a JPEG of whatever is currently showing on the canvas
function saveCanvasPhoto() {
  if (snapped) {
    saveCanvas("my-generative-portrait", "jpg");
  }
}

// THE ENGINE: Clears the screen, applies the background filter, and stacks flares on top
function renderScene() {
  if (!snapped) return;

  // Step 1: Draw a fresh, clean copy of the original photograph
  blendMode(BLEND);
  image(snapshotImage, 0, 0);

  // Step 2: Apply whichever filter is currently selected in the dropdown menu
  let selected = filterSelect.value();
  if (selected === "Grayscale") {
    filter(GRAY);
  } else if (selected === "Negative") {
    filter(INVERT);
  } else if (selected === "Dynamic Duotone") {
    hardwareDuotoneFilter();
  }

  // Step 3: Draw all saved lens flares on top using the LIGHTEST blending mode
  blendMode(LIGHTEST);
  for (let i = 0; i < flares.length; i++) {
    drawSingleFlare(flares[i]);
  }
  
  // Reset blend mode back to normal
  blendMode(BLEND);
}

// Helper function to render a single flare from our array data
function drawSingleFlare(f) {
  noStroke(); 
  let currentHue = f.h;
  for (let d = f.diameter; d > 0; d -= 1) {
    fill(currentHue, 90, 90);
    circle(f.x, f.y, d);
    currentHue = (currentHue + 1) % 360;
  }
}

// Zero-lag hardware-accelerated duotone replacement
function hardwareDuotoneFilter() {
  // Convert our photo to grayscale first so colors tint accurately
  filter(GRAY);
  
  // Clear out our off-screen engine buffer
  duotoneBuffer.clear();
  
  // Build a custom gradient block map inside the off-screen buffer
  let ctx = duotoneBuffer.drawingContext;
  let gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, gradient1ColorPicker.value());
  gradient.addColorStop(1, gradient2ColorPicker.value());
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Composite target mask overlay trick: multiples colors directly on your screen pixels instantly
  blendMode(MULTIPLY);
  image(duotoneBuffer, 0, 0);
  blendMode(BLEND);
}

