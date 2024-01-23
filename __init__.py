import os
import json
import platform
import sys
import numpy as np
import builtins
import torch
import shutil
import hashlib
import atexit
import server
import gc
import execution
import folder_paths
import urllib.parse
from functools import lru_cache
from aiohttp import web
from pathlib import Path
from PIL import Image
from PIL.PngImagePlugin import PngInfo
"""
1. 上传图片到缩略图文件夹
2. 获取模型管理配置
3. 更新模型管理配置

"""
CUR_PATH = Path(__file__).parent.absolute()
MOUNT_ROOT = "/cs/"

CONFIG_PATH = CUR_PATH.joinpath("model-config.json")


class ConfigManager:
    def __init__(self, path: Path = None) -> None:
        self.details = {}
        self.filters = {}
        self.path = path if path else CONFIG_PATH
        self.init_config()

    def init_config(self, config: dict[str, list[dict]] = None):
        if config is None:
            config = self.load_config()
        self.details = config.get("details", {})
        self.filters = config.get("filters", {})

    def get_detail(self, mtype: str) -> list[dict]:
        if mtype not in self.details:
            self.details[mtype] = []
        return self.details.get(mtype)

    def get_filter(self, loader: str) -> list[dict]:
        if loader not in self.filters:
            self.filters[loader] = []
        return self.filters.get(loader)

    def load_config(self):
        if not self.path.exists():
            return {}
        try:
            config: dict[str, list[dict]] = json.loads(self.path.read_text(encoding="utf-8"))
        except Exception as e:
            sys.stderr.write(f"ComfyUI-Studio Fetch config: {e}\n")
            sys.stderr.flush()
            config = {}
        return config

    def dump_config(self, config: dict[str, list[dict]] = None):
        if not self.path.parent.exists():
            self.path.parent.mkdir(parents=True)
        if config is None:
            config = {"details": self.details, "filters": self.filters}
        try:
            self.path.write_text(json.dumps(config, indent=4, ensure_ascii=False), encoding="utf-8")
        except Exception as e:
            sys.stderr.write(f"ComfyUI-Studio Fetch config: {e}\n")
            sys.stderr.flush()


CFG_MANAGER = ConfigManager()


class ModelManager:
    @staticmethod
    def model_path_dict() -> dict[str, tuple[list[str], set[str]]]:
        cfg_example = {
            'checkpoints': (['/MODELPATH1/checkpoints', '/MODELPATH2/checkpoints'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'configs': (['/MODELPATH1/configs'], ['.yaml']),
            'loras': (['/MODELPATH1/loras'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'vae': (['/MODELPATH1/vae', '/MODELPATH2/vae'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'clip': (['/MODELPATH1/clip', '/MODELPATH2/clip'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'unet': (['/MODELPATH1/unet'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'clip_vision': (['/MODELPATH1/clip_vision'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'style_models': (['/MODELPATH1/style_models'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'embeddings': (['/MODELPATH1/embeddings'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'diffusers': (['/MODELPATH1/diffusers'], ['folder']),
            'vae_approx': (['/MODELPATH1/vae_approx'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'controlnet': (['/MODELPATH1/controlnet', '/MODELPATH1/t2i_adapter'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'gligen': (['/MODELPATH1/gligen'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'upscale_models': (['/MODELPATH1/upscale_models'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'custom_nodes': (['/Volumes/FastTemp/AI/ComfyUI/custom_nodes'], []),
            'hypernetworks': (['/MODELPATH1/hypernetworks'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'classifiers': (['/MODELPATH1/classifiers'], {''}),
            'mmdets_bbox': (['/MODELPATH1/mmdets/bbox'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'mmdets_segm': (['/MODELPATH1/mmdets/segm'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'mmdets': (['/MODELPATH1/mmdets'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'sams': (['/MODELPATH1/sams'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'onnx': (['/MODELPATH1/onnx'], {'.onnx'}),
            'ultralytics_bbox': (['/MODELPATH1/ultralytics/bbox'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'ultralytics_segm': (['/MODELPATH1/ultralytics/segm'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'ultralytics': (['/MODELPATH1/ultralytics'], {'.ckpt', '.safetensors', '.pt', '.bin', '.pth'}),
            'annotators': (['/MODELPATH1/annotators'], set())
        }
        return folder_paths.folder_names_and_paths

    @staticmethod
    def model_config(mtype: str):
        return ModelManager.model_path_dict().get(mtype.lower(), [[], {}])

    @staticmethod
    def get_paths(mtype):
        model_cfg = ModelManager.model_config(mtype)
        return model_cfg[0]

    @staticmethod
    def get_suffixes(mtype):
        model_cfg = ModelManager.model_config(mtype)
        return model_cfg[1]

    @staticmethod
    def model_rename(mtype, old_name, new_name):
        """
        重命名模型
        """
        model_path = ModelManager.find_model(mtype, old_name)
        new_model_path = model_path.with_name(new_name)
        model_path.rename(new_model_path)
        for p in ModelManager.get_paths(mtype):
            old_model_path = Path(p).joinpath(old_name)
            if not old_model_path.exists():
                continue
            new_model_path = Path(p).joinpath(new_name)
            old_model_path.rename(new_model_path)
            break
        return
        # 重命名缩略图
        for p in ModelManager.get_paths(mtype):
            old_img_path = Path(p).joinpath(old_name + ".png")
            if not old_img_path.exists():
                continue
            new_img_path = Path(p).joinpath(new_name + ".png")
            old_img_path.rename(new_img_path)
            break

    @staticmethod
    def find_thumbnail(model_name, mtype) -> str:
        img_suffixes = (".jpg", ".jpeg", ".png", ".gif")
        for p in ModelManager.get_paths(mtype):
            model_names = [Path(model_name).stem, Path(model_name).name]
            for model_name in model_names:
                for suffix in img_suffixes:
                    img_name = model_name + suffix
                    img_path = Path(p).joinpath(img_name)
                    if not img_path.exists():
                        continue
                    # sys.stderr.write(img_path.as_posix() + " FIND\n")
                    # sys.stderr.flush()
                    return img_path.as_posix()
        return ""

    @staticmethod
    def remove_thumbnails(mtype, model_name):
        """
        移除同名的 .png, .jpg, .jpeg, .gif 缩略图
        """
        img_suffixes = (".jpg", ".jpeg", ".png", ".gif")
        for p in ModelManager.get_paths(mtype):
            model_names = [Path(model_name).stem, Path(model_name).name]
            for model_name in model_names:
                for suffix in img_suffixes:
                    img_name = model_name + suffix
                    img_path = Path(p).joinpath(img_name)
                    if not img_path.exists():
                        continue
                    img_path.unlink()
                    # sys.stderr.write(img_path.as_posix() + " REMOVE\n")
                    # sys.stderr.flush()

    @staticmethod
    def find_model(mtype, model_name) -> Path:
        """
        从mtype对应的模型路径中查找模型是否存在, 存在则返回对应路径
        """
        for p in ModelManager.get_paths(mtype):
            model_path = Path(p).joinpath(model_name)
            if not model_path.exists():
                continue
            return model_path
        return Path("XXXXX")


@server.PromptServer.instance.routes.post("/cs/upload_thumbnail")
async def upload_thumbnail(request: web.Request):
    post = await request.post()
    image = post.get("image")
    itype = post.get("type")
    mtype = post.get("mtype")
    mname = post.get("name")
    sys.stdout.write(f"Upload Thumbnail: {itype} {mtype} {mname}\n")
    sys.stdout.flush()
    if image and image.file:
        img_name = image.filename
        if not img_name:
            return web.Response(status=400)
        # 获取模型所在路径
        model_path = ModelManager.find_model(mtype, mname)
        if not model_path.exists():
            return web.Response(status=400)
        # 移除同名的 .png, .jpg, .jpeg, .gif 缩略图
        # ModelManager.remove_thumbnails(mtype, mname)
        # 保存缩略图到模型所在路径
        img_path = model_path.with_suffix(Path(img_name).suffix)
        with open(img_path, "wb") as f:
            f.write(image.file.read())
        # 保存缩略图路径到配置文件
        model_configs = CFG_MANAGER.get_detail(mtype)
        for mcfg in model_configs:
            name = mcfg.get("name", "")
            if not name:
                continue
            if name != mname:
                continue
            mcfg["cover"] = img_path.as_posix()
            break
        CFG_MANAGER.dump_config()
        return web.Response(status=200)
    else:
        return web.Response(status=400)


@server.PromptServer.instance.routes.post("/cs/update_config")
async def update_config(request: web.Request):
    post = await request.post()
    data = post.get("data")
    try:
        data = json.loads(data)
        if not isinstance(data, dict):
            raise Exception("data is not dict")
    except Exception as e:
        sys.stderr.write(f"ComfyUI-Studio Update config: {e}\n")
        sys.stderr.flush()
        return web.Response(status=200)
    key = post.get("key")
    mtype = data.get("mtype", "")
    if not mtype:
        sys.stderr.write("ComfyUI-Studio Update config: model type is empty\n")
        sys.stderr.flush()
        return web.Response(status=200)
    # sys.stdout.write(f"Update Config: {data}\n")
    # sys.stdout.write(f"Update Config: {key}\n")
    # sys.stdout.flush()
    mname = data.get("name", "")
    update_data = data.get(key, None)
    if not update_data:
        return web.Response(status=200)
    if key == "name":
        # 更新模型名称
        old_data = post.get("old_data", "")
        if not old_data:
            return web.Response(status=200)
        mname = old_data
        ModelManager.model_rename(mtype, old_data, update_data)

    model_configs = CFG_MANAGER.get_detail(mtype)
    for mcfg in model_configs:
        name = mcfg.get("name", "")
        if not name:
            continue
        if name != mname:
            continue
        mcfg[key] = update_data
        break
    CFG_MANAGER.dump_config()
    return web.Response(status=200)


@server.PromptServer.instance.routes.post("/cs/fetch_config")
async def fetch_config(request: web.Request):
    # post = await request.post()
    # 获取 body
    body = await request.read()
    body = json.loads(body)
    mtype = body.get("mtype")
    if not mtype:
        sys.stderr.write("ComfyUI-Studio Fetch config: model type is empty\n")
        sys.stderr.flush()
        return web.Response(status=200, body="{}")
    models = body.get("models")
    # body = await request.read()
    # body = json.loads(body)
    # mtype = body.get("mtype", "")
    # sys.stdout.write(f"Fetch Model Config: {mtype}\n")
    # sys.stdout.flush()
    example_cfg = {
        "cover": "xxxx.png",
        "level": "D",
        "name": "xxx.ckpt",
        "type": "CKPT",
        "mtype": "Checkpoints",
        "tags": [],
        "creationTime": 1703733395793,
        "modifyTime": 1703733395793,
        "size": 0
    }
    model_configs = CFG_MANAGER.get_detail(mtype)
    old_model_map = {x.get("name", ""): x for x in model_configs}
    ret_model_map = {}
    append = False
    for name in models:
        if name not in old_model_map:
            mcfg = example_cfg.copy()
            mcfg["name"] = name
            model_configs.append(mcfg)
            old_model_map[name] = mcfg
            append = True
        mcfg = old_model_map[name]
        old_cover = mcfg.get("cover", "")
        if not old_cover or not thumbnail_exists(old_cover):
            img_path = ModelManager.find_thumbnail(name, mtype)
            mcfg["cover"] = urllib.parse.quote(path_to_url(img_path))
        ret_model_map[name] = mcfg
        mcfg["mtype"] = mtype
        model_path = ModelManager.find_model(mtype, name)
        if not model_path.exists():
            continue
        mcfg["size"] = model_path.stat().st_size / 1024**2  # MB
        mcfg["creationTime"] = model_path.stat().st_ctime * 1000
        mcfg["modifyTime"] = model_path.stat().st_mtime * 1000
    if append:
        CFG_MANAGER.dump_config()
    json_data = json.dumps(ret_model_map)
    return web.Response(status=200, body=json_data)


@server.PromptServer.instance.routes.post("/cs/update_filter")
async def update_filter(request: web.Request):
    post = await request.post()
    data = post.get("data")
    try:
        data = json.loads(data)
        if not isinstance(data, list):
            raise Exception("data is not list")
    except Exception as e:
        sys.stderr.write(f"ComfyUI-Studio Update filter: {e}\n")
        sys.stderr.flush()
        return web.Response(status=200)

    loader = post.get("loader", "")
    if not loader:
        sys.stderr.write("ComfyUI-Studio Update filter: loader type is empty\n")
        sys.stderr.flush()
        return web.Response(status=200)
    filters = CFG_MANAGER.get_filter(loader)
    filters.clear()
    filters.extend(data)
    CFG_MANAGER.dump_config()
    return web.Response(status=200)


@server.PromptServer.instance.routes.post("/cs/fetch_filter")
async def fetch_filter(request: web.Request):
    body = await request.read()
    body = json.loads(body)
    loader = body.get("loader")
    if not loader:
        sys.stderr.write("ComfyUI-Studio Fetch filter: loader type is empty\n")
        sys.stderr.flush()
        return web.Response(status=200, body="{}")
    fetch_all = body.get("fetch_all", False)
    filters = CFG_MANAGER.get_filter(loader)
    if not filters:
        CFG_MANAGER.dump_config()
    sys.stderr.flush()
    if fetch_all:
        filters = CFG_MANAGER.filters
    json_data = json.dumps(filters)
    return web.Response(status=200, body=json_data)


@server.PromptServer.instance.routes.post("/cs/test")
async def test(request: web.Request):
    post = await request.post()
    json_data = "{}"
    return web.Response(status=200, body=json_data)


def thumbnail_exists(path):
    if not Path(path).exists():
        return
    suffixes = (".jpg", ".jpeg", ".png", ".gif")
    return Path(path).suffix.lower() in suffixes


def path_to_url(path):
    if not path:
        return path
    path = path.replace("\\", "/")
    if not path.startswith("/"):
        path = "/" + path
    while path.startswith("//"):
        path = path[1:]
    return path


def add_static_resource(prefix, path, pprefix=MOUNT_ROOT):
    app = server.PromptServer.instance.app
    prefix = pprefix + urllib.parse.quote(prefix)
    prefix = path_to_url(prefix)
    # sys.stdout.write("Add static path : " + path + "\n")
    # sys.stdout.write("Add static mpath: " + prefix + "\n")
    # sys.stdout.write("-" * len("Add static mpath: " + prefix + "\n"))
    # sys.stdout.flush()
    route = web.static(prefix, path, follow_symlinks=True)
    app.add_routes([route])


def init():
    modelpath_map = ModelManager.model_path_dict()
    for mtype in modelpath_map:
        for path in modelpath_map[mtype][0]:
            if not Path(path).exists():
                continue
            add_static_resource(path, path, "")
    add_static_resource("curpath", CUR_PATH.as_posix())


init()
NODE_CLASS_MAPPINGS = {}
WEB_DIRECTORY = "./loader"
