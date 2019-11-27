
//import { ListItem } from "../Models/ListItem.js";

document.addEventListener('DOMContentLoaded', onHtmlLoaded);

var shoppingItems = [];

function onHtmlLoaded() {
    document.getElementById("addItemButton").addEventListener("click", onAddItemButtonClick);

}; 

function onAddItemButtonClick () {
    var listItem = new ListItem({});
    var itemPreviousState = new ListItem({});
    shoppingItems.push(listItem);
    var tr = createObjectView();  // Create Object raw/html only View
    applyInsertUi(tr); // apply insert UI
    document.getElementById("itemsContainer").append(tr);
    var saveChangesBtn = tr.querySelector("#saveChangesBtn");
    var editBtn = tr.querySelector("#editBtn");
    var cancelBtn = tr.querySelector("#cancelBtn");
    var deleteBtn = tr.querySelector("#deleteBtn");

    saveChangesBtn.addEventListener("click",handleSaveBtnClick(tr, listItem)); 
    editBtn.addEventListener("click",handleEditBtnClick(tr, itemPreviousState));
    cancelBtn.addEventListener("click",handleCancelBtnClick(tr, itemPreviousState));
    deleteBtn.addEventListener("click",handleDeleteBtnClick(tr, listItem));
}

function handleSaveBtnClick(tr,listItem) {
    return function () {
        if(checkMandatoryFields(tr)) {
            applyReadonlyUi(tr);
            writeFromHtmlToObj(tr,listItem);    
        } 
        else {
            promptInfoMessage("Completati campurile obligatorii !!!");
        }
    }
}   

function handleEditBtnClick(tr, itemPreviousState) {
    return function () {
        writeFromHtmlToObj (tr, itemPreviousState);
        applyUpdateUi(tr);
    }
}

function handleCancelBtnClick(tr, itemPreviousState) {
    return function () {
        applyReadonlyUi(tr);
        writeFromObjToHtml(tr, itemPreviousState);
    }
}

function handleDeleteBtnClick(tr, listItem) {
    return function () {
        applyDeleteUi(tr);
        deleteRelatedObject(listItem);
    }
}

function createObjectView () {
    var tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <input type="checkbox" name="checked" value="Y" data-objProp="checked"></input>
            </td>
            <td>
                <input type="text" name="description" data-objProp="description" required></input>
            </td>
            <td>
                <input type="number" name="quantity" data-objProp="quantity" min="0" required></input>
            </td>
            <td>
                <div title="Salveaza" id="saveChangesBtn" class="button">
                    Save
                </div>
                <div title="Editeaza" id="editBtn" class="button">
                    Edit
                </div>
                <div title="Renunta" id="cancelBtn" class="button cancelEditRowBtn">
                    Cancel
                </div>
                <div title="Sterge" id="deleteBtn" class="button deleteRowBtn">
                    Delete
                </div>
             </td>             
        ` 
    return tr;
}

function applyInsertUi (tr) {
    const itemData = Array.from(tr.querySelectorAll("[data-objProp]"));
    itemData.forEach(item => {
        item.classList.remove("readonlyCell");
        item.classList.add("editableCell");
        item.setAttribute("enabled","enabled");
    });
    var saveChangesBtn = tr.querySelector("#saveChangesBtn");
    var editBtn = tr.querySelector("#editBtn");
    var cancelBtn = tr.querySelector("#cancelBtn");
    var deleteBtn = tr.querySelector("#deleteBtn");

    saveChangesBtn.style.visibility = "visible";
    editBtn.style.visibility = "hidden";
    cancelBtn.style.visibility = "hidden";
    deleteBtn.style.visibility = "visible";
}

function applyUpdateUi (tr) {
    const itemData = Array.from(tr.querySelectorAll("[data-objProp]"));
    itemData.forEach(item => {
        item.classList.remove("readonlyCell");
        item.classList.add("editableCell");
        item.removeAttribute("disabled");
    });
    var saveChangesBtn = tr.querySelector("#saveChangesBtn");
    var editBtn = tr.querySelector("#editBtn");
    var cancelBtn = tr.querySelector("#cancelBtn");
    var deleteBtn = tr.querySelector("#deleteBtn");

    saveChangesBtn.style.visibility = "visible";
    editBtn.style.visibility = "hidden";
    cancelBtn.style.visibility = "visible";
    deleteBtn.style.visibility = "hidden";
}

function applyReadonlyUi (tr) {
    const itemData = Array.from(tr.querySelectorAll("[data-objProp]"));
    itemData.forEach(item => {
        item.classList.remove("editableCell");
        item.classList.add("readonlyCell");
        item.setAttribute("disabled","disabled");
    });
    var saveChangesBtn = tr.querySelector("#saveChangesBtn");
    var editBtn = tr.querySelector("#editBtn");
    var cancelBtn = tr.querySelector("#cancelBtn");
    var deleteBtn = tr.querySelector("#deleteBtn");

    saveChangesBtn.style.visibility = "hidden";
    editBtn.style.visibility = "visible";
    cancelBtn.style.visibility = "hidden";
    deleteBtn.style.visibility = "visible";
}

function applyDeleteUi (tr) {
    tr.parentElement.removeChild(tr);
}

function writeFromHtmlToObj (tr, object) {
    const itemData = Array.from(tr.querySelectorAll("[data-objProp]"));
    itemData.forEach( (item) => {
        var prop = item.getAttribute("data-objProp");
        if (item.type === "checkbox") {
            if (item.checked) {
                object[prop] = item.value;
            }
        }
        else {
            object[prop] = item.value;
        };
    })             
}

function writeFromObjToHtml (tr, object) {
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            tr.querySelector(`[data-objProp = "${key}"]`).value = object[key];            
        }
    }
}

function deleteRelatedObject(listItem) {

    for (let i = 0; i < shoppingItems.length; i++) {
        if (shoppingItems[i] == listItem) {
            shoppingItems.splice(i,1);
            break;
        }
    }
}

function checkMandatoryFields(parentElement)  {
    const requiredFields = parentElement.querySelectorAll("input[required]");
    var allRequiredFieldsOK = true;
    requiredFields.forEach( (item)=> {
        if ((item.value === "") || (item.value == 0)) {
            allRequiredFieldsOK = false;
            item.classList.add("mandatoryField");
        }
        else {
            item.classList.remove("mandatoryField");
        }
    })
    return allRequiredFieldsOK;
}

function promptInfoMessage(messageToDisplay) {
    const modalContainer = document.createElement("div");
    modalContainer.id = "OpenModal";
    modalContainer.classList.add("modalDialog");
    modalContainer.innerHTML = 
        `
            <div>
                <p>${messageToDisplay}<p>
                <div>
                    <input type="button" id="hitBtn" class = "button" value="OK">
                </div>
            </div>
        `
    document.body.appendChild(modalContainer);
    document.getElementById("hitBtn")
        .addEventListener("click", () => document.getElementById("OpenModal").remove());
};
