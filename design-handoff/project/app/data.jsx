// Fake data model matching the ShipIt schema:
// LogicalService, Repository, Deployment, RuntimeService, Team, Person, Pipeline, Monitor

const SERVICES = [
  { id: 'payments-api', name: 'payments-api', type: 'LogicalService', tier: 1, owner: 'payments-team', oncall: 'Maya S.', lang: 'Go', runtime: 'k8s', sla: '99.95', deps: 14, dependents: 23, env: ['production','staging'], p99: 82, change: '2h ago', desc: 'Processes all customer-facing payment flows.' },
  { id: 'checkout-service', name: 'checkout-service', type: 'LogicalService', tier: 1, owner: 'payments-team', oncall: 'Maya S.', lang: 'TypeScript', runtime: 'k8s', sla: '99.9', deps: 8, dependents: 11, env: ['production','staging'], p99: 120, change: '12m ago', desc: 'Checkout funnel orchestration.' },
  { id: 'auth-svc', name: 'auth-svc', type: 'LogicalService', tier: 1, owner: 'identity-team', oncall: 'Jordan K.', lang: 'Go', runtime: 'k8s', sla: '99.99', deps: 4, dependents: 34, env: ['production','staging','dev'], p99: 42, change: '1d ago', desc: 'Authentication + session issuance.' },
  { id: 'user-service', name: 'user-service', type: 'LogicalService', tier: 2, owner: 'identity-team', oncall: 'Jordan K.', lang: 'Go', runtime: 'k8s', sla: '99.9', deps: 3, dependents: 14, env: ['production','staging'], p99: 65, change: '3d ago', desc: 'User profiles + preferences.' },
  { id: 'billing-worker', name: 'billing-worker', type: 'LogicalService', tier: 1, owner: 'payments-team', oncall: 'Maya S.', lang: 'Go', runtime: 'k8s', sla: '99.9', deps: 6, dependents: 3, env: ['production'], p99: 210, change: '5d ago', desc: 'Async billing reconciliation.' },
  { id: 'notif-queue', name: 'notif-queue', type: 'LogicalService', tier: 2, owner: 'comms-team', oncall: 'Priya R.', lang: 'Python', runtime: 'k8s', sla: '99.5', deps: 2, dependents: 18, env: ['production','staging'], p99: 95, change: '4h ago', desc: 'Durable queue for email + push.' },
  { id: 'search-svc', name: 'search-svc', type: 'LogicalService', tier: 2, owner: 'platform-team', oncall: 'Eli T.', lang: 'Rust', runtime: 'k8s', sla: '99.5', deps: 4, dependents: 9, env: ['production','staging'], p99: 38, change: '5h ago', desc: 'Full-text + vector search.' },
  { id: 'frontend-app', name: 'frontend-app', type: 'LogicalService', tier: 1, owner: 'frontend-team', oncall: 'Sam L.', lang: 'TypeScript', runtime: 'vercel', sla: '99.9', deps: 12, dependents: 0, env: ['production','staging'], p99: 180, change: '3h ago', desc: 'Customer-facing web app.' },
  { id: 'orders-svc', name: 'orders-svc', type: 'LogicalService', tier: 1, owner: 'payments-team', oncall: 'Maya S.', lang: 'Go', runtime: 'k8s', sla: '99.9', deps: 5, dependents: 9, env: ['production','staging'], p99: 105, change: '6h ago', desc: 'Order lifecycle + history.' },
  { id: 'shared-lib', name: 'shared-lib', type: 'Repository', tier: 3, owner: 'platform-team', oncall: '—', lang: 'Go', runtime: '—', sla: '—', deps: 0, dependents: 41, env: [], p99: 0, change: '2d ago', desc: 'Internal shared utilities.' },
  { id: 'auth-lib', name: 'auth-lib', type: 'Repository', tier: 3, owner: 'identity-team', oncall: '—', lang: 'Go', runtime: '—', sla: '—', deps: 0, dependents: 4, env: [], p99: 0, change: 'DEPRECATED', desc: 'Legacy auth SDK. Replaced by auth-svc SDK v2.' },
];

const EDGES = [
  ['checkout-service','payments-api','DEPENDS_ON'],
  ['checkout-service','auth-svc','DEPENDS_ON'],
  ['checkout-service','notif-queue','DEPENDS_ON'],
  ['payments-api','auth-svc','DEPENDS_ON'],
  ['payments-api','billing-worker','TRIGGERS'],
  ['payments-api','notif-queue','PUBLISHES_TO'],
  ['payments-api','shared-lib','IMPORTS'],
  ['auth-svc','user-service','DEPENDS_ON'],
  ['user-service','shared-lib','IMPORTS'],
  ['billing-worker','auth-lib','IMPORTS'],
  ['billing-worker','payments-api','CALLS'],
  ['billing-worker','shared-lib','IMPORTS'],
  ['frontend-app','checkout-service','CALLS'],
  ['frontend-app','auth-svc','CALLS'],
  ['frontend-app','search-svc','CALLS'],
  ['frontend-app','user-service','CALLS'],
  ['orders-svc','payments-api','CALLS'],
  ['orders-svc','notif-queue','PUBLISHES_TO'],
  ['search-svc','shared-lib','IMPORTS'],
];

const CONNECTORS = [
  { id: 'github', name: 'GitHub', icon: '⌨', items: '1,204 repos', status: 'healthy', pct: 100, lastSync: '2m ago', rate: '12/min' },
  { id: 'k8s', name: 'Kubernetes (prod)', icon: '⎔', items: '89 workloads', status: 'healthy', pct: 100, lastSync: '30s ago', rate: '4/min' },
  { id: 'k8s-stg', name: 'Kubernetes (staging)', icon: '⎔', items: '71 workloads', status: 'healthy', pct: 100, lastSync: '1m ago', rate: '4/min' },
  { id: 'datadog', name: 'Datadog', icon: '◉', items: '340 monitors', status: 'degraded', pct: 92, lastSync: '14m ago', rate: '8/min', note: 'Rate-limited 3x in last hour' },
  { id: 'backstage', name: 'Backstage', icon: '▨', items: '247 entities', status: 'healthy', pct: 100, lastSync: '5m ago', rate: '2/min' },
  { id: 'pagerduty', name: 'PagerDuty', icon: '◔', items: '18 services', status: 'error', pct: 0, lastSync: '2h ago', rate: '—', note: 'Auth token expired' },
  { id: 'gcal', name: 'Google Calendar', icon: '☰', items: '6 rotations', status: 'healthy', pct: 100, lastSync: '8m ago', rate: '1/min' },
];

const AVAILABLE_CONNECTORS = [
  { id: 'jira', name: 'Jira', desc: 'Import incidents + tickets' },
  { id: 'slack', name: 'Slack', desc: 'Owner + on-call channels' },
  { id: 'grafana', name: 'Grafana', desc: 'Dashboards + alert rules' },
  { id: 'sentry', name: 'Sentry', desc: 'Error tracking + release tags' },
];

const INCIDENTS = [
  { id: 'inc-482', sev: 'SEV-2', title: 'Elevated p99 on checkout flow', started: '8m', owner: 'payments-team', status: 'investigating', services: ['checkout-service','payments-api'] },
  { id: 'inc-481', sev: 'SEV-3', title: 'Datadog connector rate-limited', started: '14m', owner: 'platform-team', status: 'mitigated', services: ['datadog'] },
];

const ACTIVITY = [
  { t: '21:38', k: 'DEPLOY', s: 'checkout-service', m: 'v2.14.0 → production', c: 'ok' },
  { t: '21:31', k: 'DEPLOY', s: 'search-svc', m: 'v1.8.3 → production', c: 'ok' },
  { t: '21:24', k: 'CLAIM',  s: 'payments-api', m: 'owner: payments-team (github > backstage)', c: 'accent' },
  { t: '20:51', k: 'SYNC',   s: 'datadog', m: '340 monitors, 4 new', c: 'muted' },
  { t: '20:17', k: 'WARN',   s: 'auth-lib', m: 'deprecated, 4 dependents flagged', c: 'warn' },
  { t: '19:42', k: 'SCAN',   s: 'k8s-prod', m: '89 workloads mapped', c: 'muted' },
  { t: '19:12', k: 'NEW',    s: 'user-service', m: 'deployment eu-west-1 registered', c: 'ok' },
  { t: '18:55', k: 'SYNC',   s: 'github', m: '1,204 repos indexed', c: 'muted' },
];

const SAMPLE_QUESTIONS = [
  "What's the blast radius if payments-api goes down?",
  "Who owns checkout-service and who's on call right now?",
  "What changed in production in the last 24 hours?",
  "Services that still depend on auth-lib",
  "Show everything that imports shared-lib",
  "Which tier-1 services have stale docs?",
];

Object.assign(window, { SERVICES, EDGES, CONNECTORS, AVAILABLE_CONNECTORS, INCIDENTS, ACTIVITY, SAMPLE_QUESTIONS });
