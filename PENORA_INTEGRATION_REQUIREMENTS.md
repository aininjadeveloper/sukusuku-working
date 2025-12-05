# Penora Application Integration Requirements

To ensure seamless integration between **SukuSuku (https://sukusuku.ai)** and the Penora application, and to fix issues regarding user detail mismatches and errors, the Penora application must implement the following requirements.

**Important Context:** SukuSuku is now hosted on a VPS at `https://sukusuku.ai`. It is no longer running in a Replit environment.

## 1. User Authentication & Session Handling (Critical)

SukuSuku redirects users to Penora with user details in the query parameters. Penora **MUST** correctly process these parameters to establish a user session.

**Incoming URL Format:**
```
[PENORA_BASE_URL]/?user_id={UUID}&email={EMAIL}&first_name={NAME}&last_name={NAME}
```

**Requirements:**
*   **Capture Parameters:** On the landing page (root `/`), the application must check for `user_id`, `email`, `first_name`, and `last_name` in the URL query string.
*   **Establish Session:**
    *   If these parameters are present, Penora should automatically log the user in or create a temporary session for them.
    *   **Do NOT** ignore these parameters.
    *   **Do NOT** default to a hardcoded user (e.g., 'luciferjhon') if these parameters are provided.
*   **User Identity:** The application must use the provided `user_id` as the primary identifier for credit lookups and updates.
*   **UI Update:** The UI must display the user's name (`first_name` `last_name`) and their specific credit balance, not a static placeholder.

## 2. Required API Endpoints

SukuSuku attempts to fetch and update user credits via API calls to Penora. Penora **MUST** implement the following endpoints.

### A. Get User Info (Credit Check)
**Endpoint:** `GET /api/unified/user-info`
**Query Parameters:** `user_id` (The UUID passed during redirect)
**Headers:**
*   `Content-Type: application/json`
*   `X-API-Key`: (Optional, if configured)

**Expected Behavior:**
*   Look up the user by `user_id`.
*   Return their current credit balance.

**Expected Response (JSON):**
```json
{
  "credits": 150,
  "user_id": "..."
}
```

### B. Add Credits
**Endpoint:** `POST /api/unified/add-credits`
**Headers:**
*   `Content-Type: application/json`
*   `X-API-Key`: (Optional)

**Request Body (JSON):**
```json
{
  "user_id": "...",
  "amount": 50,
  "transaction_type": "purchase",
  "description": "..."
}
```

**Expected Behavior:**
*   Increase the user's credit balance by `amount`.
*   Return a success response.

## 3. CORS Configuration (Critical for Production)

Since SukuSuku is now hosted at `https://sukusuku.ai`, Penora **MUST** allow Cross-Origin Resource Sharing (CORS) from this domain.

**Requirements:**
*   **Allowed Origins:** `https://sukusuku.ai` (and `http://localhost:5000` for testing if needed).
*   **Allowed Headers:** `Content-Type`, `X-API-Key`, `Authorization`.
*   **Allowed Methods:** `GET`, `POST`, `OPTIONS`.

**Note:** If CORS is not configured correctly, all API calls from SukuSuku to Penora will fail with network errors.

## 4. Error Handling

*   If the user is not found, the API should return a `404` or a default credit balance (e.g., 0) rather than a `500` error.
*   Ensure that database lookups for `user_id` do not crash if the ID format is unexpected (though it should be a UUID).

## Summary of Fixes Needed "On Their Side"

1.  **Fix Landing Page Logic:** Stop showing hardcoded user details. Read `user_id` from URL query params and initialize the app state with that user.
2.  **Implement API:** Ensure `/api/unified/user-info` and `/api/unified/add-credits` are working and return the correct JSON structure.
3.  **Enable CORS for `https://sukusuku.ai`:** This is mandatory for the integration to work in production.
