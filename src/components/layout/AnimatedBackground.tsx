export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute -inset-[100px] grid grid-cols-6 grid-rows-10 gap-4 opacity-[0.08]">
        {Array.from({ length: 60 }).map((_, i) => {
          const col = i % 6;
          const row = Math.floor(i / 6);
          const offsetY = (col - 2.5) * 50;
          const delay = (col + row) * 0.15;
          return (
            <div key={i} className="flex items-center justify-center" style={{ transform: `translateY(${offsetY}px)`, willChange: 'transform' }}>
              <svg className="w-20 h-20 text-primary animate-sparkle" style={{ animationDelay: `${delay}s`, willChange: 'opacity, transform' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"/>
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}
