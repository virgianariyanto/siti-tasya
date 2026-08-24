import { useContent } from '../context/useContent'

export default function Services() {
  const { services } = useContent()

  const servicesList = services?.items || []

  return (
    <section className="py-32 bg-surface-container-low/50" id="services">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="max-w-3xl mb-20 space-y-4">
          <h2 className="text-mix text-headline-md md:text-6xl text-primary">
            {services?.sectionTitle || 'Magical Services'}
          </h2>
          <p className="font-body-lg text-xl text-on-surface-variant">
            {services?.sectionSubtitle ||
              'Bringing your creative visions to life with a gentle touch and story-driven artistry.'}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesList.map((service, index) => (
            <div
              key={service.id || index}
              className={`bg-white p-10 rounded-[40px] hand-drawn-border group hover:shadow-2xl ${
                service.hoverShadow || 'hover:shadow-primary/10'
              } transition-all duration-500 hover:-translate-y-2 ${service.offset || ''}`}
            >
              <div
                className={`w-20 h-20 mb-8 flex items-center justify-center ${
                  service.bgColor || 'bg-secondary-container/40'
                } rounded-3xl ${service.rotation || 'group-hover:rotate-6'} transition-transform`}
              >
                <span
                  className={`material-symbols-outlined text-5xl ${
                    service.iconColor || 'text-primary'
                  }`}
                >
                  {service.icon || 'palette'}
                </span>
              </div>
              <h3 className="font-display-lg text-2xl font-bold text-on-surface mb-4">
                {service.title}
              </h3>
              <p className="text-on-surface-variant mb-8 text-base leading-relaxed">
                {service.description}
              </p>
              <div className="pt-4 border-t border-dashed border-outline-variant">
                <span className="font-label-caps text-primary font-black tracking-widest">
                  {service.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
