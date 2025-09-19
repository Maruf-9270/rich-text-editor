# Rich Text PDF Editor

A Google Docs-inspired WYSIWYG editor built with Next.js 14.2. The editor offers a rich formatting experience, optional default
content, and exports pixel-perfect PDFs that mirror the on-screen layout when printed or downloaded.

## Features

- 🎯 **True WYSIWYG layout** – page-sized canvas (A4) with print styles that keep alignment identical on screen and on paper.
- 🛠️ **Productivity toolbar** – headings, lists, alignment, block quotes, colours, undo/redo, and formatting reset.
- 📝 **Default template loader** – instantly preload an example brief and reset the document title.
- 🖨️ **Print and PDF** – use the browser print dialog via `react-to-print` or generate a PDF directly with `html2pdf.js`.

## Getting started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) to work with the editor. The page lives at `app/page.tsx` and hot reloads
as you change the source code.

## Building for production

Create an optimised build and output static assets:

```bash
npm run build
npm run start
```

The build command pre-renders the editor and verifies the TypeScript/ESLint configuration.

## Printing and PDF tips

- Use **Print / Save as PDF** to open the browser print dialog and choose “Save as PDF” for a native export that keeps the exact
  layout.
- Use **Download PDF** for a one-click PDF that mirrors the preview by rendering the page via `html2pdf.js`.
- Toolbar options such as alignment and colours apply to the selected text and are preserved in both export flows.

## Tech stack

- [Next.js 14.2 App Router](https://nextjs.org/docs/app) with TypeScript
- [Tiptap](https://tiptap.dev/) rich text editor
- [react-to-print](https://github.com/gregnb/react-to-print) and [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/) for
  export workflows

## License

This project is provided as-is for demonstration purposes.
