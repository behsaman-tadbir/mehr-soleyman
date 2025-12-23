# Frontend Delivery Checklist (mehr-soleyman)

- [ ] **Meta viewport present** on every page; RTL language set where needed.
- [ ] **CSS order**: base.css → layout.css → components.css → pages.css linked in head.
- [ ] **Container system**: all main sections and header/footer content wrapped in `.container` for aligned gutters.
- [ ] **Responsive**: layouts collapse to single column ≤768px; verify breakpoints 992px/768px/560px.
- [ ] **Typography**: Vazirmatn with weights 400/500/700; line-height ≥1.8; only key text bolded.
- [ ] **Images**: `max-width:100%`, `height:auto`; no horizontal overflow (`overflow-x:hidden`).
- [ ] **Components**: buttons/rails/cards use shared styles in components.css/pages.css; avoid inline styles.
- [ ] **JS**: shared scripts live in `assets/js/main.js`; page-specific scripts isolated if added.
