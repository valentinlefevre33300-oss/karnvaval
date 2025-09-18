import React from 'react';
import shoe1 from '@/assets/CarrouselShoes1.webp';
import shoe2 from '@/assets/CarrouselShoes2.webp';
import shoe3 from '@/assets/CarrouselShoes3.webp';
import bgSvg from '@/assets/BackgroundCarousel.svg';

type Slide = {
  brand: string;
  model: string;
  price: string; // already formatted string
  img: string;
};

// Build a filled star polygon with alternating outer/inner points (16 branches)
const buildStarPoints = (spikes: number, outer: number, inner: number, cx = 50, cy = 50): string => {
  const step = Math.PI / spikes;
  let angle = -Math.PI / 2; // start at top
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    pts.push(`${x},${y}`);
    angle += step;
  }
  return pts.join(' ');
};

const slides: Slide[] = [
  { brand: 'Nike', model: 'Air Max TN', price: '139,99€', img: shoe1 },
  { brand: 'Asics', model: 'GEL-Kayano 28', price: '119,99€', img: shoe2 },
  { brand: 'Adidas', model: 'Campus', price: '129,99€', img: shoe3 },
];

export const HomeCarousel: React.FC = () => {
  const [index, setIndex] = React.useState(0);
  const length = slides.length;

  // autoplay 5s
  React.useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % length), 5000);
    return () => clearInterval(id);
  }, [length]);

  const goTo = (i: number) => setIndex((i + length) % length);

  const current = slides[index];

  return (
    <section className="relative overflow-hidden">
      <div className="relative wave-bg h-[420px] sm:h-[520px] lg:h-[620px] rounded-2xl overflow-hidden shadow-large">
        {/* Responsive SVG background */}
        <img
          src={bgSvg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />
        {/* Slides (fade) */}
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-500 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="relative h-full w-full flex items-center justify-center px-6 sm:px-10">
              {/* Price badge (rotating 16-point star vignette) */}
              <div className="absolute top-4 right-4 z-[40]">
                <div className="relative">
                  {/* Star container rotating */}
                  <div className="animate-spin-slow w-32 h-32 sm:w-36 sm:h-36 lg:w-60 lg:h-60" aria-hidden="true">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <polygon points={buildStarPoints(16, 48, 28)} fill="#ffffff" />
                    </svg>
                  </div>
                  {/* Price text centered, bigger, yellow, stays upright */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[hsl(var(--brand-primary-hover))] font-extrabold text-2xl sm:text-3xl lg:text-4xl select-none">
                      {s.price}
                    </div>
                  </div>
                </div>
              </div>

              {/* Centered layered content */}
              <div className="relative flex items-center justify-center w-full h-full">
                {/* Brand behind (depth layer) */}
                <div className="absolute inset-0 flex items-center justify-center select-none z-[10] pointer-events-none">
                  <div className="whitespace-nowrap text-[28vw] sm:text-[22w] lg:text-[18vw] font-extrabold leading-none tracking-tight text-[hsl(var(--brand-primary-hover))]">
                    {s.brand}
                  </div>
                </div>

                {/* Shoe in the middle */}
                <div className="relative z-[20] h-1/2" style={{ aspectRatio: '3 / 2' }}>
                  <img
                    src={s.img}
                    alt={`${s.brand} ${s.model}`}
                    className="h-full w-full object-contain drop-shadow-2xl"
                  />
                </div>

                {/* Model on top */}
                <div className="absolute inset-0 flex items-center justify-center z-[30] select-none">
                  <div className="mt-28 sm:mt-32 lg:mt-40 text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[hsl(var(--brand-primary-hover))] drop-shadow">
                    {s.model}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Arrows */}
        <button
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-foreground rounded-full w-10 h-10 shadow-medium"
          onClick={() => goTo(index - 1)}
          aria-label="Précédent"
        >
          ‹
        </button>
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-foreground rounded-full w-10 h-10 shadow-medium"
          onClick={() => goTo(index + 1)}
          aria-label="Suivant"
        >
          ›
        </button>

        {/* Bullets */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-[hsl(var(--brand-primary-hover))]' : 'bg-white/70 hover:bg-white'}`}
              aria-label={`Aller au slide ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>

      {/* Tests retirés */}
    </section>
  );
};

export default HomeCarousel;


