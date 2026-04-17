import { ipAddress } from "./ipaddress.js";

export function allocateSubnets(isp) {
  let unallocated = isp.subnets;
  allocateSubnetsAUX(isp.prefix + 1, new Uint8Array(isp.octetsArray), unallocated, 0, 0)
}

function allocateSubnetsAUX(currentprefix, ip, unallocated, index, count) {
  if (count === 2)
    return 1;
  if (unallocated[index].prefix === currentprefix) {
    unallocated[index].octetsArray = new Uint8Array(ip);

    // switch the bit at the prefix
    ip[Math.floor(currentprefix / 8)] = ip[Math.floor(currentprefix / 8)] ^ (Math.pow(2, currentprefix) - Math.pow(2, currentprefix - 1) - 1);

    allocateSubnetsAUX(currentprefix, ip, unallocated, index + 1, count + 1);
  }
  else {
    allocateSubnetsAUX(currentprefix + 1, ip, unallocated, index);
  }
  return 0;
}