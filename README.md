# BookJapan.gg 🇯🇵✈️

Your all-in-one Japan trip planning companion. Track flight prices, plan your itinerary, manage your budget, and get ready for the adventure of a lifetime.

![BookJapan.gg](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### ✈️ Flight Price Tracker
- Search flights across multiple German travel platforms (Skyscanner, Google Flights, Check24, Kayak, Momondo, Lufthansa)
- Save and track multiple flight searches
- Set price alerts and notifications
- Filter by airlines, direct flights, travel class, and more
- Automatic refresh every 6 hours

### 📅 Trip Planner
- Day-by-day itinerary planning
- Add activities with time, location, and notes
- Quick-select activity templates
- Visual timeline view
- Export itinerary as text file
- Track total activities and planned hours

### 💰 Budget Tool
- **Automatic Budget Calculator**: Input total budget and trip duration for instant breakdown
- **Manual Budget Planner**: Customize categories and amounts
- **Expense Tracker**: Track actual spending during your trip
- Visual charts and progress bars
- Multiple spending tier recommendations

### ⏰ Countdown Timer
- Set your departure date
- Live countdown in the header
- Days/hours until your trip

### 👤 Profile & Settings
- Personal information management
- Travel style preferences
- Interest tracking
- Notification settings
- Data export/import
- Local storage backup

## 🎨 Design

BookJapan.gg features a modern, Japanese-inspired minimalist design with:
- Clean layouts with generous whitespace
- Japanese color palette (indigo, sakura pink, matcha green)
- Smooth animations and micro-interactions
- Fully responsive mobile support
- Beautiful typography (Lexend & Playfair Display)

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for CDN resources

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bookjapan-gg.git
cd bookjapan-gg
```

2. Open `index.html` in your browser, or serve with a local server:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

3. Visit `http://localhost:8000` in your browser

### GitHub Pages Deployment

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select source: `Deploy from a branch`
4. Choose branch: `main` and folder: `/ (root)`
5. Save and wait for deployment
6. Your site will be available at `https://yourusername.github.io/bookjapan-gg/`

## 📁 Project Structure

```
bookjapan-gg/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # Custom styles
├── js/
│   ├── app.js            # Core app functionality
│   ├── flights.js        # Flight tracker
│   ├── planner.js        # Trip planner
│   ├── budget.js         # Budget tool
│   └── profile.js        # Profile manager
└── README.md             # This file
```

## 💾 Data Storage

All data is stored locally in your browser using `localStorage`. This means:
- ✅ No server required
- ✅ Complete privacy
- ✅ Works offline (after initial load)
- ⚠️ Data is browser-specific
- ⚠️ Clearing browser data will delete your information

**Important**: Regularly export your data as a backup!

## 🔧 Technologies Used

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first styling
- **Vanilla JavaScript** - No framework dependencies
- **Chart.js** - Budget visualizations
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## 🌐 Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 📱 Mobile Support

Fully responsive design tested on:
- iOS (iPhone, iPad)
- Android (phones, tablets)
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🎯 Use Cases

Perfect for:
- Solo travelers planning their Japan adventure
- Couples organizing their honeymoon
- Groups coordinating itineraries
- Budget-conscious travelers
- Digital nomads
- Repeat visitors to Japan

## 🔐 Privacy

BookJapan.gg respects your privacy:
- No data collection
- No analytics
- No tracking
- No cookies
- All data stays on your device

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by the beauty and culture of Japan
- Built for travelers, by a traveler
- Special thanks to the Japan tourism community

## 📞 Support

If you encounter any issues or have questions:
1. Check the browser console for errors
2. Ensure JavaScript is enabled
3. Try clearing browser cache
4. Export and re-import your data

## 🗾 About Japan

Japan is a fascinating destination combining ancient traditions with cutting-edge technology. From Tokyo's neon streets to Kyoto's serene temples, from Osaka's street food to Hokkaido's natural beauty - there's something for everyone.

**Start planning your dream trip today with BookJapan.gg!** 🎌

---

Made with ❤️ for Japan travelers | © 2024 BookJapan.gg
