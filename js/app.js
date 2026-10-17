import { iniciarNavegacao } from './navegacao.js';
import { iniciarNinhos } from './ninhos.js';
import { atualizarDashboard } from './dashboard.js';
import { iniciarTratamentos } from './tratamentos.js';

document.addEventListener('DOMContentLoaded', () => {
    iniciarNavegacao();
    iniciarNinhos();
    iniciarTratamentos();
    atualizarDashboard();

    document.addEventListener('ninhos-atualizados', () => {
        atualizarDashboard();
    });

    console.log(
        'Sistema de Gestão de Vespa-Asiática — Lousã iniciado.'
    );
});

