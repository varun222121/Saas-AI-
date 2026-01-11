# How to Get a Valid Clerk Authentication Token

## Method 1: From Your Frontend Application

1. **Start your frontend:**
   ```bash
   cd "c:\Users\YN Computer\Desktop\Ai SaaS\Saas Ai"
   npm run dev
   ```

2. **Open your app in browser** (usually http://localhost:5173)

3. **Login/Sign up** with Clerk

4. **Open browser DevTools** (Press F12)

5. **Go to Console tab**

6. **Run this command:**
   ```javascript
   await window.Clerk.session.getToken()
   ```

7. **Copy the token** that appears (it will be a long string starting with "eyJ...")

8. **Use in Postman:**
   - Header: `Authorization`
   - Value: `Bearer <paste-token-here>`

## Method 2: Check Your Frontend Code

Look for where you're making API calls in your frontend. The token should be obtained like this:

```javascript
const token = await window.Clerk.session.getToken();

fetch('http://localhost:3000/api/ai/generate-article', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'your prompt',
    length: 500
  })
});
```

## For Now: Use Test Endpoint

While you get a valid token, you can test the API with the test endpoint:

**URL:** `http://localhost:3000/api/ai/test-generate-article`
- No authentication required
- Same body as the production endpoint
- Will verify database and AI API are working

**IMPORTANT:** Remove the test endpoint before deploying to production!
