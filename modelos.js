let ATOMIC_MODEL;
let MODEL = 0;
let CURR_ORBIT = 1;

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
  const name = document.getElementById("name");
  const border = document.getElementById("border-bot");
  const lambda = document.getElementById("lambda");

  if ((event.type === "keydown" && event.keyCode === 13) || (event.type === "click" && event.button === 0)) {
    handleAction();
  }

  function handleAction() {
    switch (MODEL) {
      case 0:
        ATOMIC_MODEL.updateToThomsonModel();
        name.textContent = "Thomson";
        break;
      case 1:
        ATOMIC_MODEL.updateToRutherfordModel();
        name.textContent = "Rutherford";
        break;
      case 2:
        ATOMIC_MODEL.updateToBohrModel();
        name.textContent = "Bohr";
        lambda.style.opacity = 1;
        break;
      case 3:
        ATOMIC_MODEL.updateToDaltonModel();
        name.textContent = "Dalton";
        name.style.color = "#fff";
        lambda.style.opacity = 0;
        border.style.borderBottom = "10px dashed red";
        break;
    }
  }
}

class Atom {
  constructor() {
    this.total = 25;
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
    this.total = 50;
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
    this.total = 10;
    this.atom = this.createAtom();
    this.draw();
  }

  updateToBohrModel() {
    MODEL = 3;
    this.radius = 5;
    this.atom = this.createAtom();
    this.draw();
    CURR_ORBIT = 1;
  }

  eletronsTModel() {
    const smallSpheres = [];
    const numSmallSpheres = 50;
    const radius = this.radius;

    const phiOffset = Math.PI / numSmallSpheres; 
    const thetaOffset = Math.PI * (3.0 - Math.sqrt(5.0)); 

    for (let i = 0; i < numSmallSpheres; i++) {
      const y = 1 - (i / (numSmallSpheres - 1)) * 2; 
      const radiusAtY = Math.sqrt(1 - y * y) * radius; 

      const phi = i * phiOffset; 
      const theta = i * thetaOffset;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      smallSpheres.push(createVector(x, y * radius, z));
    }

    return smallSpheres;
  }

  rydbergFormula(nf, ni) {
    const RH = 3.29;
    const v = RH * (1/nf**2 - 1/ni**2);
    const wavelength = (2.998/v) * 10**2;
    return wavelength;
  }

  wavelengthToRGB(wavelength) {
    if (wavelength <= 435) {
      return "rgb(125, 0, 255)"; // violet
    }
    if (wavelength <= 500) {
      return "rgb(0, 110, 250)"; // blue
    }
    if (wavelength <= 565) {
      return "rgb(0,255,0)"; // green
    }
    if (wavelength <= 625) {
      return "rgb(255,165,0)"; // orange
    }
    if (wavelength > 625) {
      return "rgb(255, 0,0)"; // red
    }
  }

  drawOrbit(radius, vertices) {
    beginShape();
    stroke(160, 160, 160);
    noFill();
    const numVertices = vertices;
    for (let i = 0; i < numVertices; i++) {
      const angle = map(i, 0, numVertices, 0, TWO_PI);
      const x = radius * cos(angle);
      const y = radius * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    noStroke();
  } 

  drawElectronOrbits(numElectrons, orbits) {
    const border = document.getElementById("border-bot");
    const name = document.getElementById("name");
    const lambda = document.getElementById("lambda_value");
    let eletron_size = 10;
    let modifier = 25;
    let tan_velocity = 0.00008;
    const vertices = 100;
    let electrons;

    numElectrons += 1;
    orbits += 1;

    if (MODEL === 3) {
      modifier = 15;
      eletron_size = 10;
      tan_velocity = 0.003;
    }

    for (let n = 1; n < orbits; n++) {
      this.drawOrbit(n ** 1.5 * modifier, vertices, red, green, blue);
    }

    fill(255);
    let time = millis() * tan_velocity;
    let angles = [];

    for (let i = 1; i < numElectrons; i++) {
      electrons = 1;
      if (MODEL === 2) {
        electrons = i + 3;
      }

      if (MODEL === 3) {
        if (random() > 0.99) {
          if (CURR_ORBIT > 1) {
            const new_orbit = int(random(1, CURR_ORBIT - 1));
            const wavelength = this.rydbergFormula(new_orbit, CURR_ORBIT);
            CURR_ORBIT = new_orbit;
            const rgbValue = this.wavelengthToRGB(wavelength);
            border.style.borderBottom = `10px dashed ${rgbValue}`;
            name.style.color = `${rgbValue}`;
            lambda.textContent = int(wavelength);
          }
          else {
            const new_orbit = int(random(1, 8))
            if (CURR_ORBIT != new_orbit) {
              CURR_ORBIT = new_orbit;
            }
          }
        }
        else {
          CURR_ORBIT = CURR_ORBIT;
        }
      } else {
        CURR_ORBIT = i;
      }

      angles[i] = -(time * electrons ** 2);
      const x = (CURR_ORBIT ** 1.5) * modifier * sin(angles[i]);
      const y = (CURR_ORBIT ** 1.5) * modifier * cos(angles[i]);
      const z = 0;
      push();
      translate(x, y, z * random(i, 10));
      circle(0, 0, eletron_size);
      pop();
      angles[i] += 0.01 * (i + 1);
    }
  }

  draw() {
    background(0, 0);
    rotateY(this.angX);
    rotateX(this.angY);
    ambientLight(255);
    fill(70, 10, 10);
    noStroke();

    for (let i = 0; i < this.total; i++) {
      if (MODEL < 2 & i % 5 == 0){ 
        fill(i *1.3 + 70, i * 1.2 + 10, i*1.2 + 10);
      }
      beginShape(QUAD_STRIP);
      for (let j = 0; j < this.total + 1; j++) {
        let v1 = this.atom[i][j];
        vertex(v1.x, v1.y, v1.z);
        let v2 = this.atom[i + 1][j];
        vertex(v2.x, v2.y, v2.z);
      }
      endShape(CLOSE);
    }
    
    if (MODEL === 1) {
      fill(255, 255, 255);
      for (const smallSphere of this.eletrons) {
        push();
        translate(smallSphere.x, smallSphere.y, smallSphere.z);
        sphere(10);
        pop();
      }
    }
    if (MODEL === 2) {
      this.drawElectronOrbits(5, 5);
    }
    if (MODEL === 3) {
      this.drawElectronOrbits(1, 7)
    }
    if (MODEL < 2) {
      this.angX += 0.015;
      this.angY += 0.01;
    }
    else {
      this.angY = 0.0;
      this.angX = 0.0;
    }
  }
}
