import {
    getPrefix,
    getTotalAdresses,
    getNextPowerOfTwo,
    getPrefixFromBlockSize
} from "./src/utils/network.js";
import {
    exportAllocation
} from "./src/utils/export.js";


import {
    Subnet,
    getFormRows,
    sortAllocationRequest,

} from "./src/Subnet/parsing.js";
import {validateSubnetAllocation} from "./src/Subnet/inputValidation.js";



//TODO Design Overhaul
//TODO Collect Data
//TODO Interactive


/*
* ISP IP Addres string
* - ISP Ip Address as string
* Subnet object
* - Navn
* - User size
* - Growth size
* (+) Nearst Block size (Nearest power of 2 (Celling))
* (+) CIDR Prefix
* (+) IP Address Range
* (+) Broadcast and network address
*/

//primitiv test
/*let arr = [];
let IT = new Subnet("IT", 84);
let Cafe = new Subnet("Cafe",12);
let HQ = new Subnet("HQ", 54);
arr.push(IT,Cafe,HQ);
sortAllocationRequest(arr);
console.log(arr[0],arr[1],arr[2]); */


/* tilføj en ny subrow når knappen "add subnet" bliver brugt*/

const addButton = document.getElementById("addSubnetButton_id");
const subnetContainer = document.querySelector(".subnetBlock");

addButton.addEventListener("click", () => {
    const row = document.createElement("div");
    row.classList.add("subnetRow");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "subnet";
    nameInput.placeholder = "Name";

    const hostInput = document.createElement("input");
    hostInput.type = "number";
    hostInput.name = "hosts";
    hostInput.placeholder = "Hosts";
    hostInput.min = "1";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.type = "button";
    removeBtn.classList.add("removeBtn");

    removeBtn.addEventListener("click", () => {
        row.remove();
    });

    row.appendChild(nameInput);
    row.appendChild(hostInput);
    row.appendChild(removeBtn);

    subnetContainer.appendChild(row);
});

/* =========================
   REMOVE EXISTING ROWS
========================= */

document.querySelectorAll(".removeBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.target.parentElement.remove();
    });
});

/* =========================
   FORM + VISUALIZATION
========================= */

const form = document.getElementById("subnetForm");
const visualization = document.getElementById("visualization");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const IPInput = document.getElementById("ipInput_id").value;
    let totalHost =  getTotalAdresses(IPInput.split("/")[1]);


    console.log(IPInput);
    try {
        validateSubnetAllocation(IPInput, form);
        const subnets = getFormRows(form);
        sortAllocationRequest(subnets);
        renderVisualization(totalHost, subnets);

    } catch (err) {
        console.error(err.message);
        alert(err.message);
    }
});

/* =========================
   MODAL SETUP
========================= */

const modalOverlay = document.getElementById("modalOverlay");
const closeModalBtn = document.getElementById("closeModalBtn");

const modalTitle = document.getElementById("modalTitle");
const modalNetwork = document.getElementById("modalNetwork");
const modalBroadcast = document.getElementById("modalBroadcast");
const modalPrefix = document.getElementById("modalPrefix");

closeModalBtn.addEventListener("click", () => {
    modalOverlay.classList.add("hidden");
});

modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.add("hidden");
    }
});

/* =========================
   VISUALIZATION FUNCTION
========================= */

function renderVisualization(totalHost, subnets) {
    visualization.innerHTML = "";

    const TOTAL = totalHost;
    let colorsUsed = [];

    const bar = document.createElement("div");
    bar.classList.add("networkBar");

    let used = 0;

    subnets.forEach(subnet => {
        const size = subnet.nextPowerOfTwo;

        const box = document.createElement("div");
        box.classList.add("subnetBox");

        box.style.flex = size;
        box.style.backgroundColor = getRandomColor(colorsUsed);

        box.textContent = `${subnet.name} (${size})`;

        box.addEventListener("click", () => {
            modalTitle.textContent = subnet.name;

            // Dummy data for now
            modalNetwork.textContent = "192.168.1.0";
            modalBroadcast.textContent = "192.168.1.127";
            modalPrefix.textContent = "/" + subnet.prefix;

            modalOverlay.classList.remove("hidden");
        });

        bar.appendChild(box);
        used += size;
    });

    // Free space
    if (used < TOTAL) {
        const free = document.createElement("div");
        free.classList.add("subnetBox");
        free.style.flex = TOTAL - used;
        free.style.backgroundColor = "#444";
        free.textContent = "Free";

        bar.appendChild(free);
    }

    visualization.appendChild(bar);
}

/* =========================
   COLOR HELPER
========================= */

function getRandomColor(colorsUsed) {

    const colors = [
        "#e6194b",
        "#3cb44b",
        "#ffe119",
        "#4363d8",
        "#f58231",
        "#911eb4",
        "#46f0f0",
        "#f032e6",
        "#bcf60c",
        "#008080",
        "#9a6324",
        "#800000",
        "#808000",
        "#000075",
        "#ff6b6b",
        "#6bc5ff",
        "#ff9f43",
        "#10ac84",
        "#5f27cd",
        "#1dd1a1"
    ];
    if (colorsUsed.length >= colors.length) {colorsUsed.length = 0;}
    let rnd = colors[Math.floor(Math.random() * colors.length)];
    while(colorsUsed.includes(rnd)) {
        rnd = colors[Math.floor(Math.random() * colors.length)];
    }
    colorsUsed.push(rnd);
    return rnd;
}
