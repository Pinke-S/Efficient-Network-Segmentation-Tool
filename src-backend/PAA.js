import { ipAddress } from "./ipaddress.js";

function compareIps(lhs, rhs) {
  if (lhs.octetsArray.length !== rhs.octetsArray.length)
    throw new Error("Arrays not the same length");

  for (let i = 0; i < lhs.octetsArray.length; i++)
    if (lhs.octetsArray[i] !== rhs.octetsArray[i])
      return 0;

  return 1;
}

export function allocateSubnets(isp) {
  let unallocated = isp.subnets;
  let allocated = [];
  let ip = new Object(isp);
  ip.prefix++;
  allocateSubnetsAUX(isp.prefix, ip, allocated, unallocated, 0)
  isp.subnets = allocated;
  return allocated;
}

function allocateSubnetsAUX(minprefix, ip, allocated, unallocated, index) {
  if (index >= unallocated.length)
    return 1;

  if (ip.prefix === unallocated[index].prefix) {

    // is current ip allocated
    let isAllocated = 0;
    for (const element of allocated)
      if (compareIps(element, ip))
        isAllocated = 1;

    // if so backtrack
    if (isAllocated) {
      //if (ip.octetsArray[Math.floor(ip.prefix / 8)] & (Math.pow(2, Math.floor(ip.prefix / 8)) - 1 - Math.pow(2, Math.floor(ip.prefix / 8) - 1) - 1))
      return 0;
    }

    // else Allocate
    let newIp = new ipAddress();
    newIp.copyIp(ip);
    allocated.push(newIp);

    // move to next ip
    let bit = 8 - (ip.prefix - Math.floor(ip.prefix / 8) * 8);
    let mask = new Uint8Array(1);
    mask[0] = 1 << bit;

    ip.octetsArray[Math.floor(ip.prefix / 8)] = ip.octetsArray[Math.floor(ip.prefix / 8)] ^ mask;
    // move to next index
    index++;
  }
  else ip.prefix++;

  // run for next prefix
  // for ip 1 and 2

  let ret = allocateSubnetsAUX(minprefix, ip, allocated, unallocated, index)
  if (!ret) { // backtrack
    ip.prefix--;
    if (ip.prefix === minprefix) {
      throw new Error(`Ip isn't big enugh to allocate one or more ip of prefix ${ip.prefix}`);
      return -1;
    }
    ip.octetsArray = ip.getNetworkAddressArr();

    let bit = 8 - (ip.prefix - Math.floor(ip.prefix / 8) * 8);
    let mask = new Uint8Array(1);
    mask[0] = 1 << bit

    ip.octetsArray[Math.floor(ip.prefix / 8)] = ip.octetsArray[Math.floor(ip.prefix / 8)] ^ mask;
    allocateSubnetsAUX(minprefix, ip, allocated, unallocated, index)
  }
  return 1; // Success

  // return -1; // failure
  // return 0; // backtrack
  // return 1; // Success
}

// function allocateSubnetsAUX(currentprefix, ip, allocated, unallocated, index) {
//   let isAllocated = 0;

//   for (const element of allocated)
//     if (compareArr(element, ip))
//       isAllocated = 1;


//   if (isAllocated) {
//     if (ip[Math.floor(currentprefix / 8)] & (Math.pow(2, currentprefix) - Math.pow(2, currentprefix - 1) - 1)) {
//       // reset to network address
//       ip[Math.floor(currentprefix / 8)] = ip[Math.floor(currentprefix / 8)] ^ (Math.pow(2, currentprefix) - Math.pow(2, currentprefix - 1) - 1);
//       currentprefix--;
//       // increments for the next subnet
//       ip[Math.floor(currentprefix / 8)] = ip[Math.floor(currentprefix / 8)] ^ (Math.pow(2, currentprefix) - Math.pow(2, currentprefix - 1) - 1);
//     }
//     allocateSubnetsAUX(currentprefix, ip, allocated, unallocated, index)
//   }

//   allocated.push(new Uint8Array(ip))

//   if (ip[Math.floor(currentprefix / 8)] & (Math.pow(2, currentprefix) - Math.pow(2, currentprefix - 1) - 1)) {
//     ip[Math.floor(currentprefix / 8)] = ip[Math.floor(currentprefix / 8)] ^ (Math.pow(2, currentprefix) - Math.pow(2, currentprefix - 1) - 1);
//     allocateSubnetsAUX(currentprefix - 1, ip, allocated, unallocated, index)
//   }

//   // switch the bit at the prefix
//   ip[Math.floor(currentprefix / 8)] = ip[Math.floor(currentprefix / 8)] ^ (Math.pow(2, currentprefix) - Math.pow(2, currentprefix - 1) - 1);

//   allocateSubnetsAUX(currentprefix, ip, allocated, unallocated, index + 1)

//   return 1; // Success
// }