import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ipAddress } from "../IP/ipaddress.js";

export function exportAllocation(isp, subnets) {
  const doc = new jsPDF();

  doc.setFont(doc.getFont().fontName, "bold");
  doc.setFontSize(18);
  doc.text("Network Allocation", 14, 20);
  doc.setFont(doc.getFont().fontName, "normal");

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

  doc.setFont(doc.getFont().fontName, "italic");
  doc.setFontSize(10);
  doc.text(`\nISP Address: ${isp.ipAddressToString()}`, 14, 40);
  doc.setFont(doc.getFont().fontName, "normal");

  autoTable(doc, {
    startY: 46,
    head: [["Name", "Hosts", "CIDR", "Network Address", "Broadcast Address", "Subnet Mask", "Wildcard Mask"]],
    body: subnets.map((subnet) => {
      return [
        subnet.name,
        2 ** (32 - subnet.prefix) - 2,
        "/" + subnet.prefix,
        subnet.getNetworkAddress(),
        subnet.getBroadcastAddress(),
        subnet.getNetMask(),
        subnet.getWildcardMask(),
      ];
    }),
  });

  doc.save("network-allocation.pdf");
}