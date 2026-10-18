// ======================================================
// SERVIÇO DE FOTOGRAFIAS
// Sistema de Gestão de Vespa-Asiática — Lousã
// ======================================================


// ======================================================
// CONFIGURAÇÕES
// ======================================================

const TIPOS_IMAGEM_PERMITIDOS = [
    'image/jpeg',
    'image/png',
    'image/webp'
];

const TAMANHO_MAXIMO_FOTOGRAFIA = 10 * 1024 * 1024;


// ======================================================
// GERAR IDENTIFICADORES
// ======================================================

export function gerarIdFotografia() {
    return crypto.randomUUID();
}


// ======================================================
// GERAR NOMES DE FICHEIROS
// ======================================================

export function gerarNomeFotografia(
    idNinho,
    numeroFotografia,
    tipoImagem = 'image/jpeg'
) {
    if (!idNinho) {
        throw new Error(
            'É necessário indicar o identificador do ninho.'
        );
    }

    if (
        !Number.isInteger(numeroFotografia) ||
        numeroFotografia < 1
    ) {
        throw new Error(
            'O número da fotografia tem de ser superior a zero.'
        );
    }

    const extensoes = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp'
    };

    const extensao = extensoes[tipoImagem];

    if (!extensao) {
        throw new Error(
            'O formato da fotografia não é suportado.'
        );
    }

    return `${idNinho}_foto_${numeroFotografia}.${extensao}`;
}


// ======================================================
// VALIDAR FOTOGRAFIAS
// ======================================================

export function validarFotografia(ficheiro) {
    if (!ficheiro) {
        throw new Error(
            'Não foi selecionada nenhuma fotografia.'
        );
    }

    if (!TIPOS_IMAGEM_PERMITIDOS.includes(ficheiro.type)) {
        throw new Error(
            'Formato não permitido. Utiliza JPG, PNG ou WebP.'
        );
    }

    if (ficheiro.size > TAMANHO_MAXIMO_FOTOGRAFIA) {
        throw new Error(
            'A fotografia não pode ultrapassar 10 MB.'
        );
    }

    return true;
}


// ======================================================
// PREPARAR METADADOS DA FOTOGRAFIA
// ======================================================

export function prepararFotografia(
    idNinho,
    ficheiro,
    numeroFotografia
) {
    validarFotografia(ficheiro);

    const idFotografia = gerarIdFotografia();

    const nomeFicheiro = gerarNomeFotografia(
        idNinho,
        numeroFotografia,
        ficheiro.type
    );

    return {
        id: idFotografia,
        idNinho,
        nomeOriginal: ficheiro.name,
        nomeFicheiro,
        tipo: ficheiro.type,
        tamanho: ficheiro.size,
        numero: numeroFotografia,
        criadoEm: new Date().toISOString(),
        estado: 'Por carregar'
    };
}

