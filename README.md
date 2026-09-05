# Folio

A resume builder with an editor on one side and a live preview on the other.

## Features

- Personal details, profile, experience, education, skills, and projects
- Add, remove, and reorder sections
- Modern, classic, minimal, and professional templates
- English, Spanish, and French interface
- Browser autosave
- A4 printing and PDF download

## Run locally

Requires Node.js 22.13 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed in the terminal.

```sh
npm run build
npm run start
```

The production build targets Cloudflare Workers through Vinext.

## Project structure

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Landing page |
| `app/editor/page.tsx` | Editor and export flow |
| `components/resume-preview.tsx` | Resume rendering |
| `lib/resume.ts` | Data model, example content, and templates |
| `lib/i18n.ts` | Translations |
| `components/language.tsx` | Language selection |
| `app/globals.css` | Layout, template styles, and print rules |

To add a template, register its key in `lib/resume.ts`, add a label to each translation dictionary, and define its styles in `app/globals.css`. Templates share the same content and section order.

## Storage

Resume data stays in localStorage on the current browser and device. There is no account system or server sync. Switching the interface language does not translate resume content. The included resume is fictional sample data.

Clearing browser storage removes saved resumes.

## PDF export

Downloads use html2pdf.js with A4 pages and 12 mm margins. The PDF contains rendered images, so its text is not selectable. Use the Print button and your browser's Save as PDF option when you need selectable text.

Long entries can span pages. Check the exported document before sending it.

## Checks

```sh
npx tsc --noEmit
npm run build
```
