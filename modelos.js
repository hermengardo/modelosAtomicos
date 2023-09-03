let atomic_model;

class Atom {
  constructor(totalPoints, radius) {
    this.total = totalPoints;
    this.radius = radius;
    this.angX = 0;
    this.angY = 225;
    this.atom = this.createAtom();
    this.eletrons = this.eletronsRModel();
    this.type = 0;
  }

  createAtom() {
    const atom = [];
    for (let i = 0; i < this.total + 1; i++) {
      atom[i] = [];
      const lat = map(i, 0, this.total, 0, PI);

      for (let j = 0; j < this.total + 1; j++) {
        const lon = map(j, 0, this.total, 0, TWO_PI);

        const x = this.radius * sin(lat) * cos(lon);
        const y = this.radius * sin(lat) * sin(lon);
        const z = this.radius * cos(lat);

        atom[i].push(createVector(x, y, z));
      }
    }
    return atom;
  }

  updateToThomsonModel() {
    if (this.type != 1) {
      this.type = 1;
      this.draw();
    }
  }

  eletronsRModel() {
    const smallSpheres = [];
    const numSmallSpheres = 100;
    const minDistance = 75; 

    for (let i = 0; i < numSmallSpheres; i++) {
      let attempts = 0;
      let validPosition = false;
      let smallSphere;

      while (!validPosition && attempts < 100) {
        const lat = random(0, PI);
        const lon = random(0, TWO_PI);

        const x = this.radius * sin(lat) * cos(lon);
        const y = this.radius * sin(lat) * sin(lon);
        const z = this.radius * cos(lat);

        // Check for collision with existing small spheres
        validPosition = this.isPositionValid(smallSpheres, createVector(x, y, z), minDistance);

        if (validPosition) {
          smallSphere = createVector(x, y, z);
        }

        attempts++;
      }

      if (validPosition) {
        smallSpheres.push(smallSphere);
      }
    }

    return smallSpheres;
  }

  isPositionValid(existingSpheres, newPosition, minDistance) {
    for (const sphere of existingSpheres) {
      const distance = p5.Vector.dist(newPosition, sphere);
      if (distance < minDistance) {
        return false; // Overlapping spheres, position is not valid
      }
    }
    return true; // Position is valid, no overlap
  }

  draw() {
    background(0, 0);
    rotateY(this.angX);
    rotateX(this.angY);
    ambientLight(255);
    noStroke();

    for (let i = 0; i < this.total; i++) {
      if (i %2 == 0) {
        fill(i + 50 * 1.1, i + 5.5 * 1.1, i*1.2 + 10)
      }
      beginShape(QUAD_STRIP);
      for (let j = 0; j < this.total + 1; j++) {
        let v1 = this.atom[i][j];
        vertex(v1.x, v1.y, v1.z);
        let v2 = this.atom[i + 1][j];
        vertex(v2.x, v2.y, v2.z);
      }
      endShape();
    }
    
    if (this.type == 1) {
      for (const smallSphere of this.eletrons) {
        fill(255, 243, 247);
        push();
        translate(smallSphere.x, smallSphere.y, smallSphere.z);
        sphere(15);
        pop();
      }
    }

    this.angX += 0.01;
    this.angY += 0.002;
  }
}

function setup() {
  const container = document.getElementById('canvas-container');
  const canvas = createCanvas(container.offsetWidth, container.offsetHeight, WEBGL);
  canvas.parent('canvas-container');

  atomic_model = new Atom(50, 250);
}

function draw() {
  atomic_model.draw();
}

function windowResized() {
  const container = document.getElementById('canvas-container');
  resizeCanvas(container.offsetWidth, container.offsetHeight);
}

function keyTyped() {
  if (key === "Enter") {
    atomic_model.updateToThomsonModel();
  }
}