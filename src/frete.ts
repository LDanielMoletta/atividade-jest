// src/frete.ts
// Atividade 3, desafio opcional — regra de negócio do frete.
//
// Regras:
//   peso até 1 kg ............................ R$ 10,00
//   acima de 1 kg e até 5 kg ................. R$ 10,00 + R$ 2,00 por kg
//                                              adicional (cada kg iniciado)
//   acima de 5 kg ............................ R$ 25,00 (valor fixo)
//   CEP começando com 9 (região sul) ......... + R$ 5,00
//   CEP inválido/ausente ou peso inválido .... lança Error
const CEP_VALIDO = /^\d{8}$/;

export function calcularFrete(cep: string | undefined, peso: number): number {
  const cepLimpo = String(cep ?? '').replace(/\D/g, '');
  if (!CEP_VALIDO.test(cepLimpo)) {
    throw new Error('CEP inválido: informe 8 dígitos');
  }
  if (!Number.isFinite(peso) || peso <= 0) {
    throw new Error('peso inválido: informe um número maior que zero');
  }

  let frete: number;
  if (peso <= 1) {
    frete = 10;
  } else if (peso <= 5) {
    // cada quilo iniciado acima de 1 kg custa R$ 2,00
    frete = 10 + 2 * (Math.ceil(peso) - 1);
  } else {
    frete = 25;
  }

  if (cepLimpo.startsWith('9')) {
    frete += 5;
  }

  return frete;
}