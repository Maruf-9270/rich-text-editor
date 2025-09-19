"use client";

import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { useReactToPrint } from "react-to-print";
import styles from "./RichTextEditor.module.css";

type RichTextEditorProps = {
  defaultTitle?: string;
  initialContent?: string;
};

const ALIGN_OPTIONS = [
  { label: "Align left", value: "left", icon: "↤" },
  { label: "Center", value: "center", icon: "↔" },
  { label: "Align right", value: "right", icon: "↦" },
  { label: "Justify", value: "justify", icon: "≋" },
];

type HeadingLevel = 1 | 2 | 3 | 4;
type HeadingOption = { label: string; level: 0 | HeadingLevel };

const DEFAULT_TEXT_COLOR = "#1f2937";

export default function RichTextEditor({
  defaultTitle = "Untitled document",
  initialContent,
}: RichTextEditorProps) {
  const [documentTitle, setDocumentTitle] = useState(defaultTitle);
  const [resetCounter, setResetCounter] = useState(0);
  const [currentColor, setCurrentColor] = useState<string>(DEFAULT_TEXT_COLOR);
  const printAreaRef = useRef<HTMLDivElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your document…",
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: initialContent ?? "<p></p>",
    autofocus: "end",
    editorProps: {
      attributes: {
        class: styles.proseMirror,
      },
    },
    onUpdate: ({ editor }) => {
      const hex = editor.getAttributes("textStyle").color as string | undefined;
      setCurrentColor(hex && /^#/.test(hex) ? hex : DEFAULT_TEXT_COLOR);
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const handleSelection = () => {
      const hex = editor.getAttributes("textStyle").color as string | undefined;
      setCurrentColor(hex && /^#/.test(hex) ? hex : DEFAULT_TEXT_COLOR);
    };

    editor.on("selectionUpdate", handleSelection);
    editor.on("transaction", handleSelection);

    return () => {
      editor.off("selectionUpdate", handleSelection);
      editor.off("transaction", handleSelection);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (resetCounter === 0) {
      return;
    }

    editor.commands.setContent(initialContent ?? "<p></p>");
    editor.commands.focus("end");
  }, [editor, initialContent, resetCounter]);

  const handlePrint = useReactToPrint({
    contentRef: printAreaRef,
    documentTitle: documentTitle || "Document",
  });

  const handleDownload = useCallback(async () => {
    if (!printAreaRef.current) {
      return;
    }

    const { default: html2pdf } = await import("html2pdf.js");

    await html2pdf()
      .set({

        margin: 0,
        filename: `${documentTitle || "document"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: [8.27, 11.69], orientation: "portrait" },

        pagebreak: { mode: ["css", "legacy"] },
      })
      .from(printAreaRef.current)
      .save();
  }, [documentTitle]);

  const setAlignment = useCallback(
    (alignment: string) => {
      editor?.chain().focus().setTextAlign(alignment).run();
    },
    [editor],
  );

  const isAligned = useCallback(
    (alignment: string) => editor?.isActive({ textAlign: alignment }) ?? false,
    [editor],
  );

  const headingButtons = useMemo<HeadingOption[]>(
    () => [
      { label: "Normal text", level: 0 },
      { label: "Heading 1", level: 1 },
      { label: "Heading 2", level: 2 },
      { label: "Heading 3", level: 3 },
    ],
    [],
  );

  const onColorChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setCurrentColor(value);
      editor?.chain().focus().setColor(value).run();
    },
    [editor],
  );

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.container}>
      <header className={styles.topBar} data-no-print="true">
        <input
          aria-label="Document title"
          className={styles.titleInput}
          value={documentTitle}
          onChange={(event) => setDocumentTitle(event.target.value)}
          placeholder="Untitled document"
        />
        <div className={styles.topBarActions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              setResetCounter((count) => count + 1);
              setDocumentTitle(defaultTitle);
              setCurrentColor(DEFAULT_TEXT_COLOR);
            }}
          >
            Load default template
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              editor.chain().focus().selectAll().unsetAllMarks().clearNodes().run();
              editor.chain().focus().setTextAlign("left").run();
              setCurrentColor(DEFAULT_TEXT_COLOR);
            }}
          >
            Clear formatting
          </button>
          <button type="button" className={styles.primaryButton} onClick={handlePrint}>
            Print / Save as PDF
          </button>
          <button type="button" className={styles.primaryButton} onClick={() => void handleDownload()}>
            Download PDF
          </button>
        </div>
      </header>

      <div className={styles.toolbar} data-no-print="true">
        <button
          type="button"
          className={editor.isActive("bold") ? styles.toolbarButtonActive : styles.toolbarButton}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          B
        </button>
        <button
          type="button"
          className={editor.isActive("italic") ? styles.toolbarButtonActive : styles.toolbarButton}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          I
        </button>
        <button
          type="button"
          className={editor.isActive("underline") ? styles.toolbarButtonActive : styles.toolbarButton}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline"
        >
          U
        </button>
        <button
          type="button"
          className={editor.isActive("strike") ? styles.toolbarButtonActive : styles.toolbarButton}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          aria-label="Strikethrough"
        >
          S
        </button>
        <div className={styles.divider} aria-hidden="true" />
        <button
          type="button"
          className={editor.isActive("bulletList") ? styles.toolbarButtonActive : styles.toolbarButton}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bulleted list"
        >
          ••
        </button>
        <button
          type="button"
          className={editor.isActive("orderedList") ? styles.toolbarButtonActive : styles.toolbarButton}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Numbered list"
        >
          1.
        </button>
        <button
          type="button"
          className={editor.isActive("blockquote") ? styles.toolbarButtonActive : styles.toolbarButton}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Block quote"
        >
          ❝
        </button>
        <div className={styles.divider} aria-hidden="true" />
        {headingButtons.map(({ label, level }) => (
          <button
            key={label}
            type="button"
            className={
              (level === 0 && editor.isActive("paragraph")) ||
              (level > 0 && editor.isActive("heading", { level }))
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => {
              if (level === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: level as HeadingLevel })
                  .run();
              }
            }}
          >
            {label.replace("Heading ", "H")}
          </button>
        ))}
        <div className={styles.divider} aria-hidden="true" />
        {ALIGN_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={isAligned(option.value) ? styles.toolbarButtonActive : styles.toolbarButton}
            onClick={() => setAlignment(option.value)}
            aria-label={option.label}
          >
            {option.icon}
          </button>
        ))}
        <label className={styles.colorPicker}>
          <span>Color</span>
          <input type="color" value={currentColor} onChange={onColorChange} />
        </label>
        <div className={styles.divider} aria-hidden="true" />
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => editor.chain().focus().undo().run()}
          aria-label="Undo"
        >
          ↺
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => editor.chain().focus().redo().run()}
          aria-label="Redo"
        >
          ↻
        </button>
      </div>

      <div className={styles.editorFrame}>
        <div className={`${styles.pageSurface} print-page`} ref={printAreaRef}>
          <EditorContent editor={editor} className={styles.editorContent} />
        </div>
      </div>
    </div>
  );
}
