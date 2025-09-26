#!/usr/bin/env python3
"""
Truncate video to first 20 seconds using ffmpeg
"""
import subprocess
import sys
import os

def truncate_video(input_path, output_path, duration=20):
    """Truncate video to specified duration in seconds"""
    cmd = [
        'ffmpeg',
        '-i', input_path,
        '-t', str(duration),
        '-c', 'copy',  # Copy codec to avoid re-encoding
        '-y',  # Overwrite output file
        output_path
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✓ Successfully truncated {input_path} to {duration}s")
            print(f"  Output: {output_path}")
            return True
        else:
            print(f"✗ Failed to truncate {input_path}")
            print(f"  Error: {result.stderr}")
            return False
    except FileNotFoundError:
        print("✗ ffmpeg not found. Please install ffmpeg first.")
        return False

if __name__ == "__main__":
    # Large video file that needs truncation
    large_video = "asserts/demos/analysis_segmentation/main_object_seg_analysis/woman_seg.mp4"
    
    if os.path.exists(large_video):
        # Create backup
        backup_path = large_video.replace('.mp4', '_original.mp4')
        temp_path = large_video.replace('.mp4', '_temp.mp4')
        
        print(f"Processing: {large_video}")
        print(f"File size: {os.path.getsize(large_video) / (1024*1024):.1f} MB")
        
        # Truncate to temp file
        if truncate_video(large_video, temp_path, 20):
            # Rename original to backup
            os.rename(large_video, backup_path)
            # Rename temp to original
            os.rename(temp_path, large_video)
            
            new_size = os.path.getsize(large_video) / (1024*1024)
            print(f"New file size: {new_size:.1f} MB")
            print(f"Original backed up to: {backup_path}")
        else:
            print("Truncation failed. Original file unchanged.")
            if os.path.exists(temp_path):
                os.remove(temp_path)
    else:
        print(f"File not found: {large_video}")