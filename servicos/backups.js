// ======================================================
// SERVIÇO DE BACKUPS
// Sistema de Gestão de Vespa-Asiática — Lousã
// ======================================================

import { obterRegistos } from './base-dados.js';


// ======================================================
// CONFIGURAÇÃO DOS TIPOS DE REGISTO
// ======================================================

const TIPOS_BACKUP = [
    'ninhos',
    'tratamentos',
    'contactos'
];


// ======================================================
// CRIAR ESTRUTURA DO BACKUP
// ======================================================

export function criarBackup() {
    const backup = {
        aplicacao: 'Vespas Lousã',
        versaoFormato: 1,
        criadoEm: new Date().toISOString(),
        registos: {}
    };

    TIPOS_BACKUP.forEach(tipo => {
        backup.registos[tipo] = obterRegistos(tipo);
    });

    return backup;
}


// ======================================================
// DESCARREGAR UM FICHEIRO
// ======================================================

function descarregarFicheiro(conteudo, nomeFicheiro, tipoMime) {
    const ficheiro = new Blob(
        [conteudo],
        { type: tipoMime }
    );

    const url = URL.createObjectURL(ficheiro);
    const ligacao = document.createElement('a');

    ligacao.href = url;
    ligacao.download = nomeFicheiro;

    document.body.appendChild(ligacao);
    ligacao.click();
    ligacao.remove();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}


// ======================================================
// EXPORTAR BACKUP COMPLETO
// ======================================================

export function exportarBackup() {
    const backup = criarBackup();

    const data = new Date()
        .toISOString()
        .replace(/[:.]/g, '-');

    const nomeFicheiro = `backup_vespas_lousa_${data}.json`;

    descarregarFicheiro(
        JSON.stringify(backup, null, 2),
        nomeFicheiro,
        'application/json;charset=utf-8'
    );

    return backup;
}


// ======================================================
// VALIDAR FICHEIRO DE BACKUP
// ======================================================

export function validarBackup(backup) {
    if (!backup || typeof backup !== 'object') {
        throw new Error(
            'O ficheiro de backup não contém dados válidos.'
        );
    }

    if (backup.aplicacao !== 'Vespas Lousã') {
        throw new Error(
            'O ficheiro não pertence à aplicação Vespas Lousã.'
        );
    }

    if (!backup.registos || typeof backup.registos !== 'object') {
        throw new Error(
            'O backup não contém a secção de registos.'
        );
    }

    for (const tipo of TIPOS_BACKUP) {
        if (
            backup.registos[tipo] !== undefined &&
            !Array.isArray(backup.registos[tipo])
        ) {
            throw new Error(
                `A lista de registos "${tipo}" não é válida.`
            );
        }
    }

    return true;
}


// ======================================================
// LER UM FICHEIRO DE BACKUP
// ======================================================

export async function lerFicheiroBackup(ficheiro) {
    if (!ficheiro) {
        throw new Error(
            'Seleciona primeiro um ficheiro de backup.'
        );
    }

    const texto = await ficheiro.text();

    let backup;

    try {
        backup = JSON.parse(texto);
    } catch {
        throw new Error(
            'O ficheiro não contém JSON válido.'
        );
    }

    validarBackup(backup);

    return backup;
}

