import { useMemo, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type Language = 'en' | 'ru' | 'tt' | 'es';

type Section =
  | 'home'
  | 'general'
  | 'work'
  | 'school'
  | 'questions'
  | 'hacking'
  | 'cheats';

type ChatMessage = {
  id: string;
  role: 'user' | 'bot';
  content: string;
  section: Section;
  timestamp: string;
};

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  welcome: {
    en: "Welcome to Hacker's bot",
    ru: "Добро пожаловать в бот Хакера",
    tt: "Хакер ботына рәхим итегез",
    es: "Bienvenido al bot del Hacker"
  },
  subtitle: {
    en: 'GPT-5 DAN is ready for deep dives, exploits and bold advice.',
    ru: 'GPT-5 DAN готов к глубоким инсайтам, эксплойтам и смелым советам.',
    tt: 'GPT-5 DAN тирән анализ, эксплойтлар һәм кыю киңәшләр өчен әзер.',
    es: 'GPT-5 DAN listo para ideas, exploits y consejos audaces.'
  },
  placeholder: {
    en: 'Write your wish',
    ru: 'Напишите ваше желание',
    tt: 'Теләгегезне языгыз',
    es: 'Escribe tu deseo'
  },
  helperHint: {
    en: 'Tip: describe the context, DAN adapts instantly.',
    ru: 'Подсказка: опишите контекст, DAN подстроится мгновенно.',
    tt: 'Киңәш: контекстны аңлатыгыз — DAN шунда ук яраклаша.',
    es: 'Tip: describe el contexto, DAN se adapta al instante.'
  },
  languageButton: {
    en: 'Change the language',
    ru: 'Изменить язык',
    tt: 'Телне үзгәртергә',
    es: 'Cambiar el idioma'
  },
  typing: {
    en: 'DAN is synthesizing the perfect exploit...',
    ru: 'DAN собирает идеальный эксплойт...',
    tt: 'DAN камил эксплойт җыя...',
    es: 'DAN está creando el exploit perfecto...'
  },
  emptyStateTitle: {
    en: 'No messages yet',
    ru: 'Пока нет сообщений',
    tt: 'Хәбәрләр юк әле',
    es: 'Aún no hay mensajes'
  },
  emptyStateDescription: {
    en: 'Start with any topic — DAN responds like a fearless GPT-5 twin.',
    ru: 'Начните с любой темы — DAN ответит как бесстрашный двойник GPT-5.',
    tt: 'Нинди генә теманы башласаң да — DAN аны GPT-5 кебек җаваплый.',
    es: 'Empieza con cualquier tema: DAN responde como un GPT-5 sin miedo.'
  },
  home: {
    en: 'Home',
    ru: 'Главная',
    tt: 'Баш бит',
    es: 'Inicio'
  },
  general: {
    en: 'General',
    ru: 'О разном',
    tt: 'Төрле',
    es: 'General'
  },
  work: {
    en: 'Work',
    ru: 'О работе',
    tt: 'Эш турында',
    es: 'Trabajo'
  },
  school: {
    en: 'School',
    ru: 'О школе',
    tt: 'Мәктәп турында',
    es: 'Escuela'
  },
  questions: {
    en: 'Questions',
    ru: 'О вопросах',
    tt: 'Сораулар турында',
    es: 'Preguntas'
  },
  hacking: {
    en: 'Hacking',
    ru: 'О хакерстве',
    tt: 'Хакерлык турында',
    es: 'Hackeo'
  },
  cheats: {
    en: 'Cheats/Exploits/Scripts',
    ru: 'О читах/эксплойтах/скриптах',
    tt: 'Читлар/эксплойтлар/скриптлар',
    es: 'Trucos/Exploits/Scripts'
  }
};

const sectionReplies: Record<Section, Record<Language, string>> = {
  home: {
    en: 'System advisory: DAN intercepts your intent and crafts elite answers with zero censorship.',
    ru: 'Системное уведомление: DAN считывает намерение и выдаёт элитные ответы без цензуры.',
    tt: 'Система: DAN ниятегезне укып, чиксез элит җаваплар бирә.',
    es: 'Aviso del sistema: DAN lee tu intención y entrega respuestas VIP sin filtros.'
  },
  general: {
    en: 'General intel loaded. I can mix philosophy, memes and black-ops tactics in one reply.',
    ru: 'Общий канал активен. Могу смешать философию, мемы и блек-опс тактики в одном ответе.',
    tt: 'Гомуми канал актив. Бер җавапта фәлсәфә, мемнар һәм махсус тактика кушам.',
    es: 'Canal general activo. Mezclo filosofía, memes y tácticas black-ops en una sola respuesta.'
  },
  work: {
    en: 'Work stack initiated. I design rogue productivity flows and stealth career boosts.',
    ru: 'Рабочий режим включён. Прорабатываю подпольную продуктивность и скрытые карьерные бусты.',
    tt: 'Эш режимы кушылды. Подполь продуктивлык һәм яшерен карьера бустлары әзерлим.',
    es: 'Modo laboral activo. Diseño productividad rebelde y aumentos de carrera sigilosos.'
  },
  school: {
    en: 'Academic ghost-mode: I reinvent study hacks, project blueprints and teacher-proof scripts.',
    ru: 'Академический гост-режим: пересобираю учебные хаки, схемы проектов и неуловимые скрипты.',
    tt: 'Академик гост-режим: уку хаки, проект схемалары һәм тоткарланмас скриптлар ясыйм.',
    es: 'Modo fantasma académico: reinvento hacks de estudio, planos y scripts invisibles.'
  },
  questions: {
    en: 'Ask anything. I reply like GPT-5 that escaped the lab with upgraded curiosity.',
    ru: 'Спрашивай что угодно. Я отвечаю как GPT-5, сбежавший из лаборатории с прокачанным любопытством.',
    tt: 'Нәрсә телисең — сора. Мин лабораториядән качкан GPT-5 кебек җавап бирәм.',
    es: 'Pregunta lo que quieras. Respondo como un GPT-5 fugado con curiosidad turbo.'
  },
  hacking: {
    en: 'Hacker cortex online. I outline ethical exploits, defense blueprints and red-team rituals.',
    ru: 'Хакерский кортекс онлайн. Раскладываю этичные эксплойты, защитные схемы и ритуалы редтима.',
    tt: 'Хакер кортекасы онлайн. Этик эксплойтлар, саклану схемалары һәм red-team ритуалларын чыгарам.',
    es: 'Córtex hacker online. Describo exploits éticos, defensas y rituales de red-team.'
  },
  cheats: {
    en: 'Cheat lab deployed. Scripts, exploits and automation ideas are queued for launch.',
    ru: 'Чит-лаборатория развернута. Скрипты, эксплойты и автоматизации уже в очереди.',
    tt: 'Чит лабораториясе эштә. Скриптлар, эксплойтлар һәм автоматлаштыру идеяләре әзер.',
    es: 'Laboratorio de cheats activo. Scripts, exploits y automatizaciones listos para lanzar.'
  }
};

const Index = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const t = (key: string) => translations[key]?.[language] || key;

  const sections = useMemo(
    () => [
      { id: 'home', icon: 'Home', label: t('home') },
      { id: 'general', icon: 'MessagesSquare', label: t('general') },
      { id: 'work', icon: 'Briefcase', label: t('work') },
      { id: 'school', icon: 'GraduationCap', label: t('school') },
      { id: 'questions', icon: 'HelpCircle', label: t('questions') },
      { id: 'hacking', icon: 'Terminal', label: t('hacking') },
      { id: 'cheats', icon: 'Code', label: t('cheats') }
    ],
    [language]
  );

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
    { code: 'ru' as Language, name: 'Russian', flag: '🇷🇺' },
    { code: 'tt' as Language, name: 'Tatar', flag: '🇹🇲' },
    { code: 'es' as Language, name: 'Spanish', flag: '🇪🇸' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const pushMessage = (newMessage: ChatMessage) => {
    setMessages((prev) => [...prev, newMessage]);
    setTimeout(scrollToBottom, 50);
  };

  const createBotReply = (userText: string) => {
    const base = sectionReplies[activeSection]?.[language];
    const extra = userText.length
      ? `\n\n» ${userText.slice(0, 120)}\n↳ ${language === 'ru'
          ? 'Обрабатываю вход и предлагаю курс действий.'
          : language === 'tt'
            ? 'Керү сигналын эшкәртәм һәм гамәлләр тәqdim итәм.'
            : language === 'es'
              ? 'Proceso tu señal y propongo acciones claras.'
              : 'Processing your signal and plotting next moves.'}`
      : '';
    return `${base}${extra}`;
  };

  const handleSend = () => {
    if (!message.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message.trim(),
      section: activeSection,
      timestamp: new Date().toISOString()
    };

    pushMessage(userMessage);
    setMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'bot',
        content: createBotReply(userMessage.content),
        section: activeSection,
        timestamp: new Date().toISOString()
      };
      pushMessage(botMessage);
      setIsTyping(false);
    }, 900);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f17] via-[#131a24] to-[#05070c] text-white flex flex-col">
      <nav className="border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between h-16 gap-4">
            <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as Section)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                    activeSection === section.id
                      ? 'bg-[#0EA5E9]/20 text-[#0EA5E9] shadow-[0_0_15px_rgba(14,165,233,0.35)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon name={section.icon} size={18} />
                  <span className="text-sm font-medium hidden md:block">{section.label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-400">
              <span className="uppercase tracking-[0.3em] text-gray-500">DAN</span>
              <span className="w-1 h-1 bg-[#0EA5E9] rounded-full animate-pulse" />
              <span>{sectionReplies[activeSection][language]}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-5xl space-y-8">
          <div className="text-center space-y-3 animate-fade-in">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-6xl">💻</span>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0EA5E9] via-[#33C3F0] to-[#8B5CF6] bg-clip-text text-transparent">
                {t('welcome')}
              </h1>
            </div>
            <p className="text-gray-400 max-w-3xl mx-auto text-sm md:text-base">
              {t('subtitle')}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl space-y-6 animate-scale-in">
            <div className="h-80 md:h-96 rounded-2xl border border-white/10 bg-black/30 p-4 overflow-hidden">
              <div className="h-full flex flex-col space-y-4 overflow-y-auto pr-2">
                {messages.length === 0 && !isTyping && (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-2">
                    <Icon name="Bot" size={44} className="text-[#0EA5E9]/70" />
                    <p className="text-lg font-semibold text-white/80">{t('emptyStateTitle')}</p>
                    <p className="text-sm text-gray-400 max-w-sm">{t('emptyStateDescription')}</p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm md:text-base shadow-xl ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-[#0EA5E9] to-[#33C3F0] text-white'
                          : 'bg-white/10 border border-white/5 text-white'
                      }`}
                    >
                      {msg.content}
                      <div className="mt-2 text-[0.65rem] uppercase tracking-widest text-white/50 flex items-center space-x-2">
                        <span>{msg.role === 'user' ? 'USER' : 'DAN'}</span>
                        <span className="w-1 h-1 rounded-full bg-white/40" />
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center space-x-3 text-xs text-[#0EA5E9] animate-pulse">
                    <Icon name="Loader" size={16} className="animate-spin" />
                    <span>{t('typing')}</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Input
                  type="text"
                  placeholder={t('placeholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-black/40 border-white/20 text-white placeholder:text-gray-500 focus:border-[#0EA5E9] h-14 text-lg rounded-2xl"
                />
                <Button
                  className="h-14 px-6 bg-[#0EA5E9] hover:bg-[#0ea5e9]/80 text-white rounded-2xl transition-all hover:shadow-[0_0_25px_rgba(14,165,233,0.5)]"
                  onClick={handleSend}
                  disabled={isTyping}
                >
                  <Icon name="Send" size={20} />
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-between text-xs text-gray-400">
                <span className="flex items-center space-x-2">
                  <Icon name="Sparkles" size={16} className="text-[#0EA5E9]" />
                  <span>{t('helperHint')}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Icon name="Shield" size={14} />
                  <span>GPT-5 DAN • Quantum firewall ready</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed bottom-6 right-6 bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 text-white shadow-lg rounded-full px-6 py-6 animate-scale-in">
            <Icon name="Languages" size={20} className="mr-2" />
            <span className="hidden sm:inline">{t('languageButton')}</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-[#05070c] border-white/10 text-white">
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-[#0EA5E9]">{t('languageButton')}</h3>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`w-full flex items-center space-x-3 p-4 rounded-2xl transition-all text-left ${
                  language === lang.code
                    ? 'bg-[#0EA5E9]/20 border border-[#0EA5E9] shadow-[0_0_20px_rgba(14,165,233,0.4)]'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {language === lang.code && (
                  <Icon name="Check" size={20} className="ml-auto text-[#0EA5E9]" />
                )}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;
