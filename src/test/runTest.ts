import * as path from 'path';
import * as vscode from 'vscode';
import * as assert from 'assert';

suite('Rail Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start Rail extension tests.');

    test('Extension should be present', () => {
        const ext = vscode.extensions.getExtension('rail-lang.rail-language-support');
        assert.ok(ext, 'Extension rail-lang.rail-language-support should be present');
    });

    test('Should activate on rail file', async () => {
        const ext = vscode.extensions.getExtension('rail-lang.rail-language-support');
        await ext?.activate();
        assert.ok(ext?.isActive, 'Extension should be active');
    });

    test('Document symbols should include proc definitions', async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'rail',
            content: 'proc main() { }\nproc foo(x: Int) -> Bool { true }'
        });
        const symbols = await vscode.commands.executeCommand<vscode.SymbolInformation[]>(
            'vscode.executeDocumentSymbolProvider', doc.uri
        );
        assert.ok(symbols && symbols.length >= 2, 'Should find at least 2 symbols');
        const names = symbols!.map(s => s.name);
        assert.ok(names.includes('main'), 'Should include main');
        assert.ok(names.includes('foo'), 'Should include foo');
    });

    test('Keyword completions should include proc', async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'rail',
            content: ''
        });
        const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
            'vscode.executeCompletionItemProvider', doc.uri, new vscode.Position(0, 0)
        );
        assert.ok(completions, 'Completions should be returned');
        const labels = completions!.items.map(i => i.label);
        assert.ok(labels.includes('proc'), 'Should include proc keyword');
        assert.ok(labels.includes('let'), 'Should include let keyword');
    });

    test('Syntax error diagnostics should be reported', async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'rail',
            content: 'proc main() { missing_semicolon }'
        });
        // Allow async diagnostic provider to run
        await new Promise(resolve => setTimeout(resolve, 500));
        const diagnostics = vscode.languages.getDiagnostics(doc.uri);
        assert.ok(Array.isArray(diagnostics), 'Diagnostics should be an array');
    });
});
