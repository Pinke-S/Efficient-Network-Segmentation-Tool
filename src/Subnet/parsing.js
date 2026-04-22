import { getNextPowerOfTwo, getPrefixFromBlockSize } from "../utils/network.js";
     //constructor til subnets,
     export function Subnet(name, host){
        this.name = name; // navn hentet fra form
        this.hostRequirement = host; // host req hentet fra form
        this.nextPowerOfTwo = getNextPowerOfTwo(host); // næste 2^x, (dette er hvad der rigtigt skal allokeres til)
        this.prefix = getPrefixFromBlockSize(this.nextPowerOfTwo); // prefix

     }

     //funktion til at læse værdier på HTML form (den skal ændres alt efter hvordan front end ser ud)
    export function getFormRows(form) {
        const rows = form.querySelectorAll(".row");
        const allocationRequest = [];
        const rows = form.querySelectorAll(".subnetRow");
        const objArr = [];

        rows.forEach(row => {
            const subnet_name = row.querySelector('[name="subnet"]').value;
            const hosts = Number(row.querySelector('[name="hosts"]').value);

            allocationRequest.push(new Subnet(subnet_name, hosts));
        });

        return allocationRequest;
    }

    export function sortAllocationRequest(subnets) {
         //sortere subnets i descending order
        subnets.sort((a, b) => b.nextPowerOfTwo - a.nextPowerOfTwo);
    }



