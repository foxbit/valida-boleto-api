# Bank Slip Validator API

A robust REST API for validating Brazilian bank slip (boleto) digit lines, supporting both bank and utility payment slips according to FEBRABAN standards. Built with TypeScript, Express.js, and deployed on Netlify as serverless functions.

## Features

- ✅ Bank slip validation (47 digits)
- ✅ Utility payment slip validation (48 digits)
- ✅ Barcode extraction and validation
- ✅ Amount and expiration date parsing
- ✅ Module 10 and Module 11 verification algorithms
- 🔒 API Key authentication
- ⚡ Rate limiting protection
- 📚 Swagger documentation
- 🚀 Serverless deployment

## API Documentation

Full API documentation is available at:
```
https://[your-app].netlify.app/.netlify/functions/api/docs
```

### Base URL
```
Production: https://[your-app].netlify.app/.netlify/functions/api
Development: http://localhost:8888/.netlify/functions/api
```

### Authentication

All requests require an API key passed in the header:
```http
X-API-Key: your-api-key
```

### Rate Limiting

- 100 requests per minute per API key
- Exceeding this limit triggers a 429 (Too Many Requests) response

## Endpoints

### 1. Health Check
```http
GET /
```

Response:
```json
{
  "title": "Bank Slip Validator API",
  "message": "API para consultar linhas digitáveis de boleto",
  "version": "1.0.0"
}
```

### 2. Validate Bank Slip
```http
GET /boleto/{digitLine}
```

#### Parameters
- `digitLine`: Bank slip digit line (47 or 48 digits)

#### Examples

Bank Slip (47 digits):
```bash
curl -X GET \
  'https://[your-app].netlify.app/.netlify/functions/api/boleto/23793380296099605290241006333300689690000143014' \
  -H 'X-API-Key: your-api-key'
```

Response:
```json
{
  "barCode": "23796896900001430143380260996052904100633330",
  "amount": "1430.14",
  "expirationDate": "28-04-2022"
}
```

Utility Payment Slip (48 digits):
```bash
curl -X GET \
  'https://[your-app].netlify.app/.netlify/functions/api/boleto/846100000005246100291102005460339004695895061080' \
  -H 'X-API-Key: your-api-key'
```

Response:
```json
{
  "barCode": "84610000000246100291100054603390069589506108",
  "amount": "24.61",
  "expirationDate": null
}
```

## Error Responses

### Authentication Error (401)
```json
{
  "status": 401,
  "message": "API key is missing"
}
```

### Rate Limit Exceeded (429)
```json
{
  "status": 429,
  "message": "Rate limit exceeded. Please try again later."
}
```

### Validation Error (400)
```json
{
  "status": 400,
  "message": "Invalid code format: code is either too short or too long"
}
```

## Local Development

### Prerequisites
- Node.js 16+
- npm or yarn
- Netlify CLI

### Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd [repository-name]
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env`:
```env
NODE_ENV=development
PORT=8888
API_KEYS=your-test-key-1,your-test-key-2
```

5. Start development server:
```bash
npm run dev
```

### Testing

Run the test suite:
```bash
npm test
```

## Deployment

### Netlify Deployment

1. Install Netlify CLI:
```bash
npm install netlify-cli -g
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize Netlify project:
```bash
netlify init
```

4. Set up environment variables in Netlify:
- Go to Site settings > Environment variables
- Add `API_KEYS` variable with your production keys

5. Deploy:
```bash
netlify deploy --prod
```

## Technical Details

### Architecture
- TypeScript for type safety
- Express.js for API framework
- Serverless functions via Netlify
- In-memory rate limiting
- FEBRABAN validation algorithms
- Jest for testing

### Security Features
- API Key authentication
- Rate limiting per API key
- CORS enabled
- Security headers
- Request validation

### Validation Rules
- Bank slips: 47 digits
- Utility slips: 48 digits
- Module 10 and 11 verification
- DAC (Digit of Self-Conference) validation
- Amount and expiration date extraction

## License

ISC License

## Support

For support, please open an issue in the repository or contact the maintainers.
