import fitz
import os

pdf_path = r'C:\Users\RAJARAJAN\Downloads\fsd final.pdf'
doc = fitz.open(pdf_path)
print(f"Total Pages: {len(doc)}")
p0 = doc[0]
print(f"Page 1 rect: width={p0.rect.width}, height={p0.rect.height} (A4 is 595.32 x 841.92)")

os.makedirs('extracted_assets', exist_ok=True)

# Check fonts used on pages 1, 2, 4, 11
for pno in [0, 1, 3, 10]:
    page = doc[pno]
    text_page = page.get_text("dict")
    fonts = set()
    for block in text_page.get("blocks", []):
        for line in block.get("lines", []):
            for span in line.get("spans", []):
                fonts.add((span.get("font"), span.get("size")))
    print(f"Page {pno+1} fonts/sizes sample: {list(fonts)[:8]}")

# Extract all images from the PDF
image_count = 0
for i, page in enumerate(doc):
    for img_index, img in enumerate(page.get_images()):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image['image']
        image_ext = base_image['ext']
        img_name = f'extracted_assets/img_p{i+1}_{img_index}_{xref}.{image_ext}'
        with open(img_name, 'wb') as f:
            f.write(image_bytes)
        image_count += 1
        if i < 5:
            print(f"Saved: {img_name} ({base_image['width']}x{base_image['height']})")

print(f"Total images extracted: {image_count}")
