# Dynamic IP Agent

A proxy server that handles API requests through a configured proxy service.

## Setup & Installation

```bash
# Install dependencies
bun install

# Development
bun run dev

# Run tests
bun test

# Deploy
npm run deploy
```

## Environment Setup
Copy `.env.example` to `.env` and fill in the following parameters:

```env
PROXY_CUSTOMER=your_customer_id        # Your proxy service customer ID
PROXY_SESSION_ID=your_session_id       # Session ID for proxy authentication
PROXY_PASSWORD=your_password           # Password for proxy authentication
PROXY_HOST=proxy.example.com          # Proxy server hostname
PROXY_PORT=1234                       # Proxy server port number
```

## API Usage

### Root Endpoint
```
GET /
Response: { "message": "Hello, World!" }
```

### Proxy Endpoint
```
GET /proxy?apiUrl=<target-api-url>
```

### Example Usage:
```
https://your-domain.com/proxy?apiUrl=https://api.example.com/data
```

### With Custom Headers:
```javascript
fetch('https://your-domain.com/proxy?apiUrl=https://api.example.com/data', {
  headers: {
    'x-custom-header': 'value'
  }
})
```

### Features:
- Proxies HTTP/HTTPS requests through a configured proxy server
- Dynamic session ID generation for each request
- Supports custom headers
- Automatic JSON response parsing
- Comprehensive error handling

### Error Responses:
- 400: Missing API URL parameter
- 500: Invalid JSON response
- 500: Request failed
- 500: Proxy request failed

### Notes:
- The `apiUrl` parameter must be URL encoded
- All responses are automatically parsed as JSON
- SSL certificate verification is handled by the proxy
