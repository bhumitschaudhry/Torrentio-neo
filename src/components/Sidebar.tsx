import {
  Download,
  Upload,
  Settings,
  Plus,
  Folder,
  Search,
  Zap,
  BarChart3,
  Rss,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'downloads', label: 'DOWNLOADS', icon: Download, count: 3 },
  { id: 'seeding', label: 'SEEDING', icon: Upload, count: 1 },
  { id: 'completed', label: 'DONE', icon: Folder, count: 1 },
  { id: 'all', label: 'ALL', icon: BarChart3, count: 7 },
];

const bottomItems = [
  { id: 'rss', label: 'RSS', icon: Rss },
  { id: 'search', label: 'SEARCH', icon: Search },
  { id: 'settings', label: 'CONFIG', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-[100px] min-h-screen bg-brutal-black flex flex-col items-center py-6 border-r-[6px] border-brutal-black relative z-20">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-[72px] h-[72px] bg-hot-magenta border-[4px] border-brutal-black brutal-shadow-sm flex items-center justify-center relative">
          <Zap className="w-10 h-10 text-brutal-black" strokeWidth={3} />
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-acid-green border-[2px] border-brutal-black" />
        </div>
        <span className="text-brutal-white font-display text-[10px] mt-2 tracking-widest">
          T·IO
        </span>
      </div>

      {/* Add button */}
      <button
        className="w-[68px] h-[68px] bg-acid-green border-[4px] border-brutal-white mb-6 flex items-center justify-center 
        hover:bg-hot-magenta transition-colors duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none brutal-shadow-sm cursor-pointer group"
      >
        <Plus className="w-9 h-9 text-brutal-black group-hover:rotate-90 transition-transform duration-200" strokeWidth={3.5} />
      </button>

      {/* Nav items */}
      <nav className="flex flex-col items-center gap-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-[72px] h-[72px] border-[4px] flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer relative
                active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                ${
                  isActive
                    ? 'bg-hot-magenta border-brutal-white brutal-shadow-sm text-brutal-black'
                    : 'bg-brutal-dark-gray border-brutal-dark-gray text-brutal-gray hover:bg-hot-magenta hover:border-brutal-white hover:text-brutal-black brutal-shadow-sm'
                }`}
            >
              <Icon className="w-6 h-6" strokeWidth={2.5} />
              <span className="text-[8px] font-display tracking-wider">{item.label}</span>
              {item.count > 0 && (
                <div className="absolute -top-2 -right-2 min-w-[20px] h-[20px] bg-acid-green border-[2px] border-brutal-black flex items-center justify-center">
                  <span className="text-[9px] font-display text-brutal-black px-1">{item.count}</span>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="flex flex-col items-center gap-2 mt-auto pt-4">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-[72px] h-[56px] border-[3px] flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer
                active:translate-x-[2px] active:translate-y-[2px]
                ${
                  isActive
                    ? 'bg-electric-blue border-brutal-white text-brutal-black'
                    : 'bg-brutal-dark-gray border-brutal-dark-gray text-brutal-gray hover:bg-electric-blue hover:border-brutal-white hover:text-brutal-black'
                }`}
            >
              <Icon className="w-5 h-5" strokeWidth={2.5} />
              <span className="text-[7px] font-display tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
