const formulario = document.getElementById("form-simulador");

function calcularPatrimonio(valorInicial, aporteMensal, prazoMeses, taxaMensal) {
    let patrimonio = valorInicial;

    for (let mes = 1; mes <= prazoMeses; mes++) {
        patrimonio = patrimonio * (1 + taxaMensal);
        patrimonio = patrimonio + aporteMensal;
    }

    return patrimonio;
}

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const mensagemErro = document.getElementById("mensagem-erro");
    mensagemErro.textContent = "";

    const valorInicial = document.getElementById("valor-inicial").valueAsNumber;
    const aporteMensal = document.getElementById("aporte-mensal").valueAsNumber;
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

    const patrimonioFinal = calcularPatrimonio(
        valorInicial,
        aporteMensal,
        prazoMeses,
        taxaMensal
    );

    const totalInvestido = valorInicial + aporteMensal * prazoMeses;
    const totalRendimentos = patrimonioFinal - totalInvestido;

    const rentabilidadeAcumulada = totalInvestido > 0
        ? (totalRendimentos / totalInvestido) * 100
        : 0;

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

    console.log("Prazo em meses:", prazoMeses);
    console.log("Taxa mensal (%):", taxaMensal * 100);

    console.log({
        valorInicial,
        aporteMensal,
        prazoAnos,
        rentabilidadeAnual,
        modalidade
    });
});