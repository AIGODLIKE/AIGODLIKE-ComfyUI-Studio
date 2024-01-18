const IMPL = {
    "CheckpointLoaderSimple": {
        type: "Checkpoint",
        getWidget: n => n.constructor.nodeData.input.required.ckpt_name[0],
        setWidget: (n, v) => n.constructor.nodeData.input.required.ckpt_name[0] = v
    },
    "ImageOnlyCheckpointLoader": {
        type: "Checkpoint",
        getWidget: n => n.constructor.nodeData.input.required.ckpt_name[0]
    },
    "unCLIPCheckpointLoader": {
        type: "Checkpoint",
        getWidget: n => n.constructor.nodeData.input.required.ckpt_name[0]
    },
    "CheckpointLoader": {
        type: "Checkpoint",
        getWidget: n => n.constructor.nodeData.input.required.ckpt_name[0]
    },
    "VAELoader": {
        type: "VAE",
        getWidget: n => n.constructor.nodeData.input.required.vae_name[0]
    },
    "CLIPVisionLoader": {
        type: "CLIP Vision",
        getWidget: n => n.constructor.nodeData.input.required.clip_name[0]
    },
    "GLIGENLoader": {
        type: "GLIGEN",
        getWidget: n => n.constructor.nodeData.input.required.gligen_name[0]
    },
    "ControlNetLoader": {
        type: "ControlNet",
        getWidget: n => n.constructor.nodeData.input.required.control_net_name[0]
    },
    "DiffControlNetLoader": {
        type: "ControlNet",
        getWidget: n => n.constructor.nodeData.input.required.control_net_name[0]
    },
    "LoraLoaderModelOnly": {
        type: "LoRA",
        getWidget: n => n.constructor.nodeData.input.required.lora_name[0]
    },
    "LoraLoader": {
        type: "LoRA",
        getWidget: n => n.constructor.nodeData.input.required.lora_name[0]
    },
    "StyleModelLoader": {
        type: "StyleModel",
        getWidget: n => n.constructor.nodeData.input.required.style_model_name[0]
    },
    "UpscaleModelLoader": {
        type: "Upscale",
        getWidget: n => n.constructor.nodeData.input.required.model_name[0]
    },
    "HypernetworkLoader": {
        type: "HyperNetwork",
        getWidget: n => n.constructor.nodeData.input.required.hypernetwork_name[0]
    },
    "CLIPLoader": {
        type: "CLIP",
        getWidget: n => n.constructor.nodeData.input.required.clip_name[0]
    },
    // "DualCLIPLoader": {
    //     type: "CLIP",
    //     getWidget: n => n.constructor.nodeData.input.required.ckpt_name[0]
    // },
    "UNETLoader": {
        type: "UNET",
        getWidget: n => n.constructor.nodeData.input.required.unet_name[0]
    },
    "DiffusersLoader": {
        type: "Diffuser",
        getWidget: n => n.constructor.nodeData.input.required.model_path[0]
    },
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
    CSgetModelWidgetType() {
        return IMPL[this.constructor.type].type;
    }
    CSgetModelWidget() {
        return IMPL[this.constructor.type].getWidget(this);
    }
    CSgetModelLists() {
        console.log(this);
        let l = [];
        let modelList = this.CSgetModelWidget();
        if (!modelList) {
            return l;
        }
        for (let i = 0; i < modelList.length; i++) {
            l.push({
                cover: "https://t7.baidu.com/it/u=737555197,308540855&fm=193&f=GIF",
                level: "C",
                name: modelList[i],
                type: "CKPT",
                tags: ["英雄联盟", "无中生有", "过河拆桥", "发", "是", "怕"],
                creationTime: 1703670704326,
                modifyTime: 1703670678694,
                size: 1,
            });
        }
        return l;
    }
}

export default BluePrints;