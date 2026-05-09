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
      return [
        subnet.name,
        2 ** (32 - subnet.prefix) - 2,
        "/" + subnet.prefix,
        subnet.getNetworkAddress(),
        subnet.getBroadcastAddress(),
      ];
    }),
  });

  doc.save("network-allocation.pdf");
}