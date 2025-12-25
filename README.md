# ResPart - Find Your Research Partner

A modern, Tinder-style research paper discovery app built with React, Vite, and Framer Motion.

## Live Demo

**Try it now:** https://yashmgupta.github.io/research-swipe-react

---

## Features

### Free Features
- **Swipeable Cards** - Drag papers left (dislike) or right (like) with smooth animations
- **Real Papers** - Fetches live data from Semantic Scholar API
- **Archive System** - Auto-archive liked papers into topic-based folders
- **Full Archive Page** - Browse all your saved papers by folder
- **Basic Export** - Export to JSON and CSV formats
- **Stats Tracking** - Real-time counts of liked, disliked, and archived papers
- **Responsive Design** - Works on desktop and mobile
- **No Account Required** - All data stored locally in your browser

### Premium Features (Coming Soon)
- **BibTeX Export** - For LaTeX/Overleaf users (LOCKED)
- **EndNote Export** - For citation managers (LOCKED)
- **Plain Text Export** - Formatted citations (LOCKED)
- **Advanced Search** - Filter by year, author, citations (LOCKED)
- **Cloud Sync** - Access from any device (LOCKED)
- **Collaboration** - Share folders with team members (LOCKED)
- **Commercial Use** - License for organizations (LOCKED)

**Interested in premium features?** Contact: yash.610@live.com

---

## Tech Stack

- **React 18.3.1** - UI library
- **Vite 6.0.3** - Lightning-fast build tool
- **Framer Motion 11.11.17** - Smooth animations
- **Lucide React 0.460.0** - Beautiful icons
- **Semantic Scholar API** - Free research papers database

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/yashmgupta/research-swipe-react.git
cd research-swipe-react

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

---

## How to Use

1. **Search** - Enter a research topic (e.g., "machine learning", "climate change")
2. **Swipe** - Drag cards right to LIKE, left to NOPE
3. **Archive** - Liked papers are auto-saved to the topic folder
4. **Browse Archive** - Click "Archive" to view all your saved papers
5. **Export** - Download your collection in JSON or CSV format (Premium: BibTeX, EndNote, Text)

---

## Project Structure

```
research-swipe-react/
 src/
    components/
       SwipeCard.jsx       # Swipeable card with Framer Motion
       SwipeCard.css       # Card animations & styles
       ExportModal.jsx     # 5-tab export modal
       ExportModal.css     # Modal styles
       ArchivePage.jsx     # Full-screen archive browser
       ArchivePage.css     # Archive grid & list styles
       SearchBar.jsx       # Search input form
       SearchBar.css       # Search styles
       Stats.jsx           # 3-stat display
       Stats.css           # Stats grid styles
    App.jsx                 # Main app logic & state
    App.css                 # Global app styles
    main.jsx                # React entry point
    index.css               # CSS variables & resets
 index.html                  # HTML template
 package.json                # Dependencies & scripts
 vite.config.js              # Vite configuration
 LICENSE                     # Proprietary license
 TERMS_OF_SERVICE.md         # User terms
 COMMERCIALIZATION.md        # Business strategy
 README.md                   # This file
```

---

## License & Terms

**Copyright (c) 2025 Yash M Gupta. All Rights Reserved.**

This software is proprietary and commercially licensed. See [LICENSE](./LICENSE) for details.

### Usage Rights

- **YES** - Free Personal Use (Use for personal research, non-commercial)
- **NO** - Commercial Use (Requires commercial license)
- **NO** - Redistribution (Cannot share or resell without permission)
- **NO** - Modification (Cannot alter or create derivative works)

### Commercial Licensing

For commercial use, institutional licenses, or premium features:

**Email:** yash.610@live.com  
**Demo:** https://yashmgupta.github.io/research-swipe-react  
**Terms:** [TERMS_OF_SERVICE.md](./TERMS_OF_SERVICE.md)

---

## Business Model

ResPart uses a **freemium model**:

### Free Tier
- Unlimited paper browsing
- Basic export (JSON, CSV)
- Local storage only
- Personal use only

### Premium Tier ($4.99/month)
- BibTeX, EndNote exports
- Cloud sync
- Advanced search
- Commercial use rights
- Priority support

### Institutional Licenses
- Custom pricing for universities and organizations
- Multi-user access
- Dedicated support

See [COMMERCIALIZATION.md](./COMMERCIALIZATION.md) for full business plan.

---

## Contributing

This is a commercial project with a proprietary license. Contributions are welcome but must be submitted with a Contributor License Agreement (CLA).

**Before contributing:**
1. Open an issue to discuss your idea
2. Sign the CLA (will be provided)
3. Submit PR with clear description

---

## Contact & Support

### For Users
- **Bug Reports:** GitHub Issues
- **Feature Requests:** GitHub Discussions
- **Questions:** GitHub Discussions

### For Business
- **Commercial Licensing:** yash.610@live.com
- **Premium Features:** yash.610@live.com
- **Institutional Sales:** yash.610@live.com

---

## Acknowledgments

- **Semantic Scholar** - Free API for research papers
- **Framer Motion** - Smooth animations library
- **Lucide React** - Beautiful icon set
- **React & Vite** - Modern web development tools

---

## Roadmap

### v1.0 (Current) - COMPLETE
- Swipe interface
- Archive system
- Basic export (JSON, CSV)

### v2.0 (Q1 2026) - IN PROGRESS
- Premium features (BibTeX, EndNote)
- User authentication
- Payment integration
- Cloud sync

### v3.0 (Q3 2026) - PLANNED
- Mobile apps (iOS/Android)
- AI recommendations
- Collaboration features
- PDF management

---

**Built with care by Yash M Gupta**

**ResPart - Find Your Research Partner**
