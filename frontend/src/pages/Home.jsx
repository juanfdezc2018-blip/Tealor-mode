import React, { useState } from 'react';
import {
  Youtube,
  Video,
  Instagram,
  Download,
  CheckCircle2,
  Mail,
  ArrowRight,
  Target,
  Activity,
  Zap,
  BookOpen,
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const avatarUrl = "https://customer-assets.emergentagent.com/job_bio-link-fitness/artifacts/7toccjzq_ChatGPT%20Image%2017%20abr%202026%2C%2013_14_49.png";

const socialLinks = [
  { id: 1, platform: "YouTube",   url: "https://www.youtube.com/@TealorMode",                          icon: Youtube   },
  { id: 2, platform: "TikTok",    url: "https://www.tiktok.com/@tealormode",                           icon: Video     },
  { id: 3, platform: "Instagram", url: "https://www.instagram.com/tealormode?igsh=Z2x0MHd0aDIwejds", icon: Instagram },
];

const valueCards = [
  { icon: BookOpen,  title: "Fundamentos reales",  text: "Entiende qué hace que pierdas grasa de verdad: comida, entrenamiento, sueño y adherencia." },
  { icon: Target,    title: "Sistema paso a paso", text: "Qué hacer cada semana sin volverte loco con mil reglas." },
  { icon: Zap,       title: "Errores que te frenan", text: "Los fallos invisibles que te hacen sentir que 'no funciona'." },
  { icon: Activity,  title: "Estructura semanal",  text: "Una base simple para entrenar, comer y ajustar según resultados." },
];

const steps = [
  { n: "01", title: "Diagnóstico",   text: "Detecta qué te está frenando." },
  { n: "02", title: "Ajuste",        text: "Configura comida, entrenamiento y hábitos mínimos." },
  { n: "03", title: "Ejecución",     text: "Aplica sin complicarte." },
  { n: "04", title: "Optimización",  text: "Ajusta según resultados reales." },
];

const scrollTo = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const Home = () => {
  const [email, setEmail]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState('');

  const handleEmailSubmit = async (e, source = 'main_form') => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${API}/email/capture`, { email, source });
      if (response.data.success) {
        setSubmitted(true);
        await axios.post(`${API}/analytics/click`, { button_type: 'email_capture', button_name: source });
        await axios.post(`${API}/email/mark-downloaded/${email}`);
        window.open(`${API}/download/protocolo-abs`, '_blank');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = async (platform) => {
    try {
      await axios.post(`${API}/analytics/click`, { button_type: 'social', button_name: platform.toLowerCase() });
    } catch (_) {}
  };

  if (submitted) {
    return (
      <div className="landing-container">
        <div className="thank-you-section">
          <div className="thank-you-icon"><CheckCircle2 size={48} /></div>
          <h1 className="thank-you-title">Ya tienes acceso.</h1>
          <p className="thank-you-text">
            Tu PDF se está descargando ahora.{' '}
            <span className="thank-you-link" onClick={() => window.open(`${API}/download/protocolo-abs`, '_blank')}>
              Haz clic aquí si no arranca.
            </span>
            <br /><br />
            Bienvenido al sistema. Ahora toca aplicarlo.
          </p>
          <button className="btn-primary btn-medium" onClick={() => setSubmitted(false)}>
            Volver al inicio
          </button>
          <div className="social-links-thank-you">
            <p className="social-heading">Sígueme en redes</p>
            <div className="social-icons">
              {socialLinks.map((l) => {
                const Icon = l.icon;
                return (
                  <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer"
                     className="social-icon-link" onClick={() => handleSocialClick(l.platform)}>
                    <Icon size={22} />
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

      {/* ── HEADER ── */}
      <header className="brand-header">
        <img src={avatarUrl} alt="Tealor Method" className="brand-logo" />
      </header>

      {/* ── HERO ── */}
      <section className="hero-section-new">
        <h1 className="hero-title-new hero-title-elegant">
          Pierde grasa<br />sin vivir a dieta
        </h1>
        <p className="hero-subtitle-new">
          Un sistema simple para dejar de improvisar: comida, entrenamiento y hábitos
          basados en ciencia. Sin cardio absurdo. Sin restricciones extremas.
        </p>
        <button className="btn-primary btn-large" onClick={() => scrollTo('email-capture')}>
          <Download className="btn-icon" size={18} />
          DESCARGAR EL PDF GRATIS
        </button>
        <p className="hero-microcopy">
          <CheckCircle2 size={13} /> Gratis. Sin spam. Solo contenido útil.
        </p>
        <p className="hero-offer-hint">
          Recibe el PDF inicial de Tealor Method con los fundamentos reales
          para empezar a perder grasa con estructura.
        </p>
      </section>

      {/* ── PDF MOCKUP ── */}
      <section className="pdf-mockup-section">
        <div className="pdf-mockup-card">
          <div className="pdf-mockup-tag">PDF GRATUITO</div>
          <div className="pdf-mockup-logo">TM</div>
          <p className="pdf-mockup-title">TEALOR METHOD</p>
          <p className="pdf-mockup-subtitle">Fundamentos reales para perder grasa</p>
          <div className="pdf-mockup-divider" />
          <p className="pdf-mockup-pills">Déficit · Fuerza · Proteína · Sueño · Sistema</p>
        </div>
      </section>

      {/* ── EMAIL CAPTURE ── */}
      <section className="email-capture-section" id="email-capture">
        <div className="email-capture-card">
          <h2 className="email-capture-title">Accede al sistema que realmente funciona</h2>
          <p className="email-capture-subtitle">
            Recibe el PDF inicial de Tealor Method y aprende los fundamentos reales
            para empezar con estructura.
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
              aria-label="Tu dirección de email"
            />
            <button type="submit" className="btn-primary btn-large" disabled={loading}>
              {loading ? 'Procesando…' : <><Mail className="btn-icon" size={18} /> ENVIARME EL MÉTODO</>}
            </button>
          </form>
          <p className="trust-message">
            <CheckCircle2 size={14} /> Sin spam. Solo contenido útil.
          </p>
        </div>
      </section>

      {/* ── VALUE CARDS ── */}
      <section className="value-section">
        <h2 className="section-title">No es solo genética. Es sistema.</h2>
        <p className="section-subtitle">
          La mayoría no falla por falta de ganas. Falla porque no tiene una estructura
          clara. Tealor Method te enseña qué medir, qué ajustar y qué ignorar.
        </p>
        <div className="value-grid">
          {valueCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div className="value-card" key={i}>
                <div className="value-icon"><Icon size={28} /></div>
                <h3 className="value-card-title">{c.title}</h3>
                <p className="value-card-text">{c.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TRUST SIGNAL ── */}
      <section className="trust-signal-section">
        <p className="trust-signal-text">
          Basado en principios reales: déficit calórico · fuerza · proteína · sueño · consistencia
        </p>
      </section>

      {/* ── 4 STEPS ── */}
      <section className="protocol-section">
        <h2 className="section-title">El sistema en 4 pasos</h2>
        <div className="protocol-steps">
          {steps.map((s) => (
            <div className="protocol-step" key={s.n}>
              <div className="step-number">{s.n}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-text">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── POSITIONING ── */}
      <section className="positioning-section">
        <div className="positioning-content">
          <h2 className="positioning-title">Tealor Method no es fitness tradicional.</h2>
          <p className="positioning-text">Es un sistema basado en datos, consistencia y decisiones correctas.</p>
          <p className="positioning-text">Sin ruido. Sin promesas vacías. Solo resultados medibles.</p>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="final-cta-section-new">
        <div className="final-cta-content">
          <p className="final-cta-message">
            Si sigues improvisando,<br />dentro de 6 meses estarás igual.
          </p>
          <button className="btn-primary btn-large" onClick={() => scrollTo('email-capture')}>
            <ArrowRight className="btn-icon" size={18} /> ENTRAR AL SISTEMA
          </button>
        </div>
      </section>

      {/* ── SOCIAL ── */}
      <section className="social-section">
        <p className="social-section-title">Contenido diario en redes</p>
        <div className="social-buttons">
          {socialLinks.map((l) => {
            const Icon = l.icon;
            return (
              <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer"
                 className="social-btn" onClick={() => handleSocialClick(l.platform)}>
                <Icon size={18} /> {l.platform}
              </a>
            );
          })}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-professional">
        <div className="footer-content">
          <div className="footer-brand">
            <p className="footer-brand-name">Tealor Method</p>
            <p className="footer-tagline">Sistema basado en ciencia</p>
          </div>
          <div className="footer-contact">
            <p className="footer-section-title">Contacto</p>
            <a href="mailto:info@tealormode.com" className="footer-email">info@tealormode.com</a>
          </div>
          <div className="footer-collab">
            <p className="footer-section-title">Colaboraciones</p>
            <p className="footer-collab-text">Para propuestas comerciales, escríbenos al correo.</p>
          </div>
        </div>
        <div className="footer-links">
          <a href="mailto:info@tealormode.com" className="footer-link">Contacto</a>
          <span className="footer-link-sep">·</span>
          <a href="mailto:info@tealormode.com" className="footer-link">Política de privacidad</a>
          <span className="footer-link-sep">·</span>
          <a href="mailto:info@tealormode.com" className="footer-link">Aviso legal</a>
          <span className="footer-link-sep">·</span>
          <a href="mailto:info@tealormode.com" className="footer-link">Colaboraciones</a>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Tealor Method. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
