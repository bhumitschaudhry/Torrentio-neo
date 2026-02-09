import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { TorrentList } from './components/TorrentList';
import { BottomBar } from './components/BottomBar';
import { torrents } from './data/mockData';

export function App() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="flex min-h-screen bg-brutal-bg">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 relative pb-16">
        <div className="p-8 max-w-[1400px]">
          {/* Header */}
          <Header />

          {/* Stats Cards */}
          <div className="mt-8">
            <StatsBar />
          </div>

          {/* Torrent List */}
          <div className="mt-4">
            <TorrentList torrents={torrents} activeTab={activeTab} />
          </div>
        </div>

        {/* Decorative corner elements */}
        <div className="fixed top-4 right-4 z-50">
          <div className="w-[30px] h-[30px] border-[4px] border-brutal-black bg-hot-magenta rotate-45 opacity-40" />
        </div>
      </main>

      {/* Bottom Status Bar */}
      <BottomBar />
    </div>
  );
}
