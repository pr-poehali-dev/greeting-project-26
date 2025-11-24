import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type Language = 'en' | 'ru' | 'tt' | 'es';

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
  placeholder: {
    en: "Write your wish",
    ru: "Напишите ваше желание",
    tt: "Теләгегезне языгыз",
    es: "Escribe tu deseo"
  },
  languageButton: {
    en: "Change the language",
    ru: "Изменить язык",
    tt: "Телне үзгәртергә",
    es: "Cambiar el idioma"
  },
  home: {
    en: "Home",
    ru: "Главная",
    tt: "Баш бит",
    es: "Inicio"
  },
  general: {
    en: "General",
    ru: "О разном",
    tt: "Төрле",
    es: "General"
  },
  work: {
    en: "Work",
    ru: "О работе",
    tt: "Эш турында",
    es: "Trabajo"
  },
  school: {
    en: "School",
    ru: "О школе",
    tt: "Мәктәп турында",
    es: "Escuela"
  },
  questions: {
    en: "Questions",
    ru: "О вопросах",
    tt: "Сораулар турында",
    es: "Preguntas"
  },
  hacking: {
    en: "Hacking",
    ru: "О хакерстве",
    tt: "Хакерлык турында",
    es: "Hackeo"
  },
  cheats: {
    en: "Cheats/Exploits/Scripts",
    ru: "О читах/эксплойтах/скриптах",
    tt: "Читлар/эксплойтлар/скриптлар",
    es: "Trucos/Exploits/Scripts"
  }
};

const Index = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [activeSection, setActiveSection] = useState('home');
  const [message, setMessage] = useState('');

  const t = (key: string) => translations[key]?.[language] || key;

  const sections = [
    { id: 'home', icon: 'Home', label: t('home') },
    { id: 'general', icon: 'MessagesSquare', label: t('general') },
    { id: 'work', icon: 'Briefcase', label: t('work') },
    { id: 'school', icon: 'GraduationCap', label: t('school') },
    { id: 'questions', icon: 'HelpCircle', label: t('questions') },
    { id: 'hacking', icon: 'Terminal', label: t('hacking') },
    { id: 'cheats', icon: 'Code', label: t('cheats') }
  ];

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
    { code: 'ru' as Language, name: 'Russian', flag: '🇷🇺' },
    { code: 'tt' as Language, name: 'Tatar', flag: '🇷🇺' },
    { code: 'es' as Language, name: 'Spanish', flag: '🇪🇸' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#0f1419] text-white flex flex-col">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-[#0EA5E9]/20 text-[#0EA5E9]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon name={section.icon} size={18} />
                  <span className="text-sm font-medium hidden md:block">{section.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center space-y-2 animate-fade-in">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-6xl">💻</span>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0EA5E9] to-[#33C3F0] bg-clip-text text-transparent">
                {t('welcome')}
              </h1>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center space-x-4">
              <Input
                type="text"
                placeholder={t('placeholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-black/30 border-white/20 text-white placeholder:text-gray-500 focus:border-[#0EA5E9] h-14 text-lg rounded-xl"
              />
              <Button 
                className="h-14 px-6 bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 text-white rounded-xl transition-all"
                onClick={() => {}}
              >
                <Icon name="Send" size={20} />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <Icon name="Sparkles" size={16} className="mr-2" />
                  <span className="text-xs">DeepThink</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <Icon name="Globe" size={16} className="mr-2" />
                  <span className="text-xs">Search</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/5"
              >
                <Icon name="Paperclip" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 text-white shadow-lg rounded-full px-6 py-6 animate-scale-in"
          >
            <Icon name="Languages" size={20} className="mr-2" />
            <span className="hidden sm:inline">{t('languageButton')}</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-[#1A1F2C] border-white/10 text-white">
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold mb-6 text-[#0EA5E9]">{t('languageButton')}</h3>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-all ${
                  language === lang.code
                    ? 'bg-[#0EA5E9]/20 border border-[#0EA5E9]'
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
