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

    // 预设国旗列表（仅保留已有文件）
    const presetFlags = [
        { name: '中国', src: 'Nation/CN.png' },
        { name: '德国', src: 'Nation/DE.png' },
        { name: '法国', src: 'Nation/FR.png' },
        { name: '英国', src: 'Nation/GB.png' },
        { name: '日本', src: 'Nation/JP.png' },
        { name: '韩国', src: 'Nation/KR.png' },
        { name: '朝鲜', src: 'Nation/KP.png' }
    ];
    // 预加载国旗图片
    const flagImages = {};
    presetFlags.forEach(flag => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => { flagImages[flag.src] = img; };
        img.onerror = () => console.error('国旗预加载失败', flag.src);
        img.src = flag.src;
    });
    presetFlags.forEach(flag => {
        const opt = document.createElement('option');
        opt.value = flag.src;
        opt.textContent = flag.name;
        bgPresetSelect.append(opt);
    });
    if (presetFlags.length) {
        bgPresetSelect.value = presetFlags[0].src;
        bgPresetSelect.dispatchEvent(new Event('change'));
    }

    // 国旗搜索
    flagSearchInput.addEventListener('input', () => {
        const kw = flagSearchInput.value.trim().toLowerCase();
        bgPresetSelect.innerHTML = '';
        presetFlags.forEach(flag => {
            if (flag.name.toLowerCase().includes(kw) || flag.src.toLowerCase().includes(kw)) {
                const opt = document.createElement('option');
                opt.value = flag.src;
                opt.textContent = flag.name;
                bgPresetSelect.append(opt);
            }
        });
        if (bgPresetSelect.options.length) {
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
