const IMPL = {
    "CheckpointLoaderSimple": {
        type: "checkpoints",
        getWidgets: n => n.constructor.nodeData.input.required.ckpt_name[0],
        getSelWidget: n => n.widgets[0].value,
        setWidget: (n, v) => n.widgets[0].value = v,
    },
    "ImageOnlyCheckpointLoader": {
        type: "checkpoints",
        getWidgets: n => n.constructor.nodeData.input.required.ckpt_name[0],
        getSelWidget: n => n.widgets[0].value,
        setWidget: (n, v) => n.widgets[0].value = v,
    },
    "unCLIPCheckpointLoader": {
        type: "checkpoints",
        getWidgets: n => n.constructor.nodeData.input.required.ckpt_name[0],
        getSelWidget: n => n.widgets[0].value,
        setWidget: (n, v) => n.widgets[0].value = v,
    },
    "CheckpointLoader": {
        type: "checkpoints",
        getWidgets: n => n.constructor.nodeData.input.required.ckpt_name[0],
        getSelWidget: n => n.widgets[1].value,
        setWidget: (n, v) => n.widgets[1].value = v,
    },
    "VAELoader": {
        type: "vae",
        getWidgets: n => n.constructor.nodeData.input.required.vae_name[0],
        getSelWidget: n => n.widgets[0].value,
        setWidget: (n, v) => n.widgets[0].value = v,
    },
    "CLIPVisionLoader": {
        type: "clip_vision",
        getWidgets: n => n.constructor.nodeData.input.required.clip_name[0],
        getSelWidget: n => n.widgets[0].value,
        setWidget: (n, v) => n.widgets[0].value = v,
    },
    "GLIGENLoader": {
        type: "gligen",
        getWidgets: n => n.constructor.nodeData.input.required.gligen_name[0],
        getSelWidget: n => n.widgets[0].value,
        setWidget: (n, v) => n.widgets[0].value = v,
    },
    "ControlNetLoader": {
        type: "controlnet",
        getWidgets: n => n.constructor.nodeData.input.required.control_net_name[0],
        getSelWidget: n => n.widgets[0].value,
        setWidget: (n, v) => n.widgets[0].value = v,
    },
    "DiffControlNetLoader": {
        type: "controlnet",
        getWidgets: n => n.constructor.nodeData.input.required.control_net_name[0],
        getSelWidget: n => n.widgets[0].value,
        setWidget: (n, v) => n.widgets[0].value = v,
    },
    "LoraLoaderModelOnly": {
        type: "loras",
        getWidgets: n => n.constructor.nodeData.input.required.lora_name[0],
        getSelWidget: n => n.widgets[0].value,
        setWidget: (n, v) => n.widgets[0].value = v,
    },
    "LoraLoader": {
        type: "loras",
        getWidgets: n => n.constructor.nodeData.input.required.lora_name[0],
        getSelWidget: n => n.widgets[0].value,
        setWidget: (n, v) => n.widgets[0].value = v,
    },
    "StyleModelLoader": {
        type: "style_models",
        getWidgets: n => n.constructor.nodeData.input.required.style_model_name[0],
        getSelWidget: n => n.widgets[0].value,
        setWidget: (n, v) => n.widgets[0].value = v,
    },
    "UpscaleModelLoader": {
        type: "upscale_models",
        getWidgets: n => n.constructor.nodeData.input.required.model_name[0],
        getSelWidget: n => n.widgets[0].value,
        setWidget: (n, v) => n.widgets[0].value = v,
    },
    "HypernetworkLoader": {
        type: "hypernetworks",
        getWidgets: n => n.constructor.nodeData.input.required.hypernetwork_name[0],
        getSelWidget: n => n.widgets[0].value,
        setWidget: (n, v) => n.widgets[0].value = v,
    },
    "CLIPLoader": {
        type: "clip",
        getWidgets: n => n.constructor.nodeData.input.required.clip_name[0],
        getSelWidget: n => n.widgets[0].value,
        setWidget: (n, v) => n.widgets[0].value = v,
    },
    // "DualCLIPLoader": {
    //     type: "CLIP",
    //     getWidgets: n => n.constructor.nodeData.input.required.ckpt_name[0]
    // },
    "UNETLoader": {
        type: "unet",
        getWidgets: n => n.constructor.nodeData.input.required.unet_name[0],
        getSelWidget: n => n.widgets[0].value,
        setWidget: (n, v) => n.widgets[0].value = v,
    },
    "DiffusersLoader": {
        type: "diffusers",
        getWidgets: n => n.constructor.nodeData.input.required.model_path[0],
        getSelWidget: n => n.widgets[0].value,
        setWidget: (n, v) => n.widgets[0].value = v,
    },
}
class ModelConfig {
    static dirty = {};
    static config = {};
    static fetchConfig(mtype, models) {
        var request = new XMLHttpRequest();
        request.open("post", "/cs/fetch_config", false);
        // request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.onload = function () {
            if (request.status != 200)
                return;
            var resp = JSON.parse(request.responseText);
            ModelConfig.config[mtype] = resp;
        };
        let body = { mtype: mtype, models: models };
        request.send(JSON.stringify(body));
        // return new Promise(function (resolve, reject) {
        //     const res = fetch("/cs/fetch_config", { method: "POST", body: JSON.stringify({ mtype: mtype }) });
        //     res.then(r => r.json()).then(json => {
        //         if (json.status === "ok") {
        //             ModelConfig.config[mtype] = json.data;
        //             resolve(json.data);
        //         } else {
        //             reject(json);
        //         }
        //     });
        // });
    }
    static async updateConfig() { }
}
class BluePrints {
    constructor() {
        this.blueprints = {};
    }
    CSregister(node, callBack) {
        if (!IMPL.hasOwnProperty(node.constructor.type)) {
            return;
        }
        let btn = node.addWidget("button", "模型管理器", null, callBack);
        btn._node = node;
        BluePrints.prototype.CSwrapNode(node);
        const f = node.onSerialize;
        function onSerialize(o) {
            f?.apply(this, arguments);
            for (var i = 0; i < this.widgets.length; ++i) {
                if (this.widgets[i] == btn) {
                    delete o.widgets_values[i];
                    o.widgets_values = [...o.widgets_values];
                    break
                }
            }
        }
        node.onSerialize = onSerialize;
    }
    CSwrapNode(node) {
        var props = Object.getOwnPropertyNames(BluePrints.prototype);
        for (const prop of props.filter(p => p != "constructor")) {
            node[prop] = BluePrints.prototype[prop];
        }
    }
    CSsetModelWidget(v) {
        IMPL[this.constructor.type]?.setWidget(this, v);
    }
    CSgetModelWidgetType() {
        return IMPL[this.constructor.type].type;
    }
    CSgetSelModelWidget() {
        return IMPL[this.constructor.type].getSelWidget(this);
    }
    CSgetModelWidgets() {
        return IMPL[this.constructor.type].getWidgets(this);
    }
    CSgetModelLists() {
        // console.log(this);
        let l = [];
        let modelList = this.CSgetModelWidgets();
        if (!modelList) {
            return l;
        }
        let mtype = this.CSgetModelWidgetType();
        if (ModelConfig.dirty[mtype] || !ModelConfig.dirty.hasOwnProperty(mtype)) {
            ModelConfig.fetchConfig(mtype, modelList);
            ModelConfig.dirty[mtype] = false;
        }
        let modelConfigs = ModelConfig.config[mtype];
        for (let i = 0; i < modelList.length; i++) {
            let name = modelList[i];
            if (modelConfigs?.hasOwnProperty(name)) {
                l.push(modelConfigs[name])
                continue;
            }
            l.push({
                cover: "https://t7.baidu.com/it/u=737555197,308540855&fm=193&f=GIF",
                level: "C",
                name: name,
                type: "CKPT",
                tags: [],
                creationTime: 1703670704326,
                modifyTime: 1703670678694,
                size: 1,
            });

        }
        return l;
    }
}

export default BluePrints;