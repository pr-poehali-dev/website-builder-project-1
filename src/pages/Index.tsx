import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  preview: string;
  published: boolean;
  publishedUrl?: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Мой сайт-портфолио', preview: '/placeholder.svg', published: true, publishedUrl: 'https://mysite.dev' },
    { id: '2', name: 'Корпоративный сайт', preview: '/placeholder.svg', published: false },
  ]);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: '✅ Файл загружен',
        description: `${file.name} готов к публикации`,
      });
    }
  };

  const handlePublish = (id: string) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, published: true, publishedUrl: `https://${p.name.toLowerCase().replace(/\s+/g, '-')}.dev` } : p
    ));
    toast({
      title: '🚀 Сайт опубликован!',
      description: 'Ваш сайт доступен в интернете',
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 pointer-events-none" />
      
      <nav className="relative z-10 glass border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center glow">
              <Icon name="Rocket" size={20} className="text-white sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold gradient-text">WebBuilder Pro</h1>
          </div>
          
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>

          <div className="hidden md:flex gap-6">
            <button 
              onClick={() => setActiveTab('home')}
              className={`transition-colors ${activeTab === 'home' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Главная
            </button>
            <button 
              onClick={() => setActiveTab('builder')}
              className={`transition-colors ${activeTab === 'builder' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Конструктор
            </button>
            <button 
              onClick={() => setActiveTab('projects')}
              className={`transition-colors ${activeTab === 'projects' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Мои проекты
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-white/10 animate-fade-in">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <button 
                onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                className={`text-left py-2 px-4 rounded-lg transition-colors ${activeTab === 'home' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-white/5'}`}
              >
                Главная
              </button>
              <button 
                onClick={() => { setActiveTab('builder'); setMobileMenuOpen(false); }}
                className={`text-left py-2 px-4 rounded-lg transition-colors ${activeTab === 'builder' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-white/5'}`}
              >
                Конструктор
              </button>
              <button 
                onClick={() => { setActiveTab('projects'); setMobileMenuOpen(false); }}
                className={`text-left py-2 px-4 rounded-lg transition-colors ${activeTab === 'projects' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-white/5'}`}
              >
                Мои проекты
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {activeTab === 'home' && (
          <div className="animate-fade-in">
            <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 gradient-text animate-scale-in">
                Создавай сайты за минуты
              </h2>
              <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Загрузи файлы своего сайта и опубликуй его в интернете одним кликом. 
                Без сложных настроек и технических знаний.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity glow w-full sm:w-auto"
                  onClick={() => setActiveTab('builder')}
                >
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  Начать создавать
                </Button>
                <Button size="lg" variant="outline" className="glass border-white/20 hover:bg-white/10 w-full sm:w-auto">
                  <Icon name="Play" size={20} className="mr-2" />
                  Посмотреть демо
                </Button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              <Card className="glass p-6 hover:scale-105 transition-transform animate-fade-in">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Upload" size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Загрузи файлы</h3>
                <p className="text-muted-foreground">
                  Просто перетащи HTML, CSS и JS файлы в конструктор
                </p>
              </Card>

              <Card className="glass p-6 hover:scale-105 transition-transform animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Eye" size={24} className="text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Предпросмотр</h3>
                <p className="text-muted-foreground">
                  Смотри результат в реальном времени перед публикацией
                </p>
              </Card>

              <Card className="glass p-6 hover:scale-105 transition-transform animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Globe" size={24} className="text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Опубликуй</h3>
                <p className="text-muted-foreground">
                  Получи уникальную ссылку и поделись с миром
                </p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'builder' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 gradient-text">Конструктор сайтов</h2>
            
            <Card className="glass p-4 sm:p-8 mb-6">
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 sm:p-12 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".html,.css,.js,.zip"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-float">
                    <Icon name="CloudUpload" size={32} className="text-primary sm:w-10 sm:h-10" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-semibold mb-2">Загрузи файлы сайта</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    Поддерживаются HTML, CSS, JS и ZIP архивы
                  </p>
                  <Button className="bg-gradient-to-r from-primary to-secondary glow">
                    Выбрать файлы
                  </Button>
                </label>
              </div>

              {uploadedFile && (
                <div className="mt-6 p-4 glass rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 sm:justify-between animate-scale-in">
                  <div className="flex items-center gap-3">
                    <Icon name="File" size={24} className="text-primary" />
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-primary to-secondary w-full sm:w-auto"
                    onClick={() => {
                      const newProject: Project = {
                        id: Date.now().toString(),
                        name: uploadedFile.name.replace(/\.[^/.]+$/, ""),
                        preview: '/placeholder.svg',
                        published: false
                      };
                      setProjects([...projects, newProject]);
                      setActiveTab('projects');
                      toast({
                        title: '✅ Проект создан',
                        description: 'Готов к публикации',
                      });
                    }}
                  >
                    <Icon name="Check" size={16} className="mr-2" />
                    Создать проект
                  </Button>
                </div>
              )}
            </Card>

            <Card className="glass p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="Info" size={20} className="text-accent" />
                Как это работает?
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-primary mt-0.5" />
                  <span>Загрузи HTML файл или ZIP архив с твоим сайтом</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-primary mt-0.5" />
                  <span>Мы автоматически обработаем все файлы и стили</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-primary mt-0.5" />
                  <span>Получи уникальную ссылку для публикации</span>
                </li>
              </ul>
            </Card>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-4xl font-bold gradient-text">Мои проекты</h2>
              <Button 
                className="bg-gradient-to-r from-primary to-secondary glow w-full sm:w-auto"
                onClick={() => setActiveTab('builder')}
              >
                <Icon name="Plus" size={20} className="mr-2" />
                Новый проект
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map((project, index) => (
                <Card 
                  key={project.id} 
                  className="glass overflow-hidden hover:scale-105 transition-transform animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img 
                      src={project.preview} 
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                    {project.published && (
                      <div className="absolute top-2 right-2 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Icon name="Check" size={14} />
                        Опубликовано
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                    
                    {project.published && project.publishedUrl ? (
                      <div className="space-y-2">
                        <a 
                          href={project.publishedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <Icon name="ExternalLink" size={16} />
                          {project.publishedUrl}
                        </a>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 glass text-xs sm:text-sm">
                            <Icon name="Settings" size={14} className="mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Настройки</span>
                          </Button>
                          <Button size="sm" variant="outline" className="glass">
                            <Icon name="Share2" size={14} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-secondary glow"
                        onClick={() => handlePublish(project.id)}
                      >
                        <Icon name="Rocket" size={16} className="mr-2" />
                        Опубликовать
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {projects.length === 0 && (
              <Card className="glass p-12 text-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="FolderOpen" size={40} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Пока нет проектов</h3>
                <p className="text-muted-foreground mb-6">
                  Создай свой первый сайт в конструкторе
                </p>
                <Button 
                  className="bg-gradient-to-r from-primary to-secondary"
                  onClick={() => setActiveTab('builder')}
                >
                  Создать проект
                </Button>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;