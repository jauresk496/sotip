export interface Service {
  slug: string;
  title: string;
  intro: string;
  content: string;
  image: string | null;
  sort_order: number;
}

export interface Project {
  slug: string;
  title: string;
  page_title: string;
  description: string;
  card_image: string | null;
  main_image: string | null;
  year: string | null;
  content: string[];
  sidebar_title: string | null;
  sidebar_slug: string | null;
  sort_order: number;
}

export interface Partner {
  slug: string;
  image: string;
  name: string;
  sort_order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  sort_order: number;
}

export interface SlideItem {
  id: string;
  image: string;
  title: string;
  sort_order: number;
}

export interface Settings {
  [key: string]: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  project_type: string | null;
  project_description: string;
  budget: string | null;
  deadline: string | null;
  attachments: string[];
  status: string;
  is_read: boolean;
  created_at: string;
}

export const SERVICE_LIST: { slug: string; title: string }[] = [
  { slug: 'construction-metallique', title: 'Construction métallique' },
  { slug: 'charpenterie-metallique', title: 'Charpenterie métallique' },
  { slug: 'graissage-industriel', title: 'Graissage industriel' },
  { slug: 'genie-civil', title: 'Génie civil' },
  { slug: 'calorifugeage', title: 'Calorifugeage' },
  { slug: 'sablage-peinture', title: 'Sablage & peinture' },
  { slug: 'soudure', title: 'Soudure' },
  { slug: 'chaudronnerie', title: 'Chaudronnerie' },
  { slug: 'tuyauterie', title: 'Tuyauterie' },
  { slug: 'maintenance-industrielle', title: 'Maintenance industrielle' },
];

export const HOME_SERVICE_CARDS: { slug: string; img: string; title: string; desc: string }[] = [
  { slug: 'construction-metallique', img: '/images_electricite/construction_metallique.jpg', title: 'Construction Métallique', desc: 'Charpentes, bâtiments industriels, ponts et structures métalliques sur mesure.' },
  { slug: 'charpenterie-metallique', img: '/images_gaz/charpenterie_metallique.jpg', title: 'Charpenterie Métallique', desc: 'Fabrication et installation de charpentes pour bâtiments industriels et commerciaux.' },
  { slug: 'chaudronnerie-tuyauterie', img: '/images/entreprise/chaudronnerie.jpg', title: 'Chaudronnerie & Tuyauterie', desc: 'Cuves, réservoirs, échangeurs et réseaux de tuyauterie industrielle.' },
  { slug: 'graissage-industriel', img: '/images_plomberie/graissage_industriel.jpg', title: 'Graissage Industriel', desc: 'Prestations de graissage et lubrification pour équipements industriels.' },
  { slug: 'genie-civil', img: '/images/entreprise/genie_civil.jpg', title: 'Génie Civil', desc: 'Fondations, dallages, VRD et ouvrages de génie civil associés.' },
  { slug: 'calorifugeage', img: '/images/entreprise/calorifugeage.jpg', title: 'Calorifugeage', desc: 'Isolation thermique des canalisations, cuves et équipements industriels.' },
  { slug: 'sablage-peinture', img: '/images/entreprise/sablage_peinture.jpg', title: 'Sablage & Peinture', desc: 'Traitement de surface, sablage et revêtement anticorrosion.' },
  { slug: 'soudure', img: '/images/entreprise/soudure.jpg', title: 'Soudure', desc: 'Soudure qualifiée acier, inox et alliages spéciaux.' },
  { slug: 'chaudronnerie', img: '/images/entreprise/chaudronnerie.jpg', title: 'Chaudronnerie', desc: "Fabrication d'équipements chaudronnés sur mesure." },
];

export const PROJECT_ORDER = ['green', 'onomo', 'carbone', 'radisson'];

export const HERO_SLIDES = [
  '/images/slide/1.jpg',
  '/images/slide/2.jpg',
  '/images/slide/3.jpg',
  '/images/slide/sotip-ciciterne.jpg',
  '/images/slide/station.jpg',
];
