import os
import math
import random
import numpy as np
from PIL import Image, ImageOps, ImageEnhance, ImageFilter
from scipy.ndimage import binary_closing, binary_fill_holes, label
from scipy.spatial import distance_matrix
from scipy.optimize import linear_sum_assignment

WIDTH, HEIGHT = 1180, 610
PORTRAIT_GRID = (300, 340)

PALETTE_DARK = {'bg': '#0A101F', 'portrait': '#A78BFA', 'chrome': '#22D3EE', 'accent': '#10B981', 'text': '#E2E8F0'}
PALETTE_LIGHT = {'bg': '#F8FAFC', 'portrait': '#7C3AED', 'chrome': '#0891B2', 'accent': '#10B981', 'text': '#0F172A'}

DETAILS = {
    'Subject': 'Ijji Madhu Venkat', 'Role': 'Full-Stack Software Engineer',
    'Origin': 'Andhra Pradesh, India', 'Education': 'B.Tech in CSE',
    'Status': 'Building + Learning + Shipping', 'ToolChain': 'VS Code, Git, Postman, Vercel',
    'Core.Lang': 'JavaScript, Java', 'Core.Frontend': 'React.js, Tailwind CSS, HTML5, CSS3, Bootstrap',
    'Core.Backend': 'Node.js, Express.js', 'Core.Database': 'MongoDB, Firebase',
    'Core.Infra': 'Git, Vercel',
    'Grid.Mail': 'ijjimadhu@gmail.com', 'Grid.Portfolio': 'coming soon',
    'Grid.LinkedIn': 'linkedin.com/in/ijjimadhu', 'Grid.GitHub': 'github.com/madhu967'
}

def create_logo_points(logo_type, num_points):
    points = []
    # Simplified geometric representations to hit ~num_points
    # We'll just generate random points within a shape to act as the logo tracing
    for _ in range(num_points):
        if logo_type == 0: # Circle/React-ish
            r = 80 * math.sqrt(random.random())
            theta = random.random() * 2 * math.pi
            points.append([150 + r * math.cos(theta), 170 + r * math.sin(theta)])
        elif logo_type == 1: # Triangle/Vercel-ish
            x, y = random.random(), random.random()
            if x + y > 1: x, y = 1 - x, 1 - y
            points.append([70 + x * 160, 250 - y * 160])
        else: # Square/Mongo-ish
            points.append([70 + random.random() * 160, 90 + random.random() * 160])
    return np.array(points)

def process_portrait(img_path, is_dark_mode):
    img = Image.open(img_path).convert('RGB')
    w, h = img.size
    crop_size = min(w, h)
    img = img.crop(((w-crop_size)//2, (h-crop_size)//2, (w+crop_size)//2, (h+crop_size)//2))
    img = img.resize(PORTRAIT_GRID, Image.Resampling.LANCZOS)
    
    img = ImageOps.autocontrast(img.convert('L'), cutoff=1)
    img = ImageEnhance.Contrast(img).enhance(1.3)
    img = img.filter(ImageFilter.UnsharpMask(radius=3, percent=140))
    
    img_array = np.array(img, dtype=float)
    threshold = 200 if is_dark_mode else 50
    mask = img_array < threshold if is_dark_mode else img_array > threshold
    mask = binary_closing(mask, structure=np.ones((5,5)))
    mask = binary_fill_holes(mask)
    
    labeled, num_features = label(mask)
    if num_features > 0:
        sizes = np.bincount(labeled.ravel()); sizes[0] = 0
        mask = labeled == sizes.argmax()
    elif is_dark_mode:
        mask = np.ones_like(mask, dtype=bool)

    h_img, w_img = img_array.shape
    out_dots = []
    for y in range(h_img):
        x_range = range(w_img) if y % 2 == 0 else range(w_img-1, -1, -1)
        for x in x_range:
            old_val = img_array[y, x]
            if is_dark_mode and not mask[y, x]:
                new_val = 0
            else:
                new_val = 255 if old_val >= 128 else 0
                
            if (is_dark_mode and new_val == 255) or (not is_dark_mode and new_val == 0):
                out_dots.append([x, y])
                
            err = old_val - new_val
            if y % 2 == 0:
                if x + 1 < w_img: img_array[y, x+1] += err * 7/16
                if y + 1 < h_img:
                    if x > 0: img_array[y+1, x-1] += err * 3/16
                    img_array[y+1, x] += err * 5/16
                    if x + 1 < w_img: img_array[y+1, x+1] += err * 1/16
            else:
                if x - 1 >= 0: img_array[y, x-1] += err * 7/16
                if y + 1 < h_img:
                    if x + 1 < w_img: img_array[y+1, x+1] += err * 3/16
                    img_array[y+1, x] += err * 5/16
                    if x - 1 >= 0: img_array[y+1, x-1] += err * 1/16
    return np.array(out_dots)

def build_svg(dots, is_dark_mode):
    pal = PALETTE_DARK if is_dark_mode else PALETTE_LIGHT
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}" style="background:{pal["bg"]}; font-family: monospace;">\n'
    
    # Chrome
    svg += f'<rect x="20" y="20" width="{WIDTH-40}" height="{HEIGHT-40}" rx="8" fill="none" stroke="{pal["chrome"]}" stroke-width="2"/>\n'
    svg += f'<text x="40" y="45" fill="{pal["chrome"]}" font-size="14">profile.sh --live</text>\n'
    
    # Text Panel (SYSTEM.INFO)
    start_x, start_y = 480, 100
    svg += f'<text x="{start_x}" y="{start_y-30}" fill="{pal["accent"]}" font-size="13" font-weight="bold">SYSTEM.INFO</text>\n'
    
    y_offset = start_y
    for k, v in DETAILS.items():
        leader = '.' * max(1, 60 - len(k) - len(v))
        svg += f'<text x="{start_x}" y="{y_offset}" fill="{pal["text"]}" font-size="14" textLength="600" lengthAdjust="spacingAndGlyphs">{k} {leader} {v}</text>\n'
        y_offset += 23
        if k in ['ToolChain', 'Core.Infra']:
            y_offset += 15
            
    # Dots Portrait
    svg += f'<g transform="translate(60, 100)" fill="{pal["portrait"]}">'
    path_d = ""
    for d in dots:
        path_d += f"M{d[0]} {d[1]}h1 "
    svg += f'<path d="{path_d}" shape-rendering="crispEdges"/>'
    svg += '</g>\n</svg>'
    
    return svg

if __name__ == "__main__":
    dots = process_portrait("profile.jpg", True)
    with open("dark.svg", "w") as f: f.write(build_svg(dots, True))
    
    dots_light = process_portrait("profile.jpg", False)
    with open("light.svg", "w") as f: f.write(build_svg(dots_light, False))
    print("Generated dark.svg and light.svg")
