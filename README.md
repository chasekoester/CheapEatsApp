# CheapEats - AI-Powered Fast Food Deals 🍔

Find the best fast food deals near you with AI-powered discovery from 40+ restaurants. Now featuring user accounts, favorite deals, and newsletter subscriptions!

## ✨ Features

- 🤖 **AI-Generated Deals**: Discover 50+ current fast food deals instantly
- 📍 **Location-Based**: Find deals near your current location
- 🔍 **Smart Search**: Search by restaurant, deal type, or food category
- ⭐ **Quality Scoring**: AI-rated deals for reliability and value
- 🧭 **Navigation**: Get directions to the nearest restaurant locations
- 👤 **User Accounts**: Sign in with Google to save your preferences
- ❤️ **Favorite Deals**: Save and manage your favorite deals
- 📧 **Newsletter**: Subscribe to get the latest deals delivered
- 📱 **Mobile Optimized**: Beautiful responsive design for all devices

## 🚀 Live Demo

Visit [CheapEats](https://your-app-name.netlify.app) to try it out!

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, React
- **Styling**: Custom CSS with responsive design
- **Authentication**: NextAuth.js with Google OAuth
- **AI**: OpenAI GPT-4 for deal generation and analysis
- **Data**: Google Sheets integration for deal management
- **Deployment**: Netlify with optimized static generation
- **User Data**: JSON-based storage system for favorites and newsletters

## 📋 Prerequisites

Before setting up the project, you'll need:

- Node.js 18.19.0 or higher
- npm 9.0.0 or higher
- Google Cloud Platform account
- OpenAI API account
- Google Sheets access

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd cheapeats
npm install
```

### 2. Environment Configuration

Copy the environment template:
```bash
cp .env.example .env.local
```

### 3. Required API Keys and Setup

You'll need to configure several services:

#### OpenAI API
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add to `.env.local`: `OPENAI_API_KEY=your_key_here`

#### Google Sheets Integration
1. Follow the detailed setup in [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)
2. Configure your spreadsheet with deal data
3. Add the required Google credentials to your environment

#### Google OAuth Authentication
1. Follow the detailed setup in [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)
2. Set up OAuth consent screen and credentials
3. Add Google OAuth credentials to your environment

### 4. Complete Environment Variables

Your `.env.local` should include:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Google Sheets Configuration
GOOGLE_SHEETS_ID=your_google_sheets_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email_here
GOOGLE_PRIVATE_KEY=your_private_key_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here

# Optional: Enhanced Features
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
DAILY_GENERATION_KEY=your_secure_daily_generation_key_here

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application running.

## 🌐 Deployment

### Netlify Deployment

1. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `out`

2. **Environment Variables**: Add all your environment variables to Netlify's environment settings, updating `NEXTAUTH_URL` to your production domain.

3. **Domain Configuration**: Update OAuth redirect URIs in Google Cloud Console to include your production domain.

### Production Optimizations

The app includes several production optimizations:
- Static site generation with Next.js export
- Optimized webpack bundle splitting
- Security headers via `netlify.toml`
- SEO optimization with robots.txt and sitemap
- Comprehensive error handling and fallbacks

## 📁 Project Structure

```
cheapeats/
├── app/                          # Next.js 14 App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth authentication
│   │   ├── deals/                # Deal management APIs
│   │   ├── user/                 # User profile and favorites
│   │   └── newsletter/           # Newsletter subscription
│   ├── components/               # React components
│   │   ├── Navigation.tsx        # Main navigation with auth
│   │   └── NewsletterSignup.tsx  # Newsletter subscription
│   ├── providers/                # Context providers
│   ├── deals/                    # Deals page and detail views
│   ├── profile/                  # User profile and dashboard
│   └── about/                    # About page
├── data/                         # User data storage (JSON files)
├── public/                       # Static assets
├── docs/                         # Setup documentation
│   ├── GOOGLE_SHEETS_SETUP.md    # Google Sheets integration guide
│   └── AUTHENTICATION_SETUP.md   # OAuth setup guide
└── netlify.toml                  # Netlify configuration
```

## 🎯 Key Features Explained

### AI Deal Generation
- Uses OpenAI GPT-4 to generate realistic fast food deals
- Includes pricing, descriptions, and restaurant information
- Fallback system ensures the app always works

### User Authentication
- Google OAuth integration with NextAuth.js
- Secure session management with JWT tokens
- User profiles with favorite deals and preferences

### Deal Management
- Favorite/unfavorite deals with heart icons
- Personal dashboard showing saved deals
- Remove deals from favorites with single click

### Newsletter System
- Email subscription with name collection
- Integration with user accounts for automatic info
- Simple subscribe/unsubscribe functionality

### Location Services
- Browser geolocation API for finding nearby deals
- Distance calculation to restaurant locations
- Integration with Google Maps for directions

## 🔒 Security Features

- JWT-based authentication with secure sessions
- Environment variable protection for API keys
- CORS and security headers via Netlify configuration
- Input validation and sanitization
- Secure cookie settings for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the setup guides in the `docs/` folder
2. Verify all environment variables are correctly set
3. Review the troubleshooting sections in the setup guides
4. Open an issue on GitHub with detailed error information

## 🙏 Acknowledgments

- OpenAI for providing the GPT-4 API
- Google for Sheets API and OAuth services
- Next.js team for the excellent framework
- Netlify for seamless deployment and hosting

---

Built with ❤️ for finding the best fast food deals near you!
