class planet {
  constructor(x, y, vx, vy, radius, mass, color, name) {
    this.name = name
    this.x = x*AU;
    this.y = y*AU;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.mass = mass;
    this.color = color;
  }

  update(planets, deltat, physics) {
    if (physics){
      this.physics(planets, deltat);
    }
    this.draw(physics);
  }
  
  physics(planets, deltat){
    let ax, ay, vx, vy, x, y;
    let sumFx = 0;
    let sumFy = 0;
    
    // Loop through each planet in our list
    for (let i = 0; i<planets.length; i+=1){
      // Check if the current planet is the same
      // as our planet, if it is, skip ahead to the next
      // one
      if (planets[i] == this){
        continue
      }
      else {
        let F = calculateForceMagnitude(this, planets[i]);
        let theta = calculateTheta(this, planets[i]);
        let Fx = F*cos(theta);
        let Fy = F*sin(theta);
        sumFx += Fx;
        sumFy += Fy;
      }
    }
    
    // Newton's 2nd Law!
    ax = sumFx/this.mass;
    ay = sumFy/this.mass;
      
    // Kinematics!
    vx = this.vx + ax*deltat;
    vy = this.vy + ay*deltat;
    x = this.x + vx*deltat;
    y = this.y + vy*deltat;
      
    // Update our position with the new values
    this.vx = vx;
    this.vy = vy;
    this.x = x;
    this.y = y
  }
  
  draw(physics){
    // This function draws our planets and stars
    push();
    noStroke();
    fill(this.color);
    if (physics){
      circle(width/2 + this.x*scale/AU, height/2 + this.y*scale/AU, this.radius);
    } else {
      circle(width/2 + width*this.x/AU/2, height/2 + height*this.y/AU/2, this.radius);
    }
    pop();
  }
}
  
function calculateTheta(planet1, planet2){
  let dy = planet2.y - planet1.y;
  let dx = planet2.x - planet1.x;
  let theta = atan2(dy, dx)
  return theta
}
  
function calculateForceMagnitude(planet1, planet2){
  // Here's Newton's Law of Gravity!
  let r = dist(planet1.x, planet1.y, planet2.x, planet2.y);
  let F = G*planet1.mass*planet2.mass/pow(r, 2);
  return F
}
  
  
function average(arr){
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum / arr.length;
}

function changeReference(){
  refresh();
  geocentric = !geocentric;
}

function refresh(){
  background(0);
}
