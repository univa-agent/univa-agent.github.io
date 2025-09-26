import os
from tqdm import tqdm
from utils import *

def split(frames):
    w = frames[0].shape[1] // 2
    inputs, edits = [], []
    for frame in frames:
        inputs.append(frame[:,:w])
        edits.append(frame[:,w:])
    return inputs, edits

ROOT = 'asserts/videos/long_videos'
for video_name in tqdm(os.listdir(ROOT)):
    if '.' in video_name:
        continue
    video_folder = os.path.join(ROOT, video_name)
    for x in os.listdir(video_folder):
        if not 'demo' in x:
            continue
        o_inputs = os.path.join(video_folder, x.replace('demo', 'input'))
        o_edits = os.path.join(video_folder, x.replace('demo', 'edit'))
        x = os.path.join(video_folder, x)
        frames = read_video(x)
        inputs, edits = split(frames)
        save_video(o_inputs, inputs)
        save_video(o_edits, edits)