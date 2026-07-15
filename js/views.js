window.REFRIFULL = window.REFRIFULL || {};

REFRIFULL.views = {

  /* ─── DASHBOARD ─── */
  renderDashboard() {
    const budgets = REFRIFULL.store.getBudgets();
    const total = budgets.length;
    const enviados = budgets.filter(b => b.status === 'enviado').length;
    const aprobados = budgets.filter(b => b.status === 'aprobado').length;
    const borradores = budgets.filter(b => b.status === 'borrador').length;
    const last5 = budgets.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);
    return `
      <div class="page-header">
        <h1>Dashboard</h1>
        <p class="subtitle">Resumen del sistema de presupuestos</p>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-value">${total}</div><div class="stat-label">Total</div></div>
        <div class="stat-card stat-borrador"><div class="stat-value">${borradores}</div><div class="stat-label">Borradores</div></div>
        <div class="stat-card stat-enviado"><div class="stat-value">${enviados}</div><div class="stat-label">Enviados</div></div>
        <div class="stat-card stat-aprobado"><div class="stat-value">${aprobados}</div><div class="stat-label">Aprobados</div></div>
      </div>
      <div class="dashboard-actions">
        <a href="#/budget/new" class="btn-primary" data-link>+ Nuevo Presupuesto</a>
        <a href="#/catalog" class="btn-secondary" data-link>Gestionar Catálogo</a>
        <a href="#/templates" class="btn-secondary" data-link>Plantillas</a>
      </div>
      ${total > 0 ? `
      <div class="section-title">Últimos presupuestos</div>
      <table class="data-table">
        <thead><tr><th>N°</th><th>Cliente</th><th>Fecha</th><th>Estado</th><th></th></tr></thead>
        <tbody>${last5.map(b => `
          <tr>
            <td>${b.number}</td>
            <td>${b.client || '—'}</td>
            <td>${b.date}</td>
            <td><span class="status-badge status-${b.status}">${b.status}</span></td>
            <td><a href="#/budget/edit/${b.id}" class="btn-link" data-link>Abrir</a></td>
          </tr>
        `).join('')}</tbody>
      </table>` : `
      <div class="empty-state">
        <p>Todavía no hay presupuestos. ¡Creá el primero!</p>
      </div>`}
    `;
  },

  /* ─── CATALOG ─── */
  _catalogFormHTML(item) {
    const categories = REFRIFULL.store.getCategories();
    const isEdit = !!item;
    return `
      <form class="catalog-form" data-form="${isEdit ? 'edit' : 'add'}">
        <h3>${isEdit ? 'Editar' : 'Nuevo'} ítem</h3>
        <input type="hidden" name="id" value="${isEdit ? item.id : ''}">
        <div class="form-group">
          <label>Nombre del servicio / producto</label>
          <input type="text" name="name" value="${isEdit ? item.name : ''}" required placeholder="Ej: Carga de gas R410A">
        </div>
        <div class="form-group">
          <label>Categoría</label>
          <select name="category" required>
            <option value="">Seleccionar...</option>
            ${categories.map(c => `<option value="${c.name}" ${isEdit && item.category === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <input type="text" name="description" value="${isEdit ? item.description || '' : ''}" placeholder="Opcional">
        </div>
        <div class="form-group">
          <label>Precio</label>
          <input type="number" name="defaultPrice" value="${isEdit ? item.defaultPrice : ''}" step="1" min="0" placeholder="0">
        </div>
        <div class="form-group">
          <label>Moneda</label>
          <select name="currency">
            <option value="$U" ${isEdit && item.currency === '$U' ? 'selected' : ''}>$U</option>
            <option value="U$S" ${isEdit && item.currency === 'U$S' ? 'selected' : ''}>U$S</option>
          </select>
        </div>
        <div class="form-group">
          <label>IVA</label>
          <select name="ivaType">
            <option value="plus" ${isEdit && item.ivaType === 'plus' ? 'selected' : ''}>+ IVA</option>
            <option value="included" ${isEdit && item.ivaType === 'included' ? 'selected' : ''}>IVA incluido</option>
          </select>
        </div>
        <div class="form-group">
          <label>Unidad</label>
          <select name="unit">
            <option value="servicio" ${isEdit && item.unit === 'servicio' ? 'selected' : ''}>Servicio</option>
            <option value="unidad" ${isEdit && item.unit === 'unidad' ? 'selected' : ''}>Unidad</option>
            <option value="hora" ${isEdit && item.unit === 'hora' ? 'selected' : ''}>Hora</option>
            <option value="metro" ${isEdit && item.unit === 'metro' ? 'selected' : ''}>Metro</option>
            <option value="kit" ${isEdit && item.unit === 'kit' ? 'selected' : ''}>Kit</option>
            <option value="kg" ${isEdit && item.unit === 'kg' ? 'selected' : ''}>Kg</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary btn-sm">${isEdit ? 'Guardar cambios' : 'Agregar al catálogo'}</button>
          <button type="button" class="btn-secondary btn-sm" data-action="cancel-form">Cancelar</button>
        </div>
      </form>
    `;
  },

  renderCatalog() {
    const items = REFRIFULL.store.getCatalogItems();
    const categories = REFRIFULL.store.getCategories();
    return `
      <div class="page-header">
        <h1>Catálogo</h1>
        <p class="subtitle">Servicios, repuestos y productos predefinidos</p>
      </div>
      <div class="catalog-layout">
        <div class="catalog-sidebar">
          <button class="btn-primary btn-full" data-action="show-add-form">+ Nuevo ítem</button>
          <div class="catalog-form-container"></div>
          <div class="section-title" style="margin-top:1.5rem">Categorías</div>
          <div class="category-list">
            ${categories.map(c => `
              <div class="category-chip" data-cat="${c.name}">${c.name}</div>
            `).join('')}
          </div>
        </div>
        <div class="catalog-main">
          ${items.length === 0 ? `
          <div class="empty-state">
            <p>El catálogo está vacío. Agregá servicios y productos para usarlos después en tus presupuestos.</p>
          </div>` : `
          <div class="search-bar">
            <input type="text" id="catalog-search" placeholder="Buscar en el catálogo..." class="search-input">
          </div>
          <table class="data-table" id="catalog-table">
            <thead><tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>IVA</th><th>Unidad</th><th></th></tr></thead>
            <tbody>${items.map(item => `
              <tr data-id="${item.id}">
                <td><strong>${item.name}</strong>${item.description ? '<br><span class="text-muted">' + item.description + '</span>' : ''}</td>
                <td><span class="category-chip sm">${item.category || '—'}</span></td>
                <td>${item.currency || '$U'} ${item.defaultPrice || 0}</td>
                <td>${item.ivaType === 'included' ? 'IVA incluido' : '+ IVA'}</td>
                <td>${item.unit || 'servicio'}</td>
                <td class="actions-cell">
                  <button class="btn-icon-sm" data-action="edit-item" data-id="${item.id}" title="Editar">✏️</button>
                  <button class="btn-icon-sm btn-icon-danger" data-action="delete-item" data-id="${item.id}" title="Eliminar">🗑️</button>
                </td>
              </tr>
            `).join('')}</tbody>
          </table>`}
        </div>
      </div>
    `;
  },

  /* ─── HISTORY ─── */
  renderHistory() {
    let budgets = REFRIFULL.store.getBudgets();
    const statusFilter = REFRIFULL.router?.params?.status || '';
    if (statusFilter) budgets = budgets.filter(b => b.status === statusFilter);
    budgets.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return `
      <div class="page-header">
        <h1>Historial</h1>
        <p class="subtitle">Todos los presupuestos generados</p>
      </div>
      <div class="filter-bar">
        <a href="#/budgets" class="filter-chip ${!statusFilter ? 'active' : ''}" data-link>Todos</a>
        ${REFRIFULL.config.statuses.map(s => `
          <a href="#/budgets?status=${s.value}" class="filter-chip ${statusFilter === s.value ? 'active' : ''}" data-link>${s.label}</a>
        `).join('')}
      </div>
      ${budgets.length === 0 ? `
      <div class="empty-state">
        <p>${statusFilter ? 'No hay presupuestos con ese estado.' : 'No hay presupuestos todavía.'}</p>
      </div>` : `
      <table class="data-table">
        <thead><tr><th>N°</th><th>Cliente</th><th>Título</th><th>Fecha</th><th>Estado</th><th></th></tr></thead>
        <tbody>${budgets.map(b => `
          <tr>
            <td>${b.number}</td>
            <td>${b.client || '—'}</td>
            <td>${b.title || '—'}</td>
            <td>${b.date}</td>
            <td><span class="status-badge status-${b.status}">${b.status}</span></td>
            <td class="actions-cell">
              <a href="#/budget/edit/${b.id}" class="btn-link" data-link>Abrir</a>
              <button class="btn-icon-sm" data-action="duplicate-budget" data-id="${b.id}" title="Duplicar">📋</button>
              <button class="btn-icon-sm btn-icon-danger" data-action="delete-budget" data-id="${b.id}" title="Eliminar">🗑️</button>
            </td>
          </tr>
        `).join('')}</tbody>
      </table>`}
    `;
  },

  /* ─── TEMPLATES ─── */
  renderTemplates() {
    const templates = REFRIFULL.store.getTemplates();
    return `
      <div class="page-header">
        <h1>Plantillas</h1>
        <p class="subtitle">Estructuras reutilizables para crear presupuestos rápidamente</p>
      </div>
      <div class="template-list">
        ${templates.length === 0 ? `
        <div class="empty-state">
          <p>No hay plantillas guardadas. Creá un presupuesto y guardalo como plantilla desde el editor.</p>
        </div>` : templates.map(t => `
          <div class="template-card" data-id="${t.id}">
            <div class="template-card-header">
              <h3>${t.name}</h3>
              <div class="template-actions">
                <button class="btn-icon-sm" data-action="use-template" data-id="${t.id}" title="Usar plantilla">🚀</button>
                <button class="btn-icon-sm btn-icon-danger" data-action="delete-template" data-id="${t.id}" title="Eliminar">🗑️</button>
              </div>
            </div>
            <p class="text-muted">${t.description || 'Sin descripción'}</p>
            <div class="template-meta">
              <span>${t.sections ? t.sections.length : 0} secciones</span>
              <span>${t.sections ? t.sections.reduce((a, s) => a + (s.items ? s.items.length : 0), 0) : 0} ítems</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  /* ─── SETTINGS ─── */
  renderSettings() {
    const config = REFRIFULL.store.getConfig();
    return `
      <div class="page-header">
        <h1>Configuración</h1>
        <p class="subtitle">Datos de la empresa y valores por defecto</p>
      </div>
      <form id="settings-form" class="settings-form">
        <div class="panel-card">
          <h3 class="panel-title">Empresa</h3>
          <div class="form-row">
            <div class="form-group flex-2">
              <label>Nombre / Razón social</label>
              <input type="text" name="company.name" value="${config.company.name}">
            </div>
            <div class="form-group flex-1">
              <label>RUT</label>
              <input type="text" name="company.rut" value="${config.company.rut}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group flex-1">
              <label>Teléfono</label>
              <input type="text" name="company.phone" value="${config.company.phone}">
            </div>
            <div class="form-group flex-2">
              <label>Email</label>
              <input type="email" name="company.email" value="${config.company.email}">
            </div>
            <div class="form-group flex-1">
              <label>Ubicación</label>
              <input type="text" name="company.location" value="${config.company.location}">
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Guardar configuración</button>
          <button type="button" class="btn-secondary" data-action="export-data">Exportar datos (JSON)</button>
          <button type="button" class="btn-secondary" data-action="import-data">Importar datos (JSON)</button>
        </div>
      </form>
    `;
  }
};
