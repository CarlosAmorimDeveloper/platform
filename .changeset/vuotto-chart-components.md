---
'@vuotto/web': minor
'@vuotto/mobile': minor
---

Componentes de gráfico do Vuotto Tech (REB-26, escopo novo — o protótipo estático não tinha gráficos): `LineChart` e `BarChart`, em `@vuotto/web` e `@vuotto/mobile`.

**Decisão de biblioteca**: o critério de aceite pedia "uma camada fina sobre uma lib de gráficos", mas as opções avaliadas traziam riscos reais demais para adotar agora — `victory-native` migrou para `victory-native-xl`, que exige Skia + Reanimated (uma dependência nativa pesada, fora do padrão `react-native-svg`-only que o resto do `@vuotto/mobile` já segue); `react-native-svg-charts` está sem manutenção e carrega toda a árvore `d3-shape`/`d3-scale`/`d3-array`. Optei por construir `LineChart`/`BarChart` direto sobre primitivas SVG — `<svg>` no web, `react-native-svg` no mobile (já é peer dependency ali, usado pelos ícones) — com um `scaleLinear` próprio de ~5 linhas, sem depender de d3. Isso mantém a promessa de "camada fina" de forma literal, sem introduzir uma dependência nativa nova cujo custo de manutenção/risco de quebra com a New Architecture não compensa para 2 tipos de gráfico.

**Paleta de séries**: array ordenado de 4 cores derivadas dos tokens (`--vt-cool`, `--vt-violet`, `--vt-success`, `--vt-warning` — `danger` foi excluído de propósito, já que essa cor significa "erro" em todo o resto do sistema). A partir da 5ª série, a cor se repete e o traço vira tracejado (`strokeDasharray`) para diferenciar, satisfazendo "repetir com padrão".

**Tooltip**: o componente `Tooltip` autônomo ainda não existe (faz parte do épico de Feedback, REB-6, ainda não construído). Em vez de criar uma dependência para um componente que não existe, o tooltip do gráfico reaproveita diretamente os mesmos tokens visuais que o `Card` já usa (`surface-card`/`line-hairline`/`shadow-inset-top` no web; `surfaceCard`/`lineHairline`/`shadow.md` no mobile) — quando `Tooltip` for construído, dá pra trocar essa implementação local pelo componente compartilhado sem mudar a API pública do gráfico.

**Interação**: web usa `onMouseMove` no `<svg>` para achar o ponto mais próximo do cursor (`LineChart`) ou `onMouseEnter` por barra (`BarChart`). Mobile não tem hover — `LineChart` usa o responder system nativo do RN (`onResponderMove`) para arrastar o dedo pela linha, e `BarChart` usa um `Pressable` transparente por barra (tocar alterna o tooltip), já que formas do `react-native-svg` não recebem toque de forma confiável no Android.

**Eixos e grid**: rótulos em mono 12px `text-tertiary`/`textTertiary`; linhas de grade horizontais em `line-hairline`/`lineHairline`. Sem gradiente de área, sem sombra na linha, como pedia o critério de aceite.
