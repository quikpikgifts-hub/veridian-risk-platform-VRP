-- ============================================================
-- VERIDIAN RISK PLATFORM — Full Schema Install
-- Run this ONCE in: Supabase Dashboard → SQL Editor → New Query
-- Project: vuvpruexryzfumqfticg.supabase.co
--
-- Users already created in Supabase Auth:
--   director@veridianriskgroup.org  (admin)   571c86cf-98f2-4c1e-a2b9-85e7f08f7ea1
--   steve@veridianriskgroup.org     (admin)   039d4425-fde7-46d2-b101-eecf3fb2250e
--   skeeter@veridianriskgroup.org   (director)fc005359-3224-4fa1-a6f7-5a890c672359
--   smithjr49@icloud.com            (director)e11e7552-3400-435b-abce-f4cb91091237
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── PROFILES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  role          TEXT NOT NULL DEFAULT 'viewer'
                  CHECK (role IN ('admin','director','analyst','client','viewer')),
  department    TEXT,
  status        TEXT NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active','inactive','suspended')),
  permissions   TEXT[] DEFAULT '{}',
  last_login    TIMESTAMPTZ,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_select_admin" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','director'))
);
CREATE POLICY "profiles_update_own"   ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_update_admin" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- ── CLIENTS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.clients (
  id              TEXT PRIMARY KEY DEFAULT 'CLI-' || upper(substr(gen_random_uuid()::text, 1, 6)),
  name            TEXT NOT NULL,
  industry        TEXT NOT NULL,
  risk_score      NUMERIC(4,2) DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 10),
  last_assessment DATE,
  next_review     DATE,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','review')),
  incidents       INT DEFAULT 0,
  contact         TEXT,
  phone           TEXT,
  email           TEXT,
  contract_value  NUMERIC(10,2),
  engagement_lead TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients_select_staff" ON public.clients FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','director','analyst'))
);
CREATE POLICY "clients_select_own" ON public.clients FOR SELECT USING (
  email = (SELECT email FROM public.profiles WHERE id = auth.uid())
);
CREATE POLICY "clients_write_staff" ON public.clients FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','director'))
);

-- ── INCIDENTS ─────────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS incident_seq START 1;
CREATE TABLE IF NOT EXISTS public.incidents (
  id              TEXT PRIMARY KEY DEFAULT 'INC-' || to_char(NOW(),'YYYY') || '-' || lpad(nextval('incident_seq')::text,3,'0'),
  title           TEXT NOT NULL,
  location        TEXT,
  industry        TEXT,
  severity        TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low','medium','high','critical')),
  status          TEXT NOT NULL DEFAULT 'active'  CHECK (status IN ('active','investigating','contained','resolved')),
  category        TEXT,
  description     TEXT,
  assigned_to     TEXT,
  ai_summary      TEXT,
  estimated_loss  NUMERIC(12,2),
  witnesses       INT DEFAULT 0,
  tags            TEXT[],
  reported_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at     TIMESTAMPTZ,
  client_id       TEXT REFERENCES public.clients(id),
  created_by      UUID REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "incidents_select_staff" ON public.incidents FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','director','analyst'))
);
CREATE POLICY "incidents_write_staff" ON public.incidents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','director','analyst'))
);

-- ── RISK ASSESSMENTS ──────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS risk_seq START 1;
CREATE TABLE IF NOT EXISTS public.risk_assessments (
  id               TEXT PRIMARY KEY DEFAULT 'RA-' || to_char(NOW(),'YYYY') || '-' || lpad(nextval('risk_seq')::text,3,'0'),
  client_id        TEXT REFERENCES public.clients(id),
  client_name      TEXT,
  industry         TEXT,
  assessment_type  TEXT NOT NULL DEFAULT 'annual' CHECK (assessment_type IN ('annual','follow-up','incident-triggered','initial')),
  status           TEXT NOT NULL DEFAULT 'draft'  CHECK (status IN ('draft','review','approved','archived')),
  risk_score       NUMERIC(4,2) CHECK (risk_score BETWEEN 0 AND 10),
  previous_score   NUMERIC(4,2),
  assessed_by      TEXT,
  assessed_at      DATE,
  next_review      DATE,
  ai_summary       TEXT,
  recommendations  TEXT[],
  created_by       UUID REFERENCES public.profiles(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "risk_select_staff" ON public.risk_assessments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','director','analyst'))
);
CREATE POLICY "risk_write_staff" ON public.risk_assessments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','director','analyst'))
);

-- ── RISK FINDINGS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.risk_findings (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id  TEXT NOT NULL REFERENCES public.risk_assessments(id) ON DELETE CASCADE,
  category       TEXT NOT NULL,
  description    TEXT NOT NULL,
  severity       TEXT NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  standard       TEXT,
  remediation    TEXT,
  status         TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in-progress','resolved')),
  due_date       DATE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.risk_findings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "findings_select_staff" ON public.risk_findings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','director','analyst'))
);
CREATE POLICY "findings_write_staff" ON public.risk_findings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','director','analyst'))
);

-- ── REPORTS ───────────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS report_seq START 1;
CREATE TABLE IF NOT EXISTS public.reports (
  id           TEXT PRIMARY KEY DEFAULT 'RPT-' || lpad(nextval('report_seq')::text,3,'0'),
  title        TEXT NOT NULL,
  type         TEXT NOT NULL,
  client_id    TEXT REFERENCES public.clients(id),
  client_name  TEXT,
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','approved','delivered','archived')),
  created_by   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pages        INT,
  ai_generated BOOLEAN DEFAULT TRUE,
  tags         TEXT[],
  content      TEXT
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports_select_staff"  ON public.reports FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','director','analyst'))
);
CREATE POLICY "reports_select_client" ON public.reports FOR SELECT USING (
  client_id IN (SELECT id FROM public.clients WHERE email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
);
CREATE POLICY "reports_write_staff"   ON public.reports FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','director','analyst'))
);

-- ── WORKFLOWS ─────────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS workflow_seq START 1;
CREATE TABLE IF NOT EXISTS public.workflows (
  id             TEXT PRIMARY KEY DEFAULT 'WF-' || lpad(nextval('workflow_seq')::text,3,'0'),
  name           TEXT NOT NULL,
  description    TEXT,
  trigger        TEXT NOT NULL DEFAULT 'manual' CHECK (trigger IN ('manual','scheduled','incident','lead')),
  status         TEXT NOT NULL DEFAULT 'paused' CHECK (status IN ('running','paused','completed','failed')),
  steps          JSONB DEFAULT '[]',
  assigned_agent TEXT,
  runs_total     INT DEFAULT 0,
  success_rate   NUMERIC(5,2) DEFAULT 100,
  last_run       TIMESTAMPTZ,
  next_run       TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "workflows_select_staff" ON public.workflows FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','director','analyst'))
);
CREATE POLICY "workflows_write_admin" ON public.workflows FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','director'))
);

-- ── AUDIT LOGS (append-only) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action      TEXT NOT NULL,
  resource    TEXT NOT NULL,
  resource_id TEXT,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email  TEXT,
  user_role   TEXT,
  ip_address  TEXT,
  user_agent  TEXT,
  details     JSONB,
  success     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_insert_all"    ON public.audit_logs FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "audit_select_admin"  ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','director'))
);

-- ── CONSULTATIONS (public intake) ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.consultations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  company           TEXT NOT NULL,
  email             TEXT NOT NULL,
  phone             TEXT,
  industry          TEXT NOT NULL,
  services          TEXT[] NOT NULL,
  message           TEXT,
  preferred_contact TEXT NOT NULL DEFAULT 'email' CHECK (preferred_contact IN ('email','phone','either')),
  status            TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','closed')),
  assigned_to       TEXT,
  notes             TEXT,
  ip_address        TEXT,
  submitted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "consultations_insert_public" ON public.consultations FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "consultations_select_admin"  ON public.consultations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','director'))
);
CREATE POLICY "consultations_update_admin"  ON public.consultations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','director'))
);

-- ── NOTIFICATIONS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  message      TEXT NOT NULL,
  priority     TEXT NOT NULL DEFAULT 'info' CHECK (priority IN ('info','medium','high','critical')),
  type         TEXT NOT NULL DEFAULT 'system' CHECK (type IN ('incident','ai','fleet','client','system')),
  read         BOOLEAN NOT NULL DEFAULT FALSE,
  action_url   TEXT,
  action_label TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "notifications_insert_all" ON public.notifications FOR INSERT WITH CHECK (TRUE);

-- ── INDEXES ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_incidents_status      ON public.incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_reported_at ON public.incidents(reported_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_client_id   ON public.incidents(client_id);
CREATE INDEX IF NOT EXISTS idx_risk_client_id        ON public.risk_assessments(client_id);
CREATE INDEX IF NOT EXISTS idx_reports_client_id     ON public.reports(client_id);
CREATE INDEX IF NOT EXISTS idx_reports_status        ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_audit_user_id         ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at      ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultations_email   ON public.consultations(email);

-- ═══════════════════════════════════════════════════════════════
-- SEED — existing users (already in auth.users, role set via API)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO public.profiles (id, name, email, role, department, status) VALUES
  ('571c86cf-98f2-4c1e-a2b9-85e7f08f7ea1', 'Steve Washington Smith',  'director@veridianriskgroup.org', 'admin',    'Operations', 'active'),
  ('039d4425-fde7-46d2-b101-eecf3fb2250e', 'Steve Washington Smith',  'steve@veridianriskgroup.org',    'admin',    'Operations', 'active'),
  ('fc005359-3224-4fa1-a6f7-5a890c672359', 'Skeeter Adiansingh-Smith','skeeter@veridianriskgroup.org',  'director', 'Fleet & HR', 'active'),
  ('e11e7552-3400-435b-abce-f4cb91091237', 'Director',                'smithjr49@icloud.com',           'director', 'Operations', 'active')
ON CONFLICT (id) DO UPDATE SET
  role       = EXCLUDED.role,
  name       = EXCLUDED.name,
  department = EXCLUDED.department,
  updated_at = NOW();

-- Verify everything installed
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
