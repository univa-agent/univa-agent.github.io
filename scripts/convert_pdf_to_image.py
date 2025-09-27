#!/usr/bin/env python3
"""
Convert PDF files to PNG images for web display.
"""

import os
import sys
from pathlib import Path

def check_dependencies():
    """Check if required packages are installed."""
    try:
        import fitz  # PyMuPDF
        from PIL import Image
        return True
    except ImportError:
        return False

def install_dependencies():
    """Install required packages."""
    print("Installing required packages...")
    os.system("pip install PyMuPDF Pillow")

def convert_pdf_to_png(pdf_path, output_path, dpi=300):
    """
    Convert a PDF file to PNG image.

    Args:
        pdf_path: Path to the PDF file
        output_path: Path where the PNG will be saved
        dpi: Resolution for the output image
    """
    try:
        import fitz  # PyMuPDF
        from PIL import Image

        # Open the PDF
        pdf_document = fitz.open(pdf_path)

        # Get the first page
        page = pdf_document[0]

        # Convert page to image
        mat = fitz.Matrix(dpi/72, dpi/72)  # Scale factor for DPI
        pix = page.get_pixmap(matrix=mat)

        # Convert to PIL Image
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

        # Save as PNG
        img.save(output_path, "PNG", quality=95)

        pdf_document.close()
        print(f"✓ Converted {pdf_path} to {output_path}")
        return True

    except Exception as e:
        print(f"✗ Error converting {pdf_path}: {str(e)}")
        return False

def main():
    """Main function to convert all PDF figures."""
    # Check and install dependencies if needed
    if not check_dependencies():
        install_dependencies()
        if not check_dependencies():
            print("Failed to install required packages. Please install manually:")
            print("pip install PyMuPDF Pillow")
            return

    # Define PDF files to convert
    pdf_files = [
        "asserts/figures/teaser_v4.pdf",
        "asserts/figures/pipe_v3.pdf",
        "asserts/figures/task_v2.pdf",
        "asserts/figures/mcp_org.pdf"
    ]

    # Convert each PDF
    success_count = 0
    for pdf_file in pdf_files:
        if os.path.exists(pdf_file):
            # Create output PNG path
            png_path = pdf_file.replace('.pdf', '.png')

            if convert_pdf_to_png(pdf_file, png_path):
                success_count += 1
        else:
            print(f"✗ PDF file not found: {pdf_file}")

    print(f"\nConverted {success_count}/{len(pdf_files)} PDF files to PNG images.")

    if success_count == len(pdf_files):
        print("\n🎉 All PDFs converted successfully!")
        print("You can now update your HTML to use the .png files instead of .pdf files.")
    else:
        print(f"\n⚠️  {len(pdf_files) - success_count} files failed to convert.")

if __name__ == "__main__":
    main()