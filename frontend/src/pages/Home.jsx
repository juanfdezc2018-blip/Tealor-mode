import React, { useState, useEffect, useRef } from 'react';
import {
  Youtube,
  Video,
  Instagram,
  Download,
  CheckCircle2,
  Mail,
  ArrowRight,
  Zap,
  Brain,
  Shield,
  Dumbbell,
  ChevronDown,
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const profileData = {
  avatar: "https://customer-assets.emergentagent.com/job_bio-link-fitness/artifacts/7toccjzq_ChatGPT%20Image%2017%20abr%202026%2C%2013_14_49.png",
};

const socialLinks = [
  { id: 1, platform: "YouTube",   url: "https://www.youtube.com/@TealorMode",                          icon: Youtube   },
  { id: 2, platform: "TikTok",    url: "https://www.tiktok.com/@tealormode",                           icon: Video     },
  { id: 3, platform: "Instagram", url: "https://www.instagram.com/tealormode?igsh=Z2x0MHd0aDIwejds", icon: Instagram },
];

const pillars = [
  {
    icon: Dumbbell,
    label: "Cuerpo",
    desc: "Construye un físico que refleje tu disciplina. Protocolos basados en evidencia, sin trucos ni atajos.",
  },
  {
    icon: Brain,
    label: "Mente",
    desc: "El rendimiento físico empieza en el cerebro. Claridad mental, foco y resiliencia como pilares del progreso.",
  },
  {
    icon: Shield,
    label: "Disciplina",
    desc: "La motivación desaparece. La disciplina permanece. Aquí construyes sistemas, no depender del estado de ánimo.",
  },
];

/* Particle canvas background */
function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 230, 200, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

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

        await axios.post(`${API}/analytics/click`, {
          button_type: 'email_capture',
          button_name: source,
        });

        await axios.post(`${API}/email/mark-downloaded/${email}`);

        window.open(`${API}/download/protocolo-abs`, '_blank');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Algo salió mal. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = async (platform) => {
    try {
      await axios.post(`${API}/analytics/click`, {
        button_type: 'social',
        button_name: platform.toLowerCase(),
      });
    } catch (_) {}
  };

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  if (submitted) {
    return (
      <div className="tm-root">
        <div className="ty-wrap">
          <div className="ty-icon"><CheckCircle2 size={36} /></div>
          <h1 className="ty-title">Ya tienes acceso.</h1>
          <p className="ty-text">
            Tu PDF se está descargando ahora.{' '}
            <span className="ty-link" onClick={() => window.open(`${API}/download/protocolo-abs`, '_blank')}>
              Haz clic aquí si no arranca.
            </span>
            <br /><br />
            Bienvenido al sistema. Ahora toca aplicarlo.
          </p>
          <button className="tm-btn-primary" onClick={() => setSubmitted(false)}>
            Volver al inicio
          </button>
          <div className="ty-social">
            <p className="ty-social-label">Sígueme en redes</p>
            <div className="ty-social-icons">
              {socialLinks.map((l) => {
                const Icon = l.icon;
                return (
                  <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer"
                     className="ty-social-btn" onClick={() => handleSocialClick(l.platform)}>
                    <Icon size={20} />
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
    <div className="tm-root">

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="tm-hero">
        <ParticleField />

        {/* nav bar */}
        <nav className="tm-nav">
          <img src={profileData.avatar} alt="Tealor Mode" className="tm-nav-logo" />
          <span className="tm-nav-brand">Tealor Mode</span>
          <button className="tm-btn-outline tm-nav-cta" onClick={() => scrollTo('email-capture')}>
            Unirse
          </button>
        </nav>

        <div className="tm-hero-content">
          <span className="tm-eyebrow">
            <Zap size={12} /> Sistema de transformación física y mental
          </span>

          <h1 className="tm-hero-title">
            Enter<br /><span className="tm-accent">Tealor Mode</span>
          </h1>

          <p className="tm-hero-sub">
            Activa tu mejor versión física y mental.
          </p>

          <div className="tm-hero-ctas">
            <button className="tm-btn-primary tm-btn-lg" onClick={() => scrollTo('email-capture')}>
              <Zap size={16} /> Entrar en modo Tealor
            </button>
            <button className="tm-btn-ghost tm-btn-lg" onClick={() => scrollTo('metodo')}>
              Ver el método <ChevronDown size={16} />
            </button>
          </div>
        </div>

        <div className="tm-hero-scroll-hint" onClick={() => scrollTo('metodo')}>
          <ChevronDown size={20} />
        </div>
      </section>

      {/* ── QUÉ ES TEALOR MODE ──────────────────────── */}
      <section className="tm-section tm-what" id="metodo">
        <div className="tm-container">
          <span className="tm-section-eyebrow">El movimiento</span>
          <h2 className="tm-section-title">
            Tealor Mode no es fitness<br />tradicional.
          </h2>
          <p className="tm-what-text">
            Es un sistema completo de mejora física y mental. Sin dietas de moda,
            sin cardio inútil, sin motivación vacía. Solo protocolos que funcionan
            —respaldados por evidencia, diseñados para durar.
          </p>
          <p className="tm-what-text">
            Una comunidad, una metodología, un modo de vida.
          </p>
        </div>
      </section>

      {/* ── 3 PILARES ───────────────────────────────── */}
      <section className="tm-section tm-pillars">
        <div className="tm-container">
          <span className="tm-section-eyebrow">Los pilares</span>
          <h2 className="tm-section-title">Todo empieza aquí.</h2>
          <div className="tm-pillars-grid">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div className="tm-pillar-card" key={i}>
                  <div className="tm-pillar-icon">
                    <Icon size={28} />
                  </div>
                  <h3 className="tm-pillar-title">{p.label}</h3>
                  <p className="tm-pillar-desc">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── NO ES MOTIVACIÓN ────────────────────────── */}
      <section className="tm-section tm-manifesto">
        <div className="tm-container tm-manifesto-inner">
          <div className="tm-manifesto-line" />
          <p className="tm-manifesto-quote">
            No es motivación.<br />
            <span className="tm-accent">Es sistema.</span>
          </p>
          <p className="tm-manifesto-sub">
            La motivación llega y se va. Un sistema te hace progresar
            incluso los días que no tienes ganas.
            Tealor Mode te da la estructura.
          </p>
          <div className="tm-manifesto-line" />
        </div>
      </section>

      {/* ── LEAD MAGNET / EMAIL CAPTURE ─────────────── */}
      <section className="tm-section tm-capture" id="email-capture">
        <div className="tm-container">
          <div className="tm-capture-card">
            <span className="tm-capture-badge">
              <Download size={12} /> PDF Gratuito
            </span>
            <h2 className="tm-capture-title">
              Protocolo ABS<br />Guía de Recomposición Corporal
            </h2>
            <p className="tm-capture-sub">
              Deja tu email. Accede al sistema en segundos.
            </p>
            <ul className="tm-capture-bullets">
              <li><span className="tm-bullet-dot" /> Los 3 principios que determinan el 80% de tu progreso</li>
              <li><span className="tm-bullet-dot" /> El protocolo semanal exacto para ver cambios reales</li>
              <li><span className="tm-bullet-dot" /> Los errores que sabotean tu transformación (y cómo evitarlos)</li>
            </ul>

            {error && <p className="tm-error">{error}</p>}

            <form onSubmit={(e) => handleEmailSubmit(e, 'main_form')} className="tm-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="tm-input"
                required
                disabled={loading}
                aria-label="Tu dirección de email"
              />
              <button type="submit" className="tm-btn-primary tm-btn-lg" disabled={loading}>
                {loading ? 'Procesando…' : <><Mail size={16} /> Quiero mi guía gratis</>}
              </button>
            </form>

            <p className="tm-trust">
              <CheckCircle2 size={14} /> Sin spam. Solo lo que funciona.
            </p>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────── */}
      <section className="tm-section tm-final">
        <div className="tm-container">
          <div className="tm-final-card">
            <h2 className="tm-final-title">
              ¿Dentro de 6 meses seguirás igual<br />—o habrás cambiado?
            </h2>
            <p className="tm-final-sub">
              El sistema es gratuito. El primer paso eres tú.
            </p>
            <button className="tm-btn-primary tm-btn-lg" onClick={() => scrollTo('email-capture')}>
              <ArrowRight size={16} /> Empezar ahora, es gratis
            </button>
          </div>
        </div>
      </section>

      {/* ── SOCIAL ──────────────────────────────────── */}
      <section className="tm-section tm-social-section">
        <div className="tm-container">
          <p className="tm-social-label">Contenido diario en redes</p>
          <div className="tm-social-btns">
            {socialLinks.map((l) => {
              const Icon = l.icon;
              return (
                <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer"
                   className="tm-social-link" onClick={() => handleSocialClick(l.platform)}>
                  <Icon size={18} /> {l.platform}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="tm-footer">
        <div className="tm-footer-inner">
          <div>
            <p className="tm-footer-brand">Tealor Mode</p>
            <p className="tm-footer-tagline">Sistema basado en ciencia</p>
          </div>
          <div>
            <p className="tm-footer-label">Contacto</p>
            <a href="mailto:info@tealormode.com" className="tm-footer-email">info@tealormode.com</a>
          </div>
          <div>
            <p className="tm-footer-label">Colaboraciones</p>
            <p className="tm-footer-collab">Para propuestas comerciales, escríbenos al correo.</p>
          </div>
        </div>
        <div className="tm-footer-bottom">
          <p>© 2026 Tealor Mode. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
