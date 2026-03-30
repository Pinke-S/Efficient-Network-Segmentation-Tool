let subnet =
{
  name: "HQ",
  confidence: 100,

  table: {
    tableEntries: [{
      networkName: "Staff",
      networkSize: 256
    },
    {
      networkName: "Guest",
      networkSize: 64
    }],

    initEventListeners() {
    },

    drawTableAfter(element) {

      this.initEventListeners();
    }
  }
}






function init() {



}
init();