from pydantic import BaseModel

class BookingOut(BaseModel):
    name: str
    phone: str
    email: str
    bookingDate: str
    bookingTime: str
    selectedService: str
    notes: str
    reference: str

    class Config:
        orm_mode = True
