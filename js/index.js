function searchFine() {
    let searchFor = document.getElementById("searchbar_input").value.toLocaleLowerCase()
    
    let fines = document.querySelectorAll(".fine");
    for (var i = 0; i < fines.length; i++) {
        if (fines[i].querySelectorAll(".fineText")[0].innerHTML.toLocaleLowerCase().includes(searchFor)) {
            fines[i].classList.add("showing")
            fines[i].classList.remove("hiding")
        } else {
            fines[i].classList.remove("showing")
            fines[i].classList.add("hiding")
        }
        
    }
}

function selectFine(event) {
    let element = event.target
    console.log(element.tagName);
    if (element.tagName == "FONT") return
    if (element.tagName == "TD") element = element.parentElement
    if (element.tagName == "I") element = element.parentElement.parentElement

    if (element.classList.contains("selected")) {
        element.classList.remove("selected")
    } else {
        element.classList.add("selected")
    }

    startCalculating()
}

function startCalculating() {

    document.getElementById("finesListTable").innerHTML = `<tr>
                    <th style="width: 80%;">Grund für die Geldstrafe</th>
                    <th style="width: 20%;">Bußgeld</th>
                </tr>`

    let fineResult = document.getElementById("fineResult")
    let fineAmount = 0

    let wantedResult = document.getElementById("wantedsResult")
    let wantedAmount = 0

    let characterResult = document.getElementById("charactersResult")

    let reasonResult = document.getElementById("reasonResult")
    let reasonText = ""
    let plate = document.getElementById("plateInput_input").value
    let systemwantedsInput = document.getElementById("systemwantedsInput_input").value;
    let blitzerort = document.getElementById("blitzerInput_input").value

    let infoResult = document.getElementById("infoResult")
    let noticeText = ""
    let removeWeaponLicense = false
    let removeDriverLicense = false

    let bailResult = document.getElementById("bailResult")
    let allBailAllowed = true
    let bailMoney = 0
    let bailText = ""

    let notePadInput = document.getElementById("notepadArea_input").value
    let übergabeOrganisation = document.getElementById("übergabeInput_select").value
    let übergabeDN = document.getElementById("übergabeInput_input").value

    let shortMode = false
    let stpoWanteds = 0
    if (document.getElementById("checkbox_box").checked) shortMode = true

    let fineCollection = document.querySelectorAll(".selected")
    for (var i = 0; i < fineCollection.length; i++) {
        let originalFineAmount = parseInt(fineCollection[i].querySelector(".fineAmount").getAttribute("data-fineamount"));
        
        let fineAfterReue = originalFineAmount;
        if (document.getElementById("reue_box").checked) { 
            fineAfterReue = Math.ceil(originalFineAmount * 1);
        }
        fineAmount = fineAmount + fineAfterReue;
        let extrawanteds_found = fineCollection[i].querySelector(".wantedAmount").querySelectorAll(".selected_extrawanted")
        let extrafines_amount = 0
        for (let b = 0; b < extrawanteds_found.length; b++) {
            if (extrawanteds_found[b].getAttribute("data-addedfine")) fineAmount = fineAmount + parseInt(extrawanteds_found[b].getAttribute("data-addedfine"))
            extrafines_amount = extrafines_amount + parseInt(extrawanteds_found[b].getAttribute("data-addedfine"))
        }

        wantedAmount = wantedAmount + parseInt(fineCollection[i].querySelector(".wantedAmount").getAttribute("data-wantedamount"))
        
        wantedAmount = wantedAmount + fineCollection[i].querySelector(".wantedAmount").querySelectorAll(".selected_extrawanted").length

        if (document.getElementById("stpo_box").checked) {
            let roundedAmount = Math.ceil(fineAmount / 5000) * 5000;
            wantedAmount += Math.floor(roundedAmount / 5000);
        }

        // Überprüfe, ob das Eingabefeld für Systemwanteds leer ist, bevor du seinen Wert parsst
        let systemwanteds = 0;
        if (systemwantedsInput !== "") {
            systemwanteds = parseInt(systemwantedsInput);
        }

        wantedAmount += systemwanteds;

        if (wantedAmount > 5) wantedAmount = 5
        
        const d = new Date();
        const localTime = d.getTime();
        const localOffset = d.getTimezoneOffset() * 60000;
        const utc = localTime + localOffset;
        const offset = 1; // UTC of Germany Time Zone is +01.00
        const germany = utc + (3600000 * offset);
        let now = new Date(germany);

        let hour = now.getHours();
        if (hour < 10) hour = "0" + hour

        let minute = now.getMinutes();
        if (minute < 10) minute = "0" + minute

        let day = now.getDate()
        if (day < 10) day = "0" + day

        let month = now.getMonth() + 1
        if (month < 10) month = "0" + month

        let fineText = ""
        if (fineCollection[i].querySelector(".fineText").innerHTML.includes("<i>")) {
            fineText = fineCollection[i].querySelector(".fineText").innerHTML.split("<i>")[0]
        } else {
            fineText = fineCollection[i].querySelector(".fineText").innerHTML
        }

        if (shortMode) {
            if (reasonText == "") {
                reasonText = `${fineCollection[i].querySelector(".paragraph").hasAttribute("data-paragraphAddition") ? fineCollection[i].querySelector(".paragraph").getAttribute("data-paragraphAddition") + " " : ""}${fineCollection[i].querySelector(".paragraph").innerHTML}`
            } else {
                reasonText += ` + ${fineCollection[i].querySelector(".paragraph").hasAttribute("data-paragraphAddition") ? fineCollection[i].querySelector(".paragraph").getAttribute("data-paragraphAddition") + " " : ""}${fineCollection[i].querySelector(".paragraph").innerHTML}`
            }
        } else {
            if (reasonText == "") {
                reasonText = `${fineCollection[i].querySelector(".paragraph").innerHTML} - ${fineText}`
            } else {
                reasonText += ` + ${fineCollection[i].querySelector(".paragraph").innerHTML} - ${fineText}`
            }
        }

        if (fineCollection[i].getAttribute("data-removedriverlicence") == "true") removeDriverLicense = true
        if (fineCollection[i].getAttribute("data-removeweaponlicence") == "true") removeWeaponLicense = true

        if (fineCollection[i].getAttribute("data-bail") !== "true") {
            allBailAllowed = false;
        }

        if (fineCollection[i].classList.contains("addPlateInList")) {

            document.getElementById("finesListTable").innerHTML +=
            `
            <tr class="finesList_fine">
                <td onclick="JavaScript:copyText(event)">${day}.${month} ${hour}:${minute} - ${fineCollection[i].querySelector(".paragraph").innerHTML} - ${fineText}${plate !== "" ? " - " + plate.toLocaleUpperCase() : ""}${blitzerort !== "" ? " - " + blitzerort : ""}</td>
                <td>$${parseInt(fineCollection[i].querySelector(".fineAmount").getAttribute("data-fineamount")) + extrafines_amount}</td>
            </tr>
            `
        } else {
            document.getElementById("finesListTable").innerHTML +=
            `
            <tr class="finesList_fine">
                <td onclick="JavaScript:copyText(event)">${day}.${month} ${hour}:${minute} - ${fineCollection[i].querySelector(".paragraph").innerHTML} - ${fineText}</td>
                <td>$${parseInt(fineCollection[i].querySelector(".fineAmount").getAttribute("data-fineamount")) + extrafines_amount}</td>
            </tr>
            `
        }

    }

    if (document.getElementById("reue_box").checked && wantedAmount !== 0) { // Means "reue" is active
        wantedAmount = wantedAmount - 1
        if (wantedAmount < 1) wantedAmount = 1
    }

    if (plate != "") {
        reasonText += ` - ${plate.toLocaleUpperCase()}`
    }

    if (blitzerort != "") {
        reasonText += ` - ${blitzerort}`
    }

    if (document.getElementById("stpo_box").checked) {
        reasonText += ` + StPO §2.2`
    }

    if (systemwantedsInput !== "") {
        reasonText += ` + ${systemwantedsInput} Systemwanteds`
    }

    if (document.getElementById("reue_box").checked) {
        reasonText += ` - Reue`
    }

    if((übergabeOrganisation != "none") && ( übergabeDN != "")){
        reasonText += ` | TV Abtransport DN ${übergabeDN}, ${übergabeOrganisation.toLocaleUpperCase()}`
    }

    if(reasonText !== "" && notePadInput != ""){
        reasonText += ` | ${notePadInput}`
    }

    if (removeDriverLicense) {
        noticeText = "Führerschein entziehen"
    }
    if (removeWeaponLicense) {
        if (noticeText =="") {
            noticeText = "Waffenschein entziehen"
        } else {
            noticeText = "Führerschein + Waffenschein entziehen"
        }
    }

    if(fineAmount > 50000){
        fineAmount = 50000;
    }

    bailMoney = wantedAmount * 5000;
    bailText = "($" + bailMoney + ")"

    if(fineCollection.length <= 0){
        bailText = ""
    }

    if (allBailAllowed) {
    bailResult.innerHTML = `<b>Kaution möglich:</b> <span style="color: green;">Ja</span> ${bailText}`;
    } else {
    bailResult.innerHTML = `<b>Kaution möglich:</b> <span style="color: red;">Nein</span>`;
    }

    

    infoResult.innerHTML = `<b>Information:</b> ${noticeText}`
    fineResult.innerHTML = `<b>Geldstrafe:</b> <font style="user-select: all;">$${fineAmount}</font>`
    wantedResult.innerHTML = `<b>Wanteds:</b> <font style="user-select: all;">${wantedAmount}</font>`
    reasonResult.innerHTML = `<b>Grund:</b> <font style="user-select: all;" onclick="JavaScript:copyText(event)">${reasonText}</font>`
    if (reasonText.length <= 150) {
        characterResult.innerHTML = `<b>Zeichen:</b> ${reasonText.length}/150`
    } else {
        characterResult.innerHTML = `<b>Zeichen:</b> <font style="color: red;">${reasonText.length}/150<br>Dieser Grund ist zu lang!</font>`
    }

    console.log(reasonText.length)
}


function showFines() {
    console.log("CLICKED");
    console.log(document.getElementById("finesListContainer").style.opacity);
    if (document.getElementById("finesListContainer").style.opacity == 0) {
        console.log("SHOW");
        document.getElementById("finesListContainer").style.opacity = 1
        document.getElementById("finesListContainer").style.pointerEvents = ""
    } else {
        console.log("HIDE");
        document.getElementById("finesListContainer").style.opacity = 0
        document.getElementById("finesListContainer").style.pointerEvents = "none"
    }
} 

function showAttorneys() {
    if (document.getElementById("attorneyContainer").style.opacity == 0) {
        document.getElementById("attorneyContainer").style.opacity = 1
        document.getElementById("attorneyContainer").style.pointerEvents = ""
    } else {
        document.getElementById("attorneyContainer").style.opacity = 0
        document.getElementById("attorneyContainer").style.pointerEvents = "none"
    }
}


window.onload = async () => {
    console.log("onload");
    let savedBody;
    let alreadyBig = true

    await sleep(Math.round(Math.random() * 2500))

    document.body.innerHTML = document.getElementById("scriptingDiv").innerHTML
    savedBody = document.body.innerHTML

    //openDisclaimer()

    setInterval(() => {
        if (document.body.clientWidth < 700) {
            alreadyBig = false
            document.body.innerHTML = `
            <div style="transform: translate(-50%, -50%); font-weight: 600; font-size: 8vw; color: white; width: 80%; position: relative; left: 50%; top: 50%; text-align: center;">Diese Website kann nur auf einem PC angesehen werden<div>
            `
            document.body.style.backgroundColor = "#121212"
        } else if (alreadyBig == false) {
            alreadyBig = true
            location.reload()
        }
    }, 1)
}

function resetButton() {
    let fineCollection = document.querySelectorAll(".selected")
    for (var i = 0; i < fineCollection.length; i++) {
        fineCollection[i].classList.remove("selected")
    }

    document.getElementById("plateInput_input").value = ""
    document.getElementById("blitzerInput_input").value = ""
    document.getElementById("systemwantedsInput_input").value = ""

    document.getElementById("übergabeInput_select").value = "none"
    document.getElementById("übergabeInput_input").value = ""

    document.getElementById("notepadArea_input").value = ""
    
    document.getElementById("stpo_box").checked = false
    document.getElementById("reue_box").checked = false

    startCalculating()
}

function copyText(event) {
    let target = event.target
    // Get the text field
    var copyText = target.innerHTML
  
    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.replace("<br>", ""));

    insertNotification("success", "Der Text wurde kopiert.", 5)
}

function toggleExtraWanted(event) {
    let target = event.target
    let extrastarNumber = 0
    let isSelected = false
    let isLead = false

    if(target.classList.contains("extrawanted1")) extrastarNumber = 1
    if(target.classList.contains("extrawanted2")) extrastarNumber = 2
    if(target.classList.contains("extrawanted3")) extrastarNumber = 3
    if(target.classList.contains("extrawanted4")) extrastarNumber = 4
    if(target.classList.contains("extrawanted5")) extrastarNumber = 5


    if (target.classList.contains("selected_extrawanted")) isSelected = true

    if (isSelected && target.parentElement.querySelectorAll(".selected_extrawanted").length == extrastarNumber) isLead = true

    if (isSelected && isLead) {


        let foundEnabled = target.parentElement.querySelectorAll(".selected_extrawanted")
        for (let i = 0; i < foundEnabled.length; i++) {
            foundEnabled[i].classList.remove("selected_extrawanted")
            
        }

        startCalculating()
        return
    }

    if (isSelected) {

        console.log("D");

        let found = target.parentElement.querySelectorAll(".extrawanted")
        for (let i = 0; i < found.length; i++) {
            console.log(i, extrastarNumber);
            if (i + 1 > extrastarNumber) {

                found[i].classList.remove("selected_extrawanted")
            }
            
        }

        startCalculating()
        return
    }

    if (!isSelected) {
        let found = target.parentElement.querySelectorAll(".extrawanted")
        for (let i = 0; i < extrastarNumber; i++) {
            found[i].classList.add("selected_extrawanted")
            
        }
    }

    startCalculating()
}

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}