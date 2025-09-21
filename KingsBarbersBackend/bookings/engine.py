from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from bookings.models import Base
from pathlib import Path

# Cross-platform SQLite path (use absolute path if needed)
DB_PATH = Path(__file__).resolve().parent / "bookings.db"
DATABASE_URL = "sqlite+aiosqlite:///D:/Coders/KingsBarbers/KingsBarbersBackend/bookings.db"

# Create engine (set echo=True for SQL logs)
engine = create_async_engine(DATABASE_URL, echo=False)

# Async session factory
async_session = sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession
)

# Initialize DB schema
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database initialized.")
