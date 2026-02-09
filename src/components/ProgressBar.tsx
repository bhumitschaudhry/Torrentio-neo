interface ProgressBarProps {
  progress: number;
  status: 'downloading' | 'seeding' | 'paused' | 'queued' | 'completed';
}

export function ProgressBar({ progress, status }: ProgressBarProps) {
  const getColor = () => {
    switch (status) {
      case 'downloading':
        return 'bg-acid-green';
      case 'seeding':
        return 'bg-hot-magenta';
      case 'completed':
        return 'bg-electric-blue';
      case 'paused':
        return 'bg-brutal-yellow';
      case 'queued':
        return 'bg-brutal-gray';
      default:
        return 'bg-acid-green';
    }
  };

  // Retro battery indicator segments
  const totalSegments = 20;
  const filledSegments = Math.round((progress / 100) * totalSegments);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-[28px] border-[4px] border-brutal-black bg-brutal-white p-[2px] flex gap-[2px] relative">
          {Array.from({ length: totalSegments }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-full transition-all duration-300 ${
                i < filledSegments ? getColor() : 'bg-transparent'
              }`}
              style={{
                animationDelay: `${i * 50}ms`,
              }}
            />
          ))}
          {/* Battery cap */}
          <div className="absolute -right-[10px] top-1/2 -translate-y-1/2 w-[6px] h-[14px] bg-brutal-black" />
        </div>
        <span className="font-display text-[18px] text-brutal-black min-w-[60px] text-right">
          {progress}%
        </span>
      </div>
    </div>
  );
}
