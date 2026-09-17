(() => {
  'use strict';

  const CONFIG = {
    nombre: 'Eduardo Carmona',
    titulo: 'Desarrollo Web Profesional & GEO',
    whatsapp: '525540048507',
    whatsappTexto: 'Hola Eduardo, vi tu catálogo de plantillas web y quiero cotizar una solución para mi negocio:'
  };

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const waLink = (text) => 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text || CONFIG.whatsappTexto);

  /* ---------------- Config Loader ---------------- */
  async function loadConfig() {
    try {
      const res = await fetch('negocio.json', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      Object.assign(CONFIG, data);
    } catch (_) {}
  }

  /* ---------------- Nav & Scroll ---------------- */
  function initNav() {
    const nav = qs('#nav');
    const toggle = qs('#navToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
      });
      qsa('.nav-links a').forEach((a) => a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }));
    }
    const onScroll = () => {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------- Filtros de Plantillas ---------------- */
  function initFilters() {
    const filterBtns = qsa('.filter-btn');
    const cards = qsa('.tpl-card');
    const countEl = qs('#filteredCount');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;

        let visible = 0;
        cards.forEach((card) => {
          const cardCats = (card.dataset.category || '').split(' ');
          if (cat === 'all' || cardCats.includes(cat)) {
            card.style.display = 'flex';
            visible++;
          } else {
            card.style.display = 'none';
          }
        });

        if (countEl) {
          countEl.textContent = visible + ' plantilla' + (visible === 1 ? '' : 's') + ' disponible' + (visible === 1 ? '' : 's');
        }
      });
    });
  }

  /* ---------------- Cotizador Dinámico ---------------- */
  function initCotizador() {
    const tplSelect = qs('#cotPlantilla');
    const nombreInput = qs('#cotNombre');
    const negocioInput = qs('#cotNegocio');
    const chips = qsa('#cotAddons .chip');
    const previewEl = qs('#cotPreview');
    const btnSend = qs('#cotSend');

    if (!btnSend || !tplSelect) return;

    const getSelectedAddons = () => chips.filter((c) => c.classList.contains('on')).map((c) => c.dataset.addon);

    const buildMessage = () => {
      const tpl = tplSelect.value;
      const nombre = (nombreInput ? nombreInput.value : '').trim();
      const negocio = (negocioInput ? negocioInput.value : '').trim();
      const addons = getSelectedAddons();

      const lines = ['¡Hola Eduardo! Vi tu catálogo de páginas web y me interesa cotizar:'];
      lines.push('\n📌 Plantilla / Sector: ' + tpl);
      if (negocio) lines.push('🏢 Mi Negocio: ' + negocio);
      if (nombre) lines.push('👤 Mi Nombre: ' + nombre);

      if (addons.length > 0) {
        lines.push('\n✨ Adicionales de interés:');
        addons.forEach((a) => lines.push('  • ' + a));
      }

      lines.push('\n¿Cuál es el tiempo de entrega y cómo podemos coordinar?');
      return lines.join('\n');
    };

    const updatePreview = () => {
      const msg = buildMessage();
      if (previewEl) previewEl.textContent = msg;
      btnSend.href = waLink(msg);
    };

    tplSelect.addEventListener('change', updatePreview);
    if (nombreInput) nombreInput.addEventListener('input', updatePreview);
    if (negocioInput) negocioInput.addEventListener('input', updatePreview);

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('on');
        chip.setAttribute('aria-pressed', String(chip.classList.contains('on')));
        updatePreview();
      });
    });

    qsa('[data-pick-tpl]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.pickTpl;
        if (tplSelect && val) {
          tplSelect.value = val;
          updatePreview();
          const cotSec = qs('#cotizador');
          if (cotSec) cotSec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    updatePreview();
  }

  /* ---------------- FAQ Accordion ---------------- */
  function initFaq() {
    const items = qsa('.faq-item');
    items.forEach((item) => {
      const btn = item.querySelector('.faq-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');
          items.forEach((i) => i.classList.remove('open'));
          if (!isOpen) item.classList.add('open');
        });
      }
    });
  }

  /* ---------------- Start ---------------- */
  document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    initNav();
    initFilters();
    initCotizador();
    initFaq();
  });
})();
