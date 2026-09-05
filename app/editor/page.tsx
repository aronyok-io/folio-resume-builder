'use client';
import { useEffect, useRef, useState } from 'react';
import {
  FileText,
  ArrowLeft,
  Download,
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  UserRound,
  Briefcase,
  GraduationCap,
  Sparkles,
  Folder,
  AlignLeft,
  Printer,
  Eye,
  GripVertical,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { LanguageSelect, useLanguage } from '@/components/language';
import { ResumePreview } from '@/components/resume-preview';
import {
  initial,
  Resume,
  Section,
  Kind,
  kinds,
  templates,
  validResume,
} from '@/lib/resume';
import { Key } from '@/lib/i18n';
const icons = {
  summary: AlignLeft,
  experience: Briefcase,
  education: GraduationCap,
  skills: Sparkles,
  projects: Folder,
};
export default function Editor() {
  const { t } = useLanguage();
  const [r, setR] = useState<Resume>(initial);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(true);
  const [storageError, setStorageError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [active, setActive] = useState('personal');
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('folio-resume-v1');
      if (raw) {
        const value = JSON.parse(raw);
        if (validResume(value)) setR(value);
      }
    } catch {}
    const template = new URLSearchParams(location.search).get('template');
    if (templates.includes(template as (typeof templates)[number]))
      setR((v) => ({ ...v, template: template! }));
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    setSaved(false);
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('folio-resume-v1', JSON.stringify(r));
        setStorageError(false);
        setSaved(true);
      } catch {
        setStorageError(true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [r, ready]);
  function section(id: string, fn: (s: Section) => Section) {
    setR((v) => ({
      ...v,
      sections: v.sections.map((s) => (s.id === id ? fn(s) : s)),
    }));
  }
  function move(i: number, d: number) {
    setR((v) => {
      const sections = [...v.sections];
      [sections[i], sections[i + d]] = [sections[i + d], sections[i]];
      return { ...v, sections };
    });
  }
  function add(kind: Kind) {
    const id = crypto.randomUUID();
    setR((v) => ({
      ...v,
      sections: [...v.sections, { id, kind, text: '', entries: [] }],
    }));
    setActive(id);
  }
  async function download() {
    if (!ref.current) return;
    setBusy(true);
    setError(false);
    try {
      await document.fonts.ready;
      const html2pdf = (await import('html2pdf.js')).default;
      const clone = ref.current.cloneNode(true) as HTMLElement;
      clone.style.width = '186mm';
      clone.style.minHeight = '0';
      clone.style.padding = '0';
      clone.style.boxShadow = 'none';
      clone.style.margin = '0';
      clone.style.aspectRatio = 'auto';
      const heading = clone.querySelector('.resume-heading') as HTMLElement;
      if (r.template === 'professional' && heading)
        heading.style.margin = '0 0 25px';
      await html2pdf()
        .set({
          margin: 12,
          filename:
            (r.personal.name || 'resume').replace(/[^\p{L}\p{N} _-]/gu, '') +
            '.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: {
            mode: ['css'],
            avoid: ['.resume-entry', '.resume-heading', 'h3'],
          },
        })
        .from(clone)
        .save();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="editor-app">
      <header className="topbar editor-top">
        <a className="brand" href="/">
          <span className="brand-icon">
            <FileText size={22} />
          </span>
          folio<span className="brand-dot">.</span>
        </a>
        <div className="document-name">
          {t('resume')}{' '}
          <span className="save-status" role="status">
            <Check size={13} />
            {storageError ? t('saveError') : saved ? t('saved') : t('saving')}
          </span>
        </div>
        <div className="editor-actions">
          <LanguageSelect />
          <button
            className="icon-button print-button"
            aria-label={t('print')}
            onClick={() => window.print()}
          >
            <Printer size={18} />
          </button>
          <button
            className="button small"
            disabled={busy || !ready}
            onClick={download}
          >
            <Download size={16} />
            <span>{t(busy ? 'exporting' : 'export')}</span>
          </button>
        </div>
      </header>
      {error && (
        <div role="alert" className="error-banner">
          {t('exportError')}
        </div>
      )}
      <main className="editor-layout">
        <aside className="editor-pane">
          <Tabs defaultValue="content">
            <TabsList className="editor-tabs">
              <TabsTrigger value="content">
                <AlignLeft size={16} />
                {t('content')}
              </TabsTrigger>
              <TabsTrigger value="design">
                <Sparkles size={16} />
                {t('design')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <div className="section-stack">
                <section className="form-section">
                  <button
                    className={
                      'section-toggle ' +
                      (active === 'personal' ? 'selected' : '')
                    }
                    onClick={() =>
                      setActive(active === 'personal' ? '' : 'personal')
                    }
                  >
                    <span className="section-icon">
                      <UserRound size={18} />
                    </span>
                    <b>{t('personal')}</b>
                    <span className="section-number">01</span>
                  </button>
                  {active === 'personal' && (
                    <div className="fields">
                      <p className="form-hint">{t('personalHint')}</p>
                      <div className="field-grid">
                        {Object.keys(initial.personal).map((k) => (
                          <label
                            key={k}
                            className={
                              ['name', 'role', 'website'].includes(k)
                                ? 'wide'
                                : ''
                            }
                          >
                            {t(k as Key)}
                            <input
                              type={k === 'email' ? 'email' : 'text'}
                              value={r.personal[k]}
                              onChange={(e) =>
                                setR((v) => ({
                                  ...v,
                                  personal: {
                                    ...v.personal,
                                    [k]: e.target.value,
                                  },
                                }))
                              }
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
                {r.sections.map((s, i) => {
                  const Icon = icons[s.kind];
                  return (
                    <section className="form-section" key={s.id}>
                      <div className="section-row">
                        <button
                          className={
                            'section-toggle ' +
                            (active === s.id ? 'selected' : '')
                          }
                          onClick={() => setActive(active === s.id ? '' : s.id)}
                        >
                          <span className="section-icon">
                            <Icon size={18} />
                          </span>
                          <b>{t(s.kind)}</b>
                        </button>
                        <div className="section-tools">
                          <button
                            aria-label={t('up') + ' ' + t(s.kind)}
                            disabled={i === 0}
                            onClick={() => move(i, -1)}
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            aria-label={t('down') + ' ' + t(s.kind)}
                            disabled={i === r.sections.length - 1}
                            onClick={() => move(i, 1)}
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            aria-label={t('remove') + ' ' + t(s.kind)}
                            onClick={() =>
                              setR((v) => ({
                                ...v,
                                sections: v.sections.filter(
                                  (x) => x.id !== s.id,
                                ),
                              }))
                            }
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      {active === s.id && (
                        <div className="fields">
                          {s.kind === 'summary' || s.kind === 'skills' ? (
                            <label>
                              {t(s.kind)}
                              <textarea
                                rows={s.kind === 'skills' ? 4 : 6}
                                value={s.text}
                                onChange={(e) =>
                                  section(s.id, (v) => ({
                                    ...v,
                                    text: e.target.value,
                                  }))
                                }
                              />
                              {s.kind === 'skills' && (
                                <small>{t('skillHint')}</small>
                              )}
                            </label>
                          ) : (
                            <>
                              {s.entries.map((e, j) => (
                                <div className="entry-form" key={e.id}>
                                  <div className="entry-form-heading">
                                    <b>{e.title || t('newEntry')}</b>
                                    <button
                                      className="icon-button"
                                      aria-label={
                                        t('remove') +
                                        ' ' +
                                        (e.title || t('newEntry'))
                                      }
                                      onClick={() =>
                                        section(s.id, (v) => ({
                                          ...v,
                                          entries: v.entries.filter(
                                            (x) => x.id !== e.id,
                                          ),
                                        }))
                                      }
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                  {(
                                    [
                                      'title',
                                      'organization',
                                      'dates',
                                      'description',
                                    ] as const
                                  ).map((k) => (
                                    <label key={k}>
                                      {t(k)}
                                      {k === 'description' ? (
                                        <textarea
                                          rows={4}
                                          value={e[k]}
                                          onChange={(ev) =>
                                            section(s.id, (v) => ({
                                              ...v,
                                              entries: v.entries.map((x) =>
                                                x.id === e.id
                                                  ? {
                                                      ...x,
                                                      [k]: ev.target.value,
                                                    }
                                                  : x,
                                              ),
                                            }))
                                          }
                                        />
                                      ) : (
                                        <input
                                          value={e[k]}
                                          onChange={(ev) =>
                                            section(s.id, (v) => ({
                                              ...v,
                                              entries: v.entries.map((x) =>
                                                x.id === e.id
                                                  ? {
                                                      ...x,
                                                      [k]: ev.target.value,
                                                    }
                                                  : x,
                                              ),
                                            }))
                                          }
                                        />
                                      )}
                                    </label>
                                  ))}
                                </div>
                              ))}
                              <button
                                className="add-entry"
                                onClick={() =>
                                  section(s.id, (v) => ({
                                    ...v,
                                    entries: [
                                      ...v.entries,
                                      {
                                        id: crypto.randomUUID(),
                                        title: '',
                                        organization: '',
                                        dates: '',
                                        description: '',
                                      },
                                    ],
                                  }))
                                }
                              >
                                <Plus size={16} />
                                {t('addEntry')}
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </section>
                  );
                })}
                <Select value={null} onValueChange={(v) => v && add(v as Kind)}>
                  <SelectTrigger className="add-section">
                    <Plus size={17} />
                    <SelectValue placeholder={t('add')} />
                  </SelectTrigger>
                  <SelectContent>
                    {kinds.map((k) => (
                      <SelectItem value={k} key={k}>
                        {t(k)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="privacy-note">{t('local')}</p>
              </div>
            </TabsContent>
            <TabsContent value="design">
              <div className="design-panel">
                <h2>{t('choose')}</h2>
                <p>{t('chooseHint')}</p>
                <RadioGroup
                  value={r.template}
                  onValueChange={(v) =>
                    setR((r) => ({ ...r, template: String(v) }))
                  }
                  className="design-options"
                >
                  {templates.map((name, i) => (
                    <label
                      className={
                        'design-card ' + (r.template === name ? 'chosen' : '')
                      }
                      key={name}
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
                      <div className="design-label">
                        <span>{t(name)}</span>
                        <RadioGroupItem value={name} />
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </TabsContent>
          </Tabs>
        </aside>
        <section className="preview-pane">
          <div className="preview-toolbar">
            <div>
              <Eye size={16} />
              <b>{t('preview')}</b>
              <span className="live-dot" />
            </div>
            <span>A4 · 210 × 297 mm</span>
          </div>
          <div className="paper-scroll">
            <ResumePreview ref={ref} resume={r} />
          </div>
          <p className="preview-footer">
            {t('previewHint')} · {t(r.template as Key)}
          </p>
        </section>
      </main>
    </div>
  );
}
