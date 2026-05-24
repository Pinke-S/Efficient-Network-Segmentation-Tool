import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportAllocationToPDF(isp) {
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

  const ispText =
    isp && typeof isp.ipAddressToString === "function"
      ? isp.ipAddressToString()
      : "Unknown";

  doc.setFont(doc.getFont().fontName, "italic");
  doc.text(`ISP Address: ${ispText}`, 14, 40);
  doc.setFont(doc.getFont().fontName, "normal");

  autoTable(doc, {
    startY: 48,
    head: [[
      "Name",
      "Hosts",
      "CIDR",
      "Network Address",
      "Broadcast Address",
      "Subnet Mask",
      "Wildcard Mask",
    ]],
    body: isp.subnets.map((subnet) => [
      subnet.name,
      2 ** (32 - subnet.prefix) - 2,
      "/" + subnet.prefix,
      subnet.getNetworkAddress(),
      subnet.getBroadcastAddress(),
      subnet.getNetMask(),
      subnet.getWildcardMask(),
    ]),
  });

  doc.save("network-allocation.pdf");
}

export function exportAllocationToJson(filename, ISP) {

  const allocationData = {
    ISP
  };

  const subnetAllocation = JSON.stringify(ISP, null, 2);

  const blob = new Blob([subnetAllocation], {
    type: "application/json"
  });

  const fileUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = `${filename}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(fileUrl);
}

export async function importAllocationFromJson(files) {

  const file = files[0];

  const text = await file.text();

  const ISP = JSON.parse(text);

  return ISP;
}