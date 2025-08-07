# 🌟 Nova AI – Smart Content & Image Tools

Nova AI is a powerful backend service that uses AI to generate articles, blog titles, images, and even review resumes.

### 🚀 Features

- ✍️ AI-Powered Article & Blog Title Generation (Gemini API)
- 🖼️ Image Generation (ClipDrop)
- 🧽 Background/Object Removal (Cloudinary)
- 📄 Resume PDF Review (Gemini API)

### 🔐 Access Control

| Feature            | Free Users     | Premium Users   |
|--------------------|----------------|-----------------|
| Article / Blog     | ✅ (10 uses)   | ✅ Unlimited   |
| Image Tools        | ❌            | ✅              |
| Resume Review      | ❌            | ✅              |

---

### 🧰 Tech Stack

- Node.js + Express.js
- Clerk (Auth & User Limits)
- PostgreSQL (Data Storage)
- OpenAI Gemini API
- ClipDrop API
- Cloudinary
- Multer + PDF-Parse

---

### 📦 Setup

```bash
git clone https://github.com/yourname/nova-ai
cd nova-ai
npm install
npm run dev


### DEMO => https://nova-ai-iota.vercel.app/

