//color 1 is the inside color and color2 is the outside edge gradient color
let color1 = { value: [0, 0, 0], change: [0, 0, 0], target: [0, 0, 0] };
let color2 = { value: [0, 0, 0], change: [0, 0, 0], target: [0, 0, 0] };

//color mode variables
let darkMode = 0;
let lightMode = 0;

//start time since the window was opened in milliseconds
let startTime = null;

//boolean to keep track of the state of the side nav bar
let menuOpen = false;

//constants that refer to html objects
const overlay = document.getElementById('overlay');
const btn = document.querySelector('#btn');
const sideNav = document.querySelector('#side-bar');
const body = document.body;

//start the animation
requestAnimationFrame(animate);

//when scrolling call the scroll function
body.onwheel = scroll;

//initialize a random starting background gradient color
changeColor();

//initialize the center button background and text color
btn.style.backgroundColor = "white";
btn.style.color = "black";

//function to check if the color has reached its target returns a new target if it has reached its target
function checkTarget(color, target, change){
    //if we have reached the target make a new one
    if(change[0] == 0 || (change[0] > 0 && color[0] > target[0]) || (change[0] < 0 && color[0] < target[0])){
        target = generateNewTarget(target);
        //calculate the change array
        change = [target[0] - color[0], target[1] - color[1], target[2] - color[2]];

        //divide by the magnitude to turn it into a unit vector
        let magnitude = Math.sqrt(change[0] * change[0] + change[1] * change[1] + change[2] * change[2]);
        
        for(let i = 0; i < 3; i++){
            change[i] = change[i] / magnitude;
        }
    }

    return {target: target,change: change};
}

//function opens the side bar nav when called
function openNav(){
    //works by giving the side bar element an actual width
    document.getElementById("side-nav").style.width = "250px";
    menuOpen = true;

    //puts a dark overlay over the rest of the screen
    overlay.style.display = 'block';
}

//function closes the side bar nav when called
function closeNav(){
    //reduced the side bar nav width to 0 to make it disappear
    document.getElementById("side-nav").style.width = "0px";
    menuOpen = false;

    //remove the overlay
    overlay.style.display = 'none';
}

//updates the colors to move towards their target colors
function updateValues(){
    //update the values
    color1.value = updateValue(color1.value,color1.change);
    //check if we need a new target value and creates a new one if we do
    let r1 = checkTarget(color1.value, color1.target, color1.change);
    //update the new target and change arrays
    color1.target = r1.target;
    color1.change = r1.change;

    //do the same with the second color
    color2.value = updateValue(color2.value,color2.change);
    let r2 = checkTarget(color2.value, color2.target, color2.change);
    color2.target = r2.target;
    color2.change = r2.change;
    
}

//return an array of 3 ints that is at least somewhat different than the current color
function generateNewTarget(current){
    let c = [0,0,0];
    do{
        c = [getRandomInt(256), getRandomInt(256), getRandomInt(256)];
    } while(Math.abs(c[0] + c[1] + c[2] - current[0] - current[1] - current[2]) < 50);
    
    return c;
}

//update values and set the colors to the new values
function animate(timestamp){
    if(!startTime) startTime = timestamp;

    updateValues();
    updateColor();

    requestAnimationFrame(animate);
}

//Close side nav if the user clicks away from the side nav
document.body.addEventListener('click', function (event) {
    if (!sideNav.contains(event.target) && menuOpen) {
        closeNav();
    }
});

//creates an rgb color from 3 values
function createColor(color){
    return `rgb(${color[0]},${color[1]},${color[2]})`;
}

//function sets the css values to the newly updated js values
function updateColor(){
    let c1 = createColor(color1.value);
    let c2 = createColor(color2.value);


    document.getElementById("background").style.background = `radial-gradient(${c1},${c2})`;

    document.getElementById("btn").style.border =  `2px solid ${c1}`;

    document.getElementById("btn").style.border =  `2px solid ${c1}`;

    document.getElementById("button-container").style.borderImage = `linear-gradient(to right, ${c1},${c2}) 1`

    
}

//return int between 0 and max
function getRandomInt(max){
    return Math.floor(Math.random() * max);
}

//prints rgb of a color
function printColor(color){
    console.log(color[0] + " " + color[1] + " " + color[2]);
}

//generates a new gradient
function changeColor(){

    let min = 255;
    do{
        min = 255;
        for(let i = 0; i < 3; i++){
            color1.value[i] = getRandomInt(256);
            color2.value[i] = getRandomInt(256);
            min = Math.min(min, color2.value[i] - color1.value[i]);
        }
    } while(min < 20);
    updateColor();

    //also updates the color of the center button
    let c1 = createColor(color1.value);
    document.getElementById("btn").style.backgroundColor =  `${c1}`;
}

//set color to the new value clamp between 0 and 255
function updateValue(value, change){
    for(let i = 0; i < 3; i++){
        value[i] = Math.max(0,Math.min(value[i] + change[i],255));
    }

    return value;
}

//gets the distance scrolled and update the colors based on the distance
function scroll(event){
    let change = -event.deltaY / 15.0;

    color1.value = updateValue(color1.value,[change,change,change]);
    color2.value = updateValue(color2.value,[change,change,change]);

    updateColor();
}

//changes color of center button on hover
btn.addEventListener("mouseenter", function( event ) {   
    let c1 = createColor(color1.value);
    event.target.style.backgroundColor = `${c1}`;

    if(color1.value[0] + color1.value[1] + color1.value[2] > 600){
        event.target.style.color = "white";
    }
  }, false);

//returns it back to default when not hovering
btn.addEventListener("mouseleave", function( event ) {   
    event.target.style.backgroundColor = "white";
    event.target.style.color = "black";
}, false);