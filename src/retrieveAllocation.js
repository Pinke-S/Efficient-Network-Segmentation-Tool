export function uploadAllocation(subnets, filename, ISP) {

    const allocationData = {
        ISP,
        subnets
    };

    const subnetAllocation = JSON.stringify(allocationData, null, 2);

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

export async function getAllocation(files) {

    const file = files[0];

    const text = await file.text();

    const { ISP, subnets } = JSON.parse(text);

    return { ISP, subnets };
}