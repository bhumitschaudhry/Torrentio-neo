import { Zap, Search, Bell, Wifi } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isConnected: boolean;
}

export function Header({ searchQuery, onSearchChange, isConnected }: HeaderProps) {
  return (
    <header className="relative mb-2">
      {/* Main header bar */}
      <div className="flex items-center justify-between gap-4">
        {/* Title - massive overlapping */}
        <div className="relative">
          <h1 className="font-display text-[72px] leading-[0.85] text-brutal-black tracking-tight select-none">
            TORRENTIO
          </h1>
          <div className="absolute -bottom-1 left-1 font-display text-[72px] leading-[0.85] text-hot-magenta tracking-tight select-none opacity-15 -z-10">
            TORRENTIO
          </div>
          <p className="font-display text-[11px] tracking-[0.4em] text-brutal-dark-gray mt-1 ml-1">
            NEO-BRUTALIST TRANSFER ENGINE
          </p>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center bg-brutal-white border-[4px] border-brutal-black brutal-shadow-sm">
            <div className="px-3 py-2 border-r-[3px] border-brutal-black bg-brutal-bg">
              <Search className="w-5 h-5 text-brutal-black" strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="SEARCH TORRENTS..."
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="px-3 py-2 font-display text-[12px] tracking-wider bg-transparent outline-none w-[200px] placeholder:text-black/45"
            />
          </div>

          {/* Connection Status */}
          <div
            className={`border-[4px] border-brutal-black brutal-shadow-sm px-3 py-2 flex items-center gap-2 cursor-default transition-colors ${
              isConnected ? 'bg-acid-green' : 'bg-brutal-black'
            }`}
          >
            <Wifi
              className={`w-5 h-5 ${isConnected ? 'text-brutal-black animate-pulse-green' : 'text-brutal-white'}`}
              strokeWidth={3}
            />
            <span className={`font-display text-[10px] tracking-wider ${isConnected ? 'text-brutal-black' : 'text-brutal-white'}`}>
              {isConnected ? 'CONNECTED' : 'OFFLINE'}
            </span>
          </div>

          {/* Notifications */}
          <button className="w-[46px] h-[46px] bg-brutal-white border-[4px] border-brutal-black brutal-shadow-sm flex items-center justify-center hover:bg-electric-blue transition-colors cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none relative">
            <Bell className="w-5 h-5 text-brutal-black" strokeWidth={2.5} />
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-brutal-red border-[2px] border-brutal-black flex items-center justify-center">
              <span className="text-[8px] font-display text-brutal-white">3</span>
            </div>
          </button>

          {/* Logo icon */}
          <div className="w-[46px] h-[46px] bg-hot-magenta border-[4px] border-brutal-black brutal-shadow-sm flex items-center justify-center">
            <Zap className="w-6 h-6 text-brutal-black" strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="mt-4 h-[6px] bg-brutal-black relative">
        <div className="absolute left-0 top-0 w-[45%] h-full bg-acid-green" />
      </div>
    </header>
  );
}
