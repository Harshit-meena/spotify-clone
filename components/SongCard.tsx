'use client';

interface SongCardProps {
  imageUrl: string;
  title: string;
  author: string;
  onClick?: () => void;
}

export const SongCard: React.FC<SongCardProps> = ({ imageUrl, title, author, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-4 rounded-xl transition-all cursor-pointer group"
      style={{
        background:   'var(--card-bg)',
        border:       '1px solid var(--border-subtle)',
        boxShadow:    'var(--card-shadow)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background    = 'var(--card-hover)';
        e.currentTarget.style.borderColor   = 'var(--border-default)';
        e.currentTarget.style.transform     = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background    = 'var(--card-bg)';
        e.currentTarget.style.borderColor   = 'var(--border-subtle)';
        e.currentTarget.style.transform     = 'translateY(0px)';
      }}
    >
      <div className="relative aspect-square rounded-md overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
          <div
            className="p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform"
            style={{ background: 'var(--green)', boxShadow: '0 4px 12px var(--green-glow)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="black">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>

      <p
        className="mt-3 truncate font-semibold text-sm"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </p>
      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
        {author}
      </p>
    </div>
  );
};