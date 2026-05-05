import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ipAddress } from "../IP/ipaddress.js";

export function exportAllocation(subnets) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Network Allocation", 14, 20);

  const now = new Date();

  doc.setFontSize(10);
  doc.text(`Date: ${now.toLocaleDateString()}`, 14, 28);
  doc.text(
    `Time: ${now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    14,
    34
  );

  autoTable(doc, {
    startY: 40,
    head: [["Name", "Hosts", "CIDR", "Network Address", "Broadcast Address"]],
    body: subnets.map((subnet) => {
      const ip = new ipAddress();
      ip.ipAddressFromArray(subnet.octetsArray, subnet.prefix);

      return [
        subnet.name,
        subnet.hostRequirement,
        "/" + subnet.prefix,
        ip.getNetworkAddress(),
        ip.getBroadcastAddress(),
      ];
    }),
  });

  doc.save("network-allocation.pdf");
}