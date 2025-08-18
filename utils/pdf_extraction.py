import logging
import os
import PyPDF2
from docx import Document
from PIL import Image
import io

def extract_text(pdf_path):
    """Extract text using PyPDF2 as primary method"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
        return text
    except Exception as e:
        logging.error(f"PyPDF2 extraction failed: {e}")
        return "Nie udało się wyodrębnić tekstu z PDF. Proszę wkleić tekst CV ręcznie."

logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_path):
    """Extract text from PDF using PyPDF2 (lightweight)"""
    try:
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return ""