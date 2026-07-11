import * as vscode from 'vscode';
import * as path from 'path';
import { RailDocumentSymbolProvider } from './documentSymbolProvider';
import { RailCompletionProvider } from './completionProvider';
import { RailDiagnosticProvider } from './diagnosticProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Loco Language Support is now active');

    const wasmPath = path.join(context.extensionPath, 'wasm', 'tree-sitter-loco.wasm');

    // Register Document Symbol Provider (outline / breadcrumbs)
    const symbolProvider = new RailDocumentSymbolProvider(wasmPath);
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            { language: 'loco' },
            symbolProvider
        )
    );

    // Register Completion Provider (keyword and identifier suggestions)
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            { language: 'loco' },
            new RailCompletionProvider(),
            ...['.']
        )
    );

    // Register Diagnostics (tree-sitter syntax error highlighting)
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('rail');
    const diagnosticProvider = new RailDiagnosticProvider(wasmPath, diagnosticCollection);
    context.subscriptions.push(diagnosticCollection);

    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(doc => {
            diagnosticProvider.updateDiagnostics(doc);
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            diagnosticProvider.updateDiagnostics(event.document);
        })
    );

    // Run diagnostics on all open rail documents immediately
    vscode.workspace.textDocuments.forEach(doc => {
        diagnosticProvider.updateDiagnostics(doc);
    });

    context.subscriptions.push(diagnosticProvider);
}

export function deactivate() {}
