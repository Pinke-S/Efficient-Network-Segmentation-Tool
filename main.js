import {
    getPrefix,
    getTotalAdresses,
    getNextPowerOfTwo, getPrefixFromBlockSize
} from "./src/Utils/network.js";
import {
    exportAllocation
} from "./src/Utils/export.js";


import {
    Subnet,
    getFormRows,
    sortAllocationRequest

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

// Pipeline : HTML Form -> Input Validering -> Parse Subnets -> Sortere Subnets -> Allokere Subnets
const subnetArray = [];

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
});