import { iniciarNavegacao } from './navegacao.js';
import { iniciarNinhos } from './ninhos.js';

document.addEventListener('DOMContentLoaded', () => {
    iniciarNavegacao();
    iniciarNinhos();

    console.log('Sistema de Gestão de Vespa-Asiática — Lousã iniciado.');
});