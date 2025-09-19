declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: Record<string, unknown>;
    jsPDF?: Record<string, unknown>;
    pagebreak?: Record<string, unknown>;
  }

  interface Html2Pdf {
    set: (options: Html2PdfOptions) => Html2Pdf;
    from: (element: HTMLElement | string) => Html2Pdf;
    save: () => Promise<void>;
  }

  interface Html2PdfFactory {
    (): Html2Pdf;
    set: (options: Html2PdfOptions) => Html2Pdf;
    from: (element: HTMLElement | string) => Html2Pdf;
  }

  const html2pdf: Html2PdfFactory;
  export default html2pdf;
}
