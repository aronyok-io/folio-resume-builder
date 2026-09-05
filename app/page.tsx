'use client';
import { LanguageSelect, useLanguage } from '@/components/language';
import {
  ArrowRight,
  FileText,
  Check,
  Download,
  Globe,
  Sparkles,
} from 'lucide-react';
export default function Home() {
  const { t } = useLanguage();
  return (
    <>
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-icon">
            <FileText size={23} />
          </span>
          folio<span className="brand-dot">.</span>
        </a>
        <nav>
          <LanguageSelect />
          <a href="#templates">{t('templates')}</a>
          <a className="button small" href="/editor">
            {t('builder')} <ArrowRight size={16} />
          </a>
        </nav>
      </header>
      <main className="landing">
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> {t('tag')}
          </div>
          <h1>
            {t('hero1')}
            <br />
            {t('hero2')}
            <br />
            <em>{t('hero3')}</em>
          </h1>
          <p>{t('intro')}</p>
          <a className="button" href="/editor">
            {t('create')} <ArrowRight size={19} />
          </a>
          <div className="hero-notes">
            <span>
              <Check size={15} /> {t('free')}
            </span>
            <span>
              <Check size={15} /> {t('account')}
            </span>
          </div>
        </div>
        <div className="hero-art">
          <div className="floating-note">
            <Sparkles size={19} /> {t('polish')}
          </div>
          <article className="sample-paper">
            <div className="sample-mark">AM</div>
            <h2>Alex Morgan</h2>
            <h3>Product Designer</h3>
            <p>alex.morgan@example.com · San Francisco, CA</p>
            <hr />
            <h4>{t('summary')}</h4>
            <p>
              Thoughtful product designer turning complex challenges into
              simple, meaningful experiences.
            </p>
            <h4>{t('experience')}</h4>
            <b>Senior Product Designer</b>
            <p>Studio North · 2022 - Present</p>
            <p>
              Led end-to-end design for digital products used by over 50,000
              people. Built a design system that helped teams move with clarity
              and confidence.
            </p>
            <b>Product Designer</b>
            <p>Forma · 2019 - 2022</p>
            <h4>{t('education')}</h4>
            <b>B.A. in Interaction Design</b>
            <p>California College of the Arts · 2019</p>
            <h4>{t('skills')}</h4>
            <p>Product strategy · User research · Prototyping · Figma</p>
          </article>
          <div className="a4-badge">
            <Check size={17} /> {t('a4')}
          </div>
        </div>
      </main>
      <section className="template-section" id="templates">
        <div>
          <span className="eyebrow">{t('yours')}</span>
          <h2>{t('four')}</h2>
        </div>
        <div className="template-grid">
          {['Modern', 'Classic', 'Minimal', 'Professional'].map((name, i) => (
            <a
              key={name}
              href={'/editor?template=' + name.toLowerCase()}
              className="template-card"
            >
              <div className={'mini-paper mini-' + i}>
                <strong>ALEX MORGAN</strong>
                <i />
                {[0, 1, 2].map((n) => (
                  <div key={n}>
                    <b />
                    <span />
                    <span />
                    <span />
                  </div>
                ))}
              </div>
              <div className="template-caption">
                <b>
                  {t(
                    name.toLowerCase() as
                      | 'modern'
                      | 'classic'
                      | 'minimal'
                      | 'professional',
                  )}
                </b>
                <ArrowRight size={18} />
              </div>
            </a>
          ))}
        </div>
      </section>
      <footer>
        <span className="brand">folio.</span>
        <span>{t('story')}</span>
        <span>{t('move')}</span>
      </footer>
    </>
  );
}
