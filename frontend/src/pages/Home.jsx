import React from 'react';
import { Youtube, Video, Instagram, Download, Flame, ChevronRight } from 'lucide-react';
import { profileData, socialLinks, freeResource, futureProducts, finalCTA } from '../data/mock';

const Home = () => {
  const handleDownload = () => {
    // Mock download functionality
    alert('¡Descarga iniciada! (Funcionalidad mock - se conectará con el backend)');
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
        >
          <Flame className="btn-icon" />
          Descargar rutina gratis
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
          >
            <Download className="btn-icon" />
            {freeResource.buttonText}
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
        >
          <Download className="btn-icon" />
          {finalCTA.buttonText}
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
