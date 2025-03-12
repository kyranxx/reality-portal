# Reality Portal

Reality Portal je realitný portál pre predaj a prenájom nehnuteľností na Slovensku.

## Technológie

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

## Štruktúra projektu

- `/src/app` - Next.js App Router stránky
- `/src/components` - React komponenty
- `/public` - Statické súbory

## Inštalácia

### Nastavenie prostredia

1. Skopírujte súbor `.env.example` do `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Upravte súbor `.env.local` a pridajte vaše Supabase prihlasovacie údaje:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### Inštalácia a spustenie

```bash
# Inštalácia závislostí
npm install

# Spustenie vývojového servera
npm run dev

# Spustenie optimalizovaného vývojového servera (rýchlejšie)
npm run dev:turbo
```

### Optimalizácia vývojového prostredia

Pre rýchlejší vývojový server sme implementovali nasledujúce optimalizácie:

1. **Turbopack** - Rýchlejší bundler ako Webpack, spustiteľný cez `npm run dev:turbo`
2. **SWC Minify** - Rýchlejšia alternatíva k Terser
3. **Ignorovanie TypeScript chýb počas vývoja** - Zrýchľuje kompiláciu
4. **Ignorovanie ESLint počas vývoja** - Zrýchľuje kompiláciu

Tieto optimalizácie sú určené len pre vývojové prostredie. Pri produkčnom buildi (`npm run build`) 
sa TypeScript a ESLint kontroly vykonajú normálne.

## Funkcie

- Prehliadanie nehnuteľností
- Vyhľadávanie a filtrovanie
- Používateľské účty (plánované)
- Správa nehnuteľností (plánované)
- Kontaktný formulár (plánované)

## Nasadenie

Projekt je nasadený na platforme Vercel.

### Nastavenie Vercel prostredia

Pri nasadení na Vercel je potrebné nastaviť nasledujúce premenné prostredia v nastaveniach projektu:

1. Prejdite do Vercel dashboardu
2. Vyberte váš projekt
3. Prejdite do "Settings" > "Environment Variables"
4. Pridajte nasledujúce premenné:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Znovu nasaďte aplikáciu

**Poznámka**: Ak nie sú nastavené Supabase premenné prostredia, aplikácia bude fungovať v obmedzenom režime bez autentifikácie a databázových funkcií. Toto umožňuje prehliadanie statického obsahu aj bez pripojenia k Supabase.

### Riešenie problémov s nasadením

Ak sa po nasadení na Vercel zobrazujú chyby "Unexpected token '<'", skontrolujte:

1. Či sú správne nastavené premenné prostredia v Vercel dashboarde
2. Či je správne nakonfigurovaný súbor `next.config.js`
3. Skúste vyčistiť Vercel cache a znovu nasadiť aplikáciu:
   - Prejdite do Vercel dashboardu > Váš projekt > Settings > General
   - Scrollujte dole na "Build & Development Settings"
   - Kliknite na "Clear build cache and redeploy"
