# AIGODLIKE-ComfyUI-Studio
Improve the interactive experience of using ComfyUI, such as making the loading of ComfyUI models more intuitive and making it easier to create model thumbnails
![image](https://github.com/AIGODLIKE/AIGODLIKE-ComfyUI-Studio/assets/116185401/8c66b314-0447-4ae9-964b-d9043e8e0690)

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
For some custom nodes that have not been developed using standard methods, manual configuration is required one by one, which may take some time.

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
