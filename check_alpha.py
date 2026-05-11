from PIL import Image
import sys

img = Image.open("./assets/fy_3d_bill.png").convert("RGBA")
datas = img.getdata()
transparent_pixels = sum(1 for item in datas if item[3] == 0)
total_pixels = len(datas)
print(f"Transparent pixels: {transparent_pixels}/{total_pixels}")
