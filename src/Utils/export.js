import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {validateSubnetAllocation} from "../Subnet/inputValidation.js";

export function exportAllocation(ip, data) {

    if(!validateSubnetAllocation(ip, data)) {
        throw new Error("Cannot export allocation : Invalid subnet allocation");
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Network Allocation", 14, 20); // Måske mulighed for personlig navngivning?

    doc.setFontSize(10);
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    doc.text(`Date: ${dateStr}`, 14, 28);
    doc.text(`Time: ${timeStr}`, 14, 34);

    autoTable(doc,
        {
        startY: 40, // offset til at tabellen kan starte nedenunder titlen
        head: [["Name", "CIDR", "Network Address", "Broadcast Address"]],
        body: data.map(d => [
            d.name,
            d.ip,
            d.networkAddress,
            d.broadcastAddress
        ])
    });

    doc.save("report.pdf");
}