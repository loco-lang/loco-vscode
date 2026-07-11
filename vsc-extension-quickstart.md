# Rail VSCode Extension — Developer Quickstart

Welcome to the Rail VSCode extension! This guide gets you set up for development.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm (comes with Node.js)
- Visual Studio Code
- The [Rail compiler](https://github.com/rail-lang/rail) (optional, for testing compiled output)

## Setup

```bash
# Clone the repository
git clone <repo-url>
cd rail-vscode-extension

# Install dependencies
npm install

# Compile TypeScript
npm run compile
```

## Running the extension

1. Open this directory in VSCode
2. Press `F5` (or Run > Start Debugging)
3. A new **Extension Development Host** window opens
4. Create a `.rail` file to see syntax highlighting in action

## Making changes

### Syntax highlighting

Edit `syntaxes/rail.tmLanguage.json`. The grammar uses TextMate scope names mapped to VSCode semantic tokens:

| Scope | VSCode Token |
|-------|-------------|
| `keyword.control.rail` | keyword |
| `entity.name.function.rail` | function |
| `support.type.rail` | type |
| `storage.type.primitive.rail` | builtin type |
| `support.class.device.rail` | class (device type) |
| `string.quoted.double.rail` | string |
| `string.quoted.single.rail` | string (char) |
| `constant.numeric.rail` | number |
| `constant.language.rail` | boolean |
| `comment.line.double-slash.rail` | comment |
| `keyword.operator.*.rail` | operators |
| `meta.annotation.rail` | attribute |

Changes take effect on reload of the extension host (Ctrl+Shift+F5).

### Code snippets

Edit `snippets/rail.json`. Snippet syntax:

```json
{
  "snippet-name": {
    "prefix": "trigger-text",
    "body": [
      "line 1",
      "line 2 with ${1:tabstop} and ${2:another}"
    ],
    "description": "What this snippet does"
  }
}
```

### TypeScript extension code

Edit `src/extension.ts`. This is the activation point. Currently it:

- Registers a "Hello Rail" command
- Creates a diagnostics collection placeholder for future LSP integration

To extend it:

```typescript
context.subscriptions.push(
    vscode.languages.registerHoverProvider('rail', {
        provideHover(document, position) {
            // Custom hover information
        }
    })
);
```

## Building for distribution

```bash
# Build the VSIX package
npm install -g @vscode/vsce
vsce package

# This creates rail-language-support-0.1.0.vsix
```

## Related projects

- **[rail](https://github.com/rail-lang/rail)** — The Rail compiler (`rail-core` library + `railc` CLI)
- **[rail-tree-sitter](https://github.com/rail-lang/rail-tree-sitter)** — Tree-sitter grammar for Rail (shared with Zed extension)
- **[rail-fuzz](https://github.com/rail-lang/rail-fuzz)** — Fuzz testing for the Rail compiler

## Architecture notes

- The TextMate grammar (`syntaxes/rail.tmLanguage.json`) is the primary syntax highlighting source. It lives in this extension and is independent of the tree-sitter grammar.
- The tree-sitter grammar at `../rail-tree-sitter/` powers the Zed extension and also feeds `queries/highlights.scm`. The TextMate scopes are designed to correspond to the same highlighting categories as the tree-sitter queries.
- Future LSP integration will replace the diagnostics placeholder with a real language server, using `vscode-languageclient`.
