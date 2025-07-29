# CheapEats - Fast Food Deals Finder

A Next.js application that helps users find fast food deals near their location using AI-generated deals and Google Sheets integration.

## 🚀 Quick Start

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Configure your environment variables (see Environment Variables section)
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000)

## 🌐 Netlify Deployment

This project is optimized for Netlify deployment with the following features:

### Automatic Deployment
- Push to your main branch for automatic deployment
- Netlify will automatically detect the build settings from `netlify.toml`

### Environment Variables (Required)
Set these in your Netlify dashboard under Site Settings > Environment Variables:

**Required:**
- `OPENAI_API_KEY` - Your OpenAI API key for AI deal generation
- `GOOGLE_SHEETS_ID` - Google Sheets ID for deal storage
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service account email
- `GOOGLE_PRIVATE_KEY` - Private key for Google Sheets access
- `GOOGLE_PLACES_API_KEY` - Google Places API for location services
- `DAILY_GENERATION_KEY` - Secret key for daily deal generation

**Optional:**
- `NEXT_TELEMETRY_DISABLED=1` - Disable Next.js telemetry
- `NODE_ENV=production` - Set production environment

### Build Configuration
The project includes optimized build configuration:
- **Build Command**: `npm run build`
- **Publish Directory**: `.next`
- **Functions Directory**: `netlify/functions`
- **Node Version**: 18

## 📁 Project Structure

```
newCheapEats (2)/
├── app/
│   ├── api/deals/              # API routes (Netlify Functions)
│   ├── components/             # React components
│   ├── deals/                  # Deals pages
│   └── globals.css            # Global styles
├── netlify.toml               # Netlify configuration
├── next.config.js             # Next.js configuration
└── package.json               # Dependencies and scripts
```

## 🔧 API Endpoints

- **GET** `/api/deals` - Fetch deals near location
- **POST** `/api/deals` - Generate targeted deals
- **GET** `/api/deals/startup` - Initialize daily deals
- **POST** `/api/deals/generate-daily` - Generate daily deals (protected)

## 🛠️ Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Type checking without build

## 📊 Google Sheets Integration

See `GOOGLE_SHEETS_SETUP.md` for detailed setup instructions.

## 🔒 Security Features

- API key validation for protected endpoints
- CORS headers configuration
- XSS protection headers
- Content type validation

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**: Check environment variables are set correctly
2. **API Routes Not Working**: Ensure Netlify Functions are enabled
3. **Google Sheets Errors**: Verify service account permissions

### Debug Mode
Enable debug logging by setting `DEBUG_MODE=true` in environment variables.

## 📄 License

MIT License - see LICENSE file for details.
