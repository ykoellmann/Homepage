import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
    onComplete?: () => void;
    duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
                                                       onComplete,
                                                       duration = 4500
                                                   }) => {
    // Lustige Loading-Nachrichten
    const loadingMessages = [
        "Initialisiere Entwicklungsumgebung...",
        "Kompiliere Kaffee zu Code...",
        "Lade Bugs... nur Spaß, die waren schon da...",
        "Optimiere Procrastination-Engine...",
        "Installiere Motivation.exe...",
        "Debugge das Universum...",
        "Refaktoriere Realität...",
        "Pushe Code in die Cloud... irgendwo da oben...",
        "Merge Conflicts mit dem Leben...",
        "Lade Inspiration aus Stack Overflow...",
        "Kompiliere Kreativität...",
        "Initialisiere Genie-Modus...",
        "Behebe Fehler vom letzten Mal...",
        "Lade neueste Dad-Jokes für Code-Reviews...",
        "Synchronisiere mit The Matrix...",
        "Bereite Rubber Duck vor...",
        "Aktiviere God-Mode... Zugriff verweigert...",
        "Lade Pixel... warte, falsche Industrie...",
        "Initialisiere Ctrl+Z für gestern...",
        "Starte Imposter-Syndrom-Blocker...",
        "Recompile Montags-Motivation...",
        "Deploye Sarkasmus-Update v2.0...",
        "Parche Zeitkontinuum... 3 Stunden verbleibend...",
        "Rollback zum letzten funktionierenden Gehirn...",
        "Validiere Kaffee-zu-Code-Verhältnis...",
        "Hotfix: Entferne Produktivität-Bug...",
        "Branch: existential-crisis wird erstellt...",
        "Teste ob Montag wirklich nötig ist... Ja. Leider...",
        "Migrationsskript: Wochenende → Alltag...",
        "Lade Semi-Colon, der woanders fehlte...",
        "Initialisiere Try-Catch für Social Situations...",
        "404: Motivation Not Found. Retry? [Y/n]...",
        "Garbage Collection für gestern's Entscheidungen...",
        "Warte auf Senior Developer... noch 5 Jahre...",
        "npm install self-confidence@latest...",
        "Kompiliere Ausreden für Sprint Review...",
        "Cache für Username vergessen wird geleert...",
        "API-Call an Kaffeemaschine... Timeout...",
        "Legacy Code aus 2015 wird interpretiert...",
        "Refaktoriere Lebensentscheidungen...",
        "Starte Meeting-Simulator 2025...",
        "Lade 'Habe ich verstanden'-Modus...",
        "Synchronisiere Tab-Chaos... 47 von 156...",
        "Initialize: Weekend.exe - Access Denied (Montag)...",
        "Compile Regex für Lebensplanung... Syntax Error...",
        "Docker-Image 'funktionierender-developer' wird gebaut...",
        "Cherry-Pick die guten Erinnerungen...",
        "Rebase Reality auf develop-Branch...",
        "Lösche node_modules... oh warte, falsches Fenster..."
    ];

    // Prüfen ob Splash heute schon gezeigt wurde - BEVOR State initialisiert wird
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('splashLastShown');
    const shouldShow = lastShown !== today;

    const [isVisible, setIsVisible] = useState(shouldShow);
    const [progress, setProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState(
        loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
    );

    useEffect(() => {
        // Wenn nicht angezeigt werden soll, sofort beenden
        if (!shouldShow) {
            onComplete?.();
            return;
        }

        // Wechsle die Nachricht alle 800ms
        const messageInterval = setInterval(() => {
            setCurrentMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
        }, 1500);

        // Progress-Animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, duration / 50);

        // Splash ausblenden nach duration
        const timer = setTimeout(() => {
            setIsVisible(false);
            localStorage.setItem('splashLastShown', today);
            onComplete?.();
        }, duration);

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
            clearInterval(messageInterval);
        };
    }, [duration, onComplete, shouldShow]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a] animate-in fade-in duration-300">
            <div className="relative w-[90%] max-w-[800px] h-[65vh] max-h-[550px] rounded-xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-800 via-red-700 to-orange-600" />

                {/* Wave Pattern Overlay */}
                <div className="absolute inset-0 opacity-40">
                    <div
                        className="absolute inset-0 w-[200%] h-full"
                        style={{
                            background: 'repeating-linear-gradient(135deg, transparent, transparent 80px, rgba(255, 255, 255, 0.08) 80px, rgba(255, 255, 255, 0.08) 160px)',
                            transform: 'skewY(-3deg)'
                        }}
                    />
                </div>

                {/* Subtle Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(255, 255, 255, 0.03) 100px, rgba(255, 255, 255, 0.03) 200px)'
                    }}
                />

                {/* Content Container */}
                <div className="relative h-full flex flex-col justify-between p-8 sm:p-10 md:p-12">
                    {/* Logo Section */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/15 backdrop-blur-md rounded-lg border border-white/20 flex items-center justify-center">
                            <span className="text-2xl sm:text-3xl font-bold text-white">YK</span>
                        </div>
                        <div>
                            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-light tracking-tight">
                                Yannik Köllmann
                            </h1>
                            <p className="text-white/80 text-sm sm:text-base font-light tracking-wide mt-1">
                                IDE
                            </p>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="space-y-6">
                        {/* Loading Text */}
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-white/90 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 bg-white/90 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 bg-white/90 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-white/70 text-sm font-light transition-opacity duration-300">
                {currentMessage}
              </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                                <div
                                    className="h-full bg-white/90 rounded-full transition-all duration-200 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            {/* Version Info */}
                            <div className="flex justify-between items-center text-xs text-white/60">
                                <span>2025.1</span>
                                <span>{progress}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;