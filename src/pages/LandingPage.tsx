import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { BarChart3, Target, CheckCircle, Lock } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="flex-1 relative overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="https://cdn.pixabay.com/video/2023/10/30/186699-878994813_large.mp4"
              type="video/mp4"
            />
          </video>
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 via-transparent to-white"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="mb-6">
              <span className="block text-white mb-2" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8)' }}>
                Track Your Business Metrics
              </span>
              <span className="block text-yellow-400" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8)' }}>
                Simply & Effectively
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-white text-lg mb-10" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
              Stop juggling spreadsheets. Monitor your KPIs in one beautiful dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded-lg transition-colors shadow-2xl hover:shadow-yellow-500/50"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-lg border-2 border-white transition-colors shadow-2xl"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 rounded-full p-3 inline-flex">
                  <BarChart3 className="text-blue-600 w-8 h-8" />
                </div>
              </div>
              <h3 className="text-center mb-3">Track KPIs</h3>
              <p className="text-center text-gray-600 text-sm">
                Monitor revenue, customers, conversions and more
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3 inline-flex">
                  <Target className="text-green-600 w-8 h-8" />
                </div>
              </div>
              <h3 className="text-center mb-3">Set Goals</h3>
              <p className="text-center text-gray-600 text-sm">
                Define targets and track your progress visually
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 rounded-full p-3 inline-flex">
                  <CheckCircle className="text-purple-600 w-8 h-8" />
                </div>
              </div>
              <h3 className="text-center mb-3">Simple Interface</h3>
              <p className="text-center text-gray-600 text-sm">
                No learning curve. Start tracking in minutes
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-orange-100 rounded-full p-3 inline-flex">
                  <Lock className="text-orange-600 w-8 h-8" />
                </div>
              </div>
              <h3 className="text-center mb-3">Secure Data</h3>
              <p className="text-center text-gray-600 text-sm">
                Your business data is encrypted and private
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Finance Articles Section */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">Latest Insights</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay informed with expert advice on business metrics, financial planning, and growth strategies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Article 1 */}
            <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video w-full overflow-hidden bg-gray-200">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFuYWx5dGljcyUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NjQyNTg5OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Business analytics dashboard"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="text-blue-600 text-sm mb-2">Business Analytics</div>
                <h3 className="mb-3">5 Essential Metrics Every Business Should Track</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Learn which KPIs matter most for your business growth and how to measure them effectively.
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center">
                  Read More →
                </a>
              </div>
            </article>

            {/* Article 2 */}
            <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video w-full overflow-hidden bg-gray-200">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1744473755637-e09f0c2fab41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBncm93dGglMjBjaGFydHxlbnwxfHx8fDE3NjQzMjE1NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Financial growth chart"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="text-green-600 text-sm mb-2">Financial Planning</div>
                <h3 className="mb-3">How to Set Realistic Revenue Targets for 2024</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Discover data-driven approaches to goal setting that align with market trends and business capacity.
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center">
                  Read More →
                </a>
              </div>
            </article>

            {/* Article 3 */}
            <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video w-full overflow-hidden bg-gray-200">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1707301280380-56f7e7a00aef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBzdHJhdGVneXxlbnwxfHx8fDE3NjQzMTI2MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Business strategy meeting"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="text-purple-600 text-sm mb-2">Growth Strategy</div>
                <h3 className="mb-3">From Data to Decisions: Building a KPI Culture</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Transform your organization with metric-driven decision making and accountability frameworks.
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center">
                  Read More →
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2024 MetricFlow. Built with Figma Make
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
