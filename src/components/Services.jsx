export default function Services() {
  const servicesList = [
    {
      icon: 'menu_book',
      title: "Children's Books",
      description: "Full-page spreads and covers that spark childhood imagination and wonder.",
      price: 'FROM $1,000+',
      iconColor: 'text-secondary',
      bgColor: 'bg-secondary-container/40',
      hoverShadow: 'hover:shadow-secondary/10',
      rotation: 'group-hover:rotate-6',
      offset: '',
    },
    {
      icon: 'face_6',
      title: 'Character Design',
      description: 'Developing unique personalities and expressive visual identities for stories.',
      price: 'FROM $350+',
      iconColor: 'text-primary',
      bgColor: 'bg-primary-fixed/40',
      hoverShadow: 'hover:shadow-primary/10',
      rotation: 'group-hover:-rotate-6',
      offset: 'lg:translate-y-8',
    },
    {
      icon: 'palette',
      title: 'Brand Illustration',
      description: 'Custom illustrations to give your brand a human, friendly, and organic feel.',
      price: 'FROM $500+',
      iconColor: 'text-tertiary',
      bgColor: 'bg-tertiary-fixed/40',
      hoverShadow: 'hover:shadow-tertiary/10',
      rotation: 'group-hover:rotate-6',
      offset: '',
    },
    {
      icon: 'frame_person',
      title: 'Poster Art',
      description: 'Limited edition prints and decorative botanical wall art for collectors.',
      price: 'FROM $200+',
      iconColor: 'text-outline',
      bgColor: 'bg-surface-container-highest',
      hoverShadow: 'hover:shadow-outline/10',
      rotation: 'group-hover:-rotate-6',
      offset: 'lg:translate-y-8',
    },
  ]

  return (
    <section className="py-32 bg-surface-container-low/50" id="services">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="max-w-3xl mb-20 space-y-4">
          <h2 className="text-mix text-headline-md md:text-6xl text-primary">
            Magical <span>Services</span>
          </h2>
          <p className="font-body-lg text-xl text-on-surface-variant">
            Bringing your creative visions to life with a gentle touch and story-driven artistry.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesList.map((service, index) => (
            <div
              key={index}
              className={`bg-white p-10 rounded-[40px] hand-drawn-border group hover:shadow-2xl ${service.hoverShadow} transition-all duration-500 hover:-translate-y-2 ${service.offset}`}
            >
              <div className={`w-20 h-20 mb-8 flex items-center justify-center ${service.bgColor} rounded-3xl ${service.rotation} transition-transform`}>
                <span className={`material-symbols-outlined text-5xl ${service.iconColor}`}>
                  {service.icon}
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
