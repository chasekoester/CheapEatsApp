# Adding Your Own Deals to the Spreadsheet

## ✅ Your System Now Supports Manual Deals!

You can add your own deals directly to the Google Spreadsheet and they will:
- **Show up on your website** alongside AI-generated deals
- **Never be overwritten** by the automatic system
- **Be preserved forever** until you manually remove them

## 📊 How to Add Manual Deals

### 1. Open Your Google Sheet
https://docs.google.com/spreadsheets/d/1y6Xvb7_-lIyMXK65tzOb_kmCIAwuFqtvnqsSxi1nwXo/edit

### 2. Add a New Row
Click on an empty row and fill in these columns:

| Column | Example | Notes |
|--------|---------|-------|
| **id** | `manual-deal-001` | Make it unique, start with "manual-" |
| **restaurantName** | `McDonald's` | Restaurant name |
| **title** | `Free Big Mac Friday` | Deal title |
| **description** | `Free Big Mac with any $5 purchase on Fridays` | Deal description |
| **originalPrice** | `$6.99` | Original price |
| **dealPrice** | `Free` | Deal price (can be "Free", "$3.99", etc.) |
| **discountPercent** | `100` | Discount percentage (0-100) |
| **category** | `Burgers` | Food category |
| **expirationDate** | `2024-12-31` | When deal expires (YYYY-MM-DD) |
| **latitude** | `40.7128` | Restaurant latitude |
| **longitude** | `-74.0060` | Restaurant longitude |
| **address** | `123 Main St, New York, NY` | Restaurant address |
| **qualityScore** | `90` | Quality score (1-100) |
| **verified** | `true` | Is deal verified? |
| **source** | `Manual Entry` | Source (keep as "Manual Entry") |
| **dateAdded** | `2024-01-15` | Today's date (YYYY-MM-DD) |
| **status** | `active` | Set to "active" to show on site |

### 3. Important Notes

#### ✅ **Safe Sources** (won't be overwritten):
- `Manual Entry`
- `Scraped from Website`
- `Partner Deal`
- `Verified Local`

#### ⚠️ **Avoid These Sources** (will be overwritten):
- `AI Generated - [City Name]`

#### 📍 **Getting Coordinates**:
1. Go to [Google Maps](https://maps.google.com)
2. Search for the restaurant location
3. Right-click on the location → "What's here?"
4. Copy the coordinates that appear

#### 🏷️ **Categories to Use**:
- `Fast Food`
- `Pizza` 
- `Mexican`
- `Coffee`
- `Sandwiches`
- `Chicken`
- `Burgers`
- `Asian`

## 🔄 How It Works

### Automatic System Behavior:
1. **Preserves your manual deals** - Never overwrites deals with non-AI sources
2. **Only replaces AI deals** - When generating new daily deals
3. **Combines everything** - Shows both manual and AI deals to users
4. **Sorts by distance** - Closest deals appear first

### Manual Deal Benefits:
- ✅ **Permanent** - Stay until you remove them
- ✅ **Priority** - Can set higher quality scores
- ✅ **Custom** - Add local partnerships, exclusive deals
- ✅ **Verified** - Mark as verified for trust

## 📝 Example Manual Deal

```
id: manual-001
restaurantName: McDonald's  
title: Student Discount 20% Off
description: 20% off entire order with valid student ID
originalPrice: $10.00
dealPrice: $8.00
discountPercent: 20
category: Fast Food
expirationDate: 2024-12-31
latitude: 40.7128
longitude: -74.0060
address: 1234 University Ave, New York, NY
qualityScore: 95
verified: true
source: Manual Entry
dateAdded: 2024-01-15
status: active
```

## 🎯 Pro Tips

1. **Use higher quality scores** (90-100) for your best manual deals
2. **Set status to "inactive"** to temporarily hide deals
3. **Use descriptive IDs** like `manual-mcdonalds-student-001`
4. **Add local restaurant partnerships** that AI wouldn't know about
5. **Verify coordinates** to ensure accurate distance calculations

Your manual deals will appear on the website within minutes of adding them to the spreadsheet!
