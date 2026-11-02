let particles = []
let num = 90
let scaleValue = 0.5 
let speed = 10

let colorA, colorB, colorC

function setup() {
    createCanvas(600, 600)
    background('#14161F')
    colorA = color('#FFB6B9')
    colorB = color('#F2C14E')
    for (let i = 0; i < num; i++) {
        particles.push(makeParticle())
    }
}

function makeParticle() {
    return {
        x:random(width),
        y:random(height),
        life:random(100, 300)
    }
}

function draw() {
    background( 20, 22, 31, 8)

    for( let i = 0; i < particles.length; i++) {    
        let p = particles[i]

        let n = noise(p.x * scaleValue, p.y * scaleValue,
            frameCount * 0.002)
        let angle = n * TWO_PI * 4

        p.x += cos(angle) * speed
        p.y += sin(angle) * speed

        p.life -= 0

        stroke(lerpColor(colorA, colorB, map(n, 0.3, 0.7, 0, 1, true)))
        strokeWeight(50)
        point(p.x, p.y)

        if(p.life <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
            particles[i] = makeParticle()
        }
    }
}

function mousePressed() {
    colorA = color(random(255), random(255), random(255))
    colorB = color(random(255), random(255), random(255))
}

function keyPressed() {
    if (key == 's') {
        saveCanvas('autonomous', 'png')
    }
}