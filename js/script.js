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
    const settingsFileInput = document.getElementById('settingsFileInput');
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
            originalImg = img;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            originalContainer.appendChild(img);
            setupCropBox();
            updateAllPreviews();
        };
    }

    // 设置裁剪框
    function setupCropBox() {
        if (cropBox) cropBox.remove();
        cropBox = document.createElement('div');
        cropBox.className = 'crop-box';
        const w = originalContainer.clientWidth;
        const h = originalContainer.clientHeight;
        const [rw, rh] = exportRatioSelect.value.split(':').map(n => parseFloat(n));
        const aspect = rw / rh;
        let cw, ch;
        if (w / h > aspect) {
            ch = h;
            cw = h * aspect;
        } else {
            cw = w;
            ch = w / aspect;
        }
        // 裁剪框居中
        cropBox.style.left = `${(w - cw) / 2}px`;
        cropBox.style.top = `${(h - ch) / 2}px`;
        cropBox.style.width = `${cw}px`;
        cropBox.style.height = `${ch}px`;
        originalContainer.appendChild(cropBox);
        interact(cropBox).draggable({
            modifiers: [interact.modifiers.restrictRect({ restriction: originalContainer, endOnly: true })],
            listeners: { move: dragMoveListener }
        }).resizable({
            modifiers: [
                interact.modifiers.aspectRatio({ ratio: aspect }),
                interact.modifiers.restrictEdges({ outer: originalContainer, endOnly: true })
            ],
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: { move: resizeMoveListener }
        });
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
        if (!originalImg || !cropBox) return;
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
            console.log('[renderFinalCanvas] Attempting preset background. bgImg:', bgImg);
            if (bgImg && bgImg.complete) {
                const side = Math.max(w, h);
                const dx = (w - side) / 2;
                const dy = (h - side) / 2;
                console.log(`[renderFinalCanvas] Drawing preset image: w=${w}, h=${h}, side=${side}, dx=${dx}, dy=${dy}`);
                try {
                    ctx.drawImage(bgImg, dx, dy, side, side);
                } catch (drawError) {
                    console.error('[renderFinalCanvas] Error drawing preset image:', drawError);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, w, h);
                }
            } else {
                console.warn('[renderFinalCanvas] Preset type selected, but bgImg is invalid or not loaded:', bgImg);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, w, h);
            }
        } else if (type === 'custom' && bgImg && bgImg.complete) {
            console.log('[renderFinalCanvas] Drawing custom image.');
            try {
                ctx.drawImage(bgImg, 0, 0, w, h);
            } catch (drawError) {
                console.error('[renderFinalCanvas] Error drawing custom image:', drawError);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, w, h);
            }
        } else {
            console.warn('[renderFinalCanvas] No valid background condition met or bgImg not ready. Falling back to white.');
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

        // 裁剪并绘制头像
        const dispW2 = originalImg.offsetWidth;
        const dispH2 = originalImg.offsetHeight;
        const natW2 = originalImg.naturalWidth;
        const natH2 = originalImg.naturalHeight;
        const left2 = parseFloat(cropBox.style.left);
        const top2 = parseFloat(cropBox.style.top);
        const width2 = parseFloat(cropBox.style.width);
        const height2 = parseFloat(cropBox.style.height);
        const sx2 = left2 / dispW2 * natW2;
        const sy2 = top2 / dispH2 * natH2;
        const sw2 = width2 / dispW2 * natW2;
        const sh2 = height2 / dispH2 * natH2;
        const cw = w - bw * 2;
        const ch = h - bw * 2;

        ctx.save();
        drawRoundedRect(ctx, bw, bw, cw, ch, Math.max(0, radius - bw));
        ctx.clip();
        ctx.translate(w / 2, h / 2);
        if (isFlipped) ctx.scale(-1, 1);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.drawImage(originalImg, sx2, sy2, sw2, sh2, -cw / 2, -ch / 2, cw, ch);
        ctx.restore();

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
        if (src) {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                bgImg = img;
                console.log('[bgPresetSelect onload] Preset image loaded, bgImg set:', bgImg);
                updateAllPreviews();
            };
            img.onerror = () => {
                console.error('加载国旗失败:', src);
                bgImg = null;
                updateAllPreviews();
            };
            img.src = src;
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
});