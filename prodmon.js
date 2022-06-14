// ==UserScript==
// @name         Production Rate Monitor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Monitor production rate of specified craft items.
// @author       siisgoo
// @match        https://townstar.sandbox-games.com/launch/
// @grant        none
// @run-at       document-start
// ==/UserScript==

// (function() {
const SliderCss = '#form-wrapper { margin-bottom: 30px; width: 100%; margin-bottom: 10px; display: flex; flex-direction: column; align-items: center; } form { width: 90%; max-width: 500px; } form #form-title { margin-top: 0; font-weight: 400; text-align: center; } form #time-slider { margin-bottom: 18px; display: flex; flex-direction: row; align-content: stretch; position: relative; width: 100%; height: 50px; user-select: none; } form #time-slider::before { content: " "; position: absolute; height: 2px; width: 100%; width: calc(100% * (5 / 6)); top: 50%; left: 50%; transform: translate(-50%, -50%); background: #000; } form #time-slider input, form #time-slider label { box-sizing: border-box; flex: 1; user-select: none; cursor: pointer; } form #time-slider label { display: inline-block; position: relative; width: 20%; height: 100%; user-select: none; } form #time-slider label::before { content: attr(data-time-delay); position: absolute; left: 50%; padding-top: 0px; transform: translate(-50%, 45px); font-size: 14px; letter-spacing: 0.4px; font-weight: 400; white-space: nowrap; opacity: 0.85; transition: all 0.15s ease-in-out; } form #time-slider label::after { content: " "; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 30px; height: 30px; border: 2px solid #000; background: #fff; border-radius: 50%; pointer-events: none; user-select: none; z-index: 1; cursor: pointer; transition: all 0.15s ease-in-out; } form #time-slider label:hover::after { transform: translate(-50%, -50%) scale(1.25); } form #time-slider input { display: none; } form #time-slider input:checked + label::before { font-weight: 800; opacity: 1; } form #time-slider input:checked + label::after { border-width: 4px; transform: translate(-50%, -50%) scale(0.75); } form #time-slider input:checked ~ #time-pos { opacity: 1; } form #time-slider input:checked:nth-child(1) ~ #time-pos { left: 8%; } form #time-slider input:checked:nth-child(3) ~ #time-pos { left: 26%; } form #time-slider input:checked:nth-child(5) ~ #time-pos { left: 44%; } form #time-slider input:checked:nth-child(7) ~ #time-pos { left: 62%; } form #time-slider input:checked:nth-child(9) ~ #time-pos { left: 80%; } form #time-slider input:checked:nth-child(11) ~ #time-pos { left: 98%; } form #time-slider #time-pos { display: block; position: absolute; top: 50%; width: 12px; height: 12px; background: #000; border-radius: 50%; transition: all 0.15s ease-in-out; transform: translate(-50%, -50%); border: 2px solid #fff; opacity: 0; z-index: 2; } form:valid #time-slider input + label::before { transform: translate(-50%, 45px) scale(0.9); transition: all 0.15s linear; } form:valid #time-slider input:checked + label::before { transform: translate(-50%, 45px) scale(1.1); transition: all 0.15s linear; } form + button { display: block; position: relative; margin: 56px auto 0; padding: 10px 20px; appearance: none; transition: all 0.15s ease-in-out; font-family: inherit; font-size: 24px; font-weight: 600; background: #fff; border: 2px solid #000; border-radius: 8px; outline: 0; user-select: none; cursor: pointer; } form + button:hover { background: #000; color: #fff; } form + button:hover:active { transform: scale(0.9); } form + button:focus { background: #4caf50; border-color: #4caf50; color: #fff; pointer-events: none; } form + button:focus::before { animation: spin 1s linear infinite; } form + button::before { display: inline-block; width: 0; opacity: 0; content: "\f3f4"; font-family: "Font Awesome 5 Pro"; font-weight: 900; margin-right: 0; transform: rotate(0deg); } form:invalid + button { pointer-events: none; opacity: 0.25; } @keyframes spin { from { transform: rotate(0deg); width: 24px; opacity: 1; margin-right: 12px; } to { transform: rotate(360deg); width: 24px; opacity: 1; margin-right: 12px; } }'
'use strict';
const trackedItems = [
    {item: "Blue",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Cake",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Baguette",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Pinot",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Pumpkin",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Batter",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Steel",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Cabernet",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Uniforms",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Candy",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Dough",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Chardonnay",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Wool",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Butter",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Wine",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Oak",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Chromium",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Iron",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Limestone",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Wool",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Milk",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Cotton",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Sugar",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Pinot",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Salt",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Flour",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Jet",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Cabernet",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Eggs",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Gasoline",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Lumber",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Pumpkin",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Silica",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Chardonnay",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Peppermint",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Petroleum",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Sugarcane",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Cotton",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Feed",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Brine",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Wheat",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Oak",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Wood",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Energy",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Crude",count:0,first:0,oneMin:0,oneHour:0,icon:""},
    {item: "Water",count:0,first:0,oneMin:0,oneHour:0,icon:""},
];

let loadedItems = ""

let loaded = 0
let selectionOlLoaded = 0

new MutationObserver(function(mutations) {
    if (document.querySelector('.hud .right .hud-right') && loaded == 0) {
        loaded = 1;
        LoadProductionMonitor();
    }
    // if (document.querySelector('#hud-craft-target') && selectionOlLoaded == 0) {
    // selectionOlLoaded = 1
    // LoadSelectionOverlay()
    // }
}).observe(document, {childList: true, subtree: true});

function LoadSelectionOverlay() {
    let crafts = document.querySelector("#hud-craft-target")
    Array.from(crafts.children).forEach((elem) => {
        if (elem.children.length == 1) {
            let elemClasses = elem.classList[1].split("-")
            let box = document.createElement('input')
            box.type = "checkbox"
            box.id = 'checkBox-' + elemClasses[elemClasses.length]
            box.style = 'width: 18px; height: 18px; margin: auto'
            box.onclick = () => { console.log("aaaaaassssdddffff") }
            elem.children[0].insertBefore(box, elem.children[0].children[0])
        }
    })
}

function loadCraftAmount(craftName) {
    let crafts = document.querySelector("#hud-craft-target")
    let amount = 0
    Array.from(crafts.children).forEach((elem) => {
        if (elem.classList[1].includes(craftName)) {
            if (elem.children.length == 1) {
                amount = elem.children[0].children[1].textContent
            }
        }
    })
    return amount
}

function loadCraftIcon(craftName) {
    let crafts = document.querySelector("#hud-craft-target")
    let src = ""
    Array.from(crafts.children).forEach((elem) => {
        if (elem.classList[1].includes(craftName)) {
            if (elem.children.length == 1) {
                src = elem.children[0].children[0].src
            }
        }
    })
    return src
}

function isCraftAvalible(craftName) {
    let crafts = document.querySelector("#hud-craft-target")
    let ret = false
    Array.from(crafts.children).forEach((elem) => {
        if (elem.classList[1].includes(craftName)) {
            ret = true
        }
    })
    return ret
}

function createCraftTrack(item) {
    let trackedItemElem = document.createElement('div');
    trackedItemElem.id = 'tracked-item-' + item.item;
    trackedItemElem.classList.add('bank', 'contextual');
    trackedItemElem.style = 'width: 100%;';

    let trackedItemElemValue = document.createElement('p')
    trackedItemElemValue.classList.add('hud-craft-amount')
    trackedItemElemValue.style = 'margin: auto'
    trackedItemElemValue.innerHTML = item.count + '&nbsp;|&nbsp;'+item.oneMin+'&nbsp;|&nbsp;'+item.oneHour;

    let trackedItemElemIcon = new Image();
    trackedItemElemIcon.classList.add('hud-craft-icon')
    trackedItemElemIcon.src = item.icon

    // trackedItemElem.onclick = () => console.log("sdfsdf")

    trackedItemElem.appendChild(trackedItemElemIcon)
    trackedItemElem.appendChild(trackedItemElemValue)
    return trackedItemElem
}

function removeCraft(craftName) {
    loadedItems.replace(craftName, "")
    let trackHud = document.querySelector("#tracked-items")
    trackHud.removeChild(document.querySelector("#tracked-item-"+craftName));
}

function updateItems(trackedHud) {
    for (let item of trackedItems) {
        if (!isCraftAvalible(item.item) && loadedItems.includes(item.item)) {
            removeCraft(item.item)
            continue
        } else if (!isCraftAvalible(item.item)) {
            continue
        } else if (loadedItems.includes(item.item)) {
            continue
        }
        item.icon = loadCraftIcon(item.item)
        loadedItems += item.item
        trackedHud.appendChild(createCraftTrack(item));
    }
}

function curDelay() {
    if ( document.querySelector('#delay-1').checked ) return 0
    if ( document.querySelector('#delay-2').checked ) return 1
    if ( document.querySelector('#delay-3').checked ) return 5
    if ( document.querySelector('#delay-4').checked ) return 10
    if ( document.querySelector('#delay-5').checked ) return 30
    if ( document.querySelector('#delay-6').checked ) return 60
}

function onDelayChanged() {
    console.log("delay changed")
    trackedItems.forEach(item => {
        if (loadedItems.includes(item.item)) {
            updateRates(item.item)
        }
    })
}

function createSlider() {
    let style = document.createElement('style');
    style.innerHTML = SliderCss;
    document.head.appendChild(style);

    let slider = document.createElement("div")
    slider.id = "form-wrapper"
    slider.innerHTML = '<form>\
            <div id="time-slider">\
                <input type="radio" name="time-delay" id="delay-1" value="1" required>\
                <label onclick="onDelayChanged()" for="1" data-time-delay="unlim"></label>\
                <input type="radio" name="time-delay" id="delay-2" value="2" required>\
                <label onclick="onDelayChanged()" for="2" data-time-delay="1min"></label>\
                <input type="radio" name="time-delay" id="delay-3" value="3" required>\
                <label onclick="onDelayChanged()" for="3" data-time-delay="5m"></label>\
                <input type="radio" name="time-delay" id="delay-4" value="4" required>\
                <label onclick="onDelayChanged()" for="4" data-time-delay="10m"></label>\
                <input type="radio" name="time-delay" id="delay-5" value="5" required>\
                <label onclick="onDelayChanged()" for="5" data-time-delay="30m"></label>\
                <input type="radio" name="time-delay" id="delay-6" value="6" required>\
                <label onclick="onDelayChanged()" for="6" data-time-delay="1h"></label>\
                <div id="time-pos"></div>\
            </div>\
        </form>'
    return slider
}

function updateRates(trackedItem) {
    let timeDiff = Date.now() - trackedItem.first;
    console.log(timeDiff)
    if (timeDiff > 0) {
        trackedItem.oneMin = trackedItem.count / (timeDiff / 60000)
        trackedItem.oneHour = trackedItem.count / (timeDiff / 3600000)
        let item = document.querySelector('#tracked-item-' + trackedItem.item + ' p')
        item.innerHTML =
            '<b>' + trackedItem.count +
            '</b>&nbsp;|&nbsp;<b>' + trackedItem.oneMin.toFixed(2)
            + '</b>&nbsp;|&nbsp;<b>' + trackedItem.oneHour.toFixed(2) + '</b>';
    }
}

function LoadProductionMonitor() {
    let trackedHud = document.createElement('div');
    // trackedHud.classList.add("crafts")
    trackedHud.id = 'tracked-items';

    let hudRight = document.querySelector('.hud .right .hud-right');
    hudRight.insertBefore(trackedHud, hudRight.querySelector('.right-hud').nextSibling);
    trackedHud.appendChild(createSlider());

    setInterval(updateItems, 5000, trackedHud)

    class TrackUnitDeliverOutputTask extends UnitDeliverOutputTask {
        onArrive() {
            super.onArrive();
            let trackedItem = trackedItems.find(item => item.item.toUpperCase() == this.craft.toUpperCase())
            if (trackedItem) {
                trackedItem.count++;
                if (trackedItem.first <= 0) {
                    trackedItem.first = Date.now();
                } else {
                    updateRates(trackedItem)
                }
            }
        }
    }

    let origfindDeliverOutputTask = TS_UnitLogic.prototype.findDeliverOutputTask;
    TS_UnitLogic.prototype.findDeliverOutputTask = function(t) {
        let origReturn = origfindDeliverOutputTask.call(this, t);
        return origReturn ? new TrackUnitDeliverOutputTask(origReturn.unit,origReturn.targetObject,t) : null
    }
}
// })();
