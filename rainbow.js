console.log("hello world") 

let element=document.getElementById("tswcontainer")
let angle=0;
let input = document.getElementById("my-input")
let shouldrainbow = true;

function onframe(){
    let string="hsl("+angle+"deg, 100%, 50%)";
    angle+=1;
    if (shouldrainbow){
        element.style.backgroundColor=string
    }
    // console.log(element)
    requestAnimationFrame(onframe)
}
onframe()
function start_rainbow(){
    shouldrainbow = true;
}

function onlmbclick(event){
    console.log(input.value)
    shouldrainbow = false;
    element.style.backgroundColor = input.value ;
    setTimeout(start_rainbow,1000)
}