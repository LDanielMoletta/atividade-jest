# Atividade Jest — Testes Automatizados (Node.js + TypeScript)

Projeto das atividades 1 a 3 do módulo **Testes Automatizados com Jest**.
Todas as funções são puras e testadas com Jest + ts-jest; as saídas reais dos
comandos estão em `evidencias/`.

## Stack

| Item | Versão |
| --- | --- |
| Node.js | 24.14.0 |
| npm | 11.18.0 |
| Jest | 30.5.2 |
| ts-jest | 29.4.15 |
| TypeScript | 5.9.3 |
| @types/jest | 30.0.0 |

> O `npm install` com `typescript@latest` (6.0.3) falhava de forma silenciosa
> neste ambiente (npm 11.18 + peer range do ts-jest). Fixar `typescript@5.9.3`
> resolveu; a instalação terminou com `found 0 vulnerabilities`.

## Estrutura

```
atividade-jest/
├── src/
│   ├── sum.ts / sum.spec.ts               # atividade 2
│   ├── subtract.ts / subtract.spec.ts     # atividade 3 (5 casos)
│   ├── operacao.ts / operacao.spec.ts     # atividade 3 (matchers)
│   └── frete.ts / frete.spec.ts           # atividade 3 (desafio)
├── evidencias/
│   ├── atividade-2.txt                    # 1 suíte / 1 teste
│   ├── atividade-3-subtract.txt           # 2 suítes / 6 testes
│   └── final.txt                          # 4 suítes / 21 testes
├── jest.config.js
├── tsconfig.json
├── .watchmanconfig
├── .gitignore
└── package.json
```

### Convenção de nomes escolhida

`*.spec.ts` (teste de unidade) **ao lado** do arquivo de produção, **sem**
diretório `__tests__`. Justificativa:

- proximidade: quem abre `frete.ts` vê `frete.spec.ts` no mesmo diretório;
- import curto e estável (`./frete`), sem subir/descer níveis;
- `.spec` comunica "especificação de unidade", enquanto `.test` é mais comum
  em projetos JS puros;
- manter **uma única** convenção evita a mistura mostrada no material
  (`__tests__/` + testes ao lado do código).

## Como rodar

```bash
npm install          # instala as dependências (node_modules não vai no zip)
npm test             # roda a suíte inteira
npm run test:watch   # modo watch
npm run typecheck    # tsc --noEmit
```

## Configuração

`jest.config.js` foi gerado por `npx ts-jest config:init`:

```js
const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};
```

**Ajustes no snippet do material:** o código do professor tinha dois erros de
digitação — `createDefaultPresent` (o correto é `createDefaultPreset`) e
`.Transform` (o correto é `.transform`). Copiado ao pé da letra, a suíte quebra
com `TypeError`. Também foi mantido `jest.config.js` porque o snippet usa
`require`/`module.exports` (CommonJS); `jest.config.ts` exigiria `ts-node` só
para carregar a configuração. O aviso de Watchman vale para macOS; no Windows
não ocorre, e o `.watchmanconfig` vazio fica como salvaguarda para quem rodar o
projeto no Mac.

`tsconfig.json`: `target ES2022`, `module commonjs`, `strict`, `types:
["jest", "node"]`, `rootDir src`, `outDir dist`.

---

## Atividade 1 — Entendendo testes automatizados

### a) O que é um teste automatizado?

É um programa que executa o código em condições controladas e compara o
resultado obtido com o esperado, falhando de forma explícita quando os dois
divergem. Roda sem intervenção humana, é repetível e pode ser executado em CI a
cada commit.

### b) Unitário × integração × E2E

| Tipo | O que verifica | Escopo | Velocidade | Exemplo aqui |
| --- | --- | --- | --- | --- |
| Unitário | uma unidade isolada (função pura) | 1 função, sem I/O | milissegundos | `calcularFrete` |
| Integração | o contrato entre partes reais | rota + banco/repositório | segundos | endpoint de frete + banco de teste |
| E2E | o fluxo completo pela interface real | app inteiro + navegador | segundos/minutos | compra com cupom no navegador |

### c) Por que testar?

- **Regressão:** uma mudança futura quebra o teste antes de chegar ao usuário.
- **Documentação viva:** o teste descreve o comportamento esperado.
- **Design:** testar força funções pequenas, puras e com dependências explícitas.
- **Confiança para refatorar:** a suíte avisa se o comportamento mudou.
- **Menos defeitos em produção** e correção mais barata (falha perto da causa).

### d) O que é Jest?

Framework de testes para JavaScript/TypeScript criado pela Meta. Reúne runner
(`describe`/`it`), asserções (`expect`), mocks (`jest.fn`, `jest.mock`),
snapshots e relatório de cobertura (`--coverage`). Com `ts-jest`, entende
TypeScript diretamente.

### e) Teste "verde" e teste "vermelho"

- **Verde:** todas as asserções passaram — o comportamento confere com o esperado.
- **Vermelho:** pelo menos uma asserção falhou (ou o código lançou erro) — o
  comportamento diverge do esperado.

### f) Padrão AAA

- **Arrange:** prepara dados e dependências.
- **Act:** executa a unidade sob teste (uma chamada).
- **Assert:** verifica o resultado com `expect`.

### Pirâmide de testes

```
        /\
       /E2E\        poucos, lentos, caros, frágeis
      /------\
     /Integr. \     quantidade moderada
    /----------\
   / Unitários  \   muitos, rápidos, baratos, determinísticos
  /--------------\
```

A base larga de unitários dá feedback rápido; integração cobre contratos;
E2E cobre só os fluxos críticos. O anti-padrão é o **cone de sorvete**: muitos
E2E, poucos unitários — lento, caro e difícil de diagnosticar.

### 5 perguntas finais

1. **Por que não testar tudo com E2E?** É lento, frágil (depende de UI, rede,
   dados) e caro; quando falha, não aponta a causa. E2E cobre poucos fluxos
   críticos; regras ficam nos unitários.
2. **O que torna um teste confiável?** Determinismo (sem relógio/aleatório não
   controlados), isolamento (sem ordem entre testes), preparação explícita,
   uma asserção clara por comportamento e nome que descreve a regra.
3. **Quando usar mock?** Em dependências externas lentas, instáveis ou pagas
   (API, banco, e-mail, relógio, filesystem) e para simular erros que seriam
   difíceis de reproduzir. Não se mocka a unidade que está sendo testada.
4. **Como saber se o teste é bom?** Ele falha quando o comportamento muda
   (verificado com uma mutação proposital no código) e passa quando está
   correto; além disso, é legível, rápido e não depende de outro teste.
   Cobertura alta não garante qualidade — asserção fraca passa com bug.
5. **`toBe` × `toEqual`?** `toBe` compara com `Object.is` (primitivos e
   identidade de referência); `toEqual` compara a estrutura profunda de objetos
   e arrays. Para `{ a: 1 }` recriado, `toBe` falha e `toEqual` passa.

### Caso do cupom

Um único teste E2E "cupom válido aplica desconto" pode ficar **verde** mesmo
com bugs: desconto aplicado duas vezes, cupom expirado aceito, valor negativo
ou cupom acumulado indevidamente. O teste só olha o total final de um caminho
feliz.

O que fazer:

1. **Unitários** das regras de desconto: percentual, valor fixo, teto mínimo,
   expiração (relógio injetado/fake timers), cupom inexistente, cupom já usado,
   acúmulo permitido/proibido, arredondamento.
2. **Integração** do endpoint com banco de teste: cupom existe, está ativo e é
   consumido uma única vez (verificar persistência).
3. **E2E** apenas do fluxo crítico (aplicar cupom na compra), com dados
   determinísticos e um caso de cupom inválido.
4. Dados fixos e relógio controlado; nada de depender do cupom "de produção".

---

## Atividade 2 — Primeiro teste

`src/sum.ts`:

```ts
export function sum(a: number, b: number): number {
  return a + b;
}
```

`src/sum.spec.ts` segue AAA e usa `toBe`. Saída real
(`evidencias/atividade-2.txt`):

```
PASS src/sum.spec.ts
  sum function
    √ should add two numbers correctly

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

**Perguntas do material:**

- **Jest encontrou o teste?** Sim, pelo padrão padrão `**/*.spec.ts` — não foi
  preciso configurar `testMatch`.
- **Por que `npm test` em vez de `npx jest`?** O script versiona a configuração
  do projeto; qualquer pessoa (ou CI) roda o mesmo comando.
- **O que aconteceria se `sum` retornasse `a - b`?**
  `expect(2 + 3).toBe(5)` receberia `-1` → teste **vermelho** com
  `Expected: 5, Received: -1`.

## Atividade 3 — Função `subtract` (5 casos)

`src/subtract.ts` retorna `a - b`; cada caso segue AAA com `toBe`.

| Caso | Entrada | Esperado | Teste |
| --- | --- | --- | --- |
| positivos | 10 − 4 | 6 | `should subtract two positive numbers correctly` |
| resultado negativo | 3 − 8 | −5 | `should return a negative result...` |
| subtrair zero | 7 − 0 | 7 | `should return the same number when subtracting zero` |
| negativos | −5 − (−2) | −3 | `should subtract two negative numbers correctly` |
| decimais | 5,5 − 2,5 | 3 | `should subtract decimal numbers correctly` |

Checkpoint do material — **2 suítes / 6 testes**
(`evidencias/atividade-3-subtract.txt`):

```
PASS src/subtract.spec.ts
PASS src/sum.spec.ts

Test Suites: 2 passed, 2 total
Tests:       6 passed, 6 total
```

## Atividade 3 — Matchers (`src/operacao.ts`)

`montarOperacao(a, b)` devolve `{ operacao, valores, resultado }` ou `null`
para entradas não finitas.

| Matcher | Situação testada |
| --- | --- |
| `toBe` | `operacao.operacao === 'subtracao'` (primitivo) |
| `toEqual` | objeto inteiro `{ operacao, valores: [10, 4], resultado: 6 }` |
| `toBeTruthy` | objeto retornado para entradas válidas |
| `toBeNull` | `NaN` como entrada → `null` |
| `toContain` | array `valores` contém `10` e `4` |

## Atividade 3 — Desafio `calcularFrete`

Regra implementada (`src/frete.ts`):

- peso ≤ 1 kg → R$ 10,00;
- 1 < peso ≤ 5 kg → R$ 10,00 + R$ 2,00 por kg **iniciado** acima de 1 kg
  (3 kg → 10 + 2×2 = 14);
- peso > 5 kg → R$ 25,00 fixo;
- CEP começando em 9 → + R$ 5,00 (aceita `90000-000`);
- CEP inválido/ausente (fora do padrão de 8 dígitos) ou peso ≤ 0/`NaN` →
  `Error` (`toThrow`).

Casos cobertos: 0,5 kg; **limite exato de 1 kg** (10); 3 kg (14);
**limite exato de 5 kg** (18); 6 kg (25); CEP 9 com 3 kg (19); CEP 9
formatado com 6 kg (30); CEP `abc`; CEP ausente; peso 0. A decisão de
arredondar cada quilo iniciado (`Math.ceil`) está documentada no código —
peso fracionário como 1,5 kg cai em 12 (dois quilos iniciados).

## Resultado final

```
PASS src/subtract.spec.ts
PASS src/sum.spec.ts
PASS src/operacao.spec.ts
PASS src/frete.spec.ts

Test Suites: 4 passed, 4 total
Tests:       21 passed, 21 total
```

`npm run typecheck` termina com código 0.

## Entregáveis

- Código-fonte em `src/` (4 funções + 4 arquivos de teste).
- Evidências reais em `evidencias/` (saídas de `npm test` copiadas para `.txt`).
- Este README com as respostas da atividade 1, justificativa da convenção de
  nomes e ajustes nas instruções do professor.
