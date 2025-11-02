# T212MCP - Trading212 Model Context Protocol Server

A Model Context Protocol (MCP) server implementation for Trading212 API integration, providing read-only access to Trading212 portfolio data.

## Tools
- GetPortfolio: Fetches the user's portfolio from Trading212. This tool is read-only and does not perform any trades.


## Prerequisites

- Node.js (v14 or higher)
- Trading212 API credentials (API key and secret)
- Docker (optional, for containerized deployment)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/T212MCP.git
cd T212MCP
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Trading212 API credentials:
```env
T212_API_KEY=your_api_key
T212_API_SECRET=your_api_secret
T212_API_URL=use_demo_or_live_account_url
PORT=3000
```

## Usage

### Running Locally

Start the server:
```bash
npm start
```

The server will be available at `http://localhost:3000/mcp`

### Using Docker

Build and run using Docker Compose:
```bash
docker-compose up --build
```

## API Endpoints

### GET /mcp

The main MCP endpoint that supports the following tools:

- `GetPortfolio`: Fetches the user's Trading212 portfolio data
  - Returns portfolio items with details like average price, current price, quantity, and profit/loss

## Environment Variables

- `T212_API_KEY`: Your Trading212 API key
- `T212_API_SECRET`: Your Trading212 API secret
- `T212_API_URL`: Trading212 API base URL (defaults to demo environment)
- `PORT`: Server port (defaults to 3000)

## Development

Build the project:
```bash
npm run build
```

Run in development mode:
```bash
npm run dev
```

## License

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES, OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE,
ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org>


## Contributing

Contributions are welcome! Whether it's a bug report, feature suggestion, code improvement, or documentation update — all help is appreciated.

## Security

This server implements basic authentication using Trading212 API credentials. Ensure your credentials are kept secure and never commit them to version control.
