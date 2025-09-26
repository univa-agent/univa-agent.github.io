import os
import cv2
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont

def read_video(path):
    cap = cv2.VideoCapture(path)
    frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)
    cap.release()
    return frames

def read_image(path):
    return [cv2.imread(path)]

def save_video(path, frames, fps=30):
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    h, w, _ = frames[0].shape
    writer = cv2.VideoWriter(path, fourcc, fps, (w, h))
    for frame in frames:
        writer.write(frame)
    writer.release()

def save_image(path, frames):
    cv2.imwrite(path, frames[0])

def read_caption(root, video_name, mask_name):
    if 'remove' in mask_name:
        return 'remove objects and generate areas that blend with the background.'
    caption_path = mask_name.replace('_ori_mask_dilated', '')\
                            .replace('_ori_mask', '')\
                            .replace('_convexHull_mask', '')\
                            .replace('_rectangle_mask', '')\
                            .replace('mask', 'local_caption')\
                            .replace('mp4', 'txt')
    path = os.path.join(root, video_name, 'local_caption/v2',caption_path)
    with open(path, 'r') as f:
        caption = f.readlines()
    caption = [x.strip() for x in caption]
    return ' '.join([x for x in caption if x])

def cv2AddChineseText(img, text, position, textColor=(255,255,255), textSize=30):
    if (isinstance(img, np.ndarray)):  # 判断是否OpenCV图片类型
        img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    # 创建一个可以在给定图像上绘图的对象
    draw = ImageDraw.Draw(img)
    # 字体的格式
    fontStyle = ImageFont.truetype(
        "./misc/black.ttc", textSize, encoding="utf-8")
    # 绘制文本
    draw.text(position, text, textColor, font=fontStyle)
    # 转换回OpenCV格式
    return cv2.cvtColor(np.asarray(img), cv2.COLOR_RGB2BGR)

def create_text_bar(text, width, font_size=20):
    n_char_per_line = width // font_size - 1
    n_lines = math.ceil(len(text) / n_char_per_line)
    text_image = np.zeros(((n_lines + 1) * font_size, width, 3), dtype=np.uint8)
    for i in range(n_lines):
        line = text[i*n_char_per_line:(i+1)*n_char_per_line]
        text_image = cv2AddChineseText(text_image, line, (font_size // 2, font_size * (i + 0.5)), textSize=font_size)
    return text_image

def approximate_matching(path):
    folder = os.path.dirname(path)
    if not os.path.exists(folder):
        return None
    name = path.split('/')[-1].split('.')[0]
    for x in os.listdir(folder):
        y = x.split('.')[0]
        z = '_'.join(y.split('_')[:-1])
        if name == y or name == z:
            return os.path.join(folder, x)
    return None

def bp(frames1, frames2):
    val = 0
    t = len(frames1)
    for x, y in zip(frames1, frames2):
        val += abs(x - y).mean()
    return val / t