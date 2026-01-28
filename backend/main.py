from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from services.stt_service import transcribe_audio
from services.extraction_service import extract_crm_data
from database import init_db, get_db, Interaction
from sqlalchemy.orm import Session
from fastapi import Depends
import shutil
import uuid
import json

init_db()

app = FastAPI(title="Voice CRM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process-voice")
async def process_voice(file: UploadFile = File(...)):
    temp_filename = f"temp_{uuid.uuid4()}.webm"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        transcript = await transcribe_audio(temp_filename)
        extracted_data = await extract_crm_data(transcript)
        
        return {
            "transcript": transcript,
            "data": extracted_data
        }
    except Exception as e:
        print(f"Error processing voice: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

@app.get("/history")
async def get_history(db: Session = Depends(get_db)):
    interactions = db.query(Interaction).order_by(Interaction.created_at.desc()).all()
    results = []
    for item in interactions:
        results.append({
            "id": f"db-{item.id}",
            "input": item.transcript,
            "output": json.loads(item.raw_json) if item.raw_json else {},
            "status": "REAL",
            "created_at": item.created_at.isoformat(),
            "customer_name": item.customer_name,
            "phone": item.phone,
            "city": item.city,
            "locality": item.locality
        })
    return results

@app.post("/history")
async def create_history(payload: dict, db: Session = Depends(get_db)):
    try:
        customer = payload.get("customer", {})
        interaction = payload.get("interaction", {})
        transcript = payload.get("transcript", "")
        
        # Build original extracted_data structure for raw_json
        raw_data = {
            "customer": customer,
            "interaction": interaction
        }

        db_interaction = Interaction(
            transcript=transcript,
            customer_name=customer.get("full_name") or customer.get("customer_name"),
            phone=customer.get("phone"),
            address=customer.get("address"),
            city=customer.get("city"),
            locality=customer.get("locality"),
            summary=interaction.get("summary"),
            raw_json=json.dumps(raw_data)
        )
        db.add(db_interaction)
        db.commit()
        db.refresh(db_interaction)
        return {"id": f"db-{db_interaction.id}", "status": "created"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/history/{record_id}")
async def update_history(record_id: str, updated_data: dict, db: Session = Depends(get_db)):
    # Remove 'db-' prefix if present
    int_id = int(record_id.replace("db-", ""))
    db_item = db.query(Interaction).filter(Interaction.id == int_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Record not found")
    
    # Update fields from the 'output' or top level data
    customer = updated_data.get("customer", {})
    interaction = updated_data.get("interaction", {})
    
    db_item.customer_name = customer.get("full_name") or customer.get("customer_name") or db_item.customer_name
    db_item.phone = customer.get("phone", db_item.phone)
    db_item.address = customer.get("address", db_item.address)
    db_item.city = customer.get("city", db_item.city)
    db_item.locality = customer.get("locality", db_item.locality)
    db_item.summary = interaction.get("summary", db_item.summary)
    
    # Handle direct transcript update if present in payload
    if "transcript" in updated_data:
        db_item.transcript = updated_data["transcript"]
    elif "input" in updated_data:
        db_item.transcript = updated_data["input"]
    
    # Save the full updated JSON back too
    db_item.raw_json = json.dumps(updated_data)
    
    db.commit()
    db.refresh(db_item)
    return {"status": "updated"}

@app.delete("/history/{record_id}")
async def delete_history(record_id: str, db: Session = Depends(get_db)):
    int_id = int(record_id.replace("db-", ""))
    db_item = db.query(Interaction).filter(Interaction.id == int_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Record not found")
    
    db.delete(db_item)
    db.commit()
    return {"status": "deleted"}

@app.get("/")
async def root():
    return {"message": "Voice CRM API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
