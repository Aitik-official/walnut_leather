export default function Hero() {
  return (
    <section className="relative min-h-[50vh] overflow-hidden w-full" style={{ marginTop: '-64px', zIndex: 1 }}>
      {/* Two Images Side by Side */}
      <div className="flex h-full w-full" style={{ margin: 0, padding: 0 }}>
        {/* Left Image */}
        <div className="relative h-full overflow-hidden group cursor-pointer" style={{ width: '50%', flexShrink: 0 }}>
          <img
            src="/mens_main.png"
            alt="Mens Collection"
            className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700"></div>
        </div>
        
        {/* Right Image */}
        <div className="relative h-full overflow-hidden group cursor-pointer" style={{ width: '50%', flexShrink: 0 }}>
          <img
            src="/women_main.png"
            alt="Womens Collection"
            className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700"></div>
        </div>
      </div>
    </section>
  )
}
