const verbose = {
  isVerbose: false,
  log(msg) {
    if (this.isVerbose)
      console.log(msg);
  }
}

export class ipAddress {
  constructor(parameters) { this.ipStr = ""; this.octets = [], this.prefix = 0; }

  ipAddressFromString(str) {
    let elements = str.split("/")
    verbose.log(elements);
    if (elements.length === 2) {
      verbose.log("IP is in CIDR format");
      // CIDR
      this.prefix = Number(elements[1]);
      if (this.prefix < 0 || this.prefix > 32 || isNaN(this.prefix)) {
        verbose.log("Throwing Error");
        throw new Error(`CIDR can range from 0 to 32, the ip as a CIDR of ${elements[1]}`);
      }

      let octetsStrArr = elements[0].split(".");
      if (octetsStrArr.length !== 4) {
        verbose.log("Throwing Error");
        throw new Error(`Missing octets in ip`);
      }

      for (const i of octetsStrArr) {
        let j = Number(i);
        if (isNaN(j)) {
          verbose.log("Throwing Error");
          throw new Error(`Ip has inappropiate characters in it`);
        }
        if (j > 255 || j < 0) {
          verbose.log("Throwing Error");
          throw new Error(`Invalid range on octet ${j}`);
        }
        this.octets.push(j)
      }
      verbose.log(this.octets);
      verbose.log("IP Parsed");
    } else {
      // Subnet mask

    }

  }

  ipAddressToString() {
    if (this.octets.length === 4)
      return `${this.octets[0]}.${this.octets[1]}.${this.octets[2]}.${this.octets[3]}/${this.prefix}`;
  }

}

//TODO Santize
//TODO Get Total host possible
//TODO Validate Subnet rquirements
//TODO Correct subnet sizes to closest power of 2.
//TODO Subnet Object + Subnet Array
//TODO Alogrithm