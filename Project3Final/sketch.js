function setup() {
  createCanvas(600, 600);

  // Set angle mode so that atan2() returns angles in degrees
  angleMode(DEGREES);

  describe('Two eyes that follow the cursor.');
}

function draw() {
  background(90);
  
  // Shift origin to the center of the canvas
  translate(width / 2, height / 2);

  // Adjust mouse coordinates to match the translated center origin
  let adjustedMouseX = mouseX - width / 2;
  let adjustedMouseY = mouseY - height / 2;

  //Hair
  fill("black")
  circle(90, -90, 100)
  circle(-90, -90, 100)


  // Ears
  fill(210, 180, 140);
  noStroke();
  circle(-108, 10, 80);
  circle(108, 10, 80);

  // Face
  fill(210, 180, 140);
  noStroke();
  circle(0, 10, 250);

  // Glasses
  noFill();
  stroke('blue');
  strokeWeight(4);
  circle(-50, 0, 80);
  circle(50, 0, 80);

  // Mouth
  fill('red');
  noStroke();
  circle(0, 60, 20);

  // Draw left eye
  let leftX = -50;
  let leftY = 0;
  let leftAngle = atan2(adjustedMouseY - leftY, adjustedMouseX - leftX);

  push();
  translate(leftX, leftY);
  fill(255);
  noStroke();
  ellipse(0, 0, 50, 50);
  rotate(leftAngle);
  fill(0);
  ellipse(12.5, 0, 25, 25);
  pop();

  // Draw right eye
  let rightX = 50;
  let rightY = 0;
  let rightAngle = atan2(adjustedMouseY - rightY, adjustedMouseX - rightX);

  push();
  translate(rightX, rightY);
  fill(255);
  noStroke();
  ellipse(0, 0, 50, 50);
  rotate(rightAngle);
  fill(0);
  ellipse(12.5, 0, 25, 25);
  pop();

  //Hair 

  //Sideburns

  //Sideburn Right
  fill("black")
  triangle(-120, -90, -80, -100, -110, 50);

  fill("black")
  triangle(120, -90, 118, 50, 90, -60);

  //Bang Right
  fill(251,231,161);
  rotate(-70);
  ellipse(80, 10, 80, 180);



 

  //Bang Left
    fill("black");
    rotate(-50)
    ellipse(90, -15, 80, 150);




 

//   // Hat
//   fill("purple");
//   noStroke();
//   ellipse(0, -120, 200, 100);
//   ellipse(0, -80, 250, 40);
}