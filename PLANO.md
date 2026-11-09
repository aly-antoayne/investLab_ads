# Plano de desenvolvimento

Começaremos com uma única página. Só separaremos páginas ou arquivos adicionais quando houver uma necessidade concreta.

## Etapas

1. HTML: formulário do simulador e área de resultados.
2. CSS e Tailwind: visual simples, organização e responsividade.
3. JavaScript: leitura dos campos, validação e juros compostos com aporte ao fim do mês.
4. Modalidades: CDB, LCI/LCA, Tesouro e cripto, com taxas configuráveis e premissas documentadas.
5. Comparador: ao menos três modalidades usando os mesmos aportes e prazo.
6. Chart.js e dashboard: evolução, comparação e distribuição com significado bem definido.
7. localStorage: salvar, consultar, excluir e comparar simulações.
8. Revisão final: cenários negativos, taxa zero, celular, documentação e três demonstrações.
9. Entrega: repositório GitHub e publicação em GitHub Pages, Vercel ou Netlify.

O bônus de IA fica fora da primeira versão. Primeiro, vamos concluir os requisitos obrigatórios.

## Sua primeira tarefa: formulário HTML

Dentro da seção do simulador em `index.html`, substitua o comentário por um elemento `form` com estes campos:

| Campo | Elemento sugerido | Observação |
| --- | --- | --- |
| Investimento inicial (R$) | input type="number" | Valor mínimo 0; step="0.01" |
| Aporte mensal (R$) | input type="number" | Valor mínimo 0; step="0.01" |
| Prazo em anos | input type="number" | Inteiro de 1 a 50 |
| Rentabilidade anual (%) | input type="number" | step="0.01"; permitir valores negativos maiores que −100% |
| Modalidade | select | CDB, LCI/LCA, Tesouro Direto e Criptomoedas |
| Simular | button type="submit" | Ainda sem cálculo |

Para cada campo:

- Crie um `label` visível.
- Use `for` no label com o mesmo valor do `id` do campo.
- Adicione `name` e `required`.
- Identifique a unidade no texto do label, sem depender de placeholder.

Exemplo isolado para entender a associação:

```html
<label for="valor-inicial">Investimento inicial (R$)</label>
<input type="number" id="valor-inicial" name="valor-inicial" min="0" step="0.01" required>
```

Nesta primeira tarefa, não implemente cálculo nem gráficos. O botão ainda poderá recarregar a página; trataremos o envio com JavaScript na etapa 3.

## Como verificar esta etapa

- Todos os campos aparecem com seus rótulos?
- Clicar no rótulo foca o campo correspondente?
- É possível percorrer o formulário com Tab?
- O navegador impede enviar campos obrigatórios vazios?

Quando terminar, envie o HTML para revisão. Depois criaremos a área de resultados.
