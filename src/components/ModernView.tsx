import React, { useState, useEffect, useRef } from 'react';
import { useViewMode } from '../contexts/ViewModeContext';
import { Monitor, ExternalLink, ChevronDown, Sparkles, Mail, Zap, MapPin } from 'lucide-react';
import { aboutPageData, type Experience } from '../pages/about/meta';
import { contactPageData } from '../pages/contact/meta';
import { useTranslation } from 'react-i18next';
import { cryptborneData } from '../pages/src/cryptborne/meta';
import { homepageData } from '../pages/src/homepage/meta';
import { satTrackData } from '../pages/src/SatTrack/meta';
import { cteXecutorData } from '../pages/src/cteXecutor/meta';
import { LanguageSwitcher } from './LanguageSwitcher';
import { GithubIcon } from './icons/GithubIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';

const iconMap = {
  'Mail': Mail,
  'Github': GithubIcon,
  'Linkedin': LinkedinIcon,
  'MapPin': MapPin,
};

// Hook für Intersection Observer Animationen
const useInView = (options = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isInView };
};

// Cinematic Divider Component
const CinematicDivider: React.FC = () => (
    <div className="cinematic-divider">
      <div className="divider-depth-layer depth-1" />
      <div className="divider-depth-layer depth-2" />
      <div className="divider-depth-layer depth-3" />
      <div className="divider-depth-layer depth-4" />
      <div className="divider-depth-layer depth-5" />
      <div className="cinematic-glow-top" />
      <div className="cinematic-glow-bottom" />
      <div className="cinematic-particles">
        {[...Array(15)].map((_, i) => (
            <div key={i} className="particle" style={{ left: `${(i * 7) + 5}%`, animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>
    </div>
);

export const ModernView: React.FC = () => {
  const { toggleViewMode } = useViewMode();
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const navRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState<{ width: string; left: string }>({ width: '0px', left: '0px' });

  // Build projects with translations
  const allProjectData = [cryptborneData, homepageData, satTrackData, cteXecutorData];
  const projects = allProjectData.map(projectData => {
    const translations = t(`projects:${projectData.slug}`, { returnObjects: true }) as any;
    return { ...projectData, ...translations };
  });

  // Get about page translations
  const aboutTranslations = t('pages.about', { returnObjects: true }) as any;
  const aboutPage = { ...aboutPageData, ...aboutTranslations };


  // Sort experiences by date (DESC)
  const sortedExperiences = [...aboutPageData.experiences].sort((a, b) => {
    const getYear = (exp: Experience) => {
      if (exp.endMonth.toLowerCase().includes('heute') || exp.endMonth.toLowerCase().includes('today')) {
        return 9999;
      }
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

  // Real-time scroll tracking
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;

      setScrollProgress(progress);
      setScrolled(scrollTop > 50);

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

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
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

  // Hooks für InView Animationen
  const aboutSection = useInView();
  const experienceSection = useInView();
  const projectsSection = useInView();
  const contactSection = useInView();

  return (
      <div
          ref={scrollContainerRef}
          className="fixed inset-0 w-full h-full overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
          style={{ scrollbarGutter: 'stable', overflowX: 'hidden' }}>

        {/* Animated Scroll Progress Bar */}
        <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-slate-800/50">
          <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-150 relative overflow-hidden"
              style={{ width: `${scrollProgress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Sticky Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg shadow-blue-500/10' : 'bg-transparent'
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
              <div
                  className="absolute h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/50 -z-10"
                  style={{
                    width: indicatorStyle.width,
                    left: indicatorStyle.left,
                    top: '0px'
                  }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-200/30 to-blue-400/0 animate-pulse-slow" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                  onClick={handleViewModeToggle}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all hover:scale-105 shadow-lg group"
              >
                <Monitor size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">IDE View</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Warning Dialog */}
        {showMobileWarning && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-slate-800 rounded-2xl p-8 max-w-md mx-4 border border-slate-700 shadow-2xl animate-scale-in">
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {i18n.language === 'de' ? 'Mobile Ansicht' : 'Mobile View'}
                </h3>
                <p className="text-gray-300 mb-6">
                  {i18n.language === 'de'
                      ? 'Die IDE-Ansicht ist für Desktop optimiert. Bitte verwende einen Desktop-Browser für die beste Erfahrung.'
                      : 'The IDE view is optimized for desktop. Please use a desktop browser for the best experience.'}
                </p>
                <button
                    onClick={() => setShowMobileWarning(false)}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold"
                >
                  {i18n.language === 'de' ? 'Verstanden' : 'Got it'}
                </button>
              </div>
            </div>
        )}

        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-float-slow" />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="mb-8 animate-fade-in">
              <Sparkles className="inline-block text-yellow-400 w-12 h-12 mb-4 animate-spin-slow" />
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-slide-up">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Yannik Köllmann
              </span>
            </h1>
            <p className="text-2xl md:text-4xl text-gray-300 mb-8 animate-slide-up-delayed">
              {i18n.language === 'de' ? 'Full-Stack Entwickler & Informatik-Student' : 'Full-Stack Developer & Computer Science Student'}
            </p>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 animate-fade-in-up">
              {aboutPage.description}
            </p>
            <button
                onClick={() => scrollToSection('projects')}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full transition-all hover:scale-105 shadow-lg hover:shadow-blue-500/50 animate-fade-in-up"
            >
              <span className="font-semibold">
                {i18n.language === 'de' ? 'Meine Projekte' : 'View My Work'}
              </span>
              <ChevronDown className="group-hover:translate-y-1 transition-transform animate-bounce-subtle" size={20} />
            </button>
          </div>
        </section>

        {/* Cinematic 3D Divider */}
        <CinematicDivider />

        {/* About Section */}
        <section
            id="about"
            ref={aboutSection.ref}
            className={`py-32 px-6 relative transition-all duration-1000 ${
                aboutSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Zap className={`text-blue-500 transition-all duration-700 ${
                  aboutSection.isInView ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-180'
              }`} size={40} />
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                {i18n.language === 'de' ? 'Über mich' : 'About Me'}
              </h2>
            </div>
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p className={`transition-all duration-700 ${
                  aboutSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
              }`}>
                {i18n.language === 'de'
                    ? 'Ich bin ein leidenschaftlicher Softwareentwickler mit Fokus auf moderne Webtechnologien und Backend-Systeme.'
                    : 'I am a passionate software developer focused on modern web technologies and backend systems.'}
              </p>
              <p className={`transition-all duration-700 ${
                  aboutSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
              }`}
                 style={{ transitionDelay: '150ms' }}>
                {i18n.language === 'de'
                    ? 'Nach meiner Ausbildung zum Fachinformatiker für Anwendungsentwicklung studiere ich nun Informatik an der Friedrich-Schiller-Universität Jena.'
                    : 'After completing my training as an IT specialist for application development, I am now studying computer science at Friedrich Schiller University Jena.'}
              </p>
              <p className={`transition-all duration-700 ${
                  aboutSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
              }`}
                 style={{ transitionDelay: '300ms' }}>
                {i18n.language === 'de'
                    ? 'Meine Expertise liegt in der Entwicklung skalierbarer Backend-Architekturen mit C# und ASP.NET Core sowie in modernen Frontend-Technologien.'
                    : 'My expertise lies in developing scalable backend architectures with C# and ASP.NET Core as well as modern frontend technologies.'}
              </p>
            </div>
          </div>
        </section>

        {/* Cinematic 3D Divider */}
        <CinematicDivider />

        {/* Experience Section */}
        <section
            id="experience"
            ref={experienceSection.ref}
            className={`py-32 px-6 relative transition-all duration-1000 ${
                experienceSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              {i18n.language === 'de' ? 'Erfahrung' : 'Experience'}
            </h2>

            <div className="space-y-8">
              {sortedExperiences.map((exp, index) => (
                  <div
                      key={exp.position}
                      className={`group relative bg-gradient-to-br from-slate-800/40 to-slate-800/20 rounded-2xl p-8 border border-slate-700 hover:border-blue-500 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur overflow-hidden ${
                          experienceSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:w-2" />

                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                            {exp.position}
                          </h3>
                          <p className="text-xl text-gray-300 mt-2 group-hover:text-gray-200 transition-colors">{exp.company}</p>
                        </div>
                        <span className="text-blue-400 font-semibold whitespace-nowrap bg-blue-500/10 px-4 py-2 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                          {exp.startMonth} - {exp.endMonth}
                        </span>
                      </div>
                      {exp.description && (
                          <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{exp.description}</p>
                      )}
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cinematic 3D Divider */}
        <CinematicDivider />

        {/* Projects Section */}
        <section
            id="projects"
            ref={projectsSection.ref}
            className={`py-32 px-6 relative transition-all duration-1000 ${
                projectsSection.isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              {i18n.language === 'de' ? 'Projekte' : 'Projects'}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => {
                const colors = {
                  card: 'bg-slate-800/30 border-slate-700 hover:border-blue-500',
                  title: 'group-hover:text-blue-400',
                  button: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
                };

                return (
                    <div
                        key={project.slug}
                        className={`group rounded-2xl p-8 border transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur transform hover:scale-105 hover:-translate-y-3 ${colors.card} ${
                            projectsSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        } relative overflow-hidden`}
                        style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      <div className="relative z-10">
                        <div className="text-4xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">{project.icon}</div>
                        <h3 className={`text-3xl font-bold mb-3 text-white transition-colors duration-300 ${colors.title}`}>
                          {project.name}
                        </h3>
                        <p className="text-gray-300 mb-6 text-base leading-relaxed group-hover:text-gray-200 transition-colors">
                          {project.description}
                        </p>

                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-400 mb-3">
                            {i18n.language === 'de' ? 'Features:' : 'Features:'}
                          </h4>
                          <div className="space-y-2">
                            {Object.values(project.features).slice(0, 3).map((feature: any, featureIndex) => (
                                <div
                                    key={feature._searchableId}
                                    className={`flex items-start gap-2 transition-all duration-500 ${
                                        projectsSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                                    }`}
                                    style={{ transitionDelay: `${(index * 150) + (featureIndex * 100)}ms` }}
                                >
                                  <span className="text-base flex-shrink-0 group-hover:scale-125 transition-transform">{feature.icon}</span>
                                  <span className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors">{feature.title}</span>
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
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-semibold hover:scale-110 ${colors.button}`}
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
                                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all text-sm font-semibold hover:scale-110"
                              >
                                <GithubIcon size={16} />
                                GitHub
                              </a>
                          )}
                        </div>
                      </div>
                    </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Cinematic 3D Divider */}
        <CinematicDivider />

        {/* Contact Section */}
        <section
            id="contact"
            ref={contactSection.ref}
            className={`py-32 px-6 relative w-full transition-all duration-1000 ${
                contactSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              {i18n.language === 'de' ? 'Lass uns reden' : "Let's Talk"}
            </h2>
            <p className="text-xl text-gray-300 mb-16">
              {i18n.language === 'de' ? 'Ich freue mich von dir zu hören' : "I'd love to hear from you"}
            </p>

            <div className="grid gap-6 max-w-2xl mx-auto">
              {contactPageData.contactMethods.map((method, index) => {
                const IconComponent = iconMap[method.icon as keyof typeof iconMap];
                return (
                    <a
                        key={method.id}
                        href={method.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-2xl p-8 border border-slate-700 hover:border-blue-500 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur transform hover:scale-105 relative overflow-hidden ${
                            contactSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                        }`}
                        style={{
                          transitionDelay: `${index * 100}ms`,
                          transitionDuration: '700ms'
                        }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="flex items-center gap-6 relative z-10">
                        <div className="text-blue-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                          <IconComponent size={48} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-gray-400 mb-1">
                            {method.label}
                          </p>
                          <p className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                            {method.value}
                          </p>
                        </div>
                        <ExternalLink className="text-gray-400 group-hover:text-blue-400 group-hover:translate-x-2 transition-all duration-300" size={24} />
                      </div>
                    </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-slate-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-50" />
          <div className="max-w-7xl mx-auto text-center text-gray-400 relative z-10 space-y-3">
            <p>
              {i18n.language === 'de'
                  ? '© 2025 Yannik Köllmann. Gemacht mit ❤️ und viel ☕'
                  : '© 2025 Yannik Köllmann. Made with ❤️ and lots of ☕'}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <a
                  href="/impressum"
                  className="text-gray-400 hover:text-blue-400 transition-colors hover:underline"
              >
                {i18n.language === 'de' ? 'Impressum' : 'Legal Notice'}
              </a>
            </div>
          </div>
        </footer>

        <style>{`
        /* Optimized animations */
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.3s both;
        }
        .animate-slide-up-delayed {
          animation: slide-up 0.8s ease-out 0.5s both;
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.7s both;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(30px, -30px); }
          66% { transform: translate(-20px, 20px); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 20s ease-in-out infinite 10s;
        }
        .animate-float-slow {
          animation: float 30s ease-in-out infinite 5s;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7%; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        /* CINEMATIC 3D PARALLAX DIVIDER */
        .cinematic-divider {
          position: relative;
          height: 250px;
          overflow: hidden;
          perspective: 1500px;
          transform-style: preserve-3d;
        }

        .divider-depth-layer {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg,
            rgba(59, 130, 246, 0.15) 0%,
            rgba(168, 85, 247, 0.25) 35%,
            rgba(236, 72, 153, 0.2) 65%,
            rgba(59, 130, 246, 0.15) 100%
          );
          transform-style: preserve-3d;
        }

        /* Layer 1 - Closest, most dramatic */
        @keyframes depth-wave-1 {
          0%, 100% {
            transform: translateZ(150px) translateX(0%) rotateX(15deg) scaleY(1.2);
            clip-path: polygon(
              0% 45%, 10% 35%, 20% 50%, 30% 30%, 40% 45%, 50% 25%,
              60% 40%, 70% 30%, 80% 45%, 90% 35%, 100% 40%,
              100% 100%, 0% 100%
            );
          }
          50% {
            transform: translateZ(200px) translateX(-8%) rotateX(20deg) scaleY(1.4);
            clip-path: polygon(
              0% 35%, 10% 50%, 20% 30%, 30% 45%, 40% 25%, 50% 40%,
              60% 30%, 70% 45%, 80% 35%, 90% 50%, 100% 30%,
              100% 100%, 0% 100%
            );
          }
        }

        .depth-1 {
          animation: depth-wave-1 10s ease-in-out infinite;
          opacity: 0.8;
          filter: blur(1px) brightness(1.3);
          z-index: 5;
        }

        /* Layer 2 */
        @keyframes depth-wave-2 {
          0%, 100% {
            transform: translateZ(100px) translateX(0%) rotateX(12deg) scaleY(1.15);
            clip-path: polygon(
              0% 50%, 12% 40%, 25% 55%, 37% 35%, 50% 50%, 62% 40%,
              75% 55%, 87% 40%, 100% 50%,
              100% 100%, 0% 100%
            );
          }
          50% {
            transform: translateZ(140px) translateX(6%) rotateX(18deg) scaleY(1.3);
            clip-path: polygon(
              0% 40%, 12% 55%, 25% 35%, 37% 50%, 50% 40%, 62% 55%,
              75% 35%, 87% 55%, 100% 40%,
              100% 100%, 0% 100%
            );
          }
        }

        .depth-2 {
          animation: depth-wave-2 12s ease-in-out infinite 0.5s;
          opacity: 0.6;
          filter: blur(2px) brightness(1.2);
          z-index: 4;
        }

        /* Layer 3 */
        @keyframes depth-wave-3 {
          0%, 100% {
            transform: translateZ(60px) translateX(0%) rotateX(10deg) scaleY(1.1);
            clip-path: polygon(
              0% 55%, 15% 45%, 30% 58%, 45% 42%, 60% 55%, 75% 45%, 90% 58%, 100% 48%,
              100% 100%, 0% 100%
            );
          }
          50% {
            transform: translateZ(90px) translateX(-5%) rotateX(15deg) scaleY(1.25);
            clip-path: polygon(
              0% 45%, 15% 58%, 30% 42%, 45% 55%, 60% 45%, 75% 58%, 90% 42%, 100% 55%,
              100% 100%, 0% 100%
            );
          }
        }

        .depth-3 {
          animation: depth-wave-3 14s ease-in-out infinite 1s;
          opacity: 0.45;
          filter: blur(4px) brightness(1.1);
          z-index: 3;
        }

        /* Layer 4 */
        @keyframes depth-wave-4 {
          0%, 100% {
            transform: translateZ(30px) translateX(0%) rotateX(8deg) scaleY(1.05);
            clip-path: polygon(
              0% 58%, 20% 48%, 40% 60%, 60% 50%, 80% 58%, 100% 52%,
              100% 100%, 0% 100%
            );
          }
          50% {
            transform: translateZ(50px) translateX(4%) rotateX(12deg) scaleY(1.15);
            clip-path: polygon(
              0% 48%, 20% 60%, 40% 50%, 60% 58%, 80% 48%, 100% 60%,
              100% 100%, 0% 100%
            );
          }
        }

        .depth-4 {
          animation: depth-wave-4 16s ease-in-out infinite 1.5s;
          opacity: 0.3;
          filter: blur(6px) brightness(1.05);
          z-index: 2;
        }

        /* Layer 5 - Farthest */
        @keyframes depth-wave-5 {
          0%, 100% {
            transform: translateZ(10px) translateX(0%) rotateX(5deg);
            clip-path: polygon(
              0% 60%, 25% 52%, 50% 62%, 75% 54%, 100% 58%,
              100% 100%, 0% 100%
            );
          }
          50% {
            transform: translateZ(20px) translateX(-3%) rotateX(8deg);
            clip-path: polygon(
              0% 52%, 25% 62%, 50% 54%, 75% 60%, 100% 52%,
              100% 100%, 0% 100%
            );
          }
        }

        .depth-5 {
          animation: depth-wave-5 18s ease-in-out infinite 2s;
          opacity: 0.2;
          filter: blur(10px);
          z-index: 1;
        }

        /* Cinematic Glows */
        @keyframes cinematic-glow-top {
          0%, 100% {
            opacity: 0.4;
            transform: translateY(0%) scaleX(1);
          }
          50% {
            opacity: 0.7;
            transform: translateY(-10%) scaleX(1.3);
          }
        }

        .cinematic-glow-top {
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 120px;
          background: radial-gradient(ellipse at center,
            rgba(59, 130, 246, 0.5) 0%,
            rgba(168, 85, 247, 0.4) 30%,
            rgba(236, 72, 153, 0.3) 60%,
            transparent 85%
          );
          filter: blur(40px);
          animation: cinematic-glow-top 6s ease-in-out infinite;
          z-index: 6;
          pointer-events: none;
        }

        @keyframes cinematic-glow-bottom {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0%) scaleX(1);
          }
          50% {
            opacity: 0.6;
            transform: translateY(10%) scaleX(1.4);
          }
        }

        .cinematic-glow-bottom {
          position: absolute;
          bottom: 15%;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          height: 100px;
          background: radial-gradient(ellipse at center,
            rgba(236, 72, 153, 0.4) 0%,
            rgba(168, 85, 247, 0.3) 40%,
            transparent 75%
          );
          filter: blur(50px);
          animation: cinematic-glow-bottom 7s ease-in-out infinite 1s;
          z-index: 6;
          pointer-events: none;
        }

        /* Floating Particles */
        .cinematic-particles {
          position: absolute;
          inset: 0;
          z-index: 7;
          pointer-events: none;
        }

        @keyframes particle-float {
          0% {
            transform: translateY(120%) translateX(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-20%) translateX(var(--drift, 20px)) scale(1);
            opacity: 0;
          }
        }

        .particle {
          position: absolute;
          bottom: 0;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(168, 85, 247, 1) 0%, transparent 70%);
          border-radius: 50%;
          animation: particle-float 8s ease-in infinite;
          --drift: calc((var(--index, 1) - 7) * 15px);
        }

        .particle:nth-child(3n) {
          background: radial-gradient(circle, rgba(59, 130, 246, 1) 0%, transparent 70%);
          animation-duration: 9s;
        }

        .particle:nth-child(3n+1) {
          background: radial-gradient(circle, rgba(236, 72, 153, 1) 0%, transparent 70%);
          animation-duration: 10s;
        }

        /* Performance optimization */
        * {
          will-change: auto;
        }
        .group:hover * {
          will-change: transform;
        }
      `}</style>
      </div>
  );
};
