from __future__ import annotations

from dataclasses import asdict, dataclass, field
from enum import Enum
from typing import Any


class AutoMode(str, Enum):
    AUTO = "auto"
    MANUAL = "manual"


class AIAssistMode(str, Enum):
    OFF = "off"
    ON = "on"


class MotionModel(str, Enum):
    TRANSLATION = "MOTION_TRANSLATION"
    EUCLIDEAN = "MOTION_EUCLIDEAN"
    AFFINE = "MOTION_AFFINE"
    HOMOGRAPHY = "MOTION_HOMOGRAPHY"


class FocusOperator(str, Enum):
    LAPLACIAN = "laplacian"
    SOBEL = "sobel"


class BlurType(str, Enum):
    NONE = "none"
    MEDIAN = "median"
    GAUSSIAN = "gaussian"


class OutputBitDepth(str, Enum):
    BIT_8 = "8-bit"
    BIT_16 = "16-bit"


class FrameScoringMode(str, Enum):
    OFF = "off"
    AUTO_BLUR_GUARD = "auto_blur_guard"


class SmartUpscaleMode(str, Enum):
    OFF = "off"
    X15 = "1.5x"
    X2 = "2x"


def _ensure_range(name: str, value: float, minimum: float, maximum: float) -> None:
    if not minimum <= value <= maximum:
        raise ValueError(f"{name} must be between {minimum} and {maximum}, got {value}.")


def _ensure_choice(name: str, value: int, allowed: tuple[int, ...]) -> None:
    if value not in allowed:
        raise ValueError(f"{name} must be one of {allowed}, got {value}.")


@dataclass(slots=True)
class AlignmentConfig:
    mode: AIAssistMode = AIAssistMode.OFF
    motion_model: MotionModel = MotionModel.HOMOGRAPHY
    number_of_iterations: int = 2000
    termination_epsilon: float = 1e-6
    gauss_pyramid_layers: int = 3

    def __post_init__(self) -> None:
        _ensure_range("number_of_iterations", self.number_of_iterations, 50, 5000)
        _ensure_range("termination_epsilon", self.termination_epsilon, 1e-10, 1e-3)
        _ensure_range("gauss_pyramid_layers", self.gauss_pyramid_layers, 1, 5)


@dataclass(slots=True)
class FocusMeasureConfig:
    mode: AutoMode = AutoMode.AUTO
    operator: FocusOperator = FocusOperator.LAPLACIAN
    kernel_size: int = 5
    blur_type: BlurType = BlurType.GAUSSIAN
    blur_kernel_size: int = 3
    contrast_threshold: float = 8.0

    def __post_init__(self) -> None:
        _ensure_choice("kernel_size", self.kernel_size, (3, 5, 7, 9))
        _ensure_choice("blur_kernel_size", self.blur_kernel_size, (3, 5, 7, 9))
        _ensure_range("contrast_threshold", self.contrast_threshold, 0, 255)


@dataclass(slots=True)
class FusionConfig:
    mode: AutoMode = AutoMode.AUTO
    pyramid_levels: int = 5
    unsharp_amount: float = 1.2
    unsharp_radius: float = 1.0
    unsharp_threshold: float = 4.0
    mask_erode_size: int = 0
    mask_dilate_size: int = 1

    def __post_init__(self) -> None:
        _ensure_range("pyramid_levels", self.pyramid_levels, 1, 10)
        _ensure_range("unsharp_amount", self.unsharp_amount, 0, 5)
        _ensure_range("unsharp_radius", self.unsharp_radius, 0.1, 10)
        _ensure_range("unsharp_threshold", self.unsharp_threshold, 0, 255)
        _ensure_range("mask_erode_size", self.mask_erode_size, 0, 25)
        _ensure_range("mask_dilate_size", self.mask_dilate_size, 0, 25)


@dataclass(slots=True)
class PerformanceConfig:
    mode: AutoMode = AutoMode.AUTO
    downsample_factor: float = 0.5
    output_bit_depth: OutputBitDepth = OutputBitDepth.BIT_8
    output_format: str = "jpg"

    def __post_init__(self) -> None:
        if self.downsample_factor not in (0.25, 0.5, 1.0):
            raise ValueError("downsample_factor must be one of 0.25, 0.5, or 1.0.")
        if self.output_bit_depth == OutputBitDepth.BIT_8 and self.output_format not in ("jpg", "png"):
            raise ValueError("8-bit output_format must be jpg or png.")
        if self.output_bit_depth == OutputBitDepth.BIT_16 and self.output_format not in ("tiff", "png"):
            raise ValueError("16-bit output_format must be tiff or png.")


@dataclass(slots=True)
class AIAssistConfig:
    mode: AutoMode = AutoMode.AUTO
    frame_scoring: FrameScoringMode = FrameScoringMode.AUTO_BLUR_GUARD
    denoise_strength: int = 42
    detail_boost: int = 38
    halo_guard: int = 32
    smart_upscale: SmartUpscaleMode = SmartUpscaleMode.OFF
    tone_recovery: int = 26

    def __post_init__(self) -> None:
        _ensure_range("denoise_strength", self.denoise_strength, 0, 100)
        _ensure_range("detail_boost", self.detail_boost, 0, 100)
        _ensure_range("halo_guard", self.halo_guard, 0, 100)
        _ensure_range("tone_recovery", self.tone_recovery, 0, 100)


@dataclass(slots=True)
class StackingConfig:
    alignment: AlignmentConfig = field(default_factory=AlignmentConfig)
    focus_measure: FocusMeasureConfig = field(default_factory=FocusMeasureConfig)
    fusion: FusionConfig = field(default_factory=FusionConfig)
    performance: PerformanceConfig = field(default_factory=PerformanceConfig)
    ai_assist: AIAssistConfig = field(default_factory=AIAssistConfig)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> "StackingConfig":
        return cls(
            alignment=AlignmentConfig(**payload.get("alignment", {})),
            focus_measure=FocusMeasureConfig(**payload.get("focus_measure", {})),
            fusion=FusionConfig(**payload.get("fusion", {})),
            performance=PerformanceConfig(**payload.get("performance", {})),
            ai_assist=AIAssistConfig(**payload.get("ai_assist", {})),
        )

    @classmethod
    def ui_schema(cls) -> dict[str, Any]:
        return {
            "alignment": {
                "label": "Alignment",
                "fields": {
                    "mode": {"type": "select", "label": "Mode Alignment", "options": [item.value for item in AutoMode], "default": AutoMode.AUTO.value},
                    "motion_model": {"type": "select", "label": "Motion Model", "options": [item.value for item in MotionModel], "default": MotionModel.HOMOGRAPHY.value, "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                    "number_of_iterations": {"type": "range", "label": "Number of Iterations", "min": 50, "max": 5000, "step": 50, "default": 2000, "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                    "termination_epsilon": {"type": "number", "label": "Termination Epsilon", "min": 1e-10, "max": 1e-3, "step": 1e-6, "default": 1e-6, "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                    "gauss_pyramid_layers": {"type": "select", "label": "Gauss Pyramid Layers", "options": [1, 2, 3, 4, 5], "default": 3, "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                },
            },
            "focus_measure": {
                "label": "Focus Measure",
                "fields": {
                    "mode": {"type": "select", "label": "Mode Focus", "options": [item.value for item in AutoMode], "default": AutoMode.AUTO.value},
                    "operator": {"type": "select", "label": "Operator", "options": [item.value for item in FocusOperator], "default": FocusOperator.LAPLACIAN.value, "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                    "kernel_size": {"type": "select", "label": "Kernel Size", "options": [3, 5, 7, 9], "default": 5, "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                    "blur_type": {"type": "select", "label": "Blur Pre-processing", "options": [item.value for item in BlurType], "default": BlurType.GAUSSIAN.value, "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                    "blur_kernel_size": {"type": "select", "label": "Blur Kernel Size", "options": [3, 5, 7, 9], "default": 3, "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                    "contrast_threshold": {"type": "range", "label": "Contrast Threshold", "min": 0, "max": 255, "step": 1, "default": 8, "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                },
            },
            "fusion": {
                "label": "Fusion & Blending",
                "fields": {
                    "mode": {"type": "select", "label": "Mode Fusion", "options": [item.value for item in AutoMode], "default": AutoMode.AUTO.value},
                    "pyramid_levels": {"type": "range", "label": "Pyramid Levels", "min": 1, "max": 10, "step": 1, "default": 5, "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                    "unsharp_amount": {"type": "range", "label": "Unsharp Amount", "min": 0, "max": 5, "step": 0.1, "default": 1.2, "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                    "unsharp_radius": {"type": "range", "label": "Unsharp Radius", "min": 0.1, "max": 10, "step": 0.1, "default": 1.0, "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                    "unsharp_threshold": {"type": "range", "label": "Unsharp Threshold", "min": 0, "max": 255, "step": 1, "default": 4, "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                    "mask_erode_size": {"type": "number", "label": "Erode Mask", "min": 0, "max": 25, "step": 1, "default": 0, "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                    "mask_dilate_size": {"type": "number", "label": "Dilate Mask", "min": 0, "max": 25, "step": 1, "default": 1, "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                },
            },
            "performance": {
                "label": "Performance & Output",
                "fields": {
                    "mode": {"type": "select", "label": "Mode Output", "options": [item.value for item in AutoMode], "default": AutoMode.AUTO.value},
                    "downsample_factor": {"type": "select", "label": "Downsample Factor", "options": [0.25, 0.5, 1.0], "default": 0.5, "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                    "output_bit_depth": {"type": "select", "label": "Output Bit Depth", "options": [item.value for item in OutputBitDepth], "default": OutputBitDepth.BIT_8.value, "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                    "output_format": {"type": "select", "label": "Output Format", "options": ["jpg", "png", "tiff"], "default": "jpg", "show_when": {"field": "mode", "value": AutoMode.MANUAL.value}},
                },
            },
            "ai_assist": {
                "label": "AI Assist",
                "fields": {
                    "mode": {"type": "toggle", "label": "AI Assist", "default": AIAssistMode.OFF.value, "checked_label": "On", "unchecked_label": "Off"},
                },
            },
        }
