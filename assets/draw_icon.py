from PIL import Image, ImageDraw

S = 512
img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(img)

# 渐变背景
top = (169, 135, 255)
bot = (124, 58, 237)
for y in range(S):
    t = y / S
    r = int(top[0] + (bot[0] - top[0]) * t)
    g = int(top[1] + (bot[1] - top[1]) * t)
    b = int(top[2] + (bot[2] - top[2]) * t)
    d.line([(0, y), (S, y)], fill=(r, g, b, 255))

# 圆角遮罩
mask = Image.new("L", (S, S), 0)
md = ImageDraw.Draw(mask)
md.rounded_rectangle([16, 16, S - 16, S - 16], radius=110, fill=255)
img.putalpha(mask)

# 白色幽灵身体
body = ImageDraw.Draw(img)
body.rounded_rectangle([116, 120, 396, 372], radius=80, fill=(255, 255, 255, 255))
# 底部波浪小脚
for cx in (150, 198, 246, 294, 342, 382):
    body.ellipse([cx - 26, 350, cx + 26, 404], fill=(255, 255, 255, 255))

# 眼睛
body.ellipse([190, 230, 230, 270], fill=(109, 40, 217, 255))
body.ellipse([282, 230, 322, 270], fill=(109, 40, 217, 255))
# 高光
body.ellipse([200, 240, 212, 252], fill=(255, 255, 255, 255))
body.ellipse([292, 240, 304, 252], fill=(255, 255, 255, 255))
# 腮红
body.ellipse([160, 286, 196, 316], fill=(251, 207, 232, 230))
body.ellipse([316, 286, 352, 316], fill=(251, 207, 232, 230))
# 微笑
body.arc([222, 286, 290, 330], start=20, end=160, fill=(109, 40, 217, 255), width=10)

# 毕业帽
body.polygon([(196, 150), (256, 116), (316, 150), (256, 184)], fill=(76, 29, 149, 255))
body.rectangle([246, 150, 266, 178], fill=(76, 29, 149, 255))
body.line([(316, 150), (316, 192)], fill=(251, 191, 36, 255), width=6)
body.ellipse([307, 185, 325, 203], fill=(251, 191, 36, 255))

img.save("app/assets/icon-512.png")
img.resize((192, 192), Image.LANCZOS).save("app/assets/icon-192.png")
print("icon png generated")
