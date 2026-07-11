[![CI](https://github.com/loco-lang/loco-vscode/actions/workflows/ci.yml/badge.svg)](https://github.com/loco-lang/loco-vscode/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue)](https://github.com/loco-lang/loco-vscode)

# Loco for VS Code

Loco language support for Visual Studio Code.

## Features

- **Syntax highlighting** — keywords, strings, numbers, comments, types, operators, attributes
- **Document symbols** — outline panel shows procedures, composites, routes, automations, bindings, and states
- **Code completion** — keyword suggestions and document-wide identifier completion
- **Syntax diagnostics** — real-time error highlighting via tree-sitter parsing
- **Code snippets** — 14 snippets for common Loco constructs (proc, composite, actor, route, launch, etc.)
- **Language configuration** — bracket matching, auto-closing, comment toggling

## Requirements

VS Code 1.85.0 or higher.

## Install

### From VS Code Marketplace

Open VS Code → Extensions → Search "Loco" → Install

### From VSIX

1. Download the latest `.vsix` from [Releases](https://github.com/loco-lang/loco-vscode/releases)
2. VS Code → Extensions → `...` → Install from VSIX

## Development

```bash
git clone https://github.com/loco-lang/loco-vscode
cd loco-vscode
npm install
npm run compile
```

Press `F5` to launch a new VS Code window with the extension loaded.

## Building the VSIX

```bash
npm install -g @vscode/vsce
vsce package
```

## Related

- [Tree-sitter grammar](https://github.com/loco-lang/tree-sitter-loco)
- [Loco compiler](https://github.com/loco-lang/loco)
- [All editor extensions](https://github.com/loco-lang/tree-sitter-loco#editor-support)

## License

MIT
