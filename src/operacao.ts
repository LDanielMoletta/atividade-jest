// src/operacao.ts
// Atividade 3, passo 4 — objeto montado a partir da operação, para exercitar
// os matchers toBe, toEqual, toBeTruthy, toBeNull e toContain.
export interface Operacao {
  operacao: 'subtracao';
  valores: [number, number];
  resultado: number;
}

/**
 * Monta a descrição da operação de subtração.
 * Entradas não finitas (NaN/Infinity) não formam uma operação válida → null.
 */
export function montarOperacao(a: number, b: number): Operacao | null {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return null;
  }

  return {
    operacao: 'subtracao',
    valores: [a, b],
    resultado: a - b,
  };
}