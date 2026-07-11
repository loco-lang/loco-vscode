import * as vscode from 'vscode';
import Parser from 'web-tree-sitter';

export class RailDiagnosticProvider {
    private parser: Promise<Parser>;
    private diagnosticCollection: vscode.DiagnosticCollection;

    constructor(wasmPath: string, diagnosticCollection: vscode.DiagnosticCollection) {
        this.parser = this.initParser(wasmPath);
        this.diagnosticCollection = diagnosticCollection;
    }

    private async initParser(wasmPath: string): Promise<Parser> {
        await Parser.init();
        const parser = new Parser();
        const Lang = await Parser.Language.load(wasmPath);
        parser.setLanguage(Lang);
        return parser;
    }

    async updateDiagnostics(document: vscode.TextDocument): Promise<void> {
        if (document.languageId !== 'rail') return;

        const parser = await this.parser;
        const tree = parser.parse(document.getText());
        const diagnostics: vscode.Diagnostic[] = [];

        this.collectErrors(tree.rootNode, document, diagnostics);
        this.diagnosticCollection.set(document.uri, diagnostics);
    }

    private collectErrors(
        node: Parser.SyntaxNode,
        _document: vscode.TextDocument,
        diagnostics: vscode.Diagnostic[]
    ): void {
        if (node.type === 'ERROR' || node.isMissing) {
            const range = new vscode.Range(
                node.startPosition.row, node.startPosition.column,
                node.endPosition.row, node.endPosition.column
            );

            let message: string;
            if (node.isMissing) {
                message = `Expected ${node.type}`;
            } else {
                const snippet = node.text.substring(0, 30);
                message = `Unexpected syntax at '${snippet}'`;
            }

            const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
            diagnostic.source = 'rail';
            diagnostics.push(diagnostic);
        }

        for (let i = 0; i < node.childCount; i++) {
            const child = node.child(i);
            if (child) this.collectErrors(child, _document, diagnostics);
        }
    }

    dispose(): void {
        this.diagnosticCollection.dispose();
    }
}
