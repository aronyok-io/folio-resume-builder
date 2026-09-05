'use client';
import { forwardRef } from 'react';
import { Resume } from '@/lib/resume';
import { useLanguage } from './language';
export const ResumePreview = forwardRef<HTMLElement, { resume: Resume }>(
  function ResumePreview({ resume }, ref) {
    const { t } = useLanguage();
    const p = resume.personal;
    return (
      <article ref={ref} className={'resume-paper ' + resume.template}>
        <header className="resume-heading">
          <h1>{p.name || t('name')}</h1>
          <h2>{p.role}</h2>
          <div className="contact">
            {['email', 'phone', 'location', 'website'].map(
              (k) => p[k] && <span key={k}>{p[k]}</span>,
            )}
          </div>
        </header>
        {resume.sections.map((s) => (
          <section className="resume-section" key={s.id}>
            <h3>{t(s.kind)}</h3>
            {s.kind === 'skills' ? (
              <div className="skill-list">
                {s.text
                  .split(',')
                  .filter((x) => x.trim())
                  .map((x, i) => (
                    <span key={i}>{x.trim()}</span>
                  ))}
              </div>
            ) : s.kind === 'summary' ? (
              <p>{s.text}</p>
            ) : (
              s.entries.map((e) => (
                <div className="resume-entry" key={e.id}>
                  <div className="entry-heading">
                    <h4>{e.title}</h4>
                    <span>{e.dates}</span>
                  </div>
                  <h5>{e.organization}</h5>
                  {e.description && (
                    <ul>
                      {e.description
                        .split('\n')
                        .filter(Boolean)
                        .map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </section>
        ))}
      </article>
    );
  },
);
