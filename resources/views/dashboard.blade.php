<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Rona Studio | Editor Foto & Focus Stack</title>
        <meta
            name="description"
            content="Rona Studio adalah editor foto berbasis web untuk edit tunggal, focus stack multi-frame, compare, crop, rotate, dan preset ringan."
        >
        @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
            @vite(['resources/css/app.css', 'resources/js/app.js'])
        @else
            <style>
                :root {
                    --bg: #07111a;
                    --bg-soft: #0e1b26;
                    --panel: rgba(10, 18, 27, 0.88);
                    --panel-strong: rgba(12, 21, 31, 0.94);
                    --line: rgba(72, 214, 255, 0.3);
                    --text: #f4f7fb;
                    --muted: #8ea7ba;
                    --cyan: #3dd7ff;
                    --gold: #f1c34b;
                    --blue: #1d82ff;
                    --shadow: 0 25px 80px rgba(0, 0, 0, 0.35);
                }

                * {
                    box-sizing: border-box;
                }

                body.focusforge-shell {
                    margin: 0;
                    min-height: 100vh;
                    font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
                    color: var(--text);
                    background:
                        radial-gradient(circle at top left, rgba(61, 215, 255, 0.12), transparent 28%),
                        radial-gradient(circle at right 10%, rgba(241, 195, 75, 0.12), transparent 18%),
                        linear-gradient(135deg, #04080c 0%, #09131d 45%, #07141c 100%);
                }

                .orb {
                    position: fixed;
                    width: 22rem;
                    height: 22rem;
                    border-radius: 999px;
                    filter: blur(70px);
                    opacity: 0.28;
                    pointer-events: none;
                }

                .orb-left {
                    top: -5rem;
                    left: -4rem;
                    background: #00c2ff;
                }

                .orb-right {
                    right: -6rem;
                    bottom: 4rem;
                    background: #ffb703;
                }

                .page {
                    position: relative;
                    z-index: 1;
                    width: min(100%, 1480px);
                    margin: 0 auto;
                    padding: 0.65rem;
                }

                .workspace {
                    background: var(--panel);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    box-shadow: var(--shadow);
                    backdrop-filter: blur(18px);
                    padding: 1.2rem;
                    border-radius: 30px;
                }

                .eyebrow,
                .brand,
                .panel-title {
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    font-size: 0.73rem;
                    font-weight: 700;
                }

                .brand {
                    color: var(--cyan);
                    margin: 0 0 0.4rem;
                }

                .facts,
                .field span {
                    color: var(--muted);
                }

                .chip {
                    border: 1px solid rgba(61, 215, 255, 0.22);
                    background: rgba(61, 215, 255, 0.08);
                    color: #dff9ff;
                    border-radius: 999px;
                    padding: 0.55rem 0.9rem;
                    font-size: 0.88rem;
                }

                .workspace-header {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    margin-bottom: 1rem;
                }

                .workspace-header h2 {
                    margin: 0.1rem 0 0;
                    font-size: clamp(1.45rem, 2.8vw, 2rem);
                }

                .studio {
                    display: grid;
                    grid-template-columns: minmax(0, 1.72fr) minmax(15.2rem, 0.66fr);
                    gap: 1rem;
                    align-items: start;
                }

                .viewer-panel {
                    min-width: 0;
                    padding: 0.85rem;
                    border-radius: 26px;
                    background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.015));
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .viewer-stage {
                    position: relative;
                    overflow: hidden;
                    min-height: clamp(20.8rem, 50vw, 32rem);
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    background: #05090d;
                }

                .viewer-mode-bar {
                    display: flex;
                    justify-content: center;
                    gap: 0.55rem;
                    margin-top: 0.75rem;
                    margin-bottom: 0.15rem;
                }

                .viewer-mode-button {
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.04);
                    color: var(--muted);
                    border-radius: 999px;
                    padding: 0.5rem 0.9rem;
                    font: inherit;
                    font-size: 0.82rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background 160ms ease, color 160ms ease, border-color 160ms ease, transform 160ms ease;
                }

                .viewer-mode-button:hover {
                    color: var(--text);
                    transform: translateY(-1px);
                }

                .viewer-mode-button.is-active {
                    color: #061018;
                    border-color: rgba(61, 215, 255, 0.55);
                    background: linear-gradient(135deg, rgba(61, 215, 255, 0.95), rgba(150, 237, 255, 0.92));
                    box-shadow: 0 10px 24px rgba(61, 215, 255, 0.16);
                }

                .viewer-scene {
                    position: absolute;
                    inset: 0;
                    transition: opacity 180ms ease, clip-path 180ms ease, transform 180ms ease;
                }

                .before-scene,
                .after-scene {
                    background-size: cover, contain;
                    background-position: center, center;
                    background-repeat: no-repeat, no-repeat;
                }

                .before-scene {
                    background-image:
                        linear-gradient(180deg, rgba(7, 17, 26, 0.1), rgba(7, 17, 26, 0.6)),
                        radial-gradient(circle at 30% 25%, rgba(120, 163, 61, 0.65), transparent 30%),
                        radial-gradient(circle at 68% 22%, rgba(79, 130, 24, 0.75), transparent 26%),
                        radial-gradient(circle at 52% 62%, rgba(10, 178, 184, 0.92), transparent 16%),
                        linear-gradient(160deg, #496b2e 0%, #6b8b38 20%, #84a744 35%, #4a5f1e 58%, #1a2312 100%);
                    filter: blur(3px) saturate(0.9);
                }

                .after-scene {
                    clip-path: inset(0 0 0 0);
                    background-image:
                        linear-gradient(180deg, rgba(7, 17, 26, 0.08), rgba(7, 17, 26, 0.38)),
                        radial-gradient(circle at 29% 22%, rgba(115, 171, 44, 0.72), transparent 26%),
                        radial-gradient(circle at 70% 20%, rgba(65, 130, 18, 0.82), transparent 24%),
                        radial-gradient(circle at 52% 48%, rgba(23, 218, 206, 0.98), transparent 12%),
                        radial-gradient(circle at 58% 58%, rgba(255, 193, 7, 0.78), transparent 7%),
                        linear-gradient(160deg, #5c7e2f 0%, #8eb14b 20%, #8db320 33%, #475c17 57%, #1b260f 100%);
                }

                .scene-caption {
                    position: absolute;
                    top: 1rem;
                    left: 1rem;
                    padding: 0.45rem 0.7rem;
                    border-radius: 999px;
                    background: rgba(5, 9, 13, 0.6);
                    font-size: 0.82rem;
                }

                .compare-slider {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    cursor: col-resize;
                }

                .compare-line {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 58%;
                    width: 2px;
                    background: rgba(255, 255, 255, 0.9);
                    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
                }

                .compare-handle {
                    position: absolute;
                    top: 50%;
                    left: 58%;
                    display: grid;
                    place-items: center;
                    width: 2.8rem;
                    height: 4.2rem;
                    border-radius: 999px;
                    background: white;
                    color: #0b1520;
                    font-weight: 900;
                    transform: translate(-50%, -50%);
                }

                .compare-label {
                    position: absolute;
                    left: 50%;
                    bottom: 1rem;
                    transform: translateX(-50%);
                    border-radius: 999px;
                    padding: 0.55rem 0.85rem;
                    background: rgba(0, 0, 0, 0.58);
                    font-size: 0.84rem;
                }

                .viewer-stage.viewer-mode-result .before-scene {
                    opacity: 0;
                    transform: scale(1.01);
                }

                .viewer-stage.viewer-mode-result .after-scene {
                    clip-path: inset(0 0 0 0);
                }

                .viewer-stage:not(.viewer-mode-split) .compare-slider,
                .viewer-stage:not(.viewer-mode-split) .compare-line,
                .viewer-stage:not(.viewer-mode-split) .compare-handle,
                .viewer-stage:not(.viewer-mode-split) .compare-label {
                    opacity: 0;
                    pointer-events: none;
                }

                .upload-section {
                    margin-top: 0.75rem;
                    padding-top: 0.55rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.06);
                }

                .upload-toolbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    margin-bottom: 0.6rem;
                }

                .upload-title {
                    margin: 0 0 0.2rem;
                    font-size: 0.88rem;
                    font-weight: 700;
                }

                .upload-caption {
                    margin: 0;
                    color: var(--muted);
                    font-size: 0.78rem;
                    max-width: 42rem;
                }

                .upload-actions {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }

                .upload-count {
                    color: #dff9ff;
                    font-size: 0.84rem;
                }

                .upload-input {
                    display: none;
                }

                .thumbnail-shell {
                    display: grid;
                    grid-template-columns: auto 1fr auto;
                    gap: 0.5rem;
                    align-items: center;
                }

                .scroll-button {
                    width: 2.35rem;
                    height: 2.35rem;
                    border: 1px solid rgba(61, 215, 255, 0.22);
                    border-radius: 999px;
                    background: rgba(8, 18, 29, 0.92);
                    color: #e8fbff;
                    font-size: 1.2rem;
                    cursor: pointer;
                }

                .thumbnail-scroll {
                    overflow-x: auto;
                    padding: 0.1rem 0 0.3rem;
                    scrollbar-width: none;
                }

                .thumbnail-scroll::-webkit-scrollbar {
                    display: none;
                }

                .thumbnail-strip {
                    display: flex;
                    gap: 0.8rem;
                    min-width: max-content;
                }

                .upload-tile,
                .thumb {
                    width: 5.3rem;
                    flex: 0 0 5.3rem;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 0.3rem;
                    background: rgba(255, 255, 255, 0.03);
                }

                .upload-tile {
                    display: flex;
                    min-height: 5.8rem;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0.28rem;
                    padding: 0.38rem;
                    border: 1px dashed rgba(61, 215, 255, 0.35);
                    border-radius: 18px;
                    background:
                        linear-gradient(180deg, rgba(61, 215, 255, 0.1), rgba(61, 215, 255, 0.03)),
                        rgba(255, 255, 255, 0.03);
                    text-align: center;
                    cursor: pointer;
                }

                .upload-tile-icon {
                    display: grid;
                    place-items: center;
                    width: 1.3rem;
                    height: 1.3rem;
                    border-radius: 999px;
                    background: rgba(61, 215, 255, 0.16);
                    color: var(--cyan);
                    font-size: 1rem;
                    font-weight: 700;
                }

                .upload-tile strong {
                    font-size: 0.64rem;
                }

                .upload-tile small {
                    color: var(--muted);
                    font-size: 0.54rem;
                    line-height: 1.2;
                }

                .thumb-image {
                    position: relative;
                    overflow: hidden;
                    height: 3.9rem;
                    border-radius: 12px;
                    background:
                        radial-gradient(circle at 60% 35%, rgba(25, 230, 205, 0.7), transparent 14%),
                        linear-gradient(135deg, #263318 0%, #456a26 44%, #22300f 100%);
                }

                .thumb-photo {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                .thumb-cross {
                    position: absolute;
                    inset: 0;
                    display: grid;
                    place-items: center;
                    color: #ff5d5d;
                    font-size: 2.1rem;
                    background:
                        linear-gradient(135deg, rgba(255, 0, 0, 0.08), rgba(255, 0, 0, 0.22)),
                        rgba(10, 12, 16, 0.3);
                }

                .thumb span {
                    display: block;
                    margin-top: 0.22rem;
                    text-align: center;
                    font-size: 0.56rem;
                    line-height: 1.2;
                    word-break: break-word;
                }

                .thumb-selected {
                    box-shadow: inset 0 0 0 1px rgba(61, 215, 255, 0.4);
                }

                .thumb-rejected {
                    box-shadow: inset 0 0 0 1px rgba(239, 68, 68, 0.5);
                }

                .thumb-rejected .thumb-photo {
                    opacity: 0.52;
                    filter: grayscale(0.28) blur(0.2px);
                }

                .config-panel {
                    width: min(100%, 100%);
                    display: grid;
                    gap: 0.85rem;
                    align-self: start;
                    align-content: start;
                }

                .accordion-item,
                .panel-section {
                    height: auto;
                    min-height: 0;
                    overflow: hidden;
                    border-radius: 24px;
                    background: linear-gradient(180deg, rgba(12, 21, 31, 0.98), rgba(10, 18, 27, 0.94));
                    border: 1px solid rgba(72, 214, 255, 0.22);
                    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02);
                }

                .panel-highlight {
                    border-color: rgba(241, 195, 75, 0.4);
                }

                .accordion-trigger,
                .panel-section-header {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.85rem;
                    min-height: 3.25rem;
                    padding: 0.8rem 1rem;
                    border: 0;
                    background: rgba(255, 255, 255, 0.015);
                    color: var(--text);
                    text-align: left;
                    font: inherit;
                    appearance: none;
                    -webkit-appearance: none;
                }

                .accordion-trigger {
                    cursor: pointer;
                    transition: background 160ms ease, color 160ms ease;
                }

                .accordion-trigger:hover {
                    background: rgba(61, 215, 255, 0.05);
                }

                .accordion-item.is-open .accordion-trigger {
                    background: linear-gradient(180deg, rgba(61, 215, 255, 0.08), rgba(61, 215, 255, 0.02));
                }

                .accordion-trigger span:first-child {
                    display: flex;
                    align-items: center;
                    flex: 1 1 auto;
                    min-width: 0;
                }

                .accordion-trigger strong,
                .panel-section-header strong {
                    color: #eaf5ff;
                    font-size: 0.98rem;
                    font-weight: 700;
                }


                .panel-section-header-toggle {
                    align-items: center;
                }

                .panel-toggle-inline {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    cursor: pointer;
                }

                .panel-section-header-meta {
                    justify-content: space-between;
                }

                .accordion-meta {
                    color: var(--muted);
                    font-size: 0.8rem;
                    font-weight: 700;
                }

                .accordion-chevron {
                    color: rgba(142, 167, 186, 0.88);
                    font-size: 1rem;
                    font-weight: 900;
                    transition: transform 180ms ease;
                }

                .accordion-item.is-open .accordion-chevron {
                    transform: rotate(90deg);
                }

                .accordion-body,
                .panel-section-body {
                    min-height: 0;
                    padding: 0 1rem 1rem;
                    border-top: 1px solid rgba(61, 215, 255, 0.12);
                }

                .accordion-item:not(.is-open) .accordion-body {
                    display: none;
                }

                .stack-button-hidden {
                    display: none !important;
                }


                .panel-section-compact .panel-section-body {
                    padding-top: 0.6rem;
                    padding-bottom: 0.6rem;
                }

                .panel-section-body-compact {
                    padding-top: 0.6rem;
                    padding-bottom: 0.6rem;
                }

                .save-button-compact {
                    min-height: 2.4rem;
                }


                .stack-process-panel {
                    margin-bottom: 0.85rem;
                    overflow: visible;
                }

                .stack-process-panel .panel-section-body {
                    display: grid;
                    gap: 0.85rem;
                    overflow: visible;
                }


                .stack-mode-select {
                    position: relative;
                }

                .stack-mode-trigger {
                    width: 100%;
                    min-height: 2.9rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.75rem;
                    padding: 0.7rem 0.9rem;
                    border-radius: 14px;
                    border: 1px solid rgba(61, 215, 255, 0.28);
                    background: rgba(255, 255, 255, 0.04);
                    color: #f4f7fb;
                    font: inherit;
                    text-align: left;
                    cursor: pointer;
                }

                .stack-mode-chevron {
                    color: var(--muted);
                    font-size: 0.95rem;
                    transition: transform 160ms ease;
                }

                .stack-mode-select.is-open .stack-mode-chevron {
                    transform: rotate(180deg);
                }


                .stack-mode-menu[hidden] {
                    display: none !important;
                }

                .stack-mode-menu {
                    position: absolute;
                    top: calc(100% + 0.4rem);
                    left: 0;
                    right: 0;
                    z-index: 12;
                    display: grid;
                    gap: 0.25rem;
                    padding: 0.35rem;
                    border-radius: 14px;
                    border: 1px solid rgba(61, 215, 255, 0.28);
                    background: #13202b;
                    box-shadow: 0 18px 36px rgba(0, 0, 0, 0.28);
                }

                .stack-mode-menu-item {
                    min-height: 2.5rem;
                    padding: 0.55rem 0.8rem;
                    border: 0;
                    border-radius: 10px;
                    background: transparent;
                    color: #dbe7f3;
                    font: inherit;
                    text-align: left;
                    cursor: pointer;
                }

                .stack-mode-menu-item:hover,
                .stack-mode-menu-item.is-active {
                    background: rgba(61, 215, 255, 0.14);
                    color: #f4f7fb;
                }

                .stack-manual-grid {
                    display: grid;
                    gap: 0.75rem;
                }


                .stack-mode-shell {
                    margin-bottom: 0.85rem;
                }

                .panel-actions-inline {
                    margin-top: 0.85rem;
                }

                .secondary-button-compact {
                    min-height: 2.7rem;
                    font-size: 0.88rem;
                }

                .mode-switch {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 0.45rem;
                }

                .mode-option {
                    min-height: 2.55rem;
                    border-radius: 12px;
                    border: 1px solid rgba(61, 215, 255, 0.2);
                    background: rgba(255, 255, 255, 0.03);
                    color: var(--muted);
                    font: inherit;
                    font-weight: 700;
                    cursor: pointer;
                    transition: 180ms ease;
                }

                .mode-option.is-active {
                    border-color: rgba(61, 215, 255, 0.55);
                    background: linear-gradient(135deg, rgba(61, 215, 255, 0.18), rgba(29, 130, 255, 0.22));
                    color: var(--text);
                    box-shadow: inset 0 0 0 1px rgba(61, 215, 255, 0.22), 0 10px 22px rgba(0, 0, 0, 0.2);
                }

                .toggle-control.toggle-control-compact,
                .panel-section-compact .toggle-control {
                    min-height: 2.75rem;
                    padding: 0.35rem 0.6rem;
                }

                .toggle-copy-compact {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }

                .toggle-copy-compact span {
                    color: var(--muted);
                    font-size: 0.82rem;
                    font-weight: 600;
                }

                .panel-actions-bottom {
                    display: grid;
                    gap: 0.7rem;
                    margin-top: 0.15rem;
                }

                .config-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 0.7rem 0.75rem;
                }

                .field {
                    display: grid;
                    gap: 0.35rem;
                    margin-bottom: 0;
                }

                .field-wide {
                    grid-column: 1 / -1;
                }

                .field select,
                .field input {
                    width: 100%;
                }

                .field select,
                .field input[type='number'] {
                    min-height: 2.6rem;
                    padding: 0.65rem 0.8rem;
                    border-radius: 12px;
                    border: 1px solid rgba(61, 215, 255, 0.28);
                    background: rgba(255, 255, 255, 0.04);
                    color: white;
                }

                .field-toggle {
                    grid-column: 1 / -1;
                }


                .stack-mode-shell {
                    margin-bottom: 0.85rem;
                }

                .panel-actions-inline {
                    margin-top: 0.85rem;
                }

                .secondary-button-compact {
                    min-height: 2.7rem;
                    font-size: 0.88rem;
                }

                .mode-switch {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 0.45rem;
                }

                .mode-option {
                    min-height: 2.55rem;
                    border-radius: 12px;
                    border: 1px solid rgba(61, 215, 255, 0.2);
                    background: rgba(255, 255, 255, 0.03);
                    color: var(--muted);
                    font: inherit;
                    font-weight: 700;
                    cursor: pointer;
                    transition: 180ms ease;
                }

                .mode-option.is-active {
                    border-color: rgba(61, 215, 255, 0.55);
                    background: linear-gradient(135deg, rgba(61, 215, 255, 0.18), rgba(29, 130, 255, 0.22));
                    color: var(--text);
                    box-shadow: inset 0 0 0 1px rgba(61, 215, 255, 0.22), 0 10px 22px rgba(0, 0, 0, 0.2);
                }

                .toggle-control {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.85rem;
                    min-height: 3rem;
                    padding: 0.5rem 0.75rem;
                    border-radius: 14px;
                    border: 1px solid rgba(61, 215, 255, 0.28);
                    background: rgba(255, 255, 255, 0.04);
                }

                .toggle-copy {
                    display: grid;
                    gap: 0.08rem;
                }

                .toggle-copy strong {
                    font-size: 0.95rem;
                }

                .toggle-copy small {
                    color: var(--muted);
                    font-size: 0.74rem;
                }

                .toggle-action {
                    position: relative;
                    flex: 0 0 auto;
                }

                .toggle-input {
                    position: absolute;
                    inset: 0;
                    opacity: 0;
                    pointer-events: none;
                }

                .toggle-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 4.2rem;
                    min-height: 2.1rem;
                    padding: 0.45rem 0.9rem;
                    border-radius: 999px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--muted);
                    font-size: 0.82rem;
                    font-weight: 800;
                    letter-spacing: 0.02em;
                    transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
                }

                .toggle-input:checked + .toggle-badge {
                    color: #061018;
                    border-color: rgba(61, 215, 255, 0.55);
                    background: linear-gradient(135deg, rgba(61, 215, 255, 0.95), rgba(150, 237, 255, 0.92));
                }

                .field span {
                    font-size: 0.82rem;
                }

                .facts {
                    margin: 0;
                    padding-left: 1rem;
                    font-size: 0.88rem;
                }

                .facts li + li {
                    margin-top: 0.32rem;
                }

                .stack-button,
                .secondary-button,
                .save-button {
                    width: 100%;
                    min-height: 3rem;
                    border-radius: 16px;
                    font-weight: 800;
                }

                .stack-button {
                    border: 0;
                    padding: 0.95rem 1.2rem;
                    color: white;
                    background: linear-gradient(135deg, #3896ff, #1959e6);
                    box-shadow: 0 18px 35px rgba(29, 130, 255, 0.35);
                }

                .secondary-button,
                .save-button {
                    border: 1px solid rgba(61, 215, 255, 0.3);
                    background: rgba(61, 215, 255, 0.08);
                    color: #dff9ff;
                }

                .stack-button:disabled,
                .save-button:disabled {
                    opacity: 0.45;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                @media (max-width: 980px) {
                    .studio {
                        grid-template-columns: 1fr;
                    }

                    .workspace-header {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .config-panel {
                        width: 100%;
                    }

                    .config-grid {
                        grid-template-columns: 1fr 1fr;
                    }

                    .upload-toolbar {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }

                @media (max-width: 640px) {
                    .page {
                        padding: 0.5rem;
                    }

                    .workspace {
                        padding: 1rem;
                        border-radius: 24px;
                    }

                    .viewer-panel {
                        padding: 0.7rem;
                        border-radius: 22px;
                    }

                    .thumbnail-shell {
                        grid-template-columns: 1fr;
                    }

                    .scroll-button {
                        display: none;
                    }

                    .viewer-stage {
                        min-height: 18.9rem;
                    }

                    .upload-actions {
                        width: auto;
                    }

                    .config-grid {
                        grid-template-columns: 1fr;
                    }
                }
            
                .field-hidden {
                    display: none !important;
                }

                .field-mode {
                    grid-column: 1 / -1;
                }

                .thumb-delete {
                    position: absolute;
                    top: 0.32rem;
                    right: 0.32rem;
                    width: 1.2rem;
                    height: 1.2rem;
                    border: 0;
                    border-radius: 999px;
                    display: grid;
                    place-items: center;
                    background: rgba(7, 17, 26, 0.82);
                    color: #f8fafc;
                    font-size: 0.8rem;
                    font-weight: 700;
                    line-height: 1;
                    cursor: pointer;
                    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.35);
                }

                .thumb-delete:hover {
                    background: rgba(220, 38, 38, 0.92);
                }
            
                .mode-switch {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 0.45rem;
                }

                .mode-option {
                    min-height: 2.55rem;
                    border-radius: 12px;
                    border: 1px solid rgba(61, 215, 255, 0.2);
                    background: rgba(255, 255, 255, 0.03);
                    color: var(--muted);
                    font: inherit;
                    font-weight: 700;
                    cursor: pointer;
                    transition: 180ms ease;
                }

                .mode-option.is-active {
                    border-color: rgba(61, 215, 255, 0.55);
                    background: linear-gradient(135deg, rgba(61, 215, 255, 0.18), rgba(29, 130, 255, 0.22));
                    color: var(--text);
                    box-shadow: inset 0 0 0 1px rgba(61, 215, 255, 0.22), 0 10px 22px rgba(0, 0, 0, 0.2);
                }

                .panel-section-compact {
                    height: auto;
                }

                .panel-section-compact .panel-section-header {
                    padding-top: 0.9rem;
                    padding-bottom: 0.9rem;
                }

                .panel-section-compact .panel-section-body,
                .panel-section-body-compact {
                    display: block;
                }

                .panel-highlight .panel-section-body {
                    padding-bottom: 0.85rem;
                }

                .panel-highlight .panel-section-header {
                    padding-top: 0.95rem;
                    padding-bottom: 0.95rem;
                }

                .field select option {
                    color: #0b1720;
                    background: #eef6fb;
                }

                .field select option:checked,
                .field select option:hover {
                    color: #07111a;
                    background: #9ee8ff;
                }
            </style>
            @php
                $inlineAppJs = file_get_contents(resource_path('js/app.js'));
                $inlineAppJs = preg_replace("/^import\\s+['\"]\\.\\/bootstrap['\"];?\\s*/m", '', $inlineAppJs);
                $inlineAppJs = str_replace('</script>', '<\/script>', $inlineAppJs);
            @endphp
            <script>
                document.addEventListener('DOMContentLoaded', () => {
                    {!! $inlineAppJs !!}
                });
            </script>
        @endif
    </head>
    <body class="focusforge-shell">
        <div class="orb orb-left"></div>
        <div class="orb orb-right"></div>

        <main class="page">
            <section class="workspace">
                <div class="workspace-header">
                    <h2 class="workspace-wordmark" aria-label="{{ $stackSummary['project_name'] }}">
                        <span class="sr-only">{{ $stackSummary['project_name'] }}</span>
                        <span>R</span>
                        <img class="workspace-wordmark-logo" src="{{ asset('rona-studio-logo.svg') }}" alt="" aria-hidden="true">
                        <span>na Studio</span>
                    </h2>
                </div>

                <div class="studio">
                    <div class="viewer-panel" data-upload-dropzone>
                        <div class="viewer-toolbar">
                            <div class="viewer-toolbar-actions">
                                <button class="viewer-toolbar-button" type="button" data-undo-button disabled>Undo</button>
                                <button class="viewer-toolbar-button" type="button" data-redo-button disabled>Redo</button>
                            </div>
                        </div>
                        <div class="viewer-stage viewer-mode-result" data-viewer-stage>
                            <div class="viewer-scene before-scene" data-before-scene>
                                <img class="scene-image" alt="Foto sumber" data-before-image>
                                <div class="scene-caption">Foto sumber</div>
                            </div>
                            <div class="viewer-scene after-scene" data-compare-panel>
                                <img class="scene-image" alt="Foto utama" data-after-image>
                                <div class="scene-caption">Foto utama</div>
                            </div>
                            <div class="compare-side-label compare-side-label-before" data-compare-before-label>Sebelum</div>
                            <div class="compare-side-label compare-side-label-after" data-compare-after-label>Hasil</div>
                            <input
                                class="compare-slider"
                                type="range"
                                min="20"
                                max="100"
                                value="58"
                                aria-label="Geser slider untuk membandingkan hasil stacking"
                                data-compare-slider
                            >
                            <div class="compare-line" data-compare-line></div>
                            <div class="compare-handle" data-compare-handle>||</div>
                            <div class="compare-label">Geser slider untuk bandingkan</div>
                            <div class="crop-overlay" data-crop-overlay hidden aria-hidden="true">
                                <div class="crop-frame" data-crop-frame>
                                    <span class="crop-badge">Mode Crop</span>
                                    <span class="crop-handle crop-handle-nw" data-crop-handle="nw"></span>
                                    <span class="crop-handle crop-handle-ne" data-crop-handle="ne"></span>
                                    <span class="crop-handle crop-handle-sw" data-crop-handle="sw"></span>
                                    <span class="crop-handle crop-handle-se" data-crop-handle="se"></span>
                                </div>
                                <div class="crop-helper" data-crop-helper hidden>Tarik sudut atau geser frame. `Enter` terapkan, `Esc` batal.</div>
                            </div>
                        </div>
                        <div class="viewer-mode-bar" aria-label="Kontrol split preview">
                            <button class="viewer-mode-button" type="button" data-split-toggle aria-pressed="false">
                                Aktifkan Split
                            </button>
                        </div>

                        <section class="upload-section" data-upload-dropzone>
                            <div class="upload-toolbar">
                                <div>
                                    <p class="upload-title">Filmstrip Foto</p>
                                    <p class="upload-caption">
                                        Upload satu atau lebih foto. Jika foto lebih dari satu, Anda bisa membuat foto utama dari hasil stack.
                                    </p>
                                </div>
                                <div class="upload-actions">
                                    <span class="upload-count" data-upload-count>{{ $stackSummary['uploaded_count'] }} foto</span>
                                </div>
                            </div>

                            <input
                                id="stack-photos"
                                class="upload-input"
                                type="file"
                                accept="image/*"
                                multiple
                                data-upload-endpoint="{{ $uploadMeta['endpoint'] }}"
                                data-delete-endpoint="{{ $uploadMeta['delete_endpoint'] }}"
                                data-upload-input
                            >

                            <div class="thumbnail-shell">
                                <button class="scroll-button" type="button" data-scroll-left aria-label="Geser daftar ke kiri">
                                    &#8249;
                                </button>

                                <div class="thumbnail-scroll" data-thumbnail-scroll>
                                    <div class="thumbnail-strip" data-thumbnail-strip>
                                        <label class="upload-tile" for="stack-photos">
                                            <span class="upload-tile-icon">+</span>
                                            <strong>Upload Foto</strong>
                                            <small>Drag &amp; drop atau klik untuk pilih banyak file</small>
                                        </label>
                                    </div>
                                </div>

                                <button class="scroll-button" type="button" data-scroll-right aria-label="Geser daftar ke kanan">
                                    &#8250;
                                </button>
                            </div>

                        </section>
                    </div>
                    <aside class="config-panel">
                        <span hidden>Mulai Stacking</span>
                        <section class="panel-section stack-process-panel stack-button-hidden" data-stack-process-panel hidden aria-hidden="true">
                            <div class="panel-section-header">
                                <strong>Stack</strong>
                            </div>
                            <div class="panel-section-body">
                                <label class="field field-wide stack-mode-field">
                                    <span>Mode Stack</span>
                                    <input type="hidden" value="auto" data-stack-control="stack.mode" data-default="auto">
                                    <div class="stack-mode-select" data-stack-mode-select>
                                        <button class="stack-mode-trigger" type="button" data-stack-mode-trigger aria-expanded="false">
                                            <span data-stack-mode-label>Auto</span>
                                            <span class="stack-mode-chevron">&#709;</span>
                                        </button>
                                        <div class="stack-mode-menu" data-stack-mode-menu hidden>
                                            <button class="stack-mode-menu-item is-active" type="button" data-stack-mode-choice="auto">Auto</button>
                                            <button class="stack-mode-menu-item" type="button" data-stack-mode-choice="manual">Manual</button>
                                        </div>
                                    </div>
                                </label>
                                <div class="stack-manual-grid">
                                    <label class="field field-wide" data-show-when-field="stack.mode" data-show-when-value="manual">
                                        <span>Kekuatan Alignment</span>
                                        <div class="range-control">
                                            <input type="range" min="0" max="100" step="1" value="55" data-stack-control="stack_manual.alignment_strength" data-default="55" data-range-input>
                                            <span class="range-value" data-range-value-for="stack_manual.alignment_strength">55</span>
                                        </div>
                                    </label>
                                    <label class="field field-wide" data-show-when-field="stack.mode" data-show-when-value="manual">
                                        <span>Kekuatan Detail</span>
                                        <div class="range-control">
                                            <input type="range" min="0" max="100" step="1" value="60" data-stack-control="stack_manual.detail_strength" data-default="60" data-range-input>
                                            <span class="range-value" data-range-value-for="stack_manual.detail_strength">60</span>
                                        </div>
                                    </label>
                                    <label class="field field-wide" data-show-when-field="stack.mode" data-show-when-value="manual">
                                        <span>Noise Reduction</span>
                                        <div class="range-control">
                                            <input type="range" min="0" max="100" step="1" value="35" data-stack-control="stack_manual.noise_reduction" data-default="35" data-range-input>
                                            <span class="range-value" data-range-value-for="stack_manual.noise_reduction">35</span>
                                        </div>
                                    </label>
                                    <label class="field field-wide" data-show-when-field="stack.mode" data-show-when-value="manual">
                                        <span>Blur Guard</span>
                                        <div class="range-control">
                                            <input type="range" min="0" max="100" step="1" value="45" data-stack-control="stack_manual.blur_guard" data-default="45" data-range-input>
                                            <span class="range-value" data-range-value-for="stack_manual.blur_guard">45</span>
                                        </div>
                                    </label>
                                    <label class="field field-wide" data-show-when-field="stack.mode" data-show-when-value="manual">
                                        <span>Output Strength</span>
                                        <div class="range-control">
                                            <input type="range" min="0" max="100" step="1" value="50" data-stack-control="stack_manual.output_strength" data-default="50" data-range-input>
                                            <span class="range-value" data-range-value-for="stack_manual.output_strength">50</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </section>

                        <section class="accordion-item" data-accordion-item>
                            <button class="accordion-trigger" type="button" data-accordion-trigger aria-expanded="false">
                                <span>
                                    <strong>Edit Dasar</strong>
                                </span>
                                <span class="accordion-chevron">&gt;</span>
                            </button>
                            <div class="accordion-body">
                                <div class="config-grid">
                                    @foreach ($stackSchema as $groupKey => $group)
                                        @continue(in_array($groupKey, ['ai_assist', 'edit_geometry'], true))
                                        @foreach ($group['fields'] as $fieldKey => $field)
                                            @php
                                                $fieldPath = $groupKey.'.'.$fieldKey;
                                                $fieldValue = data_get($stackConfig, $fieldPath, $field['default'] ?? null);
                                                $isWideField = in_array(($field['type'] ?? 'select'), ['range', 'toggle'], true);
                                            @endphp
                                            <label class="field{{ $isWideField ? ' field-wide' : '' }}{{ $fieldKey === 'mode' ? ' field-mode' : '' }}{{ ($field['type'] ?? 'select') === 'toggle' ? ' field-toggle' : '' }}" data-field-group="{{ $groupKey }}" @if(isset($field['show_when'])) data-show-when-field="{{ $groupKey.'.'.$field['show_when']['field'] }}" data-show-when-value="{{ $field['show_when']['value'] }}" @endif>
                                                @if (($field['type'] ?? 'select') !== 'toggle')
                                                    <span>{{ $field['label'] }}</span>
                                                @endif

                                                @if (($field['type'] ?? 'select') === 'toggle')
                                                    <div class="toggle-control">
                                                        <div class="toggle-copy">
                                                            <strong>{{ $field['label'] }}</strong>
                                                        </div>
                                                        <div class="toggle-action">
                                                            <input
                                                                class="toggle-input"
                                                                type="checkbox"
                                                                data-stack-control="{{ $fieldPath }}"
                                                                data-default="{{ (string) ($field['default'] ?? 'off') }}"
                                                                data-toggle-label-checked="{{ $field['checked_label'] ?? 'On' }}"
                                                                data-toggle-label-unchecked="{{ $field['unchecked_label'] ?? 'Off' }}"
                                                                @checked((string) $fieldValue === 'on')
                                                            >
                                                            <span class="toggle-badge" data-toggle-status-for="{{ $fieldPath }}">{{ (string) $fieldValue === 'on' ? ($field['checked_label'] ?? 'On') : ($field['unchecked_label'] ?? 'Off') }}</span>
                                                        </div>
                                                    </div>
                                                @elseif (($field['type'] ?? 'select') === 'select')
                                                    <select data-stack-control="{{ $fieldPath }}" data-default="{{ (string) ($field['default'] ?? $fieldValue) }}">
                                                        @foreach ($field['options'] as $option)
                                                            <option value="{{ $option }}" @selected((string) $fieldValue === (string) $option)>
                                                                {{ $option }}
                                                            </option>
                                                        @endforeach
                                                    </select>
                                                @elseif (($field['type'] ?? 'number') === 'range')
                                                    <div class="range-control">
                                                        <input
                                                            type="range"
                                                            min="{{ $field['min'] ?? 0 }}"
                                                            max="{{ $field['max'] ?? 100 }}"
                                                            step="{{ $field['step'] ?? 1 }}"
                                                            value="{{ $fieldValue }}"
                                                            data-stack-control="{{ $fieldPath }}"
                                                            data-default="{{ (string) ($field['default'] ?? $fieldValue) }}"
                                                            data-range-input
                                                        >
                                                        <span class="range-value" data-range-value-for="{{ $fieldPath }}">{{ $fieldValue }}</span>
                                                    </div>
                                                @else
                                                    <input
                                                        type="number"
                                                        min="{{ $field['min'] ?? 0 }}"
                                                        max="{{ $field['max'] ?? 100 }}"
                                                        step="{{ $field['step'] ?? 1 }}"
                                                        value="{{ $fieldValue }}"
                                                        data-stack-control="{{ $fieldPath }}"
                                                        data-default="{{ (string) ($field['default'] ?? $fieldValue) }}"
                                                    >
                                                @endif
                                            </label>
                                        @endforeach
                                    @endforeach
                                </div>
                                <div class="panel-actions-bottom panel-actions-inline">
                                    <button class="secondary-button secondary-button-compact" type="button" data-reset-controls>Reset Kontrol</button>
                                </div>
                            </div>
                        </section>

                        <section class="accordion-item" data-accordion-item>
                            <button class="accordion-trigger" type="button" data-accordion-trigger aria-expanded="false">
                                <span>
                                    <strong>Preset</strong>
                                </span>
                                <span class="accordion-chevron">&gt;</span>
                            </button>
                            <div class="accordion-body">
                                <label class="field field-wide">
                                    <span>Pilih Preset</span>
                                    <select data-preset-select>
                                        <option value="natural">Natural</option>
                                        <option value="clean">Clean</option>
                                        <option value="sharp">Sharp</option>
                                        <option value="warm">Warm</option>
                                        <option value="cool">Cool</option>
                                    </select>
                                </label>
                                <div class="panel-actions-bottom">
                                    <button class="secondary-button secondary-button-compact" type="button" data-preset-apply>Apply Preset</button>
                                </div>
                            </div>
                        </section>

                        <section class="accordion-item" data-accordion-item data-geometry-panel>
                            <button class="accordion-trigger" type="button" data-accordion-trigger aria-expanded="false">
                                <span>
                                    <strong>Crop &amp; Rotate</strong>
                                </span>
                                <span class="accordion-chevron">&gt;</span>
                            </button>
                            <div class="accordion-body">
                                <input type="hidden" value="0" data-stack-control="edit_geometry.rotation" data-default="0">
                                <input type="hidden" value="0" data-stack-control="edit_geometry.crop_x" data-default="0">
                                <input type="hidden" value="0" data-stack-control="edit_geometry.crop_y" data-default="0">
                                <input type="hidden" value="100" data-stack-control="edit_geometry.crop_width" data-default="100">
                                <input type="hidden" value="100" data-stack-control="edit_geometry.crop_height" data-default="100">
                                <div class="panel-actions-bottom panel-actions-inline panel-actions-inline-tight">
                                    <button class="secondary-button secondary-button-compact" type="button" data-rotate-left disabled>Putar Kiri</button>
                                    <button class="secondary-button secondary-button-compact" type="button" data-rotate-right disabled>Putar Kanan</button>
                                </div>
                                <div class="panel-actions-bottom">
                                    <button class="secondary-button secondary-button-compact" type="button" data-crop-start disabled>Masuk Mode Crop</button>
                                </div>
                                <div class="panel-actions-bottom panel-actions-inline panel-actions-inline-crop" data-crop-actions hidden aria-hidden="true">
                                    <button class="secondary-button secondary-button-compact" type="button" data-crop-reset>Reset</button>
                                    <button class="secondary-button secondary-button-compact" type="button" data-crop-cancel>Batal</button>
                                    <button class="secondary-button secondary-button-compact secondary-button-primary" type="button" data-crop-apply>Terapkan</button>
                                </div>
                            </div>
                        </section>

                        @if (isset($stackSchema['ai_assist']))
                            @php
                                $field = $stackSchema['ai_assist']['fields']['mode'];
                                $fieldPath = 'ai_assist.mode';
                                $fieldValue = data_get($stackConfig, $fieldPath, $field['default'] ?? 'off');
                            @endphp
                            <section class="panel-section panel-section-compact">
                                <div class="panel-section-header panel-section-header-meta panel-section-header-toggle">
                                    <strong>AI Assist</strong>
                                    <label class="panel-toggle-inline">
                                        <input
                                            class="toggle-input"
                                            type="checkbox"
                                            data-stack-control="{{ $fieldPath }}"
                                            data-default="{{ (string) ($field['default'] ?? 'off') }}"
                                            data-toggle-label-checked="{{ $field['checked_label'] ?? 'On' }}"
                                            data-toggle-label-unchecked="{{ $field['unchecked_label'] ?? 'Off' }}"
                                            @checked((string) $fieldValue === 'on')
                                        >
                                        <span class="toggle-badge" data-toggle-status-for="{{ $fieldPath }}">{{ (string) $fieldValue === 'on' ? ($field['checked_label'] ?? 'On') : ($field['unchecked_label'] ?? 'Off') }}</span>
                                    </label>
                                </div>
                            </section>
                        @endif

                        <section class="panel-section panel-section-compact">
                            <div class="panel-section-header">
                                <strong>Export</strong>
                            </div>
                            <div class="panel-section-body panel-section-body-compact">
                                <button class="save-button save-button-compact" type="button" data-save-button disabled>Simpan Hasil</button>
                            </div>
                        </section>

                        <section class="panel-section panel-highlight panel-section-compact">
                            <div class="panel-section-header">
                                <strong>Info Proyek</strong>
                            </div>
                            <div class="panel-section-body">
                                <ul class="facts">
                                    <li>Foto dimuat: <span data-uploaded-total>{{ $stackSummary['uploaded_count'] }}</span></li>
                                    <li>Foto siap: <span data-selected-total>{{ $stackSummary['selected_count'] }}</span></li>
                                    <li>Mode stack: <span data-editor-info-stack>{{ $stackSummary['uploaded_count'] > 1 ? 'Auto' : 'Tunggal' }}</span></li>
                                    <li>AI Assist: <span data-editor-info-ai>{{ data_get($stackConfig, 'ai_assist.mode', 'off') === 'on' ? 'On' : 'Off' }}</span></li>
                                    <li>Split compare: <span data-editor-info-split>Off</span></li>
                                    <li>Reject: <span data-rejected-total>{{ $stackSummary['rejected_count'] }}</span></li>
                                </ul>
                            </div>
                        </section>

                        <section class="accordion-item" data-accordion-item>
                            <button class="accordion-trigger" type="button" data-accordion-trigger aria-expanded="false">
                                <span>
                                    <strong>History</strong>
                                </span>
                                <span class="accordion-chevron">&gt;</span>
                            </button>
                            <div class="accordion-body">
                                <ul class="history-list" data-history-list>
                                    <li class="history-empty">Belum ada riwayat perubahan.</li>
                                </ul>
                            </div>
                        </section>


                    </aside>
                </div>
            </section>
        </main>
    </body>
</html>

















