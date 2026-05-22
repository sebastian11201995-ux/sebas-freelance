"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import {
  motion,
  MotionConfig,
  useScroll,
  useTransform,
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
  ChevronRight,
  Menu,
  X,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react"
import { formatCOP } from "@/lib/utils"
import ContactForm from "./ContactForm"

/* ── Animation variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}
const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
}
const fadeScale = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1 },
}
const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
}
const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
}

/* ── Icon map ───────────────────────────────────────────────── */
const iconMap: Record<string, React.ElementType> = {
  "bar-chart-2": BarChart2,
  "file-text": FileText,
  "shield-check": ShieldCheck,
  zap: Zap,
  "alert-triangle": AlertTriangle,
  "git-branch": GitBranch,
  briefcase: Briefcase,
}

/* ── Marquee keywords ──────────────────────────────────────── */
const marqueeWords = [
  "Power BI", "Python", "SQL", "Dashboards Ejecutivos", "ISO 9001",
  "Automatización", "Análisis Predictivo", "Excel Avanzado", "HAZOP",
  "Gestión de Calidad", "Apps Script", "Pandas", "Data Viz", "BPM",
  "KPIs Operativos", "ETL", "Reportes Automatizados", "Scikit-learn",
]

/* ── Manifiesto columns ────────────────────────────────────── */
const manifiesto = [
  {
    title: "Datos sin estrategia son ruido.",
    body: "El 73% de los datos empresariales nunca se analizan. Cada tabla ignorada es una decisión a ciegas, una oportunidad perdida, un riesgo invisible.",
  },
  {
    title: "La inteligencia no se compra, se construye.",
    body: "No vendo dashboards bonitos. Construyo sistemas de decisión que conectan la realidad operativa con la acción directiva. Eso cambia resultados.",
  },
  {
    title: "La calidad no es un trámite.",
    body: "ISO, HAZOP, BPM — son marcos de pensamiento, no carpetas de auditores. Cuando los integro con datos, se convierten en ventaja competitiva real.",
  },
  {
    title: "Tu operación merece claridad.",
    body: "Cada proceso tiene una historia que contar. Mi trabajo es traducir esa historia en números que cualquier directivo entienda y pueda usar mañana.",
  },
  {
    title: "Resultados, no entregables.",
    body: "El éxito no es un PDF de 50 páginas. Es la llamada donde tu gerente dice: 'Ahora sí veo dónde estamos parados.' Eso es lo que entrego.",
  },
]

/* ── Process steps ──────────────────────────────────────────── */
const steps = [
  { num: "01", title: "Inmersión", desc: "Me sumerjo en tu operación, entiendo tus datos, tus dolores y tus objetivos reales de negocio." },
  { num: "02", title: "Diagnóstico", desc: "Audito tus fuentes de datos, identifico brechas y diseño la arquitectura de la solución." },
  { num: "03", title: "Construcción", desc: "Desarrollo iterativo con tu feedback: dashboards, modelos, automatizaciones, lo que necesites." },
  { num: "04", title: "Validación", desc: "Pruebas con datos reales, ajustes finos y documentación clara para tu equipo." },
  { num: "05", title: "Transferencia", desc: "Entrega final con capacitación, soporte post-entrega y acompañamiento por 15 días." },
]

/* ── Stats ───────────────────────────────────────────────────── */
const stats = [
  { value: "5+", label: "Años en datos e industria" },
  { value: "30+", label: "Proyectos entregados" },
  { value: "100%", label: "Clientes satisfechos" },
  { value: "94%", label: "Eficiencia promedio lograda" },
]

/* ── Types ───────────────────────────────────────────────────── */
interface Service {
  id: string
  name: string
  description: string
  price_from: number
  icon: string
}

interface LuxuryLandingProps {
  services: Service[]
}

/* ══════════════════════════════════════════════════════════════ */
export default function LuxuryLanding({ services }: LuxuryLandingProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1])
  const marqueeRef = useRef<HTMLDivElement>(null)

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
    { href: "#sobre-mi", label: "Sobre mí" },
    { href: "#contacto", label: "Contacto" },
  ]

  const romanNumerals = ["I", "II", "III", "IV", "V", "VI"]

  return (
    <MotionConfig transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
      <div className="ed-shell">
        {/* ── Scroll Progress ──────────────────────────────────── */}
        <motion.div className="ed-progress" style={{ scaleX: progressScale }} />

        {/* ── Nav ──────────────────────────────────────────────── */}
        <nav className={`ed-nav ${scrolled ? "ed-nav--scrolled" : ""}`}>
          <a href="#" className="ed-brand">
            <span className="ed-brand-mark">SB</span>
            <strong>Sebastián Barrera</strong>
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
          <button
            className="ed-menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
        </nav>

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
                <button
                  className="ed-mobile-close"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Cerrar menú"
                >
                  <X size={24} />
                </button>
                <div className="ed-mobile-links">
                  {navLinks.map((l, i) => (
                    <motion.a
                      key={l.href}
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                    >
                      <span className="ed-mobile-num">0{i + 1}</span>
                      {l.label}
                    </motion.a>
                  ))}
                </div>
                <a href="#contacto" className="ed-nav-cta ed-mobile-cta" onClick={() => setMenuOpen(false)}>
                  <span className="ed-cta-dot" />
                  Consulta gratuita
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="ed-main">
          {/* ═══ HERO ════════════════════════════════════════════ */}
          <section className="ed-hero">
            <div className="ed-hero-bg">
              <Image src="/assets/imperial-hero.svg" alt="" fill style={{ objectFit: "cover", opacity: 0.3 }} priority />
              <div className="ed-hero-gradient" />
            </div>

            <div className="ed-hero-inner">
              <motion.div
                className="ed-hero-content"
                initial="hidden"
                animate="visible"
                variants={stagger}
              >
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
                    Iniciar proyecto
                    <ArrowRight size={18} />
                  </a>
                  <a href="#servicios" className="ed-btn ed-btn-ghost">
                    Ver servicios
                  </a>
                </motion.div>
              </motion.div>

              {/* Dashboard visual */}
              <motion.div
                className="ed-hero-visual"
                variants={fadeScale}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5, duration: 1.1 }}
              >
                <div className="ed-dashboard-frame">
                  <Image
                    src="/assets/dashboard-mockup.svg"
                    alt="Dashboard ejecutivo de análisis de datos con KPIs, gráficos de tendencia y distribución de servicios"
                    width={800}
                    height={560}
                    priority
                  />
                </div>
              </motion.div>
            </div>

            {/* Scroll hint */}
            <motion.div
              className="ed-scroll-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div className="ed-scroll-line" />
              <span>Scroll</span>
            </motion.div>
          </section>

          {/* ═══ MARQUEE ═════════════════════════════════════════ */}
          <div className="ed-marquee-section">
            <div className="ed-marquee-track" ref={marqueeRef}>
              {[...marqueeWords, ...marqueeWords].map((word, i) => (
                <span key={i} className="ed-marquee-word">
                  {word}
                  <span className="ed-marquee-sep">&mdash;</span>
                </span>
              ))}
            </div>
          </div>

          {/* ═══ 001 MANIFIESTO ══════════════════════════════════ */}
          <section id="manifiesto" className="ed-section ed-manifiesto">
            <motion.div
              className="ed-section-label"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <span className="ed-num">001</span>
              <span className="ed-label-text">Manifiesto</span>
              <div className="ed-label-line" />
            </motion.div>

            <motion.h2
              className="ed-section-title"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              Lo que creo.<br />Lo que defiendo.
            </motion.h2>

            <motion.div
              className="ed-manifiesto-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {manifiesto.map((item, i) => (
                <motion.div key={i} className="ed-manifiesto-col" variants={fadeUp}>
                  <span className="ed-manifiesto-num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ═══ 02 MÉTODO ═══════════════════════════════════════ */}
          <section id="metodo" className="ed-section ed-metodo">
            <motion.div
              className="ed-section-label"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <span className="ed-num">02</span>
              <span className="ed-label-text">Método</span>
              <div className="ed-label-line" />
            </motion.div>

            <div className="ed-metodo-layout">
              <motion.div
                className="ed-metodo-text"
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
              >
                <motion.h2 className="ed-section-title" variants={fadeUp}>
                  Cinco pasos.<br />Cero improvisación.
                </motion.h2>

                <div className="ed-steps-list">
                  {steps.map((step, i) => (
                    <motion.div key={step.num} className="ed-step" variants={fadeUp}>
                      <div className="ed-step-num">{step.num}</div>
                      <div className="ed-step-content">
                        <h3>{step.title}</h3>
                        <p>{step.desc}</p>
                      </div>
                      {i < steps.length - 1 && <div className="ed-step-connector" />}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Data Viz visual */}
              <motion.div
                className="ed-metodo-visual"
                variants={slideRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="ed-viz-frame">
                  <Image
                    src="/assets/data-viz.svg"
                    alt="Red de competencias: Python, Power BI, SQL, ISO 9001, Excel, HAZOP, BPM"
                    width={600}
                    height={600}
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* ═══ 03 SERVICIOS ════════════════════════════════════ */}
          <section id="servicios" className="ed-section ed-servicios">
            <div className="ed-services-bg" aria-hidden="true">
              <Image src="/assets/editorial-visual.svg" alt="" fill style={{ objectFit: "cover", opacity: 0.1 }} />
            </div>

            <motion.div
              className="ed-section-label"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <span className="ed-num">03</span>
              <span className="ed-label-text">Servicios</span>
              <div className="ed-label-line" />
            </motion.div>

            <motion.h2
              className="ed-section-title"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              Soluciones que transforman<br />operaciones reales.
            </motion.h2>

            <motion.div
              className="ed-services-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {services.map((service, i) => {
                const Icon = iconMap[service.icon] ?? Briefcase
                return (
                  <motion.div key={service.id} className="ed-service-card" variants={fadeUp}>
                    <div className="ed-service-header">
                      <span className="ed-service-roman">{romanNumerals[i] || romanNumerals[0]}</span>
                      <div className="ed-service-icon">
                        <Icon size={20} />
                      </div>
                    </div>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <div className="ed-service-footer">
                      <span className="ed-service-price">
                        Desde {formatCOP(service.price_from)}
                      </span>
                      <a href="#contacto" className="ed-service-cta">
                        Solicitar
                        <ArrowUpRight size={16} />
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

          {/* ═══ 04 SOBRE MÍ ════════════════════════════════════ */}
          <section id="sobre-mi" className="ed-section ed-about">
            <motion.div
              className="ed-section-label"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <span className="ed-num">04</span>
              <span className="ed-label-text">Sobre mí</span>
              <div className="ed-label-line" />
            </motion.div>

            <div className="ed-about-layout">
              <motion.div
                className="ed-about-text"
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
              >
                <motion.h2 className="ed-section-title" variants={fadeUp}>
                  Ingeniero químico<br />con visión de datos.
                </motion.h2>
                <motion.p className="ed-about-bio" variants={fadeUp}>
                  Soy Johan Sebastián Barrera Bustos. Trabajo como coordinador de
                  laboratorios y me dedico a convertir información cruda en herramientas
                  que impulsan la toma de decisiones en industria, calidad y operaciones.
                </motion.p>
                <motion.p className="ed-about-bio" variants={fadeUp}>
                  Experiencia sólida en Power BI, Python, automatización y sistemas de
                  gestión ISO 9001. Cada proyecto que tomo es una oportunidad de demostrar
                  que los datos bien usados cambian resultados.
                </motion.p>

                {/* Stats row */}
                <motion.div
                  className="ed-stats-row"
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {stats.map((s, i) => (
                    <motion.div key={i} className="ed-stat" variants={fadeUp}>
                      <strong>{s.value}</strong>
                      <span>{s.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Dashboard visual in about section */}
              <motion.div
                className="ed-about-visual"
                variants={slideRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="ed-about-dashboard">
                  <Image
                    src="/assets/dashboard-mockup.svg"
                    alt="Dashboard profesional de análisis de datos"
                    width={800}
                    height={560}
                  />
                </div>
                <div className="ed-about-dataviz">
                  <Image
                    src="/assets/data-viz.svg"
                    alt="Red de herramientas de análisis"
                    width={600}
                    height={600}
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* ═══ 05 RESULTADOS (cinematic break) ════════════════ */}
          <section className="ed-section ed-results">
            <div className="ed-results-bg">
              <Image src="/assets/imperial-hero.svg" alt="" fill style={{ objectFit: "cover", opacity: 0.25 }} />
              <div className="ed-results-overlay" />
            </div>

            <motion.div
              className="ed-results-content"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div className="ed-section-label ed-section-label--light" variants={fadeUp}>
                <span className="ed-num">05</span>
                <span className="ed-label-text">Resultados</span>
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
              <motion.a href="#contacto" className="ed-btn ed-btn-gold" variants={fadeUp}>
                Hablemos de tu proyecto
                <ArrowRight size={18} />
              </motion.a>
            </motion.div>
          </section>

          {/* ═══ CONTACTO ════════════════════════════════════════ */}
          <section id="contacto" className="ed-section ed-contact">
            <motion.div
              className="ed-section-label"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <span className="ed-num">06</span>
              <span className="ed-label-text">Contacto</span>
              <div className="ed-label-line" />
            </motion.div>

            <div className="ed-contact-layout">
              <motion.div
                className="ed-contact-text"
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <motion.h2 className="ed-section-title" variants={fadeUp}>
                  Hablemos de tu<br />próximo proyecto.
                </motion.h2>
                <motion.p className="ed-contact-sub" variants={fadeUp}>
                  Completa el formulario y te respondo en menos de 24 horas
                  con una propuesta personalizada. Sin compromiso.
                </motion.p>

                <motion.div className="ed-contact-info" variants={fadeUp}>
                  <a href="mailto:sebastian11201995@gmail.com">
                    <Mail size={18} />
                    sebastian11201995@gmail.com
                  </a>
                  <a href="tel:+573108356778">
                    <Phone size={18} />
                    +57 310 835 6778
                  </a>
                </motion.div>
              </motion.div>

              <motion.div
                className="ed-contact-form-wrap"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                <ContactForm
                  services={services.map(s => ({ id: s.id, name: s.name }))}
                />
              </motion.div>
            </div>
          </section>
        </main>

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer className="ed-footer">
          <div className="ed-footer-inner">
            <div className="ed-footer-brand">
              <span className="ed-brand-mark">SB</span>
              <div>
                <strong>Sebastián Barrera</strong>
                <span>Analista de datos & Consultor freelance</span>
              </div>
            </div>

            <div className="ed-footer-links">
              {navLinks.map(l => (
                <a key={l.href} href={l.href}>{l.label}</a>
              ))}
            </div>

            <div className="ed-footer-contact">
              <a href="mailto:sebastian11201995@gmail.com">
                <Mail size={15} />
                Email
              </a>
              <a href="tel:+573108356778">
                <Phone size={15} />
                Teléfono
              </a>
              <a href="https://www.linkedin.com/in/tu-perfil" target="_blank" rel="noopener noreferrer">
                <ExternalLink size={15} />
                LinkedIn
              </a>
            </div>
          </div>

          <div className="ed-footer-bottom">
            <p>&copy; {new Date().getFullYear()} Johan Sebastián Barrera Bustos. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </MotionConfig>
  )
}
