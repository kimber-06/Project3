let cols, rows
let gridSize = 50
function setup() {
  createCanvas(600, 600);
    cols = int(width/gridSize)
    rows = int(height/gridSize)
    // noLoop()
    // c1 = color (255, 204, 0);
    // c2 = color(255);
    // setGradient(c1, c2);
}

// function setGradient(c1, c2) {
//   // noprotect
//   noFill();
//   for (var y = 0; y < height; y++) {
//     var inter = map(y, 0, height, 0, 1);
//     var c = lerpColor(c1, c2, inter);
//     stroke(c);
//     line(0, y, width, y);
//   }
// }

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function draw(){;
  background(0);
//   stroke(255)
//   strokeWeight(5)
//   strokeCap(PROJECT)
//   for (let i = 0; i < cols; i++) {
//     for (let j = 0; j < rows; j++) {
//       let x = i * gridSize + gridSize/2
//       let y = j * gridSize + gridSize/2
//       // circle(x, y, gridSize)
//       if (random() > 0.5) {
//         stroke("red")
//         fill("green")
//         // line(x-gridSize/2, y-gridSize/2, x+gridSize/2, y+gridSize/2)
//         square(x-gridSize/2, y-gridSize/2, gridSize * 0.5)
//       } else {
//         stroke("green")
//         fill("purple")
//         // line(x-gridSize/2, y+gridSize/2, x+gridSize/2, y-gridSize/2)
//         square(x, y, gridSize * 0.5)
//       }

      // TRUTCHET TILES
      // noFill()
      // if (random() < 0.5) {
      //   arc(x-gridSize/2, y-gridSize/2, gridSize,gridSize, 0, HALF_PI) // top-left
      //   arc(x+gridSize/2, y+gridSize/2, gridSize,gridSize, PI, PI + HALF_PI) // right-bottom
      // } else {
      //   arc(x-gridSize/2, y+gridSize/2, gridSize,gridSize, -HALF_PI, 0) // bottom-left
      //   arc(x+gridSize/2, y-gridSize/2, gridSize,gridSize, HALF_PI, PI) // top-right
      // }

      
    // }
    
//   }
    for (let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++) {
        let x = i * gridSize + gridSize/2
        let y = j * gridSize + gridSize/2

//         if (i % 2 === 0){
//             noStroke()
//             fill("blue")
//         } else {
//             noFill()
//             strokeWeight(2)
//             stroke("white")
//         }

//         let d = dist(x, y, mouseX, mouseY)
//         let circleSize = map(d, 0, 800, gridSize * 0.2, gridSize)
//         let r = map(x, 0, width, 20, 250)
//         let b = map(y, 0, height, 0, 250)
//         fill(r, 80, b)
//         rectMode(CENTER)
//         rect(x, y, gridSize)
//         fill("orange")
//         circle(x, y, circleSize);
//         }
//     }

push()
    translate(x, y)
    rotate(frameCount/ 200.0)
    fill("#F3DFA2")
    star(0,0,gridSize*0.25, gridSize*0.4, 5)
    pop()

  push();
  translate(width * 0.5, height * 0.5);
  rotate(frameCount / 200.0);
  star(0, 0, 30, 70, 5);
  pop();

  push();
  translate(width * 0.5, height * 0.5);
  rotate(frameCount / 50.0);
  star(0, 0, 30, 70, 5);
  pop();

}


    }
}
