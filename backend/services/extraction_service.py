import os
from groq import AsyncGroq
from dotenv import load_dotenv
import json
from datetime import datetime

load_dotenv()

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """
You are a CRM data extraction assistant. Extract structured details from the provided customer interaction transcript.
If fields are missing, set them to null.
The output MUST be a valid JSON object with the following structure:
{
  "customer": {
    "full_name": string,
    "phone": string,
    "address": string,
    "city": string,
    "locality": string
  },
  "interaction": {
    "summary": string,
    "created_at": string (ISO 8101)
  }
}
"""

async def extract_crm_data(transcript: str):
    if not os.getenv("GROQ_API_KEY"):
        raise ValueError("GROQ_API_KEY is not set in environment variables")

    chat_completion = await client.chat.completions.create(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": transcript}
        ],
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"}
    )
    
    data = json.loads(chat_completion.choices[0].message.content)
    if not data.get("interaction"):
        data["interaction"] = {}
    if not data["interaction"].get("created_at"):
        data["interaction"]["created_at"] = datetime.utcnow().isoformat() + "Z"
        
    return data
