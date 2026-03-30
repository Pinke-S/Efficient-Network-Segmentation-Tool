const htmlIDs = {
  subnetAddButton: "addSubnetButton_id",
  ipInput: "ipInput_id",
  applyButton: "subnetApplyButton_id",
  subnetfieldset: "subnetFieldset_id",
}

const htmlClasses = {
  subnetEntries: "subnetEntries_class",
}

let subnetidCount = 1; //! ALWAYS INCREMENT TO PRVENENT OVERLAP

let subnets = [
  { name: "HQ", confidence: 100, id: "subnetEnrtryN0_id", networks: [{ name: "Staff", size: 256 }, { name: "Guest", size: 64 }] }
];

function createSubnetField(subnet) {
  let field = document.createElement("fieldset");
  field.id = subnet.id;

  /*
  1. Make table
  2. Add "Add Network" button
  2. Add even listener to the button
  */

  return field;
}

function addSubnet() {
  let subnet = { name: "", confidence: 100, id: `subnetEnrtryN${subnetidCount}_id`, networks: [] };
  subnets.push(subnet);
  subnetidCount++;

  let newFieldset = createSubnetField(subnet);
  newFieldset.className = htmlClasses.subnetEntries;


  let htmlElements = document.querySelectorAll("." + htmlClasses.subnetEntries);

  htmlElements[htmlElements.length - 1].after(newFieldset);
}

function updateSubnets() {
  let fieldlist = document.querySelectorAll(".subnetEntries_class")
  for (let i = 0; i < fieldlist.length; i++) {

  }
  console.log(fieldlist);
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  console.log("Document Loadded");
  document.querySelector("#" + htmlIDs.subnetAddButton).addEventListener("click", (event) => { addSubnet(); })
  document.querySelector("#" + htmlIDs.applyButton).addEventListener("click", (event) => { event.preventDefault(); updateSubnets() })
})