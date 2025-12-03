# Production Deployment Test Pack

Non-intrusive test suite to verify production deployment on VPS without changing app code.

## Quick Start

### Demo & Setup
```bash
# See overview and setup
bash tests/demo.sh
```

### Local Testing
```bash
# Install dependencies
npm run ci:install

# Copy and configure environment
cp tests/.env.ci.sample tests/.env
# Edit tests/.env with your values

# Run full test suite
npm run ci:test
```

### VPS Testing
```bash
# On your VPS, install dependencies
bash tests/install.sh

# Configure environment
cp tests/.env.ci.sample tests/.env
# Edit tests/.env with production values

# Run tests
bash tests/run_all.sh
```

## What Gets Tested

- **Health Checks**: Local port and public domain connectivity
- **SSL & Nginx**: HTTPS certificate and proxy verification
- **Auth Flow**: Complete signup → login → logout cycle (headless)
- **Database**: Connectivity and optional write operations
- **AI Proxy**: DeepInfra endpoint functionality
- **Load Testing**: 30-second stress test with 20 concurrent connections

## Configuration

### Environment Variables (tests/.env)
- `NODE_PORT`: App port (default: 3001)
- `PUBLIC_DOMAIN`: Production domain (default: app.sukusuku.ai)
- `TEST_EMAIL` / `TEST_PASSWORD`: Auth test credentials
- `DATABASE_URL`: Postgres connection string
- `AI_TEST_ENDPOINT`: Your app's AI endpoint path

### UI Selectors (tests/config/selectors.json)
Customize CSS selectors for auth flow without code changes.

## Exit Codes
- `0`: All tests passed
- `1`: One or more tests failed

Clear ✅/❌ output for each test phase.