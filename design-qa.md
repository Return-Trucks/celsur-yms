# ShipmentX v6.1 Design QA

## Result

**final result: passed**

## Reference and render

- Reference: `ShipmentX_Mockup_v6.1.html` at the desktop browser viewport.
- Render: production Next.js server (`pnpm build`, then `pnpm start`) captured with Playwright Chromium.
- The Next experience route serves the supplied v6.1 document unchanged except for the presentation-state layer, so the supplied source remains the visual authority.

## Checked comparison points

1. Desktop app shell: 228px navy sidebar, white top bar, Celsur mark, navigation grouping and badges match the source.
2. Control Tower: KPI order and values, demurrage banner, lifecycle journey, live activity, carrier performance, recommendations, and exception panel match.
3. Secondary workspaces: Dock Calendar deep link renders the correct movement breadcrumb, KPI row, appointment board, filters, coordination list, and WMS queue.
4. Guided and field experiences: Story Mode remains present; the Mobile App dialog opens the Driver and Yard Operator chooser over the active workspace.
5. Responsive/modal behavior: the field-app overlay remains centered and readable over the dimmed desktop console.

## Intentional additions

- **Reset demo** appears in the existing top-bar action group. It restores the seed client scenario.
- Demo mutations persist in browser storage; no additional visual elements or external services were introduced.

## Functional checks

- Production build and TypeScript validation pass.
- `/experience#dockcalendar` and production-root `/#dockcalendar` both open the Dock Calendar workspace.
- The mobile preview opens from the top bar and exposes both required roles.
