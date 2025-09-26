import os
import numpy as np
from tqdm import tqdm
from utils import *

ROOT = 'asserts/videos/long_videos'

def v2h(frame):
    h = frame.shape[0] // 2
    return np.concatenate([frame[:h], frame[h:]], axis=1)

for video_name in tqdm(os.listdir(ROOT)):
    video_folder = os.path.join(ROOT, video_name)
    if '.' in video_folder:
        continue
    for mask_name in os.listdir(video_folder):
        if not 'demo' in mask_name:
            continue
        i_path = os.path.join(video_folder, mask_name)
        o_path = os.path.join(video_folder, mask_name.replace('demo', 'horizen'))
        frames = read_video(i_path)
        frames = [v2h(x) for x in frames]
        save_video(o_path, frames, 24)