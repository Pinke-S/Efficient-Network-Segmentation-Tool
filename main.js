import { getTotalAdresses } from "./src/Utils/network.js";
import { exportAllocationToPDF, exportAllocationToJson, importAllocationFromJson } from "./src/Utils/export.js";

import {
  getFormRows,
  sortAllocationRequest,
  Subnet,
} from "./src/Subnet/parsing.js";

import { validateSubnetAllocation } from "./src/Subnet/inputValidation.js";
import { allocateAddresses } from "./src/Subnet/PAA.js";
import { ipAddress } from "./src/IP/ipaddress.js";

/* =========================
   GLOBAL STATE
========================= */
let latestIP;
let currentSubnet;

function addSubnetRow(Parent, rowClass) {
  const row = document.createElement("div");
  row.classList.add(rowClass);

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

  Parent.appendChild(row);

  return { row, nameInput, hostInput, removeBtn };
}

function showButtons(show) {
  downloadPdfBtn.disabled = show ? false : true;
  downloadJsonBtn.disabled = show ? false : true;
  downloadPdfBtn.style.backgroundColor = show ? "" : "#777";
  downloadPdfBtn.style.cursor = show ? "pointer" : "not-allowed";
  downloadJsonBtn.style.backgroundColor = show ? "" : "#777";
  downloadJsonBtn.style.cursor = show ? "pointer" : "not-allowed";
}

/* subnet Table*/
const addButton = document.getElementById("addSubnetButton_id");
const subnetContainer = document.querySelector(".subnetBlock");

addButton.addEventListener("click", () => {
  addSubnetRow(subnetContainer, "subnetRow");
});

//  /* fjern row*/
// document.querySelector(".removeBtn")..addEventListener("click", (e) => {
//   e.target.parentElement.remove();
//   console.log(e)
// });



/* modal */
const modalOverlay = document.getElementById("modalOverlay");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalSubnetBlock = document.querySelector(".modalSubnetBlock");

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
  currentSubnet = null;
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.add("hidden");
    currentSubnet = null;
  }
});

document.querySelector("#modalAddSubnetButton_id").addEventListener("click", () => {
  addSubnetRow(modalSubnetBlock, "modalSubnetRow");
})

document.querySelector("#modalSubnetForm").addEventListener("submit", (e) => {
  e.preventDefault();

  if (!currentSubnet) return;
  try {
    let isp = currentSubnet;

    const parsedSubnets = getFormRows(document.querySelector(".modalSubnetBlock"), ".modalSubnetRow");
    sortAllocationRequest(parsedSubnets);

    parsedSubnets.forEach((subnet) => {
      let i = new ipAddress();
      i.name = subnet.name;
      i.prefix = subnet.prefix;
      isp.subnets.push(i);
    })

    const allocatedSubnets = allocateAddresses(isp);
    console.log(isp);

    const totalAddresses = getTotalAdresses(isp.prefix);

    renderVisualization(document.querySelector("#modalVisualization"), totalAddresses, isp.subnets);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }

})

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

    const subnets = getFormRows(subnetContainer, ".subnetRow");
    sortAllocationRequest(subnets);

    subnets.forEach((subnet) => {
      let i = new ipAddress();
      i.name = subnet.name;
      i.prefix = subnet.prefix;
      isp.subnets.push(i);
    })

    const allocatedSubnets = allocateAddresses(isp);
    latestIP = isp;

    showButtons(true);

    const totalAddresses = getTotalAdresses(isp.prefix);


    renderVisualization(visualization, totalAddresses, isp.subnets);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

/* pdf export */
const downloadPdfBtn = document.getElementById("download");
const downloadJsonBtn = document.getElementById("exportJSON");
const retrieveBtn = document.getElementById("retrieve");
const fileInput = document.getElementById("filePush");

downloadJsonBtn.addEventListener("click", () => {
  exportAllocationToJson(
    "allocation",
    latestIP
  );
});

retrieveBtn.addEventListener("click", async () => {
  if (fileInput.files.length !== 1) { alert('no file selected'); return; }
  const ISP = await importAllocationFromJson(fileInput.files);

  // til at reconstruct isp root IP
  const reconstructedISP = new ipAddress();
  reconstructedISP.octetsArray = new Uint8Array(4);
  for (let i = 0; i < 4; i++)
    reconstructedISP.octetsArray[i] = ISP.octetsArray[i];
  reconstructedISP.prefix = ISP.prefix;


  //reconstruct allokation data
  function reconstructSubnets(parentIP, importIPs) {
    importIPs.subnets.forEach((subnet) => {
      const newSubnet = new ipAddress();
      newSubnet.octetsArray = new Uint8Array(4);
      for (let i = 0; i < 4; i++)
        newSubnet.octetsArray[i] = subnet.octetsArray[i];


      newSubnet.prefix = subnet.prefix;
      newSubnet.name = subnet.name;

      const latestIndex = parentIP.subnets.push(newSubnet) - 1;

      if (subnet.subnets)
        reconstructSubnets(parentIP.subnets[latestIndex], subnet);
    })
  }
  reconstructSubnets(reconstructedISP, ISP);


  latestIP = reconstructedISP;

  const totalAddresses = reconstructedISP.getTotalAddresses();


  // Adding IP to table
  const IPInput = document.getElementById("ipInput_id");
  IPInput.value = reconstructedISP.getNetworkAddress();

  document.querySelectorAll(".subnetRow").forEach((e) => {
    e.remove();
  });

  reconstructedISP.subnets.forEach((subnet) => {
    if (subnet.name == "free")
      return;


    const { row, nameInput, hostInput, removeBtn } = addSubnetRow(subnetContainer, "subnetRow");
    nameInput.value = subnet.name;
    hostInput.value = subnet.getTotalAvailableHosts();
  });

  renderVisualization(visualization, totalAddresses, reconstructedISP.subnets);

  showButtons(true);
});

showButtons(false);

if (downloadPdfBtn) {
  downloadPdfBtn.addEventListener("click", () => {
    if (latestIP.subnets.length === 0) {
      alert("Calculate an allocation before exporting.");
      return;
    }

    exportAllocationToPDF(latestIP);
  });
}

/* visual bar */
function renderVisualization(parent, totalAddresses, incommingSubnets) {
  parent.innerHTML = "";

  const bar = document.createElement("div");
  bar.classList.add("networkBar");

  let colorsUsed = [];

  incommingSubnets.forEach((subnet) => {
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
      currentSubnet = subnet;

      modalTitle.textContent = subnet.name;
      modalIPAddress.textContent = subnet.ipAddressToString();
      modalUsableHosts.textContent = subnet.getTotalAvailableHosts();
      modalPrefix.textContent = "/" + subnet.prefix;
      modalNetwork.textContent = subnet.getNetworkAddress();
      modalBroadcast.textContent = subnet.getBroadcastAddress();
      modalSubnetMask.textContent = subnet.getNetMask();
      modalWildcardMask.textContent = subnet.getWildcardMask();

      // removes subnet entries
      document.querySelector("#modalVisualization").innerHTML = "";
      document.querySelectorAll(".modalSubnetRow").forEach((e) => { e.remove(); });

      // Adding pre exsisting subnets
      if (subnet.subnets.length) {
        for (let i = 0; i < subnet.subnets.length; i++) {
          if (subnet.subnets[i].name !== "free") {
            let { row, nameInput, hostInput, removeBtn } = addSubnetRow(modalSubnetBlock, "modalSubnetRow");
            nameInput.value = subnet.subnets[i].name;
            hostInput.value = subnet.subnets[i].getTotalAvailableHosts();
          }
        }
        renderVisualization(document.querySelector("#modalVisualization"), totalAddresses, subnet.subnets);
      }

      modalOverlay.classList.remove("hidden");
    });

    bar.appendChild(box);
  }
  );

  parent.appendChild(bar);
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