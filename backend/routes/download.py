from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from models.analytics import Download, DownloadResponse
from database import get_database
from pathlib import Path

router = APIRouter()

# PDF storage directory
PDF_DIR = Path(__file__).parent.parent / "static" / "pdfs"
PDF_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/protocolo-abs", response_class=FileResponse)
async def download_protocolo_abs(request: Request):
    """
    Download the Protocolo ABS PDF file
    """
    pdf_path = PDF_DIR / "protocolo-abs.pdf"
    
    # Check if PDF exists
    if not pdf_path.exists():
        raise HTTPException(
            status_code=404,
            detail="PDF file not found. Please upload the PDF first."
        )
    
    # Track download
    try:
        db = get_database()
        download_record = Download(
            resource_name="protocolo-abs",
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )
        
        await db.downloads.insert_one(download_record.dict())
    except Exception as e:
        print(f"Error tracking download: {e}")
        # Continue with download even if tracking fails
    
    # Return PDF file
    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename="Protocolo-ABS-Tealor-Mode.pdf"
    )


@router.get("/stats", response_model=DownloadResponse)
async def get_download_stats():
    """
    Get download statistics
    """
    try:
        db = get_database()
        # Count total downloads
        total_downloads = await db.downloads.count_documents(
            {"resource_name": "protocolo-abs"}
        )
        
        return DownloadResponse(
            success=True,
            message="Download stats retrieved successfully",
            download_count=total_downloads
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving stats: {str(e)}")


@router.get("/check-pdf")
async def check_pdf_exists():
    """
    Check if the PDF file exists on the server
    """
    pdf_path = PDF_DIR / "protocolo-abs.pdf"
    
    return {
        "exists": pdf_path.exists(),
        "path": str(pdf_path),
        "message": "PDF is ready for download" if pdf_path.exists() else "PDF not uploaded yet"
    }
