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
      foot: {
        text: ({ named }) => {
          return `共计模型${named("modelCount")}个，其中${named("noThumbnailCount")}个无缩略图`;
        },
      },
      searchValue: "关键词",
      modelDetail: {
        title: "基本信息",
        size: "文件大小",
        type: "文件类型",
        creationTime: "创建时间",
        modificationTime: "修改时间",
        buttonText: "使用此模型",
      },
    },
    settings: {
      language: {
        title: "UI语言选项",
        describe: "设置UI语言，让沟通无所不能",
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
      foot: {
        text: ({ named }) => {
          return `Total ${named("modelCount")} models, ${named("noThumbnailCount")} models without thumbnails`;
        },
      },
      searchValue: "keyword",
      modelDetail: {
        title: "Basic",
        size: "Size",
        type: "Type",
        creationTime: "Create time",
        modificationTime: "Modify time",
        buttonText: "Use model",
      },
    },
    settings: {
      language: {
        title: "UI Language Options",
        describe: "Set UI language to make communication omnipotent",
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
      foot: {
        text: ({ named }) => {
          return `共計模型${named("modelCount")}個，其中${named("noThumbnailCount")}個無縮略圖`;
        },
      },
      searchValue: "關鍵詞",
      modelDetail: {
        title: "基本信息",
        size: "文件大小",
        type: "文件類型",
        creationTime: "創建時間",
        modificationTime: "修改時間",
        buttonText: "使用此模型",
      },
    },
    settings: {
      language: {
        title: "UI語言選項",
        describe: "設置UI語言，讓溝通無所不能",
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
  },
};
export default message;
