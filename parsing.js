import {getNextPowerOfTwo, getPrefixFromHosts} from "./network";

function Subnet(name, host){
    this.name = name;
    this.hostRequirement = host;
    this.nextPowerOfTwo = getNextPowerOfTwo(host);
    this.prefix = getPrefixFromHosts(host);

}

function parseForm(power){

    // skal kun køre, hvis data er valideret
    function getFormRows(form) {
        const rows = form.querySelectorAll(".row");
        const objArr = [];

        rows.forEach(row => {
            const subnet_name = row.querySelector('[name="subnet"]').value;
            const hosts = Number(row.querySelector('[name="hosts"]').value);

            objArr.push(new Subnet(subnet_name, hosts));
        });

        return objArr;
    }
}
