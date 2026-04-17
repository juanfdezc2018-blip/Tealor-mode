from fastapi import APIRouter, HTTPException, UploadFile, File
from pathlib import Path
import shutil

router = APIRouter()

# PDF storage directory
PDF_DIR = Path(__file__).parent.parent / "static" / "pdfs"
PDF_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload the Protocolo ABS PDF file
    Admin endpoint to upload the PDF
    """
    try:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Save file
        pdf_path = PDF_DIR / "protocolo-abs.pdf"
        
        with open(pdf_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        return {
            "success": True,
            "message": "PDF uploaded successfully",
            "filename": "protocolo-abs.pdf"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading PDF: {str(e)}")


@router.delete("/delete-pdf")
async def delete_pdf():
    """
    Delete the Protocolo ABS PDF file
    Admin endpoint
    """
    try:
        pdf_path = PDF_DIR / "protocolo-abs.pdf"
        
        if pdf_path.exists():
            pdf_path.unlink()
            return {
                "success": True,
                "message": "PDF deleted successfully"
            }
        else:
            raise HTTPException(status_code=404, detail="PDF file not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting PDF: {str(e)}")
