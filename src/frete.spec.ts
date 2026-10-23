// src/frete.spec.ts
// Atividade 3, desafio opcional — um caso por linha da regra, mais os limites
// exatos de 1 kg e 5 kg e os casos de erro (toThrow).
import { calcularFrete } from './frete';

describe('calcularFrete function', () => {
  it('should charge R$ 10 for a package up to 1 kg', () => {
    // Arrange
    const cep = '01001000';
    const peso = 0.5;

    // Act
    const frete = calcularFrete(cep, peso);

    // Assert
    expect(frete).toBe(10);
  });

  it('should charge R$ 10 at the exact 1 kg boundary', () => {
    // Arrange
    const cep = '01001000';
    const peso = 1;

    // Act
    const frete = calcularFrete(cep, peso);

    // Assert
    expect(frete).toBe(10);
  });

  it('should charge R$ 2 per started kg above 1 kg', () => {
    // Arrange
    const cep = '01001000';
    const peso = 3;

    // Act
    const frete = calcularFrete(cep, peso);

    // Assert
    expect(frete).toBe(14);
  });

  it('should charge R$ 18 at the exact 5 kg boundary', () => {
    // Arrange
    const cep = '01001000';
    const peso = 5;

    // Act
    const frete = calcularFrete(cep, peso);

    // Assert
    expect(frete).toBe(18);
  });

  it('should charge R$ 25 when the weight is above 5 kg', () => {
    // Arrange
    const cep = '01001000';
    const peso = 6;

    // Act
    const frete = calcularFrete(cep, peso);

    // Assert
    expect(frete).toBe(25);
  });

  it('should add R$ 5 when the CEP starts with 9', () => {
    // Arrange
    const cep = '90000000';
    const peso = 3;

    // Act
    const frete = calcularFrete(cep, peso);

    // Assert
    // 10 + 2 * (3 - 1) = 14; região sul + 5 = 19
    expect(frete).toBe(19);
  });

  it('should accept a formatted CEP and still apply the southern surcharge', () => {
    // Arrange
    const cep = '90000-000';
    const peso = 6;

    // Act
    const frete = calcularFrete(cep, peso);

    // Assert
    // acima de 5 kg = 25; região sul + 5 = 30
    expect(frete).toBe(30);
  });

  it('should throw when the CEP is invalid', () => {
    // Arrange
    const cep = 'abc';
    const peso = 2;

    // Act
    const executar = (): number => calcularFrete(cep, peso);

    // Assert
    expect(executar).toThrow('CEP inválido');
  });

  it('should throw when the CEP is missing', () => {
    // Arrange
    const cep = undefined;
    const peso = 2;

    // Act
    const executar = (): number => calcularFrete(cep, peso);

    // Assert
    expect(executar).toThrow(/CEP inválido/);
  });

  it('should throw when the weight is zero or negative', () => {
    // Arrange
    const cep = '01001000';
    const peso = 0;

    // Act
    const executar = (): number => calcularFrete(cep, peso);

    // Assert
    expect(executar).toThrow(/peso inválido/);
  });
});