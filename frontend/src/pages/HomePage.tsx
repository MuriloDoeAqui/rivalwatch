import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { createLead } from '../services/leadsService';
import { useToast } from '../components/ui/Toast';

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth' });
}

export function HomePage() {
  const { push } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailValid = useMemo(() => email.trim().length > 3 && email.includes('@'), [email]);

  const submitLead = async () => {
    if (!emailValid) {
      push({ variant: 'error', title: 'E-mail inválido', description: 'Digite um e-mail válido para entrar na lista.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await createLead({ email: email.trim().toLowerCase() });
      setEmail('');
      push({ variant: 'success', title: 'Você está na lista!', description: 'Te avisaremos quando houver novidades.' });
    } catch (err) {
      push({
        variant: 'error',
        title: 'Não foi possível enviar',
        description:
          err instanceof Error
            ? err.message
            : 'Verifique se a tabela "leads" existe e se há policy de INSERT (RLS).',
        durationMs: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="landing">
      <nav>
        <div className="logo">
          Rival<span>Watch</span>
        </div>
        <ul>
          <li>
            <a
              href="#como"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('como');
              }}
            >
              Como funciona
            </a>
          </li>
          <li>
            <a
              href="#funcionalidades"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('funcionalidades');
              }}
            >
              Funcionalidades
            </a>
          </li>
          <li>
            <a
              href="#precos"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('precos');
              }}
            >
              Preços
            </a>
          </li>
          <li>
            <a
              href="#comecar"
              className="nav-cta"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('comecar');
              }}
            >
              [ começar grátis ]
            </a>
          </li>
        </ul>
        <div className="hidden sm:flex items-center gap-3">
          <Link to="/login" className="text-sm text-zinc-300 hover:text-white">
            Entrar
          </Link>
          <Link to="/register" className="text-sm font-semibold text-[#0b0c10] bg-[#b8ff57] px-4 py-2 rounded-md">
            Criar conta
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="glow" />

        <div className="ticker">
          <div className="ticker-dot" />
          MONITORAMENTO EM TEMPO REAL · 3 concorrentes detectaram mudanças hoje
        </div>

        <h1>
          Saiba antes
          <br />
          de <span className="highlight">todo mundo.</span>
        </h1>

        <p className="hero-sub">
          Nossa IA monitora os sites, preços e conteúdos dos seus concorrentes 24/7 e entrega um resumo inteligente toda
          semana. Sem trabalho manual.
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={() => scrollToId('comecar')}>
            → Monitorar grátis
          </button>
          <button className="btn-outline" onClick={() => scrollToId('como')}>
            Ver demo
          </button>
        </div>

        <div className="live-feed">
          <div className="feed-header">
            <div className="ticker-dot" />
            FEED AO VIVO — últimas detecções
          </div>

          <div className="alert-row" style={{ animationDelay: '0.1s' }}>
            <div className="alert-icon" style={{ background: 'rgba(255,77,109,0.12)' }}>
              💲
            </div>
            <div className="alert-text">
              <div className="alert-name">Concorrente Alpha</div>
              <div className="alert-desc">Plano Pro: R$99 → R$79 — redução de 20%</div>
            </div>
            <span className="badge badge-red">Preço</span>
            <span className="time-label">2h atrás</span>
          </div>

          <div className="alert-row" style={{ animationDelay: '0.2s' }}>
            <div className="alert-icon" style={{ background: 'rgba(255,190,11,0.12)' }}>
              🚀
            </div>
            <div className="alert-text">
              <div className="alert-name">BetaCorp</div>
              <div className="alert-desc">Nova feature: integração nativa com Slack anunciada</div>
            </div>
            <span className="badge badge-amber">Feature</span>
            <span className="time-label">5h atrás</span>
          </div>

          <div className="alert-row" style={{ animationDelay: '0.3s' }}>
            <div className="alert-icon" style={{ background: 'rgba(184,255,87,0.08)' }}>
              📝
            </div>
            <div className="alert-text">
              <div className="alert-name">Gamma SaaS</div>
              <div className="alert-desc">Blog: "10 razões para migrar em 2025" publicado</div>
            </div>
            <span className="badge badge-green">Conteúdo</span>
            <span className="time-label">1d atrás</span>
          </div>
        </div>
      </section>

      <section className="section" id="como">
        <div className="label">// como funciona</div>
        <h2 className="section-title">
          Configure em
          <br />5 minutos.
        </h2>
        <p className="section-sub">Sem código. Sem planilhas. Só inteligência.</p>

        <div className="how-grid">
          <div className="how-step">
            <div className="step-n">01 /</div>
            <div className="step-icon">🔗</div>
            <div className="step-title">Adicione concorrentes</div>
            <p className="step-desc">
              Cole o URL de cada concorrente. Nós cuidamos do resto — detectamos automaticamente as páginas mais
              relevantes.
            </p>
          </div>
          <div className="how-step">
            <div className="step-n">02 /</div>
            <div className="step-icon">👁️</div>
            <div className="step-title">Monitoramento 24/7</div>
            <p className="step-desc">
              Nossa infraestrutura verifica sites, preços, redes sociais e changelogs de forma contínua e silenciosa.
            </p>
          </div>
          <div className="how-step">
            <div className="step-n">03 /</div>
            <div className="step-icon">🤖</div>
            <div className="step-title">IA analisa tudo</div>
            <p className="step-desc">
              Quando detectamos mudanças, a IA avalia o impacto e classifica por relevância — do mais crítico ao
              informativo.
            </p>
          </div>
          <div className="how-step">
            <div className="step-n">04 /</div>
            <div className="step-icon">📧</div>
            <div className="step-title">Você recebe o resumo</div>
            <p className="step-desc">
              Um email semanal (ou alerta imediato para mudanças críticas) com análise em linguagem humana e recomendações.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="funcionalidades" style={{ paddingTop: 0 }}>
        <div className="label">// funcionalidades</div>
        <h2 className="section-title">
          Inteligência
          <br />
          competitiva real.
        </h2>

        <div className="feat-grid">
          <div className="feat">
            <div>
              <div className="feat-icon">🧠</div>
              <div className="feat-title">Resumo executivo com IA</div>
              <p className="feat-desc">
                A cada semana, a IA transforma centenas de mudanças em um briefing claro e acionável. Você lê em 2 minutos
                e toma decisões melhores.
              </p>
            </div>
            <div className="report-preview">
              <div className="report-tag">▶ INSIGHT DA SEMANA</div>
              <p>
                O <strong>Concorrente Alpha</strong> reduziu preços em 20% — provável pressão por aquisição. Considere
                reforçar seu posicionamento de valor antes de reagir com desconto. A <strong>BetaCorp</strong> está atacando
                seu mercado com conteúdo de migração.
              </p>
            </div>
          </div>

          <div className="feat">
            <div className="feat-icon">💲</div>
            <div className="feat-title">Tracker de preços</div>
            <p className="feat-desc">
              Cada alteração de planos, preços ou páginas de pricing é detectada e comparada com o histórico. Nunca mais
              seja pego de surpresa.
            </p>
          </div>

          <div className="feat">
            <div className="feat-icon">🚀</div>
            <div className="feat-title">Radar de features</div>
            <p className="feat-desc">
              Changelogs, release notes e anúncios monitorados automaticamente. Saiba o que eles lançaram antes do seu
              cliente mencionar.
            </p>
          </div>

          <div className="feat">
            <div className="feat-icon">📣</div>
            <div className="feat-title">Monitoramento social</div>
            <p className="feat-desc">
              Posts com mais engajamento, campanhas novas e menções relevantes das suas palavras-chave nas redes dos
              concorrentes.
            </p>
          </div>

          <div className="feat">
            <div className="feat-icon">⚡</div>
            <div className="feat-title">Alertas em tempo real</div>
            <p className="feat-desc">
              Para mudanças de alta prioridade (queda de preço, novo lançamento), alertas imediatos por email ou Slack.
            </p>
          </div>

          <div className="feat">
            <div className="feat-icon">📊</div>
            <div className="feat-title">Histórico completo</div>
            <p className="feat-desc">
              Todo o histórico de mudanças salvo e pesquisável. Compare o estado do site de um concorrente hoje vs. 6 meses
              atrás.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING — único plano grátis (Beta). Removidos Starter/Growth/Agency */}
      <div className="pricing-wrap" id="precos">
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="label">// preços</div>
          <h2 className="section-title" style={{ fontSize: 'clamp(40px,5vw,64px)' }}>
            Escolha seu plano.
          </h2>
          <p style={{ color: 'rgba(240,237,232,0.45)', fontSize: 17, fontWeight: 300 }}>
            Comece grátis. Sem cartão de crédito.
          </p>
        </div>

        <div className="pricing-grid">
          <div className="plan featured">
            <div className="plan-name">Beta</div>
            <div className="plan-price">Grátis</div>
            <div className="plan-period">Acesso gratuito em fase beta do RivalWatch</div>
            <ul className="plan-features">
              <li>Cadastro e login</li>
              <li>CRUD de concorrentes</li>
              <li>Dashboard + relatórios básicos</li>
              <li>Atualizações contínuas durante o beta</li>
            </ul>
            <Link to="/register" className="plan-btn" style={{ display: 'inline-block', textAlign: 'center' }}>
              → Começar grátis
            </Link>
          </div>
        </div>
      </div>

      <div className="cta-wrap" id="comecar">
        <h2>
          Seus concorrentes
          <br />
          <span style={{ color: '#b8ff57', fontStyle: 'italic' }}>não esperam.</span>
        </h2>
        <p>Entre na lista de early access e receba novidades do RivalWatch.</p>

        <div className="email-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            disabled={isSubmitting}
          />
          <button className="btn-primary" onClick={() => void submitLead()} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : '→ Entrar'}
          </button>
        </div>

        <p
          style={{
            fontSize: 13,
            color: 'rgba(240,237,232,0.45)',
            marginTop: 16,
            fontFamily: 'Space Mono, monospace',
          }}
        >
          SEM SPAM · SEM CARTÃO · VOCÊ ESCOLHE QUANDO SAIR
        </p>
      </div>

      <footer>
        <div className="logo" style={{ fontSize: 16 }}>
          Rival<span style={{ color: '#b8ff57' }}>Watch</span>
        </div>
        <div>© {new Date().getFullYear()} RivalWatch</div>
        <div>BUILT IN 🇧🇷</div>
      </footer>
    </div>
  );
}

