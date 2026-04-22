import { ipAddress } from "./ipaddress.js";
import { allocateSubnets } from "./PAA.js";


// Arange
let ip = new ipAddress();
ip.ipAddressFromString("192.168.1.0/24");
let subnets = [new ipAddress(), new ipAddress(), new ipAddress()]

subnets[0].prefix = 25;
subnets[1].prefix = 26;
subnets[2].prefix = 26;

ip.addSubnets(subnets);
ip.sortSubnets();

// Act & assert
let networks;
networks = allocateSubnets(ip);

console.log(networks);

//TODO Santize @B
//TODO Get Total host possible @L
//TODO Validate Subnet rquirements @O
//TODO Correct subnet sizes to closest power of 2. @L
//TODO Subnet Object + Subnet Array @l
//TODO Alogrithm

/*
* ISP IP Addres string
* (+) ISP Ip Address as string
* Subnet object
* (+) Navn
* (+) User size
* (+) Growth size
* (+) Nearst Block size (Nearest power of 2 (Celling))
* - CIDR Prefix
* - IP Address Range
* - Broadcast and network address
*/