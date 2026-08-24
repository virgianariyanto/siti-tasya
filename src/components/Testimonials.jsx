import { useContent } from '../context/useContent'

export default function Testimonials() {
  const { testimonials } = useContent()

  const list = testimonials?.items || []

  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-primary/5 torn-edge"></div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative">
        <h2 className="text-mix text-headline-md md:text-5xl text-primary mb-20 text-center">
          {testimonials?.sectionTitle || 'Kind words from storytellers'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {list.map((item, index) => (
            <div
              key={item.id || index}
              className={`bg-white p-12 rounded-[40px] shadow-xl shadow-primary/5 relative ${
                item.transform || ''
              }`}
            >
              <span className="material-symbols-outlined absolute -top-6 left-10 text-6xl text-primary/30">
                format_quote
              </span>
              <p className="font-body-lg text-on-surface-variant italic mb-10 leading-relaxed text-lg">
                {item.quote}
              </p>
              <div className="flex items-center gap-5">
                <div
                  className={`w-14 h-14 rounded-2xl ${
                    item.bgColor || 'bg-secondary-fixed-dim'
                  } flex items-center justify-center font-bold text-xl text-primary`}
                >
                  {item.author ? item.author.charAt(0) : '✨'}
                </div>
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
