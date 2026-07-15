window.REFRIFULL = window.REFRIFULL || {};

REFRIFULL.store = {
  _prefix: 'rf_',

  _get(key, defaultVal) {
    try {
      const data = localStorage.getItem(this._prefix + key);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  },

  _set(key, val) {
    localStorage.setItem(this._prefix + key, JSON.stringify(val));
  },

  getConfig() {
    const config = this._get('config', null);
    if (!config) {
      this._set('config', REFRIFULL.config);
      return REFRIFULL.config;
    }
    return { ...REFRIFULL.config, ...config, company: { ...REFRIFULL.config.company, ...config.company } };
  },

  saveConfig(config) {
    this._set('config', config);
  },

  getCatalogItems() {
    return this._get('catalog', []);
  },

  saveCatalogItem(item) {
    const items = this.getCatalogItems();
    const idx = items.findIndex(i => i.id === item.id);
    if (idx >= 0) items[idx] = item;
    else items.push(item);
    this._set('catalog', items);
  },

  deleteCatalogItem(id) {
    this._set('catalog', this.getCatalogItems().filter(i => i.id !== id));
  },

  getCategories() {
    let cats = this._get('categories', null);
    if (!cats) {
      cats = REFRIFULL.config.defaultCategories.map((name, i) => ({
        id: 'cat-' + i,
        name
      }));
      this._set('categories', cats);
    } else {
      const existingNames = cats.map(c => c.name);
      let changed = false;
      REFRIFULL.config.defaultCategories.forEach(name => {
        if (!existingNames.includes(name)) {
          cats.push({ id: this.generateId(), name });
          changed = true;
        }
      });
      if (changed) this._set('categories', cats);
    }
    return cats;
  },

  saveCategory(cat) {
    const cats = this.getCategories();
    const idx = cats.findIndex(c => c.id === cat.id);
    if (idx >= 0) cats[idx] = cat;
    else cats.push(cat);
    this._set('categories', cats);
  },

  deleteCategory(id) {
    this._set('categories', this.getCategories().filter(c => c.id !== id));
  },

  getBudgets() {
    return this._get('budgets', []);
  },

  getBudget(id) {
    return this.getBudgets().find(b => b.id === id) || null;
  },

  saveBudget(budget) {
    const budgets = this.getBudgets();
    const idx = budgets.findIndex(b => b.id === budget.id);
    budget.updatedAt = new Date().toISOString();
    if (idx >= 0) budgets[idx] = budget;
    else budgets.push(budget);
    this._set('budgets', budgets);
  },

  deleteBudget(id) {
    this._set('budgets', this.getBudgets().filter(b => b.id !== id));
  },

  _counter: null,

  getNextBudgetNumber() {
    if (this._counter === null) {
      this._counter = this._get('counter', 0);
    }
    this._counter++;
    this._set('counter', this._counter);
    const year = new Date().getFullYear();
    return 'RF-' + year + '-' + String(this._counter).padStart(4, '0');
  },

  getTemplates() {
    return this._get('templates', []);
  },

  getTemplate(id) {
    return this.getTemplates().find(t => t.id === id) || null;
  },

  saveTemplate(tpl) {
    const templates = this.getTemplates();
    const idx = templates.findIndex(t => t.id === tpl.id);
    if (idx >= 0) templates[idx] = tpl;
    else templates.push(tpl);
    this._set('templates', templates);
  },

  deleteTemplate(id) {
    this._set('templates', this.getTemplates().filter(t => t.id !== id));
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  },

  exportAll() {
    return {
      config: this._get('config', null),
      catalog: this.getCatalogItems(),
      categories: this.getCategories(),
      budgets: this.getBudgets(),
      templates: this.getTemplates(),
      counter: this._counter || this._get('counter', 0),
      exportedAt: new Date().toISOString()
    };
  },

  importAll(data) {
    if (data.config) this._set('config', data.config);
    if (data.catalog) this._set('catalog', data.catalog);
    if (data.categories) this._set('categories', data.categories);
    if (data.budgets) this._set('budgets', data.budgets);
    if (data.templates) this._set('templates', data.templates);
    if (data.counter) this._set('counter', data.counter);
  }
};
