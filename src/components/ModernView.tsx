import React, { useState, useEffect } from 'react';
import { useViewMode } from '../contexts/ViewModeContext';
import { Monitor, ExternalLink, Github, ChevronDown, Sparkles } from 'lucide-react';
import { aboutPageMeta, type Experience } from '../pages/about/meta';
import { contactPageMeta } from '../pages/contact/meta';
import { useTranslation } from 'react-i18next';
import { getCryptborneMeta, getSatTrackMeta, getCteXecutorMeta } from '../lib/i18nMetaHelpers';
import { LanguageSwitcher } from './LanguageSwitcher';

export const ModernView: React.FC = () => {
  const { toggleViewMode } = useViewMode();
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const navRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState<{ width: string; left: string }>({ width: '0px', left: '0px' });

  const cryptborne = getCryptborneMeta(t);
  const sattrack = getSatTrackMeta(t);
  const ctexecutor = getCteXecutorMeta(t);

  const projects = [cryptborne, sattrack, ctexecutor];

  // Sort experiences by date (DESC)
  const sortedExperiences = [...aboutPageMeta.experiences].sort((a, b) => {
    const getYear = (exp: Experience) => {
      if (exp.endMonth.toLowerCase().includes('heute') || exp.endMonth.toLowerCase().includes('today')) {
        return 9999; // Current experiences come first
      }
      // Extract year from endMonth (e.g., "Jan. 2024" -> 2024)
      const yearMatch = exp.endMonth.match(/\d{4}/);
      return yearMatch ? parseInt(yearMatch[0]) : 0;
    };
    return getYear(b) - getYear(a);
  });

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track scroll position for header styling and mouse position for parallax
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      setScrolled(scrollTop > 50);

      // Update active section based on scroll position
      const sections = ['home', 'about', 'experience', 'projects', 'contact'];
      const scrollPosition = scrollTop + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Update indicator position when activeSection changes
  useEffect(() => {
    const activeButton = navRefs.current[activeSection];
    if (activeButton) {
      setIndicatorStyle({
        width: `${activeButton.offsetWidth}px`,
        left: `${activeButton.offsetLeft}px`,
      });
    }
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    const container = scrollContainerRef.current;
    const element = document.getElementById(id);
    if (element && container) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      container.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  const handleViewModeToggle = () => {
    if (isMobile) {
      setShowMobileWarning(true);
    } else {
      toggleViewMode();
    }
  };

  const navItems = [
    { id: 'home', label: i18n.language === 'de' ? 'Home' : 'Home' },
    { id: 'about', label: i18n.language === 'de' ? 'Über mich' : 'About' },
    { id: 'experience', label: i18n.language === 'de' ? 'Erfahrung' : 'Experience' },
    { id: 'projects', label: i18n.language === 'de' ? 'Projekte' : 'Projects' },
    { id: 'contact', label: i18n.language === 'de' ? 'Kontakt' : 'Contact' },
  ];

  const parallaxX = (mousePosition.x / window.innerWidth - 0.5) * 20;
  const parallaxY = (mousePosition.y / window.innerHeight - 0.5) * 20;

  return (
      <div
          ref={scrollContainerRef}
          className="fixed inset-0 w-full h-full overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
          style={{ scrollbarGutter: 'stable', overflowX: 'hidden' }}>
        {/* Sticky Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <button
                onClick={() => scrollToSection('home')}
                className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent hover:scale-110 transition-transform"
            >
              YK
            </button>

            <div className="hidden md:flex items-center gap-1 relative">
              {navItems.map((item) => (
                  <button
                      key={item.id}
                      ref={(el) => { navRefs.current[item.id] = el; }}
                      onClick={() => scrollToSection(item.id)}
                      className={`px-4 py-2 rounded-lg transition-all relative z-10 ${
                          activeSection === item.id
                              ? 'text-white'
                              : 'text-gray-300 hover:text-white'
                      }`}
                  >
                    {item.label}
                  </button>
              ))}
              {/* Sliding indicator */}
              <div
                  className="absolute h-10 bg-blue-600 rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/50 -z-10"
                  style={{
                    width: indicatorStyle.width,
                    left: indicatorStyle.left,
                    top: '0px'
                  }}
              />
            </div>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                  onClick={handleViewModeToggle}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all hover:scale-105 shadow-lg"
              >
                <Monitor size={18} />
                <span className="hidden sm:inline">IDE View</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Warning Dialog */}
        {showMobileWarning && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
              <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700 shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {i18n.language === 'de' ? 'Achtung' : 'Warning'}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {i18n.language === 'de'
                      ? 'Die IDE-Ansicht ist nicht für mobile Geräte optimiert. Die Bedienung kann eingeschränkt sein. Möchtest du trotzdem fortfahren?'
                      : 'The IDE view is not optimized for mobile devices. Functionality may be limited. Do you want to continue anyway?'}
                </p>
                <div className="flex gap-3">
                  <button
                      onClick={() => {
                        setShowMobileWarning(false);
                        toggleViewMode();
                      }}
                      className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                  >
                    {i18n.language === 'de' ? 'Fortfahren' : 'Continue'}
                  </button>
                  <button
                      onClick={() => setShowMobileWarning(false)}
                      className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
                  >
                    {i18n.language === 'de' ? 'Abbrechen' : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"
                style={{ transform: `translate(${parallaxX}px, ${parallaxY}px)` }}
            />
            <div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"
                style={{ transform: `translate(${-parallaxX}px, ${-parallaxY}px)` }}
            />
            <Sparkles
                className="absolute top-20 right-20 text-blue-400/20 animate-pulse"
                size={48}
                style={{ transform: `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)` }}
            />
            <Sparkles
                className="absolute bottom-40 left-20 text-purple-400/20 animate-pulse"
                size={36}
                style={{ transform: `translate(${-parallaxX * 0.3}px, ${-parallaxY * 0.3}px)`, animationDelay: '1s' }}
            />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="mb-8 animate-fade-in">
              <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-transparent animate-gradient"
                  style={{ transform: `translate(${parallaxX * 0.1}px, ${parallaxY * 0.1}px)` }}>
                Yannik Köllmann
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light animate-slide-up">
                {i18n.language === 'de'
                    ? 'Full Stack Developer & Software Engineer'
                    : 'Full Stack Developer & Software Engineer'}
              </p>
              <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto animate-slide-up-delayed">
                {i18n.language === 'de'
                    ? 'Software Engineer | Informatik-Student @ FSU Jena'
                    : 'Software Engineer | Computer Science Student @ FSU Jena'}
              </p>
            </div>

            <div className="flex gap-4 justify-center flex-wrap mb-12 animate-fade-in-up">
              <button
                  onClick={() => scrollToSection('projects')}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-blue-500/50"
              >
                {i18n.language === 'de' ? 'Projekte ansehen' : 'View Projects'}
              </button>
              <button
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-all transform hover:scale-105 border border-slate-600 hover:border-blue-500 shadow-lg"
              >
                {i18n.language === 'de' ? 'Kontakt aufnehmen' : 'Get in Touch'}
              </button>
            </div>

            <button
                onClick={() => scrollToSection('about')}
                className="animate-bounce text-gray-400 hover:text-white transition-colors hover:scale-110 transform"
            >
              <ChevronDown size={32} />
            </button>
          </div>
        </section>

        {/* Wave Divider */}
        <div className="w-full relative" style={{ marginLeft: 0, marginRight: 0 }}>
          <svg className="w-full h-16 md:h-24" style={{ display: 'block' }} viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="rgba(30, 41, 59, 0.3)"/>
          </svg>
        </div>

        {/* About Section */}
        <section id="about" className="py-32 px-6 bg-slate-800/30 relative w-full">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              {i18n.language === 'de' ? 'Über mich' : 'About Me'}
            </h2>
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 backdrop-blur hover:border-blue-500/50 transition-all">
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                {i18n.language === 'de' ? (
                    <>
                      Ich bin ein leidenschaftlicher Softwareentwickler mit abgeschlossener Ausbildung zum <strong className="text-white">Software Engineer</strong> und aktuell studiere ich <strong className="text-white">Informatik an der Friedrich-Schiller-Universität Jena</strong>.
                    </>
                ) : (
                    <>
                      I'm a passionate software developer with a completed education as a <strong className="text-white">Software Engineer</strong> and currently studying <strong className="text-white">Computer Science at Friedrich Schiller University Jena</strong>.
                    </>
                )}
              </p>
              <p className="text-xl text-gray-300 leading-relaxed">
                {i18n.language === 'de'
                    ? 'Meine Expertise liegt in der Full-Stack-Entwicklung mit Schwerpunkt auf modernen Web-Technologien, Game Development mit Unity und der Entwicklung innovativer Tools für Entwickler.'
                    : 'My expertise lies in full-stack development with a focus on modern web technologies, game development with Unity, and creating innovative tools for developers.'}
              </p>
            </div>
          </div>
        </section>

        {/* Wave Divider */}
        <div className="w-full relative bg-slate-800/30" style={{ marginLeft: 0, marginRight: 0 }}>
          <svg className="w-full h-16 md:h-24" style={{ display: 'block' }} viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z" fill="rgba(15, 23, 42, 1)"/>
          </svg>
        </div>

        {/* Experience Section */}
        <section id="experience" className="py-32 px-6 relative w-full">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              {i18n.language === 'de' ? 'Erfahrung' : 'Experience'}
            </h2>
            <div className="space-y-6">
              {sortedExperiences.map((exp, index) => (
                  <div
                      key={exp._searchableId}
                      className="group bg-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/10 backdrop-blur"
                      style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {exp.logoUrl && (
                          <img
                              src={exp.logoUrl}
                              alt={exp.company}
                              className="w-16 h-16 rounded-lg object-cover"
                          />
                      )}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                          <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                            {exp.position}
                          </h3>
                          <span className="text-gray-400 text-sm">
                        {exp.startMonth} - {exp.endMonth}
                      </span>
                        </div>
                        <p className="text-xl text-blue-400 mb-2">{exp.company}</p>
                        {exp.location && (
                            <p className="text-gray-400 mb-4">{exp.location}</p>
                        )}
                        {exp.description && (
                            <p className="text-gray-300 mb-4">{exp.description}</p>
                        )}
                        {exp.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {exp.skills.map((skill) => (
                                  <span
                                      key={skill}
                                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
                                  >
                            {skill}
                          </span>
                              ))}
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wave Divider */}
        <div className="w-full relative" style={{ marginLeft: 0, marginRight: 0 }}>
          <svg className="w-full h-16 md:h-24" style={{ display: 'block' }} viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,32L80,37.3C160,43,320,53,480,58.7C640,64,800,64,960,58.7C1120,53,1280,43,1360,37.3L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="rgba(30, 41, 59, 0.3)"/>
          </svg>
        </div>

        {/* Projects Section */}
        <section id="projects" className="py-32 px-6 bg-slate-800/30 relative w-full">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              {i18n.language === 'de' ? 'Projekte' : 'Projects'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => {
                const colorClasses = [
                  {
                    card: 'bg-gradient-to-br from-purple-900/50 to-slate-800/50 border-purple-500/30 hover:border-purple-500 hover:shadow-purple-500/20',
                    title: 'group-hover:text-purple-400',
                    button: 'bg-purple-600 hover:bg-purple-700'
                  },
                  {
                    card: 'bg-gradient-to-br from-blue-900/50 to-slate-800/50 border-blue-500/30 hover:border-blue-500 hover:shadow-blue-500/20',
                    title: 'group-hover:text-blue-400',
                    button: 'bg-blue-600 hover:bg-blue-700'
                  },
                  {
                    card: 'bg-gradient-to-br from-green-900/50 to-slate-800/50 border-green-500/30 hover:border-green-500 hover:shadow-green-500/20',
                    title: 'group-hover:text-green-400',
                    button: 'bg-green-600 hover:bg-green-700'
                  }
                ];
                const colors = colorClasses[index % colorClasses.length];

                return (
                    <div
                        key={project.slug}
                        className={`group rounded-2xl p-8 border transition-all hover:shadow-2xl backdrop-blur transform hover:scale-105 ${colors.card}`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="text-4xl mb-4">{project.icon}</div>
                      <h3 className={`text-3xl font-bold mb-3 text-white transition-colors ${colors.title}`}>
                        {project.name}
                      </h3>
                      <p className="text-gray-300 mb-6 text-base leading-relaxed">
                        {project.description}
                      </p>

                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-400 mb-3">
                          {i18n.language === 'de' ? 'Features:' : 'Features:'}
                        </h4>
                        <div className="space-y-2">
                          {project.features.slice(0, 3).map((feature) => (
                              <div key={feature._searchableId} className="flex items-start gap-2">
                                <span className="text-base flex-shrink-0">{feature.icon}</span>
                                <span className="text-gray-300 text-sm">{feature.title}</span>
                              </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 flex-wrap">
                        {project.url && (
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-semibold hover:scale-105 ${colors.button}`}
                            >
                              <ExternalLink size={16} />
                              {i18n.language === 'de' ? 'Live Demo' : 'Live Demo'}
                            </a>
                        )}
                        {project.debugUrl && (
                            <a
                                href={project.debugUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all text-sm font-semibold hover:scale-105"
                            >
                              <Github size={16} />
                              GitHub
                            </a>
                        )}
                      </div>
                    </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Wave Divider */}
        <div className="w-full relative bg-slate-800/30" style={{ marginLeft: 0, marginRight: 0 }}>
          <svg className="w-full h-16 md:h-24" style={{ display: 'block' }} viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,96L80,90.7C160,85,320,75,480,69.3C640,64,800,64,960,69.3C1120,75,1280,85,1360,90.7L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z" fill="rgba(15, 23, 42, 1)"/>
          </svg>
        </div>

        {/* Contact Section */}
        <section id="contact" className="py-32 px-6 relative w-full">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              {i18n.language === 'de' ? 'Lass uns reden' : "Let's Talk"}
            </h2>
            <p className="text-xl text-gray-300 mb-16">
              {i18n.language === 'de' ? 'Ich freue mich von dir zu hören' : "I'd love to hear from you"}
            </p>

            <div className="grid gap-6 max-w-2xl mx-auto">
              {contactPageMeta.contactMethods.map((method, index) => (
                  <a
                      key={method.id}
                      href={method.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/10 backdrop-blur transform hover:scale-105"
                      style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-6">
                      <div className="text-5xl group-hover:scale-110 transition-transform">{method.icon}</div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-400 mb-1">
                          {method.label}
                        </p>
                        <p className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {method.value}
                        </p>
                      </div>
                      <ExternalLink className="text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" size={24} />
                    </div>
                  </a>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-slate-700">
          <div className="max-w-7xl mx-auto text-center text-gray-400">
            <p>
              {i18n.language === 'de'
                  ? '© 2025 Yannik Köllmann. Gemacht mit ❤️ und viel ☕'
                  : '© 2025 Yannik Köllmann. Made with ❤️ and lots of ☕'}
            </p>
          </div>
        </footer>

        <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.3s both;
        }
        .animate-slide-up-delayed {
          animation: slide-up 0.8s ease-out 0.5s both;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.7s both;
        }
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 20s ease-in-out infinite 5s;
        }
      `}</style>
      </div>
  );
};