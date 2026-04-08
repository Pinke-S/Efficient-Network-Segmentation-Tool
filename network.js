// network.js
export const IPV4_BITS = 32;
export const BINARY_BASE = 2;

export function getPrefix(ipAddress) {
    const parts = ipAddress.split('/');
    console.log(parts[1]);
    return Number(parts[1]);
}

export function getPrefixFromBlockSize(hosts) {
    return IPV4_BITS - Math.ceil(Math.log2(hosts));
}

export function getTotalAdresses(prefix) {
    return BINARY_BASE ** (IPV4_BITS - prefix);
}

export function getNextPowerOfTwo(hostRequirement) {
    const requestedAddresses = hostRequirement + 2;
    return BINARY_BASE ** Math.ceil(Math.log2(requestedAddresses));
}