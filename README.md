# Projeto 09 – Dados e Funções (JavaScript) · Nível ⭐⭐⭐ → 🔥

Treino de **arrays, objetos e funções**: `map`, `filter`, `reduce`, `sort`, desestruturação, `spread`, `Set`, `Map`, *closures*, composição de funções, e três desafios avançados (🔥). O cenário é o de um restaurante (cardápio e pedidos).

## Como funciona

- Você escreve tudo em **`solucao.js`** (as funções já estão lá, vazias).
- O robô chama as suas funções com vários dados e compara o resultado. Em vários requisitos ele também confere **como** você resolveu: sem `for`/`while` (use `map`/`filter`/`reduce`), usando `Set`/`Map`, sem alterar os dados recebidos.
- Os dados têm este formato:

```js
const prato  = { id: 1, nome: 'Pizza Margherita', preco: 45, categoria: 'pizza', disponivel: true };
const pedido = { cliente: { nome: 'Maria' }, itens: [{ nome: 'Pizza', preco: 45, quantidade: 2 }], taxaEntrega: 5.5 };
```

## Requisitos

1. **R1** – O `solucao.js` carrega sem erro e exporta as 17 funções.
2. **R2** – Sem `var`: use `const` e `let`.
3. **R3** – `nomesDosPratos(cardapio)` devolve só os nomes (use `map`); `pratosDisponiveis(cardapio)` devolve só os pratos com `disponivel: true` (use `filter`). **Sem `for`/`while`.**
4. **R4** – `totalDoPedido(itens)`: soma `preco × quantidade`, **arredondado em 2 casas** (`0,1 × 3` tem que dar `0.3`, não `0.30000000000000004`). Use `reduce`, sem `for`/`while`. Lista vazia → `0`.
5. **R5** – `pratoMaisCaro(cardapio)`: o prato de maior preço (em empate, o **primeiro** da lista) ou `null` se a lista for vazia. Use `reduce`, sem `for`/`while`, e **não altere** a lista recebida.
6. **R6** – `ordenarPorPreco(cardapio, ordem = 'asc')`: devolve uma **lista nova** ordenada (`'asc'` do mais barato ao mais caro; `'desc'` ao contrário). Em empate de preço, ordene pelo **nome** (A antes de B) nos dois modos. A lista original **não** pode mudar.
7. **R7** – `agruparPorCategoria(cardapio)`: objeto `{ pizza: [pratos...], bebida: [...] }`. Use `reduce`, sem `for`/`while`. Lista vazia → `{}`.
8. **R8** – `resumoPedido(pedido)`: texto no formato `Maria: 2x Pizza, 1x Suco | Total: R$ 104,50`. O total inclui a `taxaEntrega` (opcional, padrão `0`) e usa **vírgula** nos centavos, sem separador de milhar. Sem itens: `Ana: sem itens | Total: R$ 5,00`. Use **template literal** (crases) e desestruturação.
9. **R9** – `removerDuplicados(lista)`: tira os repetidos mantendo a ordem da primeira aparição. Use um **`Set`**.
10. **R10** – `unirCardapios(a, b)`: junta duas listas de pratos por `id`; se o mesmo `id` aparece nas duas, vale o de **`b`**. A ordem é a da primeira aparição. Use um **`Map`** e **não altere** as listas recebidas.
11. **R11** – `contarPalavras(texto)`: objeto `{ palavra: quantidade }`, tudo em minúsculas e sem pontuação, **respeitando acentos** (`'Pão pão PÃO'` → `{ pão: 3 }`). Texto vazio → `{}`.
12. **R12** – `criarContador(inicial = 0)`: devolve um objeto com `incrementar(passo = 1)`, `decrementar(passo = 1)` (os dois devolvem o novo valor), `valor()` e `resetar()` (volta ao valor inicial). O estado fica **escondido** (closure): o objeto só pode ter essas 4 chaves. Cada contador é independente.
13. **R13** – `criarCarrinho()`: devolve `{ adicionar(item, quantidade = 1), remover(id), total(), itens() }`. `adicionar` do mesmo `id` soma a quantidade. `itens()` devolve cópias `{ id, nome, preco, quantidade }` (mexer no resultado não pode afetar o carrinho). O item recebido também deve ser copiado. `total()` é arredondado em 2 casas. `remover` de um `id` que não existe não dá erro. Só essas 4 chaves, e cada carrinho é independente.
14. **R14** – `pipe(...funcoes)` aplica da **esquerda para a direita** (`pipe(x => x + 1, x => x * 2)(3)` → `8`); `compose(...funcoes)` aplica da **direita para a esquerda** (→ `7`). Sem funções, devolvem o próprio valor. A primeira função do `pipe` pode receber vários argumentos.
15. **R15** – 🔥 `memoizar(fn)`: devolve uma versão de `fn` que **guarda os resultados** já calculados para os mesmos argumentos (inclusive vários argumentos, objetos, e resultados `0` ou `undefined`). O robô testa `fib(60)` recursivo com a sua `memoizar` (sem cache ele nunca terminaria).
16. **R16** – 🔥 `curry(fn)`: transforma `fn(a, b, c)` em algo chamável como `f(1)(2)(3)`, `f(1, 2)(3)`, `f(1)(2, 3)` ou `f(1, 2, 3)`. Funciona com qualquer quantidade de parâmetros (inclusive 0 e 1), e uma função parcial (`const mais1 = f(1)`) pode ser **reutilizada** várias vezes sem "lembrar" chamadas anteriores.
17. **R17** – 🔥 `relatorioVendas(pedidos, cardapio)`: cada pedido é `{ id, itens: [{ pratoId, quantidade }] }`. Junte com o cardápio (pelo `id` do prato) e devolva `[{ categoria, quantidade, receita }]`, **da maior receita para a menor** (empate: por `categoria`, A antes de B). `receita` arredondada em 2 casas. Ignore itens cujo `pratoId` não existe. Não altere os dados recebidos.

<details>
<summary>💡 Dicas (abra só se travar)</summary>

**Nível 1 – Pensando antes de codar**
- `map` transforma **cada item** em outra coisa; `filter` **escolhe** itens; `reduce` **resume** tudo em um valor só (um número, um objeto, um prato...). Pergunte-se: "eu quero uma lista do mesmo tamanho, uma lista menor ou um valor só?"
- `reduce(função, valorInicial)`: a função recebe o **acumulador** (o que já foi resumido) e o **item atual**, e devolve o novo acumulador.
- "Não alterar o que recebi": `sort`, `reverse`, `push` e `splice` **mudam** o array original. Faça uma cópia antes.
- **Closure**: uma função que "lembra" das variáveis do lugar onde foi criada. Se `criarContador` declara `let valor` e devolve funções que usam `valor`, ninguém de fora consegue mexer nele.
- **R15 (memoizar)**: a ideia é um "caderninho": antes de calcular, procure no caderno; se não achar, calcule e anote. Cuidado: "se o resultado for 0, achei ou não achei?"
- **R16 (curry)**: toda função tem `fn.length` (quantos parâmetros ela declara). Se já chegaram argumentos suficientes, execute; senão, devolva uma função que espera o resto.
- **R17**: dá para dividir em passos: (1) achar a categoria e o preço de cada item vendido, (2) somar por categoria, (3) ordenar.

**Nível 2 – Ferramentas**
- Copiar array: `[...lista]`. Copiar objeto: `{ ...objeto }`.
- Arredondar em 2 casas: `Math.round(n * 100) / 100`.
- Formatar centavos: `n.toFixed(2).replace('.', ',')`.
- Desempate no `sort`: `(a, b) => diferenca || a.nome.localeCompare(b.nome)`.
- `Set` guarda valores únicos e se converte em array com `[...set]`. `Map` guarda pares chave→valor: `set`, `get`, `has`, e `[...map.values()]` devolve os valores.
- Palavras com acento: a expressão regular `/[\p{L}\p{N}]+/gu` encontra letras e números de qualquer idioma.
- Uma chave de cache a partir de argumentos: `JSON.stringify(args)`. E o `Map` tem `has`, que diferencia "não existe" de "existe e vale 0".
- Resto dos argumentos: `(...args) => ...`. Espalhar: `fn(...args)`.
</details>

---

## Como entregar

1. Clone o repositório: `git clone https://github.com/NicolasDimitri/web-09-js-estruturas.git` e entre na pasta.
2. Crie uma branch: `git switch -c meu-projeto`
3. Abra o arquivo **`solucao.js`**: ele já vem com todas as funções/classes prontas para você preencher (troque o `throw` pelo seu código). **É o único arquivo que você edita.**
4. `git add .` → `git commit -m "mensagem"` → `git push -u origin meu-projeto`
5. No GitHub, clique em **Compare & pull request** → **Create pull request**.
6. A cada commit, o robô adiciona **um novo comentário** no PR com uma **tabela de requisitos** (✅ passou / ❌ não passou, com a dica do que falta) e a **porcentagem concluída**.
   Os comentários anteriores ficam como histórico do seu progresso. Corrija, faça novo commit + `git push` e uma nova tabela aparece.
7. Com tudo ✅, sua entrega está concluída. **O PR não será mesclado na `main`**: ele fica aberto só para a avaliação e para o instrutor revisar.

## Testar no seu computador (opcional, mas recomendado: o feedback é bem mais rápido!)

Você precisa do Node 22 instalado. **Não é preciso instalar navegador.**

```bash
npm install
npm test
```

Para fazer experimentos soltos, crie um arquivo `teste.js` (e não faça commit dele):

```js
const s = require('./solucao');
console.log(s.fizzBuzz(5));
```

e rode `node teste.js`.

> Não altere as pastas `tests/`, `scripts/` e `.github/`.
>
> ⏱️ Cada requisito roda isolado e com limite de tempo: se o seu código entrar em um laço infinito, só aquele requisito fica ❌ (com um aviso), e os outros continuam sendo avaliados.
