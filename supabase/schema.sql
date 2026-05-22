-- ═══════════════════════════════════════════════════════════════════
-- SCHEMA COMPLETO — PROYECTO FREELANCE SEBAS BARRERA
-- Ejecutar en: Supabase → SQL Editor → New query → Paste → Run
-- ═══════════════════════════════════════════════════════════════════

-- ─── TABLA: services ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.services (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  description  text        NOT NULL,
  price_from   integer     NOT NULL,
  icon         text        DEFAULT 'briefcase',
  active       boolean     DEFAULT true,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- ─── TABLA: contact_requests ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text        NOT NULL,
  email            text        NOT NULL,
  company          text,
  service_interest text,
  message          text        NOT NULL,
  status           text        DEFAULT 'nueva'
                               CHECK (status IN ('nueva','en_revision','respondida','cerrada')),
  is_read          boolean     DEFAULT false,
  admin_note       text,
  ip_hash          text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- ─── TABLA: rate_limit_log ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.rate_limit_log (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash    text        NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ─── ÍNDICES ────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_contact_requests_status   ON public.contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_requests_is_read  ON public.contact_requests(is_read);
CREATE INDEX IF NOT EXISTS idx_contact_requests_created  ON public.contact_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limit_ip_hash        ON public.rate_limit_log(ip_hash);
CREATE INDEX IF NOT EXISTS idx_rate_limit_created        ON public.rate_limit_log(created_at DESC);

-- ─── FUNCIÓN: updated_at automático ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_contact_requests_updated_at
  BEFORE UPDATE ON public.contact_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ═══════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE public.services          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limit_log    ENABLE ROW LEVEL SECURITY;

-- ─── POLÍTICAS: services ────────────────────────────────────────────

CREATE POLICY "services_public_read"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "services_owner_read_all"
  ON public.services
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = current_setting('app.owner_email', true)
  );

CREATE POLICY "services_owner_insert"
  ON public.services
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' = current_setting('app.owner_email', true)
  );

CREATE POLICY "services_owner_update"
  ON public.services
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = current_setting('app.owner_email', true)
  );

CREATE POLICY "services_owner_delete"
  ON public.services
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = current_setting('app.owner_email', true)
  );

-- ─── POLÍTICAS: contact_requests ────────────────────────────────────

CREATE POLICY "contact_requests_public_insert"
  ON public.contact_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "contact_requests_owner_read"
  ON public.contact_requests
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = current_setting('app.owner_email', true)
  );

CREATE POLICY "contact_requests_owner_update"
  ON public.contact_requests
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = current_setting('app.owner_email', true)
  );

CREATE POLICY "contact_requests_owner_delete"
  ON public.contact_requests
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = current_setting('app.owner_email', true)
  );

-- ─── POLÍTICAS: rate_limit_log ───────────────────────────────────────

CREATE POLICY "rate_limit_deny_all_direct"
  ON public.rate_limit_log
  FOR ALL
  TO anon, authenticated
  USING (false);

-- ═══════════════════════════════════════════════════════════════════
-- DATOS INICIALES (SEED)
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO public.services (name, description, price_from, icon, active) VALUES
(
  'Dashboard Power BI para industria',
  'KPIs de producción, calidad, mantenimiento o laboratorio. Conexión a Excel, Google Sheets o SQL. Entrega en 3 a 7 días.',
  350000,
  'bar-chart-2',
  true
),
(
  'Documentación técnica y procedimientos',
  'POEs, protocolos de laboratorio, planes de calidad, fichas técnicas e informes de estabilidad. Estilo profesional institucional.',
  200000,
  'file-text',
  true
),
(
  'Auditoría ISO 9001 / Diagnóstico de calidad',
  'Revisión de sistema de gestión, brechas vs requisitos ISO, plan de acción. Para PYMEs que quieren certificarse.',
  800000,
  'shield-check',
  true
),
(
  'Automatización Excel + Google Apps Script',
  'Formularios automatizados, sistemas de reserva, generación de reportes y hojas de control inteligentes.',
  250000,
  'zap',
  true
),
(
  'Análisis HAZOP & Seguridad industrial',
  'Identificación de riesgos en procesos químicos, matrices de riesgo e informes para SG-SST.',
  1000000,
  'alert-triangle',
  true
),
(
  'Consultoría de procesos + BPM',
  'Mapeo de procesos, identificación de ineficiencias y rediseño con enfoque en datos operativos.',
  1500000,
  'git-branch',
  true
);
