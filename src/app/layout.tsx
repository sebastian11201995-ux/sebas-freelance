import type { Metadata } from "next"
import { DM_Sans, Fraunces } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Sebastián Barrera — Analista de Datos & Consultor Freelance",
  description:
    "Transformo datos en decisiones que elevan tu negocio. Dashboards Power BI, automatización Python, consultoría de calidad ISO y análisis predictivo para empresas en Colombia.",
  keywords: [
    "analista de datos",
    "Power BI",
    "freelance Colombia",
    "consultoría calidad",
    "ISO 9001",
    "automatización Excel",
    "dashboards ejecutivos",
    "inteligencia operativa",
    "Python datos",
  ],
  openGraph: {
    title: "Sebastián Barrera — Analista de Datos & Consultor Freelance",
    description:
      "Dashboards ejecutivos, automatización de procesos, consultoría ISO y análisis predictivo para empresas que crecen con datos.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${dmSans.variable} ${fraunces.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
