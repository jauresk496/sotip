CREATE TABLE IF NOT EXISTS public.gestion_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_type text NOT NULL CHECK (doc_type IN ('bon_caisse','recu','bon_sortie')),
  doc_number text NOT NULL UNIQUE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'valide',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gestion_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gestion_documents_public_read"
  ON public.gestion_documents FOR SELECT TO public USING (true);
CREATE POLICY "gestion_documents_public_insert"
  ON public.gestion_documents FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "gestion_documents_public_update"
  ON public.gestion_documents FOR UPDATE TO public USING (true);
CREATE POLICY "gestion_documents_public_delete"
  ON public.gestion_documents FOR DELETE TO public USING (true);

CREATE INDEX IF NOT EXISTS idx_gestion_documents_type ON public.gestion_documents(doc_type);
CREATE INDEX IF NOT EXISTS idx_gestion_documents_created ON public.gestion_documents(created_at DESC);

-- gestion_documents migration SQL
