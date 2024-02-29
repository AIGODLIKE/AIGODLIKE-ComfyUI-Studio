/**
 * 两种定义Adapter的方式
 * 1. 简化版: 适用于仅有一种模型的节点
 *    参考IMPL中的 xxx_精简版
 * 2. 完全版: 适鳙于有多个模型可配置的节点(如具有两个以上的同类或不同类型 checkpoint\vae\clip...)
 *    参考IMPL中的 xxx_完全版 (案例中假设该节点拥有一个clip 和一个vae模型选项, 其默认项指定为clip_name)
 * Note: 当节点名包含空格或特殊字符时参考以下的 "xxxxx 有空格的节点名" 案例
 */
const IMPL = {
  xxx_精简版: {
    type: "loras",
    getWidgets: (n) => n.constructor.nodeData.input.required.lora_name[0],
    getSelWidget: (n) => n.widgets[1].value,
    setWidget: (n, v) => (n.widgets[1].value = v),
  },
  xxx_完全版: {
    adapter: {
      // 默认使用的模型编辑适配
      default: {
        type: "clip", // 适配的模型类型
        getWidgets: (n) => n.constructor.nodeData.input.required.clip_name[0],
        getSelWidget: (n) => n.widgets[0].value,
        setWidget: (n, v) => (n.widgets[0].value = v),
      },
      // clip模型适配
      clip_name: {
        type: "clip",
        getWidgets: (n) => n.constructor.nodeData.input.required.clip_name[0],
        getSelWidget: (n) => n.widgets[0].value,
        setWidget: (n, v) => (n.widgets[0].value = v),
      },
      // vae模型适配
      vae_name: {
        type: "clip",
        getWidgets: (n) => n.constructor.nodeData.input.required.vae_name[0],
        getSelWidget: (n) => n.widgets[1].value,
        setWidget: (n, v) => (n.widgets[1].value = v),
      },
      // 根据需要添加...
    },
  },
  "xxxxx 有空格的节点名": {
    type: "loras",
    getWidgets: (n) => n.constructor.nodeData.input.required.lora_name[0],
    getSelWidget: (n) => n.widgets[1].value,
    setWidget: (n, v) => (n.widgets[1].value = v),
  },
  CheckpointLoaderSimple: {
    type: "checkpoints",
    getWidgets: (n) => n.constructor.nodeData.input.required.ckpt_name[0],
    getSelWidget: (n) => n.widgets[0].value,
    setWidget: (n, v) => (n.widgets[0].value = v),
  },
  ImageOnlyCheckpointLoader: {
    type: "checkpoints",
    getWidgets: (n) => n.constructor.nodeData.input.required.ckpt_name[0],
    getSelWidget: (n) => n.widgets[0].value,
    setWidget: (n, v) => (n.widgets[0].value = v),
  },
  unCLIPCheckpointLoader: {
    type: "checkpoints",
    getWidgets: (n) => n.constructor.nodeData.input.required.ckpt_name[0],
    getSelWidget: (n) => n.widgets[0].value,
    setWidget: (n, v) => (n.widgets[0].value = v),
  },
  CheckpointLoader: {
    type: "checkpoints",
    getWidgets: (n) => n.constructor.nodeData.input.required.ckpt_name[0],
    getSelWidget: (n) => n.widgets[1].value,
    setWidget: (n, v) => (n.widgets[1].value = v),
  },
  VAELoader: {
    type: "vae",
    getWidgets: (n) => n.constructor.nodeData.input.required.vae_name[0],
    getSelWidget: (n) => n.widgets[0].value,
    setWidget: (n, v) => (n.widgets[0].value = v),
  },
  CLIPVisionLoader: {
    type: "clip_vision",
    getWidgets: (n) => n.constructor.nodeData.input.required.clip_name[0],
    getSelWidget: (n) => n.widgets[0].value,
    setWidget: (n, v) => (n.widgets[0].value = v),
  },
  GLIGENLoader: {
    type: "gligen",
    getWidgets: (n) => n.constructor.nodeData.input.required.gligen_name[0],
    getSelWidget: (n) => n.widgets[0].value,
    setWidget: (n, v) => (n.widgets[0].value = v),
  },
  ControlNetLoader: {
    type: "controlnet",
    getWidgets: (n) => n.constructor.nodeData.input.required.control_net_name[0],
    getSelWidget: (n) => n.widgets[0].value,
    setWidget: (n, v) => (n.widgets[0].value = v),
  },
  DiffControlNetLoader: {
    type: "controlnet",
    getWidgets: (n) => n.constructor.nodeData.input.required.control_net_name[0],
    getSelWidget: (n) => n.widgets[0].value,
    setWidget: (n, v) => (n.widgets[0].value = v),
  },
  LoraLoaderModelOnly: {
    type: "loras",
    getWidgets: (n) => n.constructor.nodeData.input.required.lora_name[0],
    getSelWidget: (n) => n.widgets[0].value,
    setWidget: (n, v) => (n.widgets[0].value = v),
  },
  LoraLoader: {
    type: "loras",
    getWidgets: (n) => n.constructor.nodeData.input.required.lora_name[0],
    getSelWidget: (n) => n.widgets[0].value,
    setWidget: (n, v) => (n.widgets[0].value = v),
  },
  StyleModelLoader: {
    type: "style_models",
    getWidgets: (n) => n.constructor.nodeData.input.required.style_model_name[0],
    getSelWidget: (n) => n.widgets[0].value,
    setWidget: (n, v) => (n.widgets[0].value = v),
  },
  UpscaleModelLoader: {
    type: "upscale_models",
    getWidgets: (n) => n.constructor.nodeData.input.required.model_name[0],
    getSelWidget: (n) => n.widgets[0].value,
    setWidget: (n, v) => (n.widgets[0].value = v),
  },
  HypernetworkLoader: {
    type: "hypernetworks",
    getWidgets: (n) => n.constructor.nodeData.input.required.hypernetwork_name[0],
    getSelWidget: (n) => n.widgets[0].value,
    setWidget: (n, v) => (n.widgets[0].value = v),
  },
  CLIPLoader: {
    type: "clip",
    getWidgets: (n) => n.constructor.nodeData.input.required.clip_name[0],
    getSelWidget: (n) => n.widgets[0].value,
    setWidget: (n, v) => (n.widgets[0].value = v),
  },
  // "DualCLIPLoader": {
  //     type: "CLIP",
  //     getWidgets: n => n.constructor.nodeData.input.required.ckpt_name[0]
  // },
  UNETLoader: {
    type: "unet",
    getWidgets: (n) => n.constructor.nodeData.input.required.unet_name[0],
    getSelWidget: (n) => n.widgets[0].value,
    setWidget: (n, v) => (n.widgets[0].value = v),
  },
  DiffusersLoader: {
    type: "diffusers",
    getWidgets: (n) => n.constructor.nodeData.input.required.model_path[0],
    getSelWidget: (n) => n.widgets[0].value,
    setWidget: (n, v) => (n.widgets[0].value = v),
  },
  DualCLIPLoader: {
    adapter: {
      default: {
        type: "clip",
        getWidgets: (n) => n.constructor.nodeData.input.required.clip_name1[0],
        getSelWidget: (n) => n.widgets[0].value,
        setWidget: (n, v) => (n.widgets[0].value = v),
      },
      clip_name1: {
        type: "clip",
        getWidgets: (n) => n.constructor.nodeData.input.required.clip_name1[0],
        getSelWidget: (n) => n.widgets[0].value,
        setWidget: (n, v) => (n.widgets[0].value = v),
      },
      clip_name2: {
        type: "clip",
        getWidgets: (n) => n.constructor.nodeData.input.required.clip_name2[0],
        getSelWidget: (n) => n.widgets[1].value,
        setWidget: (n, v) => (n.widgets[1].value = v),
      },
    },
  },
  default_factory: function (widget_name) {
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
    let type = default_name2type[widget_name];
    return {
      type,
      getWidgets: (n) => {
        // 先从required中找 然后从optional中找
        for (var i in n.constructor.nodeData.input.required) {
          if (i === widget_name) return n.constructor.nodeData.input.required[i][0];
        }
        for (var i in n.constructor.nodeData.input.optional) {
          if (i === widget_name) return n.constructor.nodeData.input.optional[i][0];
        }
      },
      getSelWidget: (n) => {
        let wl = n.widgets.filter((w) => w.name === widget_name);
        if (wl.length !== 0) return wl[0].value;
      },
      setWidget: (n, v) => {
        let wl = n.widgets.filter((w) => w.name === widget_name);
        if (wl.length !== 0) wl[0].value = v;
      },
    };
  },
};
class ModelConfig {
  static filter_dirty = {};
  static filter = {};
  static config_dirty = {};
  static config = {};
  static fetchFilter(loader) {
    let fetch_all = false;
    if (Object.keys(ModelConfig.filter).length == 0) {
      fetch_all = true;
    }
    var request = new XMLHttpRequest();
    request.open("post", "/cs/fetch_filter", false);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onload = function () {
      if (request.status != 200) return;
      if (fetch_all) {
        var filters = JSON.parse(request.responseText);
        for (let key in filters) {
          ModelConfig.filter[key] = filters[key];
          ModelConfig.filter_dirty[key] = false;
        }
        return;
      } else {
        var resp = JSON.parse(request.responseText);
        ModelConfig.filter[loader] = resp;
        ModelConfig.filter_dirty[loader] = false;
      }
    };
    let body = { loader: loader, fetch_all: fetch_all };
    request.send(JSON.stringify(body));
  }
  static fetchConfig(mtype, models) {
    var request = new XMLHttpRequest();
    request.open("post", "/cs/fetch_config", false);
    // request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onload = function () {
      if (request.status != 200) return;
      var resp = JSON.parse(request.responseText);
      // 如果mtype 不存在则赋值, 否则原位更新
      if (!ModelConfig.config[mtype]) {
        ModelConfig.config[mtype] = resp;
      } else {
        let config = ModelConfig.config[mtype];
        // 原位更新
        for (let key in resp) {
          if (!config[key]) {
            config[key] = resp[key];
          } else {
            for (let key2 in resp[key]) {
              config[key][key2] = resp[key][key2];
            }
          }
        }
      }
      ModelConfig.config_dirty[mtype] = false;
    };
    let body = { mtype: mtype, models: models };
    request.send(JSON.stringify(body));
  }
  static async updateConfig() {}
}
class BluePrints {
  constructor() {
    this.blueprints = {};
  }
  CSregister(node, callBack) {
    BluePrints.prototype.CSwrapNode(node);
    if (IMPL[node.constructor.type] === null) return;
    if (!IMPL.hasOwnProperty(node.constructor.type)) {
      IMPL[node.constructor.type] = null;
      node.CSnative = false;
      return;
    }
    node.CSnative = true;
    let btn = node.addWidget("button", "+", null, callBack);
    Object.defineProperty(btn, "label", {
      get() {
        const vm = window.CSvm;
        if (vm?.$t) {
          return vm.$t("modelManagerBtn");
        }
        return "+";
      },
      set(_) {},
    });
    btn._node = node;
    const f = node.onSerialize;
    function onSerialize(o) {
      f?.apply(this, arguments);
      for (var i = 0; i < this.widgets.length; ++i) {
        if (this.widgets[i] == btn) {
          delete o.widgets_values[i];
          o.widgets_values = [...o.widgets_values];
          break;
        }
      }
    }
    node.onSerialize = onSerialize;
  }
  CSwrapNode(node) {
    var props = Object.getOwnPropertyNames(BluePrints.prototype);
    for (const prop of props.filter((p) => p != "constructor")) {
      node[prop] = BluePrints.prototype[prop];
    }
  }
  CSgetAdapter() {
    let entryWidget = window.CSvm?.entryWidget || "default";
    let adapter = IMPL[this.constructor.type];
    if (adapter == null) {
      return IMPL.default_factory(entryWidget);
    }
    if (entryWidget && adapter.adapter) {
      if (adapter.adapter[entryWidget]) {
        return adapter.adapter[entryWidget];
      }
      return adapter.adapter.default;
    }
    return adapter;
  }
  CSsetModelWidget(v) {
    this.CSgetAdapter()?.setWidget(this, v);
  }
  CSgetModelWidgetType() {
    return this.CSgetAdapter().type;
  }
  CSgetSelModelWidget() {
    return this.CSgetAdapter().getSelWidget(this);
  }
  CSgetModelWidgets() {
    return this.CSgetAdapter().getWidgets(this);
  }
  CSgetModelFilters(cur = false) {
    let loader = this.constructor.type;
    if (ModelConfig.filter_dirty[loader] || !ModelConfig.filter.hasOwnProperty(loader)) {
      ModelConfig.fetchFilter(loader);
    }
    if (cur) {
      return ModelConfig.filter[loader] || [];
    }
    let filters = [];
    for (let key in ModelConfig.filter) {
      filters.push({ name: key, modelList: ModelConfig.filter[key] });
    }
    return filters;
  }
  CSupdateModelConfig(widget) {
    // 未指定则仅更新当前
    if (!widget) {
      widget = this.CSgetSelModelWidget();
    }
    let mtype = this.CSgetModelWidgetType();
    ModelConfig.fetchConfig(mtype, [widget]);
  }
  CSgetModelLists() {
    // console.log(this);
    let l = [];
    let modelList = this.CSgetModelWidgets();
    if (!modelList) {
      return l;
    }
    let mtype = this.CSgetModelWidgetType();
    if (ModelConfig.config_dirty[mtype] || !ModelConfig.config_dirty.hasOwnProperty(mtype)) {
      ModelConfig.fetchConfig(mtype, modelList);
    }
    let modelConfigs = ModelConfig.config[mtype];
    for (let i = 0; i < modelList.length; i++) {
      let name = modelList[i];
      if (modelConfigs?.hasOwnProperty(name)) {
        l.push(modelConfigs[name]);
        continue;
      }
      l.push({
        cover: "",
        level: "D",
        name: name,
        type: "CKPT",
        mtype: mtype,
        tags: [],
        creationTime: 1703733395793,
        modifyTime: 1703733395793,
        size: 0,
      });
    }
    return l;
  }
}

export default BluePrints;
