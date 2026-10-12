
const API_URL = "http://127.0.0.1:8000";

const messageInput = document.getElementById("message");
const submitButton = document.getElementById("submit");
const buttonLabel = document.querySelector(".button-label");
const statusText = document.getElementById("status");
const result = document.getElementById("result");
const copyButton = document.getElementById("copy");
const charCount = document.getElementById("char-count");
const validationBanner = document.getElementById("validation-banner");
const validationTitle = document.getElementById("validation-title");
const validationDetail = document.getElementById("validation-detail");
const backendState = document.getElementById("backend-state");

const initialResult = "Your structured result will appear here.";

// Update character count
messageInput.addEventListener("input", () => {
  charCount.textContent = messageInput.value.length;
});

// Example message buttons
document.querySelectorAll(".example").forEach((button) => {
  button.addEventListener("click", () => {
    messageInput.value = button.dataset.message;
    charCount.textContent = messageInput.value.length;
    messageInput.focus();
  });
});

function setValidationState(type, title, detail) {
  validationBanner.classList.remove("error", "pending");

  if (type) {
    validationBanner.classList.add(type);
  }

  validationTitle.textContent = title;
  validationDetail.textContent = detail;

  const icon = validationBanner.querySelector(".validation-icon");

  if (type === "error") {
    icon.textContent = "!";
  } else if (type === "pending") {
    icon.textContent = "…";
  } else {
    icon.textContent = "✓";
  }
}

function setResult(data) {
  result.textContent =
    typeof data === "string"
      ? data
      : JSON.stringify(data, null, 2);
}

function setLoading(loading) {
  submitButton.disabled = loading;
  buttonLabel.textContent = loading
    ? "Analyzing message..."
    : "Analyze Message";
}

// Analyze message
submitButton.addEventListener("click", async () => {
  const message = messageInput.value.trim();

  if (!message) {
    statusText.textContent = "Please enter a message first.";
    messageInput.focus();
    return;
  }

  setLoading(true);
  copyButton.disabled = true;

  statusText.textContent = "Sending your message to the AI backend...";
  setValidationState(
    "pending",
    "Analysis in progress",
    "Waiting for the backend response."
  );

  setResult("Analyzing your message...\nPlease wait.");

  try {
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = {
        detail: responseText || "The server returned an empty response."
      };
    }

    if (!response.ok) {
      setResult(data);

      const detail =
        typeof data.detail === "string"
          ? data.detail
          : `HTTP ${response.status}`;

      statusText.textContent =
        `Request failed (${response.status}): ${detail}`;

      setValidationState(
        "error",
        "Analysis failed",
        "Check the backend logs and API response."
      );

      return;
    }

    setResult(data);
    copyButton.disabled = false;

    statusText.textContent =
      "Success — received a response from the backend.";

    setValidationState(
      "",
      "Analysis completed",
      "The backend returned a successful response."
    );

  } catch (error) {
    setResult({
      error: "Unable to connect to the backend.",
      message: error.message,
      suggestion:
        "Make sure FastAPI is running at http://127.0.0.1:8000."
    });

    statusText.textContent =
      "Connection failed. Check that the backend is running.";

    setValidationState(
      "error",
      "Connection failed",
      "Could not reach the API. Check the server and CORS settings."
    );

    console.error("API request error:", error);

  } finally {
    setLoading(false);
  }
});

// Copy JSON response
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(result.textContent);
    statusText.textContent = "JSON copied to clipboard.";
  } catch (error) {
    statusText.textContent =
      "Clipboard unavailable. Select and copy the JSON manually.";
  }
});

// Check backend availability
async function checkBackend() {
  try {
    const response = await fetch(`${API_URL}/openapi.json`);

    if (response.ok) {
      backendState.textContent = "Backend Online";
    } else {
      backendState.textContent = "Backend Responding";
    }
  } catch {
    backendState.textContent = "Backend Offline";
  }
}

checkBackend();