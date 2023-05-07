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
    background: "#1E2021",
  },
  styles: [
    { tag: [t.heading], color: "#89BEFA", fontWeight: "bold" },
    { tag: t.link, color: "#89BEFA" },
  ],
});

import "../bearstyle.css";
import { Box } from "@chakra-ui/react";
import { useReduxDispatch, useReduxSelector } from "../redux/hooks";
import { globalRawTextChange } from "../features/notes/noteSlice";

const Editor = () => {
  const rawText = useReduxSelector(
    (state) => state.markdownParser.rawText
  );
  const dispatch = useReduxDispatch();

  return (
    <Box maxHeight="100vh" overflowY="auto" pb={200}>
      <CodeMirror
        value={rawText}
        onChange={(value) => {
          dispatch(
            globalRawTextChange({
              rawText: value,
            })
          );
        }}
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
    </Box>
  );
};

export default Editor;
