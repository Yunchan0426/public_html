const widget_container = document.getElementById("widget-container");
const stores = document.getElementsByClassName("store");
const score_element = document.getElementById("score");
let score = 5;
let super_gompei_count = 0;
let wolf_start = false;
let wolf_Creating = false;

function changeScore(amount) {
    score += amount;
    //set score element
    score_element.innerHTML = "Score: " + score;
    // Update the stores to show ones that are too expensive
    if (score>=1000) {
        wolf_start = true;
    }
    if (wolf_start && !wolf_Creating) {
        wolf_Creating = true;
        wolfAppears();
    }
    for (let store of stores) {
        let cost = parseInt(store.getAttribute("cost"));

        if (score < cost) {
            store.setAttribute("broke", "");
        } else {
            store.removeAttribute("broke");
        }
    }
}
function buy(store) {
    const cost = parseInt(store.getAttribute("cost"));
    
    // check available to buy
    if (score < cost) return;
    // change score
    changeScore(-cost);

    if (store.getAttribute("name") === "Super-Gompei") {
        const super_gompei = document.querySelector("#widget-container #super-gompei")?.parentElement;
        // If Super-Gompei already exists
        if (super_gompei) {
            super_gompei_count += 1;
            document.body.style = "--gompei-count: " + super_gompei_count + ";"
            super_gompei.setAttribute("reap", (parseInt(super_gompei.getAttribute("reap")) + 100));
            return;
        }
    }
    // clone node for widget, and add to container
    const widget = store.firstElementChild.cloneNode(true);
    widget.onclick = () => {
        if (widget.getAttribute("position") == "hunter") {
            hunt(widget);
        } else {
            harvest(widget);
        }
    }
    widget_container.appendChild(widget);

    if (widget.getAttribute("auto") == 'true') {
        if (widget.getAttribute("position") == "harvest") {
            widget.setAttribute("harvesting", "");
            setup_end_harvest(widget);
        } 
        else { 
            widget.setAttribute("hunting", "");
            setup_end_hunt(widget);
        }
    }
}

function wolfAppears() {
    const randomInterval = Math.random() * 2000 + 8000; // 8-10 seconds
    setTimeout(() => {
        const wolfStoreItem = document.querySelector('.store[name="Wolf"]');
        const wolfWidget = wolfStoreItem.firstElementChild.cloneNode(true);
        widget_container.appendChild(wolfWidget);
        wolf_Creating = false;

        // Make the wolf hunt automatically
        if (wolfWidget.getAttribute("auto") == 'true') {
            wolfWidget.setAttribute("hunting", "");
            setup_end_hunt(wolfWidget);
        } 
    }, randomInterval);
}


function setup_end_harvest(widget) {
    setTimeout(() => {
        // Remove the harvesting flag
        widget.removeAttribute("harvesting");
        // If automatic, start again
        if (widget.getAttribute("auto") == 'true') {
            harvest(widget);
        }
    }, parseFloat(widget.getAttribute("cooldown")) * 1000);
}

function setup_end_hunt(widget) {
    setTimeout(() => {
        widget.removeAttribute("hunting");
        // If automatic, start again
        if (widget.getAttribute("auto") == 'true') {
            hunt(widget);
        }
    }, parseFloat(widget.getAttribute("cooldown")) * 1000);
}

function harvest(widget) {
    // Only run if currently not harvesting
    if (widget.hasAttribute("harvesting")) return;
    // Set harvesting flag
    widget.setAttribute("harvesting", "");

    // If manual, collect points now
    changeScore(parseInt(widget.getAttribute("reap")));
    showPoint(widget);

    setup_end_harvest(widget);
}

function hunt(widget) {
    // Only run if currently not hunting
    if (widget.hasAttribute("hunting")) return;
    // Set hunting flag
    widget.setAttribute("hunting", "");

    // If manual, collect points now
    if (widget.getAttribute("name") == "Farmer") {
        changeScore(-1*parseInt(widget.getAttribute("reap")));
        showPoint(widget);
    }
    if (widget.getAttribute("name") == "Wolf") {
        wolf(widget);
    }
    setup_end_hunt(widget);
}

function wolf(wolfWidget) {
    console.log("Wolf is hunting...");
    let gompeis = widget_container.querySelectorAll('.widget[name="Gompei"], .widget[name="Super-Gompei"]');
    let farmerWidget = widget_container.querySelector("#widget-container .widget[name='Farmer']");
    if (farmerWidget) {
        widget_container.removeChild(farmerWidget);
        widget_container.removeChild(wolfWidget);
        return true;
    }
    else if (gompeis.length > 0) {
        console.log("Wolf found Gompeis to eat: " + gompeis.length);
        let numbersToEat = Math.floor(Math.random() * gompeis.length);
        for (; numbersToEat > 0; numbersToEat--)  {
            const gompeiToEat = gompeis[Math.floor(Math.random() *gompeis.length)];
            if (gompeiToEat.getAttribute("name") == "Super-Gompei") {
                super_gompei_count = 0;
                document.body.style = "--gompei-count: " + super_gompei_count + ";"
            }
            console.log("Wolf eats: " + gompeiToEat.getAttribute("name"));
            widget_container.removeChild(gompeiToEat);
        }
        return true;
    }
    return false;
}

function showPoint(widget) {
    let number = document.createElement("span");
    if (widget.getAttribute("position") == "hunter") { 
        number.className = "minuspoint";
        number.innerHTML = " - " + widget.getAttribute("reap");
    }
    else {
        number.className = "pluspoint";
        number.innerHTML = " + " + widget.getAttribute("reap");
    }
    number.onanimationend = () => {
        widget.removeChild(number);
    }
    widget.appendChild(number);
}

changeScore(0);
