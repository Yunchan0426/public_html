console.log("rainbow.js");

let element = document.getElementById("tswcontainer"); // The main container
let angle = 0;
let input = document.getElementById("my-input"); // Input field for color change 
let shouldRainbow = false; 

function onFrame() {
    let colorString = "hsl(" + angle + "deg, 100%, 50%)";
    angle = (angle + 1) % 360; // Ensure angle loops between 0 and 359

    if (shouldRainbow) {
        element.style.backgroundColor = colorString;
    }
    requestAnimationFrame(onFrame);
}

// Start the animation loop. 
onFrame();

// Function to enable the rainbow effect 
function startRainbow() {
    shouldRainbow = true;
}

// Function to disable the rainbow effect 
function stopRainbow() {
    shouldRainbow = false;
}

// Function triggered by the button click on projects.html
function onlmbclick(event) {
    if (input && element) { // Ensure input and main element exist
        console.log("Applying color:", input.value);
        stopRainbow(); 
        element.style.backgroundColor = input.value; 
        // setTimeout(startRainbow, 3000); // Resume rainbow after 3 seconds
    } else {
        console.log("Input or target element not found for color change.");
    }
}
