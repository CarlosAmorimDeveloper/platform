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

## Limitação conhecida: ícones e SVG não renderizam no Storybook

`Icon`, `IconButton` e qualquer componente que desenha via `react-native-svg` (`LineChart`, `BarChart`) não aparecem visualmente no preview do Storybook — o componente monta sem erro no console, mas nenhum elemento `<svg>` chega a existir no DOM.

**Causa**: o Storybook simula RN no navegador via `react-native-web`, e a versão atual (`0.19.x`) [ainda não suporta React 19](https://github.com/necolas/react-native-web/issues/2686) (o monorepo inteiro usa React 19). Não é um bug deste pacote nem da configuração do Storybook — é uma incompatibilidade upstream ativa, sem correção oficial lançada ainda.

**Isso não afeta o app real**: um app React Native de verdade, compilado via Metro (iOS/Android), nunca passa pelo `react-native-web` — usa a implementação nativa (Fabric) do `react-native-svg` diretamente. A limitação é só do preview do Storybook no navegador. Ícones/gráficos precisam ser conferidos visualmente no app/simulador até essa incompatibilidade ser resolvida upstream.

## Escopo

Biblioteca de componentes completa (REB-2 a REB-6): `Icon`, `Button`, `IconButton`, `Card`, `Badge`, `Tag`, `Lockup` (Core); `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `SegmentedControl`, `FileDrop` (Forms); `Table`, `Stat`, `ProgressBar`, `EmptyState`, `Skeleton`, `LineChart`, `BarChart` (Data); `Tabs`, `Breadcrumbs`, `Stepper`, `SideNav`, `TabBar` (Navigation); `Banner`, `Tooltip`, `Dialog`, `Toast`/`ToastProvider`/`useToast` (Feedback); `useTheme`.
