"use client"

import { useState, useEffect } from "react"
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
  ChevronRight,
  Search,
  Wrench,
  Presentation,
  CheckCircle,
  Mail,
  ExternalLink,
  Menu,
  X,
  Phone,
} from "lucide-react"
import { formatCOP } from "@/lib/utils"
import ContactForm from "./ContactForm"

/* ── Animation variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
}
const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}
const fadeScale = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
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

/* ── Process steps ──────────────────────────────────────────── */
const steps = [
  { icon: Search, num: "01", title: "Diagnóstico", desc: "Entiendo tu contexto, datos y objetivos de negocio." },
  { icon: Wrench, num: "02", title: "Desarrollo", desc: "Construyo la solución con iteraciones y tu feedback constante." },
  { icon: Presentation, num: "03", title: "Entrega", desc: "Producto final con documentación clara y capacitación." },
  { icon: CheckCircle, num: "04", title: "Soporte", desc: "Ajustes post-entrega y acompañamiento por 15 días." },
]

/* ── Skills ──────────────────────────────────────────────────── */
const skills = [
  "Python", "Pandas", "Power BI", "DAX", "SQL",
  "Excel Avanzado", "Google Apps Script", "ISO 9001",
  "HAZOP", "BPM", "Matplotlib", "Plotly",
  "Scikit-learn", "Gestión de Calidad",
]

/* ── Stats ───────────────────────────────────────────────────── */
const stats = [
  { value: "5+", label: "Años de experiencia en datos e industria" },
  { value: "30+", label: "Proyectos de análisis entregados" },
  { value: "100%", label: "Clientes satisfechos con resultados" },
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

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const navLinks = [
    { href: "#sobre-mi", label: "Sobre mí" },
    { href: "#servicios", label: "Servicios" },
    { href: "#proceso", label: "Proceso" },
    { href: "#contacto", label: "Contacto" },
  ]

  return (
    <MotionConfig transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
      <div className="lux-shell">
        {/* ── Scroll Progress ──────────────────────────────────── */}
        <motion.div className="lux-progress" style={{ scaleX: progressScale }} />

        {/* ── Nav ──────────────────────────────────────────────── */}
        <nav className={`lux-nav ${scrolled ? "lux-nav--scrolled" : ""}`}>
          <a href="#" className="lux-brand">
            <span>SB</span>
            <strong>Sebastián Barrera</strong>
          </a>
          <div className="lux-desktop-links">
            {navLinks.map(l => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </div>
          <a href="#contacto" className="lux-nav-cta">Iniciar proyecto</a>
          <button
            className="lux-menu-btn"
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
              className="lux-mobile-panel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="lux-mobile-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <X size={22} />
              </button>
              {navLinks.map(l => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
                  {l.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <main className="lux-main">
          {/* ── Hero ────────────────────────────────────────────── */}
          <section className="lux-hero">
            <div className="lux-hero-bg" />
            {/* Imperial SVG background */}
            <div className="lux-hero-svg-bg" aria-hidden="true">
              <Image src="/assets/imperial-hero.svg" alt="" fill style={{ objectFit: "cover", opacity: 0.35 }} priority />
            </div>
            <motion.div
              className="lux-hero-orb"
              animate={{ rotate: 360 }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="lux-hero-orb2"
              animate={{ rotate: -360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            />

            <div className="lux-hero-content">
              <div className="lux-hero-text">
                <motion.p
                  className="lux-eyebrow"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                >
                  Analista de datos &bull; Inteligencia operativa
                </motion.p>

                <motion.h1
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.35, duration: 0.8 }}
                >
                  Transformo datos en <em>decisiones que elevan</em> tu negocio
                </motion.h1>

                <motion.p
                  className="lux-hero-copy"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                >
                  Dashboards ejecutivos, automatización de procesos, consultoría de calidad ISO
                  y análisis predictivo para empresas que quieren crecer con datos reales.
                </motion.p>

                <motion.div
                  className="lux-hero-actions"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.65 }}
                >
                  <a href="#servicios" className="lux-btn lux-btn-primary">
                    Ver servicios
                    <ArrowRight size={18} />
                  </a>
                  <a href="#contacto" className="lux-btn lux-btn-secondary">
                    Solicitar cotización
                  </a>
                </motion.div>
              </div>

              {/* Dashboard mockup visual */}
              <motion.div
                className="lux-hero-visual"
                variants={fadeScale}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.7, duration: 1 }}
              >
                <div className="lux-dashboard-wrap">
                  <Image
                    src="/assets/dashboard-mockup.svg"
                    alt="Dashboard de análisis de datos ejecutivo con KPIs, gráficos de tendencia y distribución de servicios"
                    width={800}
                    height={560}
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── Sobre mí ──────────────────────────────────────── */}
          <section id="sobre-mi" className="lux-section">
            <motion.div
              className="lux-about-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Left column: Data viz visual */}
              <motion.div variants={fadeUp} className="lux-about-left">
                <span className="lux-about-kicker">Sobre mí</span>
                <motion.div
                  className="lux-about-visual"
                  variants={fadeScale}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <Image
                    src="/assets/data-viz.svg"
                    alt="Red de competencias en análisis de datos: Python, Power BI, SQL, ISO 9001, Excel"
                    width={600}
                    height={600}
                  />
                </motion.div>
              </motion.div>

              <div>
                <motion.div variants={fadeUp}>
                  <div className="lux-section-heading">
                    <h2>Ingeniero químico con visión de datos</h2>
                  </div>
                  <p style={{ color: "var(--lux-muted)", fontSize: "clamp(1rem, 1.4vw, 1.15rem)", lineHeight: 1.75, maxWidth: 640 }}>
                    Soy Johan Sebastián Barrera Bustos. Trabajo como coordinador de laboratorios
                    y me dedico a convertir información cruda en herramientas que impulsan la
                    toma de decisiones en industria, calidad y operaciones. Experiencia sólida
                    en Power BI, Python, automatización y sistemas de gestión ISO 9001.
                  </p>
                </motion.div>

                <motion.div
                  className="lux-stats"
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {stats.map((s, i) => (
                    <motion.div key={i} className="lux-stat" variants={fadeScale}>
                      <strong>{s.value}</strong>
                      <span>{s.label}</span>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className="lux-skills"
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {skills.map(sk => (
                    <motion.span key={sk} className="lux-skill-tag" variants={fadeUp}>
                      {sk}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* ── Servicios ─────────────────────────────────────── */}
          <section id="servicios" className="lux-section lux-services-section">
            {/* Editorial background visual */}
            <div className="lux-services-bg" aria-hidden="true">
              <Image src="/assets/editorial-visual.svg" alt="" fill style={{ objectFit: "cover", opacity: 0.12 }} />
            </div>
            <motion.div
              className="lux-section-heading"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <p className="lux-eyebrow">Lo que hago</p>
              <h2>Servicios especializados en datos y calidad</h2>
            </motion.div>

            <motion.div
              className="lux-services-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {services.map(service => {
                const Icon = iconMap[service.icon] ?? Briefcase
                return (
                  <motion.div key={service.id} className="lux-service-card" variants={fadeUp}>
                    <div className="lux-icon-wrap">
                      <Icon size={22} />
                    </div>
                    <span className="lux-service-price">{service.name}</span>
                    <h3>{service.description.split(".")[0]}</h3>
                    <p>{service.description}</p>
                    <div className="lux-service-price" style={{ marginTop: "auto", paddingTop: 16 }}>
                      Desde {formatCOP(service.price_from)}
                    </div>
                    <a href="#contacto" className="lux-service-link">
                      Solicitar servicio
                      <ChevronRight size={16} />
                    </a>
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

          {/* ── Proceso ───────────────────────────────────────── */}
          <section id="proceso" className="lux-section">
            <motion.div
              className="lux-section-heading"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <p className="lux-eyebrow">Mi método</p>
              <h2>Cómo llevamos tu proyecto al siguiente nivel</h2>
            </motion.div>

            <motion.div
              className="lux-process-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {steps.map(step => (
                <motion.div key={step.num} className="lux-process-card" variants={fadeUp}>
                  <span className="lux-process-num">{step.num}</span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ── CTA + Contact ─────────────────────────────────── */}
          <section id="contacto" className="lux-section lux-cta">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              style={{ display: "grid", placeItems: "center" }}
            >
              <motion.p className="lux-eyebrow" variants={fadeUp}>
                Empecemos
              </motion.p>
              <motion.h2 variants={fadeUp}>
                Hablemos de tu próximo proyecto
              </motion.h2>
              <motion.p
                variants={fadeUp}
                style={{ color: "var(--lux-muted)", fontSize: "clamp(1rem, 1.4vw, 1.15rem)", lineHeight: 1.75, maxWidth: 580, marginTop: 18 }}
              >
                Completa el formulario y te respondo en menos de 24 horas con una propuesta personalizada.
              </motion.p>

              <motion.div className="lux-contact-card" variants={fadeUp}>
                <ContactForm
                  services={services.map(s => ({ id: s.id, name: s.name }))}
                />
              </motion.div>
            </motion.div>
          </section>
        </main>

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer className="lux-footer lux-section">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <p>&copy; {new Date().getFullYear()} Johan Sebastián Barrera Bustos</p>
            <div className="lux-footer-links">
              <a href="mailto:sebastian11201995@gmail.com">
                <Mail size={16} />
                sebastian11201995@gmail.com
              </a>
              <a href="tel:+573108356778">
                <Phone size={16} />
                +57 310 835 6778
              </a>
              <a
                href="https://www.linkedin.com/in/tu-perfil"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={16} />
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  )
}
