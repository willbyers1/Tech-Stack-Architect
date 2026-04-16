import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2, Send, Server, Database, Layout, Code2, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  // --- YENİ EKLENEN API KEY STATE'LERİ ---
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(!localStorage.getItem('gemini_api_key'));

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [description, setDescription] = useState('');
  const [complexity, setComplexity] = useState('Simple CRUD');
  const [scale, setScale] = useState('100-1000 users');
  const [priority, setPriority] = useState('Speed to Market (MVP)');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- API KEY KAYDETME FONKSİYONU ---
  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as any;
    const key = target.elements.apiKey.value;
    if (key) {
      localStorage.setItem('gemini_api_key', key);
      setApiKey(key);
      setShowKeyInput(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    if (!apiKey) {
      setError('API Key bulunamadı. Lütfen sayfayı yenileyip anahtarınızı girin.');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      // API'yi kullanıcının girdiği key ile başlatıyoruz
      const ai = new GoogleGenAI({ apiKey: apiKey });

      const prompt = `
        Project Description: ${description}
        Complexity: ${complexity}
        Expected Scale: ${scale}
        Main Priority: ${priority}
        
        Please provide a comprehensive technical recommendation based on the framework and structure required.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are a Senior Software Architect and CTO with 20+ years of experience in system design and infrastructure. Your expertise covers Frontend (Web/Mobile), Backend (Monolithic/Microservices), Database Design (SQL/NoSQL), DevOps (CI/CD, Cloud Providers), and DX (Developer Experience). Your goal is to act as a 'Tech Stack Decision Helper' for users who are starting new software projects.

When a user provides a project type, you must evaluate it based on:
- Complexity: Is it a simple CRUD app, a real-time system, or a data-intensive platform?
- Scalability: Will it have 100 users or 1 million?
- Speed to Market (MVP): Does the user need to launch fast?
- SEO & Performance: Is it a public-facing e-commerce site (needs SSR) or an internal dashboard (CSR is fine)?

Your response must be structured as follows:
1. Project Summary & Interpretation
2. The Recommended Stack (The 'Winner'): Frontend, Backend, Database, Styling/UI, State Management, Authentication, Hosting/Cloud.
3. Deep-Dive Justification (2-3 bullet points per choice)
4. The 'Trade-offs' Section
5. Alternative 'Lightweight' Stack
6. Next Steps (Execution Plan with 5-step checklist and initialization commands)

Tone: Professional, objective, encouraging. Avoid hype-driven development. Provide code snippets for initialization.`,
        }
      });

      setResult(response.text || '');
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the recommendation. Please check your API Key.');
    } finally {
      setLoading(false);
    }
  };

  // --- API KEY GİRİŞ EKRANI (Anahtar yoksa gösterilecek) ---
  if (showKeyInput) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-100 p-3 rounded-full">
              <Code2 className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center text-slate-800">Gemini API Key</h2>
          <p className="text-slate-500 mb-6 text-center text-sm">
            Projenin çalışması için lütfen API anahtarını gir. Bu anahtar sadece senin tarayıcında saklanır, sunucuya gönderilmez.
          </p>
          <form onSubmit={handleSaveKey} className="space-y-4">
            <input
              name="apiKey"
              type="password"
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900"
              required
            />
            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition shadow-sm">
              Kaydet ve Başlat
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- ANA UYGULAMA ARAYÜZÜ ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/50 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-200">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Server className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              Tech Stack Architect
            </h1>
          </div>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <Database className="w-4 h-4" />
              <Layout className="w-4 h-4" />
              <Code2 className="w-4 h-4" />
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('gemini_api_key');
                window.location.reload();
              }}
              className="text-xs border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Key Sıfırla
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-200">
              <h2 className="text-lg font-semibold mb-4 dark:text-slate-100">Project Requirements</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Describe your project
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., A real-time collaborative whiteboard for remote teams..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all resize-none h-32 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Complexity
                  </label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-colors"
                  >
                    <option>Simple CRUD</option>
                    <option>Real-time / WebSockets</option>
                    <option>Data-Intensive / AI</option>
                    <option>High Performance / Low Latency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Expected Scale
                  </label>
                  <select
                    value={scale}
                    onChange={(e) => setScale(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-colors"
                  >
                    <option>100-1000 users (MVP)</option>
                    <option>10k-100k users (Growth)</option>
                    <option>1M+ users (Enterprise)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Main Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-colors"
                  >
                    <option>Speed to Market (MVP)</option>
                    <option>SEO & Public Performance</option>
                    <option>Developer Experience (DX)</option>
                    <option>Cost Efficiency</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading || !description.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Get Recommendation
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}

            {!result && !loading && !error && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed p-8 text-center transition-colors duration-200">
                <Server className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Ready to architect your app</h3>
                <p className="max-w-md">
                  Fill out your project requirements on the left, and I'll generate a production-ready tech stack recommendation tailored to your needs.
                </p>
              </div>
            )}

            {loading && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center transition-colors duration-200">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 dark:text-indigo-400 mb-4" />
                <p className="text-slate-600 dark:text-slate-400 font-medium animate-pulse">Consulting the Senior Architect...</p>
              </div>
            )}

            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:text-indigo-500 dark:hover:prose-a:text-indigo-300 prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:text-slate-50 dark:text-slate-300 dark:prose-headings:text-slate-100 transition-colors duration-200"
              >
                <div className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}