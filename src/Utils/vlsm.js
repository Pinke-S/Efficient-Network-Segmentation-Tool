import { getNextPowerOfTwo, getPrefixFromBlockSize } from "./network.js";
import { ipAddress } from "../IP/ipaddress.js";

export function allocateSubnets(baseIpStr, subnets) {

    const baseIp = new ipAddress();
    baseIp.ipAddressFromString(baseIpStr);

    let currentAddress = baseIp.toInteger();

    subnets.forEach(subnet => {

        // Step 1: calculate size
        const blockSize = getNextPowerOfTwo(subnet.hosts);
        const prefix = getPrefixFromBlockSize(blockSize);

        subnet.blockSize = blockSize;
        subnet.prefix = prefix;

        // Step 2: assign IP
        const ip = ipAddress.fromInteger(currentAddress, prefix);

        subnet.ip = ip;

        subnet.networkAddress = ip.getNetworkAddress();
        subnet.broadcastAddress = ip.getBroadcastAddress();

        // Step 3: move pointer
        currentAddress += blockSize;
    });

    return subnets;
}