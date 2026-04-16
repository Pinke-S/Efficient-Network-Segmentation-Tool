import {
    getPrefix,
    getTotalAdresses,
    getNextPowerOfTwo, getPrefixFromBlockSize
} from "./network.js";

import {
    Subnet,
    getFormRows,
    sortSubnets

} from "./parsing.js";


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
let arr = [];
let IT = new Subnet("IT", 84);
let Cafe = new Subnet("Cafe",12);
let HQ = new Subnet("HQ", 54);
arr.push(IT,Cafe,HQ);
sortSubnets(arr);
console.log(arr[0],arr[1],arr[2]);