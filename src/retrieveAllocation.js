export function uploadAllocation(subnets, filename = "allocation") {
    const subnetAllocation = JSON.stringify(subnets, null, 2);

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

    return JSON.parse(text);

}