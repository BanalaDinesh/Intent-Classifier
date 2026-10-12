# Backend – Enterprise Structured Ingestion Firewall

## Overview

The backend is a REST API built with FastAPI that processes user messages using a Groq-hosted language model and returns structured, validated JSON.

It uses Instructor to request model output in a predefined Pydantic format. This reduces inconsistent response structures and makes the results easier for other applications to consume.

The backend is responsible for request validation, AI-powered message classification, schema enforcement, token estimation, and API error handling.

## Technology Stack

- **Python** – Core application language
- **FastAPI** – REST API framework
- **Uvicorn** – ASGI server
- **Groq** – Language model API
- **Instructor** – Structured LLM output generation
- **Pydantic** – Request and response validation
- **python-dotenv** – Environment variable loading
- **tiktoken** – Input token estimation
- **pytest and HTTPX** – Testing dependencies

## Features

- Accepts user messages through a REST endpoint.
- Validates incoming requests using Pydantic.
- Classifies messages into predefined intent categories.
- Generates risk profile and priority assessments.
- Identifies whether a request requires further action.
- Produces a concise summary of the message.
- Validates the AI response against a strict schema.
- Estimates input token usage locally.
- Provides health-check and interactive API documentation endpoints.
- Returns controlled error responses for invalid input and AI service failures.

## Project Structure

```text
backend/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── schemas/
│   │   └── ingestion.py
│   ├── services/
│   │   └── llm_service.py
│   └── utils/
│       └── token_counter.py
├── tests/          # Reserved for future automated tests 
├── .env.example
├── requirements.txt
└── README.md
```

### Main Modules

| File | Responsibility |
|---|---|
| `app/main.py` | Defines API endpoints, CORS, validation flow, and error handling |
| `app/config.py` | Loads Groq configuration from environment variables |
| `app/schemas/ingestion.py` | Defines request, response, and token metadata schemas |
| `app/services/llm_service.py` | Calls the Groq model through Instructor |
| `app/utils/token_counter.py` | Estimates input tokens using `tiktoken` or a fallback |

## Message Processing Workflow

1. The API receives a message through `POST /api/analyze`.
2. Pydantic validates the request and rejects invalid or blank messages.
3. The message is passed to the LLM service.
4. Instructor requests a response matching the `IngestionResult` schema.
5. Pydantic validates the generated structure and field values.
6. The backend estimates the input token count.
7. The API returns the structured result as JSON.

## API Endpoints

### 1. Health Check

**Endpoint:** `GET /health`

Example response:

```json
{
  "status": "ok",
  "message": "Ingestion Firewall API is running"
}
```

### 2. Analyze Message

**Endpoint:** `POST /api/analyze`

Content type: `application/json`

Request:

```json
{
  "message": "Where is my order?"
}
```

Response structure:

```json
{
  "intent": "order_tracking",
  "risk_profile": "medium",
  "priority": "low",
  "requires_action": true,
  "summary": "The user is asking for an order update.",
  "token_metadata": {
    "estimated_input_tokens": 6,
    "note": "Estimated locally; may differ from provider token counts."
  }
}
```

This is an illustrative response. Actual values depend on the model's classification.

## Response Schema

| Field | Type | Description |
|---|---|---|
| `intent` | String enum | Classified message category |
| `risk_profile` | String enum | `low`, `medium`, `high`, or `unknown` |
| `priority` | String enum | `low`, `medium`, or `high` |
| `requires_action` | Boolean | Indicates whether additional service or follow-up may be needed |
| `summary` | String | Brief description of the user's request |
| `token_metadata` | Object | Estimated input tokens and an explanatory note |

Supported intent values:

- `greeting`
- `order_tracking`
- `payment_issue`
- `current_time`
- `general_question`
- `unknown`

## Installation and Setup

### Prerequisites

- Python 3.10 or later
- A valid Groq API key
- Internet connectivity for the hosted model API

### 1. Create a virtual environment

Run these commands from the `backend` directory:

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

On macOS or Linux:

```bash
source .venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a local `.env` file by copying `.env.example`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS or Linux:

```bash
cp .env.example .env
```

Configure the following variables:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
```

Replace the placeholder with your own API key. Ensure the selected model is available to your Groq account.

**Security:** Never commit your actual API key to GitHub.

### 4. Run the API

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

The API will be available at:

`http://127.0.0.1:8000`

## API Documentation

FastAPI generates interactive API documentation automatically.

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`
- OpenAPI JSON: `http://127.0.0.1:8000/openapi.json`

## Error Handling

| HTTP status | Meaning |
|---|---|
| `200 OK` | Request processed successfully |
| `422 Unprocessable Entity` | Request validation failed |
| `502 Bad Gateway` | LLM request failed or structured output did not pass validation |

The API returns a controlled error message for model failures. Check the local server logs for troubleshooting details.

## Testing

Automated tests have not yet been implemented in this project.

The backend can be extended with **pytest** and **HTTPX** to support automated unit testing and API integration testing.

Potential test cases include:
- Request validation for empty or invalid messages.
- Health-check endpoint availability.
- Message classification and structured response validation.
- Error handling for model API failures.

A dedicated `tests/` directory can be created when automated test scripts are introduced.

## Important Notes

- The token count is an estimate and may differ from the provider's reported usage.
- The application classifies messages; it does not actually retrieve orders or payments.
- CORS is currently configured permissively for local development. Restrict allowed origins for production.
- Consider adding authentication, rate limiting, timeouts, and monitoring before public deployment.

## Future Enhancements

- Add automated unit and integration tests.
- Add retry policies and clearer handling for rate limits.
- Introduce structured application logging.
- Add configurable CORS and deployment settings.
- Integrate real customer-support services when required.
- Add support for more intents and custom classification schemas.

## Related Documentation

- [Root Project README](../README.md)
- [Frontend README](../frontend/README.md)
