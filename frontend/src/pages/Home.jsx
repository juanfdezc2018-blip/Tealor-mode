import React, { useState } from 'react';
import { Youtube, Video, Instagram, Download, Flame, ChevronRight } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Static data (no longer using mock.js)
const profileData = {
  name: "Tealor Mode",
  avatar: "https://customer-assets.emergentagent.com/job_bio-link-fitness/artifacts/7toccjzq_ChatGPT%20Image%2017%20abr%202026%2C%2013_14_49.png",
  bio: "Elimina grasa rebelde. Construye un físico real.",
  tagline: "Transformación basada en ciencia y consistencia"
};

const socialLinks = [
  {
    id: 1,
    platform: "YouTube",
    label: "Ver vídeos en YouTube",
    url: "https://www.youtube.com/@TealorMode",
    icon: "youtube"
  },
  {
    id: 2,
    platform: "TikTok",
    label: "Contenido diario en TikTok",
    url: "https://www.tiktok.com/@tealormode",
    icon: "video"
  },
  {
    id: 3,
    platform: "Instagram",
    label: "Mi día a día en Instagram",
    url: "https://www.instagram.com/tealormode?igsh=Z2x0MHd0aDIwejds",
    icon: "instagram"
  }
];

const freeResource = {
  title: "Protocolo ABS",
  description: "El sistema completo para eliminar grasa rebelde y marcar abdominales",
  buttonText: "Descargar gratis",
  featured: true
};

const futureProducts = [
  {
    id: 1,
    title: "Rutina Avanzada",
    description: "Programa completo de 12 semanas",
    status: "Próximamente",
    comingSoon: true
  },
  {
    id: 2,
    title: "Curso Completo",
    description: "Masterclass de transformación física",
    status: "Próximamente",
    comingSoon: true
  }
];

const finalCTA = {
  message: "Si no entiendes esto, seguirás igual dentro de 6 meses.",
  buttonText: "Descargar rutina"
};

const Home = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      
      // Track download click
      await axios.post(`${API}/analytics/click`, {
        button_type: 'download',
        button_name: 'protocolo-abs'
      });
      
      // Open download in new window
      window.open(`${API}/download/protocolo-abs`, '_blank');
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      
      // Check if PDF exists
      if (error.response?.status === 404) {
        alert('El PDF aún no está disponible. Por favor, contacta al administrador.');
      } else {
        alert('Error al descargar el PDF. Por favor, intenta de nuevo.');
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleSocialClick = async (platform) => {
    try {
      // Track social click
      await axios.post(`${API}/analytics/click`, {
        button_type: 'social',
        button_name: platform.toLowerCase()
      });
    } catch (error) {
      console.error('Error tracking click:', error);
      // Continue with navigation even if tracking fails
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      youtube: Youtube,
      video: Video,
      instagram: Instagram
    };
    const IconComponent = icons[iconName] || ChevronRight;
    return <IconComponent className="icon" />;
  };

  return (
    <div className="landing-container">
      {/* Profile Section */}
      <section className="profile-section">
        <div className="avatar-wrapper">
          <img 
            src={profileData.avatar} 
            alt={profileData.name}
            className="avatar-image"
          />
        </div>
        <h1 className="profile-name">{profileData.name}</h1>
        <p className="profile-bio">{profileData.bio}</p>
        <p className="profile-tagline">{profileData.tagline}</p>
      </section>

      {/* Primary CTA Button */}
      <section className="primary-cta-section">
        <button 
          className="btn-primary btn-large btn-featured"
          onClick={handleDownload}
          disabled={downloading}
        >
          <Flame className="btn-icon" />
          {downloading ? 'Descargando...' : 'Descargar rutina gratis'}
        </button>
      </section>

      {/* Social Links Section */}
      <section className="social-links-section">
        {socialLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link-btn"
            onClick={() => handleSocialClick(link.platform)}
          >
            {getIcon(link.icon)}
            <span>{link.label}</span>
          </a>
        ))}
      </section>

      {/* Free Resource Section */}
      <section className="free-resource-section">
        <div className="resource-card">
          <h2 className="resource-title">{freeResource.title}</h2>
          <p className="resource-description">{freeResource.description}</p>
          <button 
            className="btn-primary btn-medium"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download className="btn-icon" />
            {downloading ? 'Descargando...' : freeResource.buttonText}
          </button>
        </div>
      </section>

      {/* Future Products Section */}
      <section className="future-products-section">
        <h3 className="section-heading">Próximamente</h3>
        <div className="products-grid">
          {futureProducts.map((product) => (
            <div key={product.id} className="product-card">
              <h4 className="product-title">{product.title}</h4>
              <p className="product-description">{product.description}</p>
              <span className="product-status">{product.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <p className="final-message">{finalCTA.message}</p>
        <button 
          className="btn-primary btn-large"
          onClick={handleDownload}
          disabled={downloading}
        >
          <Download className="btn-icon" />
          {downloading ? 'Descargando...' : finalCTA.buttonText}
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">© 2026 Tealor Mode. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
