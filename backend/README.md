# Flux CRM - Backend API

FastAPI-based backend service for the Flux CRM application, providing voice transcription, AI-powered data extraction, and customer interaction management.

## 🏗️ Architecture

This backend service provides:
- **Voice Processing**: Audio file upload and transcription
- **AI Data Extraction**: Intelligent extraction of customer information from transcripts
- **RESTful API**: Complete CRUD operations for customer interactions
- **Database Management**: SQLite database with SQLAlchemy ORM

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

## 🚀 Quick Start

1. **Navigate to the backend directory**:
```bash
cd backend
```

2. **Create a virtual environment** (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**:

Create a `.env` file in the backend directory:
```env
# Required: AI Service API Key
GROQ_API_KEY=your_groq_api_key_here

# Optional: Database Configuration
DATABASE_URL=sqlite:///./voice_crm.db

# Optional: Server Configuration
HOST=0.0.0.0
PORT=8000
```

5. **Run the server**:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## 📦 Dependencies

- **fastapi** - Modern web framework for building APIs
- **uvicorn** - ASGI server for running FastAPI
- **python-multipart** - File upload support
- **groq** - AI service integration for transcription and extraction
- **python-dotenv** - Environment variable management
- **pydantic** - Data validation and settings management
- **sqlalchemy** - SQL toolkit and ORM
- **pytest** - Testing framework
- **httpx** - HTTP client for testing

## 🗄️ Database Schema

### Interactions Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer | Primary key |
| `transcript` | Text | Full transcription of the voice recording |
| `customer_name` | String | Extracted customer name |
| `phone` | String | Customer phone number |
| `address` | Text | Customer address |
| `city` | String | Customer city |
| `locality` | String | Customer locality/neighborhood |
| `summary` | Text | Summary of the interaction |
| `raw_json` | Text | Complete extracted data in JSON format |
| `created_at` | DateTime | Timestamp of record creation |

## 🔌 API Endpoints

### Health Check
```http
GET /
```
Returns API status message.

**Response**:
```json
{
  "message": "Voice CRM API is running"
}
```

---

### Process Voice Recording
```http
POST /process-voice
```
Upload and process a voice recording to extract customer information.

**Request**:
- Content-Type: `multipart/form-data`
- Body: Audio file (webm format)

**Response**:
```json
{
  "transcript": "Customer conversation transcript...",
  "data": {
    "customer": {
      "full_name": "John Doe",
      "phone": "+1234567890",
      "address": "123 Main St",
      "city": "New York",
      "locality": "Manhattan"
    },
    "interaction": {
      "summary": "Customer inquiry about product..."
    }
  }
}
```

---

### Get Interaction History
```http
GET /history
```
Retrieve all customer interactions, ordered by most recent first.

**Response**:
```json
[
  {
    "id": "db-1",
    "input": "Transcript text...",
    "output": {
      "customer": {...},
      "interaction": {...}
    },
    "status": "REAL",
    "created_at": "2024-01-28T12:00:00",
    "customer_name": "John Doe",
    "phone": "+1234567890",
    "city": "New York",
    "locality": "Manhattan"
  }
]
```

---

### Create Interaction
```http
POST /history
```
Manually create a new customer interaction record.

**Request Body**:
```json
{
  "transcript": "Conversation transcript...",
  "customer": {
    "full_name": "Jane Smith",
    "phone": "+0987654321",
    "address": "456 Oak Ave",
    "city": "Los Angeles",
    "locality": "Downtown"
  },
  "interaction": {
    "summary": "Follow-up call about order status"
  }
}
```

**Response**:
```json
{
  "id": "db-2",
  "status": "created"
}
```

---

### Update Interaction
```http
PUT /history/{record_id}
```
Update an existing interaction record.

**Parameters**:
- `record_id` - The interaction ID (e.g., "db-1" or "1")

**Request Body**:
```json
{
  "customer": {
    "full_name": "John Doe Updated",
    "phone": "+1234567890"
  },
  "interaction": {
    "summary": "Updated summary..."
  }
}
```

**Response**:
```json
{
  "status": "updated"
}
```

---

### Delete Interaction
```http
DELETE /history/{record_id}
```
Delete an interaction record.

**Parameters**:
- `record_id` - The interaction ID (e.g., "db-1" or "1")

**Response**:
```json
{
  "status": "deleted"
}
```

## 🔧 Project Structure

```
backend/
├── main.py              # FastAPI application and endpoints
├── database.py          # Database models and configuration
├── requirements.txt     # Python dependencies
├── pyproject.toml      # Project configuration
├── services/           # Business logic services
│   ├── stt_service.py      # Speech-to-text transcription
│   └── extraction_service.py # AI data extraction
├── scripts/            # Utility scripts
└── voice_crm.db        # SQLite database (auto-generated)
```

## 🧪 Testing

Run tests using pytest:
```bash
pytest
```

## 🔐 Security Notes

- The API currently allows all CORS origins (`*`) for development
- For production, update CORS settings in `main.py` to restrict origins
- Store API keys securely in `.env` file (never commit to version control)
- Add `.env` to `.gitignore`

## 🚀 Production Deployment

### Using Uvicorn directly:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Using Gunicorn with Uvicorn workers:
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Environment Variables for Production:
```env
GROQ_API_KEY=your_production_api_key
DATABASE_URL=postgresql://user:pass@host:port/dbname  # For PostgreSQL
HOST=0.0.0.0
PORT=8000
```

## 📝 Development Tips

1. **Auto-reload during development**: The server automatically reloads when you save changes
2. **API Documentation**: Visit `http://localhost:8000/docs` for interactive Swagger UI
3. **Alternative API docs**: Visit `http://localhost:8000/redoc` for ReDoc documentation
4. **Database inspection**: Use SQLite browser tools to inspect `voice_crm.db`

## 🐛 Troubleshooting

### Import errors
```bash
pip install -r requirements.txt --upgrade
```

### Database issues
Delete `voice_crm.db` and restart the server to recreate the database:
```bash
rm voice_crm.db
python main.py
```

### Port already in use
Change the port in `main.py` or kill the process using port 8000:
```bash
lsof -ti:8000 | xargs kill -9
```

## 🔮 Future Enhancements

- [ ] PostgreSQL support for production
- [ ] Authentication and authorization
- [ ] Rate limiting
- [ ] Caching layer (Redis)
- [ ] Background task processing (Celery)
- [ ] Comprehensive test coverage
- [ ] API versioning
- [ ] Webhook support

## 📄 License

MIT License - See main project README for details.
