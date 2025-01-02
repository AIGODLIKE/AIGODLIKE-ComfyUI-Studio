const message = {
  cn: {
    home: {
      head: {
        search: "搜索",
        title: "本地工作流",
        categoryList: [
          {
            name: "最新排序",
            value: 0,
          },
          {
            name: "最旧排序",
            value: 1,
          },
          {
            name: "名称顺序",
            value: 2,
          },
          {
            name: "名称倒序",
            value: 3,
          },
          {
            name: "品质顺序",
            value: 4,
          },
          {
            name: "品质倒序",
            value: 5,
          },
          {
            name: "体积顺序",
            value: 6,
          },
          {
            name: "体积倒序",
            value: 7,
          },
        ],
        rateList: [
          {
            name: "不限",
            value: 0,
          },
          {
            name: "S",
            value: "S",
          },
          {
            name: "A",
            value: "A",
          },
          {
            name: "B",
            value: "B",
          },
          {
            name: "C",
            value: "C",
          },
          {
            name: "D",
            value: "D",
          },
        ],
        sizeList: [
          {
            name: "9列",
            value: 9,
          },
          {
            name: "8列",
            value: 8,
          },
          {
            name: "7列",
            value: 7,
          },
          {
            name: "6列",
            value: 6,
          },
          {
            name: "5列",
            value: 5,
          },
          {
            name: "4列",
            value: 4,
          },
        ],
        renderText: "一键渲染缩略图",
        renderAllThumbnails: "渲染并覆盖所有缩略图？",
        renderingAlert: "正在渲染缩略图，请稍后再试",
        closePageConfirm: "关闭窗口并终止正在执行的任务？",
      },
      model: {
        useModelConfirm: "设置模型将退出缩略图渲染,是否确定?",
        dirTagCantDelete: "文件夹标签不能删除",
      },
      foot: {
        text: ({ named }) => {
          return `共计模型${named("modelCount")}个，其中${named("noThumbnailCount")}个无缩略图，正在生成第${named("taskIndex")}/${named("taskCount")}个缩略图`;
        },
      },
      searchValue: "关键词",
      modelDetail: {
        menuTab: [
          {
            name: "工作流",
          },
          {
            name: "笔记",
          },
          {
            name: "基本信息",
          }
        ],
        basicInf: {
          title: "基本信息",
          size: "文件大小",
          type: "文件类型",
          creationTime: "创建时间",
          modificationTime: "修改时间",
        },
        workflow: {
          importText: "导入",
          copyText: "复制JSON",
          delete: "删除",
          addWorkflowButtonText: "添加工作流",
          noWorkflowTip: "未发现工作流，点击下面添加工作流按钮即可添加",
          form: {
            title: "更改名称",
            confirmText: "确认",
            cancelText: "取消",
            placeholder: "请输入名称(默认随机填充)",
          },
          saveSuccess: "保存成功",
          saveFail: "保存失败",
          saveTimeout: "保存超时",
          copySuccess: "复制成功",
          copyFail: "复制失败",
          copyTimeout: "复制超时",
          deleteSuccess: "删除成功",
          deleteFail: "删除失败",
          deleteTimeout: "删除超时",
          importSuccess: "导入成功",
          importFail: "导入失败",
          importTimeout: "导入超时",
        },
        note: {
          delete: "删除",
          copyNote: "复制笔记",
          addNoteButtonText: "添加笔记",
          noNoteTip: "未发现笔记，点击下面添加笔记按钮即可添加",
          saveNoteSuccess: "保存笔记成功",
          saveNoteFail: "保存笔记失敗",
          saveNoteTimeout: "保存笔记超时",
          copyNoteSuccess: "复制笔记成功",
          copyNoteFail: "复制笔记失敗",
          copyNoteTimeout: "复制笔记超时",
          deleteNoteSuccess: "刪除笔记成功",
          deleteNoteFail: "刪除笔记失敗",
          deleteNoteTimeout: "刪除笔记超时",
          form: {
            title: "更改名称",
            confirmText: "确认",
            cancelText: "取消",
            placeholder: "请输入笔记名称(默认随机填充)",
          },
        },
        useButtonText: "使用此模型",
      },
    },
    settings: {
      language: {
        title: "UI语言选项",
        describe: "设置UI语言，让沟通无所不能",
      },
      shortcut: {
        title: "模型菜单快捷键",
        describe: "设置模型菜单快捷键，让操作更加快捷",
      },
      modelShield: {
        title: "模型屏蔽",
        describe: "你可以决定有一些模型不在特定加载器中显示和进行缩略图渲染(这仅对支持的加载器有用)",
        loaderName: "加载器名称",
        shieldingModel: "屏蔽模型",
        blockInputBoxText: "请输入需要屏蔽的模型文件完整名称(如a.ckpt)",
        confirmText: "确认",
        cancelText: "取消",
      },
      window: {
        title: "个性化设置",
        describe: "选择自定义窗口显示方式",
        list: [
          {
            name: "全屏",
            value: "full",
          },
          {
            name: "窗口化",
            value: "noFull",
          },
        ],
      },
    },
    messages: {
      tagExists: "tag存在",
      fileNameError: "文件名错误",
      fileNameExists: "文件名存在",
    },
    noResult: "未找到结果",
    confirmBox: {
      describe: "你确定要退出当前操作吗",
      refuseText: "取消",
      acceptText: "确定",
    },
    modelManagerBtn: "ComfyUI-Studio 模型管理器",
  },
  en: {
    home: {
      head: {
        search: "Search",
        title: "Local workflow",
        categoryList: [
          {
            name: "latest",
            value: 0,
          },
          {
            name: "oldest",
            value: 1,
          },
          {
            name: "Name order",
            value: 2,
          },
          {
            name: "Name reverse",
            value: 3,
          },
          {
            name: "Level order",
            value: 4,
          },
          {
            name: "Level reverse",
            value: 5,
          },
          {
            name: "Size order",
            value: 6,
          },
          {
            name: "Size reverse",
            value: 7,
          },
        ],
        rateList: [
          {
            name: "All",
            value: 0,
          },
          {
            name: "S",
            value: "S",
          },
          {
            name: "A",
            value: "A",
          },
          {
            name: "B",
            value: "B",
          },
          {
            name: "C",
            value: "B",
          },
          {
            name: "D",
            value: "D",
          },
        ],
        sizeList: [
          {
            name: "9 COLUMN",
            value: 9,
          },
          {
            name: "8 COLUMN",
            value: 8,
          },
          {
            name: "7 COLUMN",
            value: 7,
          },
          {
            name: "6 COLUMN",
            value: 6,
          },
          {
            name: "5 COLUMN",
            value: 5,
          },
          {
            name: "4 COLUMN",
            value: 4,
          },
        ],
        renderText: "render",
        renderAllThumbnails: "Render and overwrite all thumbnails?",
        renderingAlert: "Rendering thumbnails, please try again later",
        closePageConfirm: "Close the window and terminate the task?",
      },
      model: {
        useModelConfirm: "Using model will exit the thumbnail rendering, are you sure?",
        dirTagCantDelete: "Folder tag cannot be deleted",
      },
      foot: {
        text: ({ named }) => {
          return `Total ${named("modelCount")} models, ${named("noThumbnailCount")} models without thumbnails. Now ${named("taskIndex")}/${named("taskCount")} thumbnail`;
        },
      },
      searchValue: "Keyword",
      modelDetail: {
        menuTab: [
          {
            name: "Workflow",
          },
          {
            name: "Notes"
          },
          {
            name: "Basic information",
          }
        ],
        basicInf: {
          title: "Basic",
          size: "Size",
          type: "Type",
          creationTime: "Create time",
          modificationTime: "Modify time",
        },
        workflow: {
          importText: "import",
          copyText: "Copy JSON",
          delete: "Delete",
          addWorkflowButtonText: "Add workflow",
          noWorkflowTip: "No workflow found, click the add workflow button below to add it",
          form: {
            title: "Change name",
            confirmText: "Confirm",
            cancelText: "Cancel",
            placeholder: "Rand name default",
          },
          saveSuccess: "Save success",
          saveFail: "Save failed",
          saveTimeout: "Save timeout",
          copySuccess: "Copy success",
          copyFail: "Copy failed",
          copyTimeout: "Copy timeout",
          deleteSuccess: "Delete success",
          deleteFail: "Delete failed",
          deleteTimeout: "Delete timeout",
          importSuccess: "Import success",
          importFail: "Import failed",
          importTimeout: "Import timeout",
        },
        note: {
          delete: "Delete",
          copyNote: "Copy note",
          addNoteButtonText: "Add note",
          noNoteTip: "No notes found, click the add note button below to add it",
          saveNoteSuccess: "Save note success",
          saveNoteFail: "Save note failed",
          saveNoteTimeout: "Save note timeout",
          copyNoteSuccess: "Copy note success",
          copyNoteFail: "Copy note failed",
          copyNoteTimeout: "Copy note timeout",
          deleteNoteSuccess: "Delete note success",
          deleteNoteFail: "Delete note failed",
          deleteNoteTimeout: "Delete note timeout",
          form: {
            title: "Change name",
            confirmText: "Confirm",
            cancelText: "Cancel",
            placeholder: "Rand note name default",
          },
        },
        useButtonText: "Use model",
      },
    },
    settings: {
      language: {
        title: "UI Language Options",
        describe: "Set UI language to make communication omnipotent",
      },
      shortcut: {
        title: "Model Menu Shortcut Key",
        describe: "Set the shortcut key for the model menu",
      },
      modelShield: {
        title: "Model shielding",
        describe: "You can decide that some models are no longer displayed and thumbnail rendered in specific loaders (this is only useful for supported loaders)",
        loaderName: "Loader Name",
        shieldingModel: "Shielding model",
        blockInputBoxText: "The complete name of the blocked model file(such as a.ckpt)",
        confirmText: "Confirm",
        cancelText: "Cancel",
      },
      window: {
        title: "Personalized settings",
        describe: "Choose custom window display method",
        list: [
          {
            name: "Full screen",
            value: "full",
          },
          {
            name: "Windowing",
            value: "noFull",
          },
        ],
      },
    },
    messages: {
      tagExists: "Tag exists",
      fileNameError: "File name error",
      fileNameExists: "File name exists",
    },
    noResult: "No results found",
    confirmBox: {
      describe: "Are you sure you want to exit the current operation",
      refuseText: "Cancel",
      acceptText: "Confirm",
    },
    modelManagerBtn: "ComfyUI-Studio Model Manager",
  },
  tc: {
    home: {
      head: {
        search: "搜索",
        title: "本地工作流",
        categoryList: [
          {
            name: "最新排序",
            value: 0,
          },
          {
            name: "最舊排序",
            value: 1,
          },
          {
            name: "名稱順序",
            value: 2,
          },
          {
            name: "名稱倒序",
            value: 3,
          },
          {
            name: "品質順序",
            value: 4,
          },
          {
            name: "品質倒序",
            value: 5,
          },
          {
            name: "體積順序",
            value: 6,
          },
          {
            name: "體積倒序",
            value: 7,
          },
        ],
        rateList: [
          {
            name: "不限",
            value: 0,
          },
          {
            name: "S",
            value: "S",
          },
          {
            name: "A",
            value: "A",
          },
          {
            name: "B",
            value: "B",
          },
          {
            name: "C",
            value: "C",
          },
          {
            name: "D",
            value: "D",
          },
        ],
        sizeList: [
          {
            name: "9列",
            value: 9,
          },
          {
            name: "8列",
            value: 8,
          },
          {
            name: "7列",
            value: 7,
          },
          {
            name: "6列",
            value: 6,
          },
          {
            name: "5列",
            value: 5,
          },
          {
            name: "4列",
            value: 4,
          },
        ],
        renderText: "壹鍵渲染縮略圖",
        renderAllThumbnails: "渲染並覆蓋所有縮略圖？",
        renderingAlert: "正在渲染縮略圖，請稍後再試",
        closePageConfirm: "關閉窗口並終止正在執行的任務？",
      },
      model: {
        useModelConfirm: "使用模型將退出縮略圖渲染,是否確定?",
        dirTagCantDelete: "文件夾標簽不能刪除",
      },
      foot: {
        text: ({ named }) => {
          return `共計模型${named("modelCount")}個，其中${named("noThumbnailCount")}個無縮略圖，正在生成第${named("taskIndex")}/${named("taskCount")}個縮略圖`;
        },
      },
      searchValue: "關鍵詞",
      modelDetail: {
        menuTab: [
          {
            name: "工作流",
          },
          {
            name: "備註",
          },
          {
            name: "基本信息",
          }
        ],
        basicInf: {
          title: "基本信息",
          size: "文件大小",
          type: "文件類型",
          creationTime: "創建時間",
          modificationTime: "修改時間",
          buttonText: "使用此模型",
        },
        workflow: {
          importText: "導入",
          copyText: "復製JSON",
          delete: "刪除",
          addWorkflowButtonText: "添加工作流",
          noWorkflowTip: "未發現工作流，點擊下面添加工作流按鈕即可添加",
          form: {
            title: "更改名稱",
            confirmText: "确認",
            cancelText: "取消",
            placeholder: "請輸入名稱(默认随机填充)",
          },
          saveSuccess: "保存成功",
          saveFail: "保存失敗",
          saveTimeout: "保存超时",
          copySuccess: "复制成功",
          copyFail: "复制失敗",
          copyTimeout: "复制超时",
          deleteSuccess: "刪除成功",
          deleteFail: "刪除失敗",
          deleteTimeout: "刪除超时",
          importSuccess: "導入成功",
          importFail: "導入失敗",
          importTimeout: "導入超時",
        },
        note: {
          delete: "刪除",
          copyNote: "復製備註",
          addNoteButtonText: "添加備註",
          noNoteTip: "未發現備註，點擊下面添加備註按鈕即可添加",
          saveNoteSuccess: "保存備註成功",
          saveNoteFail: "保存備註失敗",
          saveNoteTimeout: "保存備註超時",
          copyNoteSuccess: "复制備註成功",
          copyNoteFail: "复制備註失敗",
          copyNoteTimeout: "复制備註超時",
          deleteNoteSuccess: "刪除備註成功",
          deleteNoteFail: "刪除備註失敗",
          deleteNoteTimeout: "刪除備註超時",
          form: {
            title: "更改名稱",
            confirmText: "确認",
            cancelText: "取消",
            placeholder: "請輸入備註名稱(默认随机填充)",
          },
        },
        useButtonText: "使用此模型",
      },
    },
    settings: {
      language: {
        title: "UI語言選項",
        describe: "設置UI語言，讓溝通無所不能",
      },
      shortcut: {
        title: "快捷鍵設置",
        describe: "设置模型菜单快捷键，讓操作更加快捷",
      },
      modelShield: {
        title: "模型屏蔽",
        describe: "你可以決定有一些模型不在特定加載器中顯示和進行縮略圖渲染(這僅對支持的加載器有用)",
        loaderName: "加載器名稱",
        shieldingModel: "屏蔽模型",
        blockInputBoxText: "請輸入需要屏蔽的模型文件完整名稱(如a.ckpt)",
        confirmText: "確認",
        cancelText: "取消",
      },
      window: {
        title: "个性化設置",
        describe: "選擇自定義窗口顯示方式",
        list: [
          {
            name: "全屏",
            value: "full",
          },
          {
            name: "窗口化",
            value: "noFull",
          },
        ],
      },
    },
    messages: {
      tagExists: "tag存在",
      fileNameError: "文件名錯誤",
      fileNameExists: "文件名存在",
    },
    noResult: "未找到結果",
    confirmBox: {
      describe: "你確定要退出當前操作嗎",
      refuseText: "取消",
      acceptText: "確定",
    },
    modelManagerBtn: "ComfyUI-Studio 模型管理器",
  },
};
export default message;
