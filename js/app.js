import { iniciarNavegacao } from './navegacao.js';
import { iniciarNinhos } from './ninhos.js';
import { atualizarDashboard } from './dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
    iniciarNavegacao();
    iniciarNinhos();
    atualizarDashboard();

    console.log('Sistema de Gestão de Vespa-Asiática — Lousã iniciado.');
});