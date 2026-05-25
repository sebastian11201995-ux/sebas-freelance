"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import {
  motion,
  MotionConfig,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "motion/react"
import {
  BarChart2,
  FileText,
  ShieldCheck,
  Zap,
  AlertTriangle,
  GitBranch,
  Briefcase,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react"
import { formatCOP } from "@/lib/utils"
import ContactForm from "./ContactForm"

/* ── Smooth spring config ─────────────────────────────────────── */
const smoothSpring = { type: "spring" as const, stiffness: 80, damping: 25, mass: 0.8 }
const snappySpring = { type: "spring" as const, stiffness: 120, damping: 20, mass: 0.6 }

/* ── Animation variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 60, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: smoothSpring },
}
const fadeUpFast = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: snappySpring },
}
const stagger = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const staggerSlow = {
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
}
const scaleReveal = {
  hidden: { opacity: 0, scale: 0.88, filter: "blur(12px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { ...smoothSpring, duration: 1.2 } },
}
const slideFromLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: smoothSpring },
}
const slideFromRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: smoothSpring },
}
const cardReveal = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: snappySpring },
}

/* ── Counter hook ───────────────────────────────────────────── */
function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isInView, target, duration])

  return { count, ref }
}

/* ── Parallax section ───────────────────────────────────────── */
function ParallaxBg({ src, speed = 0.3, overlay = 0.7, children, className = "" }: {
  src: string; speed?: number; overlay?: number; children?: React.ReactNode; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"])
  const smoothY = useSpring(y, { stiffness: 50, damping: 30 })

  return (
    <div ref={ref} className={`ed-parallax-section ${className}`} style={{ position: "relative", overflow: "hidden" }}>
      <motion.div className="ed-parallax-img" style={{ y: smoothY }}>
        <Image src={src} alt="" fill style={{ objectFit: "cover" }} quality={85} sizes="100vw" />
      </motion.div>
      <div className="ed-parallax-overlay" style={{ background: `linear-gradient(180deg, rgba(9,8,7,${overlay}) 0%, rgba(9,8,7,${overlay * 0.85}) 40%, rgba(9,8,7,${overlay}) 100%)` }} />
      {children}
    </div>
  )
}

/* ── Icon map ───────────────────────────────────────────────── */
const iconMap: Record<string, React.ElementType> = {
  "bar-chart-2": BarChart2, "file-text": FileText, "shield-check": ShieldCheck,
  zap: Zap, "alert-triangle": AlertTriangle, "git-branch": GitBranch, briefcase: Briefcase,
}

/* ── Data ───────────────────────────────────────────────────── */
const marqueeWords = [
  "Power BI", "Python", "SQL", "Dashboards Ejecutivos", "ISO 9001",
  "Automatización", "Análisis Predictivo", "Excel Avanzado", "HAZOP",
  "Gestión de Calidad", "Apps Script", "Pandas", "Data Viz", "BPM",
  "KPIs Operativos", "ETL", "Reportes Automatizados", "Scikit-learn",
]

const manifiesto = [
  { title: "Datos sin estrategia son ruido.", body: "El 73% de los datos empresariales nunca se analizan. Cada tabla ignorada es una decisión a ciegas, una oportunidad perdida." },
  { title: "La inteligencia no se compra, se construye.", body: "No vendo dashboards bonitos. Construyo sistemas de decisión que conectan la realidad operativa con la acción directiva." },
  { title: "La calidad no es un trámite.", body: "ISO, HAZOP, BPM — son marcos de pensamiento. Cuando los integro con datos, se convierten en ventaja competitiva real." },
  { title: "Tu operación merece claridad.", body: "Cada proceso tiene una historia que contar. Mi trabajo es traducir esa historia en números que cualquier directivo entienda." },
  { title: "Resultados, no entregables.", body: "El éxito no es un PDF de 50 páginas. Es la llamada donde tu gerente dice: 'Ahora sí veo dónde estamos parados.'" },
]

const steps = [
  { num: "01", title: "Inmersión", desc: "Me sumerjo en tu operación, entiendo tus datos, tus dolores y tus objetivos reales de negocio." },
  { num: "02", title: "Diagnóstico", desc: "Audito tus fuentes de datos, identifico brechas y diseño la arquitectura de la solución." },
  { num: "03", title: "Construcción", desc: "Desarrollo iterativo con tu feedback: dashboards, modelos, automatizaciones, lo que necesites." },
  { num: "04", title: "Validación", desc: "Pruebas con datos reales, ajustes finos y documentación clara para tu equipo." },
  { num: "05", title: "Transferencia", desc: "Entrega final con capacitación, soporte post-entrega y acompañamiento por 15 días." },
]

const statsData = [
  { value: 5, suffix: "+", label: "Años en datos e industria" },
  { value: 30, suffix: "+", label: "Proyectos entregados" },
  { value: 100, suffix: "%", label: "Clientes satisfechos" },
  { value: 94, suffix: "%", label: "Eficiencia promedio lograda" },
]

/* ── Stat Counter Component ──────────────────────────────────── */
function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(value, 2200)
  return (
    <motion.div ref={ref} className="ed-stat" variants={cardReveal} whileHover={{ y: -6, borderColor: "rgba(216,170,93,.4)", transition: { duration: 0.25 } }}>
      <strong>{count}{suffix}</strong>
      <span>{label}</span>
    </motion.div>
  )
}

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="currentColor"
    {...props}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const TernaLogo = ({ light = false, height = 24 }: { light?: boolean; height?: number }) => {
  const textColor = light ? "#141312" : "#f5efe1";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, height, userSelect: "none" }}>
      <svg viewBox="0 0 34 38" style={{ height: "100%", width: "auto" }} fill="none">
        {/* Left segment */}
        <rect x="0" y="4" width="10" height="5" fill={textColor} />
        {/* Center segment (Gold) */}
        <rect x="12" y="4" width="10" height="5" fill="#d8aa5d" />
        {/* Right segment */}
        <rect x="24" y="4" width="10" height="5" fill={textColor} />
        {/* Vertical Stem */}
        <rect x="12" y="11" width="10" height="23" fill={textColor} />
      </svg>
      <span style={{
        fontFamily: "var(--font-sans)",
        fontSize: "1.45rem",
        fontWeight: 700,
        color: textColor,
        letterSpacing: "-0.5px",
        lineHeight: 1,
        marginTop: 2
      }}>
        erna
      </span>
    </div>
  );
};

/* ── Types ───────────────────────────────────────────────────── */
interface Service { id: string; name: string; description: string; price_from: number; icon: string }
interface LuxuryLandingProps { services: Service[] }

/* ══════════════════════════════════════════════════════════════ */
export default function LuxuryLanding({ services }: LuxuryLandingProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const progressScale = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 100, damping: 30 })

  // Hero parallax
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroImgY = useTransform(heroProgress, [0, 1], ["0%", "30%"])
  const heroContentY = useTransform(heroProgress, [0, 1], ["0%", "15%"])
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0])
  const smoothHeroImgY = useSpring(heroImgY, { stiffness: 40, damping: 25 })

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const navLinks = [
    { href: "#manifiesto", label: "Manifiesto" },
    { href: "#metodo", label: "Método" },
    { href: "#servicios", label: "Servicios" },
    { href: "#sobre-mi", label: "Nosotros" },
    { href: "#contacto", label: "Contacto" },
  ]

  const romanNumerals = ["I", "II", "III", "IV", "V", "VI"]

  return (
    <MotionConfig transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
      <div className="ed-shell">
        {/* ── Scroll Progress ──────────────────────────────────── */}
        <motion.div className="ed-progress" style={{ scaleX: progressScale }} />

        {/* ── Nav ──────────────────────────────────────────────── */}
        <motion.nav
          className={`ed-nav ${scrolled ? "ed-nav--scrolled" : ""}`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, ...smoothSpring }}
        >
          <a href="#" className="ed-brand">
            <TernaLogo height={26} />
          </a>
          <div className="ed-desktop-links">
            {navLinks.map(l => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </div>
          <a href="#contacto" className="ed-nav-cta">
            <span className="ed-cta-dot" />
            Consulta gratuita
          </a>
          <button className="ed-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">
            <Menu size={22} />
          </button>
        </motion.nav>

        {/* ── Mobile Panel ────────────────────────────────────── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="ed-mobile-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="ed-mobile-inner">
                <button className="ed-mobile-close" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
                  <X size={24} />
                </button>
                <div className="ed-mobile-links">
                  {navLinks.map((l, i) => (
                    <motion.a
                      key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.06, ...snappySpring }}
                    >
                      <span className="ed-mobile-num">0{i + 1}</span>
                      {l.label}
                    </motion.a>
                  ))}
                </div>
                <a href="#contacto" className="ed-nav-cta ed-mobile-cta" onClick={() => setMenuOpen(false)}>
                  <span className="ed-cta-dot" /> Consulta gratuita
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="ed-main">
          {/* ═══ HERO ════════════════════════════════════════════ */}
          <section className="ed-hero" ref={heroRef}>
            <motion.div className="ed-hero-bg" style={{ y: smoothHeroImgY }}>
              <Image src="/assets/hero-office.png" alt="" fill style={{ objectFit: "cover" }} priority quality={90} sizes="100vw" />
            </motion.div>
            <div className="ed-hero-gradient" />

            <motion.div className="ed-hero-inner" style={{ y: heroContentY, opacity: heroOpacity }}>
              <motion.div className="ed-hero-content" initial="hidden" animate="visible" variants={stagger}>
                <motion.div variants={fadeUp} style={{ marginBottom: 16 }}>
                  <TernaLogo height={32} />
                </motion.div>
                <motion.p className="ed-tag" variants={fadeUp}>
                  Analista de datos &bull; Consultor freelance &bull; Bogotá
                </motion.p>

                <motion.h1 className="ed-hero-title" variants={fadeUp}>
                  Datos que mueven<br />
                  <em>la operación.</em>
                </motion.h1>

                <motion.p className="ed-hero-sub" variants={fadeUp}>
                  Dashboards ejecutivos, automatización inteligente y consultoría
                  de calidad ISO para empresas que deciden con datos reales.
                </motion.p>

                <motion.div className="ed-hero-actions" variants={fadeUp}>
                  <a href="#contacto" className="ed-btn ed-btn-gold">
                    Iniciar proyecto <ArrowRight size={18} />
                  </a>
                  <a href="#servicios" className="ed-btn ed-btn-ghost">
                    Ver servicios
                  </a>
                </motion.div>
              </motion.div>

              {/* Dashboard visual with floating animation */}
              <motion.div
                className="ed-hero-visual"
                initial={{ opacity: 0, scale: 0.85, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="ed-dashboard-frame"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/assets/dashboard-photo.png"
                    alt="Dashboard ejecutivo de análisis de datos"
                    width={800} height={560} priority
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="ed-scroll-hint"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <div className="ed-scroll-line" />
              <span>Scroll</span>
            </motion.div>
          </section>

          {/* ═══ MARQUEE ═════════════════════════════════════════ */}
          <div className="ed-marquee-section">
            <div className="ed-marquee-track">
              {[...marqueeWords, ...marqueeWords].map((word, i) => (
                <span key={i} className="ed-marquee-word">
                  {word}<span className="ed-marquee-sep">&mdash;</span>
                </span>
              ))}
            </div>
          </div>

          {/* ═══ 001 MANIFIESTO ══════════════════════════════════ */}
          <ParallaxBg src="/assets/glass-office.png" speed={0.3} overlay={0.88}>
            <section id="manifiesto" className="ed-section ed-manifiesto" style={{ position: "relative", zIndex: 2 }}>
              <motion.div className="ed-section-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                <span className="ed-num">001</span>
                <span className="ed-label-text">Manifiesto</span>
                <div className="ed-label-line" />
              </motion.div>

              <motion.h2 className="ed-section-title" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                Lo que creo.<br />Lo que defiendo.
              </motion.h2>

              <motion.div className="ed-manifiesto-grid" variants={staggerSlow} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
                {manifiesto.map((item, i) => (
                  <motion.div key={i} className="ed-manifiesto-col" variants={cardReveal}>
                    <span className="ed-manifiesto-num">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          </ParallaxBg>

          {/* ═══ 02 MÉTODO ═══════════════════════════════════════ */}
          <section id="metodo" className="ed-section ed-metodo">
            <motion.div className="ed-section-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <span className="ed-num">02</span>
              <span className="ed-label-text">Método</span>
              <div className="ed-label-line" />
            </motion.div>

            <div className="ed-metodo-layout">
              <motion.div className="ed-metodo-text" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
                <motion.h2 className="ed-section-title" variants={fadeUp}>
                  Cinco pasos.<br />Cero improvisación.
                </motion.h2>

                <div className="ed-steps-list">
                  {steps.map((step, i) => (
                    <motion.div
                      key={step.num} className="ed-step" variants={fadeUpFast}
                      whileHover={{ x: 8, transition: { duration: 0.2 } }}
                    >
                      <div className="ed-step-num">{step.num}</div>
                      <div className="ed-step-content">
                        <h3>{step.title}</h3>
                        <p>{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="ed-metodo-visual" variants={scaleReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                <div className="ed-viz-frame">
                  <Image src="/assets/boardroom.png" alt="Reunión de equipo ejecutivo" width={700} height={500} style={{ borderRadius: 20 }} />
                </div>
              </motion.div>
            </div>
          </section>

          {/* ═══ 03 SERVICIOS ════════════════════════════════════ */}
          <ParallaxBg src="/assets/blueprints.png" speed={0.25} overlay={0.92}>
            <section id="servicios" className="ed-section ed-servicios" style={{ position: "relative", zIndex: 2 }}>
              <motion.div className="ed-section-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                <span className="ed-num">03</span>
                <span className="ed-label-text">Servicios</span>
                <div className="ed-label-line" />
              </motion.div>

              <motion.h2 className="ed-section-title" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                Soluciones que transforman<br />operaciones reales.
              </motion.h2>

              <motion.div className="ed-services-grid" variants={staggerSlow} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}>
                {services.map((service, i) => {
                  const Icon = iconMap[service.icon] ?? Briefcase
                  return (
                    <motion.div
                      key={service.id} className="ed-service-card" variants={cardReveal}
                      whileHover={{ y: -14, borderColor: "rgba(216,170,93,.4)", transition: { type: "spring", stiffness: 300, damping: 20 } }}
                    >
                      <div className="ed-service-header">
                        <span className="ed-service-roman">{romanNumerals[i] || romanNumerals[0]}</span>
                        <motion.div className="ed-service-icon" whileHover={{ rotate: 15, scale: 1.15 }} transition={{ type: "spring", stiffness: 300 }}>
                          <Icon size={20} />
                        </motion.div>
                      </div>
                      <h3>{service.name}</h3>
                      <p>{service.description}</p>
                      <div className="ed-service-footer">
                        <span className="ed-service-price">Desde {formatCOP(service.price_from)}</span>
                        <a href="#contacto" className="ed-service-cta">
                          Solicitar <ArrowUpRight size={16} />
                        </a>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>

              {services.length === 0 && (
                <p style={{ textAlign: "center", color: "var(--lux-muted)", marginTop: 40 }}>
                  Los servicios se cargarán cuando Supabase esté configurado.
                </p>
              )}
            </section>
          </ParallaxBg>

          {/* ═══ 04 EL EQUIPO ════════════════════════════════════ */}
          <section id="sobre-mi" className="ed-section ed-about">
            <motion.div className="ed-section-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <span className="ed-num">04</span>
              <span className="ed-label-text">Nosotros</span>
              <div className="ed-label-line" />
            </motion.div>

            <div className="ed-about-layout" style={{ display: "block" }}>
              <motion.div className="ed-about-text" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} style={{ width: "100%", maxWidth: "100%", marginBottom: 40 }}>
                <motion.div variants={fadeUp} style={{ marginBottom: 12 }}>
                  <TernaLogo height={28} />
                </motion.div>
                <motion.h2 className="ed-section-title" variants={fadeUp}>
                  Ingeniería Química<br /><em>& Inteligencia Operativa.</em>
                </motion.h2>
                <motion.p className="ed-about-bio" variants={fadeUp} style={{ maxWidth: 800 }}>
                  Somos **Terna**, una firma de consultoría integrada por ingenieros químicos apasionados por la analítica de datos, el aseguramiento de calidad y la optimización industrial. Combinamos nuestro rigor técnico con herramientas modernas para transformar la operación de tu negocio.
                </motion.p>
              </motion.div>

              <motion.div className="ed-team-grid" variants={staggerSlow} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
                {/* Integrante 1: Sebastián */}
                <motion.div className="ed-team-card" variants={cardReveal}>
                  <div className="ed-team-avatar-wrap">
                    <div className="ed-team-avatar">SB</div>
                  </div>
                  <h3>Sebastián Barrera</h3>
                  <div className="ed-team-role">Lead Analyst & Quality Consultant</div>
                  <p className="ed-team-bio">
                    Ingeniero Químico con más de 10 años de experiencia integrando análisis de datos en entornos de alta exigencia. Especialista en Power BI, Python, SQL y MATLAB. Lidera el diseño de dashboards ejecutivos, modelos estadísticos y sistemas de gestión de calidad ISO 9001.
                  </p>
                  <div className="ed-team-skills">
                    <span className="ed-team-skill-badge">Power BI</span>
                    <span className="ed-team-skill-badge">Python</span>
                    <span className="ed-team-skill-badge">SQL</span>
                    <span className="ed-team-skill-badge">ISO 9001</span>
                    <span className="ed-team-skill-badge">MATLAB</span>
                  </div>
                  <div className="ed-team-contacts">
                    <a href="mailto:sebastian11201995@gmail.com" className="ed-team-contact-btn" title="Enviar correo">
                      <Mail size={16} />
                    </a>
                    <a href="https://wa.me/573108356778?text=Hola%20Sebasti%C3%A1n,%20vi%20tu%20perfil%20en%20Terna%20y%20me%20gustar%C3%ADa%20ponerme%20en%20contacto." target="_blank" rel="noopener noreferrer" className="ed-team-contact-btn" title="Chatear por WhatsApp">
                      <WhatsAppIcon style={{ width: 16, height: 16 }} />
                    </a>
                  </div>
                </motion.div>

                {/* Integrante 2: Danilo */}
                <motion.div className="ed-team-card" variants={cardReveal}>
                  <div className="ed-team-avatar-wrap">
                    <div className="ed-team-avatar">DM</div>
                  </div>
                  <h3>Danilo Medina</h3>
                  <div className="ed-team-role">QA & Metrology Engineer</div>
                  <p className="ed-team-bio">
                    Ingeniero Químico con formación en metrología y procesos químicos industriales. Amplia experiencia en control y aseguramiento de calidad en plantas de producción, verificación de materias primas, análisis fisicoquímicos e implementación de Buenas Prácticas de Manufactura (BPM).
                  </p>
                  <div className="ed-team-skills">
                    <span className="ed-team-skill-badge">Metrología</span>
                    <span className="ed-team-skill-badge">QA Plantas</span>
                    <span className="ed-team-skill-badge">BPM</span>
                    <span className="ed-team-skill-badge">Fisicoquímica</span>
                  </div>
                  <div className="ed-team-contacts">
                    <a href="mailto:danimed240@mail.com" className="ed-team-contact-btn" title="Enviar correo">
                      <Mail size={16} />
                    </a>
                    <a href="https://wa.me/573108356778?text=Hola%20Sebasti%C3%A1n,%20vi%20el%20perfil%20de%20Danilo%20en%20Terna%20y%20me%20gustar%C3%ADa%20ponerme%20en%20contacto." target="_blank" rel="noopener noreferrer" className="ed-team-contact-btn" title="Chatear por WhatsApp">
                      <WhatsAppIcon style={{ width: 16, height: 16 }} />
                    </a>
                  </div>
                </motion.div>

                {/* Integrante 3: María Fernanda */}
                <motion.div className="ed-team-card" variants={cardReveal}>
                  <div className="ed-team-avatar-wrap">
                    <div className="ed-team-avatar">MF</div>
                  </div>
                  <h3>María Fernanda Fuentes</h3>
                  <div className="ed-team-role">Biotech & Product Innovation</div>
                  <p className="ed-team-bio">
                    Ingeniera Química especializada en procesos microbiológicos e industriales. Experta en diseño y formulación de productos cosméticos de innovación ecofriendly con Análisis de Ciclo de Vida (ACV), trazabilidad de estabilidad, calificación de equipos, calibración, BPM y registros INVIMA.
                  </p>
                  <div className="ed-team-skills">
                    <span className="ed-team-skill-badge">Cosmética</span>
                    <span className="ed-team-skill-badge">Ciclo de Vida (ACV)</span>
                    <span className="ed-team-skill-badge">INVIMA</span>
                    <span className="ed-team-skill-badge">BPM</span>
                  </div>
                  <div className="ed-team-contacts">
                    <a href="https://wa.me/573108356778?text=Hola%20Sebasti%C3%A1n,%20vi%20el%20perfil%20de%20Mar%C3%ADa%20Fernanda%20en%20Terna%20y%20me%20gustar%C3%ADa%20ponerme%20en%20contacto." target="_blank" rel="noopener noreferrer" className="ed-team-contact-btn" title="Chatear por WhatsApp">
                      <WhatsAppIcon style={{ width: 16, height: 16 }} />
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ═══ 05 RESULTS (cinematic break) ════════════════════ */}
          <ParallaxBg src="/assets/penthouse.png" speed={0.4} overlay={0.6} className="ed-results-wrap">
            <section className="ed-section ed-results" style={{ position: "relative", zIndex: 2 }}>
              <motion.div className="ed-results-content" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                <motion.div className="ed-section-label ed-section-label--light" variants={fadeUp}>
                  <span className="ed-num">05</span>
                  <span className="ed-label-text">Resultados</span>
                </motion.div>
                <motion.div variants={fadeUp} style={{ marginBottom: 20 }}>
                  <TernaLogo height={34} />
                </motion.div>

                <motion.h2 className="ed-results-title" variants={fadeUp}>
                  No es improvisar.
                </motion.h2>
                <motion.h2 className="ed-results-title ed-results-title--gold" variants={fadeUp}>
                  Es decidir con datos.
                </motion.h2>
                <motion.p className="ed-results-copy" variants={fadeUp}>
                  Cada dashboard, cada automatización, cada sistema de calidad que construyo
                  tiene un solo propósito: que tu equipo deje de adivinar y empiece a decidir.
                  Resultados medibles, impacto real, cero humo.
                </motion.p>
                <motion.a
                  href="#contacto" className="ed-btn ed-btn-gold"
                  variants={fadeUp}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(216,170,93,.35)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Hablemos de tu proyecto <ArrowRight size={18} />
                </motion.a>
              </motion.div>
            </section>
          </ParallaxBg>

          {/* ═══ CONTACTO ════════════════════════════════════════ */}
          <ParallaxBg src="/assets/luxury-hall.png" speed={0.2} overlay={0.85}>
            <section id="contacto" className="ed-section ed-contact" style={{ position: "relative", zIndex: 2 }}>
              <motion.div className="ed-section-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                <span className="ed-num">06</span>
                <span className="ed-label-text">Contacto</span>
                <div className="ed-label-line" />
              </motion.div>

              <div className="ed-contact-layout">
                <motion.div className="ed-contact-text" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                  <motion.h2 className="ed-section-title" variants={fadeUp}>
                    Hablemos de tu<br />próximo proyecto.
                  </motion.h2>
                  <motion.p className="ed-contact-sub" variants={fadeUp}>
                    Completa el formulario y te respondo en menos de 24 horas
                    con una propuesta personalizada. Sin compromiso.
                  </motion.p>
                  <motion.div className="ed-contact-info" variants={fadeUp}>
                    <a href="mailto:sebastian11201995@gmail.com"><Mail size={18} /> sebastian11201995@gmail.com</a>
                    <a href="tel:+573108356778"><Phone size={18} /> +57 310 835 6778</a>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="ed-contact-form-wrap"
                  variants={slideFromRight} initial="hidden" whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  <ContactForm services={services.map(s => ({ id: s.id, name: s.name }))} />
                </motion.div>
              </div>
            </section>
          </ParallaxBg>
        </main>

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer className="ed-footer">
          <div className="ed-footer-inner">
            <div className="ed-footer-brand" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <TernaLogo height={28} />
              <span style={{ fontSize: "0.85rem", opacity: 0.7, color: "var(--lux-marfil)" }}>
                Consultoría en Analítica & Calidad de Procesos
              </span>
            </div>
            <div className="ed-footer-links">
              {navLinks.map(l => (<a key={l.href} href={l.href}>{l.label}</a>))}
            </div>
            <div className="ed-footer-contact">
              <a href="mailto:sebastian11201995@gmail.com"><Mail size={15} /> Email</a>
              <a href="tel:+573108356778"><Phone size={15} /> Teléfono</a>
              <a href="https://www.linkedin.com/in/johan-sebasti%C3%A1n-barrera-bustos-71166a185/" target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> LinkedIn</a>
            </div>
          </div>
          <div className="ed-footer-bottom">
            <p>&copy; {new Date().getFullYear()} Terna. Todos los derechos reservados.</p>
          </div>
        </footer>

        {/* Floating WhatsApp Badge */}
        <motion.a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "573108356778"}?text=Hola%20Ing.%20Sebasti%C3%A1n%20Barrera,%20visit%C3%A9%20su%20sitio%20web%20y%20me%20gustar%C3%ADa%20solicitar%20informaci%C3%B3n%20sobre%20sus%20servicios%20de%20consultor%C3%ADa%20en%20anal%C3%ADtica%20de%20datos%20y%20optimizaci%C3%B3n%20de%20procesos.%20Saludos.`}
          target="_blank"
          rel="noopener noreferrer"
          className="ed-whatsapp-float"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="ed-whatsapp-pulse" />
          <span className="ed-whatsapp-icon-wrapper">
            <WhatsAppIcon />
          </span>
          <span>¿Hablamos?</span>
        </motion.a>
      </div>
    </MotionConfig>
  )
}
