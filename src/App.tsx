import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Binary, 
  Activity, 
  Search, 
  Menu, 
  X,
  ChevronRight,
  ChevronLeft,
  Home,
  Info
} from 'lucide-react';
import { cn } from './lib/utils';
import TaylorLesson from './lessons/TaylorLesson';
import MatrixLesson from './lessons/MatrixLesson';
import RootsLesson from './lessons/RootsLesson';

type LessonId = 'home' | 'taylor' | 'matrices' | 'roots';

const LESSONS = [
  { id: 'taylor', title: 'Taylor & Maclaurin', icon: Activity, description: 'Power series approximation, Maclaurin expansion, polynomial fitting' },
  { id: 'matrices', title: 'Matrices & Systems', icon: Binary, description: 'Determinants, Inverse Matrix, Gaussian Elimination, Cramer\'s Rule' },
  { id: 'roots', title: 'Roots of Equations', icon: BookOpen, description: 'Bisection, Newton-Raphson, False Position, Secant method' },
] as const;


export default function App() {
  const [activeLesson, setActiveLesson] = useState<LessonId>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLessons = useMemo(() => {
    if (!searchQuery) return LESSONS;
    return LESSONS.filter(l => 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const renderContent = () => {
    switch (activeLesson) {
      case 'taylor': return <TaylorLesson />;
      case 'matrices': return <MatrixLesson />;
      case 'roots': return <RootsLesson />;
      default: return (
        <div className="max-w-6xl mx-auto space-y-12 py-6 animate-slide-in">
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-6xl font-extrabold text-gradient tracking-tight">
                Numerical Computing Engine
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
                Master mathematical approximations through interactive visualizations, real-time computation engines, and step-by-step problem solving.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {['Interactive', 'Real-time', 'Step-by-step', 'Visual Learning'].map((tag, i) => (
                <span key={tag} className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-200 animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredLessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setActiveLesson(lesson.id as LessonId)}
                className="group p-8 glass rounded-3xl border border-white/20 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all cursor-pointer flex flex-col items-start gap-6 card-hover relative overflow-hidden"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="w-16 h-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/30">
                  <lesson.icon size={32} />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-gradient transition-colors">{lesson.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{lesson.description}</p>
                </div>
                
                <div className="mt-auto pt-6 border-t border-slate-100 w-full flex items-center justify-between group-hover:border-blue-200 transition-colors">
                   <span className="text-sm font-bold text-blue-600 uppercase tracking-wider group-hover:text-gradient">Start Module</span>
                   <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="bg-gradient-to-br from-slate-900 via-blue-900/90 to-slate-900 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative shadow-2xl border border-white/10"
          >
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-[120px] rounded-full animate-float" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-600/10 to-blue-600/10 blur-[100px] rounded-full animate-pulse-glow" />
            
            <div className="relative z-10 space-y-6 text-center md:text-left">
              <h2 className="text-4xl font-bold tracking-tight text-gradient-2">Advanced Problem Solver</h2>
              <p className="text-slate-300 max-w-md text-base leading-relaxed">Our visual computation engine breaks down complex mathematical operations into intuitive, step-by-step visualizations. Enter your own functions and watch the magic happen in real-time.</p>
              <div className="flex flex-wrap gap-3">
                <button 
                   onClick={() => setActiveLesson('taylor')}
                   className="btn-gradient px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all"
                >
                  Launch First Lesson
                </button>
                <button className="px-6 py-4 glass rounded-2xl font-semibold text-white/80 hover:text-white transition-all border border-white/20">
                  View Demo
                </button>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="relative z-10 w-full max-w-[380px] glass-dark rounded-3xl border border-white/10 p-8 space-y-6"
            >
               <div className="flex items-center gap-3 text-sm font-mono text-blue-400">
                 <Binary size={20} className="animate-pulse" /> <span className="font-bold">Engine Performance</span>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs uppercase font-bold tracking-wider">
                      <span className="text-slate-400">Computational Precision</span>
                      <span className="text-blue-300 font-mono">Symbolic + Numeric</span>
                    </div>
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '95%' }}
                        transition={{ delay: 1.2, duration: 1.5, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 shimmer rounded-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs uppercase font-bold tracking-wider">
                      <span className="text-slate-400">Algorithm Efficiency</span>
                      <span className="text-green-300 font-mono">O(n log n)</span>
                    </div>
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '88%' }}
                        transition={{ delay: 1.4, duration: 1.2, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 shimmer rounded-full"
                      />
                    </div>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gradient">100%</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gradient-2">Realtime</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Processing</div>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setActiveLesson('home')}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              <Binary size={20} />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">NumMethods</span>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            <button 
              onClick={() => setActiveLesson('home')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                activeLesson === 'home' ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-slate-400"
              )}
            >
              <Home size={18} /> Dashboard
            </button>
          </div>

          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lesson 1: Series</div>
            <button 
              onClick={() => setActiveLesson('taylor')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                activeLesson === 'taylor' ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-slate-400"
              )}
            >
              <Activity size={18} /> Taylor & Maclaurin
            </button>
          </div>

          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lesson 2: Matrices</div>
            <button 
              onClick={() => setActiveLesson('matrices')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                activeLesson === 'matrices' ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-slate-400"
              )}
            >
              <Binary size={18} /> Matrix Determinants
            </button>
          </div>

          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lesson 3: Roots</div>
            <button 
              onClick={() => setActiveLesson('roots')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                activeLesson === 'roots' ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-slate-400"
              )}
            >
              <BookOpen size={18} /> Roots of Equations
            </button>
          </div>
        </nav>

        <div className="p-4 bg-slate-950 text-[10px] text-slate-500 font-mono tracking-tighter">
          v2.4.0 • Build ID: NM-2026
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search methods (e.g. Cramer's Rule)..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 ml-4">
            <button className="hidden sm:block px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              Reset
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
               {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
          <motion.div
            key={activeLesson}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full"
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>

      {/* Mobile Drawer (re-adapted for Professional theme) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isSidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden"
        onClick={() => setIsSidebarOpen(false)}
      />
      {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-0 top-0 h-full w-80 bg-slate-900 shadow-2xl z-[70] md:hidden overflow-y-auto"
            >
               <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <span className="font-bold text-white">NumMethods</span>
                <X onClick={() => setIsSidebarOpen(false)} className="text-slate-500" size={20} />
              </div>
              <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
                <div className="space-y-1">
                  <button onClick={() => { setActiveLesson('home'); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-slate-800 rounded-md">
                    <Home size={18} /> Dashboard
                  </button>
                </div>
                <div className="space-y-1">
                   <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lesson 1: Series</div>
                   <button onClick={() => { setActiveLesson('taylor'); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-slate-800 rounded-md">
                    <Activity size={18} /> Taylor & Maclaurin
                   </button>
                </div>
                <div className="space-y-1">
                   <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lesson 2: Matrices</div>
                   <button onClick={() => { setActiveLesson('matrices'); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-slate-800 rounded-md">
                    <Binary size={18} /> Matrix Determinants
                   </button>
                </div>
                <div className="space-y-1">
                   <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lesson 3: Roots</div>
                   <button onClick={() => { setActiveLesson('roots'); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium hover:bg-slate-800 rounded-md">
                    <BookOpen size={18} /> Roots of Equations
                   </button>
                </div>
              </nav>

            </motion.div>
          </>
        )}
    </div>
  );

}

