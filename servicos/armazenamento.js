// ======================================================
// SERVIÇO CENTRAL DE ARMAZENAMENTO
// Sistema de Gestão de Vespa-Asiática — Lousã
// ======================================================

import {
    obterRegistos,
    guardarRegisto,
    atualizarRegisto,
    eliminarRegisto
} from './base-dados.js';


// ======================================================
// CONSULTAR REGISTOS
// ======================================================

export function consultar(tipo) {
    return obterRegistos(tipo);
}


export function consultarPorId(tipo, id) {
    const registos = obterRegistos(tipo);

    return registos.find(
        registo => registo.id === id
    ) || null;
}


// ======================================================
// GUARDAR REGISTOS
// ======================================================

export function guardar(tipo, dados) {
    return guardarRegisto(tipo, dados);
}


// ======================================================
// ATUALIZAR REGISTOS
// ======================================================

export function atualizar(tipo, id, alteracoes) {
    return atualizarRegisto(tipo, id, alteracoes);
}


// ======================================================
// ELIMINAR REGISTOS
// ======================================================

export function eliminar(tipo, id) {
    return eliminarRegisto(tipo, id);
}

