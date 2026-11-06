// @ts-nocheck
// Registers <infinity-loop>. Only ever reached via a client-side dynamic
// import (see animated-infinity-logo.tsx) — HTMLElement doesn't exist on
// the server, so this file must never be imported statically.

class InfinityLoop extends HTMLElement {
  static get observedAttributes() {
    return ["size", "mode", "speed", "length", "width", "scale-x", "scale-y", "color1", "color2", "arrow", "track", "reverse", "paused"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.p = 0; this.last = 0;
    this.vw = 338; this.vh = 188;
    this.shadowRoot.innerHTML = `
    <style>:host{display:block}svg{width:100%;height:auto;display:block;overflow:visible}</style>
    <svg id="svg" viewBox="-169 -94 338 188" role="img" aria-label="Infinity loop">
      <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0"><stop id="s1" offset="0"/><stop id="s2" offset="1"/></linearGradient></defs>
      <path id="track" fill="none" opacity=".12"/>
      <path id="snake" fill="none" stroke="url(#g)" stroke-linecap="butt" stroke-linejoin="round"/>
      <g id="arrow"><circle id="arrow-base" fill="url(#g)"/><path id="ah" fill="url(#g)"/></g>
    </svg>`;
    const $ = (id) => this.shadowRoot.getElementById(id);
    this.el = { svg: $("svg"), track: $("track"), snake: $("snake"), arrow: $("arrow"), arrowBase: $("arrow-base"), ah: $("ah"), s1: $("s1"), s2: $("s2") };
    this.tick = this.tick.bind(this);
  }
  get num() { return (n, d) => { const v = parseFloat(this.getAttribute(n)); return isNaN(v) ? d : v; }; }
  buildPath() {
    const pts = [], N = 360;
    const rx = this.num("scale-x", 135), ry = this.num("scale-y", 60), w = this.num("width", 16);
    const rev = this.getAttribute("reverse") === "true";
    const normY = 2 * Math.SQRT2;
    for (let i = 0; i < N; i++) {
      const t = (rev ? -1 : 1) * (i / N) * Math.PI * 2;
      const sinT = Math.sin(t), cosT = Math.cos(t), denom = 1 + sinT * sinT;
      pts.push([(rx * cosT) / denom, (ry * normY * sinT * cosT) / denom]);
    }
    const d = "M" + pts.map((p) => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L") + "Z";
    this.el.track.setAttribute("d", d);
    this.el.snake.setAttribute("d", d);
    const pad = w * 1.6 + 8;
    this.vw = (rx + pad) * 2; this.vh = (ry + pad) * 2;
    this.el.svg.setAttribute("viewBox", `${(-this.vw / 2).toFixed(1)} ${(-this.vh / 2).toFixed(1)} ${this.vw.toFixed(1)} ${this.vh.toFixed(1)}`);
    this.total = this.el.snake.getTotalLength();
  }
  style_() {
    const w = this.num("width", 16);
    const baseScale = this.num("size", 460) / 338;
    this.style.width = Math.round(this.vw * baseScale) + "px";
    this.el.s1.setAttribute("stop-color", this.getAttribute("color1") || "#22c55e");
    this.el.s2.setAttribute("stop-color", this.getAttribute("color2") || "#0f9d58");
    for (const k of ["track", "snake"]) this.el[k].setAttribute("stroke-width", w);
    this.el.track.setAttribute("stroke", this.getAttribute("color2") || "#0f9d58");
    this.el.track.style.display = this.getAttribute("track") === "false" ? "none" : "";
    this.el.arrowBase.setAttribute("r", w / 2);
    const k = w * 1.25;
    this.el.ah.setAttribute("d", `M${k * 1.5} 0L${-k * 0.2} ${-k}L${k * 0.3} 0L${-k * 0.2} ${k}Z`);
  }
  connectedCallback() { this.buildPath(); this.style_(); this.last = performance.now(); this.raf = requestAnimationFrame(this.tick); }
  disconnectedCallback() { cancelAnimationFrame(this.raf); }
  attributeChangedCallback(n) {
    if (!this.isConnected) return;
    if (n === "reverse" || n === "scale-x" || n === "scale-y" || n === "width") this.buildPath();
    this.style_();
  }
tick(now) {
  const dt = Math.min((now - this.last) / 1000, 0.01); this.last = now;
  if (!this.hasAttribute("paused")) {
    const mode = this.getAttribute("mode") || "snake", sp = this.num("speed", 0.5);
    const lapLen = mode === "draw" ? 2 : 1;
    const lapFrac = (((this.p % lapLen) + lapLen) % lapLen) / lapLen; // 0 → 1 within the current lap
    const MAX_MULT = 5;
    const mult = Math.pow(MAX_MULT, lapFrac); // 1x at lap start, 5x at lap end, exponential between
    this.p = (this.p + dt * sp * mult * (mode === "draw" ? 2 : 1)) % lapLen;
  }
  this.render();
  this.raf = requestAnimationFrame(this.tick);
}
  render() {
    const T = this.total, mode = this.getAttribute("mode") || "snake";
    let head, tail;
    if (mode === "draw") {
      const e = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
      head = e(Math.min(this.p, 1)); tail = e(Math.max(this.p - 1, 0));
    } else { head = this.p; tail = head - this.lenFrac(); }
    const d = Math.max((head - tail) * T, 0.01);
    const tl = (((tail % 1) + 1) % 1) * T;
    this.el.snake.setAttribute("stroke-dasharray", `${Math.min(d, T - 0.01)} ${Math.max(T - d, 0.01)}`);
    this.el.snake.setAttribute("stroke-dashoffset", -tl);
    const show = this.getAttribute("arrow") !== "false" && d > 2;
    this.el.arrow.style.display = show ? "" : "none";
    if (show) {
      const h = (((head % 1) + 1) % 1) * T;
      const A = this.el.snake.getPointAtLength(h), B = this.el.snake.getPointAtLength((h + 1.5) % T), C = this.el.snake.getPointAtLength((h - 1.5 + T) % T);
      const ang = (Math.atan2(B.y - C.y, B.x - C.x) * 180) / Math.PI;
      this.el.arrow.setAttribute("transform", `translate(${A.x} ${A.y}) rotate(${ang})`);
    }
  }
  lenFrac() { let l = this.num("length", 0.35); return l > 1 ? l / 100 : l; }
}

if (typeof window !== "undefined" && !customElements.get("infinity-loop")) {
  customElements.define("infinity-loop", InfinityLoop);
}