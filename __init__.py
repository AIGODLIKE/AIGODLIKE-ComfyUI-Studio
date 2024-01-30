import json
import sys
import atexit
import server
import time
import folder_paths
import urllib.parse
from copy import deepcopy
from aiohttp import web
from pathlib import Path
from .utils import read_json
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
        self.dirty = False
        self.details = {}
        self.filters = {}
        self.path = path if path else CONFIG_PATH
        self.init_config()

    def init_config(self, config: dict[str, list[dict]] = None):
        if config is None:
            config = self.load_config()
        self.details = config.get("details", {})
        self.filters = config.get("filters", {})

    def get_detail(self, mtype: str) -> dict[dict]:
        if mtype not in self.details:
            self.details[mtype] = {}
        return self.details.get(mtype)

    def get_filter(self, loader: str) -> list[dict]:
        if loader not in self.filters:
            self.filters[loader] = []
        return self.filters.get(loader)

    def load_config(self):
        if not self.path.exists():
            return {}
        try:
            config: dict[str, list[dict]] = read_json(self.path)
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
            self.path.write_text(json.dumps(config, indent=4, ensure_ascii=False), encoding="utf8")
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
        # 模型重命名
        model_path = ModelManager.find_model(mtype, old_name)
        new_model_path = model_path.with_name(new_name)
        model_path.rename(new_model_path)
        # detail / filters 重命名
        try:
            detail = CFG_MANAGER.get_detail(mtype)
            if old_name in detail:
                mcfg = detail.pop(old_name)
                mcfg["name"] = new_name
                detail[new_name] = mcfg
                cover = mcfg.get("cover", "")
                if cover and Path(cover).exists():
                    cover = Path(cover)
                    new_cover_name = cover.name.replace(old_name, new_name)
                    new_cover = cover.with_name(new_cover_name)
                    cover.rename(new_cover)
                    mcfg["cover"] = new_cover.as_posix()
            if old_name in CFG_MANAGER.filters:
                CFG_MANAGER.filters[new_name] = CFG_MANAGER.filters.pop(old_name)
        except Exception:
            import traceback
            traceback.print_exc()

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
    mtype = post.get("mtype")
    mname = post.get("name")
    # itype = post.get("type")
    # sys.stdout.write(f"Upload Thumbnail: {itype} {mtype} {mname}\n")
    # sys.stdout.flush()
    ret_json = {"status": False, "msg": ""}
    if not image or not image.file:
        # 无效图片
        ret_json["msg"] = "Invalid image"
        return web.Response(status=400, body=json.dumps(ret_json))
    img_name = image.filename
    if not img_name:
        # 无文件名
        ret_json["msg"] = "Invalid image name"
        return web.Response(status=400, body=json.dumps(ret_json))
    model_path = ModelManager.find_model(mtype, mname)
    if not model_path.exists():
        # 模型不存在
        ret_json["msg"] = "Model not found"
        return web.Response(status=400, body=json.dumps(ret_json))
    # 移除同名的 .png, .jpg, .jpeg, .gif 缩略图 ?
    # ModelManager.remove_thumbnails(mtype, mname)
    # 保存缩略图到模型所在路径
    img_path = model_path.with_suffix(Path(img_name).suffix)
    with open(img_path, "wb") as f:
        f.write(image.file.read())
    # 保存缩略图路径到配置文件
    model_configs = CFG_MANAGER.get_detail(mtype)
    if mname in model_configs:
        mcfg = model_configs[mname]
        mcfg["cover"] = img_path.as_posix()
        CFG_MANAGER.dump_config()
    ret_json["status"] = True
    return web.Response(status=200, body=json.dumps(ret_json))


@server.PromptServer.instance.routes.post("/cs/update_config")
async def update_config(request: web.Request):
    post = await request.post()
    data = post.get("data")
    ret_json = {"status": False, "msg": ""}
    try:
        data = json.loads(data)
        if not isinstance(data, dict):
            ret_json["msg"] = "data is not dict"
            sys.stderr.write(f"Update Config: data is not dict {data}\n")
            return web.Response(status=200, body=json.dumps(ret_json))
    except Exception as e:
        sys.stderr.write(f"ComfyUI-Studio Update config: {e}\n")
        ret_json["msg"] = str(e)
        return web.Response(status=200, body=json.dumps(ret_json))
    key = post.get("key")
    mtype = data.get("mtype", "")
    if not mtype:
        sys.stderr.write("ComfyUI-Studio Update config: model type is empty\n")
        ret_json["msg"] = "model type is empty"
        return web.Response(status=200, body=json.dumps(ret_json))
    # sys.stdout.write(f"Update Config: {data}\n")
    # sys.stdout.write(f"Update Config: {key}\n")
    # sys.stdout.flush()
    mname = data.get("name", "")
    update_data = data.get(key, None)
    if not update_data:
        ret_json["msg"] = "update data is empty"
        return web.Response(status=200, body=json.dumps(ret_json))

    ret_json["status"] = True

    if key == "name":
        # 更新模型名称
        old_data = post.get("old_data", "")
        if not old_data:
            ret_json["status"] = False
            ret_json["msg"] = "old data is empty"
            return web.Response(status=200)
        mname = old_data
        try:
            ModelManager.model_rename(mtype, old_data, update_data)
        except Exception as e:
            ret_json["status"] = False
            ret_json["msg"] = "Model Rename failed:" + str(e)

    model_configs = CFG_MANAGER.get_detail(mtype)
    if mname in model_configs:
        mcfg = model_configs[mname]
        mcfg[key] = update_data
    CFG_MANAGER.dump_config()
    return web.Response(status=200, body=json.dumps(ret_json))


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
    old_model_map = CFG_MANAGER.get_detail(mtype)
    ret_model_map = {}
    for name in models:
        if name not in old_model_map:
            mcfg = example_cfg.copy()
            mcfg["name"] = name
            old_model_map[name] = mcfg
            CFG_MANAGER.dirty = True
        mcfg = old_model_map[name]
        old_cover = mcfg.get("cover", "")
        if not old_cover or not thumbnail_exists(old_cover):
            img_path = ModelManager.find_thumbnail(name, mtype)
            mcfg["cover"] = img_path
            CFG_MANAGER.dirty = True
        ret_model_map[name] = mcfg
        mcfg["mtype"] = mtype
        model_path = ModelManager.find_model(mtype, name)
        if not model_path.exists():
            continue
        mcfg["size"] = model_path.stat().st_size / 1024**2  # MB
        mcfg["creationTime"] = model_path.stat().st_ctime * 1000
        mcfg["modifyTime"] = model_path.stat().st_mtime * 1000
    ret_model_map = deepcopy(ret_model_map)
    for mcfg in ret_model_map.values():
        mcfg["cover"] = urllib.parse.quote(path_to_url(mcfg["cover"]))
        if not mcfg["cover"]:
            continue
        mcfg["cover"] += f"?t={time.time()}"
    if CFG_MANAGER.dirty:
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


@server.PromptServer.instance.routes.post("/cs/fetch_workflow")
async def fetch_workflow(request: web.Request):
    post = await request.post()
    mtype = post.get("mtype")
    if not mtype:
        sys.stderr.write("ComfyUI-Studio Fetch workflow: workflow type is empty\n")
        sys.stderr.flush()
        return web.Response(status=200, body="{}")

    def _find_workflow(mtype, root=CUR_PATH.joinpath("workflow")):
        # 查找 mtype 对应的缩略图渲染工作流, 工作流均位于 workflow 目录下
        # 1. 用户 workflow 为 mtype.json
        # 2. 默认 workflow 为 mtype_def.json
        # 3. 优先查找 用户定义 workflow
        usr_workflow = root.joinpath(f"{mtype}.json")
        if usr_workflow.exists():
            return read_json(usr_workflow)
        def_workflow = root.joinpath(f"{mtype}_def.json")
        if def_workflow.exists():
            return read_json(def_workflow)
        return {}

    ret_json = _find_workflow(mtype)

    return web.Response(status=200, body=json.dumps(ret_json))

@server.PromptServer.instance.routes.post("/cs/fetch_ext_name")
async def fetch_ext_name(request: web.Request):
    return web.Response(status=200, body=CUR_PATH.name)

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
    path = path.replace("//", "/")
    return path


def add_static_resource(prefix, path, pprefix=MOUNT_ROOT):
    app = server.PromptServer.instance.app
    prefix = path_to_url(prefix)
    prefix = pprefix + urllib.parse.quote(prefix)
    prefix = path_to_url(prefix)
    route = web.static(prefix, path, follow_symlinks=True)
    app.add_routes([route])


def init():
    modelpath_map = ModelManager.model_path_dict()
    for mtype in modelpath_map:
        for path in modelpath_map[mtype][0]:
            if not Path(path).exists():
                continue
            add_static_resource(path, path, "")
    add_static_resource("", CUR_PATH.as_posix())


init()
NODE_CLASS_MAPPINGS = {}
WEB_DIRECTORY = "./loader"
