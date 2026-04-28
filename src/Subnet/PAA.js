import { ipAddress } from "../IP/ipaddress.js";


function incrementAddress(ip, minprefix, maxprefix) {
  let before = new Uint8Array(ip);
  if (minprefix === maxprefix) {
    throw new Error(`Can't increament and ip of this range [${minprefix},${maxprefix}]`);
    return 0; // Failure - will never be reached because of the throw
  }

  let octet, bit, mask = new Uint8Array(1);

  for (let i = maxprefix; i > minprefix; i--) {
    if (i === minprefix)
      throw new Error(`Can't increament and ip of this range [${minprefix},${maxprefix}], ${i}`);

    octet = Math.floor((i - 1) / 8);
    bit = 7 - ((i - 1) - octet * 8);

    // if (bit === 8) { // Edge case - bad fix
    //   octet--;
    //   bit = 0;
    // }

    mask[0] = 1 << bit;

    ip[octet] = ip[octet] ^ mask;
    if (ip[octet] & mask)
      return 1; // Success
  }

  throw new Error(`Can't increament ip`);
  return 0; // Failure - will never be reached because of the throw
}

export function allocateAddresses(isp) {
  let curPrefix;
  let toAllocate = isp.subnets;
  let curAddress = new Uint8Array(isp.getNetworkAddressArr());

  for (let i = 0; i < toAllocate.length;) {
    toAllocate[i].octetsArray = new Uint8Array(curAddress);
    curPrefix = toAllocate[i].prefix;
    if (i === toAllocate.length - 1)
      return toAllocate;
    if (incrementAddress(curAddress, isp.prefix, curPrefix)) {
      i++;
    } else
      throw new Error("Can't allocate ip");
  }
  throw new Error("Failed to allocate ips");
}



export function allocateSubnets(isp) {
  console.log("Deprecated");
  return allocateAddresses(isp);
}




// ! old!
// function compareIps(lhs, rhs) {
//   if (lhs.octetsArray.length !== rhs.octetsArray.length)
//     throw new Error("Arrays not the same length");

//   for (let i = 0; i < lhs.octetsArray.length; i++)
//     if (lhs.octetsArray[i] !== rhs.octetsArray[i])
//       return 0;

//   return 1;
// }

// export function allocateSubnets(isp) {
//   let unallocated = isp.subnets;
//   let allocated = [];
//   let ip = new Object(isp);
//   ip.prefix++;
//   allocateSubnetsAUX(isp.prefix, ip, allocated, unallocated, 0)
//   isp.subnets = allocated;
//   return allocated;
// }

// function allocateSubnetsAUX(minprefix, ip, allocated, unallocated, index) {
//   if (index >= unallocated.length)
//     return 1;

//   if (ip.prefix === unallocated[index].prefix) {

//     // is current ip allocated
//     let isAllocated = 0;
//     for (const element of allocated)
//       if (compareIps(element, ip))
//         isAllocated = 1;

//     // if so backtrack
//     if (isAllocated) {
//       //if (ip.octetsArray[Math.floor(ip.prefix / 8)] & (Math.pow(2, Math.floor(ip.prefix / 8)) - 1 - Math.pow(2, Math.floor(ip.prefix / 8) - 1) - 1))
//       return 0;
//     }

//     // else Allocate
//     let newIp = new ipAddress();
//     newIp.copyIp(ip);
//     allocated.push(newIp);

//     // move to next ip
//     let bit = 8 - (ip.prefix - Math.floor(ip.prefix / 8) * 8);
//     let mask = new Uint8Array(1);
//     mask[0] = 1 << bit;

//     ip.octetsArray[Math.floor(ip.prefix / 8)] = ip.octetsArray[Math.floor(ip.prefix / 8)] ^ mask;
//     // move to next index
//     index++;
//   }
//   else ip.prefix++;

//   // run for next prefix
//   // for ip 1 and 2

//   let ret = allocateSubnetsAUX(minprefix, ip, allocated, unallocated, index)
//   if (!ret) { // backtrack
//     ip.prefix--;
//     if (ip.prefix === minprefix) {
//       throw new Error(`Ip isn't big enugh to allocate one or more ip of prefix ${ip.prefix}`);
//       return -1;
//     }
//     ip.octetsArray = ip.getNetworkAddressArr();

//     let bit = 8 - (ip.prefix - Math.floor(ip.prefix / 8) * 8);
//     let mask = new Uint8Array(1);
//     mask[0] = 1 << bit

//     ip.octetsArray[Math.floor(ip.prefix / 8)] = ip.octetsArray[Math.floor(ip.prefix / 8)] ^ mask;
//     allocateSubnetsAUX(minprefix, ip, allocated, unallocated, index)
//   }
//   return 1; // Success

//   // return -1; // failure
//   // return 0; // backtrack
//   // return 1; // Success
// }
