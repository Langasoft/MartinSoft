window.REFRIFULL = window.REFRIFULL || {};

REFRIFULL.editor = {
  currentBudget: null,

  render(budgetId) {
    if (budgetId) {
      const saved = REFRIFULL.store.getBudget(budgetId);
      this.currentBudget = saved ? JSON.parse(JSON.stringify(saved)) : this._createBudget();
    } else {
      const tplId = REFRIFULL.router?.params?.template || '';
      if (tplId) {
        const tpl = REFRIFULL.store.getTemplate(tplId);
        this.currentBudget = tpl ? this._fromTemplate(tpl) : this._createBudget();
      } else {
        this.currentBudget = this._createBudget();
      }
    }
    return this._renderLayout();
  },

  _createBudget() {
    const now = new Date();
    const fmt = d => String(d.getDate()).padStart(2,'0') + '/' + String(d.getMonth()+1).padStart(2,'0') + '/' + d.getFullYear();
    return {
      id: REFRIFULL.store.generateId(),
      number: REFRIFULL.store.getNextBudgetNumber(),
      client: '',
      title: '',
      date: fmt(now),
      comment: '',
      sections: [{
        id: REFRIFULL.store.generateId(),
        name: 'Mano de obra',
        items: [{
          id: REFRIFULL.store.generateId(),
          description: '',
          quantity: 1,
          unitPrice: 0,
          currency: '$U',
          ivaType: 'plus'
        }]
      }],
      status: 'borrador',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
  },

  _fromTemplate(tpl) {
    const budget = this._createBudget();
    budget.title = tpl.defaultTitle || '';
    budget.comment = tpl.defaultComment || '';
    budget.sections = JSON.parse(JSON.stringify(tpl.sections || []));
    budget.sections.forEach(s => {
      s.id = REFRIFULL.store.generateId();
      (s.items || []).forEach(item => { item.id = REFRIFULL.store.generateId(); });
    });
    return budget;
  },

  _renderLayout() {
    return `
      <div class="editor-layout">
        <div class="editor-form">${this._renderForm(this.currentBudget)}</div>
        <div class="editor-preview">${this._renderPreview(this.currentBudget)}</div>
      </div>
      <div class="catalog-modal-overlay hidden" id="catalog-modal">
        <div class="catalog-modal">
          <div class="catalog-modal-header">
            <h3>Seleccionar del catálogo</h3>
            <button class="btn-icon-sm" data-action="close-modal">✕</button>
          </div>
          <input type="text" id="modal-catalog-search" placeholder="Buscar..." class="search-input" style="margin-bottom:0.75rem">
          <div class="catalog-modal-list" id="modal-catalog-list"></div>
        </div>
      </div>
    `;
  },

  _renderForm(b) {
    return `
      <div class="editor-header">
        <a href="#/" class="back-link" data-link>← Volver</a>
        <h2>${b.number}</h2>
        <span class="status-badge status-${b.status}">${b.status}</span>
      </div>
      <div class="form-panel panel-card">
        <div class="form-group">
          <label>Cliente</label>
          <input type="text" id="field-client" value="${b.client}" placeholder="Nombre del cliente o empresa">
        </div>
        <div class="form-group">
          <label>Título / Equipo evaluado</label>
          <input type="text" id="field-title" value="${b.title}" placeholder="Ej: Aire Acondicionado en comedor">
        </div>
        <div class="form-group">
          <label>Comentario</label>
          <textarea id="field-comment" rows="2" placeholder="Comentario sobre la visita">${b.comment}</textarea>
        </div>

        <hr class="form-divider">

        <div id="sections-container">
          ${b.sections.map(s => this._renderSection(s)).join('')}
        </div>

        <div class="form-actions" style="margin-top:0.75rem">
          <button class="btn-secondary-sm" data-action="add-section">+ Agregar sección</button>
          <button class="btn-secondary-sm" data-action="save-as-template">Guardar como plantilla</button>
        </div>

        <div class="form-actions" style="margin-top:1.5rem">
          <button class="btn-primary" data-action="save-budget">💾 Guardar presupuesto</button>
          <button class="btn-primary" data-action="print-budget">🖨️ Descargar PDF</button>
        </div>
      </div>
    `;
  },

  _renderSection(section) {
    return `
      <div class="section-block" data-section-id="${section.id}">
        <div class="section-header">
          <input type="text" class="section-name-input" value="${section.name}" placeholder="Nombre de la sección">
          <button class="btn-icon-sm btn-icon-danger" data-action="delete-section" data-section-id="${section.id}" title="Eliminar sección">🗑️</button>
        </div>
        <div class="items-container">
          ${section.items.length === 0 ? '<div class="empty-items">Sin ítems</div>' :
            section.items.map(item => `
              <div class="item-row" data-item-id="${item.id}">
                <div class="item-desc">
                  <input type="text" class="item-desc-input" value="${item.description}" placeholder="Descripción">
                </div>
                <div class="item-qty">
                  <input type="number" class="item-qty-input" value="${item.quantity}" min="0.5" step="0.5" title="Cantidad">
                </div>
                <div class="item-price">
                  <input type="number" class="item-price-input" value="${item.unitPrice}" min="0" step="1" title="Precio unitario">
                </div>
                <div class="item-currency">
                  <select class="item-currency-select" title="Moneda">
                    <option value="$U" ${item.currency === '$U' ? 'selected' : ''}>$U</option>
                    <option value="U$S" ${item.currency === 'U$S' ? 'selected' : ''}>U$S</option>
                  </select>
                </div>
                <div class="item-ivatype">
                  <select class="item-ivatype-select" title="IVA">
                    <option value="plus" ${item.ivaType === 'plus' ? 'selected' : ''}>+ IVA</option>
                    <option value="included" ${item.ivaType === 'included' ? 'selected' : ''}>IVA inc.</option>
                  </select>
                </div>
                <div class="item-actions">
                  <button class="btn-icon-sm" data-action="catalog-pick" data-item-id="${item.id}" title="Del catálogo">📦</button>
                  <button class="btn-icon-sm btn-icon-danger" data-action="delete-item" data-item-id="${item.id}" title="Eliminar">🗑️</button>
                </div>
              </div>
            `).join('')}
        </div>
        <button class="btn-secondary-sm" data-action="add-item" data-section-id="${section.id}">+ Agregar ítem</button>
      </div>
    `;
  },

  _renderPreview(b) {
    const config = REFRIFULL.store.getConfig();
    return `
      <div class="preview-actions">
        <span class="preview-badge">Vista Previa A4</span>
      </div>
      <div class="a4-sheet" id="preview-sheet">
        <div class="sheet-content">
          <div class="pdf-header">
            <div class="company-logo">
              <img src="${config.company.logo}" alt="REFRIFULL Logo" class="logo-img">
            </div>
            <div class="company-info">
              <div class="company-name">${config.company.name}</div>
              <div class="company-phone">${config.company.phone}</div>
              <div class="company-email">${config.company.email}</div>
              <div class="company-location">${config.company.location}, ${b.date}</div>
            </div>
          </div>

          <div class="client-section">
            <div class="client-name">${b.client || ''}</div>
          </div>

          <div class="intro-text">
            Tenemos el agrado de saludarles y hacerles llegar la cotización solicitada asociada a <strong>${b.title || ''}</strong>.
          </div>

          ${b.comment ? `
          <div class="comment-section">Tras realizar la visita se constató lo siguiente:</div>
          <div class="comment-box">${b.comment}</div>` : ''}

          ${b.sections.map(s => {
            const items = s.items.filter(i => i.description);
            if (items.length === 0) return '';
            return `
              <div class="pdf-section">
                <h3 class="pdf-section-title">${s.name}</h3>
                <div class="pdf-items-list">
                  ${items.map(item => {
                    const ivaLabel = item.ivaType === 'included' ? 'IVA incluido' : '+ IVA';
                    return `
                      <div class="pdf-item-row">
                        <span class="pdf-item-label">${item.description}${item.quantity > 1 ? ` (×${item.quantity})` : ''}</span>
                        <span class="pdf-item-dots"></span>
                        <span class="pdf-item-amount">${item.currency || '$U'} ${item.unitPrice || 0} ${ivaLabel}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}

          <div class="closing-text">
            Sin otro particular, me despido quedando a la orden. Saluda atte,
          </div>

          <div class="signature-section">
            <img src="${config.company.signature}" alt="Firma" class="signature-img">
          </div>

          <div class="pdf-footer">
            <div class="footer-col footer-left">RUT ${config.company.rut}</div>
            <div class="footer-col footer-center">Cel. ${config.company.phone}</div>
            <div class="footer-col footer-right">E-Mail: ${config.company.email}</div>
          </div>
        </div>
      </div>
    `;
  },

  /* ─── SAVE ─── */
  saveCurrent() {
    if (!this.currentBudget) return;
    this._collectFormData();
    REFRIFULL.store.saveBudget(this.currentBudget);
    REFRIFULL.app.showToast('Presupuesto guardado', 'success');
  },

  _collectFormData() {
    const b = this.currentBudget;
    const get = id => (document.getElementById(id) || {}).value || '';
    b.client = get('field-client');
    b.title = get('field-title');
    b.comment = get('field-comment');

    const sectionBlocks = document.querySelectorAll('#sections-container .section-block');
    b.sections = [];
    sectionBlocks.forEach(block => {
      const sectionId = block.dataset.sectionId;
      const name = block.querySelector('.section-name-input').value || 'Sección';
      const items = [];
      block.querySelectorAll('.item-row').forEach(row => {
        items.push({
          id: row.dataset.itemId,
          description: row.querySelector('.item-desc-input').value,
          quantity: parseFloat(row.querySelector('.item-qty-input').value) || 0,
          unitPrice: parseFloat(row.querySelector('.item-price-input').value) || 0,
          currency: row.querySelector('.item-currency-select').value || '$U',
          ivaType: row.querySelector('.item-ivatype-select').value || 'plus'
        });
      });
      b.sections.push({ id: sectionId, name, items });
    });
  }
};
