# KingsBarbersBackend/main.py

import os
from bookings.dashboard_routes import router as dashboard_router
from fastapi import FastAPI, Request, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from bookings.database import init_db, insert_booking
import uvicorn

app = FastAPI()

# ✅ CORS for frontend/backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔒 Change this to your actual domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Static files setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(BASE_DIR, "static")
app.mount("/static", StaticFiles(directory=static_dir, html=True), name="static")

# ✅ Initialize DB on app startup
@app.on_event("startup")
async def startup_event():
    await init_db()

# ✅ API endpoint for booking
@app.post("/api/book")
async def book(
    request: Request,
    name: str = Form(...),
    phone: str = Form(...),
    email: str = Form(...),
    bookingDate: str = Form(...),
    bookingTime: str = Form(...),
    selectedService: str = Form(...),
    notes: str = Form("")
):
    print("📥 Incoming booking data:")
    print(f"  Name: {name}")
    print(f"  Phone: {phone}")
    print(f"  Email: {email}")
    print(f"  Date: {bookingDate}")
    print(f"  Time: {bookingTime}")
    print(f"  Service: {selectedService}")
    print(f"  Notes: {notes}")

    try:
        result = await insert_booking(name, phone, email, bookingDate, bookingTime, selectedService, notes)

        # Return result even if it's a DUPLICATE booking
        response = {
            "success": result["reference"] != "DUPLICATE",
            "reference": result["reference"],
            "email": result["email"]
        }

        print("⚙️ Sending response to client:", response)
        return JSONResponse(content=response)

    except Exception as e:
        print("❌ Booking failed:", str(e))
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

# ✅ Serve index.html at root
@app.get("/")
async def serve_homepage():
    return FileResponse(os.path.join(static_dir, "index.html"))

@app.get("/dashboard")
async def serve_dashboard():
    return FileResponse(os.path.join(static_dir, "dashboard.html"))

app.include_router(dashboard_router)


# ✅ Development mode only
if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
