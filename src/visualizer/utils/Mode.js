class Mode {
  constructor() {
    this.HOVER = 1;
    this.SELECT = 2;
    this.mode = this.HOVER;
  }

  setToHover() {
    this.mode = this.HOVER;
  }

  setToSelect() {
    this.mode = this.SELECT;
  }

  getMode() {
    return this.mode;
  }
}

export default Mode;
