window.REFRIFULL = window.REFRIFULL || {};

REFRIFULL.app = {
  _currentRoute: '',

  init() {
    window.addEventListener('hashchange', () => this._handleRoute());
    document.addEventListener('click', e => this._handleClick(e));
    document.addEventListener('input', e => this._handleInput(e));
    document.addEventListener('submit', e => this._handleSubmit(e));
    this._handleRoute();
  },

  showToast(msg, type) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type || 'info'}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast-visible'));
    setTimeout(() => { toast.classList.remove('toast-visible'); setTimeout(() => toast.remove(), 300); }, 2500);
  },

  navigate(hash) {
    window.location.hash = hash;
  },

  /* ─── ROUTER ─── */
  _handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    if (hash === this._currentRoute) return;
    this._currentRoute = hash;
    this._renderRoute(hash);
    this._updateActiveNav(hash);
  },

  _parseRoute(hash) {
    const parts = hash.split('?');
    const path = parts[0];
    const params = {};
    if (parts[1]) {
      parts[1].split('&').forEach(p => {
        const [k, v] = p.split('=');
        params[k] = decodeURIComponent(v || '');
      });
    }
    return { path, params };
  },

  _renderRoute(hash) {
    const { path, params } = this._parseRoute(hash);
    REFRIFULL.router = { path, params };
    const main = document.getElementById('main-content');
    if (!main) return;

    let html = '';

    if (path === '/' || path === '') {
      html = REFRIFULL.views.renderDashboard();
    } else if (path === '/catalog') {
      html = REFRIFULL.views.renderCatalog();
    } else if (path.startsWith('/budget/new')) {
      html = REFRIFULL.editor.render(null);
    } else if (path.startsWith('/budget/edit/')) {
      const id = path.split('/').pop();
      html = REFRIFULL.editor.render(id);
    } else if (path === '/budgets') {
      html = REFRIFULL.views.renderHistory();
    } else if (path === '/templates') {
      html = REFRIFULL.views.renderTemplates();
    } else if (path === '/settings') {
      html = REFRIFULL.views.renderSettings();
    } else {
      html = `<div class="empty-state"><h2>404</h2><p>Página no encontrada</p><a href="#/" class="btn-primary" data-link>Volver al inicio</a></div>`;
    }

    main.innerHTML = html;
    this._initRoutePlugins(path);
  },

  _updateActiveNav(hash) {
    document.querySelectorAll('.nav-item').forEach(a => {
      const href = a.getAttribute('href');
      let active = false;
      if (hash === '/' || hash === '') {
        active = href === '#/';
      } else if (href && hash.startsWith(href) && href !== '#/') {
        active = true;
      }
      a.classList.toggle('active', active);
    });
  },

  _refreshPreview() {
    const previewContainer = document.querySelector('.editor-preview');
    if (previewContainer && REFRIFULL.editor.currentBudget) {
      previewContainer.innerHTML = REFRIFULL.editor._renderPreview(REFRIFULL.editor.currentBudget);
    }
  },

  /* ─── EVENT DELEGATION ─── */
  _handleClick(e) {
    const target = e.target.closest('[data-link], [data-action]');
    if (!target) return;

    // Navigation links
    if (target.matches('[data-link]')) {
      e.preventDefault();
      const href = target.getAttribute('href');
      if (href && href.startsWith('#')) {
        this.navigate(href.slice(1));
      }
      return;
    }

    const action = target.dataset.action;

    // ── Catalog actions ──
    if (action === 'show-add-form') {
      const container = document.querySelector('.catalog-form-container');
      if (container) {
        container.innerHTML = REFRIFULL.views._catalogFormHTML(null);
        container.querySelector('input[name="name"]')?.focus();
      }
      return;
    }
    if (action === 'edit-item') {
      const id = target.dataset.id;
      const item = REFRIFULL.store.getCatalogItems().find(i => i.id === id);
      if (!item) return;
      const container = document.querySelector('.catalog-form-container');
      if (container) container.innerHTML = REFRIFULL.views._catalogFormHTML(item);
      return;
    }
    if (action === 'delete-item') {
      const id = target.dataset.id;
      if (confirm('¿Eliminar este ítem del catálogo?')) {
        REFRIFULL.store.deleteCatalogItem(id);
        this.navigate('/catalog');
      }
      return;
    }
    if (action === 'cancel-form') {
      document.querySelector('.catalog-form-container').innerHTML = '';
      return;
    }

    // ── Budget list actions ──
    if (action === 'duplicate-budget') {
      const id = target.dataset.id;
      const budget = REFRIFULL.store.getBudget(id);
      if (budget) {
        const copy = JSON.parse(JSON.stringify(budget));
        copy.id = REFRIFULL.store.generateId();
        copy.number = REFRIFULL.store.getNextBudgetNumber();
        copy.status = 'borrador';
        copy.createdAt = new Date().toISOString();
        copy.updatedAt = copy.createdAt;
        REFRIFULL.store.saveBudget(copy);
        this.showToast('Presupuesto duplicado', 'success');
        this.navigate(`/budget/edit/${copy.id}`);
      }
      return;
    }
    if (action === 'delete-budget') {
      const id = target.dataset.id;
      if (confirm('¿Eliminar este presupuesto? Esta acción no se puede deshacer.')) {
        REFRIFULL.store.deleteBudget(id);
        this.showToast('Presupuesto eliminado', 'info');
        this.navigate('/budgets');
      }
      return;
    }

    // ── Template actions ──
    if (action === 'use-template') {
      const id = target.dataset.id;
      this.navigate(`/budget/new?template=${id}`);
      return;
    }
    if (action === 'delete-template') {
      const id = target.dataset.id;
      if (confirm('¿Eliminar esta plantilla?')) {
        REFRIFULL.store.deleteTemplate(id);
        this.showToast('Plantilla eliminada', 'info');
        this.navigate('/templates');
      }
      return;
    }

    // ── Editor actions ──
    if (action === 'add-section') {
      const editor = REFRIFULL.editor;
      editor._collectFormData();
      editor.currentBudget.sections.push({
        id: REFRIFULL.store.generateId(),
        name: 'Nueva sección',
        items: []
      });
      this._refreshEditorForm();
      return;
    }
    if (action === 'delete-section') {
      const sectionId = target.dataset.sectionId;
      const editor = REFRIFULL.editor;
      if (!editor.currentBudget) return;
      if (editor.currentBudget.sections.length <= 1) {
        this.showToast('Debe haber al menos una sección', 'error');
        return;
      }
      if (confirm('¿Eliminar esta sección y todos sus ítems?')) {
        editor._collectFormData();
        editor.currentBudget.sections = editor.currentBudget.sections.filter(s => s.id !== sectionId);
        this._refreshEditorForm();
      }
      return;
    }
    if (action === 'add-item') {
      const sectionId = target.dataset.sectionId;
      const editor = REFRIFULL.editor;
      if (!editor.currentBudget) return;
      editor._collectFormData();
      const section = editor.currentBudget.sections.find(s => s.id === sectionId);
      if (section) {
        section.items.push({
          id: REFRIFULL.store.generateId(),
          description: '',
          quantity: 1,
          unitPrice: 0,
          currency: '$U',
          ivaType: 'plus'
        });
        this._refreshEditorForm();
        setTimeout(() => {
          const rows = document.querySelectorAll(`[data-section-id="${sectionId}"] .item-desc-input`);
          if (rows.length > 0) rows[rows.length - 1].focus();
        }, 50);
      }
      return;
    }
    if (action === 'delete-item') {
      const itemId = target.dataset.itemId;
      const editor = REFRIFULL.editor;
      if (!editor.currentBudget) return;
      editor._collectFormData();
      for (const s of editor.currentBudget.sections) {
        const idx = s.items.findIndex(item => item.id === itemId);
        if (idx >= 0) {
          s.items.splice(idx, 1);
          break;
        }
      }
      this._refreshEditorForm();
      return;
    }
    if (action === 'catalog-pick') {
      const itemId = target.dataset.itemId;
      this._showCatalogPicker(itemId);
      return;
    }
    if (action === 'close-modal') {
      document.getElementById('catalog-modal')?.classList.add('hidden');
      return;
    }
    if (action === 'save-budget') {
      REFRIFULL.editor.saveCurrent();
      return;
    }
    if (action === 'print-budget') {
      REFRIFULL.editor.saveCurrent();
      setTimeout(() => window.print(), 200);
      return;
    }
    if (action === 'save-as-template') {
      this._promptSaveTemplate();
      return;
    }

    // ── Settings actions ──
    if (action === 'export-data') {
      const data = REFRIFULL.store.exportAll();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'refrifull-backup.json';
      a.click();
      URL.revokeObjectURL(url);
      this.showToast('Datos exportados', 'success');
      return;
    }
    if (action === 'import-data') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          try {
            const data = JSON.parse(ev.target.result);
            REFRIFULL.store.importAll(data);
            this.showToast('Datos importados correctamente', 'success');
            this.navigate('/');
          } catch {
            this.showToast('Error al importar: archivo inválido', 'error');
          }
        };
        reader.readAsText(file);
      };
      input.click();
      return;
    }
  },

  /* ─── CATALOG PICKER MODAL ─── */
  _showCatalogPicker(itemId) {
    const items = REFRIFULL.store.getCatalogItems();
    const modal = document.getElementById('catalog-modal');
    const list = document.getElementById('modal-catalog-list');
    if (!modal || !list) return;
    this._pickerTargetItemId = itemId;
    this._renderCatalogPickerList(items);
    modal.classList.remove('hidden');
    const search = document.getElementById('modal-catalog-search');
    if (search) {
      search.value = '';
      search.focus();
      search.oninput = () => {
        const q = search.value.toLowerCase();
        this._renderCatalogPickerList(items.filter(i =>
          i.name.toLowerCase().includes(q) ||
          (i.description || '').toLowerCase().includes(q)
        ));
      };
    }
  },

  _renderCatalogPickerList(items) {
    const list = document.getElementById('modal-catalog-list');
    if (!list) return;
    if (items.length === 0) {
      list.innerHTML = '<div class="empty-state"><p>Sin resultados</p></div>';
      return;
    }
    list.innerHTML = items.map(item => `
      <div class="catalog-pick-item" data-catalog-item-id="${item.id}">
        <div class="pick-item-name">${item.name}</div>
        <div class="pick-item-meta">${item.category || '—'} · ${item.currency || '$U'} ${item.defaultPrice || 0} · ${item.ivaType === 'included' ? 'IVA incluido' : '+ IVA'}</div>
      </div>
    `).join('');

    list.querySelectorAll('.catalog-pick-item').forEach(el => {
      el.addEventListener('click', () => {
        const catItem = items.find(i => i.id === el.dataset.catalogItemId);
        if (!catItem) return;
        const targetId = this._pickerTargetItemId;
        const row = document.querySelector(`[data-item-id="${targetId}"]`);
        if (row) {
          row.querySelector('.item-desc-input').value = catItem.name;
          row.querySelector('.item-price-input').value = catItem.defaultPrice || 0;
          const curSelect = row.querySelector('.item-currency-select');
          if (curSelect) curSelect.value = catItem.currency || '$U';
          const ivaSelect = row.querySelector('.item-ivatype-select');
          if (ivaSelect) ivaSelect.value = catItem.ivaType || 'plus';
        }
        document.getElementById('catalog-modal')?.classList.add('hidden');
        if (REFRIFULL.editor.currentBudget) {
          this._refreshPreview();
        }
      });
    });
  },

  /* ─── REFRESH EDITOR FORM ─── */
  _refreshEditorForm() {
    const editor = REFRIFULL.editor;
    if (!editor.currentBudget) return;
    const formContainer = document.querySelector('.editor-form');
    if (formContainer) {
      formContainer.innerHTML = editor._renderForm(editor.currentBudget);
    }
    this._refreshPreview();
  },

  /* ─── SAVE AS TEMPLATE ─── */
  _promptSaveTemplate() {
    const editor = REFRIFULL.editor;
    if (!editor.currentBudget) return;
    const name = prompt('Nombre de la plantilla:', editor.currentBudget.title || 'Nueva plantilla');
    if (!name) return;
    const description = prompt('Descripción (opcional):', '');
    const tpl = {
      id: REFRIFULL.store.generateId(),
      name,
      description: description || '',
      sections: JSON.parse(JSON.stringify(editor.currentBudget.sections)),
      defaultTitle: editor.currentBudget.title,
      defaultComment: editor.currentBudget.comment
    };
    REFRIFULL.store.saveTemplate(tpl);
    this.showToast('Plantilla guardada', 'success');
  },

  /* ─── INPUT HANDLING ─── */
  _handleInput(e) {
    if (!REFRIFULL.editor.currentBudget) return;
    if (e.target.closest('.editor-layout')) {
      if (this._previewTimer) clearTimeout(this._previewTimer);
      this._previewTimer = setTimeout(() => this._refreshPreview(), 200);
    }
  },

  /* ─── FORM SUBMISSION ─── */
  _handleSubmit(e) {
    const form = e.target;
    if (form.id === 'settings-form') {
      e.preventDefault();
      const data = new FormData(form);
      const config = REFRIFULL.store.getConfig();
      config.company.name = data.get('company.name') || config.company.name;
      config.company.rut = data.get('company.rut') || config.company.rut;
      config.company.phone = data.get('company.phone') || config.company.phone;
      config.company.email = data.get('company.email') || config.company.email;
      config.company.location = data.get('company.location') || config.company.location;
      REFRIFULL.store.saveConfig(config);
      this.showToast('Configuración guardada', 'success');
      return;
    }

    if (form.matches('.catalog-form')) {
      e.preventDefault();
      const data = new FormData(form);
      const id = data.get('id') || REFRIFULL.store.generateId();
      const item = {
        id,
        name: data.get('name'),
        description: data.get('description') || '',
        defaultPrice: parseFloat(data.get('defaultPrice')) || 0,
        currency: data.get('currency') || '$U',
        ivaType: data.get('ivaType') || 'plus',
        category: data.get('category') || 'Otros',
        unit: data.get('unit') || 'servicio'
      };
      REFRIFULL.store.saveCatalogItem(item);
      this.showToast('Ítem guardado en el catálogo', 'success');
      this.navigate('/catalog');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => REFRIFULL.app.init());
