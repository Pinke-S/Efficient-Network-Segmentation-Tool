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

    const subnets = getFormRows(form);
    sortAllocationRequest(subnets);

    renderVisualization(subnets);
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

function renderVisualization(subnets) {
    visualization.innerHTML = "";

    const TOTAL = 256; // /24

    const bar = document.createElement("div");
    bar.classList.add("networkBar");

    let used = 0;

    subnets.forEach(subnet => {
        const size = subnet.nextPowerOfTwo;

        const box = document.createElement("div");
        box.classList.add("subnetBox");

        box.style.flex = size;
        box.style.backgroundColor = getRandomColor();

        box.textContent = `${subnet.name} (${size})`;

        // ✅ CLICK HANDLER (FIXED LOCATION)
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

function getRandomColor() {
    const colors = [
        "#3a82f7",
        "#e5533d",
        "#2ecc71",
        "#f1c40f",
        "#9b59b6",
        "#1abc9c"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Pipeline : HTML Form -> Input Validering -> Parse Subnets -> Sortere Subnets -> Allokere Subnets
/*const subnetArray = [];

const dummytabel = [
    {
        name: "Subnet A",
        ip: "192.168.1.10",
        networkAddress: "192.168.1.0",
        broadcastAddress: "192.168.1.255"
    },
    {
        name: "Subnet B",
        ip: "192.168.1.10",
        networkAddress: "192.168.1.0",
        broadcastAddress: "192.168.1.255"
    }
];

document.getElementById("download").addEventListener("click", () => {
    exportAllocation(dummytabel);
}); */