let ATOMIC_MODEL;
let MODEL = 0

class Atom {
  constructor() {
    this.total = 30;
    this.radius = 250;
    this.angX = 0;
    this.angY = 225;
    this.atom = this.createAtom();
    this.eletrons = this.eletronsTModel();
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

  updateToDaltonModel() {
    MODEL = 0;
    this.radius = 250;
    this.atom = this.createAtom();
    this.draw;
  }

  updateToThomsonModel() {
      MODEL = 1;
      this.draw();
  }

  updateToRutherfordModel () {
    MODEL = 2;
    this.radius = 10;
    this.atom = this.createAtom();
    this.draw();
  }

  eletronsTModel() {
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
      if (i % 3 === 0) {
        fill(i + 50 * 1.4, i + 5.5 * 1.1, i*1.2 + 10)
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
    
    if (MODEL === 1) {
      fill(255, 255, 255);
      for (const smallSphere of this.eletrons) {
        push();
        translate(smallSphere.x, smallSphere.y, smallSphere.z);
        sphere(15);
        pop();
      }
    } 
    else if (MODEL === 2) {
      const numElectrons = 5; // Number of electrons
      let time = millis() * 0.00005; // Adjust this multiplier to control the speed
      let angles = [];

       for (let i = 1; i < numElectrons; i++) {
        const electronOrbitRadius = 150 + (i**2) * 15;
        const electron_inv_pos = numElectrons - i;
       
        if (i % 2 === 0) {
          angles[i] = time * (electron_inv_pos**2 + 100); // Adjust the time multiplier to control the speed
        } else {
          angles[i] = -(time * (electron_inv_pos**2 + 100));
        }

        const x = electronOrbitRadius * sin(angles[i]);
        const y = electronOrbitRadius * cos(angles[i]);
        const z = 0;
        
        fill(255, 255, 255);
        push();
        translate(x, y, z * random(i, 10));
        sphere(5); // Draw electrons as spheres
        pop();

        angles[i] += 0.01 * (i + 1);
      }
    }
    if (MODEL !== 2) {
      this.angX += 0.015;
      this.angY += 0.01;
    }
    else {
      this.angX += 0.01;
      this.angY += 0.01;
    }
  }
}

function setup() {
  const container = document.getElementById('canvas-container');
  const canvas = createCanvas(container.offsetWidth, container.offsetHeight, WEBGL);
  canvas.parent('canvas-container');

  ATOMIC_MODEL = new Atom();
}

function draw() {
  ATOMIC_MODEL.draw();
}

function windowResized() {
  const container = document.getElementById('canvas-container');
  resizeCanvas(container.offsetWidth, container.offsetHeight);
}

function handleUserAction(event) {
  const Heading = document.getElementById("name");
  Heading.style.animation = "none";

  if ((event.type === "keydown" && event.keyCode === 13) || (event.type === "click" && event.button === 0)) {
    handleAction();
  }

  function handleAction() {
    switch (MODEL) {
      case 0:
        ATOMIC_MODEL.updateToThomsonModel();
        Heading.textContent = "Thomson";
        break;
      case 1:
        ATOMIC_MODEL.updateToRutherfordModel();
        Heading.textContent = "Rutherford";
        break;
      case 2:
        ATOMIC_MODEL.updateToDaltonModel();
        Heading.textContent = "Dalton";
        break;
    }
  }
}


