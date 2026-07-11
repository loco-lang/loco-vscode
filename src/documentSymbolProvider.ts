import * as vscode from 'vscode';
import Parser from 'web-tree-sitter';

export class RailDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    private parser: Promise<Parser>;

    constructor(wasmPath: string) {
        this.parser = this.initParser(wasmPath);
    }

    private async initParser(wasmPath: string): Promise<Parser> {
        await Parser.init();
        const parser = new Parser();
        const Lang = await Parser.Language.load(wasmPath);
        parser.setLanguage(Lang);
        return parser;
    }

    async provideDocumentSymbols(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken
    ): Promise<vscode.DocumentSymbol[]> {
        const parser = await this.parser;
        const tree = parser.parse(document.getText());
        const symbols: vscode.DocumentSymbol[] = [];

        this.walkTree(tree.rootNode, symbols, document);
        return symbols;
    }

    private walkTree(
        node: Parser.SyntaxNode,
        symbols: vscode.DocumentSymbol[],
        document: vscode.TextDocument
    ): void {
        const symbol = this.nodeToSymbol(node, document);
        if (symbol) symbols.push(symbol);

        for (let i = 0; i < node.childCount; i++) {
            const child = node.child(i);
            if (child) this.walkTree(child, symbols, document);
        }
    }

    private nodeToSymbol(
        node: Parser.SyntaxNode,
        _document: vscode.TextDocument
    ): vscode.DocumentSymbol | null {
        const type = node.type;
        const nameNode = node.childForFieldName('name');
        if (!nameNode) return null;

        const range = new vscode.Range(
            node.startPosition.row, node.startPosition.column,
            node.endPosition.row, node.endPosition.column
        );
        const selectionRange = new vscode.Range(
            nameNode.startPosition.row, nameNode.startPosition.column,
            nameNode.endPosition.row, nameNode.endPosition.column
        );

        switch (type) {
            case 'proc_definition':
                return new vscode.DocumentSymbol(nameNode.text, 'procedure', vscode.SymbolKind.Function, range, selectionRange);
            case 'composite_definition':
                return new vscode.DocumentSymbol(nameNode.text, 'composite type', vscode.SymbolKind.Struct, range, selectionRange);
            case 'binding_declaration':
                return new vscode.DocumentSymbol(nameNode.text, 'binding', vscode.SymbolKind.Variable, range, selectionRange);
            case 'route_definition':
                return new vscode.DocumentSymbol(nameNode.text, 'route', vscode.SymbolKind.Function, range, selectionRange);
            case 'automation_definition':
                return new vscode.DocumentSymbol(nameNode.text, 'automation', vscode.SymbolKind.Function, range, selectionRange);
            case 'state_entry':
                return new vscode.DocumentSymbol(nameNode.text, 'state', vscode.SymbolKind.Method, range, selectionRange);
            case 'composite_field':
                return new vscode.DocumentSymbol(nameNode.text, 'field', vscode.SymbolKind.Field, range, selectionRange);
            case 'parameter':
                return new vscode.DocumentSymbol(nameNode.text, 'parameter', vscode.SymbolKind.Variable, range, selectionRange);
            default:
                return null;
        }
    }
}
