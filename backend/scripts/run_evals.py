import asyncio
import httpx
import json
import pandas as pd
from datetime import datetime
import os

TEST_CASES = [
    "I spoke with customer Amit Verma today. His phone number is 9988776655. He stays at 45 Park Street, Salt Lake, Kolkata. We discussed the demo and next steps.",
    "Met Rajesh Kumar. Phone 9123456789. Address is 12 MG Road, Bangalore. He is interested in the premium plan.",
    "Followed up with Priya Singh at 9876543210. Location: Flat 4B, Sunrise Apartments, Mumbai. Needs a quote for 50 users.",
    "Customer Sunita Rao, phone 8899776655, lives in Chennai, Anna Nagar. Discussion about renewal.",
    "Vikram Shah from Ahmedabad, Vastrapur. 0792345678. Confirmed the order for next week.",
    "Talking to Neha Gupta. 9900887766. Hauz Khas, Delhi. Wants to schedule a training session.",
    "Amitabh Bachchan? No, Amit Sharma from Noida Sec 15. 9888777666. Interested in CRM integration.",
    "Ravi Teja in Hyderabad, Jubilee Hills. 9000112233. Discussed API documentation.",
    "Suresh Raina, Muradnagar. 9555444333. Just a check-in call.",
    "Anjali Menon, Kochi, Edappally. 9444333222. Complained about support response time."
]

async def run_evals():
    results = []
    async with httpx.AsyncClient() as client:
        for i, text in enumerate(TEST_CASES):
            print(f"Running test case {i+1}/{len(TEST_CASES)}...")
            # We mock the process-voice by calling extract directly or using a dummy audio if needed.
            # Here we call a mock/internal extraction to save time for the eval demo.
            try:
                # In a real scenario, we'd send audio. For eval, we test the extraction quality.
                # We'll use a special endpoint /extract-text for evela if available, 
                # or just use the extraction_service directly.
                from services.extraction_service import extract_crm_data
                data = await extract_crm_data(text)
                results.append({
                    "id": i+1,
                    "input": text,
                    "output": data,
                    "status": "PASS" if data['customer']['full_name'] else "FAIL"
                })
            except Exception as e:
                results.append({"id": i+1, "input": text, "error": str(e), "status": "ERROR"})
    
    # Save to JSON for the frontend dashboard
    os.makedirs("../frontend/public", exist_ok=True)
    with open("../frontend/public/eval_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    # Also save to CSV (Excel compatible)
    df = pd.json_normalize(results)
    df.to_csv("eval_results.csv", index=False)
    print("Evals complete. Results saved to frontend/public/eval_results.json and backend/scripts/eval_results.csv")

if __name__ == "__main__":
    import sys
    sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
    asyncio.run(run_evals())
