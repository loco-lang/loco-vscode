import * as vscode from 'vscode';

const KEYWORDS: vscode.CompletionItem[] = [
    'actor', 'automation', 'composite', 'const', 'do', 'else', 'fork',
    'if', 'import', 'intrinsic', 'launch', 'let', 'new', 'on', 'or', 'and', 'not',
    'proc', 'pub', 'route', 'send', 'start', 'state', 'startup',
].map(k => {
    const item = new vscode.CompletionItem(k, vscode.CompletionItemKind.Keyword);
    item.insertText = k + ' ';
    return item;
});

const LITERALS: vscode.CompletionItem[] = [
    'true', 'false',
].map(k => {
    const item = new vscode.CompletionItem(k, vscode.CompletionItemKind.Value);
    item.insertText = k;
    return item;
});

export class RailCompletionProvider implements vscode.CompletionItemProvider {
    async provideCompletionItems(
        document: vscode.TextDocument,
        _position: vscode.Position,
        _token: vscode.CancellationToken,
        _context: vscode.CompletionContext
    ): Promise<vscode.CompletionList> {
        const items: vscode.CompletionItem[] = [...KEYWORDS, ...LITERALS];

        // Collect all identifiers in the document for local symbol completion
        const text = document.getText();
        const identPattern = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
        const seen = new Set<string>();
        let match: RegExpExecArray | null;
        while ((match = identPattern.exec(text)) !== null) {
            const word = match[0];
            if (!seen.has(word)) {
                seen.add(word);
                const item = new vscode.CompletionItem(word, vscode.CompletionItemKind.Variable);
                items.push(item);
            }
        }

        return new vscode.CompletionList(items, false);
    }
}
