from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=False)
    bookingDate = Column(String, nullable=False)
    bookingTime = Column(String, nullable=False)
    selectedService = Column(String, nullable=False)
    notes = Column(String, nullable=True)
    reference = Column(String, unique=True, nullable=False)

    def __repr__(self):
        return (
            f"<Booking(name='{self.name}', "
            f"date='{self.bookingDate}', time='{self.bookingTime}', "
            f"reference='{self.reference}')>"
        )
