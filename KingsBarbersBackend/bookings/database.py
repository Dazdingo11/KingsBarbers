from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.future import select
from bookings.models import Booking, Base
import random
import string
import traceback

DATABASE_URL = "sqlite+aiosqlite:///./bookings.db"

# 🚀 Engine and session factory
engine = create_async_engine(DATABASE_URL, echo=True)
async_session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

# 🔁 Generate a booking reference like KING-1A2B3C
def generate_reference() -> str:
    return "KING-" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

# ❓ Check if booking with reference already exists
async def booking_exists(ref: str) -> bool:
    async with async_session() as session:
        result = await session.execute(select(Booking).where(Booking.reference == ref))
        exists = result.scalar_one_or_none() is not None
        print(f"🔍 Checking if reference exists [{ref}]:", exists)
        return exists

# 🔄 Try to generate a unique reference up to 10 times
async def generate_unique_reference() -> str:
    for attempt in range(10):
        ref = generate_reference()
        if not await booking_exists(ref):
            print(f"✅ Unique reference generated on attempt {attempt + 1}: {ref}")
            return ref
    raise Exception("❌ Could not generate a unique booking reference after 10 attempts.")

# 📝 Insert booking data into the database
async def insert_booking(name: str, phone: str, email: str, bookingDate: str, bookingTime: str, selectedService: str, notes: str):
    try:
        print("📥 Incoming booking data:")
        print(f"  Name: {name}")
        print(f"  Phone: {phone}")
        print(f"  Email: {email}")
        print(f"  Date: {bookingDate}")
        print(f"  Time: {bookingTime}")
        print(f"  Service: {selectedService}")
        print(f"  Notes: {notes}")

        async with async_session() as session:
            # 🛡️ Block duplicate bookings (same email, date, time)
            result = await session.execute(
                select(Booking).where(
                    Booking.email == email,
                    Booking.bookingDate == bookingDate,
                    Booking.bookingTime == bookingTime
                )
            )
            if result.scalar_one_or_none():
                print("⚠️ Duplicate booking detected — skipping insert")
                return {"success": True, "reference": "DUPLICATE", "email": email}

            # ✅ Safe to insert
            reference = await generate_unique_reference()

            booking = Booking(
                name=name,
                phone=phone,
                email=email,
                bookingDate=bookingDate,
                bookingTime=bookingTime,
                selectedService=selectedService,
                notes=notes,
                reference=reference
            )

            print("🛠️ About to INSERT booking into database")
            session.add(booking)
            await session.commit()

            print(f"✅ Booking inserted: {booking}")
            result = {"success": True, "reference": reference, "email": email}
            print("📤 Booking insert result:", result)
            return result

    except Exception as e:
        print("❌ Exception during insert_booking():")
        traceback.print_exc()
        return {"success": False, "error": str(e)}

# 🧱 Initialize the database schema
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        print("✅ Database initialized")

from bookings.engine import async_session
from typing import AsyncGenerator

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session
