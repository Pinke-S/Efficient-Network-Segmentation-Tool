import { ipAddress, getPrefixcOctetAndBit } from "../IP/ipaddress.js";


function incrementAddress(ip, minprefix, maxprefix) {
  if (minprefix === maxprefix) {
    throw new Error(`Can't increament and ip of this range [${minprefix},${maxprefix}]`);
    return 0; // Failure - will never be reached because of the throw
  }

  let mask = new Uint8Array(1);

  for (let i = maxprefix; i > minprefix; i--) {
    if (i === minprefix)
      throw new Error(`Can't increament and ip of this range [${minprefix},${maxprefix}], ${i}`);

    let { octet, bit } = getPrefixcOctetAndBit(i);
    bit = 7 - bit;


    mask[0] = 1 << bit;

    ip[octet] ^= mask;
    if (ip[octet] & mask)
      return 1; // Success
  }

  throw new Error(`Can't increament ip`);
  return 0; // Failure - will never be reached because of the throw
}

function allocateRemaning(isp, toAllocate, curAddress, curPrefix, name = "free") {
  let mask = new Uint8Array(1);

  while (curPrefix > isp.prefix) {
    let { octet, bit } = getPrefixcOctetAndBit(curPrefix);
    bit = 7 - bit;
    mask = 1 << bit;


    if (!(curAddress[octet] & mask)) {


      curAddress[octet] |= mask;


      let addr = new ipAddress();
      addr.name = name;
      addr.octetsArray = new Uint8Array(curAddress);
      addr.prefix = curPrefix;
      toAllocate.push(addr);
    }


    curPrefix--;
  }
  return toAllocate;
}

export function allocateAddresses(isp) {
  let curPrefix;
  let toAllocate = isp.subnets;
  let curAddress = new Uint8Array(isp.getNetworkAddressArr());

  for (let i = 0; i < toAllocate.length;) {
    toAllocate[i].octetsArray = new Uint8Array(curAddress);
    curPrefix = toAllocate[i].prefix;
    if (i === toAllocate.length - 1)
      return allocateRemaning(isp, toAllocate, curAddress, curPrefix);

    if (incrementAddress(curAddress, isp.prefix, curPrefix)) {
      i++;
    } else
      throw new Error("Can't allocate ip");
  }
  throw new Error("Failed to allocate ips");
}