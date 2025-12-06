import React, { useState, useEffect, useRef } from 'react';
import { useViewMode } from '../contexts/ViewModeContext';
import { ExternalLink, Mail, MapPin, ChevronDown } from 'lucide-react';
import { aboutPageData, type Experience } from '../pages/about/meta';
import { contactPageData } from '../pages/contact/meta';
import { awardsData } from '../pages/awards/meta';
import { useTranslation } from 'react-i18next';
import { cryptborneData } from '../pages/src/cryptborne/meta';
import { homepageData } from '../pages/src/homepage/meta';
import { satTrackData } from '../pages/src/SatTrack/meta';
import { cteXecutorData } from '../pages/src/cteXecutor/meta';
import { GithubIcon } from './icons/GithubIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { ModernViewNavigation } from './ModernViewNavigation';
import { ScrollProgressBar } from './ScrollProgressBar';
import { MobileWarningDialog } from './MobileWarningDialog';
import { CinematicDivider } from './CinematicDivider';
import { GlassButton } from './ui/Button/GlassButton';
import { GlassCard } from './ui/Card/GlassCard';
import './ModernView.css';

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

      const sections = ['home', 'about', 'experience', 'awards', 'projects', 'contact'];
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
    { id: 'awards', label: i18n.language === 'de' ? 'Auszeichnungen' : 'Awards' },
    { id: 'projects', label: i18n.language === 'de' ? 'Projekte' : 'Projects' },
    { id: 'contact', label: i18n.language === 'de' ? 'Kontakt' : 'Contact' },
  ];

  // Hooks für InView Animationen
  const aboutSection = useInView();
  const experienceSection = useInView();
  const awardsSection = useInView();
  const projectsSection = useInView();
  const contactSection = useInView();

  return (
    <div
      ref={scrollContainerRef}
      className="fixed inset-0 w-full h-full overflow-y-auto text-primary"
      style={{
        scrollbarGutter: 'stable',
        overflowX: 'hidden',
        background: 'var(--gradient-bg-main)'
      }}>

      {/* Animated Scroll Progress Bar */}
      <ScrollProgressBar progress={scrollProgress} />

      {/* Sticky Navigation */}
      <ModernViewNavigation
        scrolled={scrolled}
        activeSection={activeSection}
        navItems={navItems}
        indicatorStyle={indicatorStyle}
        navRefs={navRefs}
        onNavigate={scrollToSection}
        onViewModeToggle={handleViewModeToggle}
      />

      {/* Mobile Warning Dialog */}
      <MobileWarningDialog
        show={showMobileWarning}
        onClose={() => setShowMobileWarning(false)}
        language={i18n.language}
      />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative px-6" style={{ position: 'relative', zIndex: 1 }}>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-slide-up drop-shadow-2xl">
            <span style={{
              background: 'var(--gradient-hero)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }} className="animate-gradient">
              Yannik Köllmann
            </span>
          </h1>
          <p className="text-2xl md:text-4xl mb-8 animate-slide-up-delayed font-bold" style={{ color: 'var(--text-secondary)' }}>
            {i18n.language === 'de' ? 'Full-Stack Entwickler & Informatik-Student' : 'Full-Stack Developer & Computer Science Student'}
          </p>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 animate-fade-in-up font-medium" style={{ color: 'var(--text-muted)' }}>
            {aboutPage.description}
          </p>
          <GlassButton
            onClick={() => scrollToSection('projects')}
            variant="primary"
            size="lg"
            glassIntensity="intense"
            enableBloom={true}
            className="group inline-flex items-center gap-2 rounded-full animate-fade-in-up font-bold"
            style={{
              color: 'var(--text-on-glass)',
              border: '2px solid var(--glass-border-hover)',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
            }}
          >
            <span>{i18n.language === 'de' ? 'Meine Projekte' : 'View My Work'}</span>
            <ChevronDown className="group-hover:translate-y-1 transition-transform animate-bounce-subtle" size={20} />
          </GlassButton>
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
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-5xl font-bold" style={{
              color: 'var(--text-primary)'
            }}>
              {i18n.language === 'de' ? 'Über mich' : 'About Me'}
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed">
            <p className={`transition-all duration-700 rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] ${
              aboutSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
            }`} style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(10px) saturate(110%)',
              WebkitBackdropFilter: 'blur(10px) saturate(110%)',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 4px 24px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
              color: 'var(--text-on-glass)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
            }}>
              {i18n.language === 'de'
                ? 'Ich bin ein leidenschaftlicher Softwareentwickler mit Fokus auf moderne Webtechnologien und Backend-Systeme.'
                : 'I am a passionate software developer focused on modern web technologies and backend systems.'}
            </p>
            <p className={`transition-all duration-700 rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] ${
              aboutSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
            }`}
              style={{
                transitionDelay: '150ms',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(10px) saturate(110%)',
                WebkitBackdropFilter: 'blur(10px) saturate(110%)',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 4px 24px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                color: 'var(--text-on-glass)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
              }}>
              {i18n.language === 'de'
                ? 'Nach meiner Ausbildung zum Fachinformatiker für Anwendungsentwicklung studiere ich nun Informatik an der Friedrich-Schiller-Universität Jena.'
                : 'After completing my training as an IT specialist for application development, I am now studying computer science at Friedrich Schiller University Jena.'}
            </p>
            <p className={`transition-all duration-700 rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] ${
              aboutSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
            }`}
              style={{
                transitionDelay: '300ms',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(10px) saturate(110%)',
                WebkitBackdropFilter: 'blur(10px) saturate(110%)',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 4px 24px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                color: 'var(--text-on-glass)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
              }}>
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
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl font-bold mb-16 text-center" style={{
            color: 'var(--text-primary)'
          }}>
            {i18n.language === 'de' ? 'Erfahrung' : 'Experience'}
          </h2>

          <div className="space-y-6">
            {sortedExperiences.map((exp, index) => (
              <GlassCard
                key={exp.position}
                glassType="frosted"
                elevation={2}
                className={`group transition-all duration-700 transform hover:scale-[1.02] overflow-hidden ${
                  experienceSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  padding: '2rem'
                } as React.CSSProperties}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3
                        className="text-2xl font-bold transition-colors duration-300"
                        style={{
                          color: 'var(--text-primary)'
                        }}
                      >
                        {exp.position}
                      </h3>
                      <p className="text-xl mt-2 transition-colors" style={{ color: 'var(--text-secondary)' }}>{exp.company}</p>
                    </div>
                    <span
                      className="font-semibold whitespace-nowrap px-4 py-2 rounded-lg transition-all"
                      style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: 'var(--text-secondary)',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                      }}
                    >
                      {exp.startMonth} - {exp.endMonth}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="leading-relaxed transition-colors" style={{ color: 'var(--text-muted)' }}>{exp.description}</p>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic 3D Divider */}
      <CinematicDivider />

      {/* Awards Section */}
      <section
        id="awards"
        ref={awardsSection.ref}
        className={`py-32 px-6 relative transition-all duration-1000 ${
          awardsSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-16 text-center" style={{
            color: 'var(--text-primary)'
          }}>
            {i18n.language === 'de' ? 'Auszeichnungen' : 'Awards'}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {awardsData.map((award, index) => (
              <GlassCard
                key={`${award.organization}-${award.date}`}
                glassType="frosted"
                elevation={2}
                className={`group transition-all duration-700 transform hover:scale-[1.03] ${
                  awardsSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  padding: '1.5rem'
                } as React.CSSProperties}
              >
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {award.title}
                  </h3>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    {award.organization}
                  </p>
                  <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                    {award.date}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {award.description}
                  </p>
                </div>
              </GlassCard>
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
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-16 text-center" style={{
            color: 'var(--text-primary)'
          }}>
            {i18n.language === 'de' ? 'Projekte' : 'Projects'}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const colors = {
                card: 'bg-slate-800/50 border-2 border-slate-700 hover:border-blue-500',
                title: 'group-hover:text-blue-400',
                button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70'
              };

              return (
                <GlassCard
                  key={project.slug}
                  glassType="frosted"
                  elevation={3}
                  className={`group transition-all duration-700 transform hover:scale-[1.08] hover:-translate-y-3 ${
                    projectsSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` } as React.CSSProperties}
                >
                  <div className="relative z-10">
                    <h3 className={`text-3xl font-bold mb-3 text-white transition-colors duration-300 ${colors.title}`}>
                      {project.name}
                    </h3>
                    <p className="text-slate-300 mb-6 text-base leading-relaxed group-hover:text-slate-200 transition-colors">
                      {project.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-400 mb-3">
                        {i18n.language === 'de' ? 'Features:' : 'Features:'}
                      </h4>
                      <div className="space-y-2">
                        {Object.values(project.features).slice(0, 3).map((feature: any, featureIndex) => (
                          <div
                            key={feature._searchableId || `${project.slug}-feature-${featureIndex}`}
                            className={`flex items-start gap-2 transition-all duration-500 ${
                              projectsSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                            }`}
                            style={{ transitionDelay: `${(index * 150) + (featureIndex * 100)}ms` }}
                          >
                            <span className="text-base flex-shrink-0 group-hover:scale-110 transition-transform">{feature.icon}</span>
                            <span className="text-slate-300 text-sm group-hover:text-slate-200 transition-colors">{feature.title}</span>
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
                          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all text-sm font-semibold hover:scale-105"
                        >
                          <GithubIcon size={16} />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </GlassCard>
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
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8" style={{
            background: 'var(--gradient-hero)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {i18n.language === 'de' ? 'Lass uns reden' : "Let's Talk"}
          </h2>
          <p className="text-xl mb-16" style={{ color: 'var(--text-muted)' }}>
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
                  style={{ textDecoration: 'none' }}
                >
                  <GlassCard
                    glassType="frosted"
                    elevation={2}
                    className={`group transition-all duration-700 transform hover:scale-[1.03] ${
                      contactSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                    }`}
                    style={{
                      transitionDelay: `${index * 100}ms`,
                      padding: '2rem',
                      cursor: 'pointer'
                    } as React.CSSProperties}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex items-center gap-6 relative z-10">
                      <div
                        className="group-hover:scale-110 transition-all duration-500"
                        style={{
                          color: 'var(--text-primary)',
                          filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))'
                        }}
                      >
                        <IconComponent size={48} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                          {method.label}
                        </p>
                        <p className="text-xl font-semibold transition-colors duration-300" style={{ color: 'var(--text-primary)' }}>
                          {method.value}
                        </p>
                      </div>
                      <ExternalLink
                        className="group-hover:translate-x-2 transition-all duration-300"
                        style={{ color: 'var(--text-secondary)' }}
                        size={24}
                      />
                    </div>
                  </GlassCard>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto text-center text-slate-400 relative z-10 space-y-3">
          <p>
            {i18n.language === 'de'
              ? '© 2025 Yannik Köllmann. Gemacht mit ❤️ und viel ☕'
              : '© 2025 Yannik Köllmann. Made with ❤️ and lots of ☕'}
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <a
              href="/imprint"
              className="text-slate-400 hover:text-blue-400 transition-colors hover:underline"
            >
              {i18n.language === 'de' ? 'Impressum' : 'Legal Notice'}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
