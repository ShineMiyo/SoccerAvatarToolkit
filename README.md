# 球员头像编辑器 (Player Avatar Editor)

## 概述 (Overview)

球员头像编辑器是一款基于 Web 的工具，用于创建和自定义球员头像。用户可以上传图片，进行裁剪，添加文字，应用多种背景效果，并导出最终的头像。编辑器提供了用户友好的界面和实时预览功能。

## 主要功能 (Core Features)

*   **图片上传:** 支持 PNG 和 JPEG 格式。
*   **交互式裁剪:** 可拖动和调整大小的裁剪框，支持锁定高宽比。
*   **文字定制:**
    *   添加球员姓名和可选的球员 ID。
    *   调整文字位置 (九宫格布局)。
    *   控制字体大小 (基于百分比)。
    *   从预加载的中文字体和英文字体中选择。
    *   上传自定义字体 (TTF, WOFF, WOFF2)。
    *   选择文字颜色。
    *   可为英文内容设置单独字体。
*   **背景选项:**
    *   纯色背景。
    *   线性渐变 (自定义起始和结束颜色)。
    *   预设国旗背景 (需要本地 `Nation/` 目录下的图片文件)。
    *   上传自定义背景图片。
*   **图片变换:**
    *   向左/向右旋转图片 (90度增量)。
    *   水平翻转图片。
*   **导出设置:**
    *   选择多种高宽比 (1:1, 4:3, 16:9 等)。
    *   设置自定义导出宽度和高度 (最大 2640px)。
*   **边框与圆角:**
    *   添加边框，宽度可调 (基于图片尺寸百分比)。
    *   应用圆角，半径可调 (基于图片尺寸百分比)。
    *   选择边框颜色。
*   **配置管理:**
    *   将当前编辑器设置保存到 JSON 文件和浏览器的 localStorage。
    *   从之前保存的 JSON 文件加载设置。
*   **用户界面:**
    *   现代化、响应式设计。
    *   可折叠的控制区域，使工作区更整洁。
    *   最终头像的实时预览。
    *   使用 Interact.js 增强裁剪交互。
    *   使用 Remixicon 提供界面图标。

## 文件结构 (File Structure)

```
.
├── css/
│   └── style.css         # 编辑器样式文件
├── js/
│   └── script.js         #核心 JavaScript 逻辑
├── Nation/               # 预设国旗图片目录 (例如 CN.png, DE.png)
│   ├── CN.png
│   ├── DE.png
│   ├── FR.png
│   ├── GB.png
│   ├── JP.png
│   ├── KR.png
│   └── ...               # 其他国旗图片
├── Fonts/
│   ├── CN/               # 中文字体目录
│   │   ├── 北魏楷书.ttf
│   │   └── ...
│   └── EN/               # 英文字体目录
│       ├── PiccadillyPro.otf
│       └── ...
└── index.html            # 主 HTML 文件
```

## 使用与设置 (Usage/Setup)

1.  克隆或下载项目文件。
2.  确保在 `Nation/` 目录下有必要的国旗图片文件 (例如 `CN.png`, `DE.png`, `FR.png`, `GB.png`, `JP.png`, `KR.png`)。
3.  确保在 `Fonts/CN/` 和 `Fonts/EN/` 目录下有 `index.html` 中指定的字体文件。
4.  在现代 Web 浏览器中打开 `index.html` 文件。

## 控制面板说明 (Controls/Sections)

编辑器左侧的侧边栏包含多个可折叠的部分，用于控制头像的各个方面：

*   **上传图片 (Upload Image):**
    *   点击选择本地图片 (PNG 或 JPEG 格式) 作为头像的基础。

*   **头像裁剪 (Avatar Cropping):**
    *   上传图片后，图片上会出现一个交互式裁剪框。
    *   拖动裁剪框以定位裁剪区域。
    *   拖动裁剪框的边缘或角落以调整大小。裁剪框的高宽比会根据"导出比例"的设置自动保持。
    *   **图片变换 (Image Transformations):**
        *   `向左旋转 (Rotate Left)`: 将裁剪后的图片逆时针旋转90度。
        *   `向右旋转 (Rotate Right)`: 将裁剪后的图片顺时针旋转90度。
        *   `水平翻转 (Flip Horizontal)`: 水平翻转裁剪后的图片。

*   **基本信息 (Basic Information):**
    *   `球员名字 (Player Name)`: 输入球员的姓名。
    *   `球员ID (Player ID)`: (可选) 输入球员的 ID。
    *   `名字位置 (Name Position)`: 从九宫格中选择文字在头像上的位置。

*   **字体设置 (Font Settings):**
    *   `名字颜色 (Name Color)`: 选择球员姓名和 ID 的颜色。
    *   `字体大小 (Font Size)`: 使用滑块调整文字大小 (百分比，相对于头像较短边)。
    *   `中文字体 (Chinese Font)`: 为中文字符选择字体。
    *   `英文特殊字体 (Use English Font)`: 勾选此项可为英文字符和数字使用不同的字体。
    *   `英文字体 (English Font)`: 如果勾选了上一项，则在此选择英文字体。
    *   `上传字体 (Upload Font)`: 上传您自己的字体文件 (TTF, WOFF, WOFF2) 以供使用。

*   **背景设置 (Background Settings):**
    *   `背景类型 (Background Type)`:
        *   `纯色 (Solid Color)`: 选择单一颜色作为背景。
        *   `渐变 (Gradient)`: 创建一个具有起始和结束颜色的线性渐变背景。
        *   `国旗 (National Flag)`: 选择一个国家/地区的旗帜作为背景 (需要在 `Nation/` 文件夹中准备相应的图片)。包含国旗搜索功能。
        *   `自定义 (Custom)`: 上传您自己的图片作为背景。

*   **尺寸与边框 (Size & Border):**
    *   **输出尺寸 (Export Size):**
        *   `导出比例 (Export Ratio)`: 选择最终图片的期望高宽比。此设置也会影响裁剪框的高宽比。
        *   `宽(px) (Width)` / `高(px) (Height)`: 设置导出图片的精确像素尺寸。更改其中一个值将根据选定的高宽比自动调整另一个值 (最大 2640px)。
    *   **边框设置 (Border Settings):**
        *   `边框宽度 (Border Width)`: 使用滑块调整边框厚度 (百分比，相对于头像较短边)。
        *   `圆角半径 (Corner Radius)`: 调整头像的圆角程度 (百分比，相对于头像较短边)。
        *   `边框颜色 (Border Color)`: 选择边框的颜色。

*   **配置管理 (Configuration Management):**
    *   `保存配置 (Save Settings)`: 将所有当前设置保存到浏览器的本地存储，并下载一个名为 `avatar-editor-config.json` 的配置文件。
    *   `加载配置 (Load Settings)`: 点击上传之前保存的 `avatar-editor-config.json` 文件以恢复设置。

*   **导出图片 (Export Image):**
    *   点击此按钮下载最终的头像。图片将保存为 PNG 格式，文件名将基于球员 ID 或球员姓名。

## 依赖项 (Dependencies)

*   [Interact.js](https://interactjs.io/): 用于实现裁剪框的拖放和调整大小功能。
*   [Remixicon](https://remixicon.com/): 用于界面图标。

## 作者信息与致谢 (Author & Credits)

*   **作者 (Author):** ShineMiyo
*   **联系方式 (Contact):** 849278533@qq.com
*   **协助开发 (Developed with help from):** Trae, Cursor 
