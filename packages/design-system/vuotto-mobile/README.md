# @vuotto/mobile

Componentes React Native (puro — sem React Native Paper nem outra lib de UI por baixo) do design system da marca **Vuotto Tech**. Ver [`@vuotto/tokens`](../vuotto-tokens/README.md) para os tokens compartilhados com [`@vuotto/web`](../vuotto-web/README.md).

Base em `View`/`Text`/`Pressable` puros — não React Native Paper. A marca pede "neutro cross-platform, sem chrome de iOS ou Material" (`~/Documents/rebranding/readme.md`), e o MD3 do Paper exigiria brigar com os defaults dele a cada componente; construir do zero em cima dos primitivos do RN evita essa fricção, ao custo de mais trabalho por componente.

## Instalação

```ts
import { Icon, useTheme } from '@vuotto/mobile';

function Example() {
  const { colors } = useTheme();
  return <Icon name="ArrowRight" color={colors.textPrimary} size="sm" />;
}
```

Peer deps: `react-native-svg` (o Lucide React Native é baseado em SVG) e `@react-native-async-storage/async-storage` (persistência de tema) — ambos já usados em `@ds/mobile`/`tickets-app`/`appointmate`, nenhuma dependência nova pro monorepo.

## Diferenças de plataforma vs. `@vuotto/web` (não são bugs, são limitações reais de cada ambiente)

- **`Icon`**: nome em PascalCase (`"ArrowRight"`, não `"arrow-right"`) — é a própria convenção do `lucide-react-native`. `color` é **obrigatório** (RN não tem `currentColor`, não há cascata de CSS pra herdar de um elemento pai). E ao contrário do `lucide-react/dynamic` do web, o `lucide-react-native` **não tem import dinâmico por nome** — o Metro não faz code-splitting por ícone do jeito que Vite/webpack fazem, e a própria doc do Lucide desaconselha o padrão "importa tudo e indexa por nome" por aumentar bastante o tamanho do bundle. Este wrapper usa esse padrão mesmo assim, pra manter a mesma API `<Icon name="..." />` — é uma troca real (bundle maior), não uma solução escondida.
- **`useTheme()`**: não existe atributo/seletor CSS no RN pra um hook "só" alternar — `useTheme()` aqui devolve o objeto de cores resolvido pro tema atual (`colors.textPrimary`, etc.), não só o nome do tema. `AsyncStorage` é assíncrono (ao contrário do `localStorage`), então o hook começa em `system` e troca pra preferência salva assim que carrega — pode haver um frame com o tema errado no cold start.

## Build

```sh
yarn workspace @vuotto/mobile build
yarn workspace @vuotto/mobile dev  # tsup --watch
```

## Linkagem de fontes

`@vuotto/tokens` só define os _nomes_ das famílias (`fontFamily.sans` = `"Manrope"`, etc.) — vincular os arquivos de fonte no projeto nativo (via `expo-font`, ou `react-native.config.js` + `npx react-native-asset` num app bare) é responsabilidade do app consumidor, não deste pacote.

## Escopo (REB-15, REB-16 / VT-4, VT-5 — estendidos pra cobrir mobile)

Só `Icon` e `useTheme`. Os 30 componentes e os 4 UI kits do backlog são as próximas fases (REB-2 em diante) — vão precisar de uma versão RN de cada um, junto da versão web já existente.
