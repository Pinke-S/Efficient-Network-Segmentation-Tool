import { getTotalAdresses } from "./src/Utils/network.js";
import { exportAllocation } from "./src/Utils/export.js";
import {uploadAllocation, getAllocation} from "./src/retrieveAllocation.js"

import {
  getFormRows,
  sortAllocationRequest,
} from "./src/Subnet/parsing.js";

import "./main.css";

import { validateSubnetAllocation } from "./src/Subnet/inputValidation.js";
import { allocateAddresses } from "./src/Subnet/PAA.js";
import { ipAddress } from "./src/IP/ipaddress.js";

/* =========================
   GLOBAL STATE
========================= */

let latestAllocatedSubnets = [];
let latestIP;

/* add subnet row*/

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

/* fjern row*/

document.querySelectorAll(".removeBtn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.target.parentElement.remove();
  });
});

/* modal */

const modalOverlay = document.getElementById("modalOverlay");
const closeModalBtn = document.getElementById("closeModalBtn");

const modalTitle = document.getElementById("modalTitle");
const modalNetwork = document.getElementById("modalNetwork");
const modalBroadcast = document.getElementById("modalBroadcast");
const modalPrefix = document.getElementById("modalPrefix");
const modalSubnetMask = document.getElementById("modalsubnetmask");
const modalWildcardMask = document.getElementById("modalwildcardmask");
const modalUsableHosts = document.getElementById("modalUHosts");
const modalIPAddress = document.getElementById("modalIPAddress");




closeModalBtn.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.add("hidden");
  }
});

/* submit form til backend */

const form = document.getElementById("subnetForm");
const visualization = document.getElementById("visualization");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const IPInput = document.getElementById("ipInput_id").value.trim();

  try {
    validateSubnetAllocation(IPInput, form);

    const isp = new ipAddress();
    isp.ipAddressFromString(IPInput);

    const subnets = getFormRows(form);
    sortAllocationRequest(subnets);

    subnets.forEach((subnet) => {
      let i = new ipAddress();
      i.name = subnet.name;
      i.prefix = subnet.prefix;
      isp.subnets.push(i);
    })


    const allocatedSubnets = allocateAddresses(isp);
    latestAllocatedSubnets = allocatedSubnets;
    latestIP = isp;
    downloadBtn.disabled = false;
    downloadJsonBtn.disabled = false;
    downloadBtn.style.backgroundColor = "";
    downloadBtn.style.cursor = "pointer";
    downloadJsonBtn.style.backgroundColor = "";
    downloadJsonBtn.style.cursor = "pointer";

    const totalAddresses = getTotalAdresses(isp.prefix);


    renderVisualization(totalAddresses, isp.subnets);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

/* pdf export */

const downloadBtn = document.getElementById("download");
const downloadJsonBtn = document.getElementById("exportJSON");
const retrieveBtn = document.getElementById("retrieve");
const  fileInput = document.getElementById("filePush");

downloadJsonBtn.addEventListener("click", () => {
  uploadAllocation(
      latestAllocatedSubnets,
      "allocation",
      latestIP
  );
});
retrieveBtn.addEventListener("click", async () => {




  if(fileInput.files.length !== 1 ) {alert ('no file selected'); return;}
  const { ISP, subnets } = await getAllocation(fileInput.files);
  console.log(ISP);

    // til at reconstruct isp root IP
  const reconstructedISP = new ipAddress();

  const ispOctets = Array.isArray(ISP.octetsArray)
      ? ISP.octetsArray
      : Object.values(ISP.octetsArray);
  reconstructedISP.ipAddressFromArray(
      ispOctets,
      ISP.prefix
  );

  latestIP = reconstructedISP;

  //reconstruct allokation data
  const reconstructedSubnets = subnets.map((subnetData) => {

    const subnet = new ipAddress();

    const octets = Array.isArray(subnetData.octetsArray)
        ? subnetData.octetsArray
        : Object.values(subnetData.octetsArray);

    subnet.ipAddressFromArray(octets, subnetData.prefix);

    subnet.name = subnetData.name;
    subnet.hostRequirement = subnetData.hostRequirement;
    subnet.nextPowerOfTwo = subnetData.nextPowerOfTwo;
    subnet.rootIP = reconstructedISP;

    return subnet;
  });

  latestAllocatedSubnets = reconstructedSubnets;

  const totalAddresses = reconstructedSubnets.reduce(
      (sum, subnet) => sum + subnet.getTotalAddresses(),
      0
  );

  renderVisualization(totalAddresses, reconstructedSubnets);

  downloadBtn.disabled = false;
  downloadJsonBtn.disabled = false;

  downloadBtn.style.backgroundColor = "";
  downloadBtn.style.cursor = "pointer";

  downloadJsonBtn.style.backgroundColor = "";
  downloadJsonBtn.style.cursor = "pointer";
});


downloadBtn.disabled = true;
downloadJsonBtn.disabled = true;
downloadBtn.style.backgroundColor = "#777";
downloadBtn.style.cursor = "not-allowed";
downloadJsonBtn.style.backgroundColor = "";
downloadJsonBtn.style.cursor = "not-allowed";
downloadJsonBtn.style.backgroundColor = "#777";

if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    if (latestAllocatedSubnets.length === 0) {
      alert("Calculate an allocation before exporting.");
      return;
    }

    exportAllocation(latestIP, latestAllocatedSubnets);
  });
}



/* visual bar */

function renderVisualization(totalAddresses, subnets) {
  visualization.innerHTML = "";

  const bar = document.createElement("div");
  bar.classList.add("networkBar");

  let used = 0;
  let colorsUsed = [];

  subnets.forEach((subnet) => {
    const size = subnet.getTotalAddresses();

    const box = document.createElement("div");
    box.classList.add("subnetBox");

    box.style.flex = size;
    if (subnet.name !== "free")
      box.style.backgroundColor = getRandomColor(colorsUsed);
    else
      box.style.backgroundColor = "#444";

    box.textContent = `${subnet.name} /${subnet.prefix}`;

    box.addEventListener("click", () => {
      modalTitle.textContent = subnet.name;
      modalIPAddress.textContent = subnet.ipAddressToString();
      modalUsableHosts.textContent = subnet.getTotalAvailableHosts();
      modalPrefix.textContent = "/" + subnet.prefix;
      modalNetwork.textContent = subnet.getNetworkAddress();
      modalBroadcast.textContent = subnet.getBroadcastAddress();
      modalSubnetMask.textContent = subnet.getNetMask();
      modalWildcardMask.textContent = subnet.getWildcardMask();



      modalOverlay.classList.remove("hidden");
    });

    bar.appendChild(box);
    used += size;
  }
  );

  // if (used < totalAddresses) {
  //   const free = document.createElement("div");
  //   free.classList.add("subnetBox");
  //   free.style.flex = totalAddresses - used;
  //   free.style.backgroundColor = "#444";
  //   free.textContent = "Free";

  //   bar.appendChild(free);
  // }

  visualization.appendChild(bar);
}

/* kopi af værdien i arrayet.*/

function subnetToIpAddress(subnet) {

  const ip = new ipAddress();
  const octets = Object.values(subnet.octetsArray);
  ip.ipAddressFromArray(octets, subnet.prefix);
  ip.name = subnet.name;
  return ip;
}

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
    "#1dd1a1",
  ];

  if (colorsUsed.length >= colors.length) {
    colorsUsed.length = 0;
  }

  let rnd = colors[Math.floor(Math.random() * colors.length)];

  while (colorsUsed.includes(rnd)) {
    rnd = colors[Math.floor(Math.random() * colors.length)];
  }

  colorsUsed.push(rnd);
  return rnd;
}