# 🍔 CheapEats - Fast Food Deals Finder

A modern Next.js application to find verified fast food deals near you using location-based search.

## ✨ Features

- 📍 **Location-Based Deal Discovery** - Find deals near your current location
- 🔍 **Real Deal Verification** - All deals sourced from official restaurant sources
- 🎯 **Smart Filtering** - Filter by distance, price, restaurant, and deal type
- 📱 **Mobile-First Design** - Optimized for mobile devices
- 🗺️ **Google Maps Integration** - Get directions to restaurants
- 📊 **Google Sheets Backend** - Easy deal management through spreadsheets
- 🤖 **AI-Powered Fallback** - OpenAI generates realistic deals when needed
- ⚡ **Lightning Fast** - Optimized for performance and SEO

## 🚀 Quick Start

### Prerequisites
- Node.js 18.19.0+
- npm 9.0.0+
- Google account (for Sheets integration)
- OpenAI API key (optional, for AI generation)

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd cheapeats

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
```

### Required Environment Variables
```env
# Essential for production
OPENAI_API_KEY=your_openai_api_key
GOOGLE_SHEETS_ID=your_google_sheets_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
DAILY_GENERATION_KEY=your_secure_key

# Optional
GOOGLE_PLACES_API_KEY=your_places_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📁 Project Structure
```
app/
├── api/deals/           # Deal management APIs
│   ├── route.ts         # Main deals endpoint
│   ├── generate-daily/  # Daily generation
│   ├── startup/         # Startup initialization
│   └── sheets-service.ts # Google Sheets integration
├── components/          # UI components
├── deals/              # Deals page
├── about/              # About page
└── globals.css         # Global styles

public/
├── robots.txt          # SEO optimization
└── sitemap.xml         # Search engine sitemap

netlify.toml            # Netlify deployment config
next.config.js          # Next.js configuration
```

## 🌐 Deployment to Netlify

### Automatic Deployment
1. **Connect to Netlify**: Link your repository to Netlify
2. **Set Environment Variables**: Add all required env vars in Netlify dashboard
3. **Deploy**: Netlify will automatically use the optimized build configuration

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy to Netlify
# Upload the 'out' directory to Netlify
```

### Environment Variables in Netlify
Set these in your Netlify dashboard under Site Settings > Environment Variables:
- `OPENAI_API_KEY`
- `GOOGLE_SHEETS_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `DAILY_GENERATION_KEY`
- `NODE_ENV=production`

## 📊 Google Sheets Setup

1. **Create Google Spreadsheet** with these columns:
   ```
   id | restaurantName | title | description | originalPrice | dealPrice | 
   discountPercent | category | expirationDate | latitude | longitude | 
   address | qualityScore | verified | source | sourceUrl | dateAdded | status
   ```

2. **Create Service Account**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Google Sheets API
   - Create service account
   - Download JSON credentials
   - Share your spreadsheet with the service account email

3. **Set Environment Variables** from the JSON file

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run clean        # Clean build directories
```

## 🌟 Production Optimizations

- ✅ **Static Site Generation** - Pre-rendered pages for speed
- ✅ **Code Splitting** - Optimized bundle sizes
- ✅ **Image Optimization** - Compressed and optimized images
- ✅ **SEO Ready** - Meta tags, sitemap, robots.txt
- ✅ **Security Headers** - HTTPS, CSP, and security best practices
- ✅ **Performance Monitoring** - Built-in performance optimizations
- ✅ **Error Handling** - Comprehensive error boundaries
- ✅ **Mobile Optimized** - Perfect mobile experience

## 📈 SEO Features

- Meta tags for social sharing
- Structured data for search engines
- XML sitemap generation
- Robots.txt optimization
- Fast loading times
- Mobile-first indexing ready

## 🔐 Security Features

- Environment variable protection
- API rate limiting
- Input validation and sanitization
- HTTPS enforcement
- Security headers (CSP, HSTS, etc.)
- No sensitive data exposure

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Live Demo

Visit the live application: [https://cheapeats.netlify.app](https://cheapeats.netlify.app)

---

Built with ❤️ using Next.js 14, TypeScript, and modern web technologies.
