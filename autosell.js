// ==UserScript==
// @name         Town Star Multiple Item Auto-Sell
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto sell
// @author       siisgoo by jiro
// @match        *://*.sandbox-games.com/*
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    function getAutoSellList() {
        return JSON.parse(localStorage.getItem("auto_sell_config:p2e5"));
    }
    const sellTimer = 10; // Seconds between selling
    var craftedItem = []
    let sellingActive = 0;
    var depotTimer = [];
    var strData = "";
    var strSellingData = "";
    new MutationObserver(function(mutations){
        let airdropcollected = 0;
        if(document.getElementsByClassName('hud-jimmy-button')[0] && document.getElementsByClassName('hud-jimmy-button')[0].style.display != 'none'){
            document.getElementsByClassName('hud-jimmy-button')[0].click();
            document.getElementById('Deliver-Request').getElementsByClassName('yes')[0].click();
        }
        if(document.getElementsByClassName('hud-airdrop-button')[0] && document.getElementsByClassName('hud-airdrop-button')[0].style.display != 'none'){
            if(airdropcollected == 0){
                airdropcollected = 1;
                document.getElementsByClassName('hud-airdrop-button')[0].click();
                document.getElementsByClassName('air-drop')[0].getElementsByClassName('yes')[0].click();
            }
        }
        if (document.getElementById("playnow-container") && document.getElementById("playnow-container").style.visibility !== "hidden") {
            document.getElementById("playButton").click();
        }




        if(typeof Game != 'undefined' && Game.town != null) {
            if(sellingActive == 0) {
                console.log('Game loaded');
                setTimeout(function(){
                    if (document.getElementsByClassName('mayhem-logo').length>0) {
                        document.getElementsByClassName('close-button')[21].click();
                    }
                },2000);

              sellingActive = 1;
              activateSelling();
            }
        }
    }).observe(document, {attributes: true, childList: true , subtree: true});


    function addToList() {
        var keepAmount = Number(document.getElementById("keepAmount").value);
        var name = document.getElementById("ListOfAllItem").value;
        craftedItem.push({item:name,keepAmount:keepAmount});
        document.getElementById("configTxt").value = JSON.stringify(craftedItem);
        SaveConfig()
    }

    function removeFromList() {
        if (craftedItem.findIndex(e => e.item === document.getElementById("ListOfAllItem").value)>-1) {
            craftedItem.splice(craftedItem.findIndex(e => e.item === document.getElementById("ListOfAllItem").value),1);
        }
        document.getElementById("configTxt").value = JSON.stringify(craftedItem);
        SaveConfig()
    }

    let configOpened = false
    function toggleConfig() {
        //console.log(Game)
        if (configOpened) {
            configOpened = false
            CloseConfig()
        } else {
            configOpened = true
            LoadConfig()
        }
    }

    function LoadConfig(){
        craftedItem = getAutoSellList()
        document.getElementById("configTxt").value = JSON.stringify(craftedItem)
        document.getElementById("ConfigDiv").style.visibility = "visible";
        //To close all fullscreens
        for(var i =0;i<document.getElementsByClassName ("close-button").length;i++)
        {
            document.getElementsByClassName ("close-button")[i].click();
        }
    }
    function SaveConfig() {
        localStorage.setItem("StartSelling",document.getElementById("StartSellingCheckBox").checked);
        localStorage.setItem("ClearConsole",document.getElementById("ClearConsoleCheckBox").checked);
        localStorage.setItem("auto_sell_config:p2e5",document.getElementById("configTxt").value);
    }

    function CloseConfig(){
        document.getElementById("ConfigDiv").style.visibility = "hidden";
        SaveConfig()
    }
    function ClearData(){
        localStorage.removeItem("auto_sell_config:p2e5");
        document.getElementById("configTxt").value = "";
    }


    function activateSelling() {
        var listItem = getAutoSellList()
        var sStartSelling = localStorage.getItem("StartSelling");
        var sClearConsole = localStorage.getItem("ClearConsole");

        if(listItem != null){
            craftedItem = listItem;
        }

        var sellingAmount = document.createElement("Input");
        var addToListBtn = document.createElement("BUTTON");
        var removeListBtn = document.createElement("BUTTON");

        var itemlist = document.createElement("select");
        itemlist.id = "ListOfAllItem";
        for (var item in Game.craftData){
            itemlist.add(new Option(item, item));
        }

        var css_configButton = '#configBtn { transition: 1s ease-in-out; } #configBtn:hover { transition: 1s ease-in-out; background: #bfff00; } ';
        var css_toggleButton = '.toggle-button { position: relative; width: 40px; height: 15px; margin: 0; vertical-align: top; background: #ffffff; border: 1px solid #bbc1e1; border-radius: 30px; outline: none; cursor: pointer; -webkit-appearance: none; -moz-appearance: none; appearance: none; transition: all 0.3s cubic-bezier(0.2, 0.85, 0.32, 1.2);\ } .toggle-button::after { content: ""; position: absolute; left: 0px; top: 0.5px; width: 15px; height: 15px; background-color: blue; border-radius: 50%; transform: translateX(0); transition: all 0.3s cubic-bezier(0.2, 0.85, 0.32, 1.2); } .toggle-button:checked::after { transform: translateX(calc(100% + 8px)); background-color: #fff; } .toggle-button:checked { background-color: blue; }';
        var css = css_configButton + css_toggleButton;
        var style = document.createElement('style');

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.getElementsByTagName('head')[0].appendChild(style);

        var node = document.createElement("DIV");
        var Loadbtn = document.createElement("BUTTON");
        var node2 = document.createElement("DIV");
        var Savebtn = document.createElement("BUTTON");
        var ClearStorageDataBtn = document.createElement("BUTTON");
        var text = document.createElement("TEXTAREA");
        var ClearConsoleLogCheckBox = document.createElement("Input");

        var StartSellingCheckBox = document.createElement("Input");
        Loadbtn.setAttribute("style","height: 15px;width:145px;margin: auto; padding: 10px 25px; margin-top: 10px;");
        Loadbtn.classList.add("bank");
        Loadbtn.setAttribute("id", "configBtn");
        Loadbtn.textContent = "Auto sell menu";
        Loadbtn.onclick = toggleConfig;

        Savebtn.setAttribute("style","height:20px;width:100px;");
        Savebtn.setAttribute("id", "Savebtn");
        Savebtn.textContent = "Close config";
        Savebtn.onclick = CloseConfig;

        ClearStorageDataBtn.setAttribute("style","height:20px;width:150px;margin-left:10px;");
        ClearStorageDataBtn.setAttribute("id", "ClearDataBtn");
        ClearStorageDataBtn.textContent = "Reset";
        ClearStorageDataBtn.onclick = ClearData;

        text.setAttribute("readonly", "true");
        text.setAttribute("id", "configTxt");
        text.setAttribute("style","height:100px;width:100%;");

        StartSellingCheckBox.type = "checkbox";
        StartSellingCheckBox.classList.add("toggle-button")
        StartSellingCheckBox.style.height = "12px";
        StartSellingCheckBox.setAttribute("id", "StartSellingCheckBox");
        if(sStartSelling != null){
            if(sStartSelling =="false"){
                StartSellingCheckBox.checked = false;
            }else{
                StartSellingCheckBox.checked = true;
            }
        }


        ClearConsoleLogCheckBox.type = "checkbox";
        ClearConsoleLogCheckBox.classList.add("toggle-button");
        ClearConsoleLogCheckBox.style.height = "12px";
        ClearConsoleLogCheckBox.setAttribute("id", "ClearConsoleCheckBox");
        ClearConsoleLogCheckBox.checked = true;
        if(sClearConsole != null){
            if(sClearConsole =="false"){
                ClearConsoleLogCheckBox.checked = false;
            }else{
                ClearConsoleLogCheckBox.checked = true;
            }
        }


        node.appendChild(Loadbtn);
        node2.id ="ConfigDiv";

        sellingAmount.type = "number";
        sellingAmount.style.height = "10px";
        sellingAmount.style.width = "35px";
        sellingAmount.style.fontSize= "12px";
        sellingAmount.style.padding= "4px";
        sellingAmount.style.marginLeft= "5px";
        sellingAmount.style.borderRadius= "0px";
        sellingAmount.style.textAlign= "right";
        sellingAmount.setAttribute("id", "keepAmount");
        sellingAmount.min= 0;
        sellingAmount.value = 0;

        //itemlist.style.height = "22px";
        itemlist.style.fontSize = "13px";
        itemlist.style.margin = "5px";

        addToListBtn.style.height = "22px";
        // addToListBtn.style.width = "30px";
        addToListBtn.style.marginLeft = "5px";
        addToListBtn.id = "AddBtn";
        addToListBtn.textContent = "Add";
        addToListBtn.onclick = addToList;

        removeListBtn.style.height = "22px";
        // removeListBtn.style.width = "50px";
        removeListBtn.style.marginLeft = "5px";
        removeListBtn.id = "RemoveBtn";
        removeListBtn.textContent = "Remove";
        removeListBtn.onclick = removeFromList;

        node2.appendChild(itemlist);


        node2.append("Keep amount:");

        node2.appendChild(sellingAmount);
        node2.appendChild(addToListBtn);
        node2.appendChild(removeListBtn);
        node2.appendChild(document.createElement("hr"));


        node2.setAttribute("style", "padding: 10px; display: table; position: fixed;left: 50%; transform: translate(-50%, 0px); margin-top: 50px; z-index: 1000; width: 520px;height: 100%; background-color: lightgray;visibility:hidden");
        node2.appendChild(text);
        node2.appendChild(document.createElement("hr"));

        node2.append("Start Selling : ");
        node2.appendChild(StartSellingCheckBox);
        node2.appendChild(document.createElement("hr"));

        node2.append("Clear console? ");
        node2.appendChild(ClearConsoleLogCheckBox);
        node2.appendChild(document.createElement("hr"));
        //node2.appendChild(Savebtn);
        node2.appendChild(ClearStorageDataBtn);

        node.appendChild(node2);
        node.setAttribute("style", "left: 50%; transform: translate(-50%, 0);position:fixed;z-index:1000");
        text.value =JSON.stringify(craftedItem);
        document.getElementsByTagName("Body")[0].appendChild(node)

        let start = GM_getValue("start", Date.now());
        GM_setValue("start", start);
        setTimeout(function(){
            let tempSpawnCon = Trade.prototype.SpawnConnection;
            Trade.prototype.SpawnConnection = function(r) {tempSpawnCon.call(this, r); console.log(r.craftType); GM_setValue(Math.round((Date.now() - start)/1000).toString(), r.craftType);}
        },10000);

        window.mySellTimer = setInterval(function(){
            var depotObjArray = Object.values(Game.town.objectDict).filter(o => o.logicType === 'Trade');
            var waterFacilityArray = Object.values(Game.town.objectDict).filter(o => o.type === 'Water_Facility');
            var powerPlantArray = Object.values(Game.town.objectDict).filter(o => o.type === 'Power_Plant');
            var lumberMillArray = Object.values(Game.town.objectDict).filter(o => o.type === 'Lumber_Mill');
            var VinesArray = Object.values(Game.town.objectDict).filter(o => o.type === 'Pinot_Noir_Vines' ||o.type === 'Cabernet_Vines' ||o.type === 'Chardonnay_Vines');
            var ConstructionSiteArray = Object.values(Game.town.objectDict).filter(o => o.type === 'Construction_Site' );
            var isVinesNeedWood = false;
            var isConstructionNeedWood = false;
            var depotObj = "";
            var busyDepotKey = "";
            var depotKey = "";
            var busyDepot = [];
            var i,j;
            if(ClearConsoleLogCheckBox.checked){
                console.clear();
            }

            if(Game.town.tradesList.length>0){
                for(j =0;j<Game.town.tradesList.length;j++){
                    busyDepotKey = "[" + Game.town.tradesList[j].source.x+ ", " + "0, " + Game.town.tradesList[j].source.z + "]";
                    var startTime = new Date(Game.town.tradesList[j].startTime);
                    var endTime = new Date(startTime.getTime() + Game.town.tradesList[j].duration);
                    var currentTime = new Date();
                    console.log("Depot Busy -- " + busyDepotKey);
                    if(currentTime.getTime()-endTime.getTime()>1000){
                        busyDepot.push(busyDepotKey);
                        console.log("Depot Busy -- " + busyDepotKey);
                        Game.town.objectDict[busyDepotKey].logicObject.OnTapped();
                    }else{
                        busyDepot.push(busyDepotKey);
                        console.log("Depot Busy -- " + busyDepotKey);
                    }
                }
            }

            if (Game.town.GetStoredCrafts()["Gasoline"] > 0) {
                var itemtoSell;
                var nKeepAmount;
                var craftedItem =JSON.parse(document.getElementById("configTxt").value)
                strData = "";
                for(i=0;i< craftedItem.length;i++){
                    itemtoSell= craftedItem[i].item;
                    nKeepAmount = craftedItem[i].keepAmount;
                    if (Game.town.GetStoredCrafts()[itemtoSell] != undefined){
                        strData += "current " +itemtoSell + " stored: " + Game.town.GetStoredCrafts()[itemtoSell] + " keep:"+ nKeepAmount + "\n";
                        var count = Game.town.GetStoredCrafts()[itemtoSell]
                        if (count >= nKeepAmount + 10) {
                            break;
                        }
                    }
                }
                console.log(strData);
                var isFound = false;
                if (Game.town.GetStoredCrafts()[itemtoSell] >= nKeepAmount + 10) {
                    if(false){ // TODO
                        for(var k =0;k<depotObjArray.length;k++){
                            if(depotObjArray[k].type == "Freight_Pier"){
                                depotObj = depotObjArray[k];
                                depotKey = "[" + depotObj.townX+ ", " + "0, " + depotObj.townZ + "]";
                                 if(Game.town.tradesList.length>0){
                                      for(j =0;j<Game.town.tradesList.length;j++){
                                          busyDepotKey = "[" + Game.town.tradesList[j].source.x+ ", " + "0, " + Game.town.tradesList[j].source.z + "]";
                                          if(depotKey == busyDepotKey){
                                              depotObj = "";
                                          }

                                      }
                                }

                                if(depotObj != ""){
                                    break;
                                }
                            }
                        }
                    }else{
                        for(var l =0;l<depotObjArray.length;l++){
                            if(depotObjArray[l].type != "Freight_Pier"){
                                depotObj = depotObjArray[l];
                                depotKey = "[" + depotObj.townX + ", " + "0, " + depotObj.townZ + "]";
                                if(Game.town.tradesList.length>0){
                                      for(j =0;j<Game.town.tradesList.length;j++){
                                          busyDepotKey = "[" + Game.town.tradesList[j].source.x+ ", " + "0, " + Game.town.tradesList[j].source.z + "]";
                                          if(depotKey == busyDepotKey){
                                              depotObj = "";
                                          }

                                      }
                                }

                                if(depotObj != ""){
                                    break;
                                }
                            }
                        }
                    }

                    if(depotObj != ""){
                        console.log(strData);
                        if(strSellingData.length>5000){
                            strSellingData = "";
                        }

                        strSellingData += "SELLING " + itemtoSell + "! - " + new Date() + " --> x:" + depotObj.townX + "z:" + depotObj.townZ +  "\n" ;
                        console.log(strSellingData);
                        if(StartSellingCheckBox.checked){
                            Game.app.fire("SellClicked", {x: depotObj.townX, z: depotObj.townZ});
                            setTimeout(function(){
                                let craftTarget = document.getElementById("trade-craft-target");
                                craftTarget.querySelectorAll('[data-name="' + itemtoSell + '"]')[0].click();
                                setTimeout(function(){
                                    document.getElementById("destination-target").getElementsByClassName("destination")[0].getElementsByClassName("sell-button")[0].click();
                                },1000);
                            },3000);
                        }
                    }else{
                        console.log(strSellingData);
                    }
                }else{
                    console.log(strSellingData);
                }
            }else{
                console.log("Run out of gas!!!");
            }
        },sellTimer*1000);
    }
})();
