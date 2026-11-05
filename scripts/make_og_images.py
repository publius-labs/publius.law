#!/usr/bin/env python3
"""Create 1200x630 social-share crops (assets/og/<name>.jpg) from the existing hero images.

Requires Pillow. Re-run after replacing a hero image, then run scripts/seo_apply.py.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "og"
SOURCES = [
    "assets/hero-attorney-BgfVu0lT.jpg",
    "assets/about-hero-uDjsckHO.jpg",
    "assets/process-hero-DZlu7iPD.jpg",
    "assets/contact-hero-CoIc7NUu.jpg",
    "assets/news-hero.jpg",
]
SIZE = (1200, 630)

OUT.mkdir(parents=True, exist_ok=True)
for rel in SOURCES:
    src = ROOT / rel
    img = Image.open(src).convert("RGB")
    out = OUT / (src.stem + ".jpg")
    ImageOps.fit(img, SIZE, Image.LANCZOS, centering=(0.5, 0.5)).save(out, "JPEG", quality=84, optimize=True, progressive=True)
    print(f"{out.relative_to(ROOT)}  {out.stat().st_size // 1024} KB  (from {img.size[0]}x{img.size[1]})")
