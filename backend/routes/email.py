from fastapi import APIRouter, HTTPException, Request
from models.email import EmailCapture, EmailCaptureRequest, EmailCaptureResponse, EmailListResponse
from database import get_database
from datetime import datetime
import csv
from io import StringIO
from fastapi.responses import StreamingResponse

router = APIRouter()


@router.post("/capture", response_model=EmailCaptureResponse)
async def capture_email(request: Request, data: EmailCaptureRequest):
    """
    Capture email address for lead generation
    """
    try:
        db = get_database()
        
        # Check if email already exists (optional - allow multiple submissions)
        existing = await db.emails.find_one({"email": data.email})
        
        if existing:
            # Update timestamp of existing email
            await db.emails.update_one(
                {"email": data.email},
                {"$set": {"timestamp": datetime.utcnow()}}
            )
            return EmailCaptureResponse(
                success=True,
                message="Email actualizado correctamente",
                email=data.email
            )
        
        # Create new email capture
        email_capture = EmailCapture(
            email=data.email,
            source=data.source,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )
        
        await db.emails.insert_one(email_capture.dict())
        
        return EmailCaptureResponse(
            success=True,
            message="Email capturado correctamente",
            email=data.email
        )
        
    except Exception as e:
        print(f"Error capturing email: {e}")
        raise HTTPException(status_code=500, detail=f"Error capturing email: {str(e)}")


@router.get("/list", response_model=EmailListResponse)
async def get_email_list(limit: int = 100, skip: int = 0):
    """
    Get list of captured emails (admin endpoint)
    """
    try:
        db = get_database()
        
        # Get total count
        total = await db.emails.count_documents({})
        
        # Get emails with pagination
        emails = await db.emails.find(
            {},
            {"_id": 0}
        ).sort("timestamp", -1).skip(skip).limit(limit).to_list(limit)
        
        return EmailListResponse(
            success=True,
            total_emails=total,
            emails=emails
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving emails: {str(e)}")


@router.get("/export/csv")
async def export_emails_csv():
    """
    Export emails to CSV format for Mailchimp/Beehiiv integration
    """
    try:
        db = get_database()
        
        # Get all emails
        emails = await db.emails.find({}, {"_id": 0}).sort("timestamp", -1).to_list(10000)
        
        # Create CSV
        output = StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow(['Email', 'Source', 'Timestamp', 'Downloaded_PDF'])
        
        # Data
        for email in emails:
            writer.writerow([
                email.get('email'),
                email.get('source', 'landing_page'),
                email.get('timestamp', ''),
                email.get('downloaded_pdf', False)
            ])
        
        output.seek(0)
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={
                "Content-Disposition": "attachment; filename=tealor_mode_emails.csv"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting emails: {str(e)}")


@router.get("/stats")
async def get_email_stats():
    """
    Get email capture statistics
    """
    try:
        db = get_database()
        
        # Total emails
        total = await db.emails.count_documents({})
        
        # Emails by source
        pipeline = [
            {
                "$group": {
                    "_id": "$source",
                    "count": {"$sum": 1}
                }
            }
        ]
        
        by_source = await db.emails.aggregate(pipeline).to_list(100)
        
        # Emails with PDF downloaded
        downloaded = await db.emails.count_documents({"downloaded_pdf": True})
        
        return {
            "success": True,
            "total_emails": total,
            "emails_by_source": by_source,
            "downloaded_pdf": downloaded,
            "conversion_rate": round((downloaded / total * 100), 2) if total > 0 else 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving stats: {str(e)}")


@router.post("/mark-downloaded/{email}")
async def mark_pdf_downloaded(email: str):
    """
    Mark email as having downloaded the PDF
    """
    try:
        db = get_database()
        
        result = await db.emails.update_one(
            {"email": email},
            {"$set": {"downloaded_pdf": True}}
        )
        
        if result.modified_count > 0:
            return {"success": True, "message": "PDF download marked"}
        else:
            return {"success": False, "message": "Email not found"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating email: {str(e)}")
