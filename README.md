# Bank Slip Validator API

[Previous README content...]

## Authentication

The API requires an API key for authentication. Include the API key in the request headers:

```http
X-API-Key: your-api-key
```

### Rate Limiting

- 100 requests per minute per API key
- Exceeding this limit will result in a 429 (Too Many Requests) response

### Example Request with API Key

```bash
curl -X GET \
  'https://your-app.netlify.app/.netlify/functions/api/boleto/23793380296099605290241006333300689690000143014' \
  -H 'X-API-Key: your-api-key'
```

### Error Responses

Authentication errors:
```json
{
  "status": 401,
  "message": "API key is missing"
}
```

Rate limiting:
```json
{
  "status": 429,
  "message": "Rate limit exceeded. Please try again later."
}
```

[Rest of previous README content...]
