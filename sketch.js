// Select the # of Stars (keep <250)
let nStars = 200;

// Create slider's for variables
let timeslider;
let scaleslider;
let sel;
let currentPlanet;

// Gravitational Constant
let G = 6.67408e-11;

// Astronmical Unit
let AU = 1.49598023e11;

// Create some variables to store data about the current scale and the time-step
let scale, deltat

// Create an array to store some frame rate data
let frameC = [];

// Create variables which will hold stars and planets
let planets, stars

let referencebutton;
let geocentric = false;

function setup() {
  // Create a 600 pixel by 600 pixel "Canvas" to draw on.
  createCanvas(windowWidth,windowHeight);
  
  // Create a series of "planets":
  // planet(x-position, y-position, x-velocity, y-velocity, radius, mass, color, name)
  //
  // Value        Unit
  // x-position    AU
  // y-position    AU
  // x-velocity    m/s
  // y-velocity    m/s
  // radius        pixels
  // mass          kg
  // color         string
  // name          string
  Earth = new planet(0, 1, 29780, 0, 10, 5.97237e24, 'green', 'Earth ♁');
  Mercury = new planet(0, 0.387098, 47360, 0, 10, 3.3011e23, 'white', 'Mercury ☿')
  Venus = new planet(0, 0.723332, 35020, 0, 10, 4.8675e24, 'khaki', 'Venus ♀')
  Mars = new planet(0, 1.523679, 24007, 0, 10, 6.4171e23,'red', 'Mars ♂')
  Jupiter = new planet(0, 5.2044, 13070, 0, 14, 1.8982e27, 'salmon', 'Jupiter ♃')
  Saturn = new planet(0, 9.5826, 9680, 0, 16, 5.6834e26, 'burlywood', 'Saturn ♄')
  Uranus = new planet(0, 19.19126, 6800, 0, 18,8.6810e25, 'lightblue', 'Uranus ♅')
  Neptune = new planet(0, 30.07, 5430, 0, 18, 1.02413e26, 'cornflowerblue', 'Neptune ♆')
  Pluto = new planet(0, 39.482, 4743, 0, 10, 1.303e22, 
                    'lightgrey', 'Pluto ♇')
  Sun = new planet(0,0,0,0,25, 1.98847e30, 'orange', 'Sun ☉');
  
  // Store all of the planets in a list
  planets = [Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Sun];
  
 
  // Create some random stars
  stars = [];
  for (let i=0; i<nStars; i+=1){
    star = new planet(random(-1,1),random(-1,1),0,0,2,0,'star','white');
    append(stars, star);
  }

  timeslider = createSlider(0,14*86400,86400,21600);
  timeslider.position(10,height-40);
  timeslider.style('width', '200px');
  
  scaleslider = createSlider(5,2000,100,5);
  scaleslider.position(10,height-80);
  scaleslider.style('width', '200px');
  scaleslider.input(refresh);
  
  button = createButton('Switch Reference Frame');
  button.position(width-165, height-60);
  button.mousePressed(changeReference);
  
  sel = createSelect();
  sel.position(10, 60);
  names = [];
  for (let i =0; i<planets.length; i++){
    sel.option(planets[i].name);
    append(names, planets[i].name);
  }
  sel.changed(distselector);
  currentPlanet = 0;
}

function draw() {
  background(0,0,0,5);
  
  timeslider.position(10,height-40);
  scaleslider.position(10,height-80);
  button.position(width-165, height-60);
  
  // Draw some stars!
  for(let i=0; i<stars.length; i+=1){
    stars[i].update(stars, deltat, false);
  }
  
  // This little trick let's us move the sun, but only if our mouse is close to it.
  if ((!geocentric) & (mouseIsPressed) & (dist(mouseX, mouseY, Sun.x*scale/AU+width/2, Sun.y*scale/AU+height/2)<50)){
    Sun.x = (mouseX-width/2)*AU/scale;
    Sun.y = (mouseY-height/2)*AU/scale;
  }
  
  translate(0, 0)
  // Creates some black boxes to keep text legible
  push();
  fill(0,0,0);
  rect(0,10,250,75);
  rect(0,height-100, 250, 80);
  rect(width-90,10,80,160);
  fill(255)
  for(let i =0; i<planets.length; i++){
    fill(planets[i].color)
    text(planets[i].name,width-80,25+15*i)
  }
  
  pop();
  
  // This sets the simulation speed based on the value from our slider
  push();
  fill(255, 255, 255);
  deltat = timeslider.value()
  text(join(['Simulation Speed: 1 frame =',nf(deltat/86400,1,3),'days'],' '), 10, height-45);
  pop();
  
  // This sets the simulation speed based on the value from our slider
  push();
  fill(255, 255, 255);
  scale = scaleslider.value()
  text(join(['Scale: 1 AU =',nf(scale,1,0),'pixels'],' '),10,height-85);
  pop();
  
  // Calculate the distance between Earth & Sun
  let d = dist(planets[currentPlanet].x, planets[currentPlanet].y, Sun.x, Sun.y)/AU;
  push();
  fill(255, 255, 255);
  text(join(["Distance from " + sel.value() + " to Sun =",nf(d,1,3),'AU'],' '), 10, 25);
  text(join(['Current Frame Rate:',nf(average(frameC),1,0),'FPS'],' '),10,40)
  if (geocentric){
    text('Reference Frame: Geocentric', 10, 55)
  }
  else {
    text('Reference Frame: Heliocentric', 10, 55)
  }
  pop();
  
  if (geocentric){
    translate(-Earth.x*scale/AU+width/2-width/2, -Earth.y*scale/AU+height/2-height/2)
  }
  // Draw the planets!
  for(let i=0; i<planets.length; i+=1){
    planets[i].update(planets, deltat, true);
  }
  
  translate(Sun.x*scale/AU+width/2-width/2, Sun.y*scale/AU+height/2-height/2)
  
  // Some frame rate business
  frameC.push(frameRate());
  if (frameC.length > 180){
    frameC.shift();
  }
}

function distselector(){
  for (let i = 0; i<planets.length; i++){
    if (sel.value()==planets[i].name){
      currentPlanet = i;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
