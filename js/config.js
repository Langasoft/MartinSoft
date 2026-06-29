const REFRIFULL = window.REFRIFULL || {};

REFRIFULL.config = {
  company: {
    name: 'Martin Stelmaschuc',
    rut: '219092490011',
    phone: '099 331 903',
    email: 'refrifull@hotmail.com',
    location: 'Montevideo',
    logo: 'assets/img/image.png',
    signature: 'assets/img/firma.png'
  },
  defaults: {
    currency: '$U',
    iva: 22,
    validDays: 10,
    paymentTerms: 'Contado'
  },
  currencies: [
    { value: '$U', label: '$U (Pesos Uruguayos)' },
    { value: 'U$S', label: 'U$S (Dólares)' }
  ],
  ivaOptions: [0, 10, 22],
  statuses: [
    { value: 'borrador', label: 'Borrador', color: '#6b7280' },
    { value: 'enviado', label: 'Enviado', color: '#3b82f6' },
    { value: 'aprobado', label: 'Aprobado', color: '#10b981' },
    { value: 'rechazado', label: 'Rechazado', color: '#ef4444' }
  ],
  defaultCategories: [
    'Mano de obra',
    'Repuestos',
    'Materiales',
    'Equipo',
    'Servicio técnico',
    'Instalación',
    'Mantenimiento',
    'Otros'
  ]
};
