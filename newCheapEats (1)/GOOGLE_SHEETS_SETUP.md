# Google Sheets Setup for Daily Deal Storage

## Overview
This system allows you to:
1. **Generate deals once daily** using AI and store them in Google Sheets
2. **Serve deals to users** from the stored spreadsheet (fast loading)
3. **Manually review/edit deals** in the familiar spreadsheet interface

## Setup Steps

### 1. Create Google Sheets API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

4. Create a **Service Account**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Name it "fastfood-deals-service"
   - Click "Create and Continue"
   - Skip role assignment for now
   - Click "Done"

5. Generate a **Private Key**:
   - Click on your service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Select "JSON" format
   - Download the JSON file

### 2. Create Google Spreadsheet

1. Create a new Google Sheet at [sheets.google.com](https://sheets.google.com)
2. Name it "Fast Food Deals Database"
3. Copy the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
4. **Share the sheet** with your service account:
   - Click "Share" button
   - Add the service account email (from the JSON file)
   - Give it "Editor" permissions

### 3. Set Environment Variables

Add these to your environment variables:

```env
# Google Sheets Configuration
GOOGLE_SHEETS_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Daily Generation Security Key (make this a random string)
DAILY_GENERATION_KEY=your_secure_random_key_here
```

**Important:** Replace `\n` with actual newlines in the private key when setting environment variables.

### 4. Generate Daily Deals

#### Manual Generation (for testing)
Make a POST request to:
```
POST /api/deals/generate-daily?key=your_secure_random_key_here
```

#### Automated Daily Generation
Set up a cron job or scheduled task to call this endpoint once daily:

**Using cron (Linux/Mac):**
```bash
# Add to crontab (runs daily at 6 AM)
0 6 * * * curl -X POST "https://yourdomain.com/api/deals/generate-daily?key=your_secure_random_key_here"
```

**Using GitHub Actions (recommended):**
Create `.github/workflows/daily-deals.yml`:
```yaml
name: Generate Daily Deals
on:
  schedule:
    - cron: '0 6 * * *'  # 6 AM UTC daily
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Generate Deals
        run: |
          curl -X POST "${{ secrets.APP_URL }}/api/deals/generate-daily?key=${{ secrets.DAILY_GENERATION_KEY }}"
```

## How It Works

### Daily Generation Process
1. **AI generates 25 deals per major city** (10 cities = 250 total deals)
2. **Deals are saved to Google Sheets** with all metadata
3. **You can review/edit deals** in the spreadsheet interface
4. **Set status to 'active' or 'inactive'** to control which deals show

### User Experience
1. **Users load deals page** → App checks Google Sheets first
2. **If deals exist** → Serves from spreadsheet (fast!)
3. **If no deals** → Falls back to AI generation
4. **Deals are filtered by location** and sorted by distance

### Spreadsheet Columns
- `id` - Unique deal identifier
- `restaurantName` - Restaurant name
- `title` - Deal title
- `description` - Deal description
- `originalPrice` - Original price
- `dealPrice` - Deal price
- `discountPercent` - Discount percentage
- `category` - Food category
- `expirationDate` - When deal expires
- `latitude`/`longitude` - Restaurant location
- `address` - Restaurant address
- `qualityScore` - Deal quality (1-100)
- `verified` - Is deal verified
- `source` - Where deal came from
- `dateAdded` - When added
- `status` - 'active' or 'inactive'

## Benefits

✅ **Cost Efficient** - Generate deals once daily instead of per user
✅ **Fast Loading** - Users get instant results from spreadsheet
✅ **Manual Control** - Review and edit deals in familiar interface
✅ **Reliable** - Fallback to AI if spreadsheet fails
✅ **Scalable** - Handle many users without API costs

## Monitoring

Check deal generation status:
```
GET /api/deals/generate-daily
```

Returns info about:
- Total active deals
- Last generation date
- Number of cities/restaurants covered
