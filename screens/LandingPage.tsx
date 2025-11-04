import React from 'react';
import { BrainIcon, MyStatsIcon, GamesIcon, ChevronRightIcon } from '../components/icons';

interface LandingPageProps {
  onNavigateToAuth: (page: 'login' | 'signup') => void;
}

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
    <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
      <Icon className="w-10 h-10 text-indigo-600" />
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{children}</p>
  </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
  return (
    <div className="bg-gray-50 text-gray-800 font-sans animate-fade-in overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BrainIcon className="w-9 h-9 text-indigo-600" />
            <span className="text-3xl font-bold text-gray-800">CogniFlex</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-indigo-600 font-semibold text-lg transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600 font-semibold text-lg transition-colors">How It Works</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigateToAuth('login')} className="px-5 py-2.5 rounded-lg font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors text-lg">
              Log In
            </button>
            <button onClick={() => onNavigateToAuth('signup')} className="px-5 py-2.5 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-lg">
              Sign Up Free
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-60 pb-40 lg:pt-72 lg:pb-48 overflow-hidden bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent animate-gradient-pan bg-[200%_200%]">
          <div className="absolute inset-0 z-0 opacity-30">
            <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-white/10 rounded-full animate-float blur-sm"></div>
            <div className="absolute top-[20%] right-[10%] w-48 h-48 bg-white/10 rounded-full animate-float blur-md" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
            <div className="absolute bottom-[15%] left-[20%] w-24 h-24 bg-white/5 rounded-2xl animate-float blur-lg" style={{ animationDelay: '4s', animationDuration: '10s' }}></div>
            <div className="absolute bottom-[5%] right-[25%] w-40 h-40 bg-white/10 rounded-full animate-float blur-sm" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Unlock Your Brain's <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">Full Potential</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-indigo-100/90 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              Challenge your mind with a suite of fun, science-based cognitive games designed to improve memory, attention, and problem-solving skills.
            </p>
            <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <button onClick={() => onNavigateToAuth('signup')} className="group inline-flex items-center gap-3 px-10 py-5 text-xl font-bold text-gray-900 bg-white rounded-xl shadow-2xl hover:bg-gray-200 transition-all transform hover:scale-105">
                Start Your Free Training
                <ChevronRightIcon className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 lg:py-28 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">A Smarter Way to Train Your Brain</h2>
              <p className="mt-5 text-xl text-gray-600 max-w-3xl mx-auto">CogniFlex offers a personalized training program that adapts to your unique strengths and weaknesses.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <FeatureCard icon={BrainIcon} title="Personalized Workouts">
                  Daily training sessions tailored to your performance level, ensuring you're always challenged.
                </FeatureCard>
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <FeatureCard icon={MyStatsIcon} title="Track Your Progress">
                  Detailed stats and insights to see how you improve over time across different cognitive areas.
                </FeatureCard>
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <FeatureCard icon={GamesIcon} title="Diverse Game Library">
                  Dozens of engaging games across memory, attention, speed, and more to keep you motivated.
                </FeatureCard>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-6">
             <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">Start Training in 3 Easy Steps</h2>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-10 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
              <div className="relative grid md:grid-cols-3 gap-12">
                <div className="text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                  <div className="mb-6 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 text-white font-bold text-4xl rounded-full flex items-center justify-center mx-auto relative z-10 shadow-lg">1</div>
                  <h3 className="text-2xl font-bold mb-3">Create an Account</h3>
                  <p className="text-gray-600 text-lg">Quick and easy signup to begin your journey to a sharper mind.</p>
                </div>
                <div className="text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                   <div className="mb-6 w-20 h-20 bg-gradient-to-br from-purple-400 to-violet-600 text-white font-bold text-4xl rounded-full flex items-center justify-center mx-auto relative z-10 shadow-lg">2</div>
                  <h3 className="text-2xl font-bold mb-3">Play Daily Games</h3>
                  <p className="text-gray-600 text-lg">Complete your personalized daily workout and discover new challenges.</p>
                </div>
                <div className="text-center animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                   <div className="mb-6 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-600 text-white font-bold text-4xl rounded-full flex items-center justify-center mx-auto relative z-10 shadow-lg">3</div>
                  <h3 className="text-2xl font-bold mb-3">See Your LPI Grow</h3>
                  <p className="text-gray-600 text-lg">Watch your Lumosity Performance Index (LPI) improve with consistent training.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BrainIcon className="w-9 h-9" />
            <span className="text-3xl font-bold">CogniFlex</span>
          </div>
          <p className="text-gray-400 max-w-md mx-auto">Ready to challenge yourself? Join thousands of users who are sharpening their minds every day.</p>
           <div className="mt-8">
              <button onClick={() => onNavigateToAuth('signup')} className="px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">
                Get Started for Free
              </button>
            </div>
          <p className="mt-10 text-gray-500">&copy; 2024 CogniFlex Brain Trainer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;