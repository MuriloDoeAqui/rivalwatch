# RivalWatch

Price monitoring platform with automated scraping.

## Structure

- `frontend/` - React app (Vercel)
- `worker/` - Node.js scraper (Railway)

## Quick Start

```bash
# Install dependencies
npm install

# Start frontend
npm run dev

# Start worker
npm run worker

# Check worker config
npm run check
```

## Deploy

- **Frontend**: Connect Vercel to `frontend/` directory
- **Worker**: Connect Railway to `worker/` directory

## Environment

### Frontend (.env)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Worker (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_key
```