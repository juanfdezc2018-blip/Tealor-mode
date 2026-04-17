from fastapi import APIRouter, HTTPException, Request
from models.analytics import ClickTrack, TrackResponse
from pydantic import BaseModel
from database import get_database

router = APIRouter()


class TrackClickRequest(BaseModel):
    button_type: str
    button_name: str


@router.post("/click", response_model=TrackResponse)
async def track_click(request: Request, data: TrackClickRequest):
    """
    Track button clicks for analytics
    """
    try:
        db = get_database()
        click_record = ClickTrack(
            button_type=data.button_type,
            button_name=data.button_name,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent")
        )
        
        await db.clicks.insert_one(click_record.dict())
        
        return TrackResponse(
            success=True,
            message="Click tracked successfully"
        )
    except Exception as e:
        print(f"Error tracking click: {e}")
        raise HTTPException(status_code=500, detail=f"Error tracking click: {str(e)}")


@router.get("/stats")
async def get_click_stats():
    """
    Get click statistics grouped by button type and name
    """
    try:
        db = get_database()
        # Aggregate clicks by button name
        pipeline = [
            {
                "$group": {
                    "_id": {
                        "button_type": "$button_type",
                        "button_name": "$button_name"
                    },
                    "count": {"$sum": 1}
                }
            },
            {
                "$sort": {"count": -1}
            }
        ]
        
        results = await db.clicks.aggregate(pipeline).to_list(100)
        
        # Format results
        stats = []
        for result in results:
            stats.append({
                "button_type": result["_id"]["button_type"],
                "button_name": result["_id"]["button_name"],
                "clicks": result["count"]
            })
        
        return {
            "success": True,
            "stats": stats,
            "total_clicks": sum(s["clicks"] for s in stats)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving stats: {str(e)}")
