-- ========================================
-- Script d'initialisation SOTIP-CI Supabase
-- Exécuter dans Supabase SQL Editor
-- ========================================

DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS partners;
DROP TABLE IF EXISTS settings;

-- 1. Table settings (paramètres clé/valeur)
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- 2. Table services
CREATE TABLE services (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  intro TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  image TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 3. Table projects
CREATE TABLE projects (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  page_title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  card_image TEXT,
  main_image TEXT,
  year TEXT,
  content TEXT[] DEFAULT '{}',
  sidebar_title TEXT,
  sidebar_slug TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 4. Table partners
CREATE TABLE partners (
  slug TEXT PRIMARY KEY,
  image TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ========================================
-- Données initiales (settings)
-- ========================================
INSERT INTO settings (key, value) VALUES
  ('site_name', 'SOTIP-CI'),
  ('site_tagline', 'Société de Travaux Industriels et de Prestation de Côte d''Ivoire'),
  ('copyright', 'Copyright &copy; 2026 SOTIP-CI. Tous droits réservés.'),
  ('primary_color', '#1a702b'),
  ('primary_dark', '#0f4d13'),
  ('secondary_color', '#152de5'),
  ('dark_color', '#1a1a1a'),
  ('header_bg', '#0f1a2e'),
  ('nav_bg', '#1a3c6e'),
  ('footer_bg', '#0f1a2e'),
  ('contact_email', 'info@sotipci.net'),
  ('contact_phone', '+225 07 48 26 95 74'),
  ('contact_fax', '+225 27 21 29 02 87'),
  ('contact_address', 'MARCORY ANOUMABO Rue Bamba Kassoum'),
  ('ga4_id', ''),
  ('hero_tag', 'Expertise Industrielle'),
  ('hero_title', 'Société de Travaux Industriels et de Prestation'),
  ('hero_subtitle', 'Construction métallique, charpenterie, chaudronnerie, tuyauterie, génie civil et maintenance industrielle en Côte d''Ivoire.')
ON CONFLICT (key) DO NOTHING;

-- ========================================
-- Données initiales (services)
-- ========================================
INSERT INTO services (slug, title, intro, content, image, sort_order) VALUES
  ('construction-metallique', 'Construction Métallique', 'SOTIP-CI réalise vos ouvrages de construction métallique et mixte : charpentes, bâtiments industriels, ponts, structures métalliques sur mesure.', 'Notre équipe d''ingénieurs et de techniciens qualifiés conçoit et réalise tous types de structures métalliques pour l''industrie, le commerce et le résidentiel. Nous intervenons de la conception à la mise en œuvre, en respectant les normes internationales de sécurité et de qualité.', 'images_electricite/construction_metallique.jpg', 1),
  ('charpenterie-metallique', 'Charpenterie Métallique', 'Fabrication et installation de charpentes métalliques pour bâtiments industriels, commerciaux et résidentiels.', 'SOTIP-CI maîtrise l''ensemble des techniques de charpenterie métallique : poteaux, poutres, fermes, contreventement, couverture et bardage. Nous assurons la fabrication en atelier et le montage sur site.', 'images_gaz/charpenterie_metallique.jpg', 2),
  ('chaudronnerie-tuyauterie', 'Chaudronnerie et Tuyauterie', 'Fabrication et installation d''équipements chaudronnés et de réseaux de tuyauterie industrielle.', 'Nous réalisons des cuves, réservoirs, échangeurs, colonnes, séparateurs, ainsi que des réseaux de tuyauterie pour le transport de fluides gazeux ou liquides. Nos soudeurs qualifiés travaillent l''acier au carbone, l''inox et les alliages spéciaux.', 'images/entreprise/chaudronnerie.jpg', 3),
  ('graissage-industriel', 'Graissage Industriel', 'SOTIP-CI assure le graissage industriel de l''ensemble de vos équipements mécaniques : vannes, moteurs, réducteurs, pompes et engrenages.', 'Nous intervenons dans la lubrification des vannes industrielles, le graissage des moteurs électriques et réducteurs, la maintenance des pompes et motopompes, le graissage des engrenages et paliers, l''analyse d''huile et la fourniture de graisses spécifiques pour l''industrie.', NULL, 4),
  ('genie-civil', 'Génie Civil', 'SOTIP-CI assure les travaux de génie civil pour vos projets industriels et bâtiment : terrassement, fondations, dallages.', 'Nous réalisons le terrassement et la préparation de sites, la réalisation de massifs et semelles pour structures métalliques, les dallages industriels et voiries, la réhabilitation de structures existantes, la construction de postes HTA et locaux techniques, et le génie civil associé aux ouvrages métalliques.', 'images/entreprise/genie_civil.jpg', 5),
  ('calorifugeage', 'Calorifugeage', 'SOTIP-CI réalise tous vos travaux de calorifugeage pour l''isolation thermique des équipements industriels.', 'Nous intervenons sur tuyauteries, réservoirs, échangeurs et colonnes. Nos techniques d''isolation permettent de réduire les pertes d''énergie, d''assurer la protection du personnel et de maintenir les températures de process.', 'images/entreprise/calorifugeage.jpg', 6),
  ('sablage-peinture', 'Sablage et Peinture', 'SOTIP-CI assure le traitement de surface et l''application de revêtements anticorrosion sur vos équipements et structures métalliques.', 'Nous réalisons le sablage et décapage des surfaces métalliques, l''application de peinture anticorrosion, les revêtements époxy et polyuréthane, le traitement de surface selon normes ISO, et la peinture de structures métalliques et charpentes.', 'images/entreprise/sablage_peinture.jpg', 7),
  ('soudure', 'Soudure', 'SOTIP-CI dispose de soudeurs qualifiés pour réaliser l''ensemble de vos travaux de soudure sur acier, inox et alliages spéciaux.', 'Nous réalisons la soudure acier au carbone, la soudure inox et alliages spéciaux, la soudure en atelier et sur site, l''assemblage de structures métalliques et la soudure de tuyauterie industrielle.', 'images/entreprise/soudure.jpg', 8),
  ('chaudronnerie', 'Chaudronnerie', 'SOTIP-CI conçoit et réalise vos équipements de chaudronnerie industrielle sur mesure : cuves, réservoirs, échangeurs.', 'Nous fabriquons des cuves de stockage et réservoirs, des échangeurs thermiques et colonnes, des séparateurs et filtres industriels, des ouvrages de tôlerie fine et chaudronnerie lourde. Nous assurons l''assemblage et le montage sur site, en acier au carbone, inox et alliages spéciaux.', 'images/entreprise/chaudronnerie.jpg', 9),
  ('tuyauterie', 'Tuyauterie', 'SOTIP-CI conçoit et installe vos réseaux de tuyauterie industrielle pour le transport de fluides gazeux ou liquides.', 'Nous réalisons la tuyauterie acier au carbone, inox et alliages, les réseaux de vapeur, eau, air comprimé et gaz, la tuyauterie de procédé pour l''industrie, le supportage et calorifugeage des canalisations, ainsi que les essais d''étanchéité et la mise en service.', 'images/entreprise/chaudronnerie.jpg', 10),
  ('maintenance-industrielle', 'Maintenance Industrielle', 'SOTIP-CI assure la maintenance préventive et curative de vos équipements industriels : tuyauterie, chaudronnerie et soudure.', 'Nous assurons la maintenance des équipements de tuyauterie et chaudronnerie, les travaux de soudure de maintenance, la réparation et rénovation de structures métalliques, la maintenance des systèmes de calorifugeage et les interventions d''urgence sur site.', 'images/entreprise/maintenance_industrielle.jpg', 11)
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- Données initiales (projects)
-- ========================================
INSERT INTO projects (slug, title, page_title, description, card_image, main_image, year, content, sidebar_title, sort_order) VALUES
  ('green', 'Tente de stationnement pour voiture', 'Tente de stationnement pour voiture', 'Offrez à votre véhicule la protection qu''il mérite grâce à nos tentes de stationnement robustes et faciles à installer.', '/images/slide/1.jpg', '/images/slide/1.jpg', '2024', ARRAY['Protège votre voiture des rayons du soleil et des pluies acides.', 'Évite l''accumulation de poussière et saletés.', 'Alternative économique au garage traditionnel.', 'Transportable et réutilisable selon vos besoins.']::text[], 'Tente de stationnement', 1),
  ('onomo', 'Maintenance Industrielle', 'Maintenance Industrielle', 'Prestations de maintenance industrielle préventive et curative : tuyauterie, chaudronnerie et soudure.', '/images/entreprise/maintenance_industrielle.jpg', '/images/entreprise/maintenance_industrielle.jpg', '2024', ARRAY['SOTIP-CI assure des prestations de maintenance industrielle pour divers clients industriels : maintenance préventive et curative, tuyauterie, chaudronnerie, graissage et soudure.', 'Notre équipe intervient sur site pour garantir la continuité de production de nos clients grâce à un suivi rigoureux et des interventions rapides.']::text[], 'Maintenance Industrielle', 2),
  ('carbone', 'Usine de Transformation', 'Usine de Transformation', 'Construction métallique complète d''une usine de transformation agro-industrielle réalisée par SOTIP-CI.', '/images/slide/2.jpg', '/images/projects/carbone_main_1781521741.png', '2024', ARRAY['Construction métallique complète d''une usine de transformation agro-industrielle réalisée par SOTIP-CI : charpente métallique, couverture, bardage et équipements chaudronnés.', 'Ce projet a nécessité la coordination de plusieurs corps de métier : génie civil pour les fondations, charpenterie métallique pour la structure porteuse, chaudronnerie pour les équipements de transformation, et tuyauterie pour les réseaux de fluides.']::text[], 'Usine de Transformation', 3),
  ('radisson', 'Réservoir de Stockage', 'Réservoir de Stockage', 'Fabrication et montage de réservoirs de stockage d''hydrocarbures : chaudronnerie lourde, tuyauterie et calorifugeage réalisés par SOTIP-CI.', '/images/slide/3.jpg', '/images/slide/3.jpg', '2023', ARRAY['Fabrication et montage de réservoirs de stockage d''hydrocarbures : chaudronnerie lourde, tuyauterie et calorifugeage réalisés par SOTIP-CI.', 'Ce projet clé en main comprenait la fabrication en atelier des viroles et fonds de réservoirs, le transport sur site, l''assemblage et la soudure, les tests d''étanchéité, la mise en peinture anticorrosion et le calorifugeage des canalisations.']::text[], 'Réservoir de Stockage', 4)
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- Données initiales (partners)
-- ========================================
INSERT INTO partners (slug, image, name, sort_order) VALUES
  ('cie', '/images/marques/partner_logo-cie.jpg', 'CIE', 1),
  ('sodeci', '/images/marques/partner_logo-sodeci.png', 'SODECI', 2),
  ('smb', '/images/marques/partner_logo-smb.png', 'SMB', 3),
  ('cocitam', '/images/marques/partner_cocitam_logojpg.jpg', 'COCITAM', 4),
  ('clemessy', '/images/marques/partner_Logo_Clemessypng.png', 'CLEMESSY', 5),
  ('shell', '/images/marques/partner_shell-2020png.png', 'SHELL', 6)
ON CONFLICT (slug) DO NOTHING;
