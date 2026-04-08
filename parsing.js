 import {getNextPowerOfTwo, getPrefixFromBlockSize} from "./network.js";

     export function Subnet(name, host){
        this.name = name;
        this.hostRequirement = host;
        this.nextPowerOfTwo = getNextPowerOfTwo(host);
        this.prefix = getPrefixFromBlockSize(this.nextPowerOfTwo);

     }

    export function getFormRows(form) {
        const rows = form.querySelectorAll(".row");
        const objArr = [];

        rows.forEach(row => {
            const subnet_name = row.querySelector('[name="subnet"]').value;
            const hosts = Number(row.querySelector('[name="hosts"]').value);

            objArr.push(new Subnet(subnet_name, hosts));
        });

        return objArr;
    }

    export function sortSubnets(subnets) {
        subnets.sort((a, b) => b.nextPowerOfTwo - a.nextPowerOfTwo);
    }



