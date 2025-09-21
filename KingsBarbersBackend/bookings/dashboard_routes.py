from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from bookings.database import get_db
from bookings.models import Booking
from bookings.schemas import BookingOut
from sqlalchemy.future import select
from typing import List

router = APIRouter()

@router.get("/api/bookings", response_model=List[BookingOut])
async def get_all_bookings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Booking).order_by(Booking.bookingDate, Booking.bookingTime)
    )
    return result.scalars().all()
