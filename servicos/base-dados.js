// ======================================================
// BASE DE DADOS CENTRAL
// Sistema de Gestão de Vespa-Asiática — Lousã
// ======================================================

// Todas as chaves de armazenamento ficam centralizadas aqui.
const CHAVES = {
    ninhos: 'vespas_lousa_registos',
    tratamentos: 'vespas_lousa_tratamentos',
    contactos: 'vespas_lousa_contactos',
    contadorNinhos: 'vespas_lousa_contador_ninhos'
};

// ======================================================
// FUNÇÕES INTERNAS
// ======================================================

function obterChave(tipo) {
    const chave = CHAVES[tipo];

    if (!chave) {
        throw new Error(
            `Tipo de registo não suportado: ${tipo}`
        );
    }

    return chave;
}

// ======================================================
// IDENTIFICADOR AUTOMÁTICO DOS NINHOS
// Formato: AAAAMM-XXXX
// Exemplo: 202610-0001
// A sequência reinicia a cada mês.
// ======================================================

function gerarIdentificadorNinho(dataOcorrencia) {
    const data = dataOcorrencia || new Date().toISOString().slice(0, 10);
    const partes = data.split('-');

    if (partes.length !== 3) {
        throw new Error('A data utilizada para o registo não é válida.');
    }

    const anoMes = `${partes[0]}${partes[1]}`;
    const chaveContador = CHAVES.contadorNinhos;

    let contadores = {};

    try {
        contadores = JSON.parse(
            localStorage.getItem(chaveContador) || '{}'
        );
    } catch (erro) {
        throw new Error('Não foi possível ler o contador dos ninhos.');
    }

    const ninhos = obterNinhos();

    // Procura o maior número já utilizado neste ano e mês.
    const maiorExistente = ninhos.reduce((maior, ninho) => {
        const identificador = String(
            ninho.identificador || ninho.referencia || ''
        ).replace('-', '');

        const correspondencia = identificador.match(
            new RegExp(`^${anoMes}(\\d{4})$`)
        );

        if (!correspondencia) {
            return maior;
        }

        return Math.max(maior, Number(correspondencia[1]));
    }, 0);

    const ultimoNumero = Math.max(
        Number(contadores[anoMes]) || 0,
        maiorExistente
    );

    if (ultimoNumero >= 9999) {
        throw new Error(
            'Já foram utilizados os 9999 números disponíveis para este mês.'
        );
    }

    const proximoNumero = ultimoNumero + 1;

    // Reserva o número para não o reutilizar após apagar um ninho.
    contadores[anoMes] = proximoNumero;

    localStorage.setItem(
        chaveContador,
        JSON.stringify(contadores)
    );

    return `${anoMes}${String(proximoNumero).padStart(4, '0')}`;
}

function lerRegistos(tipo) {
    const chave = obterChave(tipo);

    try {
        const dados = localStorage.getItem(chave);

        if (!dados) {
            return [];
        }

        const registos = JSON.parse(dados);

        if (!Array.isArray(registos)) {
            console.error(
                `Os dados de "${tipo}" não são uma lista válida.`
            );

            return [];
        }

        return registos;

    } catch (erro) {
        console.error(
            `Erro ao ler os registos de "${tipo}":`,
            erro
        );

        throw erro;
    }
}


function gravarRegistos(tipo, registos) {
    const chave = obterChave(tipo);

    if (!Array.isArray(registos)) {
        throw new Error(
            'Os registos têm de ser fornecidos numa lista.'
        );
    }

    localStorage.setItem(
        chave,
        JSON.stringify(registos)
    );
}


// ======================================================
// FUNÇÕES GENÉRICAS DE CONSULTA
// ======================================================

export function obterRegistos(tipo) {
    return lerRegistos(tipo);
}


export function obterRegistoPorId(tipo, id) {
    const registos = lerRegistos(tipo);

    return registos.find(
        registo => registo.id === id
    ) || null;
}


// ======================================================
// FUNÇÕES GENÉRICAS DE GRAVAÇÃO
// ======================================================

export function guardarRegisto(tipo, dados) {
    if (!dados || typeof dados !== 'object') {
        throw new Error(
            'Os dados do registo são inválidos.'
        );
    }

    const registos = lerRegistos(tipo);
    const agora = new Date().toISOString();

    const registo = {
        ...dados,
        id: dados.id || crypto.randomUUID(),
        criadoEm: dados.criadoEm || agora,
        atualizadoEm: agora
    };

    const indice = registos.findIndex(
        item => item.id === registo.id
    );

    if (indice >= 0) {
        registos[indice] = registo;
    } else {
        registos.push(registo);
    }

    gravarRegistos(tipo, registos);

    return registo;
}


export function atualizarRegisto(tipo, id, alteracoes) {
    if (!alteracoes || typeof alteracoes !== 'object') {
        throw new Error(
            'As alterações fornecidas são inválidas.'
        );
    }

    const registos = lerRegistos(tipo);

    const indice = registos.findIndex(
        registo => registo.id === id
    );

    if (indice < 0) {
        throw new Error(
            `Não foi encontrado o registo com o ID ${id}.`
        );
    }

    const registoAtualizado = {
        ...registos[indice],
        ...alteracoes,

        // O ID e a data de criação não podem mudar.
        id: registos[indice].id,
        criadoEm: registos[indice].criadoEm,

        atualizadoEm: new Date().toISOString()
    };

    registos[indice] = registoAtualizado;

    gravarRegistos(tipo, registos);

    return registoAtualizado;
}


export function eliminarRegisto(tipo, id) {
    const registos = lerRegistos(tipo);

    const atualizados = registos.filter(
        registo => registo.id !== id
    );

    gravarRegistos(tipo, atualizados);

    return atualizados;
}


// ======================================================
// COMPATIBILIDADE COM O CÓDIGO ATUAL DOS NINHOS
// ======================================================

// Mantemos estas funções para não obrigar a alterar
// imediatamente todos os módulos existentes.

export function obterNinhos() {
    return obterRegistos('ninhos');
}


export function guardarNinhos(ninhos) {
    gravarRegistos('ninhos', ninhos);
}


export function adicionarNinho(ninho) {
    const agora = new Date().toISOString();

    // Usa a data da ocorrência para determinar o ano e o mês.
    // Se não houver data, utiliza a data atual.
    const identificador = gerarIdentificadorNinho();

    const novoNinho = {
        ...ninho,
        id: ninho.id || crypto.randomUUID(),
        identificador,
        referencia: identificador,
        criadoEm: ninho.criadoEm || agora,
        atualizadoEm: agora
    };

    const ninhos = obterNinhos();
    ninhos.push(novoNinho);
    guardarNinhos(ninhos);

    return novoNinho;
}


export function eliminarNinho(id) {
    return eliminarRegisto('ninhos', id);
}


// ======================================================
// LIMPEZA DA BASE DE DADOS
// ======================================================

// Esta função elimina apenas os dados dos ninhos.
// Não elimina tratamentos nem contactos.

export function limparBaseDados() {
    localStorage.removeItem(CHAVES.ninhos);
}