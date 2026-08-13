export default function Testimonials() {
  const testimonials = [
    {
      quote:
        '"Siti didn\'t just illustrate my book; she breathed a soul into the characters. Her attention to detail and ability to capture emotion through color is truly magical."',
      author: 'Elena R.',
      role: 'Author, UK',
      bgColor: 'bg-secondary-fixed-dim',
      transform: 'transform -rotate-1',
    },
    {
      quote:
        '"Working with Siti on our branding was a dream. She captured the handmade, organic feel we wanted perfectly. Our customers love her illustrations!"',
      author: 'Mark J.',
      role: 'Tea & Co Founder',
      bgColor: 'bg-primary-fixed-dim',
      transform: 'transform rotate-2 lg:translate-y-6',
    },
    {
      quote:
        '"Professional, imaginative, and incredibly talented. Siti delivered more than what was briefed. She is now our go-to illustrator for all poster art."',
      author: 'Siska K.',
      role: 'Event Organizer',
      bgColor: 'bg-tertiary-fixed',
      transform: 'transform -rotate-1 md:hidden lg:block',
    },
  ]

  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-primary/5 torn-edge"></div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative">
        <h2 className="text-mix text-headline-md md:text-5xl text-primary mb-20 text-center">
          Kind <span>words</span> from <span>storytellers</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className={`bg-white p-12 rounded-[40px] shadow-xl shadow-primary/5 relative ${item.transform}`}
            >
              <span className="material-symbols-outlined absolute -top-6 left-10 text-6xl text-primary/30">
                format_quote
              </span>
              <p className="font-body-lg text-on-surface-variant italic mb-10 leading-relaxed text-lg">
                {item.quote}
              </p>
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl ${item.bgColor}`}></div>
                <div>
                  <p className="font-bold text-on-surface text-lg">{item.author}</p>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
