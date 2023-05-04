import "github-markdown-css/github-markdown-dark.css";
import CodeMirror from "@uiw/react-codemirror";
import {
  markdown,
  markdownLanguage,
} from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { vim } from "@replit/codemirror-vim";

import "highlight.js/styles/github-dark-dimmed.css";
import { EditorView } from "codemirror";
import {
  githubDark,
  githubDarkInit,
} from "@uiw/codemirror-theme-github";

type EditorProps = {
  markText: string;
  onTextChange: (value: string) => void;
};
import { Prec } from "@codemirror/state";

const EditorTheme = Prec.highest(
  EditorView.theme({
    "&": {
      fontSize: "14pt",
    },
    ".cm-content": {
      fontFamily: "Avenir Next, system-ui, sans-serif",
      minHeight: "200px",
    },
    ".cm-gutters": {
      minHeight: "200px",
    },
    ".cm-scroller": {
      overflow: "auto",
      maxHeight: "600px",
    },
    ".cm-fat-cursor": {
      position: "absolute",
      background: "#AEAFAD",
      border: "none",
      whiteSpace: "pre",
    },
    "&:not(.cm-focused) .cm-fat-cursor": {
      background: "none",
      outline: "solid 1px #AEAFAD",
      color: "transparent !important",
    },
  })
);

import { tags as t } from "@lezer/highlight";

const myTheme = githubDarkInit({
  settings: {
    background: "transparent",
  },
  styles: [
    { tag: [t.heading], color: "#89BEFA", fontWeight: "bold" },
    { tag: t.link, color: "#89BEFA" },
  ],
});

import "../bearstyle.css";

const Editor = ({ markText, onTextChange }: EditorProps) => {
  return (
    <CodeMirror
      value={markText}
      onChange={onTextChange}
      theme={myTheme}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        highlightActiveLine: false,
      }}
      extensions={[
        EditorTheme,
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
        }),
        EditorView.lineWrapping,
        vim(),
      ]}
    />
  );
};

export default Editor;
