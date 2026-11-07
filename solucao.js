'use strict';
// Escreva suas soluções neste arquivo. Cada função está pronta para ser implementada:
// troque o "throw" pelo seu código. Leia o README para ver exemplos e os requisitos.
//
// Formato dos dados:
//   prato   = { id, nome, preco, categoria, disponivel }
//   pedido  = { cliente: { nome }, itens: [{ nome, preco, quantidade }], taxaEntrega }

/** nomesDosPratos(cardapio) -> ['Pizza Margherita', 'Suco de Laranja', ...]  (use map; sem for/while) */
function nomesDosPratos(cardapio) {
  throw new Error('Função ainda não implementada');
}

/** pratosDisponiveis(cardapio) -> só os pratos com disponivel: true  (use filter) */
function pratosDisponiveis(cardapio) {
  throw new Error('Função ainda não implementada');
}

/** totalDoPedido([{ preco: 10, quantidade: 2 }, { preco: 5.5, quantidade: 1 }]) -> 25.5  (use reduce; arredonde em 2 casas) */
function totalDoPedido(itens) {
  throw new Error('Função ainda não implementada');
}

/** pratoMaisCaro(cardapio) -> o prato de maior preço (ou null se a lista for vazia)  (use reduce) */
function pratoMaisCaro(cardapio) {
  throw new Error('Função ainda não implementada');
}

/** ordenarPorPreco(cardapio, 'desc') -> NOVA lista ordenada; não altere a original */
function ordenarPorPreco(cardapio, ordem = 'asc') {
  throw new Error('Função ainda não implementada');
}

/** agruparPorCategoria(cardapio) -> { pizza: [...], bebida: [...], sobremesa: [...] }  (use reduce) */
function agruparPorCategoria(cardapio) {
  throw new Error('Função ainda não implementada');
}

/** resumoPedido({ cliente: { nome: 'Maria' }, itens: [...], taxaEntrega: 5.5 }) -> 'Maria: 2x Pizza, 1x Suco | Total: R$ 104,50' */
function resumoPedido(pedido) {
  throw new Error('Função ainda não implementada');
}

/** removerDuplicados([1, 2, 2, 3, 1]) -> [1, 2, 3]  (use Set) */
function removerDuplicados(lista) {
  throw new Error('Função ainda não implementada');
}

/** unirCardapios(a, b) -> lista nova com os pratos de a e b, sem repetir id (o de b vence)  (use Map) */
function unirCardapios(a, b) {
  throw new Error('Função ainda não implementada');
}

/** contarPalavras('O gato e o rato') -> { o: 2, gato: 1, e: 1, rato: 1 } */
function contarPalavras(texto) {
  throw new Error('Função ainda não implementada');
}

/** const c = criarContador(); c.incrementar(); c.valor() -> 1   (também: decrementar, resetar) */
function criarContador(inicial = 0) {
  throw new Error('Função ainda não implementada');
}

/** const c = criarCarrinho(); c.adicionar({ id: 1, nome: 'Pizza', preco: 45 }, 2); c.total() -> 90   (também: remover, itens) */
function criarCarrinho() {
  throw new Error('Função ainda não implementada');
}

/** pipe(x => x + 1, x => x * 2)(3) -> 8   (esquerda → direita) */
function pipe(...funcoes) {
  throw new Error('Função ainda não implementada');
}

/** compose(x => x + 1, x => x * 2)(3) -> 7   (direita → esquerda) */
function compose(...funcoes) {
  throw new Error('Função ainda não implementada');
}

/** 🔥 const rapida = memoizar(funcaoLenta); rapida(2); rapida(2) -> a segunda vem do cache */
function memoizar(fn) {
  throw new Error('Função ainda não implementada');
}

/** 🔥 curry((a, b, c) => a + b + c)(1)(2)(3) -> 6   (também: (1, 2)(3) e (1)(2, 3)) */
function curry(fn) {
  throw new Error('Função ainda não implementada');
}

/** 🔥 relatorioVendas(pedidos, cardapio) -> [{ categoria, quantidade, receita }] da maior receita para a menor */
function relatorioVendas(pedidos, cardapio) {
  throw new Error('Função ainda não implementada');
}

module.exports = {
  nomesDosPratos, pratosDisponiveis, totalDoPedido, pratoMaisCaro, ordenarPorPreco,
  agruparPorCategoria, resumoPedido, removerDuplicados, unirCardapios, contarPalavras,
  criarContador, criarCarrinho, pipe, compose, memoizar,
  curry, relatorioVendas,
};
