import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowRight, Check, ChevronDown, Factory, Leaf, Menu, Play, ShieldCheck, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type SectionKey = "home" | "about" | "capabilities" | "gallery" | "contact";

const images = {
  hero: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2200&q=85",
  loom: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1400&q=85",
  detail: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=85",
  fabric: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=85",
  production: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1400&q=85",
  thread: "https://images.unsplash.com/photo-1605722243979-fe0be3f8a5c3?auto=format&fit=crop&w=1200&q=85",
  warehouse: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=85",
  portrait: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1400&q=85",
};

const navItems: { label: string; id: SectionKey }[] = [
  { label: "About", id: "about" },
  { label: "Capabilities", id: "capabilities" },
  { label: "Gallery", id: "gallery" },
  { label: "Contact", id: "contact" },
];

const values = [
  ["01", "Leadership", "We lead with clarity, consistency and the courage to make better decisions."],
  ["02", "Integrity", "Trust is built into every handoff — from yarn selection to final inspection."],
  ["03", "People", "Our progress is powered by the people who bring care and craft to every line."],
  ["04", "Innovation", "We keep evolving our processes, technologies and ways of working."],
  ["05", "Responsibility", "Better production means respect for people, resources and the future."],
  ["06", "Quality", "The standard is simple: make every garment ready for the world."],
];

const timeline = [
  ["1986", "A Karachi beginning", "Ali Murtaza Associates is founded with a focused ambition: make woven apparel that travels well."],
  ["1990", "First production facility", "The first purpose-built production floor establishes our foundation in quality and discipline."],
  ["2007", "Lahore expansion", "A second manufacturing base opens in Lahore, adding scale and a deeper talent pool."],
  ["Today", "Made with intent", "Two cities, one operating standard — delivering responsible production for global partners."],
];

const galleryItems = [
  [images.production, "Production", "Precision in motion"],
  [images.detail, "Craft", "The final detail"],
  [images.fabric, "Fabric", "Material with a point of view"],
  [images.thread, "Process", "Colour, tension, rhythm"],
  [images.warehouse, "Logistics", "Ready for the world"],
  [images.portrait, "Product", "Woven with confidence"],
];

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 28 }} animate={visible ? { opacity: 1, y: 0 } : undefined} transition={{ duration: .7, delay, ease: [.22, 1, .36, 1] }}>
      {children}
    </motion.div>
  );
}

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    const timer = window.setInterval(() => {
      const progress = Math.min((performance.now() - start) / 1300, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress === 1) window.clearInterval(timer);
    }, 24);
    return () => window.clearInterval(timer);
  }, [visible, value]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function Mark({ dark = false }: { dark?: boolean }) {
  return <div className={`flex items-center gap-3 ${dark ? "text-[#f4f0e8]" : "text-[#181a19]"}`}><span className="font-mono text-[11px] tracking-[.28em]">AMA</span><span className="h-5 w-px bg-current opacity-30" /><span className="font-mono text-[10px] tracking-[.14em] opacity-70">EST. 1986</span></div>;
}

function LogoMark() {
  return <div className="relative h-7 w-7"><span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-[#bd8740]" /><span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-[#bd8740]" /><span className="absolute left-[9px] top-[9px] h-2 w-2 bg-[#bd8740]" /></div>;
}

function PillButton({ children, onClick, light = false }: { children: React.ReactNode; onClick?: () => void; light?: boolean }) {
  return <button onClick={onClick} className={`group inline-flex items-center gap-3 rounded-full border px-5 py-3 text-[11px] font-medium uppercase tracking-[.14em] transition-all duration-300 ${light ? "border-[#f4f0e8]/30 text-[#f4f0e8] hover:border-[#bd8740] hover:bg-[#bd8740] hover:text-[#171817]" : "border-[#181a19]/20 text-[#181a19] hover:border-[#181a19] hover:bg-[#181a19] hover:text-[#f4f0e8]"}`}><span>{children}</span><ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></button>;
}

function Header({ active, onNavigate }: { active: SectionKey; onNavigate: (id: SectionKey) => void }) {
  const [open, setOpen] = useState(false);
  return <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-8 sm:pt-7"><div className="mx-auto flex max-w-[1440px] items-center justify-between rounded-full border border-[#f4f0e8]/10 bg-[#171817]/80 px-4 py-3 text-[#f4f0e8] shadow-2xl backdrop-blur-xl sm:px-6"><button onClick={() => onNavigate("home")} className="flex items-center gap-3"><LogoMark /><Mark dark /></button><nav className="hidden items-center gap-1 md:flex">{navItems.map((item) => <button key={item.id} onClick={() => onNavigate(item.id)} className={`relative px-4 py-2 text-[11px] uppercase tracking-[.16em] transition-colors ${active === item.id ? "text-[#d09b50]" : "text-[#f4f0e8]/65 hover:text-[#f4f0e8]"}`}>{item.label}{active === item.id && <motion.span layoutId="activeNav" className="absolute bottom-0 left-4 right-4 h-px bg-[#d09b50]" />}</button>)}</nav><div className="hidden md:block"><button onClick={() => onNavigate("contact")} className="rounded-full bg-[#d09b50] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[.15em] text-[#171817] transition-transform hover:scale-[1.03]">Start a conversation</button></div><button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>{open && <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-2 flex max-w-[1440px] flex-col rounded-3xl border border-[#f4f0e8]/10 bg-[#171817] p-3 text-[#f4f0e8] md:hidden">{navItems.map(item => <button key={item.id} onClick={() => { onNavigate(item.id); setOpen(false); }} className="rounded-2xl px-4 py-4 text-left text-xs uppercase tracking-[.16em] text-[#f4f0e8]/70 hover:bg-[#292a27] hover:text-[#d09b50]">{item.label}</button>)}</motion.nav>}</header>;
}

export default function MarketingDemo() {
  const [active, setActive] = useState<SectionKey>("home");
  const [selectedGallery, setSelectedGallery] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 170]);

  const navigate = (id: SectionKey) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id as SectionKey); }), { rootMargin: "-35% 0px -55%" });
    navItems.concat([{ label: "Home", id: "home" }]).forEach(item => { const el = document.getElementById(item.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return <div className="overflow-hidden bg-[#f3efe7] text-[#181a19]">
    <Header active={active} onNavigate={navigate} />
    <main>
      <section id="home" ref={heroRef} className="grain relative min-h-[820px] overflow-hidden bg-[#171817] text-[#f4f0e8] sm:min-h-screen">
        <motion.div style={{ y: heroImageY }} className="absolute inset-0 opacity-[.33]"><img src={images.hero} alt="Textile production floor" className="h-full w-full object-cover" /></motion.div><div className="absolute inset-0 bg-gradient-to-b from-[#171817]/35 via-[#171817]/50 to-[#171817]" /><div className="absolute -right-48 top-32 hidden h-[520px] w-[520px] rounded-full border border-[#d09b50]/20 lg:block" /><div className="absolute -right-28 top-52 hidden h-[330px] w-[330px] rounded-full border border-[#d09b50]/15 lg:block" />
        <div className="relative mx-auto flex min-h-[820px] max-w-[1440px] flex-col justify-end px-6 pb-14 pt-44 sm:min-h-screen sm:px-12 sm:pb-20 lg:px-20"><div className="mb-8 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[.25em] text-[#d09b50]"><span className="h-px w-9 bg-[#d09b50]" /> Built for movement</div><motion.h1 initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: .1 } } }} className="max-w-5xl text-[clamp(3.8rem,10.4vw,10rem)] font-medium leading-[.84] tracking-[-.085em]"><motion.span variants={{ hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0 } }} className="block">Made with</motion.span><motion.span variants={{ hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0 } }} className="block text-[#d09b50]">intent.</motion.span></motion.h1><div className="mt-12 grid gap-8 sm:grid-cols-[1fr_260px] sm:items-end"><p className="max-w-xl text-base leading-relaxed text-[#f4f0e8]/65 sm:text-lg">Woven apparel manufacturing with the discipline to deliver and the imagination to keep moving forward.</p><div className="flex items-center justify-between border-t border-[#f4f0e8]/20 pt-4 text-[10px] uppercase tracking-[.18em] text-[#f4f0e8]/50"><span>Karachi · Lahore</span><button onClick={() => navigate("about")} className="flex items-center gap-2 text-[#f4f0e8] transition-colors hover:text-[#d09b50]"><ArrowDownRight className="h-4 w-4" /> Explore</button></div></div></div>
      </section>

      <section className="border-b border-[#181a19]/15 bg-[#f3efe7]"><div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-[#181a19]/15 sm:grid-cols-4"><div className="p-6 sm:p-10"><span className="font-mono text-4xl tracking-[-.08em] sm:text-5xl"><Counter value={40} suffix="+" /></span><p className="mt-3 text-[10px] uppercase tracking-[.16em] text-[#827c71]">Years in motion</p></div><div className="p-6 sm:p-10"><span className="font-mono text-4xl tracking-[-.08em] sm:text-5xl"><Counter value={10} suffix="M" /></span><p className="mt-3 text-[10px] uppercase tracking-[.16em] text-[#827c71]">Garments / year</p></div><div className="border-t border-[#181a19]/15 p-6 sm:border-t-0 sm:p-10"><span className="font-mono text-4xl tracking-[-.08em] sm:text-5xl"><Counter value={4000} suffix="+" /></span><p className="mt-3 text-[10px] uppercase tracking-[.16em] text-[#827c71]">People on the floor</p></div><div className="border-t border-[#181a19]/15 p-6 sm:border-t-0 sm:p-10"><span className="font-mono text-4xl tracking-[-.08em] sm:text-5xl"><Counter value={2} /></span><p className="mt-3 text-[10px] uppercase tracking-[.16em] text-[#827c71]">Cities, one standard</p></div></div></section>

      <section id="about" className="mx-auto max-w-[1440px] px-6 py-28 sm:px-12 sm:py-40 lg:px-20"><div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr]"><Reveal><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#b07d29]">01 / The beginning</p><h2 className="mt-6 max-w-md text-5xl font-medium leading-[.93] tracking-[-.07em] sm:text-7xl">The long view is in our fabric.</h2></Reveal><Reveal delay={.15} className="lg:pt-16"><p className="max-w-2xl text-xl leading-[1.4] tracking-[-.025em] sm:text-3xl">Since 1986, Ali Murtaza Associates has been building the quiet infrastructure behind great apparel — from Karachi, to Lahore, to the world.</p><p className="mt-8 max-w-lg leading-relaxed text-[#827c71]">What started as a focused manufacturing operation has grown into a trusted woven apparel partner. We bring together disciplined production, responsible practices and a genuine respect for the people who make every garment possible.</p><PillButton onClick={() => navigate("contact")}>Work with us</PillButton></Reveal></div><div className="mt-24 grid gap-10 lg:grid-cols-[1.1fr_.9fr]"><Reveal className="relative min-h-[420px] overflow-hidden bg-[#c8bca9]"><img src={images.loom} alt="Textile machinery" loading="lazy" className="absolute inset-0 h-full w-full object-cover grayscale mix-blend-multiply opacity-80" /><div className="absolute bottom-6 left-6 flex items-center gap-3 text-[10px] uppercase tracking-[.16em] text-[#f3efe7]"><span className="h-2 w-2 rounded-full bg-[#d09b50]" /> Facility / Karachi</div></Reveal><Reveal delay={.15} className="flex flex-col justify-end"><p className="font-mono text-[11px] leading-relaxed text-[#827c71]">A business that lasts does not chase every change. It learns to tell the difference between noise and progress — and then makes the next considered move.</p><div className="mt-10 grid grid-cols-2 gap-px bg-[#181a19]/15"><div className="bg-[#f3efe7] py-6 pr-4"><span className="font-mono text-3xl">01</span><p className="mt-2 text-[10px] uppercase tracking-[.14em] text-[#827c71]">Karachi / founded</p></div><div className="bg-[#f3efe7] py-6 pl-4"><span className="font-mono text-3xl">07</span><p className="mt-2 text-[10px] uppercase tracking-[.14em] text-[#827c71]">Lahore / opened</p></div></div></Reveal></div></section>

      <section className="bg-[#242522] px-6 py-24 text-[#f4f0e8] sm:px-12 sm:py-32 lg:px-20"><div className="mx-auto max-w-[1440px]"><Reveal><div className="flex items-end justify-between gap-6"><div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#d09b50]">02 / What drives us</p><h2 className="mt-5 max-w-2xl text-5xl font-medium leading-[.92] tracking-[-.07em] sm:text-7xl">The values behind the output.</h2></div><Sparkles className="hidden h-12 w-12 text-[#d09b50] sm:block" /></div></Reveal><div className="mt-20 grid gap-px bg-[#f4f0e8]/15 sm:grid-cols-2 lg:grid-cols-3">{values.map(([num, title, text], i) => <Reveal key={num} delay={i * .05} className="group bg-[#242522] p-7 transition-colors duration-500 hover:bg-[#30312d] sm:p-10"><span className="font-mono text-[10px] text-[#d09b50]">{num}</span><h3 className="mt-16 text-2xl tracking-[-.04em]">{title}</h3><p className="mt-4 text-sm leading-relaxed text-[#f4f0e8]/50">{text}</p><ArrowDownRight className="mt-10 h-5 w-5 text-[#d09b50] opacity-40 transition-all group-hover:translate-x-1 group-hover:translate-y-1 group-hover:opacity-100" /></Reveal>)}</div></div></section>

      <section id="capabilities" className="bg-[#d8d0c1] px-6 py-28 sm:px-12 sm:py-40 lg:px-20"><div className="mx-auto max-w-[1440px]"><div className="grid gap-16 lg:grid-cols-[.7fr_1.3fr]"><Reveal><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#b07d29]">03 / The engine room</p><h2 className="mt-6 max-w-md text-5xl font-medium leading-[.92] tracking-[-.07em] sm:text-7xl">Capability, end to end.</h2></Reveal><Reveal delay={.15} className="lg:pt-16"><p className="max-w-2xl text-xl leading-[1.4] tracking-[-.025em] sm:text-3xl">From the first cut to the last quality check, our systems are designed to keep quality visible.</p></Reveal></div><div className="mt-20 grid gap-8 lg:grid-cols-[1.15fr_.85fr]"><Reveal className="relative min-h-[520px] overflow-hidden bg-[#222421]"><img src={images.production} alt="Apparel production" loading="lazy" className="absolute inset-0 h-full w-full object-cover grayscale opacity-70 transition-transform duration-700 hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#171817] via-transparent to-transparent" /><div className="absolute bottom-8 left-8 right-8 flex items-end justify-between text-[#f4f0e8]"><div><span className="font-mono text-[10px] uppercase tracking-[.18em] text-[#d09b50]">01 — Production</span><h3 className="mt-3 text-3xl tracking-[-.05em]">Built for consistency.</h3></div><Factory className="h-9 w-9 text-[#d09b50]" /></div></Reveal><div className="grid gap-px bg-[#181a19]/15 sm:grid-cols-2 lg:grid-cols-1">{[[Factory, "Washing & dyeing", "Colour, handle and finish — aligned to the brief."], [ShieldCheck, "Quality systems", "Clear checkpoints from raw material to shipment."], [Leaf, "Responsible production", "Smarter use of energy, water and human potential."]].map(([Icon, title, text], i) => <Reveal key={title as string} delay={i * .08} className="group bg-[#d8d0c1] p-8 transition-colors hover:bg-[#c9bfae]"><Icon className="h-6 w-6 text-[#b07d29]" /><h3 className="mt-10 text-xl tracking-[-.04em]">{title as string}</h3><p className="mt-3 max-w-xs text-sm leading-relaxed text-[#827c71]">{text as string}</p><ArrowRight className="mt-8 h-4 w-4 text-[#b07d29] transition-transform group-hover:translate-x-2" /></Reveal>)}</div></div></div></section>

      <section className="bg-[#171817] px-6 py-20 text-[#f4f0e8] sm:px-12 lg:px-20"><div className="mx-auto max-w-[1440px]"><Reveal><div className="mb-10 flex flex-wrap items-center justify-between gap-6"><div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#d09b50]">04 / In the making</p><h2 className="mt-4 text-4xl tracking-[-.06em] sm:text-6xl">See the work in motion.</h2></div><a href="https://vimeo.com/166515666" target="_blank" rel="noreferrer" className="group flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.16em] text-[#f4f0e8]/70 hover:text-[#d09b50]"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f4f0e8]/30 transition-all group-hover:border-[#d09b50] group-hover:bg-[#d09b50] group-hover:text-[#171817]"><Play className="ml-0.5 h-3.5 w-3.5" fill="currentColor" /></span> Watch film</a></div></Reveal><Reveal delay={.1}><div className="aspect-video w-full overflow-hidden bg-[#242522]"><iframe title="Ali Murtaza Associates corporate film" src="https://player.vimeo.com/video/166515666?title=0&byline=0&portrait=0" className="h-full w-full" allow="autoplay; fullscreen; picture-in-picture" /></div></Reveal></div></section>

      <section id="gallery" className="px-6 py-28 sm:px-12 sm:py-40 lg:px-20"><div className="mx-auto max-w-[1440px]"><Reveal><div className="flex flex-wrap items-end justify-between gap-8"><div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#b07d29]">05 / Selected output</p><h2 className="mt-5 text-5xl font-medium tracking-[-.07em] sm:text-7xl">A closer look.</h2></div><p className="max-w-xs text-sm leading-relaxed text-[#827c71]">The material, the movement and the moments where precision becomes product.</p></div></Reveal><div className="mt-20 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{galleryItems.map(([src, category, title], i) => <Reveal key={title} delay={i * .05} className={`${i === 0 ? "sm:row-span-2" : ""}`}><button onClick={() => setSelectedGallery(i)} className="group relative block h-full min-h-[280px] w-full overflow-hidden bg-[#d8d0c1] text-left"><img src={src} alt={title} loading="lazy" className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-t from-[#171817]/75 via-transparent to-transparent opacity-70" /><div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-[#f4f0e8]"><div><span className="font-mono text-[9px] uppercase tracking-[.18em] text-[#d09b50]">{category}</span><p className="mt-1 text-lg tracking-[-.03em]">{title}</p></div><ArrowUpRightIcon /></div></button></Reveal>)}</div></div></section>

      <section className="border-y border-[#181a19]/15 bg-[#c9bfae] px-6 py-24 sm:px-12 sm:py-32 lg:px-20"><div className="mx-auto max-w-[1440px]"><div className="grid gap-16 lg:grid-cols-[.7fr_1.3fr]"><Reveal><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#b07d29]">06 / A living story</p><h2 className="mt-5 text-5xl font-medium leading-[.92] tracking-[-.07em] sm:text-7xl">Built over time.<br />Never standing still.</h2></Reveal><div className="border-l border-[#181a19]/20 pl-6 sm:pl-12">{timeline.map(([year, title, text], i) => <Reveal key={year} delay={i * .08} className="relative border-b border-[#181a19]/15 py-7 first:pt-0 last:border-0"><span className="absolute -left-[29px] top-8 h-2 w-2 rounded-full border border-[#b07d29] bg-[#c9bfae] first:top-1 sm:-left-[53px]" /><span className="font-mono text-[10px] text-[#b07d29]">{year}</span><h3 className="mt-2 text-2xl tracking-[-.04em]">{title}</h3><p className="mt-2 max-w-xl text-sm leading-relaxed text-[#827c71]">{text}</p></Reveal>)}</div></div></div></section>

      <section id="contact" className="bg-[#171817] px-6 py-28 text-[#f4f0e8] sm:px-12 sm:py-40 lg:px-20"><div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[.8fr_1.2fr]"><Reveal><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#d09b50]">07 / Make something</p><h2 className="mt-5 max-w-lg text-6xl font-medium leading-[.88] tracking-[-.08em] sm:text-8xl">Let’s make the next one count.</h2><p className="mt-8 max-w-sm text-sm leading-relaxed text-[#f4f0e8]/50">Tell us what you are building, where you are going and what good looks like. We will take it from there.</p><div className="mt-12 space-y-4 font-mono text-[11px] text-[#f4f0e8]/70"><a href="mailto:info@alimurtaza.com" className="block transition-colors hover:text-[#d09b50]">info@alimurtaza.com</a><span className="block">Karachi / Lahore / Pakistan</span></div></Reveal><Reveal delay={.15}><form onSubmit={e => e.preventDefault()} className="space-y-8"><div className="grid gap-8 sm:grid-cols-2"><label className="block"><span className="font-mono text-[10px] uppercase tracking-[.16em] text-[#d09b50]">Name</span><input className="mt-3 w-full border-b border-[#f4f0e8]/25 bg-transparent py-3 text-lg outline-none transition-colors focus:border-[#d09b50]" placeholder="Your name" /></label><label className="block"><span className="font-mono text-[10px] uppercase tracking-[.16em] text-[#d09b50]">Company</span><input className="mt-3 w-full border-b border-[#f4f0e8]/25 bg-transparent py-3 text-lg outline-none transition-colors focus:border-[#d09b50]" placeholder="Your company" /></label></div><label className="block"><span className="font-mono text-[10px] uppercase tracking-[.16em] text-[#d09b50]">Email</span><input type="email" className="mt-3 w-full border-b border-[#f4f0e8]/25 bg-transparent py-3 text-lg outline-none transition-colors focus:border-[#d09b50]" placeholder="you@company.com" /></label><label className="block"><span className="font-mono text-[10px] uppercase tracking-[.16em] text-[#d09b50]">Project brief</span><textarea rows={3} className="mt-3 w-full resize-none border-b border-[#f4f0e8]/25 bg-transparent py-3 text-lg outline-none transition-colors focus:border-[#d09b50]" placeholder="What are we making together?" /></label><button className="group inline-flex items-center gap-3 rounded-full bg-[#d09b50] px-6 py-3 text-[11px] font-medium uppercase tracking-[.15em] text-[#171817] transition-transform hover:scale-[1.03]">Send enquiry <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button></form></Reveal></div></section>
    </main>
    <footer className="bg-[#171817] px-6 pb-8 text-[#f4f0e8] sm:px-12 lg:px-20"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 border-t border-[#f4f0e8]/15 pt-8 sm:flex-row sm:items-end"><div><Mark dark /><p className="mt-4 font-mono text-[10px] uppercase tracking-[.14em] text-[#f4f0e8]/35">Woven apparel manufacturing<br />Karachi · Lahore · Since 1986</p></div><div className="flex gap-5 font-mono text-[10px] uppercase tracking-[.15em] text-[#f4f0e8]/45"><a href="https://www.alimurtaza.com/" target="_blank" rel="noreferrer" className="hover:text-[#d09b50]">Original site</a><span>© {new Date().getFullYear()} AMA</span></div></div></footer>
    <AnimatePresence>{selectedGallery !== null && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-[#171817]/95 p-5 sm:p-12" onClick={() => setSelectedGallery(null)}><button aria-label="Close gallery" onClick={() => setSelectedGallery(null)} className="absolute right-6 top-6 text-[#f4f0e8] hover:text-[#d09b50]"><X className="h-7 w-7" /></button><motion.img initial={{ scale: .94 }} animate={{ scale: 1 }} src={galleryItems[selectedGallery][0]} alt={galleryItems[selectedGallery][2]} className="max-h-[85vh] max-w-full object-contain" onClick={e => e.stopPropagation()} /></motion.div>}</AnimatePresence>
  </div>;
}

function ArrowUpRightIcon() { return <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#f4f0e8]/30 transition-all group-hover:border-[#d09b50] group-hover:bg-[#d09b50] group-hover:text-[#171817]"><ArrowDownRight className="h-3.5 w-3.5 -rotate-90" /></span>; }
