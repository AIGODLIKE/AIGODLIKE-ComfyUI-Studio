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
            if (request.status != 200)
                return;
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
            if (request.status != 200)
                return;
            var resp = JSON.parse(request.responseText);
            ModelConfig.config[mtype] = resp;
            ModelConfig.config_dirty[mtype] = false;
        };
        let body = { mtype: mtype, models: models };
        request.send(JSON.stringify(body));
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
        let btn = node.addWidget("button", "+", null, callBack);
        Object.defineProperty(btn, "label", {
            get(){
                const vm = window.CSvm;
                if(vm?.$t){
                    return vm.$t("modelManagerBtn");
                }
                return "+";
            },
            set(_){}
        });
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
    CSgetModelFilters(cur=false) {
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
                l.push(modelConfigs[name])
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