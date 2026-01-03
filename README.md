# Collegio (College Application Creator)

An AI-powered platform that helps students find and organize their college applications using GPT-4o mini, Google Search API, and Perplexity API.

## Features

- 🎓 Smart college matching based on student profile
- 📊 Automated spreadsheet generation with reach/target/safety categorization
- 🔍 Comprehensive college data including majors, costs, dorms, and campus insights
- 🎨 Modern, intuitive user interface
- 📱 Fully responsive design

## Tech Stack

- React 18
- Tailwind CSS
- Lucide React (icons)
- Google Search API
- GPT-4o mini API
- Perplexity API

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/college-app-creator.git
cd college-app-creator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your API keys:
```
REACT_APP_GOOGLE_API_KEY=your_google_api_key
REACT_APP_OPENAI_API_KEY=your_openai_api_key
REACT_APP_PERPLEXITY_API_KEY=your_perplexity_api_key
```

4. Start the development server:
```bash
npm start
```

## How It Works

1. **Student Input**: Upload resume/transcripts and select application category
2. **AI Analysis**: GPT-4o analyzes profile and generates search queries
3. **Data Collection**: Google Search API retrieves college information
4. **Intelligent Filtering**: AI validates and categorizes schools
5. **Enrichment**: Perplexity API adds detailed campus insights
6. **Export**: Generate personalized spreadsheet with filters

## APIs Used

- **GPT-4o mini**: Profile analysis and query generation
- **Google Search API**: College data retrieval
- **Perplexity API**: Detailed campus information and insights

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first.
