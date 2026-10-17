const CHAVE_BASE_DADOS = 'vespas_lousa_registos';

export function obterNinhos() {
    try {
        const dados = localStorage.getItem(CHAVE_BASE_DADOS);

        if (!dados) {
            return [];
        }

        const ninhos = JSON.parse(dados);

        return Array.isArray(ninhos) ? ninhos : [];
    } catch (erro) {
        console.error('Erro ao carregar os ninhos:', erro);
        return [];
    }
}

export function guardarNinhos(ninhos) {
    if (!Array.isArray(ninhos)) {
        throw new Error('Os dados dos ninhos têm de ser uma lista.');
    }

    localStorage.setItem(
        CHAVE_BASE_DADOS,
        JSON.stringify(ninhos)
    );
}

export function adicionarNinho(ninho) {
    const ninhos = obterNinhos();

    ninhos.push({
        ...ninho,
        id: crypto.randomUUID(),
        criadoEm: new Date().toISOString()
    });

    guardarNinhos(ninhos);

    return ninhos;
}

export function eliminarNinho(id) {
    const ninhos = obterNinhos();
    const atualizados = ninhos.filter(
        ninho => ninho.id !== id
    );

    guardarNinhos(atualizados);

    return atualizados;
}

export function limparBaseDados() {
    localStorage.removeItem(CHAVE_BASE_DADOS);
}

