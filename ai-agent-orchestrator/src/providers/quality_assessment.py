from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
import os
import logging
import numpy as np

logger = logging.getLogger("bhooraksha.providers.quality")

try:
    import cv2
    OPENCV_AVAILABLE = True
except ImportError:
    OPENCV_AVAILABLE = False
    logger.warning("OpenCV is not available. Quality Assessment will operate in fallback mode.")


class QualityAssessmentProvider(ABC):
    """Abstract base provider for document optical quality assessment."""

    @abstractmethod
    async def assess(self, file_path: Optional[str], context: Dict[str, Any]) -> Dict[str, Any]:
        """Assess document image quality, blur, contrast, resolution, and orientation."""
        pass

    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass

    @property
    @abstractmethod
    def is_simulated(self) -> bool:
        pass


class RealQualityAssessmentProvider(QualityAssessmentProvider):
    """
    REAL Document Quality Assessment Provider using OpenCV.
    Measures Laplacian variance (blur), brightness, contrast, dimensions, and orientation.
    Never relies on file size for DPI or quality inference.
    """

    @property
    def provider_name(self) -> str:
        return "OPENCV_REAL_QUALITY_PROVIDER"

    @property
    def is_simulated(self) -> bool:
        return False

    async def assess(self, file_path: Optional[str], context: Dict[str, Any]) -> Dict[str, Any]:
        if not OPENCV_AVAILABLE or not file_path or not os.path.exists(file_path):
            logger.info("Real file not present or OpenCV unavailable; returning unmeasured status.")
            return {
                "provider": self.provider_name,
                "is_simulated": False,
                "measured": False,
                "quality_score": None,
                "blur_metric": None,
                "brightness_metric": None,
                "contrast_metric": None,
                "resolution": None,
                "orientation": None,
                "status": "UNMEASURED",
                "findings": ["Physical file not available on filesystem for optical measurement."]
            }

        try:
            # Read image using OpenCV
            img = cv2.imread(file_path)
            if img is None:
                # Might be a PDF or non-image format
                return {
                    "provider": self.provider_name,
                    "is_simulated": False,
                    "measured": False,
                    "quality_score": None,
                    "blur_metric": None,
                    "brightness_metric": None,
                    "contrast_metric": None,
                    "resolution": None,
                    "orientation": None,
                    "status": "UNSUPPORTED_FORMAT",
                    "findings": ["File format cannot be decoded as image directly by OpenCV without PDF rendering."]
                }

            height, width = img.shape[:2]
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            # 1. Blur Metric: Variance of the Laplacian
            # Higher variance = sharper image. < 100 typically considered blurry.
            laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())

            # 2. Brightness Metric: Mean pixel intensity (0 - 255)
            brightness = float(np.mean(gray))

            # 3. Contrast Metric: Standard deviation of pixel intensities
            contrast = float(np.std(gray))

            # 4. Orientation: 0, 90, 180, 270 degrees based on dimensions / aspect
            orientation = 0 if width >= height else 90

            findings: List[str] = []
            blur_pass = laplacian_var >= 80.0
            if not blur_pass:
                findings.append(f"Image may be blurry (Laplacian variance: {laplacian_var:.1f}, threshold: 80.0)")

            brightness_pass = 40.0 <= brightness <= 220.0
            if not brightness_pass:
                findings.append(f"Suboptimal brightness: {brightness:.1f} (acceptable range: 40-220)")

            contrast_pass = contrast >= 30.0
            if not contrast_pass:
                findings.append(f"Low image contrast: {contrast:.1f} (acceptable minimum: 30.0)")

            resolution_str = f"{width}x{height}"
            resolution_pass = (width >= 800 and height >= 600)
            if not resolution_pass:
                findings.append(f"Low resolution: {resolution_str} (recommended min: 800x600)")

            # Calibrate composite quality score (0 - 100)
            score = 100.0
            if not blur_pass:
                score -= 30.0
            if not brightness_pass:
                score -= 20.0
            if not contrast_pass:
                score -= 20.0
            if not resolution_pass:
                score -= 20.0
            score = max(0.0, min(100.0, score))

            status = "PASSED" if score >= 70.0 else ("WARNING" if score >= 50.0 else "FAILED")

            return {
                "provider": self.provider_name,
                "is_simulated": False,
                "measured": True,
                "quality_score": round(score, 1),
                "blur_metric": round(laplacian_var, 2),
                "brightness_metric": round(brightness, 2),
                "contrast_metric": round(contrast, 2),
                "resolution": resolution_str,
                "orientation": orientation,
                "status": status,
                "findings": findings if findings else ["All optical quality checks passed within acceptable thresholds."]
            }

        except Exception as e:
            logger.error(f"Error during OpenCV quality assessment: {e}", exc_info=True)
            return {
                "provider": self.provider_name,
                "is_simulated": False,
                "measured": False,
                "error": str(e),
                "status": "ERROR",
                "findings": [f"Optical quality measurement failed: {str(e)}"]
            }


class DemoQualityAssessmentProvider(QualityAssessmentProvider):
    """
    DEMO Quality Assessment Provider.
    Clearly marked as simulated. Never calls a synthetic score a measured score.
    """

    @property
    def provider_name(self) -> str:
        return "DEMO_SIMULATED_QUALITY_PROVIDER"

    @property
    def is_simulated(self) -> bool:
        return True

    async def assess(self, file_path: Optional[str], context: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "provider": self.provider_name,
            "is_simulated": True,
            "measured": False,
            "source_mode": "DEMO",
            "quality_score": 92.5, # Clearly marked as simulated
            "blur_metric": 142.8,
            "brightness_metric": 134.2,
            "contrast_metric": 56.4,
            "resolution": "1654x2338 (A4 @ 200 DPI simulated)",
            "orientation": 0,
            "status": "PASSED",
            "findings": [
                "[SIMULATED] Simulated clarity and orientation check passed.",
                "[SIMULATED] Contrast and resolution within nominal parameters for prototype testing."
            ]
        }


def get_quality_provider(mode: str = "AUTO") -> QualityAssessmentProvider:
    if mode.upper() == "REAL":
        return RealQualityAssessmentProvider()
    elif mode.upper() == "DEMO":
        return DemoQualityAssessmentProvider()
    else:
        # In AUTO mode, try real if OpenCV is available and a file exists, else fallback to DEMO
        return RealQualityAssessmentProvider() if OPENCV_AVAILABLE else DemoQualityAssessmentProvider()
