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

(function() {
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
        if (document.querySelector('#hud-craft-target') && selectionOlLoaded == 0) {
            selectionOlLoaded = 1
            LoadSelectionOverlay()
        }
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
                box.onclick = () => { console.log("asdf") }
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
        trackedItemElemValue.innerHTML = loadCraftAmount(item.item) + '&nbsp;|&nbsp;Min&nbsp;|&nbsp;Hour';

        let trackedItemElemIcon = new Image();
        // trackedItemElemIcon = document.createElement('img')
        trackedItemElemIcon.classList.add('hud-craft-icon')
        trackedItemElemIcon.src = item.icon

        trackedItemElem.onclick = () => console.log("sdfsdf")

        trackedItemElem.appendChild(trackedItemElemIcon)
        trackedItemElem.appendChild(trackedItemElemValue)
        return trackedItemElem
    }

    function updateItems(trackedHud) {
        for (let item of trackedItems) {
            if (!isCraftAvalible(item.item) || loadedItems.includes(item.item)) {
                continue
            }
            item.icon = loadCraftIcon(item.item)
            loadedItems += item.item + " "
            trackedHud.appendChild(createCraftTrack(item));
        }
    }

    function LoadProductionMonitor() {
        let trackedHud = document.createElement('div');
        trackedHud.classList.add("crafts")
        trackedHud.id = 'tracked-items';
        // let trackedItemHeader = document.createElement('div');
        // trackedItemHeader.id = 'tracked-item-header';
        // trackedItemHeader.classList.add('bank');
        // trackedItemHeader.style = 'width: 100%;';
        // trackedItemHeader.innerHTML = 'Craft:&nbsp;Count&nbsp;|&nbsp;Min&nbsp;|&nbsp;Hour';
        // trackedHud.appendChild(trackedItemHeader);

        let hudRight = document.querySelector('.hud .right .hud-right');
        hudRight.insertBefore(trackedHud, hudRight.querySelector('.right-hud').nextSibling);

        updateItems(trackedHud)
        setInterval(updateItems, 5000, trackedHud)

        class TrackUnitDeliverOutputTask extends UnitDeliverOutputTask {
            onArrive() {
                super.onArrive();
                let trackedItem = trackedItems.find(item => item.item.toUpperCase() == this.craft.toUpperCase())
                if (trackedItem) {
                    trackedItem.count++;
                    if (trackedItem.count == 1) {
                        trackedItem.first = Date.now();
                    } else {
                        let timeDiff = Date.now() - trackedItem.first;
                        trackedItem.oneMin = trackedItem.count / (timeDiff / 60000)
                        trackedItem.oneHour = trackedItem.count / (timeDiff / 3600000)
                    }
                    let item = document.querySelector('#tracked-item-' + trackedItem.item + ' p')
                    item.innerHTML = '<b>' + trackedItem.count + '</b>&nbsp;|&nbsp;<b>' + trackedItem.oneMin.toFixed(2) + '</b>&nbsp;|&nbsp;<b>' + trackedItem.oneHour.toFixed(2) + '</b>';
                }
            }
        }

        let origfindDeliverOutputTask = TS_UnitLogic.prototype.findDeliverOutputTask;
        TS_UnitLogic.prototype.findDeliverOutputTask = function(t) {
            let origReturn = origfindDeliverOutputTask.call(this, t);
            return origReturn ? new TrackUnitDeliverOutputTask(origReturn.unit,origReturn.targetObject,t) : null
        }
    }
})();
