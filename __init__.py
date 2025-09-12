import json
import sys
from os import PathLike
from hashlib import md5
from aiohttp.web_urldispatcher import AbstractRoute, UrlDispatcher
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
IMG_SUFFIXES = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff", ".svg", ".ico", ".apng", ".tif", ".hdr", ".exr"]
CONFIG_PATH = CUR_PATH.joinpath("model-config.json")
WK_PATH = CUR_PATH.joinpath("workflow")

STATIC_DIR = set()


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
    MODEL_ALIAS = {
        "unet": ["diffusion_models"],
        "clip": ["text_encoders"],
    }

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
        mtypes = [mtype.lower(), *ModelManager.MODEL_ALIAS.get(mtype.lower(), [])]
        configs = ModelManager.model_path_dict()
        for t in mtypes:
            cfg = configs.get(t, None)
            if cfg:
                return cfg
        return [[], {}]
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
    def model_rename(mtype, old_name: str, new_name: str):
        """
        重命名模型
        """
        ori_oname = old_name
        ori_nname = new_name
        old_name = Path(old_name).as_posix()
        new_name = Path(new_name).as_posix()
        # 模型重命名
        model_path = ModelManager.find_model(mtype, old_name)
        # Note: 模型名可能是 a\\b.ckpt a/b.ckpt 这种带有路径的模型名
        # new_model_path = model_path.with_name(new_name)
        new_model_path = model_path.as_posix().replace(old_name, new_name)
        model_path.rename(new_model_path)
        # detail / filters / workflow 重命名
        try:
            detail = CFG_MANAGER.get_detail(mtype)
            obase_name = Path(old_name).with_suffix("").as_posix()
            nbase_name = Path(new_name).with_suffix("").as_posix()
            if ori_oname in detail:
                mcfg = detail.pop(ori_oname)
                mcfg["name"] = ori_nname
                detail[ori_nname] = mcfg
                cover = mcfg.get("cover", "")
                if cover and Path(cover).exists():
                    cover = Path(cover)
                    new_cover = Path(cover.as_posix().replace(obase_name, nbase_name))
                    # new_cover_name = cover.name.replace(obase_name, nbase_name)
                    # new_cover = cover.with_name(new_cover_name)
                    cover.rename(new_cover)
                    mcfg["cover"] = new_cover.as_posix()
            if ori_oname in CFG_MANAGER.filters:
                CFG_MANAGER.filters[ori_nname] = CFG_MANAGER.filters.pop(ori_oname)
            old_wp = WK_PATH.joinpath(mtype, ori_oname)
            new_wp = WK_PATH.joinpath(mtype, ori_nname)
            if old_wp.exists():
                old_wp.rename(new_wp)
        except Exception:
            import traceback
            traceback.print_exc()

    @staticmethod
    def find_thumbnail(mname, mtype) -> str:
        # a\\b.ckpt a/b.ckpt
        pm = Path(mname)
        base_name = pm.with_suffix("")
        psb_base_names = [base_name.as_posix(), base_name.as_posix() + pm.suffix, base_name.as_posix() + ".preview", pm.stem, pm.name]
        for p in ModelManager.get_paths(mtype):
            for pbname in psb_base_names:
                for suffix in IMG_SUFFIXES:
                    img_name = pbname + suffix
                    img_path = Path(p).joinpath(img_name)
                    if not img_path.exists():
                        continue
                    return img_path.as_posix()
        return ""

    @staticmethod
    def remove_thumbnails(mtype, mname):
        """
        移除同名的 .png, .jpg, .jpeg, .gif 缩略图
        """
        model_names = [Path(mname).stem, Path(mname).name]
        for p in ModelManager.get_paths(mtype):
            for model_name in model_names:
                for suffix in IMG_SUFFIXES:
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


class ThumbnailManager:
    _code_map = {}
    _path_code_map = {}
    _image_map = {}
    _image_time = {}

    @classmethod
    def add_code(cls, path: str):
        if path not in cls._image_map:
            code = md5(path.encode()).hexdigest()
            cls._code_map[code] = path
            cls._path_code_map[path] = code
        return cls._path_code_map.get(path, "")

    @classmethod
    def get_path(cls, code: str) -> str:
        return cls._code_map.get(code, "")

    @classmethod
    def add_image(cls, path: str):
        p = Path(path)
        if path in cls._image_map and p.stat().st_mtime == cls._image_time.get(path, 0):
            return
        if not p.is_file():
            cls._image_map[path] = b""
            return
        cls._image_time[path] = p.stat().st_mtime
        cls._image_map[path] = b"" if not p.exists() else p.read_bytes()

    @classmethod
    def get_image(cls, path: str) -> bytes:
        cls.add_image(path)
        return cls._image_map.get(path, b"")

    @classmethod
    def get_image_by_code(cls, code: str) -> bytes:
        path = cls.get_path(code)
        return cls.get_image(path)


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
    if update_data is None:
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


def find_rel_path(p, model_paths) -> str:
    """
    calc the relative path of p in model_paths
    """
    if not p:
        return ""
    for p in model_paths:
        if not p.startswith(p):
            continue
        return Path(p).relative_to(p).as_posix()
    return ""


def find_tags(string: str, sep="/") -> list[str]:
    """
    find tags from string use the sep for split
    Note: string may contain the \\ or / for path separator
    """
    if not string:
        return []
    string = string.replace("\\", "/")
    while "//" in string:
        string = string.replace("//", "/")
    if string and sep in string:
        return string.split(sep)[:-1]
    return []


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
            mcfg = deepcopy(example_cfg)
            mcfg["name"] = name
            old_model_map[name] = mcfg
            CFG_MANAGER.dirty = True
        mcfg = old_model_map[name]
        # mcfg["name"] 和 mname 不匹配
        if Path(mcfg.get("name", "")).as_posix() != Path(name).as_posix():
            mcfg["name"] = name
            CFG_MANAGER.dirty = True
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
    ret_model_map: dict[str, dict] = deepcopy(ret_model_map)
    # model_paths = ModelManager.get_paths(mtype)
    for mcfg in ret_model_map.values():
        # 遍历model_paths 对比 model_path 得到 减去 model_paths 的相对路径
        name = mcfg.get("name", "").replace("\\", "/")
        # 查找 model对应的 workflow
        mcfg["workflows"] = []
        mtype = mcfg.get("mtype", "")
        wp = WK_PATH.joinpath(mtype, name)
        if wp.exists():
            workflows = [p.name for p in wp.iterdir() if p.is_file() and p.suffix == ".json"]
            mcfg["workflows"] = workflows
        dir_tags = find_tags(name)
        if dir_tags:
            if "tags" not in mcfg:
                mcfg["tags"] = []
            mcfg["tags"].extend(dir_tags)
            mcfg["dir_tags"] = dir_tags
        # mcfg["cover"] = urllib.parse.quote(path_to_url(mcfg["cover"]))
        if not mcfg["cover"]:
            continue
        code = ThumbnailManager.add_code(mcfg["cover"])
        mcfg["cover"] = f"/cs/fetch_image?code={code}"
    if CFG_MANAGER.dirty:
        CFG_MANAGER.dump_config()
    json_data = json.dumps(ret_model_map)
    return web.Response(status=200, body=json_data)


@server.PromptServer.instance.routes.get("/cs/fetch_image")
async def fetch_image(request: web.Request):
    # 调用方式 http://127.0.0.1:8188/cs/fetch_image?code=xxxx.png
    code = request.query.get("code")
    image_bytes = ThumbnailManager.get_image_by_code(code)
    return web.Response(status=200, body=image_bytes)


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
    """
    根据传入的 mtype mname workflow名 获取对应json
    """
    body = await request.read()
    body = json.loads(body)
    mtype = body.get("mtype")
    mname = body.get("mname")
    workflow = body.get("workflow")
    wk_path = WK_PATH.joinpath(mtype, mname, workflow).with_suffix(".json")
    err_info = ""
    if not mtype:
        err_info = "ComfyUI-Studio Fetch workflow: workflow type is empty\n"
    elif not mname:
        err_info = "ComfyUI-Studio Fetch workflow: model name is empty\n"
    elif not workflow:
        err_info = "ComfyUI-Studio Fetch workflow: workflow name is empty\n"
    elif not wk_path.exists() or not wk_path.is_file():
        err_info = f"ComfyUI-Studio Fetch workflow: workflow [{wk_path.as_posix()}] not find\n"
    if err_info:
        sys.stderr.write(err_info)
        sys.stderr.flush()
    ret_json = read_json(wk_path)
    return web.Response(status=200, body=json.dumps(ret_json))


@server.PromptServer.instance.routes.post("/cs/save_workflow")
async def save_workflow(request: web.Request):
    """
    根据传入的 mtype mname workflow数据 保存对应json
    """
    body = await request.read()
    body = json.loads(body)
    mtype = body.get("mtype")
    mname = body.get("mname")
    data = body.get("data")
    wk_name = body.get("name")
    wk_path = WK_PATH.joinpath(mtype, mname, wk_name).with_suffix(".json")
    err_info = ""
    ret_json = {"saved": False}
    if not mtype:
        err_info = "ComfyUI-Studio Save workflow: workflow type is empty\n"
    elif not mname:
        err_info = "ComfyUI-Studio Save workflow: model name is empty\n"
    elif not wk_name:
        err_info = "ComfyUI-Studio Save workflow: workflow name is empty\n"
    elif not data:
        err_info = "ComfyUI-Studio Save workflow: workflow data is empty\n"
    else:
        try:
            if not wk_path.parent.exists():
                wk_path.parent.mkdir(parents=True)
            wk_path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
            ret_json["saved"] = True
            sys.stdout.write(f"ComfyUI-Studio Save workflow: [{wk_name}] success\n")
        except Exception as e:
            err_info = f"ComfyUI-Studio Save workflow: {e}\n"
    if err_info:
        sys.stderr.write(err_info)
        sys.stderr.flush()
    return web.Response(status=200, body=json.dumps(ret_json))


@server.PromptServer.instance.routes.post("/cs/save_note")
async def save_note(request: web.Request):
    """
    根据传入的 mtype mname note名 保存data中的对应note
    """
    body = await request.read()
    body = json.loads(body)
    mtype = body.get("mtype")
    mname = body.get("mname")
    data = body.get("data")
    note_name = body.get("name")
    err_info = ""
    ret_json = {"saved": False}
    if not mtype:
        err_info = "ComfyUI-Studio Save note: note is empty\n"
    elif not mname:
        err_info = "ComfyUI-Studio Save note: model name is empty\n"
    elif not note_name:
        err_info = "ComfyUI-Studio Save note: note name is empty\n"
    else:
        old_model_map = CFG_MANAGER.get_detail(mtype)
        mcfg = old_model_map.get(mname, {})
        old_model_map[mname] = mcfg
        notes = mcfg.get("notes", {})
        notes[note_name] = data
        mcfg["notes"] = notes
        CFG_MANAGER.dump_config()
        ret_json["saved"] = True
        sys.stdout.write(f"ComfyUI-Studio Save note: [{note_name}] success\n")
    if err_info:
        sys.stderr.write(err_info)
        sys.stderr.flush()
    return web.Response(status=200, body=json.dumps(ret_json))


@server.PromptServer.instance.routes.post("/cs/remove_workflow")
async def remove_workflow(request: web.Request):
    """
    根据传入的 mtype mname workflow名 删除对应json
    """
    body = await request.read()
    body = json.loads(body)
    mtype = body.get("mtype")
    mname = body.get("mname")
    workflow = body.get("workflow")
    wk_name = body.get("name")
    if not wk_name:
        wk_name = workflow
    wk_path = WK_PATH.joinpath(mtype, mname, workflow).with_suffix(".json")
    err_info = ""
    ret_json = {"removed": False}
    if not mtype:
        err_info = "ComfyUI-Studio Remove workflow: workflow type is empty\n"
    elif not mname:
        err_info = "ComfyUI-Studio Remove workflow: model name is empty\n"
    elif not workflow:
        err_info = "ComfyUI-Studio Remove workflow: workflow name is empty\n"
    elif not wk_path.exists() or not wk_path.is_file():
        err_info = f"ComfyUI-Studio Remove workflow: workflow [{wk_path.as_posix()}] not find\n"
    else:
        try:
            wk_path.unlink()
            ret_json["removed"] = True
            sys.stdout.write(f"ComfyUI-Studio Remove workflow: [{wk_name}] success\n")
        except Exception as e:
            err_info = f"ComfyUI-Studio Remove workflow: {e}\n"
    if err_info:
        sys.stderr.write(err_info)
        sys.stderr.flush()
    return web.Response(status=200, body=json.dumps(ret_json))


@server.PromptServer.instance.routes.post("/cs/remove_note")
async def remove_note(request: web.Request):
    """
    根据传入的 mtype mname note名 删除data中的对应note
    """
    body = await request.read()
    body = json.loads(body)
    mtype = body.get("mtype")
    mname = body.get("mname")
    note = body.get("note")
    note_name = body.get("name")
    if not note_name:
        note_name = note
    err_info = ""
    ret_json = {"removed": False}
    if not mtype:
        err_info = "ComfyUI-Studio Remove note: note is empty\n"
    elif not mname:
        err_info = "ComfyUI-Studio Remove note: model name is empty\n"
    elif not note:
        err_info = "ComfyUI-Studio Remove note: note name is empty\n"
    else:
        old_model_map = CFG_MANAGER.get_detail(mtype)
        mcfg = old_model_map.get(mname, {})
        notes = mcfg.get("notes", {})
        if note_name not in notes:
            err_info = f"ComfyUI-Studio Remove note: note [{note_name}] not find\n"
        else:
            notes.pop(note_name)
            CFG_MANAGER.dirty = True
            CFG_MANAGER.dump_config()
            ret_json["removed"] = True
        sys.stdout.write(f"ComfyUI-Studio Remove note: [{note_name}] success\n")
    if err_info:
        sys.stderr.write(err_info)
        sys.stderr.flush()
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
    if not Path(path).as_posix().startswith(tuple(STATIC_DIR)):
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


def suffix_limiter(self: web.StaticResource, request: web.Request):
    # pass 图片格式后缀名
    pass_suffixes = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff", ".svg", ".ico", ".apng", ".tif", ".hdr", ".exr"}
    band_suffixes = {".ckpt", ".safetensors", ".pt", ".bin", ".pth", ".yaml", ".onnx"}

    rel_url = request.match_info["filename"]
    try:
        filename = Path(rel_url)
        if filename.anchor:
            raise web.HTTPForbidden()
        filepath = self._directory.joinpath(filename).resolve()
        if filepath.exists() and filepath.suffix.lower() in band_suffixes:
            raise web.HTTPForbidden(reason="File type is not allowed")
    finally:
        ...


def filesize_limiter(self: web.StaticResource, request: web.Request):
    rel_url = request.match_info["filename"]
    try:
        filename = Path(rel_url)
        filepath = self._directory.joinpath(filename).resolve()
        # 如果文件大于 50MB, 则禁止访问
        if filepath.exists() and filepath.stat().st_size > 50 * 1024 * 1024:
            raise web.HTTPForbidden(reason="File size is too large")
    finally:
        ...


class LimitResource(web.StaticResource):
    """
    限制性资源
    """
    limiters = []

    def push_limiter(self, limiter):
        self.limiters.append(limiter)

    async def _handle(self, request: web.Request) -> web.StreamResponse:
        try:
            for limiter in self.limiters:
                limiter(self, request)
        except (ValueError, FileNotFoundError) as error:
            raise web.HTTPNotFound() from error

        return await super()._handle(request)

    def __repr__(self) -> str:
        name = "'" + self.name + "'" if self.name is not None else ""
        return f'<LimitResource {name} {self._prefix} -> {self._directory!r}>'


class LimitRouter(web.StaticDef):
    def __repr__(self) -> str:
        info = []
        for name, value in sorted(self.kwargs.items()):
            info.append(f", {name}={value!r}")
        return f'<LimitRouter {self.prefix} -> {self.path}{"".join(info)}>'

    def register(self, router: UrlDispatcher) -> list[AbstractRoute]:
        # resource = router.add_static(self.prefix, self.path, **self.kwargs)
        def add_static(
            self: UrlDispatcher,
            prefix: str,
            path: PathLike,
            *,
            name=None,
            expect_handler=None,
            chunk_size: int = 256 * 1024,
            show_index: bool = False,
            follow_symlinks: bool = False,
            append_version: bool = False,
        ) -> web.AbstractResource:
            assert prefix.startswith("/")
            if prefix.endswith("/"):
                prefix = prefix[:-1]
            resource = LimitResource(
                prefix,
                path,
                name=name,
                expect_handler=expect_handler,
                chunk_size=chunk_size,
                show_index=show_index,
                follow_symlinks=follow_symlinks,
                append_version=append_version,
            )
            resource.push_limiter(suffix_limiter)
            resource.push_limiter(filesize_limiter)
            self.register_resource(resource)
            return resource
        resource = add_static(router, self.prefix, self.path, **self.kwargs)
        routes = resource.get_info().get("routes", {})
        return list(routes.values())


def add_static_resource(prefix, path, pprefix=MOUNT_ROOT, limit=False):
    STATIC_DIR.add(Path(path).as_posix())
    app = server.PromptServer.instance.app
    prefix = path_to_url(prefix)
    prefix = pprefix + urllib.parse.quote(prefix)
    prefix = path_to_url(prefix)
    if limit:
        route = LimitRouter(prefix, path, {"follow_symlinks": True})
    else:
        route = web.static(prefix, path, follow_symlinks=True)
    app.add_routes([route])


def init():
    # modelpath_map = ModelManager.model_path_dict()
    # for mtype in modelpath_map:
    #     for path in modelpath_map[mtype][0]:
    #         if not Path(path).exists():
    #             continue
    #         add_static_resource(path, path, "", limit=True)
    add_static_resource("", CUR_PATH.joinpath("loader").as_posix(), pprefix="/cs/loader")


init()
NODE_CLASS_MAPPINGS = {}
WEB_DIRECTORY = "./loader"
