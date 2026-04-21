// Lav Input Validering ift. subnets

//  Har alle subnet felter navn  + host requirement?

// Har alle fælter gyldige karakter?

// Er summen af alle subnets block size <= tilgænlige addresser til ip addresse?
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
            return false;
        }
    }

    return true;
}


