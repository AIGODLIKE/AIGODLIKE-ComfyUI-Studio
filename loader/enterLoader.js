import { app } from "../../../../scripts/app.js";
import BluePrints from "./blueprints.js";
import IconRenderer from "./components/public/iconRenderer.js";
function getPage() {
  return document.getElementById("loader_iframe");
}

function loadPage() {
  let page = getPage();
  if (page) return page;
  window.removeEventListener("message", message);
  var realpath = "/cs/loader/index.html";
  const html = `<iframe id="loader_iframe" src="${realpath}" frameborder="0"></iframe>`;
  document.body.insertAdjacentHTML("beforeend", html);
  page = getPage();
  page.style.display = "none";
  let w = page.contentWindow;
  window.addEventListener("message", message);
  // w.focus();
  w.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      w.parent.postMessage({ type: "close_loader_page" }, "*");
    }
  });
}

function callBack() {
  let page = loadPage();
  page.style.display = "block";
  window.CSvm.node = this._node;
  window.CSvm.entryWidget = "default";
  if (!window.CSvm.renderer) {
    window.CSvm.renderer = new IconRenderer();
  }
  page.focus();
}

function message(event) {
  if (event.data.type === "close_loader_page") {
    let page = getPage();
    page.style.display = "none";
    window.CSvm.node = null; // reset node
    // document.body.removeChild(document.getElementById("loader_iframe"));
  }
}

function registerCallBack(node) {
  BluePrints.prototype.CSregister(node, callBack);
}

function styleInit() {
  const style = document.createElement("style");
  style.type = "text/css"; // 已启用 需要更改
  style.innerHTML = `
    iframe {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      background: #000000;
    }
  `;
  document.head.appendChild(style);
}

function shouldPopUp(event, shortcut) {
  var clicked = event.type === LiteGraph.pointerevents_method + "down";
  switch (shortcut) {
    case "click":
      return !event.shiftKey && clicked;
    case "shift_click":
      return event.shiftKey && clicked;
  }
  return false;
}

function popUpReg() {
  let f = LGraphCanvas.prototype.processNodeWidgets;
  function processNodeWidgets(node, pos, event, active_widget) {
    var shortcut = window.CSvm?.$store.state.config.shortcut || "click";
    if (shouldPopUp(event, shortcut)) {
      if (!node.widgets || !node.widgets.length || (!this.allow_interaction && !node.flags.allow_interaction)) {
        return null;
      }

      var x = pos[0] - node.pos[0];
      var y = pos[1] - node.pos[1];
      var width = node.size[0];

      for (var i = 0; i < node.widgets.length; ++i) {
        var w = node.widgets[i];
        // 仅枚举
        if (!w || w.disabled || w.type !== "combo") continue;
        var w_height = w.computeSize ? w.computeSize(width)[1] : LiteGraph.NODE_WIDGET_HEIGHT;
        var w_width = w.width || width;
        // outside
        if (w != active_widget && (x < 6 || x > w_width - 12 || y < w.last_y || y > w.last_y + w_height || w.last_y === undefined)) continue;

        var delta = x < 40 ? -1 : x > w_width - 40 ? 1 : 0;
        if (!delta) {
          // combo clicked
          // console.error(node.title, node.constructor.type, w.name, event.type);
          const default_name2type = {
            ckpt_name: "checkpoints",
            vae_name: "vae",
            clip_name: "clip",
            gligen_name: "gligen",
            control_net_name: "controlnet",
            lora_name: "loras",
            style_model_name: "style_models",
            hypernetwork_name: "hypernetworks",
            unet_name: "unets",
          };
          if (node.CSnative || default_name2type[w.name]) {
            let page = loadPage();
            page.style.display = "block";
            window.CSvm.node = node;
            window.CSvm.entryWidget = w.name;
            if (!window.CSvm.renderer) {
              window.CSvm.renderer = new IconRenderer();
            }
            page.focus();
            return w;
          }
          continue;
        }
      }
    }
    return f.call(this, node, pos, event, active_widget);
  }
  LGraphCanvas.prototype.processNodeWidgets = processNodeWidgets;
  let fff = app.canvas.onMouse;
  function onMouse(event) {
    var w = this.pointer.element.data.getWidgetAtCursor();
    var node = this.graph.getNodeOnPos(event.canvasX, event.canvasY, this.visible_nodes);
    var shortcut = window.CSvm?.$store.state.config.shortcut || "click";
    if (shouldPopUp(event, shortcut)) {
      if (!node.widgets || !node.widgets.length || (!this.allow_interaction && !node.flags.allow_interaction)) {
        return fff ? fff.call(this, event) : false;
      }
      // 仅枚举
      if (!w || w.disabled || w.type !== "combo") {
        return fff ? fff.call(this, event) : false;
      }
      const default_name2type = {
        ckpt_name: "checkpoints",
        vae_name: "vae",
        clip_name: "clip",
        gligen_name: "gligen",
        control_net_name: "controlnet",
        lora_name: "loras",
        style_model_name: "style_models",
        hypernetwork_name: "hypernetworks",
        unet_name: "unets",
      };
      if (node.CSnative || default_name2type[w.name]) {
        let page = loadPage();
        page.style.display = "block";
        window.CSvm.node = node;
        window.CSvm.entryWidget = w.name;
        if (!window.CSvm.renderer) {
          window.CSvm.renderer = new IconRenderer();
        }
        page.focus();
        return true;
      }
    }
    return fff ? fff.call(this, event) : false;
  }
  app.canvas.onMouse = onMouse;
}

const ext = {
  name: "AIGODLIKE.MMM",
  async init(app) {
    loadPage();
    styleInit();
    popUpReg();
  },
  nodeCreated(node, app) {
    registerCallBack(node);
  },
};

app.registerExtension(ext);
