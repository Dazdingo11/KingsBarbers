# King's Barbers Booking System

This is my **first full-stack project**, built as part of my learning journey.  
It combines **HTML, CSS, and JavaScript** for the frontend with a **Python FastAPI backend** and an **SQLite database** for data persistence.

---

## Features

- Responsive frontend built with **HTML5, CSS3, and JavaScript**
- Dynamic booking form with date/time validation
- Backend powered by **FastAPI**
- **SQLite database** with SQLAlchemy ORM for handling bookings
- REST API endpoints for managing appointments
- Dashboard for viewing bookings

---

## Project Structure

```
KingsBarbersBackend/
│── static/              # HTML, CSS, JS, images, and videos
│── bookings/            # Booking logic
│── bookings.db          # SQLite database
│── main.py              # FastAPI entrypoint
│── database.py          # Database session setup
│── engine.py            # SQLAlchemy engine configuration
│── models.py            # ORM models
│── schemas.py           # Pydantic schemas
│── dashboard_routes.py  # Dashboard routes
│── requirements.txt     # Python dependencies
│── README.md            # Project documentation
```

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/KingsBarbers.git
cd KingsBarbersBackend
```

### 2. Create a virtual environment and install dependencies
```bash
python -m venv .venv
.venv\Scripts\activate   # On Windows
pip install -r requirements.txt
```

### 3. Start the server
```bash
uvicorn main:app --reload
```

### 4. Open in browser
```
http://127.0.0.1:8000
```

---

## What I Learned

- **HTML/CSS/JS**: Building a responsive and interactive frontend  
- **Python (FastAPI)**: Developing an API-driven backend  
- **SQL (SQLite with SQLAlchemy)**: Designing and persisting relational data  
- How to connect **frontend forms** to a **backend API** and **store data in a database**  

---

## Screenshot

![Homepage](./static/images/Baber.PNG)


---

## Notes

This was my **first project**, built to practice connecting frontend and backend logic.  
It is not production-ready, but it showcases the core skills I learned in **web development and backend integration**.

