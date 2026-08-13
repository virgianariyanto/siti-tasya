export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/40 backdrop-blur-xl border-b border-primary/5">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-6 max-w-container-max mx-auto">
        <a className="font-display-lg text-3xl text-primary italic font-bold" href="#">
          Siti Tasya
        </a>
        <div className="hidden md:flex gap-10 items-center font-body-lg text-body-lg tracking-wide">
          <a className="text-primary font-bold relative group" href="#work">
            Work
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform scale-x-100 transition-transform"></span>
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-all relative group" href="#about">
            About
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-all relative group" href="#services">
            Services
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-all relative group" href="#contact">
            Contact
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </a>
        </div>
        <a
          href="#contact"
          className="bg-primary text-on-primary px-8 py-2.5 rounded-full storybook-button font-bold shadow-lg shadow-primary/20 inline-block"
        >
          Hire Me
        </a>
      </div>
    </nav>
  )
}
