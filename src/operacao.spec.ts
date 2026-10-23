// src/operacao.spec.ts
// Atividade 3, passo 4 — cada matcher aplicado à situação adequada.
import { montarOperacao } from './operacao';

describe('montarOperacao function', () => {
  it('should identify the operation as a subtraction using toBe', () => {
    // Arrange
    const a = 10;
    const b = 4;

    // Act
    const operacao = montarOperacao(a, b);

    // Assert
    expect(operacao?.operacao).toBe('subtracao');
  });

  it('should return the full operation object using toEqual', () => {
    // Arrange
    const a = 10;
    const b = 4;

    // Act
    const operacao = montarOperacao(a, b);

    // Assert
    expect(operacao).toEqual({
      operacao: 'subtracao',
      valores: [10, 4],
      resultado: 6,
    });
  });

  it('should return a truthy operation for valid numbers using toBeTruthy', () => {
    // Arrange
    const a = 10;
    const b = 4;

    // Act
    const operacao = montarOperacao(a, b);

    // Assert
    expect(operacao).toBeTruthy();
  });

  it('should return null for non-finite numbers using toBeNull', () => {
    // Arrange
    const a = Number.NaN;
    const b = 2;

    // Act
    const operacao = montarOperacao(a, b);

    // Assert
    expect(operacao).toBeNull();
  });

  it('should keep both values in the array using toContain', () => {
    // Arrange
    const a = 10;
    const b = 4;

    // Act
    const operacao = montarOperacao(a, b);

    // Assert
    expect(operacao?.valores).toContain(10);
    expect(operacao?.valores).toContain(4);
  });
});