import './bootstrap';

const slider = document.querySelector('[data-compare-slider]');
const comparePanel = document.querySelector('[data-compare-panel]');
const compareLine = document.querySelector('[data-compare-line]');
const compareHandle = document.querySelector('[data-compare-handle]');
const beforeScene = document.querySelector('[data-before-scene]');
const beforeImage = document.querySelector('[data-before-image]');
const viewerStage = document.querySelector('[data-viewer-stage]');
const splitToggleButton = document.querySelector('[data-split-toggle]');
const afterImage = document.querySelector('[data-after-image]');

const editorInfoStack = document.querySelector('[data-editor-info-stack]');
const editorInfoAi = document.querySelector('[data-editor-info-ai]');
const editorInfoSplit = document.querySelector('[data-editor-info-split]');

const syncEditorInfoPanel = (detail = {}) => {
    if (editorInfoStack && detail.stackVisible !== undefined) {
        const stackMode = detail.stackMode === 'manual' ? 'Manual' : 'Auto';
        editorInfoStack.textContent = detail.stackVisible ? stackMode : 'Tunggal';
    }

    if (editorInfoAi && detail.aiAssist) {
        editorInfoAi.textContent = detail.aiAssist === 'on' ? 'On' : 'Off';
    }

    if (editorInfoSplit && detail.splitMode) {
        editorInfoSplit.textContent = detail.splitMode === 'split' ? 'Aktif' : 'Off';
    }
};

const updateCompare = (value) => {
    if (!comparePanel || !compareLine || !compareHandle) return;

    comparePanel.style.clipPath = `inset(0 0 0 ${value}%)`;
    compareLine.style.left = `${value}%`;
    compareHandle.style.left = `${value}%`;
};

const setViewerMode = (mode) => {
    if (!viewerStage) return;

    viewerStage.classList.remove('viewer-mode-result', 'viewer-mode-split');
    viewerStage.classList.add(`viewer-mode-${mode}`);

    if (splitToggleButton) {
        const isSplitMode = mode === 'split';
        splitToggleButton.classList.toggle('is-active', isSplitMode);
        splitToggleButton.setAttribute('aria-pressed', isSplitMode ? 'true' : 'false');
        splitToggleButton.textContent = isSplitMode ? 'Nonaktifkan Split' : 'Aktifkan Split';
        const splitDetail = { splitMode: isSplitMode ? 'split' : 'result' };
        syncEditorInfoPanel(splitDetail);
    }

    if (mode === 'split' && slider) {
        updateCompare(slider.value);
        return;
    }

    if (comparePanel) {
        comparePanel.style.clipPath = 'inset(0 0 0 0)';
    }
};

if (slider && comparePanel && compareLine && compareHandle) {
    const handleCompareInput = (value) => {
        comparePanel.style.clipPath = `inset(0 0 0 ${value}%)`;
        compareLine.style.left = `${value}%`;
        compareHandle.style.left = `${value}%`;
    };

    handleCompareInput(slider.value);
    slider.addEventListener('input', (event) => handleCompareInput(event.target.value));
}

if (splitToggleButton) {
    splitToggleButton.addEventListener('click', () => {
        const nextMode = viewerStage?.classList.contains('viewer-mode-split') ? 'result' : 'split';
        setViewerMode(nextMode);
    });

    setViewerMode('result');
}

const uploadInput = document.querySelector('[data-upload-input]');
const uploadDropzones = document.querySelectorAll('[data-upload-dropzone]');
const thumbnailStrip = document.querySelector('[data-thumbnail-strip]');
const uploadCount = document.querySelector('[data-upload-count]');
const scrollFrame = document.querySelector('[data-thumbnail-scroll]');
const scrollLeftButton = document.querySelector('[data-scroll-left]');
const scrollRightButton = document.querySelector('[data-scroll-right]');
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
const saveButton = document.querySelector('[data-save-button]');
const resetControlsButton = document.querySelector('[data-reset-controls]');
const rotateLeftButton = document.querySelector('[data-rotate-left]');
const rotateRightButton = document.querySelector('[data-rotate-right]');
const geometryPanel = document.querySelector('[data-geometry-panel]');
const cropOverlay = document.querySelector('[data-crop-overlay]');
const cropFrame = document.querySelector('[data-crop-frame]');
const cropHelper = document.querySelector('[data-crop-helper]');
const cropStartButton = document.querySelector('[data-crop-start]');
const cropActions = document.querySelector('[data-crop-actions]');
const cropApplyButton = document.querySelector('[data-crop-apply]');
const cropCancelButton = document.querySelector('[data-crop-cancel]');
const cropResetButton = document.querySelector('[data-crop-reset]');
const undoButton = document.querySelector('[data-undo-button]');
const redoButton = document.querySelector('[data-redo-button]');
const presetSelect = document.querySelector('[data-preset-select]');
const presetApplyButton = document.querySelector('[data-preset-apply]');
const historyList = document.querySelector('[data-history-list]');
const accordionItems = document.querySelectorAll('[data-accordion-item]');
const accordionTriggers = document.querySelectorAll('[data-accordion-trigger]');
const stackProcessPanel = document.querySelector('[data-stack-process-panel]');
const stackModeSelect = document.querySelector('[data-stack-mode-select]');
const stackModeTrigger = document.querySelector('[data-stack-mode-trigger]');
const stackModeMenu = document.querySelector('[data-stack-mode-menu]');
const stackModeLabel = document.querySelector('[data-stack-mode-label]');
const stackModeChoices = document.querySelectorAll('[data-stack-mode-choice]');
const uploadedTotal = document.querySelector('[data-uploaded-total]');
const selectedTotal = document.querySelector('[data-selected-total]');
const rejectedTotal = document.querySelector('[data-rejected-total]');
const stackControls = document.querySelectorAll('[data-stack-control]');
const conditionalFields = document.querySelectorAll('[data-show-when-field]');
const rangeValueNodes = document.querySelectorAll('[data-range-value-for]');
const toggleStatusNodes = document.querySelectorAll('[data-toggle-status-for]');


if (accordionTriggers.length) {
    accordionTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('[data-accordion-item]');
            if (!item) return;

            const willOpen = !item.classList.contains('is-open');
            accordionItems.forEach((entry) => {
                const isTarget = entry === item;
                entry.classList.toggle('is-open', isTarget ? willOpen : false);
                const entryTrigger = entry.querySelector('[data-accordion-trigger]');
                if (entryTrigger) {
                    entryTrigger.setAttribute('aria-expanded', isTarget && willOpen ? 'true' : 'false');
                }
            });
        });
    });
}

if (scrollFrame && scrollLeftButton && scrollRightButton) {
    const scrollByAmount = () => Math.max(scrollFrame.clientWidth * 0.7, 220);
    scrollLeftButton.addEventListener('click', () => scrollFrame.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' }));
    scrollRightButton.addEventListener('click', () => scrollFrame.scrollBy({ left: scrollByAmount(), behavior: 'smooth' }));
}

if (uploadInput && thumbnailStrip && uploadCount && csrfToken) {
    const uploadedPhotos = [];
    let hasRenderedStack = false;
    let latestRenderedOutput = null;
    let latestBaseResult = null;
    let cachedBaseRenderKey = null;
    let cachedBaseRenderOutput = null;
    let rerenderTimerId = null;
    let cropModeActive = false;
    let cropDraftRect = null;
    let cropPointerState = null;
    let undoStack = [];
    let redoStack = [];
    let historyEntries = [];
    let suppressHistory = false;
    const beforeOverlay = '';
    const resultOverlay = '';
    const defaultCropRect = Object.freeze({ x: 0, y: 0, width: 100, height: 100 });
    const presetMap = {
        natural: {
            edit_light: { exposure: 0, contrast: 0, highlights: 0, shadows: 0, whites: 0, blacks: 0 },
            edit_color: { temperature: 0, tint: 0, vibrance: 0, saturation: 0 },
            edit_detail: { sharpen: 10, noise_reduction: 0 },
        },
        clean: {
            edit_light: { exposure: 6, contrast: 10, highlights: -8, shadows: 8, whites: 4, blacks: -4 },
            edit_color: { temperature: 0, tint: 0, vibrance: 8, saturation: 4 },
            edit_detail: { sharpen: 12, noise_reduction: 8 },
        },
        sharp: {
            edit_light: { exposure: 2, contrast: 12, highlights: -10, shadows: 6, whites: 6, blacks: -8 },
            edit_color: { temperature: 0, tint: 0, vibrance: 6, saturation: 2 },
            edit_detail: { sharpen: 24, noise_reduction: 4 },
        },
        warm: {
            edit_light: { exposure: 4, contrast: 8, highlights: -6, shadows: 5, whites: 4, blacks: -3 },
            edit_color: { temperature: 18, tint: 4, vibrance: 10, saturation: 6 },
            edit_detail: { sharpen: 10, noise_reduction: 2 },
        },
        cool: {
            edit_light: { exposure: 2, contrast: 8, highlights: -6, shadows: 4, whites: 2, blacks: -4 },
            edit_color: { temperature: -16, tint: -4, vibrance: 6, saturation: 0 },
            edit_detail: { sharpen: 10, noise_reduction: 2 },
        },
    };

    const getPhotoCount = () => uploadedPhotos.length;
    const getControlByPath = (path) => document.querySelector(`[data-stack-control="${path}"]`);
    const getRejectedCount = () => uploadedPhotos.filter((photo) => photo.rejected).length;
    const getRenderablePhotos = () => uploadedPhotos.filter((photo) => !photo.rejected);
    const getRenderableSources = () => getRenderablePhotos().map((photo) => photo.previewUrl);
    const getPrimaryPhoto = () => getRenderablePhotos()[0] ?? uploadedPhotos[0] ?? null;
    const getCropControls = () => ({
        x: getControlByPath('edit_geometry.crop_x'),
        y: getControlByPath('edit_geometry.crop_y'),
        width: getControlByPath('edit_geometry.crop_width'),
        height: getControlByPath('edit_geometry.crop_height'),
    });
    const normalizeCropRect = (rect = defaultCropRect) => {
        const width = Math.min(100, Math.max(8, Number(rect.width ?? defaultCropRect.width)));
        const height = Math.min(100, Math.max(8, Number(rect.height ?? defaultCropRect.height)));
        const x = Math.min(100 - width, Math.max(0, Number(rect.x ?? defaultCropRect.x)));
        const y = Math.min(100 - height, Math.max(0, Number(rect.y ?? defaultCropRect.y)));

        return {
            x: Math.round(x * 100) / 100,
            y: Math.round(y * 100) / 100,
            width: Math.round(width * 100) / 100,
            height: Math.round(height * 100) / 100,
        };
    };
    const getCommittedCropRect = () => {
        const controls = getCropControls();

        return normalizeCropRect({
            x: controls.x?.value ?? defaultCropRect.x,
            y: controls.y?.value ?? defaultCropRect.y,
            width: controls.width?.value ?? defaultCropRect.width,
            height: controls.height?.value ?? defaultCropRect.height,
        });
    };
    const setCommittedCropRect = (rect) => {
        const normalized = normalizeCropRect(rect);
        const controls = getCropControls();

        if (controls.x) controls.x.value = `${normalized.x}`;
        if (controls.y) controls.y.value = `${normalized.y}`;
        if (controls.width) controls.width.value = `${normalized.width}`;
        if (controls.height) controls.height.value = `${normalized.height}`;
    };
    const rotateCropRect = (rect, step) => {
        const normalized = normalizeCropRect(rect);
        const turn = ((step % 360) + 360) % 360;

        if (turn === 0) {
            return normalized;
        }

        if (turn === 90) {
            return normalizeCropRect({
                x: 100 - normalized.y - normalized.height,
                y: normalized.x,
                width: normalized.height,
                height: normalized.width,
            });
        }

        if (turn === 180) {
            return normalizeCropRect({
                x: 100 - normalized.x - normalized.width,
                y: 100 - normalized.y - normalized.height,
                width: normalized.width,
                height: normalized.height,
            });
        }

        if (turn === 270) {
            return normalizeCropRect({
                x: normalized.y,
                y: 100 - normalized.x - normalized.width,
                width: normalized.height,
                height: normalized.width,
            });
        }

        return normalized;
    };
    const resetStackControlsToDefault = () => {
        stackControls.forEach((control) => {
            const path = control.dataset.stackControl ?? '';
            if (!(path.startsWith('stack.') || path.startsWith('stack_manual.'))) {
                return;
            }

            const defaultValue = control.dataset.default;
            if (defaultValue == null) return;

            if (control.type === 'checkbox') {
                control.checked = defaultValue === 'on';
                return;
            }

            control.value = defaultValue;
        });
    };


    const updateConditionalFields = () => {
        conditionalFields.forEach((field) => {
            const dependencyPath = field.dataset.showWhenField;
            const expectedValue = field.dataset.showWhenValue;
            const dependency = getControlByPath(dependencyPath);
            const dependencyValue = dependency ? (dependency.type === 'checkbox' ? (dependency.checked ? 'on' : 'off') : dependency.value) : null;
            const isVisible = !dependency || dependencyValue === expectedValue;
            field.classList.toggle('field-hidden', !isVisible);
        });
    };

    const updateRangeValues = () => {
        rangeValueNodes.forEach((node) => {
            const control = getControlByPath(node.dataset.rangeValueFor);
            if (control) {
                node.textContent = control.value;
            }
        });
    };

    const updateToggleLabels = () => {
        toggleStatusNodes.forEach((node) => {
            const control = getControlByPath(node.dataset.toggleStatusFor);
            if (!control) return;

            const checkedLabel = control.dataset.toggleLabelChecked ?? 'On';
            const uncheckedLabel = control.dataset.toggleLabelUnchecked ?? 'Off';
            node.textContent = control.checked ? checkedLabel : uncheckedLabel;
        });
    };

    const renderHistory = () => {
        if (!historyList) return;

        historyList.innerHTML = '';

        if (historyEntries.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'history-empty';
            empty.textContent = 'Belum ada riwayat perubahan.';
            historyList.append(empty);
            return;
        }

        historyEntries.slice(-6).reverse().forEach((entry) => {
            const item = document.createElement('li');
            item.className = 'history-item';

            const title = document.createElement('span');
            title.textContent = entry.label;

            const time = document.createElement('small');
            time.textContent = entry.time;

            item.append(title, time);
            historyList.append(item);
        });
    };

    const updateUndoRedoButtons = () => {
        const shouldEnable = getPhotoCount() > 0 && !cropModeActive;
        if (undoButton) undoButton.disabled = !shouldEnable || undoStack.length <= 1;
        if (redoButton) redoButton.disabled = !shouldEnable || redoStack.length === 0;
    };

    const pushHistoryEntry = (label) => {
        historyEntries.push({
            label,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        });

        if (historyEntries.length > 20) {
            historyEntries = historyEntries.slice(-20);
        }

        renderHistory();
    };

    const serializeControlsState = () => {
        const state = {};
        stackControls.forEach((control) => {
            const path = control.dataset.stackControl;
            if (!path) return;
            state[path] = control.type === 'checkbox' ? (control.checked ? 'on' : 'off') : `${control.value}`;
        });
        return state;
    };

    const statesEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

    const rememberState = (label) => {
        if (suppressHistory) return;

        const snapshot = serializeControlsState();
        const current = undoStack.at(-1);
        if (current && statesEqual(current.state, snapshot)) {
            return;
        }

        undoStack.push({ state: snapshot, label });
        if (undoStack.length > 30) {
            undoStack = undoStack.slice(-30);
        }
        redoStack = [];
        pushHistoryEntry(label);
        updateUndoRedoButtons();
    };

    const resetHistoryState = (label = 'Workspace siap') => {
        const snapshot = serializeControlsState();
        undoStack = [{ state: snapshot, label }];
        redoStack = [];
        historyEntries = [];
        if (getPhotoCount() > 0) {
            pushHistoryEntry(label);
        } else {
            renderHistory();
        }
        updateUndoRedoButtons();
    };

    const applySerializedState = async (state) => {
        suppressHistory = true;
        stackControls.forEach((control) => {
            const path = control.dataset.stackControl;
            if (!path || !(path in state)) return;

            if (control.type === 'checkbox') {
                control.checked = state[path] === 'on';
                return;
            }

            control.value = state[path];
        });

        updateConditionalFields();
        updateRangeValues();
        updateToggleLabels();
        updateStackModeSelect();
        applyAISelection();
        updateSummary();

        if (!hasRenderedStack || getRenderableSources().length === 0) {
            refreshViewerFromPrimaryPhoto();
            suppressHistory = false;
            updateUndoRedoButtons();
            return;
        }

        try {
            await renderStackPreview();
        } finally {
            suppressHistory = false;
            updateUndoRedoButtons();
        }
    };

    const getControlActionLabel = (control) => {
        const path = control.dataset.stackControl ?? '';
        if (path === 'ai_assist.mode') return 'AI Assist diubah';
        if (path === 'stack.mode') return 'Mode stack diubah';

        const field = control.closest('.field');
        const labelNode = field?.querySelector('span');
        const labelText = labelNode?.textContent?.trim();
        return labelText ? `${labelText} diubah` : 'Perubahan editor';
    };

    const closeStackModeMenu = () => {
        if (!stackModeSelect || !stackModeTrigger || !stackModeMenu) return;
        stackModeSelect.classList.remove('is-open');
        stackModeTrigger.setAttribute('aria-expanded', 'false');
        stackModeMenu.hidden = true;
    };

    const updateStackModeSelect = () => {
        const control = getControlByPath('stack.mode');
        const value = control?.value ?? 'auto';
        if (stackModeLabel) {
            stackModeLabel.textContent = value === 'manual' ? 'Manual' : 'Auto';
        }
        stackModeChoices.forEach((choice) => {
            choice.classList.toggle('is-active', choice.dataset.stackModeChoice === value);
        });
    };

    const syncAllControlsToDefault = () => {
        stackControls.forEach((control) => {
            const defaultValue = control.dataset.default;
            if (defaultValue == null) return;

            if (control.type === 'checkbox') {
                control.checked = defaultValue === 'on';
                return;
            }

            control.value = defaultValue;
        });

        cropModeActive = false;
        cropDraftRect = null;
        cropPointerState = null;
        closeStackModeMenu();
        updateConditionalFields();
        updateRangeValues();
        updateToggleLabels();
        updateStackModeSelect();
        setCropModeUi(false);
        setViewerMode('result');
    };

    const updateSummary = () => {
        const totalUploaded = getPhotoCount();
        const totalRejected = getRejectedCount();
        const totalSelected = Math.max(totalUploaded - totalRejected, 0);
        uploadCount.textContent = `${totalUploaded} foto`;

        if (uploadedTotal) uploadedTotal.textContent = `${totalUploaded}`;
        if (selectedTotal) selectedTotal.textContent = `${totalSelected}`;
        if (rejectedTotal) rejectedTotal.textContent = `${totalRejected}`;
        const shouldShowStackPanel = totalUploaded > 1;
        if (!shouldShowStackPanel) {
            resetStackControlsToDefault();
            updateConditionalFields();
            updateRangeValues();
            updateStackModeSelect();
        }

        if (stackProcessPanel) {
            stackProcessPanel.classList.toggle('stack-button-hidden', !shouldShowStackPanel);
            stackProcessPanel.toggleAttribute('hidden', !shouldShowStackPanel);
            stackProcessPanel.setAttribute('aria-hidden', shouldShowStackPanel ? 'false' : 'true');
        }

        const shouldEnableGeometryControls = totalUploaded > 0;
        if (splitToggleButton) {
            splitToggleButton.disabled = !shouldEnableGeometryControls || cropModeActive;
        }
        if (rotateLeftButton) rotateLeftButton.disabled = !shouldEnableGeometryControls;
        if (rotateRightButton) rotateRightButton.disabled = !shouldEnableGeometryControls;
        if (cropStartButton) cropStartButton.disabled = !shouldEnableGeometryControls;
        if (cropApplyButton) cropApplyButton.disabled = !shouldEnableGeometryControls;
        if (cropCancelButton) cropCancelButton.disabled = !shouldEnableGeometryControls;
        if (cropResetButton) cropResetButton.disabled = !shouldEnableGeometryControls;
        if (!shouldEnableGeometryControls && cropModeActive) {
            cropModeActive = false;
            cropDraftRect = null;
            if (cropOverlay) {
                cropOverlay.hidden = true;
                cropOverlay.setAttribute('aria-hidden', 'true');
            }
            if (cropActions) {
                cropActions.hidden = true;
                cropActions.setAttribute('aria-hidden', 'true');
            }
            if (viewerStage) {
                viewerStage.classList.remove('is-crop-mode');
            }
            if (splitToggleButton) {
                splitToggleButton.disabled = false;
            }
        }

        const summaryDetail = {
            uploadedCount: totalUploaded,
            selectedCount: totalSelected,
            rejectedCount: totalRejected,
            stackVisible: shouldShowStackPanel,
            stackMode: getControlByPath('stack.mode')?.value ?? 'auto',
            aiAssist: getControlByPath('ai_assist.mode')?.checked ? 'on' : 'off',
        };

        syncEditorInfoPanel(summaryDetail);
        updateUndoRedoButtons();
    };

    const setViewerImage = (element, imageUrl, overlay) => {
        if (!element || !imageUrl) return;
        const targetImage = element === beforeScene ? beforeImage : (element === comparePanel ? afterImage : null);
        if (targetImage) {
            targetImage.src = imageUrl;
        }
        element.classList.add('has-image');
        element.style.backgroundImage = overlay ? overlay : 'none';
        element.style.backgroundSize = 'cover';
        element.style.backgroundPosition = 'center';
        element.style.backgroundRepeat = 'no-repeat';
        element.style.filter = 'none';
    };

    const setCropModeUi = (isActive) => {
        if (viewerStage) {
            viewerStage.classList.toggle('is-crop-mode', isActive);
        }

        if (cropOverlay) {
            cropOverlay.hidden = !isActive;
            cropOverlay.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        }

        if (cropActions) {
            cropActions.hidden = !isActive;
            cropActions.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        }

        if (cropHelper) {
            cropHelper.hidden = !isActive;
        }

        if (cropStartButton) {
            cropStartButton.textContent = isActive ? 'Sedang Crop' : 'Masuk Mode Crop';
            cropStartButton.disabled = isActive || getPhotoCount() === 0;
        }

        if (splitToggleButton) {
            splitToggleButton.disabled = isActive;
        }

        updateUndoRedoButtons();
    };

    const getViewerImageBounds = () => {
        if (!viewerStage || !afterImage?.naturalWidth || !afterImage?.naturalHeight) {
            return null;
        }

        const stageRect = viewerStage.getBoundingClientRect();
        const imageRatio = afterImage.naturalWidth / afterImage.naturalHeight;
        const stageRatio = stageRect.width / stageRect.height;
        let width = stageRect.width;
        let height = stageRect.height;
        let left = 0;
        let top = 0;

        if (imageRatio > stageRatio) {
            height = width / imageRatio;
            top = (stageRect.height - height) / 2;
        } else {
            width = height * imageRatio;
            left = (stageRect.width - width) / 2;
        }

        return { left, top, width, height };
    };

    const renderCropFrame = () => {
        if (!cropModeActive || !cropOverlay || !cropFrame) return;

        const bounds = getViewerImageBounds();
        if (!bounds) return;

        const rect = normalizeCropRect(cropDraftRect ?? getCommittedCropRect());
        cropDraftRect = rect;
        cropFrame.style.left = `${bounds.left + (bounds.width * rect.x / 100)}px`;
        cropFrame.style.top = `${bounds.top + (bounds.height * rect.y / 100)}px`;
        cropFrame.style.width = `${bounds.width * rect.width / 100}px`;
        cropFrame.style.height = `${bounds.height * rect.height / 100}px`;
    };

    const exitCropMode = async ({ restorePreview = true } = {}) => {
        cropModeActive = false;
        cropDraftRect = null;
        cropPointerState = null;
        setCropModeUi(false);

        if (!restorePreview) return;

        if (!hasRenderedStack || getRenderableSources().length === 0) {
            refreshViewerFromPrimaryPhoto();
            return;
        }

        try {
            await renderStackPreview({ reuseExistingBase: true });
        } catch {
            refreshViewerFromPrimaryPhoto();
        }
    };

    const refreshViewerFromPrimaryPhoto = () => {
        const primaryPhoto = getPrimaryPhoto();

        if (!primaryPhoto) {
            resetViewer();
            return;
        }

        setViewerImage(beforeScene, primaryPhoto.previewUrl, beforeOverlay);
        setViewerImage(comparePanel, hasRenderedStack && latestRenderedOutput ? latestRenderedOutput : primaryPhoto.previewUrl, resultOverlay);

        if (slider) {
            slider.value = '58';
            updateCompare('58');
        }

        setViewerMode('result');
        if (saveButton) saveButton.disabled = !hasRenderedStack;
    };

    const resetViewer = () => {
        syncAllControlsToDefault();
        latestRenderedOutput = null;
        latestBaseResult = null;
        cachedBaseRenderKey = null;
        cachedBaseRenderOutput = null;
        hasRenderedStack = false;
        undoStack = [];
        redoStack = [];
        historyEntries = [];
        if (beforeScene) {
            beforeScene.style.backgroundImage = '';
            beforeScene.classList.remove('has-image');
        }
        if (comparePanel) {
            comparePanel.style.backgroundImage = '';
            comparePanel.classList.remove('has-image');
        }
        if (beforeImage) beforeImage.removeAttribute('src');
        if (afterImage) afterImage.removeAttribute('src');
        if (saveButton) saveButton.disabled = true;
        renderHistory();
        updateUndoRedoButtons();
    };

    const createAutoConfig = (photoCount) => ({
        stack: {
            motionModel: photoCount > 6 ? 'MOTION_AFFINE' : 'MOTION_HOMOGRAPHY',
            numberOfIterations: Math.min(5000, Math.max(1200, 1000 + (photoCount * 260))),
            terminationEpsilon: photoCount > 10 ? 0.0000005 : 0.000001,
            gaussPyramidLayers: photoCount > 8 ? 4 : 3,
            operator: photoCount > 5 ? 'sobel' : 'laplacian',
            kernelSize: photoCount > 8 ? 7 : 5,
            blurType: photoCount > 4 ? 'gaussian' : 'median',
            blurKernelSize: photoCount > 8 ? 5 : 3,
            contrastThreshold: Math.min(28, 6 + photoCount),
            pyramidLevels: Math.min(10, Math.max(4, Math.round(photoCount / 2) + 3)),
            unsharpAmount: photoCount > 6 ? 1.4 : 1.1,
            unsharpRadius: photoCount > 8 ? 1.4 : 1.0,
            unsharpThreshold: photoCount > 8 ? 6 : 4,
            maskErodeSize: 0,
            maskDilateSize: photoCount > 8 ? 2 : 1,
            downsampleFactor: photoCount > 8 ? 0.25 : (photoCount > 4 ? 0.5 : 1.0),
            outputBitDepth: '8-bit',
            outputFormat: 'jpg',
        },
        aiAssist: {
            mode: 'off',
            frameScoring: 'auto_blur_guard',
            denoiseStrength: 42,
            detailBoost: 38,
            haloGuard: 32,
            smartUpscale: photoCount > 8 ? '1.5x' : 'off',
            toneRecovery: 26,
        },
        edit: {
            exposure: 0,
            contrast: 0,
            highlights: 0,
            shadows: 0,
            whites: 0,
            blacks: 0,
            temperature: 0,
            tint: 0,
            vibrance: 0,
            saturation: 0,
            sharpen: 10,
            noiseReduction: 0,
            rotation: 0,
            cropX: 0,
            cropY: 0,
            cropWidth: 100,
            cropHeight: 100,
        },
    });

    const getConfig = () => {
        const values = {};
        const photoCount = Math.max(getPhotoCount(), 1);
        const autoConfig = createAutoConfig(photoCount);

        stackControls.forEach((control) => {
            const path = control.dataset.stackControl.split('.');
            let cursor = values;

            path.forEach((segment, index) => {
                if (index === path.length - 1) {
                    cursor[segment] = control.type === 'checkbox' ? (control.checked ? 'on' : 'off') : control.value;
                    return;
                }

                cursor[segment] ??= {};
                cursor = cursor[segment];
            });
        });

        const aiMode = values.ai_assist?.mode ?? autoConfig.aiAssist.mode;
        const aiAssistEnabled = aiMode === 'on';
        const stackMode = values.stack?.mode ?? 'auto';
        const manualAlignment = Number.parseInt(values.stack_manual?.alignment_strength ?? '55', 10);
        const manualDetail = Number.parseInt(values.stack_manual?.detail_strength ?? '60', 10);
        const manualNoise = Number.parseInt(values.stack_manual?.noise_reduction ?? '35', 10);
        const manualBlurGuard = Number.parseInt(values.stack_manual?.blur_guard ?? '45', 10);
        const manualOutput = Number.parseInt(values.stack_manual?.output_strength ?? '50', 10);

        const stackConfig = {
            ...autoConfig.stack,
            mode: stackMode,
        };

        const aiAssistConfig = {
            mode: aiMode,
            frameScoring: aiAssistEnabled ? autoConfig.aiAssist.frameScoring : 'off',
            denoiseStrength: aiAssistEnabled ? autoConfig.aiAssist.denoiseStrength : 0,
            detailBoost: aiAssistEnabled ? autoConfig.aiAssist.detailBoost : 0,
            haloGuard: aiAssistEnabled ? autoConfig.aiAssist.haloGuard : 0,
            smartUpscale: aiAssistEnabled ? autoConfig.aiAssist.smartUpscale : 'off',
            toneRecovery: aiAssistEnabled ? autoConfig.aiAssist.toneRecovery : 0,
        };

        if (stackMode === 'manual') {
            stackConfig.motionModel = manualAlignment > 70 ? 'MOTION_HOMOGRAPHY' : (manualAlignment > 40 ? 'MOTION_AFFINE' : 'MOTION_TRANSLATION');
            stackConfig.numberOfIterations = 900 + (manualAlignment * 55);
            stackConfig.gaussPyramidLayers = manualAlignment > 66 ? 4 : 3;
            stackConfig.blurType = manualNoise > 55 ? 'gaussian' : 'median';
            stackConfig.blurKernelSize = manualNoise > 66 ? 5 : 3;
            stackConfig.contrastThreshold = Math.max(6, Math.round(6 + (manualBlurGuard / 5)));
            stackConfig.pyramidLevels = Math.max(4, Math.min(10, 4 + Math.round(manualDetail / 18)));
            stackConfig.unsharpAmount = 0.6 + (manualDetail / 40);
            stackConfig.maskDilateSize = manualDetail > 60 ? 2 : 1;
            stackConfig.downsampleFactor = manualOutput > 78 ? 0.5 : 1.0;

            aiAssistConfig.frameScoring = manualBlurGuard > 0 ? 'auto_blur_guard' : 'off';
            aiAssistConfig.denoiseStrength = manualNoise;
            aiAssistConfig.detailBoost = manualDetail;
            aiAssistConfig.haloGuard = Math.max(0, 100 - manualBlurGuard);
            aiAssistConfig.smartUpscale = manualOutput > 72 ? '1.5x' : 'off';
            aiAssistConfig.toneRecovery = Math.round(manualOutput * 0.6);
        }

        return {
            stack: stackConfig,
            edit: {
                exposure: Number.parseInt(values.edit_light?.exposure ?? `${autoConfig.edit.exposure}`, 10),
                contrast: Number.parseInt(values.edit_light?.contrast ?? `${autoConfig.edit.contrast}`, 10),
                highlights: Number.parseInt(values.edit_light?.highlights ?? `${autoConfig.edit.highlights}`, 10),
                shadows: Number.parseInt(values.edit_light?.shadows ?? `${autoConfig.edit.shadows}`, 10),
                whites: Number.parseInt(values.edit_light?.whites ?? `${autoConfig.edit.whites}`, 10),
                blacks: Number.parseInt(values.edit_light?.blacks ?? `${autoConfig.edit.blacks}`, 10),
                temperature: Number.parseInt(values.edit_color?.temperature ?? `${autoConfig.edit.temperature}`, 10),
                tint: Number.parseInt(values.edit_color?.tint ?? `${autoConfig.edit.tint}`, 10),
                vibrance: Number.parseInt(values.edit_color?.vibrance ?? `${autoConfig.edit.vibrance}`, 10),
                saturation: Number.parseInt(values.edit_color?.saturation ?? `${autoConfig.edit.saturation}`, 10),
                sharpen: Number.parseInt(values.edit_detail?.sharpen ?? `${autoConfig.edit.sharpen}`, 10),
                noiseReduction: Number.parseInt(values.edit_detail?.noise_reduction ?? `${autoConfig.edit.noiseReduction}`, 10),
                rotation: Number.parseInt(values.edit_geometry?.rotation ?? `${autoConfig.edit.rotation}`, 10),
                cropX: Number.parseFloat(values.edit_geometry?.crop_x ?? `${autoConfig.edit.cropX}`),
                cropY: Number.parseFloat(values.edit_geometry?.crop_y ?? `${autoConfig.edit.cropY}`),
                cropWidth: Number.parseFloat(values.edit_geometry?.crop_width ?? `${autoConfig.edit.cropWidth}`),
                cropHeight: Number.parseFloat(values.edit_geometry?.crop_height ?? `${autoConfig.edit.cropHeight}`),
            },
            aiAssist: aiAssistConfig,
        };
    };

    const loadImage = (source) => new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = source;
    });

    const analyzeImageSharpness = async (source) => {
        const image = await loadImage(source);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { willReadFrequently: true });
        const width = 160;
        const height = Math.max(90, Math.round((image.naturalHeight / image.naturalWidth) * width));
        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);
        const { data } = context.getImageData(0, 0, width, height);
        let energy = 0;
        let samples = 0;

        for (let y = 1; y < height - 1; y += 1) {
            for (let x = 1; x < width - 1; x += 1) {
                const i = (y * width + x) * 4;
                const center = (data[i] + data[i + 1] + data[i + 2]) / 3;
                const top = (data[i - width * 4] + data[i - width * 4 + 1] + data[i - width * 4 + 2]) / 3;
                const bottom = (data[i + width * 4] + data[i + width * 4 + 1] + data[i + width * 4 + 2]) / 3;
                const left = (data[i - 4] + data[i - 3] + data[i - 2]) / 3;
                const right = (data[i + 4] + data[i + 5] + data[i + 6]) / 3;
                const laplacian = Math.abs((4 * center) - top - bottom - left - right);
                energy += laplacian;
                samples += 1;
            }
        }

        return samples > 0 ? energy / samples : 0;
    };

    const updateThumbVisual = (photo) => {
        if (!photo.card) return;
        const isSource = !photo.rejected && photo === getPrimaryPhoto();
        photo.card.classList.toggle('thumb-rejected', photo.rejected);
        photo.card.classList.toggle('thumb-selected', !photo.rejected);
        photo.card.classList.toggle('thumb-source', isSource);
        if (photo.badge) {
            if (photo.rejected) {
                photo.badge.textContent = 'Reject';
            } else if (isSource) {
                photo.badge.textContent = 'Sumber';
            } else {
                photo.badge.textContent = '';
            }
        }
    };

    const applyAISelection = () => {
        const config = getConfig();
        const mode = config.aiAssist.frameScoring;

        if (mode === 'off') {
            uploadedPhotos.forEach((photo) => {
                photo.rejected = false;
                updateThumbVisual(photo);
            });
            return;
        }

        const scores = uploadedPhotos.map((photo) => photo.sharpnessScore ?? 0);
        const average = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
        const threshold = average * 0.72;

        uploadedPhotos.forEach((photo) => {
            photo.rejected = uploadedPhotos.length > 2 && (photo.sharpnessScore ?? 0) < threshold;
        });

        const selected = uploadedPhotos.filter((photo) => !photo.rejected);
        if (selected.length < 2 && uploadedPhotos.length >= 2) {
            uploadedPhotos
                .slice()
                .sort((a, b) => (b.sharpnessScore ?? 0) - (a.sharpnessScore ?? 0))
                .forEach((photo, index) => {
                    photo.rejected = index > 1;
                });
        }

        uploadedPhotos.forEach(updateThumbVisual);
    };

    const denoiseBlurForSetting = (blurType, aiStrength) => {
        const base = { gaussian: 0.8, median: 1.6, none: 0 }[blurType] ?? 0.8;
        return base + (aiStrength / 65);
    };

    const sharpenAmountForMetric = (focusMetric, focusThreshold, aiDetailBoost) => {
        const metricBase = { laplacian: 0.55, sobel: 0.8 }[focusMetric] ?? 0.55;
        const thresholdBoost = Math.min(Math.max(focusThreshold / 40, 0.2), 1.25);
        return Math.min(metricBase * thresholdBoost + (aiDetailBoost / 110), 2.25);
    };

    const renderScaleFactor = (downsampleFactor) => downsampleFactor;

    const alignmentShift = (config, index) => {
        const iterationBase = Math.max(Math.min(config.numberOfIterations / 2000, 3), 0.25);
        const pyramidBase = Math.max(config.gaussPyramidLayers, 1) * 0.18;
        const epsilonBase = Math.max(Math.log10(1 / Math.max(config.terminationEpsilon, 1.0E-10)) / 10, 0.2);
        const base = iterationBase * pyramidBase * epsilonBase;

        return {
            MOTION_TRANSLATION: { x: index * 0.55 * base, y: -index * 0.3 * base },
            MOTION_EUCLIDEAN: { x: index * 0.3 * base, y: index * 0.3 * base },
            MOTION_AFFINE: { x: -index * 0.45 * base, y: index * 0.35 * base },
            MOTION_HOMOGRAPHY: { x: index * 0.2 * base, y: -index * 0.18 * base },
        }[config.motionModel] ?? { x: 0, y: 0 };
    };

    const warpTransform = (context, config, canvas, index) => {
        if (config.motionModel === 'MOTION_AFFINE') {
            context.translate(canvas.width * 0.5, canvas.height * 0.5);
            context.rotate(((index % 2 === 0 ? 1 : -1) * Math.PI) / 720);
            context.translate(-canvas.width * 0.5, -canvas.height * 0.5);
            return;
        }

        if (config.motionModel === 'MOTION_TRANSLATION') {
            context.translate(index * 0.6, -index * 0.35);
            return;
        }

        if (config.motionModel === 'MOTION_EUCLIDEAN') {
            context.translate(canvas.width * 0.5, canvas.height * 0.5);
            context.rotate(((index % 2 === 0 ? 1 : -1) * Math.PI) / 1100);
            context.translate(-canvas.width * 0.5, -canvas.height * 0.5);
            return;
        }

        context.translate(canvas.width * 0.5, canvas.height * 0.5);
        context.scale(1 + index * 0.002, 1 + index * 0.0014);
        context.translate(-canvas.width * 0.5, -canvas.height * 0.5);
    };

    const applySharpen = (canvas, amount) => {
        if (amount <= 0) return;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        const { width, height } = canvas;
        const imageData = context.getImageData(0, 0, width, height);
        const source = new Uint8ClampedArray(imageData.data);
        const output = imageData.data;
        const strength = amount * 0.35;

        for (let y = 1; y < height - 1; y += 1) {
            for (let x = 1; x < width - 1; x += 1) {
                const i = (y * width + x) * 4;
                for (let c = 0; c < 3; c += 1) {
                    const center = source[i + c];
                    const top = source[i - width * 4 + c];
                    const bottom = source[i + width * 4 + c];
                    const left = source[i - 4 + c];
                    const right = source[i + 4 + c];
                    const value = center + strength * (4 * center - top - bottom - left - right);
                    output[i + c] = Math.max(0, Math.min(255, value));
                }
            }
        }

        context.putImageData(imageData, 0, 0);
    };

    const applyToneRecovery = (canvas, amount) => {
        if (amount <= 0) return;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        const { width, height } = canvas;
        const imageData = context.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        const brightness = amount * 0.35;
        const contrast = 1 + (amount / 220);

        for (let i = 0; i < pixels.length; i += 4) {
            for (let channel = 0; channel < 3; channel += 1) {
                const lifted = ((pixels[i + channel] - 128) * contrast) + 128 + brightness;
                pixels[i + channel] = Math.max(0, Math.min(255, lifted));
            }
        }

        context.putImageData(imageData, 0, 0);
    };

    const upscaleCanvasIfNeeded = async (canvas, upscaleMode) => {
        if (upscaleMode === 'off') {
            return canvas;
        }

        const factor = upscaleMode === '2x' ? 2 : 1.5;
        const output = document.createElement('canvas');
        output.width = Math.round(canvas.width * factor);
        output.height = Math.round(canvas.height * factor);
        const context = output.getContext('2d');
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(canvas, 0, 0, output.width, output.height);
        return output;
    };

    const blendImages = async (photos, config) => {
        const images = await Promise.all(photos.map((photo) => loadImage(photo.previewUrl)));
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const scaleFactor = renderScaleFactor(config.stack.downsampleFactor);
        canvas.width = Math.max(1, Math.round(images[0].naturalWidth * scaleFactor));
        canvas.height = Math.max(1, Math.round(images[0].naturalHeight * scaleFactor));

        context.clearRect(0, 0, canvas.width, canvas.height);

        const blurAmount = denoiseBlurForSetting(config.stack.blurType, config.aiAssist.denoiseStrength)
            + ((config.stack.blurKernelSize - 3) * 0.12);
        const sharpenAmount = sharpenAmountForMetric(config.stack.operator, config.stack.contrastThreshold, config.aiAssist.detailBoost)
            + (config.stack.unsharpAmount * 0.14)
            - (config.aiAssist.haloGuard / 220);
        const alphaBase = Math.max(Math.min(config.stack.pyramidLevels / 10, 1), 0.08)
            * Math.max(0.55, 1 - (config.aiAssist.haloGuard / 180));

        images.forEach((image, index) => {
            context.save();
            context.globalCompositeOperation = config.stack.pyramidLevels > 6 ? 'screen' : 'source-over';
            context.globalAlpha = index === 0 ? 1 : alphaBase / Math.max(images.length - 1, 1);
            context.filter = `blur(${blurAmount}px) contrast(${1 + sharpenAmount * 0.12}) saturate(${1 + config.stack.kernelSize / 45}) brightness(${1 + config.aiAssist.toneRecovery / 500})`;
            const shift = alignmentShift(config.stack, index);
            context.translate(shift.x, shift.y);
            warpTransform(context, config.stack, canvas, index);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            context.restore();
        });

        applySharpen(canvas, sharpenAmount + (config.stack.maskDilateSize * 0.018) - (config.stack.maskErodeSize * 0.014));
        applyToneRecovery(canvas, config.aiAssist.toneRecovery);
        const outputCanvas = await upscaleCanvasIfNeeded(canvas, config.aiAssist.smartUpscale);
        const quality = config.stack.outputBitDepth === '16-bit' ? 1 : 0.92;

        return outputCanvas.toDataURL(`image/${config.stack.outputFormat === 'tiff' ? 'png' : config.stack.outputFormat}`, quality);
    };

    const enhanceSingleImage = async (photo, config) => {
        const image = await loadImage(photo.previewUrl);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const scaleFactor = Math.max(renderScaleFactor(config.stack.downsampleFactor), 1);
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scaleFactor));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scaleFactor));

        const blurAmount = Math.max((denoiseBlurForSetting(config.stack.blurType, config.aiAssist.denoiseStrength) * 0.28) - 0.12, 0);
        const sharpenAmount = Math.max(
            (sharpenAmountForMetric(config.stack.operator, config.stack.contrastThreshold, config.aiAssist.detailBoost) * 0.42)
            - (config.aiAssist.haloGuard / 320),
            0,
        );
        const saturationBoost = 1 + Math.min(config.stack.kernelSize / 90, 0.08);
        const brightnessBoost = 1 + Math.min(config.aiAssist.toneRecovery / 900, 0.06);

        context.save();
        context.filter = `blur(${blurAmount}px) contrast(${1 + sharpenAmount * 0.08}) saturate(${saturationBoost}) brightness(${brightnessBoost})`;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        context.restore();

        applySharpen(canvas, sharpenAmount);
        applyToneRecovery(canvas, Math.round(config.aiAssist.toneRecovery * 0.4));

        const outputCanvas = await upscaleCanvasIfNeeded(canvas, config.aiAssist.smartUpscale);
        const quality = config.stack.outputBitDepth === '16-bit' ? 1 : 0.92;

        return outputCanvas.toDataURL(`image/${config.stack.outputFormat === 'tiff' ? 'png' : config.stack.outputFormat}`, quality);
    };

    const applyGeometryTransforms = async (source, config) => {
        const image = await loadImage(source);
        const rotation = ((config.edit.rotation % 360) + 360) % 360;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { willReadFrequently: true });

        if (rotation === 90 || rotation === 270) {
            canvas.width = image.naturalHeight;
            canvas.height = image.naturalWidth;
        } else {
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
        }

        if (rotation !== 0) {
            context.translate(canvas.width / 2, canvas.height / 2);
            context.rotate((rotation * Math.PI) / 180);
            context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
            context.setTransform(1, 0, 0, 1, 0, 0);
        } else {
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
        }

        const cropRect = normalizeCropRect({
            x: config.edit.cropX,
            y: config.edit.cropY,
            width: config.edit.cropWidth,
            height: config.edit.cropHeight,
        });

        if (
            cropRect.x === defaultCropRect.x
            && cropRect.y === defaultCropRect.y
            && cropRect.width === defaultCropRect.width
            && cropRect.height === defaultCropRect.height
        ) {
            return canvas;
        }

        const cropCanvas = document.createElement('canvas');
        const cropWidth = Math.max(1, Math.round(canvas.width * (cropRect.width / 100)));
        const cropHeight = Math.max(1, Math.round(canvas.height * (cropRect.height / 100)));
        const sourceX = Math.round(canvas.width * (cropRect.x / 100));
        const sourceY = Math.round(canvas.height * (cropRect.y / 100));

        cropCanvas.width = cropWidth;
        cropCanvas.height = cropHeight;
        cropCanvas.getContext('2d').drawImage(
            canvas,
            sourceX,
            sourceY,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight,
        );

        return cropCanvas;
    };

    const applyBasicEdits = async (source, config) => {
        const canvas = await applyGeometryTransforms(source, config);
        const context = canvas.getContext('2d', { willReadFrequently: true });

        const noiseBlur = Math.max(config.edit.noiseReduction / 45, 0);
        if (noiseBlur > 0) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            tempCanvas.getContext('2d').drawImage(canvas, 0, 0);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.filter = `blur(${noiseBlur}px)`;
            context.drawImage(tempCanvas, 0, 0);
            context.filter = 'none';
        }

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        const exposure = config.edit.exposure / 100;
        const contrast = 1 + (config.edit.contrast / 125);
        const highlights = config.edit.highlights / 100;
        const shadows = config.edit.shadows / 100;
        const whites = config.edit.whites / 100;
        const blacks = config.edit.blacks / 100;
        const temperature = config.edit.temperature / 100;
        const tint = config.edit.tint / 100;
        const vibrance = config.edit.vibrance / 100;
        const saturation = config.edit.saturation / 100;

        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i] / 255;
            let g = pixels[i + 1] / 255;
            let b = pixels[i + 2] / 255;
            const luma = (r + g + b) / 3;

            const exposureLift = exposure * 0.35;
            const shadowLift = (1 - luma) * shadows * 0.22;
            const highlightPull = luma * highlights * -0.18;
            const whiteLift = Math.max(0, luma - 0.6) * whites * 0.24;
            const blackPull = Math.max(0, 0.4 - luma) * blacks * -0.24;
            const tonalLift = exposureLift + shadowLift + highlightPull + whiteLift + blackPull;

            r = ((r - 0.5) * contrast) + 0.5 + tonalLift;
            g = ((g - 0.5) * contrast) + 0.5 + tonalLift;
            b = ((b - 0.5) * contrast) + 0.5 + tonalLift;

            r += temperature * 0.12;
            b -= temperature * 0.12;
            g += tint * -0.04;
            r += tint * 0.05;
            b += tint * 0.03;

            const maxChannel = Math.max(r, g, b);
            const avg = (r + g + b) / 3;
            const vibranceFactor = 1 + (vibrance * (1 - (maxChannel - avg)) * 0.45);
            r = avg + ((r - avg) * (1 + saturation * 0.55) * vibranceFactor);
            g = avg + ((g - avg) * (1 + saturation * 0.55) * vibranceFactor);
            b = avg + ((b - avg) * (1 + saturation * 0.55) * vibranceFactor);

            pixels[i] = Math.max(0, Math.min(255, Math.round(r * 255)));
            pixels[i + 1] = Math.max(0, Math.min(255, Math.round(g * 255)));
            pixels[i + 2] = Math.max(0, Math.min(255, Math.round(b * 255)));
        }

        context.putImageData(imageData, 0, 0);
        applySharpen(canvas, config.edit.sharpen / 100);

        return canvas.toDataURL('image/png', 0.96);
    };

    const getBaseRenderKey = (photos, config) => {
        const photoSignature = photos.map((photo) => `${photo.id}:${photo.previewUrl}`).join('|');

        if (photos.length <= 1) {
            return JSON.stringify({
                kind: 'single',
                photoSignature,
                aiAssist: config.aiAssist,
                stack: {
                    blurType: config.stack.blurType,
                    downsampleFactor: config.stack.downsampleFactor,
                    operator: config.stack.operator,
                    contrastThreshold: config.stack.contrastThreshold,
                    outputFormat: config.stack.outputFormat,
                    outputBitDepth: config.stack.outputBitDepth,
                },
            });
        }

        return JSON.stringify({
            kind: 'stack',
            photoSignature,
            stack: config.stack,
            aiAssist: config.aiAssist,
        });
    };

    const getBaseResult = async (photos, config) => {
        if (photos.length === 0) {
            return null;
        }

        const cacheKey = getBaseRenderKey(photos, config);
        if (cachedBaseRenderKey === cacheKey && cachedBaseRenderOutput) {
            return cachedBaseRenderOutput;
        }

        const primaryPhoto = photos[0];
        const baseResult = photos.length === 1
            ? (config.aiAssist.mode === 'on' ? await enhanceSingleImage(primaryPhoto, config) : primaryPhoto.previewUrl)
            : await blendImages(photos, config);

        cachedBaseRenderKey = cacheKey;
        cachedBaseRenderOutput = baseResult;

        return baseResult;
    };

    const renderFinalResult = async (baseResult, config) => {
        const finalResult = await applyBasicEdits(baseResult, config);
        setViewerImage(comparePanel, finalResult, resultOverlay);
        latestRenderedOutput = finalResult;

        if (slider) {
            slider.value = '58';
            updateCompare('58');
        }

        setViewerMode('result');
        hasRenderedStack = true;
        if (saveButton) saveButton.disabled = false;
    };

    const renderStackPreview = async ({ reuseExistingBase = false } = {}) => {
        const config = getConfig();
        if (!reuseExistingBase) {
            applyAISelection();
            updateSummary();
        }

        const renderablePhotos = getRenderablePhotos();
        if (renderablePhotos.length === 0) {
            resetViewer();
            return;
        }

        const primaryPhoto = renderablePhotos[0] ?? getPrimaryPhoto();
        const baseResult = reuseExistingBase && latestBaseResult
            ? latestBaseResult
            : await getBaseResult(renderablePhotos, config);
        const beforeSource = primaryPhoto?.previewUrl ?? baseResult;
        const beforeResult = await applyGeometryTransforms(beforeSource, config);

        setViewerImage(beforeScene, beforeResult.toDataURL('image/png', 0.96), beforeOverlay);
        latestBaseResult = baseResult;
        await renderFinalResult(baseResult, config);
    };

    const deleteStoredPhoto = async (storedPath) => {
        if (!storedPath || !uploadInput.dataset.deleteEndpoint) {
            return;
        }

        const response = await fetch(uploadInput.dataset.deleteEndpoint, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ path: storedPath }),
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(payload?.message ?? 'File di storage belum bisa dihapus.');
        }

        return payload;
    };

    const removePhoto = async (photoId) => {
        const targetIndex = uploadedPhotos.findIndex((photo) => photo.id === photoId);
        if (targetIndex === -1) return;
        const target = uploadedPhotos[targetIndex];
        await deleteStoredPhoto(target.storedPath);

        const [removed] = uploadedPhotos.splice(targetIndex, 1);
        removed.card?.remove();
        if (removed.previewUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(removed.previewUrl);
        }

        applyAISelection();
        updateSummary();

        if (uploadedPhotos.length === 0) {
            resetViewer();
            return;
        }

        if (hasRenderedStack) {
            try {
                await renderStackPreview();
            } catch (error) {
                window.alert('Preview stacking belum bisa dirender ulang setelah foto dihapus.');
            }
            return;
        }

        refreshViewerFromPrimaryPhoto();
    };

    const createCard = (photo, index, photoId) => {
        const card = document.createElement('article');
        card.className = 'thumb thumb-selected';
        card.style.setProperty('--thumb-accent', photo.accent ?? '#3dd7ff');
        card.dataset.photoId = photoId;

        const preview = document.createElement('div');
        preview.className = 'thumb-image';

        const image = document.createElement('img');
        image.className = 'thumb-photo';
        image.alt = photo.name ?? photo.label ?? `IMG ${index + 1}`;
        image.src = photo.previewUrl ?? photo.url;

        const badge = document.createElement('span');
        badge.className = 'thumb-badge';
        badge.textContent = '';
        photo.badge = badge;

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'thumb-delete';
        deleteButton.setAttribute('aria-label', `Hapus ${photo.name ?? photo.label ?? `IMG ${index + 1}`}`);
        deleteButton.textContent = 'x';
        deleteButton.addEventListener('click', async (event) => {
            event.preventDefault();
            event.stopPropagation();

            try {
                await removePhoto(photoId);
            } catch (error) {
                window.alert(error.message);
            }
        });

        preview.append(image, badge, deleteButton);

        const label = document.createElement('span');
        label.textContent = photo.name ?? photo.label ?? `IMG ${index + 1}`;

        card.append(preview, label);
        photo.card = card;
        updateThumbVisual(photo);

        return card;
    };

    const uploadFiles = async (fileList) => {
        const files = Array.from(fileList ?? []).filter((file) => file.type.startsWith('image/'));
        if (files.length === 0) return;
        const wasEmpty = uploadedPhotos.length === 0;

        const formData = new FormData();
        files.forEach((file) => formData.append('photos[]', file));
        uploadInput.disabled = true;

        try {
            const response = await fetch(uploadInput.dataset.uploadEndpoint, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': csrfToken, Accept: 'application/json' },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload gagal diproses.');
            }

            const result = await response.json();
            const additions = await Promise.all(result.photos.map(async (photo, index) => {
                const previewUrl = URL.createObjectURL(files[index]);
                const sharpnessScore = await analyzeImageSharpness(previewUrl);
                return {
                    id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
                    previewUrl,
                    storedPath: photo.path,
                    name: files[index].name,
                    label: photo.label,
                    accent: photo.accent,
                    url: photo.url,
                    sharpnessScore,
                    rejected: false,
                };
            }));

            additions.forEach((photo, index) => {
                const card = createCard(photo, uploadedPhotos.length + index, photo.id);
                photo.card = card;
                uploadedPhotos.push(photo);
                thumbnailStrip.append(card);
            });

            applyAISelection();
            updateSummary();
            updateConditionalFields();
            updateRangeValues();
            refreshViewerFromPrimaryPhoto();

            if (scrollFrame) {
                scrollFrame.scrollTo({ left: scrollFrame.scrollWidth, behavior: 'smooth' });
            }

            await renderStackPreview();
            if (wasEmpty) {
                resetHistoryState('Foto dimuat');
            } else {
                rememberState('Foto ditambahkan');
            }
        } catch (error) {
            window.alert(error.message);
        } finally {
            uploadInput.disabled = false;
            uploadInput.value = '';
        }
    };

    uploadInput.addEventListener('change', async (event) => {
        await uploadFiles(event.target.files);
    });

    if (uploadDropzones.length) {
        const setDragState = (isActive) => {
            uploadDropzones.forEach((zone) => {
                zone.classList.toggle('is-dragover', isActive);
            });
        };

        ['dragenter', 'dragover', 'drop'].forEach((eventName) => {
            window.addEventListener(eventName, (event) => {
                event.preventDefault();
            });
        });

        ['dragenter', 'dragover'].forEach((eventName) => {
            uploadDropzones.forEach((zone) => {
                zone.addEventListener(eventName, (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.dataTransfer) {
                        event.dataTransfer.dropEffect = 'copy';
                    }
                    setDragState(true);
                });
            });
        });

        ['dragleave', 'dragend'].forEach((eventName) => {
            uploadDropzones.forEach((zone) => {
                zone.addEventListener(eventName, (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.relatedTarget && zone.contains(event.relatedTarget)) {
                        return;
                    }
                    setDragState(false);
                });
            });
        });

        uploadDropzones.forEach((zone) => {
            zone.addEventListener('drop', async (event) => {
                event.preventDefault();
                event.stopPropagation();
                setDragState(false);
                await uploadFiles(event.dataTransfer?.files);
            });
        });
    }

    if (saveButton) {
        saveButton.addEventListener('click', () => {
            if (!latestRenderedOutput) {
                window.alert('Buat hasil stacking terlebih dahulu sebelum menyimpan.');
                return;
            }

            const config = getConfig();
            const extension = config.stack.outputFormat === 'tiff' ? 'png' : config.stack.outputFormat;
            const link = document.createElement('a');
            link.href = latestRenderedOutput;
            link.download = `stackforge-ai-result-${Date.now()}.${extension}`;
            link.click();
        });
    }


    const resetControlsToDefault = async () => {
        syncAllControlsToDefault();
        applyAISelection();
        updateSummary();

        if (!hasRenderedStack || getRenderableSources().length === 0) {
            refreshViewerFromPrimaryPhoto();
            return;
        }

        try {
            await renderStackPreview();
            rememberState('Reset kontrol');
        } catch {
            window.alert('Kontrol belum bisa dikembalikan ke default.');
        }
    };

    const rerenderIfNeeded = async ({ editOnly = false } = {}) => {
        updateConditionalFields();
        updateRangeValues();
        updateToggleLabels();
        updateStackModeSelect();
        if (!editOnly) {
            applyAISelection();
            updateSummary();
        }

        if (!hasRenderedStack || getRenderableSources().length === 0) {
            return;
        }

        try {
            await renderStackPreview({ reuseExistingBase: editOnly });
        } catch {
            window.alert('Perubahan konfigurasi belum bisa dirender ke preview.');
        }
    };

    const scheduleRerender = (delay = 140, options = {}) => {
        if (rerenderTimerId) {
            window.clearTimeout(rerenderTimerId);
        }

        rerenderTimerId = window.setTimeout(async () => {
            rerenderTimerId = null;
            await rerenderIfNeeded(options);
        }, delay);
    };

    const startCropMode = async () => {
        if (getPhotoCount() === 0 || cropModeActive) return;

        const config = getConfig();
        const cropPreviewConfig = {
            ...config,
            edit: {
                ...config.edit,
                cropX: defaultCropRect.x,
                cropY: defaultCropRect.y,
                cropWidth: defaultCropRect.width,
                cropHeight: defaultCropRect.height,
            },
        };
        const cropSource = latestBaseResult ?? getPrimaryPhoto()?.previewUrl;
        if (!cropSource) return;

        const previewCanvas = await applyGeometryTransforms(cropSource, cropPreviewConfig);
        const previewUrl = previewCanvas.toDataURL('image/png', 0.96);
        setViewerMode('result');
        setViewerImage(beforeScene, previewUrl, beforeOverlay);
        setViewerImage(comparePanel, previewUrl, resultOverlay);
        await loadImage(previewUrl);
        cropDraftRect = getCommittedCropRect();
        cropModeActive = true;
        setCropModeUi(true);
        renderCropFrame();
    };

    const applyCropRectFromPixels = (pixelRect, bounds) => {
        cropDraftRect = normalizeCropRect({
            x: ((pixelRect.left - bounds.left) / bounds.width) * 100,
            y: ((pixelRect.top - bounds.top) / bounds.height) * 100,
            width: (pixelRect.width / bounds.width) * 100,
            height: (pixelRect.height / bounds.height) * 100,
        });
        renderCropFrame();
    };

    if (resetControlsButton) {
        resetControlsButton.addEventListener('click', async () => {
            if (cropModeActive) {
                await exitCropMode({ restorePreview: false });
            }
            await resetControlsToDefault();
        });
    }

    if (cropOverlay && cropFrame) {
        cropOverlay.addEventListener('pointerdown', (event) => {
            if (!cropModeActive) return;

            const bounds = getViewerImageBounds();
            if (!bounds) return;

            const frameRect = cropFrame.getBoundingClientRect();
            const target = event.target;
            const handle = target instanceof HTMLElement ? target.dataset.cropHandle ?? null : null;

            cropPointerState = {
                mode: handle ?? 'move',
                startX: event.clientX,
                startY: event.clientY,
                bounds,
                rect: {
                    left: frameRect.left - viewerStage.getBoundingClientRect().left,
                    top: frameRect.top - viewerStage.getBoundingClientRect().top,
                    width: frameRect.width,
                    height: frameRect.height,
                },
            };

            cropFrame.setPointerCapture?.(event.pointerId);
            event.preventDefault();
        });

        window.addEventListener('pointermove', (event) => {
            if (!cropModeActive || !cropPointerState) return;

            const minSize = 48;
            const dx = event.clientX - cropPointerState.startX;
            const dy = event.clientY - cropPointerState.startY;
            const { bounds } = cropPointerState;
            let nextRect = { ...cropPointerState.rect };
            if (cropPointerState.mode === 'move') {
                nextRect.left = Math.min(bounds.left + bounds.width - nextRect.width, Math.max(bounds.left, nextRect.left + dx));
                nextRect.top = Math.min(bounds.top + bounds.height - nextRect.height, Math.max(bounds.top, nextRect.top + dy));
            } else {
                const right = cropPointerState.rect.left + cropPointerState.rect.width;
                const bottom = cropPointerState.rect.top + cropPointerState.rect.height;
                if (cropPointerState.mode.includes('n')) {
                    nextRect.top = Math.min(bottom - minSize, Math.max(bounds.top, cropPointerState.rect.top + dy));
                    nextRect.height = bottom - nextRect.top;
                }
                if (cropPointerState.mode.includes('s')) {
                    nextRect.height = Math.max(minSize, Math.min(bounds.top + bounds.height, bottom + dy) - cropPointerState.rect.top);
                }
                if (cropPointerState.mode.includes('w')) {
                    nextRect.left = Math.min(right - minSize, Math.max(bounds.left, cropPointerState.rect.left + dx));
                    nextRect.width = right - nextRect.left;
                }
                if (cropPointerState.mode.includes('e')) {
                    nextRect.width = Math.max(minSize, Math.min(bounds.left + bounds.width, right + dx) - cropPointerState.rect.left);
                }
            }

            applyCropRectFromPixels(nextRect, bounds);
        });

        window.addEventListener('pointerup', () => {
            cropPointerState = null;
        });
    }

    window.addEventListener('resize', () => {
        if (cropModeActive) {
            renderCropFrame();
        }
    });

    window.addEventListener('keydown', async (event) => {
        if (!cropModeActive) return;

        if (event.key === 'Escape') {
            event.preventDefault();
            await exitCropMode();
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            if (!cropDraftRect) return;
            setCommittedCropRect(cropDraftRect);
            await exitCropMode({ restorePreview: false });
            await rerenderIfNeeded({ editOnly: true });
        }
    });

    if (cropStartButton) {
        cropStartButton.addEventListener('click', async () => {
            await startCropMode();
        });
    }

    if (cropResetButton) {
        cropResetButton.addEventListener('click', () => {
            if (!cropModeActive) return;
            cropDraftRect = { ...defaultCropRect };
            renderCropFrame();
        });
    }

    if (cropCancelButton) {
        cropCancelButton.addEventListener('click', async () => {
            await exitCropMode();
        });
    }

    if (cropApplyButton) {
        cropApplyButton.addEventListener('click', async () => {
            if (!cropModeActive || !cropDraftRect) return;
            setCommittedCropRect(cropDraftRect);
            await exitCropMode({ restorePreview: false });
            await rerenderIfNeeded({ editOnly: true });
            rememberState('Crop diterapkan');
        });
    }

    const applyRotationStep = async (step) => {
        if (getPhotoCount() === 0) return;

        const control = getControlByPath('edit_geometry.rotation');
        if (!control) return;

        const current = Number.parseInt(control.value ?? '0', 10) || 0;
        let next = current + step;
        if (next > 270) next = 0;
        if (next < -270) next = 0;

        const currentCropRect = cropModeActive && cropDraftRect ? cropDraftRect : getCommittedCropRect();
        const rotatedCropRect = rotateCropRect(currentCropRect, step);
        setCommittedCropRect(rotatedCropRect);
        if (cropModeActive) {
            cropDraftRect = rotatedCropRect;
        }

        control.value = `${next}`;
        updateRangeValues();
        if (cropModeActive) {
            await exitCropMode({ restorePreview: false });
        }
        await rerenderIfNeeded({ editOnly: true });
        rememberState(step > 0 ? 'Putar kanan' : 'Putar kiri');
    };

    if (rotateLeftButton) {
        rotateLeftButton.addEventListener('click', async () => {
            await applyRotationStep(-90);
        });
    }

    if (rotateRightButton) {
        rotateRightButton.addEventListener('click', async () => {
            await applyRotationStep(90);
        });
    }

    if (presetApplyButton && presetSelect) {
        presetApplyButton.addEventListener('click', async () => {
            if (getPhotoCount() === 0) return;

            const presetKey = presetSelect.value;
            const preset = presetMap[presetKey];
            if (!preset) return;

            Object.entries(preset).forEach(([group, fields]) => {
                Object.entries(fields).forEach(([field, value]) => {
                    const control = getControlByPath(`${group}.${field}`);
                    if (control) {
                        control.value = `${value}`;
                    }
                });
            });

            updateRangeValues();
            await rerenderIfNeeded({ editOnly: true });
            rememberState(`Preset ${presetKey} diterapkan`);
        });
    }

    if (undoButton) {
        undoButton.addEventListener('click', async () => {
            if (undoStack.length <= 1) return;

            const current = undoStack.pop();
            redoStack.push(current);
            const previous = undoStack.at(-1);
            if (!previous) return;

            await applySerializedState(previous.state);
            pushHistoryEntry(`Undo: ${current.label}`);
            updateUndoRedoButtons();
        });
    }

    if (redoButton) {
        redoButton.addEventListener('click', async () => {
            const next = redoStack.pop();
            if (!next) return;

            undoStack.push(next);
            await applySerializedState(next.state);
            pushHistoryEntry(`Redo: ${next.label}`);
            updateUndoRedoButtons();
        });
    }

    if (stackModeTrigger && stackModeMenu && stackModeSelect) {
        stackModeTrigger.addEventListener('click', () => {
            const willOpen = stackModeMenu.hidden;
            if (!willOpen) {
                closeStackModeMenu();
                return;
            }
            stackModeSelect.classList.add('is-open');
            stackModeTrigger.setAttribute('aria-expanded', 'true');
            stackModeMenu.hidden = false;
        });

        stackModeChoices.forEach((choice) => {
            choice.addEventListener('click', async () => {
                const control = getControlByPath('stack.mode');
                if (!control) return;
                control.value = choice.dataset.stackModeChoice ?? 'auto';
                updateStackModeSelect();
                closeStackModeMenu();
                await rerenderIfNeeded();
                rememberState(`Mode stack ${control.value === 'manual' ? 'manual' : 'auto'}`);
            });
        });

        document.addEventListener('click', (event) => {
            if (!stackModeSelect.contains(event.target)) {
                closeStackModeMenu();
            }
        });
    }

    stackControls.forEach((control) => {
        const path = control.dataset.stackControl ?? '';
        const isHeavyStackControl = path.startsWith('stack_manual.') || path === 'stack.mode';
        const isEditOnlyControl = path.startsWith('edit_');

        control.addEventListener('input', () => {
            scheduleRerender(isHeavyStackControl ? 220 : 120, { editOnly: isEditOnlyControl });
        });

        control.addEventListener('change', async () => {
            if (rerenderTimerId) {
                window.clearTimeout(rerenderTimerId);
                rerenderTimerId = null;
            }

            await rerenderIfNeeded({ editOnly: isEditOnlyControl });
            if (!path.startsWith('edit_geometry.') && path !== 'stack.mode') {
                rememberState(getControlActionLabel(control));
            }
        });
    });

    updateConditionalFields();
    updateRangeValues();
    updateToggleLabels();
    updateStackModeSelect();
    updateSummary();
    refreshViewerFromPrimaryPhoto();
    renderHistory();
}
