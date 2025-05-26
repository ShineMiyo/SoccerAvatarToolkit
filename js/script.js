document.addEventListener('DOMContentLoaded', () => {
    const uploadImage = document.getElementById('uploadImage');
    const originalContainer = document.getElementById('originalContainer');
    const finalCanvas = document.getElementById('finalCanvas');
    const playerNameInput = document.getElementById('playerName');
    const namePositionSelect = document.getElementById('namePosition');
    const fontSizeInput = document.getElementById('fontSize');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const fontFamilySelect = document.getElementById('fontFamily');
    const customFontInput = document.getElementById('customFont');
    const bgTypeSelect = document.getElementById('bgType');
    const bgColorControls = document.getElementById('bgColorControls');
    const bgGradientControls = document.getElementById('bgGradientControls');
    const bgPresetControls = document.getElementById('bgPresetControls');
    const bgCustomControls = document.getElementById('bgCustomControls');
    const bgColorInput = document.getElementById('bgColor');
    const bgGradientStart = document.getElementById('bgGradientStart');
    const bgGradientEnd = document.getElementById('bgGradientEnd');
    const bgPresetSelect = document.getElementById('bgPreset');
    const bgCustomInput = document.getElementById('bgCustom');
    const rotateLeftBtn = document.getElementById('rotateLeft');
    const rotateRightBtn = document.getElementById('rotateRight');
    const flipHorizontalBtn = document.getElementById('flipHorizontal');
    const exportRatioSelect = document.getElementById('exportRatio');
    const exportWidthInput = document.getElementById('exportWidth');
    const exportHeightInput = document.getElementById('exportHeight');
    const playerIdInput = document.getElementById('playerId');
    const borderWidthInput = document.getElementById('borderWidth');
    const borderWidthValue = document.getElementById('borderWidthValue');
    const borderRadiusInput = document.getElementById('borderRadius');
    const borderRadiusValue = document.getElementById('borderRadiusValue');
    const borderColorInput = document.getElementById('borderColor');
    const exportBtn = document.getElementById('exportBtn');
    const nameColorInput = document.getElementById('nameColor');
    const flagSearchInput = document.getElementById('flagSearch');
    const useEnglishFontInput = document.getElementById('useEnglishFont');
    const englishFontSelect = document.getElementById('englishFont');
    const saveSettingsBtn = document.getElementById('saveSettings');
    const loadSettingsBtn = document.getElementById('loadSettings');
    const settingsFileInput = document.getElementById('settingsFileInput');
    
    // 帮助弹窗相关元素
    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    const closeHelpModalBtn = document.getElementById('closeHelpModal');
    const helpContent = document.getElementById('helpContent');

    // 帮助说明 Markdown 内容
    const helpMarkdownContent = `
# 帮助说明

欢迎使用图片编辑器！以下是一些基本操作指南：

## 1. 上传图片

- 点击"选择图片"按钮，或将图片文件拖拽到指定区域以上传你的原始图片。

## 2. 调整参数

### 2.1 文本
- **玩家姓名**: 输入要显示在图片上的文字。
- **名字位置**: 选择文字在图片上的九宫格位置。
- **字体大小**: 调整文字相对于图片短边的百分比大小。
- **字体选择**: 选择中文字体。
- **使用英文字体**: 勾选后，可为名称中的英文字母和数字选择不同的字体。
- **名字颜色**: 设置文字的颜色。

### 2.2 背景
- **背景类型**: 
    - **纯色**: 选择一个颜色作为背景。
    - **渐变**: 选择起始和结束颜色创建线性渐变背景。
    - **预设**: 从列表中选择一个预设图案（如国旗）作为背景。可以通过搜索框快速查找。
    - **自定义**: 上传你自己的图片作为背景。

### 2.3 变换
- **向左旋转**: 将图片逆时针旋转90度。
- **向右旋转**: 将图片顺时针旋转90度。
- **水平翻转**: 水平镜像图片。

### 2.4 导出设置
- **导出比例**: 选择常用的图片比例，或选择"自由"以自定义宽高。
- **导出宽度/高度**: 设置最终导出图片的精确尺寸（最大2640px）。
- **球员ID**: (可选) 输入球员ID，将用于默认文件名。

### 2.5 边框
- **边框宽度**: 设置边框的宽度，相对于图片短边的百分比。
- **边框圆角**: 设置边框和图片内容的圆角半径，相对于图片短边的百分比。
- **边框颜色**: 选择边框的颜色。

## 3. 裁剪区域

- 上传图片后，会出现一个裁剪框。
- **拖动**: 直接拖动裁剪框以选择图片的显示部分。
- **调整大小**: 拖动裁剪框的边缘或角落可以调整其大小，调整时会保持当前设定的导出比例。

## 4. 导出图片

- 完成所有调整后，点击"导出图片"按钮。
- 图片将以PNG格式下载，文件名为"球员ID_球员姓名.png"或"image_export.png"（如果未提供ID和姓名）。

## 5. 保存与加载配置

- **保存配置**: 点击"保存配置"按钮，可以将当前所有设置（除上传的图片外）保存为一个 JSON 文件。
- **加载配置**: 点击"加载配置"按钮，选择之前保存的 JSON 文件，可以恢复所有设置。

## 快捷键 (暂未实现)

- Ctrl + S: 保存配置
- Ctrl + O: 加载配置
- Ctrl + E: 导出图片

如果遇到问题，请尝试刷新页面或检查浏览器控制台输出。
`;

    // 帮助弹窗逻辑
    if (helpBtn) { // 确保按钮存在
        helpBtn.addEventListener('click', async () => {
            console.log("Help button clicked.");
            try {
                const response = await fetch('README.md');
                console.log("README.md fetch response status:", response.status);
                if (!response.ok) {
                    throw new Error(`无法加载帮助文档: ${response.statusText} (Status: ${response.status})`);
                }
                const readmeText = await response.text();
                console.log("README.md content fetched successfully.");

                // 检查 Marked.js 是否加载以及如何调用
                if (window.marked && typeof window.marked.parse === 'function') {
                    console.log("Marked.js loaded, using window.marked.parse()");
                    helpContent.innerHTML = window.marked.parse(readmeText);
                } else if (window.marked && typeof window.marked === 'function') {
                    // 兼容某些版本可能直接是 marked(string)
                    console.log("Marked.js loaded, using window.marked() directly");
                    helpContent.innerHTML = window.marked(readmeText);
                } else {
                    console.error('Marked.js (window.marked or window.marked.parse) is not available. Displaying as preformatted text.');
                    helpContent.innerHTML = `<pre>${readmeText}</pre>`; // Fallback
                }
                helpModal.classList.remove('hidden');
            } catch (error) {
                console.error('加载或解析帮助文档失败:', error);
                helpContent.textContent = `帮助内容加载或解析失败。请检查浏览器控制台获取更多信息。错误：${error.message}`;
                helpModal.classList.remove('hidden');
            }
        });
    }

    if (closeHelpModalBtn) { // 确保关闭按钮存在
        closeHelpModalBtn.addEventListener('click', () => {
            helpModal.classList.add('hidden');
        });
    }

    if (helpModal) { // 确保弹窗存在
        helpModal.addEventListener('click', (event) => {
            if (event.target === helpModal) {
                helpModal.classList.add('hidden');
            }
        });
    }

    let originalImg = null;
    let cropBox = null;
    let bgImg = null;
    let rotation = 0;
    let isFlipped = false;

    // 加载内置字体（使用 FontFace API）
    function loadBuiltInFonts() {
        const promises = [];
        Array.from(fontFamilySelect.options).forEach(opt => {
            const name = opt.value;
            const file = opt.getAttribute('data-file');
            const url = `Fonts/CN/${encodeURIComponent(file)}`;
            const fontFace = new FontFace(name, `url('${url}') format('truetype')`);
            const fontFace2 = new FontFace(name, `url('${url}') format('opentype')`);
            const fontFace3 = new FontFace(name, `url('${url}') format('embedded-opentype')`);
            const fontFace4 = new FontFace(name, `url('${url}') format('woff')`);
            const fontFace5 = new FontFace(name, `url('${url}') format('woff2')`);
            promises.push(fontFace.load().then(loaded => document.fonts.add(loaded)));
            promises.push(fontFace2.load().then(loaded => document.fonts.add(loaded)));
            promises.push(fontFace3.load().then(loaded => document.fonts.add(loaded)));
            promises.push(fontFace4.load().then(loaded => document.fonts.add(loaded)));
            promises.push(fontFace5.load().then(loaded => document.fonts.add(loaded)));
        });
        Array.from(englishFontSelect.options).forEach(opt => {
            const name = opt.value;
            const file = opt.getAttribute('data-file');
            const url = `Fonts/EN/${encodeURIComponent(file)}`;
            const fontFace = new FontFace(name, `url('${url}') format('truetype')`);
            const fontFace2 = new FontFace(name, `url('${url}') format('opentype')`);
            const fontFace3 = new FontFace(name, `url('${url}') format('embedded-opentype')`);
            const fontFace4 = new FontFace(name, `url('${url}') format('woff')`);
            const fontFace5 = new FontFace(name, `url('${url}') format('woff2')`);
            promises.push(fontFace.load().then(loaded => document.fonts.add(loaded)));
            promises.push(fontFace2.load().then(loaded => document.fonts.add(loaded)));
            promises.push(fontFace3.load().then(loaded => document.fonts.add(loaded)));
            promises.push(fontFace4.load().then(loaded => document.fonts.add(loaded)));
            promises.push(fontFace5.load().then(loaded => document.fonts.add(loaded)));
        });
        Promise.all(promises).catch(err => console.error('内置字体加载失败', err));
    }
    loadBuiltInFonts();

    // 上传图片事件
    uploadImage.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => loadOriginalImage(event.target.result);
        reader.readAsDataURL(file);
    });

    // 背景类型切换
    bgTypeSelect.addEventListener('change', () => {
        const val = bgTypeSelect.value;
        bgColorControls.classList.toggle('hidden', val !== 'color');
        bgGradientControls.classList.toggle('hidden', val !== 'gradient');
        bgPresetControls.classList.toggle('hidden', val !== 'preset');
        bgCustomControls.classList.toggle('hidden', val !== 'custom');
        flagSearchInput.parentElement.classList.toggle('hidden', val !== 'preset');
        if (val === 'preset') bgPresetSelect.dispatchEvent(new Event('change'));
        updateAllPreviews();
    });

    [bgColorInput, bgGradientStart, bgGradientEnd].forEach(el => el.addEventListener('input', updateAllPreviews));

    // 国旗对应的中文名称映射 - 只包含实际存在的文件
    const flagNameMapping = {
        'AD': '安道尔',
        'AE': '阿联酋', 
        'AF': '阿富汗',
        'AG': '安提瓜和巴布达',
        'AL': '阿尔巴尼亚',
        'AO': '安哥拉',
        'AR': '阿根廷',
        'AT': '奥地利',
        'AZ': '阿塞拜疆',
        'BA': '波黑',
        'BD': '孟加拉国',
        'BE': '比利时',
        'BF': '布基纳法索',
        'BG': '保加利亚',
        'BH': '巴林',
        'BI': '布隆迪',
        'BJ': '贝宁',
        'BM': '百慕大',
        'BN': '文莱',
        'BR': '巴西',
        'BS': '巴哈马',
        'BW': '博茨瓦纳',
        'BY': '白俄罗斯',
        'BZ': '伯利兹',
        'CA': '加拿大',
        'CF': '中非',
        'CG': '刚果(布)',
        'CH': '瑞士',
        'CI': '科特迪瓦',
        'CL': '智利',
        'CM': '喀麦隆',
        'CN': '中国',
        'CO': '哥伦比亚',
        'CR': '哥斯达黎加',
        'CU': '古巴',
        'CV': '佛得角',
        'CY': '塞浦路斯',
        'CZ': '捷克',
        'DE': '德国',
        'DJ': '吉布提',
        'DK': '丹麦',
        'DM': '多米尼加',
        'DZ': '阿尔及利亚',
        'EC': '厄瓜多尔',
        'EE': '爱沙尼亚',
        'EG': '埃及',
        'ER': '厄立特里亚',
        'ES': '西班牙',
        'ET': '埃塞俄比亚',
        'FI': '芬兰',
        'FK': '福克兰群岛',
        'FR': '法国',
        'GA': '加蓬',
        'GB': '英国',
        'GH': '加纳',
        'GL': '格陵兰',
        'GM': '冈比亚',
        'GN': '几内亚',
        'GQ': '赤道几内亚',
        'GR': '希腊',
        'GT': '危地马拉',
        'GW': '几内亚比绍',
        'GY': '圭亚那',
        'HN': '洪都拉斯',
        'HR': '克罗地亚',
        'HT': '海地',
        'HU': '匈牙利',
        'ID': '印度尼西亚',
        'IE': '爱尔兰',
        'IL': '以色列',
        'IN': '印度',
        'IQ': '伊拉克',
        'IR': '伊朗',
        'IS': '冰岛',
        'IT': '意大利',
        'JM': '牙买加',
        'JO': '约旦',
        'JP': '日本',
        'KE': '肯尼亚',
        'KG': '吉尔吉斯斯坦',
        'KH': '柬埔寨',
        'KM': '科摩罗',
        'KN': '圣基茨和尼维斯',
        'KP': '朝鲜',
        'KR': '韩国',
        'KW': '科威特',
        'KZ': '哈萨克斯坦',
        'LA': '老挝',
        'LB': '黎巴嫩',
        'LC': '圣卢西亚',
        'LI': '列支敦士登',
        'LK': '斯里兰卡',
        'LR': '利比里亚',
        'LS': '莱索托',
        'LT': '立陶宛',
        'LU': '卢森堡',
        'LV': '拉脱维亚',
        'LY': '利比亚',
        'MA': '摩洛哥',
        'MD': '摩尔多瓦',
        'MG': '马达加斯加',
        'ML': '马里',
        'MM': '缅甸',
        'MN': '蒙古',
        'MT': '马耳他',
        'MU': '毛里求斯',
        'MV': '马尔代夫',
        'MW': '马拉维',
        'MX': '墨西哥',
        'MY': '马来西亚',
        'NA': '纳米比亚',
        'NE': '尼日尔',
        'NG': '尼日利亚',
        'NI': '尼加拉瓜',
        'NL': '荷兰',
        'NO': '挪威',
        'NP': '尼泊尔',
        'OM': '阿曼',
        'PA': '巴拿马',
        'PE': '秘鲁',
        'PH': '菲律宾',
        'PK': '巴基斯坦',
        'PL': '波兰',
        'PS': '巴勒斯坦',
        'PT': '葡萄牙',
        'PY': '巴拉圭',
        'QA': '卡塔尔',
        'RO': '罗马尼亚',
        'RS': '塞尔维亚',
        'RU': '俄罗斯',
        'RW': '卢旺达',
        'SA': '沙特阿拉伯',
        'SC': '塞舌尔',
        'SD': '苏丹',
        'SE': '瑞典',
        'SG': '新加坡',
        'SI': '斯洛文尼亚',
        'SK': '斯洛伐克',
        'SL': '塞拉利昂',
        'SM': '圣马力诺',
        'SN': '塞内加尔',
        'SO': '索马里',
        'SR': '苏里南',
        'ST': '圣多美和普林西比',
        'SV': '萨尔瓦多',
        'SY': '叙利亚',
        'SZ': '斯威士兰',
        'TG': '多哥',
        'TH': '泰国',
        'TJ': '塔吉克斯坦',
        'TM': '土库曼斯坦',
        'TN': '突尼斯',
        'TR': '土耳其',
        'TT': '特立尼达和多巴哥',
        'TZ': '坦桑尼亚',
        'UA': '乌克兰',
        'UG': '乌干达',
        'US': '美国',
        'UY': '乌拉圭',
        'UZ': '乌兹别克斯坦',
        'VA': '梵蒂冈',
        'VC': '圣文森特和格林纳丁斯',
        'VE': '委内瑞拉',
        'VN': '越南',
        'YE': '也门',
        'ZA': '南非',
        'ZM': '赞比亚',
        'ZW': '津巴布韦'
    };

    // 大洲分类映射
    const continentMapping = {
        '亚洲': ['AE', 'AF', 'AZ', 'BH', 'BD', 'BN', 'KH', 'CN', 'CY', 'GE', 'IN', 'ID', 'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KP', 'KR', 'KW', 'KG', 'LA', 'LB', 'MV', 'MY', 'MN', 'MM', 'NP', 'OM', 'PK', 'PS', 'PH', 'QA', 'SA', 'SG', 'LK', 'SY', 'TW', 'TJ', 'TH', 'TL', 'TR', 'TM', 'AE', 'UZ', 'VN', 'YE'],
        '欧洲': ['AL', 'AD', 'AM', 'AT', 'AZ', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'GE', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'KZ', 'LV', 'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'TR', 'UA', 'GB', 'VA'],
        '非洲': ['DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CI', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW'],
        '北美洲': ['AG', 'BS', 'BB', 'BZ', 'CA', 'CR', 'CU', 'DM', 'SV', 'GL', 'GD', 'GT', 'HT', 'HN', 'JM', 'MX', 'NI', 'PA', 'KN', 'LC', 'VC', 'TT', 'US'],
        '南美洲': ['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'FK', 'GF', 'GY', 'PY', 'PE', 'SR', 'UY', 'VE'],
        '大洋洲': ['AU', 'FJ', 'KI', 'MH', 'FM', 'NR', 'NZ', 'PW', 'PG', 'WS', 'SB', 'TO', 'TV', 'VU']
    };

    // 从实际文件生成国旗选项
    let availableFlags = [];
    let presetFlags = {};

    // 动态检测可用国旗文件
    async function detectAvailableFlags() {
        const fileList = [
            'AD', 'AE', 'AF', 'AG', 'AL', 'AO', 'AR', 'AT', 'AZ', 'BA', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BM', 'BN', 'BR', 'BS', 'BW', 'BY', 'BZ', 'CA', 'CF', 'CG', 'CH', 'CI', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DZ', 'EC', 'EE', 'EG', 'ER', 'ES', 'ET', 'FI', 'FK', 'FR', 'GA', 'GB', 'GH', 'GL', 'GM', 'GN', 'GQ', 'GR', 'GT', 'GW', 'GY', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IN', 'IQ', 'IR', 'IS', 'IT', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KM', 'KN', 'KP', 'KR', 'KW', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MD', 'MG', 'ML', 'MM', 'MN', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'NA', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'OM', 'PA', 'PE', 'PH', 'PK', 'PL', 'PS', 'PT', 'PY', 'QA', 'RO', 'RS', 'RU', 'RW', 'SA', 'SC', 'SD', 'SE', 'SG', 'SI', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'ST', 'SV', 'SY', 'SZ', 'TG', 'TH', 'TJ', 'TM', 'TN', 'TR', 'TT', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VN', 'YE', 'ZA', 'ZM', 'ZW'
        ];

        const existingFlags = [];
        
        // 并发检测文件是否存在
        const checkPromises = fileList.map(code => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    if (flagNameMapping[code]) {
                        existingFlags.push({
                            name: flagNameMapping[code],
                            code: code,
                            src: `Nation/${code}.png`
                        });
                    }
                    resolve();
                };
                img.onerror = () => {
                    console.warn(`国旗文件不存在: Nation/${code}.png`);
                    resolve();
                };
                img.src = `Nation/${code}.png`;
            });
        });

        await Promise.all(checkPromises);
        
        // 按大洲分类现有国旗
        presetFlags = {};
        Object.keys(continentMapping).forEach(continent => {
            presetFlags[continent] = [];
            
            continentMapping[continent].forEach(code => {
                const flag = existingFlags.find(f => f.code === code);
                if (flag) {
                    presetFlags[continent].push(flag);
                }
            });
            
            // 按中文名称排序
            presetFlags[continent].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
            
            // 如果该大洲没有国旗，删除该分类
            if (presetFlags[continent].length === 0) {
                delete presetFlags[continent];
            }
        });

        console.log(`检测到 ${existingFlags.length} 个有效国旗文件`);
        console.log('按大洲分类:', presetFlags);
        
        return existingFlags;
    }

    // 预加载国旗图片
    const flagImages = {};
    let loadedFlags = 0;
    let totalFlags = 0;

    async function preloadFlags() {
        availableFlags = await detectAvailableFlags();
        totalFlags = availableFlags.length;
        
        // 预加载所有可用国旗
        const loadPromises = availableFlags.map(flag => {
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = () => { 
                    flagImages[flag.src] = img; 
                    loadedFlags++;
                    console.log(`国旗加载成功: ${flag.name} (${loadedFlags}/${totalFlags})`);
                    resolve();
                };
                img.onerror = () => {
                    console.warn(`国旗加载失败: ${flag.name} - ${flag.src}`);
                    loadedFlags++;
                    // 创建占位符图像
                    const placeholderImg = new Image();
                    placeholderImg.width = 32;
                    placeholderImg.height = 24;
                    flagImages[flag.src] = placeholderImg;
                    resolve();
                };
                img.src = flag.src;
            });
        });

        await Promise.all(loadPromises);
        
        // 生成选择器选项
        populateFlagSelector();
        
        console.log(`✅ 所有国旗预加载完成: ${loadedFlags}/${totalFlags}`);
    }

    // 生成分组的国旗选择器选项
    function populateFlagSelector() {
        bgPresetSelect.innerHTML = '';
        
        Object.keys(presetFlags).forEach(continent => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = continent;
            
            presetFlags[continent].forEach(flag => {
                const option = document.createElement('option');
                option.value = flag.src;
                option.textContent = flag.name;
                option.setAttribute('data-continent', continent);
                option.setAttribute('data-code', flag.code);
                optgroup.appendChild(option);
            });
            
            bgPresetSelect.appendChild(optgroup);
        });
        
        // 默认选择中国（如果存在）
        if (bgPresetSelect.options.length > 0) {
            const chinaOption = bgPresetSelect.querySelector('option[data-code="CN"]');
            if (chinaOption) {
                bgPresetSelect.value = chinaOption.value;
            } else {
                bgPresetSelect.value = bgPresetSelect.options[0].value;
            }
        bgPresetSelect.dispatchEvent(new Event('change'));
        }
        
        // 添加下拉列表滚动位置控制
        setupSelectScrollControl();
    }

    // 将选中的选项滚动到可见区域的底部
    function scrollToSelectedOption() {
        const selectedOption = bgPresetSelect.options[bgPresetSelect.selectedIndex];
        if (!selectedOption) return;

        try {
            // 使用现代浏览器的 scrollIntoView API 获得更精确的控制
            if (selectedOption.scrollIntoView) {
                selectedOption.scrollIntoView({
                    behavior: 'instant', // 立即滚动，不使用动画
                    block: 'end',        // 将选项滚动到可见区域的底部
                    inline: 'nearest'    // 水平方向保持最近位置
                });
                console.log(`[scrollToSelectedOption] 使用scrollIntoView成功: ${selectedOption.textContent}`);
            } else {
                // 回退方案：手动计算滚动位置
                const selectRect = bgPresetSelect.getBoundingClientRect();
                const optionHeight = 20; // 估算的选项高度
                const visibleOptions = Math.floor(selectRect.height / optionHeight);
                const selectedIndex = bgPresetSelect.selectedIndex;
                const targetScrollTop = Math.max(0, (selectedIndex - visibleOptions + 2) * optionHeight);
                
                bgPresetSelect.scrollTop = targetScrollTop;
                console.log(`[scrollToSelectedOption] 使用回退方案: selectedIndex=${selectedIndex}, scrollTop=${targetScrollTop}`);
            }
        } catch (error) {
            console.warn('[scrollToSelectedOption] 滚动设置失败:', error);
        }
    }

    // 防抖动函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 设置下拉列表滚动控制
    function setupSelectScrollControl() {
        // 创建防抖动的滚动函数
        const debouncedScroll = debounce(scrollToSelectedOption, 50);

        // 防止鼠标移动导致的意外滚动
        bgPresetSelect.addEventListener('mouseenter', (e) => {
            e.target.blur(); // 移除焦点，防止键盘滚动
        });

        // 监听下拉列表打开事件（鼠标点击）
        bgPresetSelect.addEventListener('mousedown', (e) => {
            // 延迟执行，确保下拉列表已经完全打开并渲染
            setTimeout(() => {
                debouncedScroll();
            }, 100);
        });

        // 监听聚焦事件（键盘或代码触发）
        bgPresetSelect.addEventListener('focus', (e) => {
            setTimeout(() => {
                debouncedScroll();
            }, 100);
        });

        // 监听键盘打开事件
        bgPresetSelect.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                setTimeout(() => {
                    debouncedScroll();
                }, 50);
            }
        });

        // 添加选择变化监听（当用户选择不同选项时）
        bgPresetSelect.addEventListener('change', (e) => {
            // 在下次打开时记住新的选择
            bgPresetSelect.setAttribute('data-last-selected', bgPresetSelect.selectedIndex);
        });

        console.log('[setupSelectScrollControl] 下拉列表滚动控制已设置');
    }

    // 启动国旗检测和预加载
    preloadFlags().catch(console.error);

    // 国旗搜索
    flagSearchInput.addEventListener('input', () => {
        const kw = flagSearchInput.value.trim().toLowerCase();
        bgPresetSelect.innerHTML = '';
        
        if (!kw) {
            // 如果搜索为空，显示所有国旗
            populateFlagSelector();
            return;
        }
        
        // 搜索匹配的国旗，按大洲分组显示
        Object.keys(presetFlags).forEach(continent => {
            const matchedFlags = presetFlags[continent].filter(flag => 
                flag.name.toLowerCase().includes(kw) || 
                flag.code.toLowerCase().includes(kw) ||
                continent.toLowerCase().includes(kw)
            );
            
            if (matchedFlags.length > 0) {
                const optgroup = document.createElement('optgroup');
                optgroup.label = continent;
                
                matchedFlags.forEach(flag => {
                    const option = document.createElement('option');
                    option.value = flag.src;
                    option.textContent = flag.name;
                    option.setAttribute('data-continent', continent);
                    option.setAttribute('data-code', flag.code);
                    optgroup.appendChild(option);
                });
                
                bgPresetSelect.appendChild(optgroup);
            }
        });
        
        if (bgPresetSelect.options.length > 0) {
            bgPresetSelect.value = bgPresetSelect.options[0].value;
            bgPresetSelect.dispatchEvent(new Event('change'));
        }
    });

    // 英文字体切换
    useEnglishFontInput.addEventListener('change', updateAllPreviews);
    englishFontSelect.addEventListener('change', updateAllPreviews);

    // 保存/加载配置
    saveSettingsBtn.addEventListener('click', saveSettings);
    // 加载配置：弹出文件选择
    loadSettingsBtn.addEventListener('click', () => settingsFileInput.click());
    settingsFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const settings = JSON.parse(event.target.result);
                applySettings(settings);
            } catch (err) {
                alert('配置文件解析失败');
            }
        };
        reader.readAsText(file);
    });

    // 变换操作
    rotateLeftBtn.addEventListener('click', () => {
        rotation -= 90;
        updateAllPreviews();
    });
    rotateRightBtn.addEventListener('click', () => {
        rotation += 90;
        updateAllPreviews();
    });
    flipHorizontalBtn.addEventListener('click', () => {
        isFlipped = !isFlipped;
        updateAllPreviews();
    });

    // 导出尺寸及比例
    exportRatioSelect.addEventListener('change', () => {
        updateExportSizeByRatio('ratio');
        setupCropBox();
    });
    exportWidthInput.addEventListener('input', (e) => {
        let val = parseInt(e.target.value) || 1;
        val = Math.min(Math.max(val, 1), 2640);
        e.target.value = val;
        updateExportSizeByRatio('width');
    });
    exportHeightInput.addEventListener('input', (e) => {
        let val = parseInt(e.target.value) || 1;
        val = Math.min(Math.max(val, 1), 2640);
        e.target.value = val;
        updateExportSizeByRatio('height');
    });

    // 文本编辑
    fontSizeInput.addEventListener('input', (e) => {
        fontSizeValue.textContent = e.target.value + '%';
        updateAllPreviews();
    });
    [fontFamilySelect, playerNameInput, namePositionSelect].forEach(el => el.addEventListener('input', updateAllPreviews));

    // 边框圆角
    borderWidthInput.addEventListener('input', (e) => {
        borderWidthValue.textContent = e.target.value;
        updateAllPreviews();
    });
    borderRadiusInput.addEventListener('input', (e) => {
        borderRadiusValue.textContent = e.target.value + '%';
        updateAllPreviews();
    });
    borderColorInput.addEventListener('input', updateAllPreviews);

    // 导出按钮
    exportBtn.addEventListener('click', exportImage);

    // 名字颜色变化时更新预览
    nameColorInput.addEventListener('input', updateAllPreviews);

    // 加载原始图片并初始化裁剪框
    function loadOriginalImage(src) {
        originalContainer.innerHTML = '';
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = src;
        img.onload = () => {
            console.log(`[loadOriginalImage] 图片加载完成: ${img.naturalWidth}x${img.naturalHeight}`);
            originalImg = img;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            originalContainer.appendChild(img);
            
            // 直接设置裁剪框，现在使用固定尺寸不依赖clientWidth/Height
            setupCropBox();
            updateAllPreviews();
        };
        img.onerror = () => {
            console.error('[loadOriginalImage] 图片加载失败');
            alert('图片加载失败，请检查图片格式是否正确');
        };
    }

    // 设置裁剪框
    function setupCropBox() {
        if (cropBox) cropBox.remove();
        cropBox = document.createElement('div');
        cropBox.className = 'crop-box';
        
        // 获取容器尺寸，如果为0则使用CSS默认值
        let containerW = originalContainer.clientWidth || 260;
        let containerH = originalContainer.clientHeight || 260;
        
        console.log(`[setupCropBox] 容器尺寸获取: client=${originalContainer.clientWidth}x${originalContainer.clientHeight}, 使用=${containerW}x${containerH}`);
        
        if (!originalImg) {
            console.error('setupCropBox: originalImg is null');
            return;
        }
        
        const natW = originalImg.naturalWidth;
        const natH = originalImg.naturalHeight;
        
        // 计算图片在容器中的实际显示尺寸和位置
        const imgAspect = natW / natH;
        const containerAspect = containerW / containerH;
        
        let displayW, displayH, imgOffsetX = 0, imgOffsetY = 0;
        if (imgAspect > containerAspect) {
            // 图片更宽，以容器宽度为准
            displayW = containerW;
            displayH = containerW / imgAspect;
            imgOffsetY = (containerH - displayH) / 2;
        } else {
            // 图片更高，以容器高度为准
            displayH = containerH;
            displayW = containerH * imgAspect;
            imgOffsetX = (containerW - displayW) / 2;
        }
        
        const [rw, rh] = exportRatioSelect.value.split(':').map(n => parseFloat(n));
        const aspect = rw / rh;
        
        // 在图片显示区域内计算裁剪框尺寸
        let cropW, cropH;
        if (displayW / displayH > aspect) {
            cropH = displayH;
            cropW = displayH * aspect;
        } else {
            cropW = displayW;
            cropH = displayW / aspect;
        }
        
        // 裁剪框相对于图片显示区域居中，然后加上图片在容器中的偏移
        const cropLeft = imgOffsetX + (displayW - cropW) / 2;
        const cropTop = imgOffsetY + (displayH - cropH) / 2;
        
        cropBox.style.left = `${cropLeft}px`;
        cropBox.style.top = `${cropTop}px`;
        cropBox.style.width = `${cropW}px`;
        cropBox.style.height = `${cropH}px`;
        
        originalContainer.appendChild(cropBox);
        
        // 定义裁剪框的移动限制区域（图片显示区域）
        const restrictArea = {
            x: imgOffsetX,
            y: imgOffsetY,
            width: displayW,
            height: displayH
        };
        
        interact(cropBox).draggable({
            modifiers: [interact.modifiers.restrictRect({ 
                restriction: restrictArea, 
                endOnly: true 
            })],
            listeners: { move: dragMoveListener }
        }).resizable({
            modifiers: [
                interact.modifiers.aspectRatio({ ratio: aspect }),
                interact.modifiers.restrictEdges({ 
                    outer: restrictArea, 
                    endOnly: true 
                })
            ],
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: { move: resizeMoveListener }
        });
        
        console.log(`[setupCropBox] 裁剪框设置完成: 容器(${containerW}x${containerH}), 图片显示(${displayW}x${displayH}), 偏移(${imgOffsetX},${imgOffsetY}), 裁剪框(${cropW}x${cropH}) at (${cropLeft},${cropTop})`);
        
        updateAllPreviews();
    }

    function dragMoveListener(event) {
        const t = event.target;
        const left = (parseFloat(t.style.left) || 0) + event.dx;
        const top = (parseFloat(t.style.top) || 0) + event.dy;
        t.style.left = `${left}px`;
        t.style.top = `${top}px`;
        updateAllPreviews();
    }

    function resizeMoveListener(event) {
        const t = event.target;
        const x = (parseFloat(t.style.left) || 0) + event.deltaRect.left;
        const y = (parseFloat(t.style.top) || 0) + event.deltaRect.top;
        t.style.width = `${event.rect.width}px`;
        t.style.height = `${event.rect.height}px`;
        t.style.left = `${x}px`;
        t.style.top = `${y}px`;
        updateAllPreviews();
    }

    // 渲染最终画布
    function renderFinalCanvas() {
        // 即使没有图片也要显示预览
        const w = parseInt(exportWidthInput.value, 10);
        const h = parseInt(exportHeightInput.value, 10);
        finalCanvas.width = w;
        finalCanvas.height = h;
        const ctx = finalCanvas.getContext('2d');
        ctx.clearRect(0, 0, w, h);

        // 边框宽度按短边比例换算为像素
        const bwPercent = parseFloat(borderWidthInput.value);
        const bw = bwPercent / 100 * Math.min(w, h);
        const rPerc = parseFloat(borderRadiusInput.value);
        const radius = rPerc / 100 * Math.min(w, h);

        // 背景
        ctx.save();
        drawRoundedRect(ctx, 0, 0, w, h, radius);
        ctx.clip();
        const type = bgTypeSelect.value;
        console.log('[renderFinalCanvas] Background type:', type);
        if (type === 'color') {
            ctx.fillStyle = bgColorInput.value;
            ctx.fillRect(0, 0, w, h);
        } else if (type === 'gradient') {
            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, bgGradientStart.value);
            grad.addColorStop(1, bgGradientEnd.value);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        } else if (type === 'preset') {
            console.log('[renderFinalCanvas] 尝试使用国旗背景. bgImg:', bgImg);
            if (bgImg && bgImg.complete) {
                try {
                    // 修复国旗背景在非1:1比例下显示不全的问题
                    // 使用cover模式，确保国旗完全覆盖画布
                    const bgRatio = bgImg.width / bgImg.height;
                    const canvasRatio = w / h;
                    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
                    
                    if (canvasRatio > bgRatio) {
                        // 画布比国旗更宽，以宽度为基准填满
                        drawWidth = w;
                        drawHeight = w / bgRatio;
                        offsetY = (h - drawHeight) / 2;
                    } else {
                        // 画布比国旗更高，以高度为基准填满
                        drawHeight = h;
                        drawWidth = h * bgRatio;
                        offsetX = (w - drawWidth) / 2;
                    }
                    
                    ctx.drawImage(bgImg, offsetX, offsetY, drawWidth, drawHeight);
                    console.log(`[renderFinalCanvas] 成功绘制国旗背景: offsetX=${offsetX}, offsetY=${offsetY}, width=${drawWidth}, height=${drawHeight}`);
                } catch (drawError) {
                    console.error('[renderFinalCanvas] 绘制国旗背景失败:', drawError);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, w, h);
                }
            } else {
                console.warn('[renderFinalCanvas] 国旗图像未加载或无效:', bgImg);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, w, h);
            }
        } else if (type === 'custom' && bgImg && bgImg.complete) {
            console.log('[renderFinalCanvas] 绘制自定义背景图像');
            try {
                ctx.drawImage(bgImg, 0, 0, w, h);
            } catch (drawError) {
                console.error('[renderFinalCanvas] 绘制自定义背景失败:', drawError);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, w, h);
            }
        } else {
            console.warn('[renderFinalCanvas] 无有效背景或图像未就绪，使用白色背景');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, w, h);
        }
        ctx.restore();

        // 边框（在外围）
        if (bw > 0) {
            ctx.save();
            drawRoundedRect(ctx, bw / 2, bw / 2, w - bw, h - bw, Math.max(0, radius - bw / 2));
            ctx.strokeStyle = borderColorInput.value;
            ctx.lineWidth = bw;
            ctx.stroke();
            ctx.restore();
        }

        // 计算头像绘制区域（减去边框）
        const cw = w - bw * 2;
        const ch = h - bw * 2;

        // 只有在有图片时才绘制头像
        if (originalImg && cropBox) {
            // 裁剪并绘制头像 - 修复坐标计算一致性问题
            // 使用容器尺寸作为基准，确保与setupCropBox()中的计算一致
            let containerW = originalContainer.clientWidth || 260;
            let containerH = originalContainer.clientHeight || 260;
            const natW = originalImg.naturalWidth;
            const natH = originalImg.naturalHeight;
            
            // 获取裁剪框的位置和尺寸（这些是基于容器尺寸的）
            const cropLeft = parseFloat(cropBox.style.left);
            const cropTop = parseFloat(cropBox.style.top);
            const cropWidth = parseFloat(cropBox.style.width);
            const cropHeight = parseFloat(cropBox.style.height);
            
            console.log(`[renderFinalCanvas] 调试信息:`);
            console.log(`  容器尺寸: client=${originalContainer.clientWidth}x${originalContainer.clientHeight}, 使用=${containerW}x${containerH}`);
            console.log(`  原图尺寸: ${natW}x${natH}`);
            console.log(`  裁剪框: left=${cropLeft}, top=${cropTop}, width=${cropWidth}, height=${cropHeight}`);
            
            // 计算图片在容器中的实际显示尺寸和位置
            // 图片使用max-width/max-height: 100%，所以需要计算实际显示尺寸
            const imgAspect = natW / natH;
            const containerAspect = containerW / containerH;
            
            let displayW, displayH, offsetX = 0, offsetY = 0;
            if (imgAspect > containerAspect) {
                // 图片更宽，以容器宽度为准
                displayW = containerW;
                displayH = containerW / imgAspect;
                offsetY = (containerH - displayH) / 2;
            } else {
                // 图片更高，以容器高度为准
                displayH = containerH;
                displayW = containerH * imgAspect;
                offsetX = (containerW - displayW) / 2;
            }
            
            console.log(`  图片显示尺寸: ${displayW}x${displayH}, 偏移: (${offsetX}, ${offsetY})`);
            
            // 将裁剪框坐标转换为相对于图片显示区域的坐标
            const relativeLeft = cropLeft - offsetX;
            const relativeTop = cropTop - offsetY;
            
            console.log(`  相对坐标: left=${relativeLeft}, top=${relativeTop}`);
            
            // 计算在原图中的裁剪区域
            const scaleX = natW / displayW;
            const scaleY = natH / displayH;
            
            console.log(`  缩放比例: scaleX=${scaleX}, scaleY=${scaleY}`);
            
            // 确保裁剪坐标不为负数且在图片范围内
            const sx = Math.max(0, Math.min(relativeLeft * scaleX, natW));
            const sy = Math.max(0, Math.min(relativeTop * scaleY, natH));
            const sw = Math.max(0, Math.min(cropWidth * scaleX, natW - sx));
            const sh = Math.max(0, Math.min(cropHeight * scaleY, natH - sy));
            
            console.log(`  最终裁剪区域: sx=${sx}, sy=${sy}, sw=${sw}, sh=${sh}`);
            
            // 确保裁剪区域有效
            if (sw > 0 && sh > 0 && sx >= 0 && sy >= 0 && sx + sw <= natW && sy + sh <= natH) {
                ctx.save();
                drawRoundedRect(ctx, bw, bw, cw, ch, Math.max(0, radius - bw));
                ctx.clip();
                ctx.translate(w / 2, h / 2);
                if (isFlipped) ctx.scale(-1, 1);
                ctx.rotate(rotation * Math.PI / 180);
                ctx.drawImage(originalImg, sx, sy, sw, sh, -cw / 2, -ch / 2, cw, ch);
                ctx.restore();
                console.log(`[renderFinalCanvas] ✅ 成功绘制头像`);
            } else {
                console.error('[renderFinalCanvas] ❌ 裁剪区域无效:', {sx, sy, sw, sh, natW, natH});
                // 显示错误占位符
                ctx.save();
                drawRoundedRect(ctx, bw, bw, cw, ch, Math.max(0, radius - bw));
                ctx.clip();
                ctx.fillStyle = '#ffcccc';
                ctx.fillRect(bw, bw, cw, ch);
                ctx.fillStyle = '#cc0000';
                ctx.font = `${Math.min(cw, ch) / 15}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('裁剪区域错误', w / 2, h / 2);
                ctx.restore();
            }
        } else {
            console.log(`[renderFinalCanvas] 没有图片或裁剪框: originalImg=${!!originalImg}, cropBox=${!!cropBox}`);
            // 没有图片时，显示占位符文本
            ctx.save();
            drawRoundedRect(ctx, bw, bw, cw, ch, Math.max(0, radius - bw));
            ctx.clip();
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(bw, bw, cw, ch);
            
            // 绘制占位符文本
            ctx.fillStyle = '#999';
            ctx.font = `${Math.min(cw, ch) / 10}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('请上传头像图片', w / 2, h / 2);
            ctx.restore();
        }

        // 绘制文字（混合中英字体）
        const name = playerNameInput.value.trim();
        if (name) {
            ctx.save();
            ctx.fillStyle = nameColorInput.value;
            const fontSizePx = parseFloat(fontSizeInput.value) / 100 * Math.min(cw, ch);
            ctx.textBaseline = 'middle';
            const [vert, hor] = namePositionSelect.value.split('-');
            // 制作字符宽度列表
            let totalW = 0;
            const charWidths = [],
                charFonts = [];
            for (const chStr of name) {
                const isEng = useEnglishFontInput.checked && /^[\x00-\x7F]$/.test(chStr);
                const fm = isEng ? `${fontSizePx}px ${englishFontSelect.value}` : `${fontSizePx}px ${fontFamilySelect.value}`;
                ctx.font = fm;
                charFonts.push(fm);
                const wCh = ctx.measureText(chStr).width;
                charWidths.push(wCh);
                totalW += wCh;
            }
            // 计算起始X坐标
            let xStart;
            if (hor === 'left') xStart = bw + 5;
            else if (hor === 'right') xStart = w - bw - totalW - 5;
            else xStart = w / 2 - totalW / 2;
            let yPos = vert === 'top' ? bw + fontSizePx / 2 : vert === 'bottom' ? h - bw - fontSizePx / 2 : h / 2;
            // 逐字符绘制
            let curX = xStart;
            for (let i = 0; i < name.length; i++) {
                ctx.font = charFonts[i];
                ctx.fillText(name[i], curX, yPos);
                curX += charWidths[i];
            }
            ctx.restore();
        }
    }

    // 绘制圆角矩形
    function drawRoundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
    }

    // 调整导出尺寸
    function updateExportSizeByRatio(changed) {
        const [rw, rh] = exportRatioSelect.value.split(':').map(n => parseFloat(n));
        let w = parseInt(exportWidthInput.value, 10);
        let h = parseInt(exportHeightInput.value, 10);
        if (changed === 'ratio' || changed === 'width') {
            h = Math.round(w * rh / rw);
            exportHeightInput.value = h;
        } else if (changed === 'height') {
            w = Math.round(h * rw / rh);
            exportWidthInput.value = w;
        }
        // 限制最大值
        exportWidthInput.value = Math.min(parseInt(exportWidthInput.value, 10), 2640);
        exportHeightInput.value = Math.min(parseInt(exportHeightInput.value, 10), 2640);
        updateAllPreviews();
    }

    // 更新所有预览（仅渲染最终画布）
    function updateAllPreviews() {
        renderFinalCanvas();
    }

    // 导出图片
    function exportImage() {
        try {
            if (finalCanvas.toBlob) {
                finalCanvas.toBlob(blob => {
                    if (!blob) {
                        console.error('Canvas toBlob failed to create blob.');
                        alert('导出图片失败，无法创建图片数据。');
                        return;
                    }
                    let url = null;
                    try {
                        const link = document.createElement('a');
                        const baseName = playerIdInput.value.trim() || playerNameInput.value.trim() || 'Player';
                        link.download = `${baseName}.png`;
                        url = URL.createObjectURL(blob);
                        link.href = url;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    } catch (err) {
                        console.error('导出图片时发生错误 (blob):', err);
                        alert(`导出图片时发生错误: ${err.message}`);
                    } finally {
                        if (url) {
                            URL.revokeObjectURL(url); // 释放对象 URL
                        }
                    }
                }, 'image/png'); // 指定 MIME 类型
            } else {
                // 回退：使用 dataURL
                console.warn('toBlob not supported, falling back to toDataURL.');
                const dataUrl = finalCanvas.toDataURL('image/png');
                 if (!dataUrl || dataUrl === 'data:,') {
                     console.error('Canvas toDataURL failed to generate data URL.');
                     alert('导出图片失败，无法生成图片数据。');
                     return;
                 }
                try {
                    const link = document.createElement('a');
                    const baseName = playerIdInput.value.trim() || playerNameInput.value.trim() || 'Player';
                    link.download = `${baseName}.png`;
                    link.href = dataUrl;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } catch (err) {
                    console.error('导出图片时发生错误 (dataURL):', err);
                    alert(`导出图片时发生错误: ${err.message}`);
                }
            }
        } catch (err) {
            console.error('导出图片时发生顶层错误:', err);
            alert(`导出图片时发生意外错误: ${err.message}`);
        }
    }

    function saveSettings() {
        const settings = {
            playerName: playerNameInput.value,
            playerId: playerIdInput.value,
            fontSize: fontSizeInput.value,
            fontFamily: fontFamilySelect.value,
            nameColor: nameColorInput.value,
            useEnglishFont: useEnglishFontInput.checked,
            englishFont: englishFontSelect.value,
            bgType: bgTypeSelect.value,
            bgColor: bgColorInput.value,
            bgGradientStart: bgGradientStart.value,
            bgGradientEnd: bgGradientEnd.value,
            bgPreset: bgPresetSelect.value,
            exportRatio: exportRatioSelect.value,
            exportWidth: exportWidthInput.value,
            exportHeight: exportHeightInput.value,
            rotation: rotation,
            flip: isFlipped,
            borderWidth: borderWidthInput.value,
            borderRadius: borderRadiusInput.value,
            borderColor: borderColorInput.value
        };
        // 保存到 localStorage 并下载 JSON 文件
        localStorage.setItem('avatarEditorSettings', JSON.stringify(settings));
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'avatar-editor-config.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert('配置已保存为文件');
    }

    // 应用配置到界面
    function applySettings(settings) {
        playerNameInput.value = settings.playerName || '';
        playerIdInput.value = settings.playerId || '';
        if (settings.fontSize) {
            fontSizeInput.value = settings.fontSize;
            fontSizeValue.textContent = settings.fontSize + '%';
        }
        if (settings.fontFamily) fontFamilySelect.value = settings.fontFamily;
        if (settings.nameColor) nameColorInput.value = settings.nameColor;
        if (typeof settings.useEnglishFont === 'boolean') useEnglishFontInput.checked = settings.useEnglishFont;
        if (settings.englishFont) englishFontSelect.value = settings.englishFont;
        if (settings.bgType) {
            bgTypeSelect.value = settings.bgType;
            bgTypeSelect.dispatchEvent(new Event('change'));
        }
        if (settings.bgColor) bgColorInput.value = settings.bgColor;
        if (settings.bgGradientStart) bgGradientStart.value = settings.bgGradientStart;
        if (settings.bgGradientEnd) bgGradientEnd.value = settings.bgGradientEnd;
        if (settings.bgPreset) {
            bgPresetSelect.value = settings.bgPreset;
            bgPresetSelect.dispatchEvent(new Event('change'));
        }
        if (settings.exportRatio) {
            exportRatioSelect.value = settings.exportRatio;
            updateExportSizeByRatio('ratio');
            setupCropBox();
        }
        if (settings.exportWidth) exportWidthInput.value = settings.exportWidth;
        if (settings.exportHeight) exportHeightInput.value = settings.exportHeight;
        if (typeof settings.rotation === 'number') rotation = settings.rotation;
        if (typeof settings.flip === 'boolean') isFlipped = settings.flip;
        if (settings.borderWidth) {
            borderWidthInput.value = settings.borderWidth;
            borderWidthValue.textContent = settings.borderWidth + '%';
        }
        if (settings.borderRadius) {
            borderRadiusInput.value = settings.borderRadius;
            borderRadiusValue.textContent = settings.borderRadius + '%';
        }
        if (settings.borderColor) borderColorInput.value = settings.borderColor;
        updateAllPreviews();
    }

    // 预设背景
    bgPresetSelect.addEventListener('change', () => {
        const src = bgPresetSelect.value;
        console.log('[bgPresetSelect] 选择国旗:', src);
        
        if (src) {
            // 先检查预加载的图像
            if (flagImages[src]) {
                console.log('[bgPresetSelect] 使用已加载的国旗图像:', src);
                bgImg = flagImages[src];
                updateAllPreviews();
            } else {
                // 尝试重新加载
                console.log('[bgPresetSelect] 尝试加载国旗图像:', src);
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = () => {
                    console.log('[bgPresetSelect] 国旗图像加载成功:', src);
                    bgImg = img;
                    flagImages[src] = img; // 缓存图像
                    updateAllPreviews();
                };
                img.onerror = () => {
                    console.error('[bgPresetSelect] 加载国旗失败:', src);
                    alert(`国旗图像无法加载: ${src}，请确保图片文件存在`);
                    bgImg = null;
                    updateAllPreviews();
                };
                img.src = src;
            }
        } else {
            bgImg = null;
            updateAllPreviews();
        }
    });

    // 自定义背景
    bgCustomInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                bgImg = img;
                updateAllPreviews();
            };
            img.onerror = () => { console.error('加载自定义背景失败'); };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // 初始化
    bgTypeSelect.dispatchEvent(new Event('change'));
    exportRatioSelect.dispatchEvent(new Event('change'));
    
    // 初始渲染预览画布
    updateAllPreviews();

    // 折叠面板功能 (保持不变，确保它在所有元素加载后执行)
    const collapsibles = document.querySelectorAll('.collapsible');
    console.log(`Found ${collapsibles.length} collapsible elements.`); 

    collapsibles.forEach((collapsible, index) => {
        const content = collapsible.nextElementSibling; // 获取紧邻的兄弟元素 (即 div.collapse-content)
        if (!content || !content.classList.contains('collapse-content')) {
            console.error('Collapsible element is not immediately followed by a .collapse-content div:', collapsible);
            return; // 如果结构不符合预期，则跳过此项
        }

        // 默认展开第一个面板, 其他折叠
        if (index !== 0) { 
            collapsible.classList.add('collapsed');
            // content.style.display = 'none'; // JS 直接控制隐藏
            content.classList.add('panel-content-hidden');
            content.classList.remove('panel-content-visible');
        } else {
            collapsible.classList.remove('collapsed'); 
            // content.style.setProperty('display', 'block', 'important');
            content.classList.add('panel-content-visible');
            content.classList.remove('panel-content-hidden');
        }
        
        collapsible.addEventListener('click', function() { 
            const currentContent = this.nextElementSibling; 
            if (!currentContent || !currentContent.classList.contains('collapse-content')) {
                console.error('CRITICAL ERROR: Collapsible element clicked, but its immediate next sibling is not a .collapse-content div. Structure might be broken.', this);
                return; 
            }

            console.log(`Collapsible element clicked:`, this.textContent.trim()); 
            this.classList.toggle('collapsed');
            const isCollapsed = this.classList.contains('collapsed');
            console.log(`Header for '${this.textContent.trim()}' is now collapsed: ${isCollapsed}`);
            
            if (isCollapsed) {
                // currentContent.style.setProperty('display', 'none', 'important');
                currentContent.classList.add('panel-content-hidden');
                currentContent.classList.remove('panel-content-visible');
            } else {
                // currentContent.style.setProperty('display', 'block', 'important');
                currentContent.classList.add('panel-content-visible');
                currentContent.classList.remove('panel-content-hidden');
            }

            void currentContent.offsetHeight; 

            console.log(`   Content for '${this.textContent.trim()}' class update attempt. Classes: '${currentContent.className}', ComputedDisplay: '${window.getComputedStyle(currentContent).display}', OffsetHeight: ${currentContent.offsetHeight}`);
        });
    });
    console.log("Collapsible event listeners with class-based manipulation and reflow attempt attached.");
});
