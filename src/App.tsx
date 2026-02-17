import { useMemo, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { TorrentList } from './components/TorrentList';
import { BottomBar } from './components/BottomBar';
import { useBrowserTorrent } from './hooks/useBrowserTorrent';

export function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const {
    torrents,
    stats,
    isLoading,
    isConnected,
    error,
    addTorrent,
    uploadTorrent,
    pauseTorrent,
    resumeTorrent,
    removeTorrent,
    getFileStreamUrl,
    getTorrentFiles,
  } = useBrowserTorrent();

  const counts = useMemo(
    () => ({
      downloads: torrents.filter((torrent) => torrent.status === 'downloading' || torrent.status === 'paused' || torrent.status === 'queued').length,
      seeding: torrents.filter((torrent) => torrent.status === 'seeding').length,
      completed: torrents.filter((torrent) => torrent.status === 'completed').length,
      all: torrents.length,
    }),
    [torrents],
  );

  const handleAddTorrent = async () => {
    const mode = window.prompt(
      'Type "magnet" to paste a magnet/URL or "file" to upload a .torrent file.',
      'magnet',
    );
    if (!mode) {
      return;
    }

    const normalizedMode = mode.trim().toLowerCase();
    if (normalizedMode === 'file') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.torrent,application/x-bittorrent';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) {
          return;
        }

        try {
          await uploadTorrent(file);
        } catch (uploadError) {
          window.alert(uploadError instanceof Error ? uploadError.message : 'Failed to upload torrent.');
        }
      };
      input.click();
      return;
    }

    const source = window.prompt('Paste a magnet URI or .torrent URL:');
    if (!source?.trim()) {
      return;
    }

    try {
      await addTorrent(source.trim());
    } catch (addError) {
      window.alert(addError instanceof Error ? addError.message : 'Failed to add torrent.');
    }
  };

  const handlePause = async (id: string) => {
    try {
      await pauseTorrent(id);
    } catch (pauseError) {
      window.alert(pauseError instanceof Error ? pauseError.message : 'Failed to pause torrent.');
    }
  };

  const handleResume = async (id: string) => {
    try {
      await resumeTorrent(id);
    } catch (resumeError) {
      window.alert(resumeError instanceof Error ? resumeError.message : 'Failed to resume torrent.');
    }
  };

  const handleRemove = async (id: string) => {
    const confirmed = window.confirm('Remove this torrent and delete its downloaded data?');
    if (!confirmed) {
      return;
    }

    try {
      await removeTorrent(id);
    } catch (removeError) {
      window.alert(removeError instanceof Error ? removeError.message : 'Failed to remove torrent.');
    }
  };

  const handleStream = async (id: string) => {
    try {
      const response = getTorrentFiles(id);
      const firstStreamable = response.files.find((file) => file.streamable);
      if (!firstStreamable) {
        window.alert('No streamable files are available yet for this torrent.');
        return;
      }

      const streamUrl = getFileStreamUrl(id, firstStreamable.index);
      window.open(streamUrl, '_blank', 'noopener,noreferrer');
    } catch (streamError) {
      window.alert(streamError instanceof Error ? streamError.message : 'Failed to open stream.');
    }
  };

  return (
    <div className="flex min-h-screen bg-brutal-bg">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
        onAddTorrent={handleAddTorrent}
      />

      {/* Main Content */}
      <main className="flex-1 relative pb-16">
        <div className="p-8 max-w-[1400px]">
          {/* Header */}
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isConnected={isConnected}
          />

          {error ? (
            <div className="mt-4 bg-brutal-black border-[4px] border-brutal-black p-3">
              <p className="font-display text-[12px] text-brutal-white tracking-wider">
                BACKEND ERROR: {error}
              </p>
            </div>
          ) : null}

          {isLoading ? (
            <div className="mt-4 bg-brutal-white border-[4px] border-brutal-black p-3">
              <p className="font-display text-[12px] text-brutal-black tracking-wider">
                CONNECTING TO TORRENT BACKEND...
              </p>
            </div>
          ) : null}

          {/* Stats Cards */}
          <div className="mt-8">
            <StatsBar stats={stats} />
          </div>

          {/* Torrent List */}
          <div className="mt-4">
            <TorrentList
              torrents={torrents}
              activeTab={activeTab}
              searchQuery={searchQuery}
              onPause={handlePause}
              onResume={handleResume}
              onRemove={handleRemove}
              onStream={handleStream}
            />
          </div>
        </div>

        {/* Decorative corner elements */}
        <div className="fixed top-4 right-4 z-50">
          <div className="w-[30px] h-[30px] border-[4px] border-brutal-black bg-acid-green rotate-45 opacity-25" />
        </div>
      </main>

      {/* Bottom Status Bar */}
      <BottomBar stats={stats} />
    </div>
  );
}
