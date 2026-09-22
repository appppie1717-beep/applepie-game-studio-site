"""Render the ERSIYAN Google Forms header using the site's existing identity.

Requires Pillow and the Windows Arial / Malgun Gothic fonts. No network calls.
Output is a 1600 x 400 PNG plus an editable SVG using the same coordinates.
"""

from pathlib import Path
from html import escape
import os

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "images" / "virtual"
FONT_ROOT = Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts"
WIDTH, HEIGHT, SCALE = 1600, 400, 3
# These match app/globals.css and the existing BrandLockup component.
NAVY, WHITE, LAVENDER = "#07101e", "#ffffff", "#a9c1fa"
MARK_BORDER = "#657798"


def main():
    image = Image.new("RGB", (WIDTH * SCALE, HEIGHT * SCALE), NAVY)
    draw = ImageDraw.Draw(image)
    svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="400" viewBox="0 0 1600 400" role="img" aria-labelledby="title description">',
        '  <title id="title">에르시안 버츄얼 0기 크리에이터 모집</title>',
        '  <desc id="description">공식 홈페이지의 남색 바탕과 ERSIYAN 로고를 사용한 지원서 헤더.</desc>',
        f'  <rect width="1600" height="400" fill="{NAVY}"/>',
    ]

    def text(value, x, baseline, size, filename, family, color=WHITE, weight="400", tracking=0):
        font = ImageFont.truetype(str(FONT_ROOT / filename), size * SCALE)
        if tracking:
            pen = x * SCALE
            for character in value:
                draw.text((pen, baseline * SCALE), character, font=font, fill=color, anchor="ls")
                pen += draw.textlength(character, font=font) + tracking * SCALE
        else:
            draw.text(
                (x * SCALE, baseline * SCALE), value, font=font,
                fill=color, anchor="ls",
            )
        svg.append(
            f'  <text x="{x}" y="{baseline}" font-family="{family}" font-size="{size}" '
            f'font-weight="{weight}" letter-spacing="{tracking}" fill="{color}">{escape(value)}</text>'
        )

    # BrandLockup's existing outline and star, scaled without inventing a new mark.
    # Its lower-left corner is intentionally tighter, matching the website.
    border = [(136, 64), (164, 64)]

    def corner(control, end):
        start = border[-1]
        for step in range(1, 17):
            t = step / 16
            border.append(tuple((1 - t) ** 2 * start[i] + 2 * (1 - t) * t * control[i] + t ** 2 * end[i] for i in range(2)))

    corner((180, 64), (180, 80))
    border.append((180, 108))
    corner((180, 124), (164, 124))
    border.append((125, 124))
    corner((120, 124), (120, 119))
    border.append((120, 80))
    corner((120, 64), (136, 64))
    draw.line([(x * SCALE, y * SCALE) for x, y in border], fill=MARK_BORDER, width=2 * SCALE, joint="curve")
    svg.append(f'  <path d="M136 64H164Q180 64 180 80V108Q180 124 164 124H125Q120 124 120 119V80Q120 64 136 64Z" fill="none" stroke="{MARK_BORDER}" stroke-width="2"/>')
    text("✦", 133, 108, 35, "seguisym.ttf", "Segoe UI Symbol, sans-serif", color=LAVENDER)
    text("ERSIYAN", 203, 109, 36, "arialbd.ttf", "Arial, sans-serif", weight="700", tracking=5)

    # Only the agency name and the actual recruitment title belong on this banner.
    # Inset text remains readable when Forms scales the full 4:1 header on phones.
    text("에르시안 버츄얼", 117, 232, 78, "malgunbd.ttf", "Malgun Gothic, sans-serif", weight="700")
    text("0기 크리에이터 모집", 120, 311, 52, "malgun.ttf", "Malgun Gothic, sans-serif", color=LAVENDER)
    svg.append("</svg>")

    OUTPUT.mkdir(parents=True, exist_ok=True)
    stem = OUTPUT / "ersiyan-gen0-form-header"
    stem.with_suffix(".svg").write_text("\n".join(svg) + "\n", encoding="utf-8")
    image.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS).save(stem.with_suffix(".png"), optimize=True)
    print(f"Created {stem.with_suffix('.png')} ({WIDTH}x{HEIGHT}, {stem.with_suffix('.png').stat().st_size:,} bytes)")
    print(f"Site identity: navy {NAVY}; white {WHITE}; lavender {LAVENDER}")


if __name__ == "__main__":
    main()
