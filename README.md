# Intent Classifier

An AI-powered message classification system that transforms natural-language messages into structured, schema-validated JSON. The application uses a FastAPI backend, Groq-hosted language models, Instructor, and Pydantic to produce consistent outputs that downstream applications can process reliably.

## Overview

The Enterprise Structured Ingestion Firewall demonstrates how unstructured user messages can be processed into standardized data before being passed to other application services.

Users submit a message through a web interface. The backend sends it to a language model for classification, validates the generated response against a predefined Pydantic schema, estimates the input token count, and returns structured JSON to the frontend.

The application focuses on message understanding, structured data generation, and output validation. It does not directly execute order lookups, payment processing, or live-time retrieval.

## Features

- **AI-powered intent classification** for customer-support messages.
- **Risk profiling** to categorize messages by their potential risk level.
- **Priority assessment** based on the urgency expressed in a message.
- **Action requirement detection** to identify requests that may need additional tools or follow-up.
- **Structured JSON responses** using predefined Pydantic models.
- **Schema validation** to enforce consistent output fields and allowed values.
- **Input token estimation** using `tiktoken`, with a fallback estimator.
- **Interactive web interface** for submitting messages and viewing results.
- **Quick examples** for greetings, order tracking, payment issues, and current-time requests.
- **Copy JSON functionality** for reusing analysis results.
- **API health endpoint** for basic backend availability checks.

## Technology Stack

### Backend
- Python
- FastAPI
- Uvicorn
- Groq API
- Instructor
- Pydantic
- python-dotenv
- tiktoken

### Frontend
- HTML5
- CSS3
- JavaScript
- Fetch API

## Supported Intent Categories

| Intent | Description |
|---|---|
| `greeting` | Greetings and casual conversation |
| `order_tracking` | Questions about orders and deliveries |
| `payment_issue` | Billing, refunds, payment failures, or duplicate charges |
| `current_time` | Requests asking for the current time |
| `general_question` | General questions outside the other categories |
| `unknown` | Unclear or unsupported requests |

The result also includes a risk profile, priority, action requirement, summary, and estimated input token count.

## System Architecture

```text
                User
                 |
                 v
       HTML / CSS / JavaScript
                 |
          POST /api/analyze
                 |
                 v
          FastAPI Backend
                 |
                 v
        Groq Language Model
                 |
                 v
      Instructor + Pydantic
        Structured Output
                 |
                 v
       Token Count Estimation
                 |
                 v
        Validated JSON Result
                 |
                 v
           Web Interface
```

## Project Structure

```text
Intent/
├── README.md
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── schemas/
│   │   │   └── ingestion.py
│   │   ├── services/
│   │   │   └── llm_service.py
│   │   └── utils/
│   │       └── token_counter.py
│   ├── tests/                # Reserved for future automated tests               
│   ├── .env.example
│   ├── requirements.txt
│   └── README.md
└── frontend/
    ├── index.html
    ├── style.css
    ├── script.js
    └── README.md
```

## Getting Started

### Prerequisites

- Python 3.10 or later
- A Groq API key
- A modern web browser
- Git (optional)

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Intent
```

### 2. Set up the backend

```bash
cd backend
python -m venv .venv
```

Activate the environment on Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create your environment file:

```powershell
Copy-Item .env.example .env
```

Add your Groq API key and model name to `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
```

Start the API from the `backend` directory:

```bash
uvicorn app.main:app --reload
```

The backend runs at `http://127.0.0.1:8000`.

### 3. Verify the backend

- Health check: `http://127.0.0.1:8000/health`
- Interactive API documentation: `http://127.0.0.1:8000/docs`
- OpenAPI schema: `http://127.0.0.1:8000/openapi.json`

### 4. Start the frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
python -m http.server 5500
```

Open `http://127.0.0.1:5500` in your browser.

Keep the backend running while using the frontend.

## API Reference

### Health Check

`GET /health`

Returns a basic API health status.

### Analyze Message

`POST /api/analyze`

Request body:

```json
{
  "message": "My payment was deducted twice. Please help urgently."
}
```

Example response:

```json
{
  "intent": "payment_issue",
  "risk_profile": "medium",
  "priority": "high",
  "requires_action": true,
  "summary": "The user reports a duplicate payment and requests urgent assistance.",
  "token_metadata": {
    "estimated_input_tokens": 12,
    "note": "Estimated locally; may differ from provider token counts."
  }
}
```

The example response is illustrative. Actual classification values and token counts depend on the submitted message and model output.

## Error Handling

The API validates incoming messages and returns appropriate HTTP errors for invalid input. It also handles model failures and structured-output validation failures without intentionally exposing API credentials.

- `422 Unprocessable Entity`: Invalid request or empty message.
- `502 Bad Gateway`: Model request failure or schema-validation failure.


## Component Documentation

- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)

## Future Improvements

- Add automated unit and integration tests.
- Introduce configurable CORS origins.
- Add request logging and monitoring.
- Support additional intent categories and domain-specific schemas.
- Integrate downstream services for order tracking and payment support.
- Add authentication and rate limiting for production use.

---

**Built with Python, FastAPI, Groq, Instructor, Pydantic, HTML, CSS, and JavaScript.**
