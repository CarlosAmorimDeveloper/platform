# Erros encontrados no tickets-app — causas raiz e soluções

App: `apps/mobile/tickets-app` (Expo SDK 54, React Native 0.81.5, New Architecture)
Monorepo: Turborepo + Yarn Workspaces v1

---

## Padrão geral: instâncias duplicadas de módulos

O monorepo tem dois locais de `node_modules`:

- App-local: `apps/mobile/tickets-app/node_modules/`
- Raiz: `node_modules/`

Pacotes instalados em ambos os lugares têm código separado com estado separado — contextos React, Maps de registro, etc. Isso causa erros de contexto (`Provider not found`, `Invalid hook call`), registros que somem, ou verificações de versão que falham.

**Mecanismo de correção universal:** `metro.config.js` usa `resolveRequest` para interceptar e piná-los a uma única cópia antes que o Metro resolva normalmente.

> `extraNodeModules` **não funciona** para esse caso — é um fallback de último recurso consultado somente quando o módulo **não é encontrado** no `nodeModulesPaths`. Como os pacotes existem no `nodeModulesPaths`, o `extraNodeModules` nunca é alcançado. O `resolveRequest` roda antes de tudo e intercepta incondicionalmente.

---

## Erro 1 — Invalid hook call / useContext of null

```
ERROR Invalid hook call. Hooks can only be called inside of a function component.
ERROR [TypeError: Cannot read property 'useContext' of null]
```

**Causa raiz:** dois arquivos físicos de `react` no bundle — app-local e raiz. O JSX transform importa `react/jsx-runtime` como especificador separado; sem interceptá-lo, pacotes hoistados para a raiz resolviam para outra cópia do React.

**Solução:** `resolveRequest` intercepta `react` e `react/*` (incluindo `react/jsx-runtime`, `react/jsx-dev-runtime`) e pina para a cópia app-local.

```js
if (moduleName === 'react' || moduleName.startsWith('react/')) {
  return {
    type: 'sourceFile',
    filePath: require.resolve(moduleName, { paths: [appLocalNodeModules] }),
  };
}
```

**Por que app-local e não raiz:** `react-native 0.81.5` embute um renderer compilado contra exatamente `react@19.1.0` com verificação hardcoded em runtime: `if ("19.1.0" !== React.version) throw Error(...)`. A raiz tem `react@19.2.5` (usada pela web app). O `bundledNativeModules.json` do Expo SDK 54 confirma `"react": "19.1.0"`.

---

## Erro 2 — View config getter callback must be a function (received undefined)

```
ERROR Invariant Violation: View config getter callback for component
`RNCSafeAreaProvider` must be a function (received 'undefined').
```

**Causa raiz:** `react-native-safe-area-context` está hoistado para a raiz do monorepo. Após a transform do codegen Babel, seu output importa `react-native/Libraries/NativeComponent/NativeComponentRegistry` — que resolvia para a cópia **raiz** do `react-native` e registrava `RNCSafeAreaProvider` no `ReactNativeViewConfigRegistry` da raiz. O renderer (compilado da cópia **app-local**) consultava um `Map` diferente — nunca encontrava a entrada.

**Solução:** `resolveRequest` intercepta `react-native` e `react-native/*` e pina para a cópia app-local.

```js
if (moduleName === 'react-native' || moduleName.startsWith('react-native/')) {
  return {
    type: 'sourceFile',
    filePath: require.resolve(moduleName, { paths: [appLocalNodeModules] }),
  };
}
```

**Dependências relacionadas pinadas no `package.json`:**

- `react-native-safe-area-context`: `~5.6.0`
- `react-native-screens`: `~4.16.0`

Versões do `bundledNativeModules.json` do Expo SDK 54 — não usar versões mais recentes sem verificar compatibilidade.

---

## Erro 3 — Incompatible React versions

```
ERROR [Error: Incompatible React versions: The "react" and "react-native-renderer"
packages must have the exact same version. Instead got:
  - react:                  19.2.5
  - react-native-renderer:  19.1.0]
```

**Causa raiz:** o renderer dentro do `react-native 0.81.5` tem verificação hardcoded `if ("19.1.0" !== React.version) throw Error(...)`. Piná-lo para a raiz (19.2.5) falha essa verificação.

**Solução:** `package.json` do app usa `"react": "19.1.0"` e `resolveRequest` pina para a cópia app-local (não para a raiz).

---

## Erro 4 — Provider not found (react-native-paper)

```
ERROR [Error: Looks like you forgot to wrap your root component with `Provider`
component from `react-native-paper`.]
```

**Causa raiz:** duas cópias de `react-native-paper` — app-local e raiz, mesma versão `5.15.2` mas arquivos físicos diferentes. `PaperProvider` em `App.tsx` criava o contexto na cópia app-local; `Dialog` do `@ds/mobile` resolvia para a cópia raiz com um `createContext()` diferente.

**Solução:** `resolveRequest` intercepta `react-native-paper` e `react-native-paper/*`.

```js
if (moduleName === 'react-native-paper' || moduleName.startsWith('react-native-paper/')) {
  return {
    type: 'sourceFile',
    filePath: require.resolve(moduleName, { paths: [appLocalNodeModules] }),
  };
}
```

---

## Erro 5 — react-native-worklets/plugin not found

```
ERROR Cannot find module 'react-native-worklets/plugin'
```

**Causa raiz:** adicionar `@ds/mobile` como dependência puxa transitivamente `nativewind` → `react-native-css-interop` → `react-native-reanimated`. O `react-native-reanimated 4.x` foi dividido e requer `react-native-worklets` como pacote separado (runtime e plugin Babel).

**Solução:** adicionar ao `package.json` do app:

```json
"react-native-reanimated": "~4.1.1",
"react-native-worklets": "0.5.1"
```

Versões do `bundledNativeModules.json` do Expo SDK 54.

---

## Erro 6 — Firestore index required

```
FirebaseError: [code=failed-precondition]: The query requires an index.
```

**Causa raiz:** a query em `Dashboard.tsx` combina `where('creator_id', '==', ...)` com `orderBy('createdAt', 'desc')` — Firestore exige índice composto para filtro em um campo com ordenação em outro diferente.

**Solução:** criar o índice composto no console do Firebase. A URL de criação direta vem na mensagem de erro em runtime. Configuração:

- Collection: `tickets`
- `creator_id` Ascending + `createdAt` Descending
- Query scope: Collection

---

## Regra geral para novos erros de contexto/instância

Se um novo pacote apresentar o mesmo padrão, adicionar ao `resolveRequest` em `metro.config.js`:

```js
if (moduleName === 'nome-do-pacote' || moduleName.startsWith('nome-do-pacote/')) {
  return {
    type: 'sourceFile',
    filePath: require.resolve(moduleName, { paths: [appLocalNodeModules] }),
  };
}
```

**Pacotes atualmente pinados:** `react`, `react-native`, `react-native-paper`.
