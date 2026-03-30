let subnetgrouping =
{


  table: {
    tableEntries: [{
      networkName: "Staff",
      networkSie: 256
    },
    {
      networkName: "Guest",
      networkSie: 64
    }],

    initEventListeners() {
    },

    drawTableAfter() {

      this.initEventListeners();
    }
  }
}






function init() {



}
init();