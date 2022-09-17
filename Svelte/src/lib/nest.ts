class Nest {
  async setAutoMode(state: boolean) {
    if (state) {
      await fetch("http://localhost:3000/setAutoModeOn", { method: "GET" });
    } else {
      await fetch("http://localhost:3000/setAutoModeOff", { method: "GET" });
    }
  }
}

const nest = new Nest();

export default nest;
