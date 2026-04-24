import { verbose } from "./Util.js";


/*
* This class is meant to work as an ip but also a subnet, it has a
* member called subnets which should contain ipaddress with prefix only until allocated.
*/
export function createAddressWithPrefix(prefix) {
  let ip = new ipAddress();
  ip.prefix = prefix;
  return ip;
}


export class ipAddress {

  constructor() { this.name = "", this.octetsArray = undefined, this.prefix = 0; this.subnets = [] }



  // Meant to fill the ip from an Uint8Array and a prefix.
  ipAddressFromArray(arr, prefix) {
    if (arr.length !== 4) // If there isn't 4 octets it not an ip
      throw new Error(`Invalid IP ${arr}`);
    this.octetsArray = new Uint8Array(arr);

    if (isNaN(prefix) || prefix < 0 || prefix > 32) // Makes sure that the prefix is in the proper range
      throw new Error(`CIDR can range from 0 to 32, the ip as a CIDR of ${prefix}`);
    this.prefix = prefix;
  }

  // Meant to parse a string into an ip
  ipAddressFromString(str) {
    let elements = str.split("/") // split the string at the CIDR slash, if it is in CIDR notation

    if (elements.length === 2) { // Checks if it is CIDR notation
      this.prefix = Number(elements[1]);
      if (isNaN(this.prefix) || this.prefix < 0 || this.prefix > 32) { // Makes sure that the prefix is in the proper range
        throw new Error(`CIDR can range from 0 to 32, the ip as a CIDR of ${elements[1]}`);
      }


      let octetsStrArr = elements[0].split("."); // Splits the ip string into octet strings
      if (octetsStrArr.length !== 4) { // If there isn't 4 octets it not an ip
        throw new Error(`Missing octets in ip`);
      }

      let octets = []; // Temporary array to store octets
      for (const i of octetsStrArr) {
        let j = Number(i); // Converts an octet to number, if possible
        if (isNaN(j)) {
          throw new Error(`Ip has inappropiate characters in it`);
        }

        if (j > 255 || j < 0) { // Makes sure the octet is in a valid range
          throw new Error(`Invalid range on octet ${j}`);
        }

        octets.push(j); // Adds it to the temporary array;
      }

      this.octetsArray = new Uint8Array(octets); // Converts the array to a Uint8Array to work easier on bits
    } else {
      // Subnet mask

    }
  }

  // Meant to print the ip to string
  ipAddressToString() {
    if (!this.octetsArray && this.octetsArray.length !== 4)
      throw new Error("Array is undefined or Elements are missing in the array");

    // Prints string with template literal string
    return `${this.octetsArray[0]}.${this.octetsArray[1]}.${this.octetsArray[2]}.${this.octetsArray[3]}/${this.prefix}`;
  }
  ipAddressToBinaryString() {
    if (!this.octetsArray && this.octetsArray.length !== 4)
      throw new Error("Array is undefined or Elements are missing in the array");

    // Prints string with template literal string
    return `${this.octetsArray[0].toString(2)}.${this.octetsArray[1].toString(2)}.${this.octetsArray[2].toString(2)}.${this.octetsArray[3].toString(2)}/${this.prefix}`;
  }


  // First ip
  getNetworkAddress() {
    if (this.octetsArray.length !== 4)  // If there isn't 4 octets it not an ip
      throw new Error("Array is undefined or Elements are missing in the array");

    let networkAddress = this.getNetworkAddressArr();
    return `${networkAddress[0]}.${networkAddress[1]}.${networkAddress[2]}.${networkAddress[3]}/${this.prefix}`;
  }
  getNetworkAddressArr() {
    if (this.octetsArray.length !== 4)  // If there isn't 4 octets it not an ip
      throw new Error("Array is undefined or Elements are missing in the array");

    let networkAddress = new Uint8Array(this.octetsArray);

    // Sets the remaning bits in the octet with prefix to 0
    networkAddress[Math.floor(this.prefix / 8)] = networkAddress[Math.floor(this.prefix / 8)] & ((Math.pow(2, (32 - this.prefix) % 8) - 1) ^ 255);

    // Sets the remaning octets to 0 (00000000)
    for (let index = Math.ceil(this.prefix / 8); index < networkAddress.length; index++)
      networkAddress[index] = 0;

    return networkAddress;
  }

  // Last ip
  getBroadcastAddress() {
    if (this.octetsArray.length !== 4)  // If there isn't 4 octets it not an ip
      throw new Error("Array is undefined or Elements are missing in the array");

    let broadcastAddress = new Uint8Array(this.octetsArray);

    // Sets the remaning bits in the octet with prefix to 1
    broadcastAddress[Math.floor(this.prefix / 8)] = broadcastAddress[Math.floor(this.prefix / 8)] | ((Math.pow(2, (32 - this.prefix) % 8) - 1));

    // Sets the remaning octets to 255 (11111111)
    for (let index = Math.ceil(this.prefix / 8); index < broadcastAddress.length; index++)
      broadcastAddress[index] = 255;

    return `${broadcastAddress[0]}.${broadcastAddress[1]}.${broadcastAddress[2]}.${broadcastAddress[3]}/${this.prefix}`;
  }

  // Set the name of the ip, incase there is a name;
  setIpName(name) {
    this.name = new String(name);
  }

  // gets the total amount of usable hosts
  getTotalAvailableHosts() {
    return Math.pow(2, (32 - this.prefix)) - 2; // - 2 to account for the broadcast and the network address
  }

  // Sort the subnets from lowest prefix first to the highst, by default
  sortSubnets(cmpfunc) {
    if (!cmpfunc) {
      this.subnets.sort((a, b) => { return a.prefix - b.prefix })
    }
    else
      this.subnets.sort(cmpfunc);
  }

  // Add a singular subnet
  addSubnet(subnet) {
    console.log("Deprecated");

    this.subnets.push(new ipAddress());
    this.subnets[this.subnets.length - 1].copyIp(subnet);
  }

  // Adds an array of subnets
  addSubnets(subnetarr) {
    console.log("Deprecated");

    subnetarr.forEach(element => {
      this.addSubnet(element);
    });
  }

  // Meant to easily copy ip addresses and prevent doing it by refrence.
  copyIp(ipToCopy) {
    console.log("Deprecated");

    this.name = new String(ipToCopy.String);
    this.octetsArray = new Uint8Array(ipToCopy.octetsArray);
    this.prefix = ipToCopy.prefix;
    this.subnets = new Array(ipToCopy.subnet);
  }
}
