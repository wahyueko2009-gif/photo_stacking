from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from .config import StackingConfig


@dataclass(slots=True)
class PhotoStackingPipeline:
    config: StackingConfig

    def describe(self) -> dict[str, Any]:
        return {
            "config": self.config.to_dict(),
            "steps": [
                "load_images",
                "align_images",
                "measure_focus",
                "ai_frame_scoring",
                "build_focus_masks",
                "laplacian_fusion",
                "ai_post_enhance",
                "save_output",
            ],
        }

    def align_images(self) -> dict[str, Any]:
        return {
            "motion_model": self.config.alignment.motion_model.value,
            "iterations": self.config.alignment.number_of_iterations,
            "termination_epsilon": self.config.alignment.termination_epsilon,
            "gauss_pyramid_layers": self.config.alignment.gauss_pyramid_layers,
        }

    def focus_measure(self) -> dict[str, Any]:
        return {
            "operator": self.config.focus_measure.operator.value,
            "kernel_size": self.config.focus_measure.kernel_size,
            "blur_type": self.config.focus_measure.blur_type.value,
            "blur_kernel_size": self.config.focus_measure.blur_kernel_size,
            "contrast_threshold": self.config.focus_measure.contrast_threshold,
        }

    def fusion_settings(self) -> dict[str, Any]:
        return {
            "pyramid_levels": self.config.fusion.pyramid_levels,
            "unsharp_amount": self.config.fusion.unsharp_amount,
            "unsharp_radius": self.config.fusion.unsharp_radius,
            "unsharp_threshold": self.config.fusion.unsharp_threshold,
            "mask_erode_size": self.config.fusion.mask_erode_size,
            "mask_dilate_size": self.config.fusion.mask_dilate_size,
        }

    def output_settings(self) -> dict[str, Any]:
        return {
            "downsample_factor": self.config.performance.downsample_factor,
            "output_bit_depth": self.config.performance.output_bit_depth.value,
            "output_format": self.config.performance.output_format,
        }

    def ai_assist(self) -> dict[str, Any]:
        return {
            "frame_scoring": self.config.ai_assist.frame_scoring.value,
            "denoise_strength": self.config.ai_assist.denoise_strength,
            "detail_boost": self.config.ai_assist.detail_boost,
            "halo_guard": self.config.ai_assist.halo_guard,
            "smart_upscale": self.config.ai_assist.smart_upscale.value,
            "tone_recovery": self.config.ai_assist.tone_recovery,
        }
