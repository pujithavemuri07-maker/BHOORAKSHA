-- ============================================================
-- BHOORAKSHA (भूरक्षा) – Database Bootstrap Initialization
-- Pre-migration bootstrap: Required extensions & database setup
-- Application tables & schema are authoritatively owned by ROOT ALEMBIC
-- ============================================================

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "postgis_topology";

-- Custom Enums (Pre-bootstrap)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'citizen', 'deo', 'verifier', 'legal', 'gis', 'revenue', 'admin'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM (
        'submitted', 'quality_check', 'processing', 'review_required',
        'resubmission_required', 'under_human_review', 'verified',
        'rejected', 'closed',
        'ocr_processing', 'deo_review', 'verification_pending',
        'legal_review', 'gis_review', 'revenue_approval', 'approved', 'mutated'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_type AS ENUM (
        'sale_deed', 'patta', 'encumbrance_certificate', 'aadhaar', 'pan', 'tax_receipt', 'boundary_map'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE review_priority_level AS ENUM (
        'low', 'medium', 'high', 'critical'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
