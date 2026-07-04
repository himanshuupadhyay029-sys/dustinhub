import shutil
import os

src = r"C:\Users\Asus\.gemini\antigravity-ide\brain\acbcf05c-cd50-48f4-9fb7-8508051cba85\media__1783171780027.png"
dest_dir = r"c:\Users\Asus\Desktop\Development\himeshnetflix\frontend\public"
dest = os.path.join(dest_dir, "logo.png")

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

try:
    shutil.copy(src, dest)
    print("Logo copied successfully to frontend/public/logo.png!")
except Exception as e:
    print(f"Error copying logo: {e}")
