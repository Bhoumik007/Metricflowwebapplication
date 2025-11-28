import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { BarChart3, Target, CheckCircle, Lock } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* HERO SECTION */}
      <section 
        className="relative overflow-hidden flex items-center justify-center"
        style={{
          minHeight: '90vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '120px 24px'
        }}
      >
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-26070-large.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto text-center">
          <h1 className="mb-6" style={{ 
            color: 'white',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.9)',
            maxWidth: '900px',
            margin: '0 auto 24px auto'
          }}>
            Track Your Business Metrics
          </h1>
          
          <div 
            className="mb-6"
            style={{
              fontSize: '4.5rem',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #F59E0B, #EF4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.9)',
              maxWidth: '900px',
              margin: '0 auto 24px auto'
            }}
          >
            Simply & Effectively
          </div>
          
          <p 
            className="mb-12"
            style={{
              fontSize: '22px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.95)',
              lineHeight: 1.6,
              maxWidth: '650px',
              margin: '0 auto 48px auto',
              textShadow: '0 3px 10px rgba(0, 0, 0, 0.9)'
            }}
          >
            Stop juggling spreadsheets. Monitor your KPIs in one beautiful dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto text-lg transition-all duration-300"
              style={{
                backgroundColor: 'white',
                color: '#2563EB',
                fontWeight: 600,
                padding: '16px 40px',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
              }}
            >
              Get Started Free
            </button>
            
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto text-lg transition-all duration-300"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                fontWeight: 600,
                padding: '16px 40px',
                borderRadius: '12px',
                border: '2px solid white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Login
            </button>
          </div>
        </div>
      </section>
      
      {/* FEATURES SECTION */}
      <section style={{ 
        padding: '120px 24px',
        backgroundColor: '#F8FAFC'
      }}>
        <div className="max-w-[1400px] mx-auto" style={{ padding: '0 56px' }}>
          <div className="text-center mb-20">
            <h2 className="mb-4" style={{ color: '#0F172A' }}>
              Why Choose MetricFlow?
            </h2>
            <p style={{
              fontSize: '20px',
              color: '#64748B',
              lineHeight: 1.6,
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Everything you need to track, measure, and improve your business performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Feature 1: Track KPIs */}
            <div 
              className="bg-white p-10 text-center transition-all duration-300 cursor-pointer"
              style={{
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#2563EB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <div 
                className="inline-flex items-center justify-center mb-6"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#EFF6FF'
                }}
              >
                <BarChart3 size={32} style={{ color: '#2563EB' }} />
              </div>
              <h3 className="mb-3" style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A' }}>
                Track KPIs
              </h3>
              <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6 }}>
                Monitor revenue, customers, conversions and more
              </p>
            </div>
            
            {/* Feature 2: Set Goals */}
            <div 
              className="bg-white p-10 text-center transition-all duration-300 cursor-pointer"
              style={{
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#10B981';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <div 
                className="inline-flex items-center justify-center mb-6"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#D1FAE5'
                }}
              >
                <Target size={32} style={{ color: '#10B981' }} />
              </div>
              <h3 className="mb-3" style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A' }}>
                Set Goals
              </h3>
              <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6 }}>
                Define targets and track your progress visually
              </p>
            </div>
            
            {/* Feature 3: Simple Interface */}
            <div 
              className="bg-white p-10 text-center transition-all duration-300 cursor-pointer"
              style={{
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#8B5CF6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <div 
                className="inline-flex items-center justify-center mb-6"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#EDE9FE'
                }}
              >
                <CheckCircle size={32} style={{ color: '#8B5CF6' }} />
              </div>
              <h3 className="mb-3" style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A' }}>
                Simple Interface
              </h3>
              <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6 }}>
                No learning curve. Start tracking in minutes
              </p>
            </div>
            
            {/* Feature 4: Secure Data */}
            <div 
              className="bg-white p-10 text-center transition-all duration-300 cursor-pointer"
              style={{
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#F59E0B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <div 
                className="inline-flex items-center justify-center mb-6"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#FEF3C7'
                }}
              >
                <Lock size={32} style={{ color: '#F59E0B' }} />
              </div>
              <h3 className="mb-3" style={{ fontSize: '20px', fontWeight: 600, color: '#0F172A' }}>
                Secure Data
              </h3>
              <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6 }}>
                Your business data is encrypted and private
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* BLOG SECTION */}
      <section style={{ 
        padding: '120px 24px',
        backgroundColor: 'white'
      }}>
        <div className="max-w-[1400px] mx-auto" style={{ padding: '0 56px' }}>
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ color: '#0F172A' }}>
              Latest Insights
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#64748B',
              lineHeight: 1.6,
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              Stay informed with expert advice on business metrics, financial planning, and growth strategies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Article 1 */}
            <article 
              className="bg-white overflow-hidden transition-all duration-300 cursor-pointer"
              style={{
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ height: '240px', overflow: 'hidden' }}>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFuYWx5dGljcyUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NjQyNTg5OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Business analytics dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
              <div style={{ padding: '32px' }}>
                <div 
                  className="inline-block mb-3"
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#2563EB',
                    backgroundColor: '#EFF6FF',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Business Analytics
                </div>
                <h3 className="mb-3" style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                  5 Essential Metrics Every Business Should Track
                </h3>
                <p className="mb-5" style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6 }}>
                  Learn which KPIs matter most for your business growth and how to measure them effectively.
                </p>
                <a href="#" style={{ fontSize: '15px', fontWeight: 600, color: '#2563EB' }}>
                  Read More →
                </a>
              </div>
            </article>
            
            {/* Article 2 */}
            <article 
              className="bg-white overflow-hidden transition-all duration-300 cursor-pointer"
              style={{
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ height: '240px', overflow: 'hidden' }}>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1744473755637-e09f0c2fab41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBncm93dGglMjBjaGFydHxlbnwxfHx8fDE3NjQzMjE1NjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Financial growth chart"
                  className="w-full h-full object-cover"
                />
              </div>
              <div style={{ padding: '32px' }}>
                <div 
                  className="inline-block mb-3"
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#10B981',
                    backgroundColor: '#D1FAE5',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Financial Planning
                </div>
                <h3 className="mb-3" style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                  How to Set Realistic Revenue Targets for 2024
                </h3>
                <p className="mb-5" style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6 }}>
                  Discover data-driven approaches to goal setting that align with market trends and business capacity.
                </p>
                <a href="#" style={{ fontSize: '15px', fontWeight: 600, color: '#2563EB' }}>
                  Read More →
                </a>
              </div>
            </article>
            
            {/* Article 3 */}
            <article 
              className="bg-white overflow-hidden transition-all duration-300 cursor-pointer"
              style={{
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ height: '240px', overflow: 'hidden' }}>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1707301280380-56f7e7a00aef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBzdHJhdGVneXxlbnwxfHx8fDE3NjQzMTI2MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Business strategy meeting"
                  className="w-full h-full object-cover"
                />
              </div>
              <div style={{ padding: '32px' }}>
                <div 
                  className="inline-block mb-3"
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#8B5CF6',
                    backgroundColor: '#EDE9FE',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Growth Strategy
                </div>
                <h3 className="mb-3" style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                  From Data to Decisions: Building a KPI Culture
                </h3>
                <p className="mb-5" style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6 }}>
                  Transform your organization with metric-driven decision making and accountability frameworks.
                </p>
                <a href="#" style={{ fontSize: '15px', fontWeight: 600, color: '#2563EB' }}>
                  Read More →
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
      
      {/* FOOTER */}
      <footer style={{ 
        backgroundColor: '#0F172A',
        color: 'white',
        padding: '64px 24px 32px 24px'
      }}>
        <div className="max-w-[1400px] mx-auto text-center" style={{ padding: '0 56px' }}>
          <h3 className="mb-3" style={{ 
            fontSize: '28px',
            fontWeight: 700,
            color: 'white'
          }}>
            MetricFlow
          </h3>
          <p className="mb-8" style={{ 
            fontSize: '16px',
            color: '#94A3B8'
          }}>
            Track your business metrics with confidence
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 mb-6" style={{ fontSize: '14px' }}>
            <a 
              href="#" 
              style={{ color: '#CBD5E1', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#CBD5E1'}
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              style={{ color: '#CBD5E1', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#CBD5E1'}
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              style={{ color: '#CBD5E1', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#CBD5E1'}
            >
              Contact
            </a>
            <a 
              href="#" 
              style={{ color: '#CBD5E1', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#CBD5E1'}
            >
              About
            </a>
          </div>
          
          <div style={{ 
            paddingTop: '24px',
            borderTop: '1px solid #1E293B'
          }}>
            <p style={{ fontSize: '14px', color: '#64748B' }}>
              © 2024 MetricFlow. Built with Figma Make
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
