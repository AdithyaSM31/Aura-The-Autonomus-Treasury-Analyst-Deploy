# Aura - Autonomous Treasury Analyst

A modern, AI-powered financial analysis platform built with React and FastAPI. Upload your Excel files and get instant insights from virtual CFO and CEO executives.

## 🚀 Features

- **Modern React Frontend**: Sleek, professional UI with smooth animations
- **AI-Powered Analysis**: Virtual CFO and CEO provide intelligent insights
- **Interactive Charts**: Real-time data visualization with Chart.js
- **Proactive Alerts**: AI identifies financial risks and opportunities
- **Excel Processing**: Handles any Excel file format intelligently
- **Responsive Design**: Works perfectly on desktop and mobile

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Framer Motion** - Smooth animations
- **Chart.js** - Interactive data visualization
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client
- **React Dropzone** - File upload handling

### Backend
- **FastAPI** - High-performance Python API
- **Pandas** - Data processing and analysis
- **Gemini AI** - Advanced AI responses
- **OpenPyXL** - Excel file processing

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- Python 3.8+
- npm or yarn

### Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
python main.py
```

### Frontend Setup
```bash
# Install Node.js dependencies
npm install

# Start the React development server
npm start
```

## 🎯 Usage

1. **Start Backend**: Run `python main.py` (runs on http://localhost:8000)
2. **Start Frontend**: Run `npm start` (runs on http://localhost:3000)
3. **Upload Excel**: Drag and drop your financial data file
4. **Explore Insights**: Navigate through Dashboard, Analytics, and Virtual Executives

## 📊 Supported Data Formats

The platform intelligently processes Excel files with:
- **Transactions**: Date, Description, Category, Amount
- **Campaign Data**: Timestamp, Campaign_ID, Channel, Spend, Acquisitions  
- **Targets**: Metric_Name, Value

*Note: The system works with any Excel file format and creates default data when needed.*

## 🎨 Design Features

- **Dark Theme**: Professional dark UI with glass morphism effects
- **Gradient Accents**: Beautiful color gradients throughout
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Layout**: Mobile-first design approach
- **Modern Typography**: Inter font for clean readability

## 🔧 Configuration

### Gemini API Setup
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update `config.py` with your API key:
```python
GEMINI_API_KEY = "your-api-key-here"
```

## 📱 Screenshots

- **Upload Interface**: Drag & drop file upload with progress indicators
- **Dashboard**: KPI cards with trend indicators and alerts
- **Analytics**: Interactive charts with filtering options
- **Virtual Executives**: AI-powered chat interface with persona selection

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the build folder
```

### Backend (Railway/Heroku)
```bash
# Add Procfile
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the console for error messages
- Ensure both frontend and backend are running
- Verify your Gemini API key is correctly configured

---

**Built with ❤️ for the future of financial analysis**