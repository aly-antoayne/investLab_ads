const formulario = document.getElementById("form-simulador");
let graficoComparacao = null;
const formatoCampo = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const botaoComparar = document.getElementById("comparar-simulacoes");

function limparComparacao() {
    document.getElementById("resultado-comparacao").replaceChildren();
    document.getElementById("mensagem-comparacao").textContent = "";

    if (graficoComparacao !== null) {
        graficoComparacao.destroy();
        graficoComparacao = null;
    }
}

botaoComparar.addEventListener("click", function () {
    const mensagem = document.getElementById("mensagem-comparacao");
    const resultado = document.getElementById("resultado-comparacao");

    limparComparacao();

    const marcados = document.querySelectorAll(
        "#lista-historico .selecionar-simulacao:checked"
    );

    if (marcados.length < 2) {
        mensagem.textContent =
            "Selecione pelo menos duas simulações para comparar.";
        return;
    }

    const idsSelecionados = Array.from(marcados).map(function (campo) {
        return campo.value;
    });

    try {
        const dadosSalvos = localStorage.getItem("investlab-simulacoes");
        const simulacoes = dadosSalvos ? JSON.parse(dadosSalvos) : [];

        if (!Array.isArray(simulacoes)) {
            throw new Error("O histórico salvo não é uma lista.");
        }

        const selecionadas = simulacoes.filter(function (simulacao) {
            return idsSelecionados.includes(simulacao.id);
        });

        if (selecionadas.length !== idsSelecionados.length) {
            mensagem.textContent =
                "O histórico mudou. Atualize a lista e selecione novamente.";
            exibirHistorico();
            return;
        }

        const moeda = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        const percentual = new Intl.NumberFormat("pt-BR", {
            style: "percent",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        const tabela = document.createElement("table");
        const legenda = document.createElement("caption");
        legenda.textContent = "Comparação das simulações salvas";
        tabela.appendChild(legenda);

        const cabecalho = document.createElement("thead");
        const linhaCabecalho = document.createElement("tr");

        const titulos = [
            "Modalidade",
            "Inicial",
            "Aporte mensal",
            "Prazo",
            "Taxa anual",
            "Total investido",
            "Patrimônio bruto",
            "Rendimentos",
            "Rentabilidade acumulada"
        ];

        titulos.forEach(function (titulo) {
            const coluna = document.createElement("th");
            coluna.scope = "col";
            coluna.textContent = titulo;
            linhaCabecalho.appendChild(coluna);
        });

        cabecalho.appendChild(linhaCabecalho);
        tabela.appendChild(cabecalho);

        const corpo = document.createElement("tbody");

        selecionadas.forEach(function (simulacao) {
            const linha = document.createElement("tr");

            const valores = [
                simulacao.modalidade,
                moeda.format(simulacao.valorInicial),
                moeda.format(simulacao.aporteMensal),
                simulacao.prazoAnos + " anos",
                percentual.format(simulacao.rentabilidadeAnual / 100),
                moeda.format(simulacao.totalInvestido),
                moeda.format(simulacao.patrimonioFinal),
                moeda.format(simulacao.totalRendimentos),
                percentual.format(simulacao.rentabilidadeAcumulada / 100)
            ];

            valores.forEach(function (valor) {
                const celula = document.createElement("td");
                celula.textContent = valor;
                linha.appendChild(celula);
            });

            corpo.appendChild(linha);
        });

        tabela.appendChild(corpo);
        resultado.appendChild(tabela);
        const rotulos = selecionadas.map(function (simulacao, indice) {
            return (indice + 1) + " · " + simulacao.modalidade;
        });

        const patrimonios = selecionadas.map(function (simulacao) {
            return simulacao.patrimonioFinal;
        });

        graficoComparacao = new Chart(
            document.getElementById("grafico-comparacao"),
            {
                type: "bar",
                data: {
                    labels: rotulos,
                    datasets: [{
                        label: "Patrimônio bruto final (R$)",
                        data: patrimonios,
                        backgroundColor: "#166534"
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            }
        );

        mensagem.textContent =
            "Compare também os aportes, prazos e taxas. " +
            "Os resultados são brutos, sem impostos ou custos.";

    } catch (erro) {
        mensagem.textContent = "Não foi possível comparar as simulações.";
        console.error("Erro ao comparar:", erro);
    }
});

function lerValorMonetario(id) {
    const texto = document.getElementById(id).value.trim();

    if (texto === "") {
        return NaN;
    }

    const numero = texto
        .replace(/\./g, "")
        .replace(",", ".");

    return Number(numero);
}

function aplicarMascaraMoeda(evento) {
    const campo = evento.target;
    const digitos = campo.value.replace(/\D/g, "");

    if (digitos === "") {
        campo.value = "";
        return;
    }

    const valor = Number(digitos) / 100;
    campo.value = formatoCampo.format(valor);
}

document.getElementById("valor-inicial")
    .addEventListener("input", aplicarMascaraMoeda);

document.getElementById("aporte-mensal")
    .addEventListener("input", aplicarMascaraMoeda);

function carregarSimulacao(simulacao) {
    document.getElementById("valor-inicial").value =
        formatoCampo.format(simulacao.valorInicial);

    document.getElementById("aporte-mensal").value =
        formatoCampo.format(simulacao.aporteMensal);

    document.getElementById("prazo-anos").value =
        simulacao.prazoAnos;

    document.getElementById("rent-anual").value =
        simulacao.rentabilidadeAnual;

    document.getElementById("modalidade").value =
        simulacao.modalidade;

    tipoCdb.value = "prefixado";
    atualizarCamposCdb();
    formulario.requestSubmit();
}

function excluirSimulacao(id) {
    const aviso = document.getElementById("aviso-historico");

    if (!confirm("Deseja excluir esta simulação?")) {
        return;
    }

    try {
        const dadosSalvos = localStorage.getItem("investlab-simulacoes");
        const simulacoes = dadosSalvos ? JSON.parse(dadosSalvos) : [];

        if (!Array.isArray(simulacoes)) {
            throw new Error("O histórico salvo não é uma lista.");
        }

        const simulacoesAtualizadas = simulacoes.filter(function (simulacao) {
            return simulacao.id !== id;
        });

        localStorage.setItem(
            "investlab-simulacoes",
            JSON.stringify(simulacoesAtualizadas)
        );

        exibirHistorico();
        aviso.textContent = "Simulação excluída com sucesso!";
    } catch (erro) {
        aviso.textContent = "Não foi possível excluir a simulação.";
        console.error("Erro ao excluir:", erro);
    }
}

function exibirHistorico() {
    limparComparacao();

    const lista = document.getElementById("lista-historico");
    const aviso = document.getElementById("aviso-historico");

    lista.replaceChildren();
    aviso.textContent = "";

    try {
        const dadosSalvos = localStorage.getItem("investlab-simulacoes");
        const simulacoes = dadosSalvos ? JSON.parse(dadosSalvos) : [];

        if (!Array.isArray(simulacoes)) {
            throw new Error("O histórico salvo não é uma lista.");
        }

        if (simulacoes.length === 0) {
            aviso.textContent = "Nenhuma simulação salva ainda.";
            return;
        }

        const moeda = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        simulacoes.forEach(function (simulacao) {
            const item = document.createElement("li");
            const data = new Date(simulacao.data).toLocaleString("pt-BR");

            const selecao = document.createElement("input");
            selecao.type = "checkbox";
            selecao.className = "selecionar-simulacao";
            selecao.value = simulacao.id;

            const rotulo = document.createElement("label");

            rotulo.appendChild(selecao);
            rotulo.appendChild(document.createTextNode(
                " " + data + " | " +
                simulacao.modalidade + " | " +
                simulacao.prazoAnos + " anos | " +
                "Patrimônio bruto: " +
                moeda.format(simulacao.patrimonioFinal)
            ));

            item.appendChild(rotulo);
            const botaoExcluir = document.createElement("button");
            botaoExcluir.type = "button";
            botaoExcluir.textContent = "Excluir";

            const botaoCarregar = document.createElement("button");
            botaoCarregar.type = "button";
            botaoCarregar.textContent = "Carregar";

            botaoCarregar.addEventListener("click", function () {
                carregarSimulacao(simulacao);
            });

            item.appendChild(document.createTextNode(" "));
            item.appendChild(botaoCarregar);

            botaoExcluir.addEventListener("click", function () {
                excluirSimulacao(simulacao.id);
            });

            item.appendChild(document.createTextNode(" "));
            item.appendChild(botaoExcluir);
            lista.appendChild(item);
        });
    } catch (erro) {
        aviso.textContent = "Não foi possível carregar o histórico.";
        console.error("Erro ao carregar:", erro);
    }
}

exibirHistorico();

function calcularPatrimonio(valorInicial, aporteMensal, prazoMeses, taxaMensal) {
    let patrimonio = valorInicial;
    const evolucao = [valorInicial];

    for (let mes = 1; mes <= prazoMeses; mes++) {
        patrimonio = patrimonio * (1 + taxaMensal);
        patrimonio = patrimonio + aporteMensal;

        evolucao.push(patrimonio);
    }

    return {
        patrimonioFinal: patrimonio,
        evolucao: evolucao
    };
}

let graficoEvolucao = null;
let ultimaSimulacao = null;

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const mensagemErro = document.getElementById("mensagem-erro");
    mensagemErro.textContent = "";
    
    if (
    campoModalidade.value === "cdb" &&
    tipoCdb.value === "cdi"
) {
    mensagemErro.textContent =
        "O cálculo por percentual do CDI será habilitado na próxima etapa.";
    return;
}

    const valorInicial = lerValorMonetario("valor-inicial");
    const aporteMensal = lerValorMonetario("aporte-mensal");
    const prazoAnos = document.getElementById("prazo-anos").valueAsNumber;
    const rentabilidadeAnual = document.getElementById("rent-anual").valueAsNumber;
    const modalidade = document.getElementById("modalidade").value;
    const valores = [
        valorInicial,
        aporteMensal,
        prazoAnos,
        rentabilidadeAnual
    ];

    if (!valores.every(Number.isFinite)) {
        mensagemErro.textContent = "Preencha todos os campos numéricos com valores válidos.";
        return;
    }

    if (valorInicial < 0 || aporteMensal < 0) {
        mensagemErro.textContent = "O investimento inicial e o aporte não podem ser negativos.";
        return;
    }

    if (!Number.isInteger(prazoAnos) || prazoAnos < 1 || prazoAnos > 50) {
        mensagemErro.textContent = "Informe um prazo inteiro entre 1 e 50 anos.";
        return;
    }

    if (rentabilidadeAnual <= -100) {
        mensagemErro.textContent = "A rentabilidade anual deve ser maior que -100%.";
        return;
    }

    const modalidadesPermitidas = [
        "cdb",
        "lci/lca",
        "tesouro-direto",
        "cripto"
    ];

    if (!modalidadesPermitidas.includes(modalidade)) {
        mensagemErro.textContent = "Selecione uma modalidade válida.";
        return;
    }
    const prazoMeses = prazoAnos * 12;

    const taxaAnual = rentabilidadeAnual / 100;

    const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1;

    const resultado = calcularPatrimonio(
        valorInicial,
        aporteMensal,
        prazoMeses,
        taxaMensal
    );

    const patrimonioFinal = resultado.patrimonioFinal;

    console.log("Evolução mensal:", resultado.evolucao);

    const totalInvestido = valorInicial + aporteMensal * prazoMeses;
    const totalRendimentos = patrimonioFinal - totalInvestido;

    const rentabilidadeAcumulada = totalInvestido > 0
        ? (totalRendimentos / totalInvestido) * 100
        : 0;

    ultimaSimulacao = {
        valorInicial: valorInicial,
        aporteMensal: aporteMensal,
        prazoAnos: prazoAnos,
        rentabilidadeAnual: rentabilidadeAnual,
        modalidade: modalidade,
        patrimonioFinal: patrimonioFinal,
        totalInvestido: totalInvestido,
        totalRendimentos: totalRendimentos,
        rentabilidadeAcumulada: rentabilidadeAcumulada
    };

    console.log("Última simulação:", ultimaSimulacao);

    const formatoMoeda = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    console.log("Patrimônio final:", formatoMoeda.format(patrimonioFinal));
    console.log("Total investido:", formatoMoeda.format(totalInvestido));
    console.log("Total de rendimentos:", formatoMoeda.format(totalRendimentos));
    console.log(
        "Rentabilidade acumulada:",
        rentabilidadeAcumulada.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + "%"
    );

    const camposRendimento = [
        document.getElementById("total-rendimentos"),
        document.getElementById("rentabilidade-acumulada")
    ];

    camposRendimento.forEach(function (campo) {
        campo.classList.remove("positivo", "negativo");

        if (totalRendimentos > 0) {
            campo.classList.add("positivo");
        } else if (totalRendimentos < 0) {
            campo.classList.add("negativo");
        }
    });
    document.getElementById("patrimonio-final").textContent =
        formatoMoeda.format(patrimonioFinal);

    document.getElementById("total-investido").textContent =
        formatoMoeda.format(totalInvestido);

    document.getElementById("total-rendimentos").textContent =
        formatoMoeda.format(totalRendimentos);

    document.getElementById("rentabilidade-acumulada").textContent =
        rentabilidadeAcumulada.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + "%";

    const nomesModalidades = {
        "cdb": "CDB",
        "lci/lca": "LCI / LCA",
        "tesouro-direto": "Tesouro Direto",
        "cripto": "Criptomoedas"
    };

    document.getElementById("modalidade-resultado").textContent =
        nomesModalidades[modalidade];

    console.log("Prazo em meses:", prazoMeses);
    console.log("Taxa mensal (%):", taxaMensal * 100);

    console.log({
        valorInicial,
        aporteMensal,
        prazoAnos,
        rentabilidadeAnual,
        modalidade
    });
    const meses = resultado.evolucao.map(function (valor, indice) {
        return "Mês " + indice;
    });

    const evolucaoInvestido = resultado.evolucao.map(function (valor, indice) {
        return valorInicial + aporteMensal * indice;
    });

    if (graficoEvolucao !== null) {
        graficoEvolucao.destroy();
    }

    graficoEvolucao = new Chart(
        document.getElementById("grafico-evolucao"),
        {
            type: "line",
            data: {
                labels: meses,
                datasets: [
                    {
                        label: "Patrimônio bruto (R$)",
                        data: resultado.evolucao,
                        borderColor: "#166534",
                        borderWidth: 2,
                        pointRadius: 0
                    },
                    {
                        label: "Total investido (R$)",
                        data: evolucaoInvestido,
                        borderColor: "#64748b",
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    );
});
const botaoSalvar = document.getElementById("salvar-simulacao");
const mensagemHistorico = document.getElementById("mensagem-historico");

botaoSalvar.addEventListener("click", function () {
    if (ultimaSimulacao === null) {
        mensagemHistorico.textContent =
            "Faça uma simulação antes de salvar.";
        return;
    }

    try {
        const dadosSalvos = localStorage.getItem("investlab-simulacoes");

        const simulacoes = dadosSalvos
            ? JSON.parse(dadosSalvos)
            : [];

        if (!Array.isArray(simulacoes)) {
            throw new Error("O histórico salvo não é uma lista.");
        }

        const registro = {
            ...ultimaSimulacao,
            id: crypto.randomUUID(),
            data: new Date().toISOString()
        };

        simulacoes.push(registro);

        localStorage.setItem(
            "investlab-simulacoes",
            JSON.stringify(simulacoes)
        );

        mensagemHistorico.textContent = "Simulação salva com sucesso!";
        exibirHistorico();

    } catch (erro) {
        mensagemHistorico.textContent =
            "Não foi possível salvar a simulação.";
        console.error("Erro ao salvar:", erro);
    }
});

const campoModalidade = document.getElementById("modalidade");
const tipoCdb = document.getElementById("tipo-cdb");
const configuracaoCdb = document.getElementById("configuracao-cdb");
const camposCdi = document.getElementById("campos-cdi");
const percentualCdi = document.getElementById("percentual-cdi");
const taxaCdi = document.getElementById("taxa-cdi");

function atualizarCamposCdb() {
    const ehCdb = campoModalidade.value === "cdb";
    const usaCdi = ehCdb && tipoCdb.value === "cdi";

    configuracaoCdb.hidden = !ehCdb;
    camposCdi.hidden = !usaCdi;

    percentualCdi.disabled = !usaCdi;
    taxaCdi.disabled = !usaCdi;

    percentualCdi.required = usaCdi;
    taxaCdi.required = usaCdi;
}

campoModalidade.addEventListener("change", atualizarCamposCdb);
tipoCdb.addEventListener("change", atualizarCamposCdb);

atualizarCamposCdb();