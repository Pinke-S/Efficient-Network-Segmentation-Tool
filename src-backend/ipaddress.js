import { verbose } from "./Util.js";

export class ipAddress {

  constructor() { this.name = "", this.octetsArray = undefined, this.prefix = 0; this.subnets = [] }

  copyIp(ipToCopy) {
    this.name = new String(ipToCopy.String);
    this.octetsArray = new Uint8Array(ipToCopy.octetsArray);
    this.prefix = ipToCopy.prefix;
    this.subnets = new Array(ipToCopy.subnet);
  }

  ipAddressFromArray(arr, prefix) {
    if (arr.length !== 4)
      throw new Error(`Invalid IP ${arr}`);
    this.octetsArray = new Uint8Array(arr);

    if (prefix < 0 || prefix > 32 || isNaN(prefix))
      throw new Error(`CIDR can range from 0 to 32, the ip as a CIDR of ${prefix}`);
    this.prefix = prefix;
  }

  ipAddressFromString(str) {
    let elements = str.split("/")
    verbose.log(elements);
    if (elements.length === 2) {
      // CIDR
      this.prefix = Number(elements[1]);
      if (this.prefix < 0 || this.prefix > 32 || isNaN(this.prefix)) {
        throw new Error(`CIDR can range from 0 to 32, the ip as a CIDR of ${elements[1]}`);
      }

      let octetsStrArr = elements[0].split(".");
      if (octetsStrArr.length !== 4) {
        throw new Error(`Missing octets in ip`);
      }

      let octets = [];
      for (const i of octetsStrArr) {
        let j = Number(i);
        if (isNaN(j)) {
          throw new Error(`Ip has inappropiate characters in it`);
        }
        if (j > 255 || j < 0) {
          throw new Error(`Invalid range on octet ${j}`);
        }

        octets.push(j);
      }

      this.octetsArray = new Uint8Array(octets);
    } else {
      // Subnet mask

    }
  }

  ipAddressToString() {
    if (!this.octetsArray && this.octetsArray.length !== 4)
      throw new Error("Array is undefined or Elements are missing in the array");
    return `${this.octetsArray[0]}.${this.octetsArray[1]}.${this.octetsArray[2]}.${this.octetsArray[3]}/${this.prefix}`;
  }

  setIpName(name) {
    this.name = new String(name);
  }

  getTotalAvailableHosts() {
    return Math.pow(2, (32 - this.prefix)) - 2; // - 2 to account for the broadcast and the network address
  }

  // First ip
  getNetworkAddress() {
    if (!this.octetsArray && this.octetsArray.length !== 4)
      throw new Error("Array is undefined or Elements are missing in the array");

    let networkAddress = new Uint8Array(this.octetsArray);

    networkAddress[Math.floor(this.prefix / 8)] = networkAddress[Math.floor(this.prefix / 8)] & ((Math.pow(2, (32 - this.prefix) % 8) - 1) ^ 255);

    for (let index = Math.ceil(this.prefix / 8); index < networkAddress.length; index++)
      networkAddress[index] = 0;

    return `${networkAddress[0]}.${networkAddress[1]}.${networkAddress[2]}.${networkAddress[3]}/${this.prefix}`;

  }

  // Last ip
  getBroadcastAddress() {
    if (!this.octetsArray && this.octetsArray.length !== 4)
      throw new Error("Array is undefined or Elements are missing in the array");

    let broadcastAddress = new Uint8Array(this.octetsArray);

    broadcastAddress[Math.floor(this.prefix / 8)] = broadcastAddress[Math.floor(this.prefix / 8)] | ((Math.pow(2, (32 - this.prefix) % 8) - 1));

    for (let index = Math.ceil(this.prefix / 8); index < broadcastAddress.length; index++)
      broadcastAddress[index] = 255;

    return `${broadcastAddress[0]}.${broadcastAddress[1]}.${broadcastAddress[2]}.${broadcastAddress[3]}/${this.prefix}`;
  }

  sortSubnets(cmpfunc) {
    if (!cmpfunc) {
      this.subnets.sort((a, b) => { return a.prefix - b.prefix })
    }
    else
      this.subnets.sort(cmpfunc);
  }

  addSubnet(subnet) {
    this.subnets.push(new ipAddress());
    this.subnets[this.subnets.length - 1].copyIp(subnet);
  }

  addSubnets(subnetarr) {
    subnetarr.forEach(element => {
      this.addSubnet(element);
    });
  }

}
