import React, { useState } from 'react';
import { 
  Youtube, 
  Video, 
  Instagram, 
  Download, 
  Flame, 
  CheckCircle2,
  Mail,
  ArrowRight,
  Target,
  Activity,
  TrendingUp,
  Zap
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const profileData = {
  name: "Tealor Mode",
  avatar: "https://customer-assets.emergentagent.com/job_bio-link-fitness/artifacts/7toccjzq_ChatGPT%20Image%2017%20abr%202026%2C%2013_14_49.png",
};

const socialLinks = [
  {
    id: 1,
    platform: "YouTube",
    url: "https://www.youtube.com/@TealorMode",
    icon: Youtube
  },
  {
    id: 2,
    platform: "TikTok",
    url: "https://www.tiktok.com/@tealormode",
    icon: Video
  },
  {
    id: 3,
    platform: "Instagram",
    url: "https://www.instagram.com/tealormode?igsh=Z2x0MHd0aDIwejds",
    icon: Instagram
  }
];

const Home = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e, source = 'main_form') => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Capture email
      const response = await axios.post(`${API}/email/capture`, {
        email: email,
        source: source
      });

      if (response.data.success) {
        setSubmitted(true);
        
        // Track analytics
        await axios.post(`${API}/analytics/click`, {
          button_type: 'email_capture',
          button_name: source
        });

        // Mark as downloaded
        await axios.post(`${API}/email/mark-downloaded/${email}`);

        // Trigger PDF download
        window.open(`${API}/download/protocolo-abs`, '_blank');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al procesar tu solicitud. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = async (platform) => {
    try {
      await axios.post(`${API}/analytics/click`, {
        button_type: 'social',
        button_name: platform.toLowerCase()
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  if (submitted) {
    return (
      <div className="landing-container">
        <div className="thank-you-section">
          <div className="thank-you-icon">
            <CheckCircle2 size={64} />
          </div>
          <h1 className="thank-you-title">¡Bienvenido al sistema!</h1>
          <p className="thank-you-text">
            Tu descarga comenzará en unos segundos.
            <br />
            Revisa tu email para recibir contenido exclusivo.
          </p>
          <button 
            className="btn-primary btn-medium"
            onClick={() => window.location.reload()}
          >
            Volver al inicio
          </button>

          {/* Social Links */}
          <div className="social-links-thank-you">
            <p className="social-heading">Sígueme en redes</p>
            <div className="social-icons">
              {socialLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-link"
                    onClick={() => handleSocialClick(link.platform)}
                  >
                    <IconComponent size={24} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-container">
      
      {/* Logo/Brand Header */}
      <header className="brand-header">
        <img src={profileData.avatar} alt="Tealor Mode" className="brand-logo" />
      </header>

      {/* Hero Section */}
      <section className="hero-section-new">
        <h1 className="hero-title-new hero-title-elegant">
          Tealor Method
        </h1>
        <p className="hero-subtitle-new">
          Sin cardio absurdo. Sin dietas extremas. Basado en ciencia.
        </p>
        <button 
          className="btn-primary btn-large"
          onClick={() => document.getElementById('email-capture').scrollIntoView({ behavior: 'smooth' })}
        >
          <Flame className="btn-icon" />
          Acceder al sistema
        </button>
      </section>

      {/* Email Capture Section - MAIN CTA */}
      <section className="email-capture-section" id="email-capture">
        <div className="email-capture-card">
          <h2 className="email-capture-title">
            Accede al sistema que realmente funciona
          </h2>
          <p className="email-capture-subtitle">
            Aprende cómo eliminar grasa sin complicarte ni perder tiempo
          </p>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={(e) => handleEmailSubmit(e, 'main_form')} className="email-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email"
              className="email-input"
              required
              disabled={loading}
            />
            <button 
              type="submit" 
              className="btn-primary btn-large"
              disabled={loading}
            >
              {loading ? (
                'Procesando...'
              ) : (
                <>
                  <Mail className="btn-icon" />
                  Empezar ahora
                </>
              )}
            </button>
          </form>

          <p className="trust-message">
            <CheckCircle2 size={16} />
            Sin spam. Solo contenido útil.
          </p>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="value-section">
        <h2 className="section-title">No es genética, es sistema</h2>
        <div className="value-grid">
          <div className="value-card">
            <div className="value-icon">
              <Download size={32} />
            </div>
            <h3 className="value-card-title">PDF: fundamentos reales</h3>
            <p className="value-card-text">
              Los principios científicos de pérdida de grasa que realmente funcionan
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">
              <Target size={32} />
            </div>
            <h3 className="value-card-title">Sistema paso a paso</h3>
            <p className="value-card-text">
              Estructura clara y simple para aplicar desde el día 1
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">
              <Zap size={32} />
            </div>
            <h3 className="value-card-title">Errores que te bloquean</h3>
            <p className="value-card-text">
              Los fallos más comunes que impiden ver resultados reales
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">
              <Activity size={32} />
            </div>
            <h3 className="value-card-title">Estructura semanal</h3>
            <p className="value-card-text">
              Plan simple y consistente para seguir sin agobiarte
            </p>
          </div>
        </div>
      </section>

      {/* Brand Positioning Section */}
      <section className="positioning-section">
        <div className="positioning-content">
          <h2 className="positioning-title">
            Tealor Mode no es fitness tradicional
          </h2>
          <p className="positioning-text">
            Es un sistema basado en datos, consistencia y decisiones correctas.
          </p>
          <p className="positioning-text">
            Sin ruido. Sin promesas vacías. Solo resultados medibles.
          </p>
        </div>
      </section>

      {/* Protocol/System Section */}
      <section className="protocol-section">
        <h2 className="section-title">El sistema en 4 pasos</h2>
        <div className="protocol-steps">
          <div className="protocol-step">
            <div className="step-number">01</div>
            <h3 className="step-title">Diagnóstico</h3>
            <p className="step-text">
              Entiende qué estás haciendo mal
            </p>
          </div>

          <div className="protocol-step">
            <div className="step-number">02</div>
            <h3 className="step-title">Ajuste</h3>
            <p className="step-text">
              Configura lo mínimo necesario
            </p>
          </div>

          <div className="protocol-step">
            <div className="step-number">03</div>
            <h3 className="step-title">Ejecución</h3>
            <p className="step-text">
              Aplica sin complicarte
            </p>
          </div>

          <div className="protocol-step">
            <div className="step-number">04</div>
            <h3 className="step-title">Optimización</h3>
            <p className="step-text">
              Ajusta según resultados
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section-new">
        <div className="final-cta-content">
          <p className="final-cta-message">
            Si no entiendes esto, seguirás igual dentro de 6 meses
          </p>
          <button 
            className="btn-primary btn-large"
            onClick={() => document.getElementById('email-capture').scrollIntoView({ behavior: 'smooth' })}
          >
            <ArrowRight className="btn-icon" />
            Entrar al sistema
          </button>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="social-section">
        <p className="social-section-title">Contenido diario en redes</p>
        <div className="social-buttons">
          {socialLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                onClick={() => handleSocialClick(link.platform)}
              >
                <IconComponent size={20} />
                {link.platform}
              </a>
            );
          })}
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="footer-professional">
        <div className="footer-content">
          <div className="footer-brand">
            <p className="footer-brand-name">Tealor Mode</p>
            <p className="footer-tagline">Sistema basado en ciencia</p>
          </div>

          <div className="footer-contact">
            <p className="footer-section-title">Contacto</p>
            <a href="mailto:info@tealormode.com" className="footer-email">
              info@tealormode.com
            </a>
          </div>

          <div className="footer-collab">
            <p className="footer-section-title">Colaboraciones y marcas</p>
            <p className="footer-collab-text">
              Para colaboraciones o propuestas comerciales,
              contáctanos en el correo
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Tealor Mode. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;