let atom;

class Sphere {
  constructor(totalPoints, radius) {
    this.total = totalPoints;
    this.radius = radius;
    this.angX = 0;
    this.angY = 225;
    this.globe = this.createGlobe();
  }

  createGlobe() {
    const globe = [];
    for (let i = 0; i < this.total + 1; i++) {
      globe[i] = [];
      const lat = map(i, 0, this.total, 0, PI);

      for (let j = 0; j < this.total + 1; j++) {
        const lon = map(j, 0, this.total, 0, TWO_PI);

        const x = this.radius * sin(lat) * cos(lon);
        const y = this.radius * sin(lat) * sin(lon);
        const z = this.radius * cos(lat);

        globe[i].push(createVector(x, y, z));
      }
    }
    return globe;
  }

  draw() {
    rotateY(this.angX);
    rotateX(this.angY);
    ambientLight(255);
    noStroke();

    for (let i = 0; i < this.total; i++) {
      if (i % 2 == 0) {
        fill(i*3.5 + 75, i+5, i+10)
      }
      beginShape(TRIANGLE_STRIP);
      for (let j = 0; j < this.total + 1; j++) {
        let v1 = this.globe[i][j];
        vertex(v1.x, v1.y, v1.z);
        let v2 = this.globe[i + 1][j];
        vertex(v2.x, v2.y, v2.z);
      }
      endShape();
    }
    this.angX += 0.01;
    this.angY -= 0.01;
    
  }
}

function setup() {
  const container = document.getElementById('canvas-container');
  const canvas = createCanvas(container.offsetWidth, container.offsetHeight, WEBGL);
  canvas.parent('canvas-container');

  atom = new Sphere(50, 250);
}

function draw() {
  atom.draw();
}

function windowResized() {
  const container = document.getElementById('canvas-container');
  resizeCanvas(container.offsetWidth, container.offsetHeight);
}
