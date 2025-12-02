# Smart Dwell

A modern real estate platform built with React and TypeScript, designed to help users find, explore, and analyze properties with intelligent insights and AI-powered assistance.

## Features

- 🏠 **Property Listings**: Browse and search through comprehensive property listings
- 🔍 **Advanced Search**: Filter properties by location, price, type, and amenities
- 📊 **Market Insights**: Get detailed market analysis and trends
- 💬 **AI Chat Assistant**: Get instant help and property recommendations
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-dwell
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── ChatDialog.tsx  # AI chat interface
│   ├── PropertyCard.tsx # Property display component
│   └── ...
├── pages/              # Page components
│   ├── Index.tsx       # Homepage
│   ├── Search.tsx      # Property search
│   ├── Listings.tsx    # Property listings
│   ├── PropertyDetails.tsx # Property details
│   ├── MarketInsights.tsx # Market analysis
│   └── Chat.tsx        # AI chat page
├── lib/                # Utilities and API
│   ├── api.ts          # API functions
│   └── utils.ts        # Helper functions
└── hooks/              # Custom React hooks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
