C# AIGODLIKE-ComfyUI-Studio
Improve the interactive experience of using ComfyUI, such as making the loading of ComfyUI models more intuitive and making it easier to create model thumbnails

![image](https://github.com/user-attachments/assets/44ec8f54-bd34-420b-9b3c-b1dedffa8b81)

## Function Introduction
|Function|Details|
|:----|:----|
|Loader Model Manager|More intuitive model management (model sorting, labeling, searching, rating, etc.)|
|Model thumbnail|One click generation of model thumbnails or use local images as thumbnails|
|Model shielding|Exclude certain models from appearing in the loader|
|Automatic model labels|Automatically label the outer folder of the model, such as \ ComfyUI \ models \ checkpoints \ SD1.5 \ real \ A.ckpt, and add "SD1.5" and "real" as A.ckpt labels|
|Model matching workflow|Match the matching workflow for the model and support search, add, load, delete, and copy to the clipboard|
|Multilingual|Supports English, Simplified and Traditional Chinese|
## How to install(Only on WINDOWS 10\11)
AIGODLIKE-ComfyUI-STUDIO is equivalent to a custom node, you can use any method you like, just put it in folder custom_nodes

Then run:
```sh
cd ComfyUI/custom_nodes
git clone https://github.com/AIGODLIKE/AIGODLIKE-ComfyUI-Studio.git
```
## How to use it
Find a loader, **left click** on model switch to pop up ComfyUI Studio Manager. If you still need to use the original model list, use **Shift+left** click on model switch to pop up the original model list
## List of supported loaders
1 **Standard Node**: Automatically supports ComfyUI official nodes and standard named * custom node types, which will be automatically taken over when they need to access the models folder.

Standard names: ckpt_name,vae_name,clip_name,gligen_name,control_net_name,lora_name,style_model_name,hypernetwork_name,unet_name.

2 **Non-standard nodes**: Some developers have redefined the model loader for some purpose, which means that non-standard naming prevents the program from automatically adapting and requires manual adaptation, which requires some time and feedback to be added to the support list

|Node name|节点名称|
|:----|:----|
|ImageOnlyCheckpointLoader|Checkpoint加载器(仅图像)|
|CheckpointLoaderSimple|Checkpoint加载器(简易)|
|unCLIPCheckpointLoader|unCLIPCheckpoint加载器|
|CheckpointLoader|Checkpoint加载器|
|VAELoader|VAE加载器|
|CLIPVisionLoader|CLIP视觉加载器|
|GLIGENLoader|GLIGEN加载器|
|ControlNetLoader|ControlNet加载器|
|DiffControlNetLoader|DiffControlNet加载器|
|LoraLoaderModelOnly|LoRA加载器(仅模型)|
|LoraLoader|LoRA加载器|
|StyleModelLoader|风格模型加载器|
|UpscaleModelLoader|放大模型加载器|
|HypernetworkLoader|超网络加载器|
|CLIPLoader|CLIP视觉加载器|
|DualCLIPLoader|双CLIP加载器|
|UNETLoader|UNET加载器|
|DiffusersLoader|扩散加载器|

## TODO
Add more support for functions.
Improve TAG filtering interaction.
