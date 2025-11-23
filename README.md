# SalesIQ  
An **AI-powered Sales Coaching Platform** that analyzes audio recordings of sales calls to provide insights, coaching, and performance intelligence for sales teams.

---

## 🧠 What is SalesIQ?

SalesIQ is an AI-powered sales coaching platform that analyzes audio recordings of sales calls. By leveraging **Google's Gemini 2.5 Flash** model, it automatically:

- Generates a **speaker-diarized transcript**  
- Visualizes **customer sentiment** across the timeline of the call  
- Detects **competitor mentions** and key topics  
- Provides **actionable coaching feedback**  
- Highlights **strengths**, **improvement areas**, and **missed opportunities**

This enables sales reps to understand how their conversations went, where they can improve, and how to convert more prospects into customers.

---

## 🚀 Features

### 🎙️ AI Call Analysis  
- Speaker-diarized transcription using **Gemini 2.5 Flash**  
- Auto-split of transcript into sections (Introduction, Discovery, Pitch, Objections, Closure)  
- Confidence scoring for each segment

### 😊 Sentiment Insights  
- Visual sentiment timeline for the customer  
- Detection of emotional highs/lows  
- Sentiment summaries (positive, neutral, negative segments)

### 🥇 Sales Coaching  
- Strengths identified automatically  
- Missed opportunities called out  
- Recommended responses  
- Coaching tips tailored to conversation patterns

### 🏷️ Entity & Competitor Detection  
- Mentions of competitors  
- Product/category references  
- Automatic topic clustering

### 📊 Dashboard & Reports (Future)  
- Rep performance trends  
- Call quality scoring  
- Exportable reports and insights

---

## 🛠️ Tech Stack

**Frontend:**  
- React  
- TypeScript  
- Vite  

**AI Processing:**  
- **Google Gemini 2.5 Flash** (via API) used for:  
  - Audio transcription  
  - Speaker diarization  
  - Sentiment analysis  
  - Entity/competitor detection  
  - Coaching report generation  

**Other:**  
- Modular components  
- Clean TypeScript architecture  
- Configurable API & services layer  

---

## 📁 Folder Structure

salesiq/
├── components/ # UI components
├── services/ # AI + API service modules
├── types.ts # Shared TypeScript types
├── App.tsx # Main application
├── index.tsx # Entry file
├── vite.config.ts # Vite config
└── README.md # Project documentation

yaml
Copy code

---

## 🧩 How It Works

1. User uploads a call audio file  
2. Audio is sent to backend (or directly to Gemini 2.5 Flash API depending on setup)  
3. Gemini processes the audio to produce:  
   - Transcript  
   - Speakers  
   - Sentiment labels  
   - Entity/competitor detection  
   - Structured coaching insights  
4. UI displays results with:  
   - Charts  
   - Sentiment timeline  
   - Transcript viewer  
   - Coaching feedback panel

---

## ⚙️ Getting Started

### Prerequisites  
- Node.js 16+  
- npm or yarn  
- Gemini API key (Google AI Studio / Vertex AI)

### Installation  
```bash
git clone https://github.com/MohammadAli-dev/salesiq.git
cd salesiq
npm install
Run in Development
bash
Copy code
npm run dev
Build for Production
bash
Copy code
npm run build
🔑 Environment Configuration
Create a .env file:

env
Copy code
VITE_GEMINI_API_KEY=your_api_key_here
VITE_API_ENDPOINT=https://your-backend.example.com
If using a backend service, configure it inside /services/.

🧪 Usage
Upload a Call
Click Upload Call Recording

Supported formats: .mp3, .wav, .m4a

View AI Insights
You’ll see:

Full transcript

Speaker turns

Sentiment graph

Competitor mentions

Coaching feedback report

🤝 Contributing
Fork the repo

Create new feature branch

Commit and push

Open Pull Request

📜 License
MIT License.

📬 Contact
Mohammad Ali
Email: mohammad8.ali6@gmail.com
GitHub: @MohammadAli-dev

🙏 Acknowledgements
Google Gemini 2.5 Flash model for AI processing

React + TypeScript open-source community

Testing partners providing sample calls for improvement