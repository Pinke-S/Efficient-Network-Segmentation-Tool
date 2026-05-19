import { IPV4_BITS, BINARY_BASE } from "../Utils/network.js"

/*
* This class is meant to work as an ip but also a subnet, it has a
* member called subnets which should contain ipaddress with prefix only until allocated.
*/
const LENGTH_OF_8BIT_BYTE = 8;
export const MAX_OCTET_VALUE = 255;
export const MAX_OCTETS = 4;
export const RESERVVED_ADDRESSES = 2;
export const MAX_PREFIX_VALUE = 32;

export function createAddressWithPrefix(prefix) {
  let ip = new ipAddress();
  ip.prefix = prefix;
  return ip;
}

export function getPrefixcOctetAndBit(prefix) {
  let octet = Math.floor((prefix - 1) / LENGTH_OF_8BIT_BYTE);
  let bit = (prefix - 1) % LENGTH_OF_8BIT_BYTE;
  return { octet, bit };
}

export class ipAddress {

  constructor() { this.name = "", this.octetsArray = undefined, this.prefix = 0; this.subnets = [] }

  // Meant to fill the ip from an Uint8Array and a prefix.
  ipAddressFromArray(arr, prefix) {
    if (arr.length !== MAX_OCTETS) // If there isn't 4 octets it not an ip
      throw new Error(`Invalid IP ${arr}`);
    this.octetsArray = new Uint8Array(arr);

    if (isNaN(prefix) || prefix < 0 || prefix > IPV4_BITS) // Makes sure that the prefix is in the proper range
      throw new Error(`CIDR can range from 0 to 32, the ip as a CIDR of ${prefix}`);
    this.prefix = prefix;
  }

  // Meant to parse a string into an ip
  ipAddressFromString(str) {
    let elements = str.split("/") // split the string at the CIDR slash, if it is in CIDR notation

    if (elements.length === 2) { // Checks if it is CIDR notation
      this.prefix = Number(elements[1]);
      if (isNaN(this.prefix) || this.prefix < 0 || this.prefix > MAX_PREFIX_VALUE) { // Makes sure that the prefix is in the proper range
        throw new Error(`CIDR can range from 0 to 32, the ip as a CIDR of ${elements[1]}`);
      }


      let octetsStrArr = elements[0].split("."); // Splits the ip string into octet strings
      if (octetsStrArr.length !== MAX_OCTETS) { // If there isn't 4 octets it not an ip
        throw new Error(`Missing octets in ip`);
      }

      let octets = []; // Temporary array to store octets
      for (const i of octetsStrArr) {
        let j = Number(i); // Converts an octet to number, if possible
        if (isNaN(j)) {
          throw new Error(`Ip has inappropiate characters in it`);
        }

        if (j > MAX_OCTET_VALUE || j < 0) { // Makes sure the octet is in a valid range
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
    if (!this.octetsArray && this.octetsArray.length !== MAX_OCTETS)
      throw new Error("Array is undefined or Elements are missing in the array");

    // Prints string with template literal string
    return `${this.octetsArray[0]}.${this.octetsArray[1]}.${this.octetsArray[2]}.${this.octetsArray[3]}/${this.prefix}`;
  }
  ipAddressToBinaryString() {
    if (!this.octetsArray && this.octetsArray.length !== MAX_OCTETS)
      throw new Error("Array is undefined or Elements are missing in the array");

    // Prints string with template literal string
    return `${this.octetsArray[0].toString(2)}.${this.octetsArray[1].toString(2)}.${this.octetsArray[2].toString(2)}.${this.octetsArray[3].toString(2)}/${this.prefix}`;
  }


  // First ip
  getNetworkAddressArr() {
    if (this.octetsArray.length !== MAX_OCTETS)  // If there isn't 4 octets it not an ip
      throw new Error("Array is undefined or Elements are missing in the array");

    let networkAddress = new Uint8Array(this.octetsArray);
    let mask = new Uint8Array([MAX_OCTET_VALUE]);

    let { octet, bit } = getPrefixcOctetAndBit(this.prefix);
    bit = 7 - bit;
    mask[0] = mask[0] << bit;


    // Sets the remaning bits in the octet with prefix to 0
    networkAddress[octet] &= mask[0];

    // Sets the remaning octets to 0 (00000000)
    for (let index = octet + 1; index < networkAddress.length; index++)
      networkAddress[index] = 0;

    return networkAddress;
  }
  getNetworkAddress() {
    if (this.octetsArray.length !== MAX_OCTETS)  // If there isn't 4 octets it not an ip
      throw new Error("Array is undefined or Elements are missing in the array");

    let networkAddress = this.getNetworkAddressArr();
    return `${networkAddress[0]}.${networkAddress[1]}.${networkAddress[2]}.${networkAddress[3]}/${this.prefix}`;
  }

  // Last ip
  getBroadcastAddressArr() {
    if (this.octetsArray.length !== MAX_OCTETS)  // If there isn't 4 octets it not an ip
      throw new Error("Array is undefined or Elements are missing in the array");

    let broadcastAddress = new Uint8Array(this.octetsArray);

    let { octet, bit } = getPrefixcOctetAndBit(this.prefix);
    bit++;
    let mask = new Uint8Array([MAX_OCTET_VALUE]);
    mask[0] = mask[0] >>> bit;


    // Sets the remaning bits in the octet with prefix to 1
    broadcastAddress[octet] |= mask[0];

    // Sets the remaning octets to 255 (11111111)
    for (let index = octet + 1; index < broadcastAddress.length; index++)
      broadcastAddress[index] = MAX_OCTET_VALUE;

    return broadcastAddress;
  }
  getBroadcastAddress() {
    if (this.octetsArray.length !== MAX_OCTETS)  // If there isn't 4 octets it not an ip
      throw new Error("Array is undefined or Elements are missing in the array");

    let broadcastAddress = this.getBroadcastAddressArr();
    return `${broadcastAddress[0]}.${broadcastAddress[1]}.${broadcastAddress[2]}.${broadcastAddress[3]}/${this.prefix}`;
  }

  getNetMaskArr() {
    let nMask = new Uint8Array([0, 0, 0, 0]);

    let { octet, bit } = getPrefixcOctetAndBit(this.prefix);
    bit = 7 - bit;

    nMask[octet] = MAX_OCTET_VALUE << bit;
    for (let index = 0; index < octet; index++)
      nMask[index] = MAX_OCTET_VALUE;

    return nMask;
  }
  getNetMask() {
    if (this.octetsArray.length !== MAX_OCTETS)  // If there isn't 4 octets it not an ip
      throw new Error("Array is undefined or Elements are missing in the array");

    let nMask = this.getNetMaskArr();
    return `${nMask[0]}.${nMask[1]}.${nMask[2]}.${nMask[3]}`;
  }


  getWildcardMaskArr() {
    let wcMask = this.getNetMaskArr();
    for (let i = 0; i < wcMask.length; i++)
      wcMask[i] = ~wcMask[i];

    return wcMask;
  }
  getWildcardMask() {
    if (this.octetsArray.length !== MAX_OCTETS)  // If there isn't 4 octets it not an ip
      throw new Error("Array is undefined or Elements are missing in the array");

    let wcMask = this.getWildcardMaskArr();
    return `${wcMask[0]}.${wcMask[1]}.${wcMask[2]}.${wcMask[3]}`;
  }



  // gets the total amount of usable hosts
  getTotalAvailableHosts() {
    return Math.pow(BINARY_BASE, (IPV4_BITS - this.prefix)) - RESERVVED_ADDRESSES; // - 2 to account for the broadcast and the network address
  }
  getTotalAddresses() {
    return Math.pow(BINARY_BASE, (IPV4_BITS - this.prefix));
  }

  // Set the name of the ip, incase there is a name;
  setIpName(name) {
    this.name = new String(name);
  }

  // Used for debugging purposes
  printIP() {
    console.log(`${this.name}: ${this.octetsArray[0]}.${this.octetsArray[1]}.${this.octetsArray[2]}.${this.octetsArray[3]}/${this.prefix}`);
    this.subnets.forEach((s) => { if (this.subnets) s.printIP() });
  }

  // Sort the subnets from lowest prefix first to the highst, by default
  sortSubnets(cmpfunc) {
    if (!cmpfunc) {
      this.subnets.sort((a, b) => { return a.prefix - b.prefix })
    }
    else
      this.subnets.sort(cmpfunc);
  }
}
