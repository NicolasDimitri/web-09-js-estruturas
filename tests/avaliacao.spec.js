const { test, expect } = require('@playwright/test');
const { rodar, casos, fontesDe, exigirSemLacos, codigoDoAluno } = require('./helpers');

const CARDAPIO = [
  { id: 1, nome: 'Pizza Margherita', preco: 45, categoria: 'pizza', disponivel: true },
  { id: 2, nome: 'Pizza Calabresa', preco: 48.5, categoria: 'pizza', disponivel: false },
  { id: 3, nome: 'Suco de Laranja', preco: 9, categoria: 'bebida', disponivel: true },
  { id: 4, nome: 'Refrigerante', preco: 7.5, categoria: 'bebida', disponivel: true },
  { id: 5, nome: 'Pudim', preco: 12, categoria: 'sobremesa', disponivel: true },
];

const FUNCOES = [
  'nomesDosPratos', 'pratosDisponiveis', 'totalDoPedido', 'pratoMaisCaro', 'ordenarPorPreco', 'agruparPorCategoria',
  'resumoPedido', 'removerDuplicados', 'unirCardapios', 'contarPalavras', 'criarContador', 'criarCarrinho',
  'pipe', 'compose', 'memoizar', 'curry', 'relatorioVendas',
];

test('R1 – O solucao.js carrega sem erro e exporta as 17 funções pedidas', () => {
  const tipos = rodar((s, nomes) => nomes.map((n) => typeof s[n]), FUNCOES);
  const faltam = FUNCOES.filter((n, i) => tipos[i] !== 'function');
  expect(faltam, `Faltam exportar: ${faltam.join(', ')} (module.exports = { ... })`).toEqual([]);
});

test('R2 – Sem "var": use const e let', () => {
  expect(codigoDoAluno(), 'Troque todo "var" por const (valor que não muda) ou let (valor que muda)').not.toMatch(/\bvar\b/);
});

test('R3 – nomesDosPratos (map) e pratosDisponiveis (filter), sem for/while', () => {
  casos('nomesDosPratos', [
    [[CARDAPIO], ['Pizza Margherita', 'Pizza Calabresa', 'Suco de Laranja', 'Refrigerante', 'Pudim']],
    [[[]], []],
  ]);
  casos('pratosDisponiveis', [
    [[CARDAPIO], [CARDAPIO[0], CARDAPIO[2], CARDAPIO[3], CARDAPIO[4]]],
    [[[]], []],
  ]);
  exigirSemLacos(['nomesDosPratos', 'pratosDisponiveis'], 'use map e filter');
});

test('R4 – totalDoPedido(itens): soma preco × quantidade, arredondado em 2 casas, com reduce', () => {
  casos('totalDoPedido', [
    [[[{ preco: 10, quantidade: 2 }, { preco: 5.5, quantidade: 1 }]], 25.5],
    [[[]], 0],
    [[[{ preco: 0.1, quantidade: 3 }]], 0.3],
    [[[{ preco: 19.99, quantidade: 3 }, { preco: 4.5, quantidade: 2 }]], 68.97],
  ]);
  exigirSemLacos(['totalDoPedido'], 'use reduce');
});

test('R5 – pratoMaisCaro(cardapio): o prato de maior preço (empate: o primeiro) ou null, sem alterar a lista', () => {
  casos('pratoMaisCaro', [
    [[CARDAPIO], CARDAPIO[1]],
    [[[]], null],
    [[[{ id: 'a', preco: 10 }, { id: 'b', preco: 10 }]], { id: 'a', preco: 10 }],
    [[[{ id: 'x', preco: 3 }]], { id: 'x', preco: 3 }],
  ]);
  const intacto = rodar((s, d) => { const antes = JSON.stringify(d.c); pegar('pratoMaisCaro')(d.c); return JSON.stringify(d.c) === antes; }, { c: CARDAPIO });
  expect(intacto, 'pratoMaisCaro alterou a lista original (não use sort/reverse/splice direto nela)').toBe(true);
  exigirSemLacos(['pratoMaisCaro'], 'use reduce');
});

test('R6 – ordenarPorPreco(cardapio, ordem): cópia ordenada (asc é o padrão), desempate por nome, sem alterar a original', () => {
  const r = rodar((s, d) => {
    const f = pegar('ordenarPorPreco');
    const copia = JSON.stringify(d.c);
    const asc = f(d.c).map((p) => p.id);
    const ascExplicito = f(d.c, 'asc').map((p) => p.id);
    const desc = f(d.c, 'desc').map((p) => p.id);
    return {
      asc, ascExplicito, desc,
      intacta: JSON.stringify(d.c) === copia,
      nova: f(d.c) !== d.c,
      empateAsc: f(d.t).map((p) => p.nome),
      empateDesc: f(d.t, 'desc').map((p) => p.nome),
    };
  }, { c: CARDAPIO, t: [{ nome: 'B', preco: 5 }, { nome: 'A', preco: 5 }, { nome: 'C', preco: 1 }] });
  expect(r.asc, 'ordenarPorPreco(cardapio) deveria listar os ids do mais barato para o mais caro: [4,3,5,1,2]').toEqual([4, 3, 5, 1, 2]);
  expect(r.ascExplicito, 'ordenarPorPreco(cardapio, "asc") deveria dar [4,3,5,1,2]').toEqual([4, 3, 5, 1, 2]);
  expect(r.desc, 'ordenarPorPreco(cardapio, "desc") deveria dar os ids [2,1,5,3,4]').toEqual([2, 1, 5, 3, 4]);
  expect(r.intacta, 'A lista original foi alterada! sort() muda o array: faça uma cópia antes (spread [...lista])').toBe(true);
  expect(r.nova, 'Devolva um array NOVO, não a mesma lista recebida').toBe(true);
  expect(r.empateAsc, 'Em empate de preço, ordene pelo nome (A antes de B): esperado ["C","A","B"]').toEqual(['C', 'A', 'B']);
  expect(r.empateDesc, 'No modo "desc", o empate continua por nome (A antes de B): esperado ["A","B","C"]').toEqual(['A', 'B', 'C']);
});

test('R7 – agruparPorCategoria(cardapio): objeto { categoria: [pratos] }, com reduce', () => {
  casos('agruparPorCategoria', [
    [[CARDAPIO], { pizza: [CARDAPIO[0], CARDAPIO[1]], bebida: [CARDAPIO[2], CARDAPIO[3]], sobremesa: [CARDAPIO[4]] }],
    [[[]], {}],
  ]);
  exigirSemLacos(['agruparPorCategoria'], 'use reduce');
});

test('R8 – resumoPedido(pedido): texto com template literal, desestruturação e taxaEntrega opcional', () => {
  casos('resumoPedido', [
    [[{ cliente: { nome: 'Maria' }, itens: [{ nome: 'Pizza', preco: 45, quantidade: 2 }, { nome: 'Suco', preco: 9, quantidade: 1 }], taxaEntrega: 5.5 }],
      'Maria: 2x Pizza, 1x Suco | Total: R$ 104,50'],
    [[{ cliente: { nome: 'João' }, itens: [{ nome: 'Pudim', preco: 12, quantidade: 1 }] }], 'João: 1x Pudim | Total: R$ 12,00'],
    [[{ cliente: { nome: 'Ana' }, itens: [], taxaEntrega: 5 }], 'Ana: sem itens | Total: R$ 5,00'],
    [[{ cliente: { nome: 'Lu' }, itens: [{ nome: 'Banquete', preco: 1234.5, quantidade: 1 }], taxaEntrega: 0 }], 'Lu: 1x Banquete | Total: R$ 1234,50'],
  ]);
  const [fonte] = fontesDe(['resumoPedido'], { limpo: false });
  expect(fonte.includes('`'), 'Monte o texto com template literal (crases e ${...})').toBe(true);
});

test('R9 – removerDuplicados(lista): mantém a ordem e usa Set', () => {
  casos('removerDuplicados', [
    [[[1, 2, 2, 3, 1]], [1, 2, 3]],
    [[['a', 'A', 'a']], ['a', 'A']],
    [[[3, 1, 3, 2, 1]], [3, 1, 2]],
    [[[]], []],
  ]);
  const [fonte] = fontesDe(['removerDuplicados']);
  expect(/\bSet\b/.test(fonte), 'Use um Set para eliminar os repetidos').toBe(true);
});

test('R10 – unirCardapios(a, b): junta por id (o de b vence), mantém a ordem da primeira aparição, usa Map e não altera as listas', () => {
  const a = [{ id: 1, preco: 10 }, { id: 2, preco: 20 }];
  const b = [{ id: 2, preco: 25 }, { id: 3, preco: 30 }];
  casos('unirCardapios', [
    [[a, b], [{ id: 1, preco: 10 }, { id: 2, preco: 25 }, { id: 3, preco: 30 }]],
    [[[], b], b],
    [[a, []], a],
    [[[], []], []],
  ]);
  const intactas = rodar((s, d) => { const antes = JSON.stringify(d); pegar('unirCardapios')(d.a, d.b); return JSON.stringify(d) === antes; }, { a, b });
  expect(intactas, 'unirCardapios alterou uma das listas recebidas (monte uma lista nova)').toBe(true);
  const [fonte] = fontesDe(['unirCardapios']);
  expect(/\bMap\b/.test(fonte), 'Use um Map (id → prato) para juntar as listas').toBe(true);
});

test('R11 – contarPalavras(texto): objeto { palavra: quantidade } ignorando maiúsculas e pontuação', () => {
  casos('contarPalavras', [
    [['O gato e o rato. O RATO fugiu!'], { o: 3, gato: 1, e: 1, rato: 2, fugiu: 1 }],
    [[''], {}],
    [['Pão pão PÃO'], { pão: 3 }],
    [['  espaços   demais  '], { espaços: 1, demais: 1 }],
    [["ela disse: 'oi, oi!'"], { ela: 1, disse: 1, oi: 2 }],
  ]);
});

test('R12 – criarContador(inicial): closure com incrementar, decrementar, valor e resetar (estado escondido)', () => {
  const r = rodar((s) => {
    const criar = pegar('criarContador');
    const a = criar();
    const b = criar(10);
    a.incrementar();
    a.incrementar(5);
    b.decrementar();
    const c = criar(7);
    const retorno = c.incrementar();
    c.incrementar(3);
    c.resetar();
    return { a: a.valor(), b: b.valor(), chaves: Object.keys(a).sort(), retorno, resetado: c.valor(), dec: criar(5).decrementar(2) };
  });
  expect(r.a, 'criarContador(): depois de incrementar() e incrementar(5) o valor deveria ser 6').toBe(6);
  expect(r.b, 'Cada contador tem seu próprio estado: criarContador(10) depois de decrementar() deveria valer 9').toBe(9);
  expect(r.retorno, 'incrementar() deve devolver o novo valor (criarContador(7).incrementar() → 8)').toBe(8);
  expect(r.dec, 'decrementar(2) deve devolver o novo valor (criarContador(5) → 3)').toBe(3);
  expect(r.resetado, 'resetar() deve voltar ao valor inicial (7)').toBe(7);
  expect(r.chaves, 'O contador deve expor SÓ as 4 funções (o estado fica escondido na closure, não como propriedade)').toEqual(['decrementar', 'incrementar', 'resetar', 'valor']);
});

test('R13 – criarCarrinho(): closure com adicionar, remover, total e itens (devolve cópias, não o estado interno)', () => {
  const r = rodar((s) => {
    const criar = pegar('criarCarrinho');
    const c = criar();
    const pizza = { id: 1, nome: 'Pizza', preco: 45 };
    c.adicionar(pizza);
    c.adicionar({ id: 1, nome: 'Pizza', preco: 45 }, 2);
    c.adicionar({ id: 2, nome: 'Suco', preco: 9.9 });
    pizza.preco = 1;
    const itens = c.itens();
    const totalCheio = c.total();
    itens[0].quantidade = 99;
    itens.push({ id: 9 });
    const depoisDeMexer = c.itens();
    c.remover(1);
    c.remover(123);
    return { itens: depoisDeMexer, totalCheio, aposRemover: c.itens(), totalFinal: c.total(), chaves: Object.keys(c).sort(), outro: criar().total() };
  });
  expect(r.itens, 'itens() deveria listar {id, nome, preco, quantidade}: adicionar o mesmo id soma a quantidade (3 pizzas) e cada item é uma cópia').toEqual([
    { id: 1, nome: 'Pizza', preco: 45, quantidade: 3 }, { id: 2, nome: 'Suco', preco: 9.9, quantidade: 1 },
  ]);
  expect(r.totalCheio, 'total() deveria ser 144.9 (3 × 45 + 9.9). Dica: guarde uma CÓPIA do item recebido').toBe(144.9);
  expect(r.aposRemover, 'remover(1) deveria deixar só o Suco; remover um id que não existe não pode dar erro').toEqual([{ id: 2, nome: 'Suco', preco: 9.9, quantidade: 1 }]);
  expect(r.totalFinal, 'total() depois de remover a pizza deveria ser 9.9').toBe(9.9);
  expect(r.outro, 'Cada carrinho tem seu próprio estado: um carrinho novo começa com total 0').toBe(0);
  expect(r.chaves, 'O carrinho deve expor SÓ adicionar, itens, remover e total').toEqual(['adicionar', 'itens', 'remover', 'total']);
});

test('R14 – pipe(...fns) (esquerda → direita) e compose(...fns) (direita → esquerda)', () => {
  const r = rodar((s) => {
    const t = (f) => { try { return { v: f() }; } catch (e) { return { erro: String(e.message) }; } };
    const pipe = pegar('pipe');
    const compose = pegar('compose');
    const mais1 = (x) => x + 1;
    const dobro = (x) => x * 2;
    return {
      pipe: t(() => pipe(mais1, dobro)(3)),
      compose: t(() => compose(mais1, dobro)(3)),
      vazioPipe: t(() => pipe()(5)),
      vazioCompose: t(() => compose()(5)),
      texto: t(() => pipe((x) => x.trim(), (x) => x.toUpperCase(), (x) => x + '!')('  oi ')),
      doisArgs: t(() => pipe((a, b) => a + b, (x) => x * 10)(1, 2)),
      tres: t(() => compose((x) => x - 1, dobro, mais1)(4)),
    };
  });
  const confere = (chave, esperado, msg) => {
    expect(r[chave].erro, `${msg} (mas deu erro: ${r[chave].erro})`).toBeUndefined();
    expect(r[chave].v, msg).toBe(esperado);
  };
  confere('pipe', 8, 'pipe(x => x+1, x => x*2)(3) deveria dar 8 (soma primeiro, depois dobra)');
  confere('compose', 7, 'compose(x => x+1, x => x*2)(3) deveria dar 7 (dobra primeiro, depois soma)');
  confere('vazioPipe', 5, 'pipe() sem funções devolve o próprio valor: pipe()(5) → 5');
  confere('vazioCompose', 5, 'compose() sem funções devolve o próprio valor: compose()(5) → 5');
  confere('texto', 'OI!', 'pipe(trim, toUpperCase, +"!")("  oi ") deveria dar "OI!"');
  confere('doisArgs', 30, 'A primeira função do pipe pode receber vários argumentos: pipe((a,b)=>a+b, x=>x*10)(1,2) → 30');
  confere('tres', 9, 'compose(x=>x-1, dobro, mais1)(4) deveria dar 9');
});

test('R15 – 🔥 memoizar(fn): guarda resultados já calculados (inclusive 0, undefined e vários argumentos)', () => {
  const r = rodar((s) => {
    const memoizar = pegar('memoizar');
    let n = 0;
    const soma = memoizar((a, b) => { n++; return a + b; });
    const v1 = soma(2, 3);
    const v2 = soma(2, 3);
    const aposRepetir = n;
    soma(3, 2);
    const aposOutraOrdem = n;

    let z = 0;
    const zero = memoizar(() => { z++; return 0; });
    zero(); zero(); zero();
    let u = 0;
    const nada = memoizar(() => { u++; return undefined; });
    nada(); nada();
    let o = 0;
    const obj = memoizar((x) => { o++; return x.a; });
    obj({ a: 1 }); obj({ a: 1 });

    const fib = memoizar((k) => (k < 2 ? k : fib(k - 1) + fib(k - 2)));
    const t0 = Date.now();
    const f60 = fib(60);
    return { v1, v2, aposRepetir, aposOutraOrdem, z, u, o, f60, ms: Date.now() - t0 };
  }, null, { ms: 4000, dica: 'Dica: fibonacci recursivo sem memoização é exponencial; com cache cada n é calculado uma vez só.' });
  expect([r.v1, r.v2], 'memoizar(soma)(2, 3) deveria devolver 5 nas duas chamadas').toEqual([5, 5]);
  expect(r.aposRepetir, 'Chamar duas vezes com os mesmos argumentos deveria executar a função original só 1 vez').toBe(1);
  expect(r.aposOutraOrdem, 'Argumentos diferentes ((3, 2) ≠ (2, 3)) precisam executar a função de novo').toBe(2);
  expect(r.z, 'Resultado 0 também é cache! (cuidado com "if (cache[chave])"). Deveria executar 1 vez, executou ' + r.z).toBe(1);
  expect(r.u, 'Resultado undefined também é cache! (dica: use Map.has). Deveria executar 1 vez, executou ' + r.u).toBe(1);
  expect(r.o, 'Argumentos que são objetos iguais ({a:1}) devem reaproveitar o cache (dica: JSON.stringify dos argumentos)').toBe(1);
  expect(r.f60, 'fib(60) deveria ser 1548008755920').toBe(1548008755920);
});

test('R16 – 🔥 curry(fn): aceita os argumentos de um em um ou em grupos, e a função curried é reutilizável', () => {
  const r = rodar((s) => {
    const t = (f) => { try { return { v: f() }; } catch (e) { return { erro: String(e.message) }; } };
    const curry = pegar('curry');
    const soma3 = (a, b, c) => a + b + c;
    const c3 = curry(soma3);
    const mais1 = c3(1);
    const c4 = curry((a, b, c, d) => [a, b, c, d].join('-'));
    return {
      um: t(() => c3(1)(2)(3)),
      dois: t(() => c3(1, 2)(3)),
      tres: t(() => c3(1)(2, 3)),
      todos: t(() => c3(1, 2, 3)),
      reuso1: t(() => mais1(2)(3)),
      reuso2: t(() => mais1(10)(20)),
      quatro: t(() => c4('a')('b', 'c')('d')),
      zero: t(() => curry(() => 42)()),
      umArg: t(() => curry((x) => x * 2)(4)),
    };
  });
  const confere = (chave, esperado, msg) => {
    expect(r[chave].erro, `${msg} (mas deu erro: ${r[chave].erro}; a função devolvida precisa ser chamável até receber todos os argumentos)`).toBeUndefined();
    expect(r[chave].v, msg).toBe(esperado);
  };
  confere('um', 6, 'curry(soma3)(1)(2)(3) deveria dar 6');
  confere('dois', 6, 'curry(soma3)(1, 2)(3) deveria dar 6');
  confere('tres', 6, 'curry(soma3)(1)(2, 3) deveria dar 6');
  confere('todos', 6, 'curry(soma3)(1, 2, 3) deveria dar 6');
  confere('reuso1', 6, 'const mais1 = curry(soma3)(1); mais1(2)(3) deveria dar 6');
  confere('reuso2', 31, 'A função parcial deve poder ser reutilizada: mais1(10)(20) deveria dar 31 (não guarde estado compartilhado!)');
  confere('quatro', 'a-b-c-d', 'curry com 4 argumentos: ("a")("b","c")("d") deveria dar "a-b-c-d"');
  confere('zero', 42, 'curry(() => 42)() deveria dar 42 (função sem parâmetros)');
  confere('umArg', 8, 'curry(x => x * 2)(4) deveria dar 8');
});

test('R17 – 🔥 relatorioVendas(pedidos, cardapio): receita e quantidade por categoria, da maior receita para a menor', () => {
  const pedidos = [
    { id: 1, itens: [{ pratoId: 1, quantidade: 2 }, { pratoId: 3, quantidade: 1 }] },
    { id: 2, itens: [{ pratoId: 1, quantidade: 1 }, { pratoId: 5, quantidade: 3 }, { pratoId: 4, quantidade: 2 }] },
  ];
  casos('relatorioVendas', [
    [[pedidos, CARDAPIO], [
      { categoria: 'pizza', quantidade: 3, receita: 135 },
      { categoria: 'sobremesa', quantidade: 3, receita: 36 },
      { categoria: 'bebida', quantidade: 3, receita: 24 },
    ]],
    [[[], CARDAPIO], []],
    [[[{ id: 3, itens: [{ pratoId: 999, quantidade: 4 }, { pratoId: 5, quantidade: 1 }] }], CARDAPIO], [{ categoria: 'sobremesa', quantidade: 1, receita: 12 }]],
    [[[{ id: 4, itens: [{ pratoId: 3, quantidade: 2 }, { pratoId: 5, quantidade: 1 }, { pratoId: 4, quantidade: 1 }] }], CARDAPIO], [
      { categoria: 'bebida', quantidade: 3, receita: 25.5 },
      { categoria: 'sobremesa', quantidade: 1, receita: 12 },
    ]],
    [[[{ id: 5, itens: [{ pratoId: 5, quantidade: 1 }, { pratoId: 4, quantidade: 1 }] }], [
      { id: 4, nome: 'Água', preco: 6, categoria: 'bebida' }, { id: 5, nome: 'Doce', preco: 6, categoria: 'sobremesa' },
    ]], [
      { categoria: 'bebida', quantidade: 1, receita: 6 },
      { categoria: 'sobremesa', quantidade: 1, receita: 6 },
    ]],
  ]);
  const intactos = rodar((s, d) => { const antes = JSON.stringify(d); pegar('relatorioVendas')(d.p, d.c); return JSON.stringify(d) === antes; }, { p: pedidos, c: CARDAPIO });
  expect(intactos, 'relatorioVendas alterou os pedidos ou o cardápio recebidos').toBe(true);
});
