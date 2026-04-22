import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
        <div className="max-w-5xl mx-auto space-y-10 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Numerical Computing Engine</h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
              Explore mathematical approximations through step-by-step visualizations and real-time computation engines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <motion.div
                key={lesson.id}
                whileHover={{ y: -5 }}
                onClick={() => setActiveLesson(lesson.id as LessonId)}
                className="group p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all cursor-pointer flex flex-col items-start gap-4"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <lesson.icon size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{lesson.title}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">{lesson.description}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-50 w-full flex items-center justify-between group-hover:border-blue-50 transition-colors">
                   <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Start Module</span>
                   <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 translate-x-0 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-800/50 blur-[80px] rounded-full" />
            
            <div className="relative z-10 space-y-4 text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tight">Numerical Problem Solver</h2>
              <p className="text-slate-400 max-w-md text-sm leading-relaxed">Our visual engine breaks down complex operations into manageable steps. Try entering your own functions in any module.</p>
              <button 
                 onClick={() => setActiveLesson('taylor')}
                 className="mt-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95 text-sm"
              >
                Launch First Lesson
              </button>
            </div>

            <div className="relative z-10 w-full max-w-[320px] bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 space-y-4">
               <div className="flex items-center gap-3 text-sm font-mono text-blue-400">
                 <Binary size={16} /> <span>Engine Stats</span>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                    <span className="text-slate-500">Precision</span>
                    <span className="text-blue-300">Symbolic</span>
                  </div>
                  <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-4/5" />
                  </div>
               </div>
               <div className="pt-2 flex justify-around">
                  <div className="text-center">
                    <div className="text-xl font-bold">100%</div>
                    <div className="text-[10px] text-slate-500 uppercase">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">Realtime</div>
                    <div className="text-[10px] text-slate-500 uppercase">Updates</div>
                  </div>
               </div>
            </div>
          </div>
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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLesson}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Drawer (re-adapted for Professional theme) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-slate-900 text-slate-300 z-[70] shadow-2xl flex flex-col md:hidden"
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
      </AnimatePresence>
    </div>
  );

}

