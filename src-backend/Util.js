export const verbose = {
  isVerbose: false,
  log(msg) {
    if (this.isVerbose)
      console.log(msg);
  },
  toggleVerbosity() {
    this.isVerbose = !this.isVerbose;
    return this.isVerbose;
  }
}
