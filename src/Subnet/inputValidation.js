
//  Har alle subnet felter navn  + host requirement?

// Har alle fælter gyldige karakter?

import {Subnet} from "./parsing.js";
import {getNextPowerOfTwo, getTotalAdresses} from "../Utils/network.js";

function isValidIP(ipAddress) {
    const parts = ipAddress.split(".");

    // Tjek om der er 4 dele
    if (parts.length !== 4) {
        return false;
    }

    // Tjek hver del af IP addressen
    for (let i = 0; i < parts.length; i++) {
        let number = Number(parts[i]);

        if (
            parts[i] === "" ||          // tomt felt
            isNaN(number) ||            // ikke et tal
            number < 0 ||               // mindre end 0
            number > 255 ||             // større end 255
            !Number.isInteger(number)   // ikke heltal
        ) {
            throw new Error("Invalid IP address");

        }
    }

    return true;
}

export function validateSubnetAllocation(IP,subnetForm) {

    isValidIP(IP);

    let totalRequired = 0;
    const rows = subnetForm.querySelectorAll(".subnetRow");
    if (rows.length === 0) {
        throw new Error("No subnet rows provided");
    }

    rows.forEach(row => {
        const hosts = Number(row.querySelector('[name="hosts"]').value);
        totalRequired += getNextPowerOfTwo(hosts + 2);
        if(hosts === 0){
            throw new Error("Empty host requirement");
        }

    });

    if( totalRequired > getTotalAdresses(IP) ){
        throw new Error('The number of requested addresses exceed available addresses');
    }

    return true;


}

