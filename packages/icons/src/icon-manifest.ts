/**
 * Source of truth for every icon name in `@ship-it-ui/icons`. Each entry maps
 * a semantic name to an Iconify `[collection, icon]` tuple — the codegen in
 * `scripts/build-icon-data.ts` materialises every entry into the committed
 * `src/icon-data.ts`. `GlyphName` and `ConnectorName` are derived from these
 * maps so adding an entry here automatically expands the typed `IconGlyph`
 * `name` prop and `kind="connector"` lookups.
 *
 * Collections in use:
 *   - `lucide`        — stroke-based UI primitives (default)
 *   - `ph`            — Phosphor: softer variants when Lucide's hairlines feel wrong
 *   - `simple-icons`  — brand logos for connectors and infra-specific glyphs
 */

/** [collection, icon-name] tuple for an Iconify icon. */
export type IconRef = readonly [collection: string, icon: string];

export const glyphManifest = {
  // Brand & entity nodes
  brand: ['lucide', 'rocket'],
  service: ['lucide', 'server'],
  serviceOutline: ['lucide', 'server'],
  person: ['lucide', 'user'],
  document: ['lucide', 'file-text'],
  file: ['lucide', 'file'],
  ticket: ['lucide', 'ticket'],
  deployment: ['lucide', 'rocket'],

  // AI & status
  ask: ['lucide', 'sparkles'],
  sparkle: ['lucide', 'sparkles'],
  incident: ['lucide', 'circle-alert'],
  target: ['lucide', 'target'],
  live: ['lucide', 'circle-dot'],
  half: ['lucide', 'contrast'],
  dot: ['lucide', 'dot'],
  blockCursor: ['ph', 'cursor-text-bold'],

  // Connectors / sources (semantic glyphs, not brand logos)
  bolt: ['lucide', 'zap'],
  graph: ['lucide', 'git-fork'],
  // `schema` represents data structure (tables, columns), so a table grid is
  // a better semantic fit than the hamburger menu glyph.
  schema: ['lucide', 'table'],
  menu: ['lucide', 'menu'],

  // Navigation & layout
  home: ['lucide', 'house'],
  fitView: ['lucide', 'maximize'],
  cornerSquare: ['lucide', 'square'],
  expand: ['lucide', 'chevron-right'],
  collapse: ['lucide', 'chevron-down'],

  // Arrows
  next: ['lucide', 'arrow-right'],
  prev: ['lucide', 'arrow-left'],
  up: ['lucide', 'arrow-up'],
  down: ['lucide', 'arrow-down'],
  upRight: ['lucide', 'arrow-up-right'],
  downRight: ['lucide', 'arrow-down-right'],
  external: ['lucide', 'external-link'],
  enter: ['lucide', 'corner-down-left'],
  sort: ['lucide', 'arrow-up-down'],
  caretLeft: ['lucide', 'chevron-left'],
  caretRight: ['lucide', 'chevron-right'],
  caretUp: ['lucide', 'chevron-up'],
  caretDown: ['lucide', 'chevron-down'],

  // Status & actions
  confirm: ['lucide', 'check'],
  check: ['lucide', 'check'],
  close: ['lucide', 'x'],
  dismiss: ['lucide', 'x'],
  add: ['lucide', 'plus'],
  remove: ['lucide', 'minus'],
  warn: ['lucide', 'triangle-alert'],
  warnAlt: ['lucide', 'circle-alert'],
  help: ['lucide', 'circle-help'],
  info: ['lucide', 'info'],
  more: ['lucide', 'ellipsis'],
  moreVertical: ['lucide', 'ellipsis-vertical'],
  edit: ['lucide', 'pencil'],
  copy: ['lucide', 'copy'],
  refresh: ['lucide', 'refresh-cw'],

  // Interaction
  search: ['lucide', 'search'],
  cmd: ['lucide', 'command'],
  shift: ['ph', 'arrow-fat-up'],
  option: ['ph', 'option'],
  escape: ['ph', 'arrow-elbow-up-left'],
  settings: ['lucide', 'settings'],
  power: ['lucide', 'power'],

  // Punctuation & misc
  middleDot: ['lucide', 'dot'],
  mention: ['lucide', 'at-sign'],
  tag: ['lucide', 'hash'],
  approx: ['ph', 'approximate-equals'],
  infinite: ['lucide', 'infinity'],
  // `§` (section sign) has no direct Iconify equivalent — `list` is the closest
  // semantic stand-in (a section as a grouped sequence). Swap if design prefers.
  section: ['lucide', 'list'],

  // Infra-specific (brand glyphs that also appear in semantic contexts)
  kubernetes: ['simple-icons', 'kubernetes'],
  datadog: ['simple-icons', 'datadog'],
  backstage: ['simple-icons', 'backstage'],
  pagerduty: ['simple-icons', 'pagerduty'],
  github: ['simple-icons', 'github'],

  // Time & scheduling
  alarmClock: ['lucide', 'alarm-clock'],
  alarmClockOff: ['lucide', 'alarm-clock-off'],
  clock: ['lucide', 'clock'],
  calendar: ['lucide', 'calendar'],

  // Charts & data
  chartBar: ['lucide', 'chart-bar'],
  database: ['lucide', 'database'],
  databaseBackup: ['lucide', 'database-backup'],
  databaseZap: ['lucide', 'database-zap'],

  // Status circles
  circle: ['lucide', 'circle'],
  circleCheck: ['lucide', 'circle-check'],
  circleX: ['lucide', 'circle-x'],
  circlePlus: ['lucide', 'circle-plus'],
  circleMinus: ['lucide', 'circle-minus'],

  // Double-caret chevrons (skip to end / page jump)
  chevronsLeft: ['lucide', 'chevrons-left'],
  chevronsRight: ['lucide', 'chevrons-right'],
  chevronsUp: ['lucide', 'chevrons-up'],
  chevronsDown: ['lucide', 'chevrons-down'],

  // Folding / sizing
  foldHorizontal: ['lucide', 'fold-horizontal'],
  foldVertical: ['lucide', 'fold-vertical'],
  maximize: ['lucide', 'maximize'],
  shrink: ['lucide', 'shrink'],

  // Lists & layers
  list: ['lucide', 'list'],
  listChecks: ['lucide', 'list-checks'],
  listOrdered: ['lucide', 'list-ordered'],
  listTodo: ['lucide', 'list-todo'],
  listTree: ['lucide', 'list-tree'],
  listFilter: ['lucide', 'list-filter'],
  listPlus: ['lucide', 'list-plus'],
  layer: ['lucide', 'layers'],

  // Devices & context
  monitor: ['lucide', 'monitor'],
  laptop: ['lucide', 'laptop'],
  compass: ['lucide', 'compass'],

  // Alerts & flags
  bell: ['lucide', 'bell'],
  flag: ['lucide', 'flag'],
  flagOff: ['lucide', 'flag-off'],
  flame: ['lucide', 'flame'],
  bug: ['lucide', 'bug'],
  ghost: ['lucide', 'ghost'],

  // AI
  brainCircuit: ['lucide', 'brain-circuit'],

  // Documents & receipts
  receipt: ['lucide', 'receipt'],
  replace: ['lucide', 'replace'],
  share: ['lucide', 'share'],

  // — Suggested additions (curated UI essentials; prune what you don't want) —

  // File & content
  archive: ['lucide', 'archive'],
  folder: ['lucide', 'folder'],
  folderOpen: ['lucide', 'folder-open'],
  trash: ['lucide', 'trash-2'],

  // Movement
  download: ['lucide', 'download'],
  upload: ['lucide', 'upload'],

  // Visibility & search
  eye: ['lucide', 'eye'],
  eyeOff: ['lucide', 'eye-off'],
  filter: ['lucide', 'filter'],

  // Theme toggle pair
  moon: ['lucide', 'moon'],
  sun: ['lucide', 'sun'],

  // Auth & security
  lock: ['lucide', 'lock'],
  unlock: ['lucide', 'lock-open'],
  key: ['lucide', 'key'],
  shield: ['lucide', 'shield'],
  shieldCheck: ['lucide', 'shield-check'],
  shieldAlert: ['lucide', 'shield-alert'],
  logIn: ['lucide', 'log-in'],
  logOut: ['lucide', 'log-out'],
  fingerprint: ['lucide', 'fingerprint'],

  // Communication
  mail: ['lucide', 'mail'],
  mailOpen: ['lucide', 'mail-open'],
  send: ['lucide', 'send'],
  inbox: ['lucide', 'inbox'],
  messageCircle: ['lucide', 'message-circle'],
  messageSquare: ['lucide', 'message-square'],
  phone: ['lucide', 'phone'],
  video: ['lucide', 'video'],
  mic: ['lucide', 'mic'],
  micOff: ['lucide', 'mic-off'],

  // Engagement & social
  bookmark: ['lucide', 'bookmark'],
  bookmarkCheck: ['lucide', 'bookmark-check'],
  bookmarkPlus: ['lucide', 'bookmark-plus'],
  star: ['lucide', 'star'],
  heart: ['lucide', 'heart'],
  thumbsUp: ['lucide', 'thumbs-up'],
  thumbsDown: ['lucide', 'thumbs-down'],
  award: ['lucide', 'award'],

  // Media & playback
  play: ['lucide', 'play'],
  pause: ['lucide', 'pause'],
  stopCircle: ['lucide', 'circle-stop'],
  skipBack: ['lucide', 'skip-back'],
  skipForward: ['lucide', 'skip-forward'],
  volume: ['lucide', 'volume-2'],
  volumeX: ['lucide', 'volume-x'],
  music: ['lucide', 'music'],

  // Files & content (extensions)
  filePlus: ['lucide', 'file-plus'],
  fileCheck: ['lucide', 'file-check'],
  fileX: ['lucide', 'file-x'],
  folderPlus: ['lucide', 'folder-plus'],
  paperclip: ['lucide', 'paperclip'],
  pin: ['lucide', 'pin'],
  pinOff: ['lucide', 'pin-off'],
  save: ['lucide', 'save'],
  clipboard: ['lucide', 'clipboard'],
  clipboardCheck: ['lucide', 'clipboard-check'],
  clipboardList: ['lucide', 'clipboard-list'],

  // Editing & formatting
  code: ['lucide', 'code'],
  type: ['lucide', 'type'],
  bold: ['lucide', 'bold'],
  italic: ['lucide', 'italic'],
  underline: ['lucide', 'underline'],
  alignLeft: ['lucide', 'align-left'],
  alignCenter: ['lucide', 'align-center'],
  alignRight: ['lucide', 'align-right'],
  quote: ['lucide', 'quote'],
  highlighter: ['lucide', 'highlighter'],

  // Layout
  grid: ['lucide', 'grid-3x3'],
  panelLeft: ['lucide', 'panel-left'],
  panelRight: ['lucide', 'panel-right'],
  columns: ['lucide', 'columns-3'],

  // Devices
  smartphone: ['lucide', 'smartphone'],
  tablet: ['lucide', 'tablet'],
  server: ['lucide', 'server'],
  cpu: ['lucide', 'cpu'],
  hardDrive: ['lucide', 'hard-drive'],
  keyboard: ['lucide', 'keyboard'],

  // Network & connectivity
  wifi: ['lucide', 'wifi'],
  wifiOff: ['lucide', 'wifi-off'],
  signal: ['lucide', 'signal'],
  globe: ['lucide', 'globe'],
  link: ['lucide', 'link'],
  unlink: ['lucide', 'unlink'],
  network: ['lucide', 'network'],

  // Cloud & infra
  cloud: ['lucide', 'cloud'],
  cloudUpload: ['lucide', 'cloud-upload'],
  cloudDownload: ['lucide', 'cloud-download'],
  cloudOff: ['lucide', 'cloud-off'],
  package: ['lucide', 'package'],
  box: ['lucide', 'box'],
  boxes: ['lucide', 'boxes'],
  container: ['lucide', 'container'],

  // Charts & analytics (extensions)
  chartLine: ['lucide', 'chart-line'],
  chartPie: ['lucide', 'chart-pie'],
  chartArea: ['lucide', 'chart-area'],
  trendingUp: ['lucide', 'trending-up'],
  trendingDown: ['lucide', 'trending-down'],
  activity: ['lucide', 'activity'],
  gauge: ['lucide', 'gauge'],

  // Commerce
  shoppingCart: ['lucide', 'shopping-cart'],
  creditCard: ['lucide', 'credit-card'],
  dollarSign: ['lucide', 'dollar-sign'],
  wallet: ['lucide', 'wallet'],
  coins: ['lucide', 'coins'],

  // Time (extensions)
  calendarClock: ['lucide', 'calendar-clock'],
  calendarCheck: ['lucide', 'calendar-check'],
  timer: ['lucide', 'timer'],
  hourglass: ['lucide', 'hourglass'],
  history: ['lucide', 'history'],

  // Navigation (extensions)
  map: ['lucide', 'map'],
  mapPin: ['lucide', 'map-pin'],
  route: ['lucide', 'route'],
  navigation: ['lucide', 'navigation'],

  // Git ops
  gitBranch: ['lucide', 'git-branch'],
  gitCommit: ['lucide', 'git-commit-horizontal'],
  gitMerge: ['lucide', 'git-merge'],
  gitPullRequest: ['lucide', 'git-pull-request'],
  gitCompareArrows: ['lucide', 'git-compare-arrows'],

  // Progress
  loader: ['lucide', 'loader'],
  loaderCircle: ['lucide', 'loader-circle'],

  // People (extensions)
  users: ['lucide', 'users'],
  userPlus: ['lucide', 'user-plus'],
  userMinus: ['lucide', 'user-minus'],
  userRound: ['lucide', 'user-round'],
  userCheck: ['lucide', 'user-check'],

  // Misc utility
  megaphone: ['lucide', 'megaphone'],
  gift: ['lucide', 'gift'],
  bot: ['lucide', 'bot'],
  workflow: ['lucide', 'workflow'],
  crown: ['lucide', 'crown'],
  waypoints: ['lucide', 'waypoints'],
  handshake: ['lucide', 'handshake'],

  // — Travel & transport: vehicles —
  car: ['lucide', 'car'],
  carFront: ['lucide', 'car-front'],
  carTaxi: ['lucide', 'car-taxi-front'],
  suv: ['ph', 'jeep'],
  truck: ['lucide', 'truck'],
  pickup: ['ph', 'truck'],
  van: ['ph', 'van'],
  bus: ['lucide', 'bus'],
  caravan: ['lucide', 'caravan'],
  motorcycle: ['ph', 'motorcycle'],
  scooter: ['ph', 'scooter'],
  bike: ['lucide', 'bike'],
  ev: ['lucide', 'car-front'],
  plane: ['lucide', 'plane'],
  planeTakeoff: ['lucide', 'plane-takeoff'],
  planeLanding: ['lucide', 'plane-landing'],
  train: ['lucide', 'train-front'],
  tram: ['lucide', 'tram-front'],
  ship: ['lucide', 'ship'],
  sailboat: ['lucide', 'sailboat'],
  ambulance: ['lucide', 'ambulance'],
  helicopter: ['lucide', 'helicopter'],

  // — Travel & transport: vehicle parts & telematics —
  steeringWheel: ['ph', 'steering-wheel'],
  carKey: ['lucide', 'key-round'],
  gearShift: ['ph', 'gear-six'],
  engine: ['ph', 'engine'],
  fuel: ['lucide', 'fuel'],
  gasPump: ['ph', 'gas-pump'],
  evCharger: ['lucide', 'plug-zap'],
  battery: ['lucide', 'battery'],
  batteryCharging: ['lucide', 'battery-charging'],
  batteryFull: ['lucide', 'battery-full'],
  batteryLow: ['lucide', 'battery-low'],
  seat: ['lucide', 'armchair'],
  seatbelt: ['ph', 'seatbelt'],
  camera: ['lucide', 'camera'],
  snowflake: ['lucide', 'snowflake'],
  trafficCone: ['lucide', 'traffic-cone'],

  // — Travel & transport: locations (pickup/dropoff) —
  airport: ['lucide', 'plane'],
  hotel: ['lucide', 'hotel'],
  building: ['lucide', 'building'],
  building2: ['lucide', 'building-2'],
  trainStation: ['lucide', 'train-track'],
  busStation: ['lucide', 'bus-front'],
  ferryTerminal: ['lucide', 'anchor'],
  parking: ['lucide', 'parking-square'],
  parkingGarage: ['lucide', 'circle-parking'],
  gasStation: ['ph', 'gas-pump'],
  chargingStation: ['lucide', 'plug-zap'],
  valet: ['lucide', 'key-round'],
  store: ['lucide', 'store'],
  landmark: ['lucide', 'landmark'],
  castle: ['ph', 'castle-turret'],
  tent: ['lucide', 'tent'],
  mountain: ['lucide', 'mountain'],
  palmTree: ['lucide', 'palmtree'],
  city: ['lucide', 'building-2'],

  // — Travel & transport: trip essentials & artifacts —
  luggage: ['lucide', 'luggage'],
  briefcase: ['lucide', 'briefcase'],
  backpack: ['ph', 'backpack'],
  passport: ['ph', 'identification-card'],
  boardingPass: ['ph', 'airplane-tilt'],
  idCard: ['lucide', 'id-card'],
  driversLicense: ['lucide', 'contact'],
  signature: ['lucide', 'signature'],
  contract: ['lucide', 'file-signature'],
  agreement: ['lucide', 'file-check'],

  // — Travel & transport: booking lifecycle —
  carPickup: ['lucide', 'car-front'],
  carReturn: ['lucide', 'undo-2'],
  checkin: ['lucide', 'log-in'],
  checkout: ['lucide', 'log-out'],
  inspection: ['lucide', 'search-check'],
  contactless: ['lucide', 'smartphone-nfc'],
  selfService: ['ph', 'user-gear'],

  // — Travel & transport: safety, insurance, emergency —
  umbrella: ['lucide', 'umbrella'],
  firstAid: ['ph', 'first-aid-kit'],
  sos: ['lucide', 'siren'],
  roadsideAssistance: ['lucide', 'wrench'],
  collision: ['ph', 'warning-octagon'],
  damage: ['ph', 'warning'],
  verified: ['lucide', 'badge-check'],
  notVerified: ['lucide', 'badge-x'],
  shieldHalf: ['lucide', 'shield-half'],

  // — Travel & transport: vehicle features (filter chips) —
  bluetooth: ['lucide', 'bluetooth'],
  bluetoothConnected: ['lucide', 'bluetooth-connected'],
  usb: ['lucide', 'usb'],
  childSeat: ['ph', 'baby-carriage'],
  baby: ['lucide', 'baby'],
  petFriendly: ['lucide', 'paw-print'],
  smokeFree: ['lucide', 'cigarette-off'],
  smoking: ['lucide', 'cigarette'],

  // — Travel & transport: weather (trip planning) —
  sunny: ['lucide', 'sun'],
  cloudy: ['lucide', 'cloud'],
  rainy: ['lucide', 'cloud-rain'],
  snowy: ['lucide', 'cloud-snow'],
  foggy: ['lucide', 'cloud-fog'],
  windy: ['lucide', 'wind'],
  thermometer: ['lucide', 'thermometer'],
  droplets: ['lucide', 'droplets'],
  sunrise: ['lucide', 'sunrise'],
  sunset: ['lucide', 'sunset'],

  // — Travel & transport: people (driver/passenger roles) —
  driver: ['ph', 'steering-wheel'],
  passenger: ['lucide', 'user-round'],
  coDriver: ['lucide', 'user-plus'],
  chauffeur: ['ph', 'user-gear'],

  // — Travel & transport: map & routing —
  pickupPin: ['lucide', 'map-pin'],
  dropoffPin: ['lucide', 'map-pin-check'],
  oneWay: ['lucide', 'arrow-right'],
  roundTrip: ['lucide', 'arrow-left-right'],

  // — Travel & transport: commerce (pricing, coupons, refunds) —
  priceTag: ['lucide', 'tag'],
  percent: ['lucide', 'percent'],
  promo: ['lucide', 'badge-percent'],
  refund: ['lucide', 'undo-2'],
  piggyBank: ['ph', 'piggy-bank'],
} as const satisfies Record<string, IconRef>;

export const connectorManifest = {
  // — Existing first-class connectors —
  github: ['simple-icons', 'github'],
  notion: ['simple-icons', 'notion'],
  slack: ['simple-icons', 'slack'],
  linear: ['simple-icons', 'linear'],
  jira: ['simple-icons', 'jira'],
  pagerduty: ['simple-icons', 'pagerduty'],
  confluence: ['simple-icons', 'confluence'],
  gdrive: ['simple-icons', 'googledrive'],
  s3: ['simple-icons', 'amazons3'],
  postgres: ['simple-icons', 'postgresql'],

  // Source control
  gitlab: ['simple-icons', 'gitlab'],
  bitbucket: ['simple-icons', 'bitbucket'],
  gitea: ['simple-icons', 'gitea'],

  // CI / CD
  jenkins: ['simple-icons', 'jenkins'],
  circleci: ['simple-icons', 'circleci'],
  buildkite: ['simple-icons', 'buildkite'],
  githubActions: ['simple-icons', 'githubactions'],
  argo: ['simple-icons', 'argo'],

  // Project management & issues
  asana: ['simple-icons', 'asana'],
  trello: ['simple-icons', 'trello'],
  clickup: ['simple-icons', 'clickup'],
  shortcut: ['simple-icons', 'shortcut'],
  todoist: ['simple-icons', 'todoist'],

  // Communication
  discord: ['simple-icons', 'discord'],
  microsoftTeams: ['simple-icons', 'microsoftteams'],
  zoom: ['simple-icons', 'zoom'],
  intercom: ['simple-icons', 'intercom'],
  telegram: ['simple-icons', 'telegram'],

  // Documentation & wiki
  googleDocs: ['simple-icons', 'googledocs'],
  coda: ['simple-icons', 'coda'],
  obsidian: ['simple-icons', 'obsidian'],
  gitbook: ['simple-icons', 'gitbook'],

  // File storage
  dropbox: ['simple-icons', 'dropbox'],
  onedrive: ['simple-icons', 'microsoftonedrive'],
  box: ['simple-icons', 'box'],

  // Databases
  mysql: ['simple-icons', 'mysql'],
  mongodb: ['simple-icons', 'mongodb'],
  redis: ['simple-icons', 'redis'],
  snowflake: ['simple-icons', 'snowflake'],
  databricks: ['simple-icons', 'databricks'],
  supabase: ['simple-icons', 'supabase'],
  planetscale: ['simple-icons', 'planetscale'],
  elasticsearch: ['simple-icons', 'elasticsearch'],
  clickhouse: ['simple-icons', 'clickhouse'],
  sqlite: ['simple-icons', 'sqlite'],
  mariadb: ['simple-icons', 'mariadb'],
  influxdb: ['simple-icons', 'influxdb'],

  // Cloud providers
  aws: ['simple-icons', 'amazonwebservices'],
  gcp: ['simple-icons', 'googlecloud'],
  azure: ['simple-icons', 'microsoftazure'],
  cloudflare: ['simple-icons', 'cloudflare'],
  vercel: ['simple-icons', 'vercel'],
  netlify: ['simple-icons', 'netlify'],
  digitalocean: ['simple-icons', 'digitalocean'],
  heroku: ['simple-icons', 'heroku'],
  railway: ['simple-icons', 'railway'],
  render: ['simple-icons', 'render'],
  flyio: ['simple-icons', 'flydotio'],

  // Observability
  newrelic: ['simple-icons', 'newrelic'],
  grafana: ['simple-icons', 'grafana'],
  prometheus: ['simple-icons', 'prometheus'],
  sentry: ['simple-icons', 'sentry'],
  splunk: ['simple-icons', 'splunk'],
  elastic: ['simple-icons', 'elastic'],
  opentelemetry: ['simple-icons', 'opentelemetry'],
  jaeger: ['simple-icons', 'jaeger'],

  // Containers / IaC
  docker: ['simple-icons', 'docker'],
  terraform: ['simple-icons', 'terraform'],
  ansible: ['simple-icons', 'ansible'],
  helm: ['simple-icons', 'helm'],
  pulumi: ['simple-icons', 'pulumi'],

  // Auth & identity
  auth0: ['simple-icons', 'auth0'],
  okta: ['simple-icons', 'okta'],
  firebase: ['simple-icons', 'firebase'],

  // Email
  sendgrid: ['simple-icons', 'sendgrid'],
  mailgun: ['simple-icons', 'mailgun'],
  resend: ['simple-icons', 'resend'],

  // Analytics & CRM
  mixpanel: ['simple-icons', 'mixpanel'],
  hubspot: ['simple-icons', 'hubspot'],
  salesforce: ['simple-icons', 'salesforce'],

  // Payments
  stripe: ['simple-icons', 'stripe'],
  paypal: ['simple-icons', 'paypal'],
  square: ['simple-icons', 'square'],

  // AI / ML
  openai: ['simple-icons', 'openai'],
  anthropic: ['simple-icons', 'anthropic'],
  huggingface: ['simple-icons', 'huggingface'],

  // Design & collab
  figma: ['simple-icons', 'figma'],
  miro: ['simple-icons', 'miro'],
  loom: ['simple-icons', 'loom'],

  // Languages
  typescript: ['simple-icons', 'typescript'],
  javascript: ['simple-icons', 'javascript'],
  python: ['simple-icons', 'python'],
  go: ['simple-icons', 'go'],
  rust: ['simple-icons', 'rust'],
  node: ['simple-icons', 'nodedotjs'],

  // Frameworks
  react: ['simple-icons', 'react'],
  nextjs: ['simple-icons', 'nextdotjs'],
  vue: ['simple-icons', 'vuedotjs'],
  svelte: ['simple-icons', 'svelte'],

  // Build / dev tools
  vite: ['simple-icons', 'vite'],

  // Consumer payments (wallets, BNPL, P2P, card networks)
  applePay: ['simple-icons', 'applepay'],
  googlePay: ['simple-icons', 'googlepay'],
  venmo: ['simple-icons', 'venmo'],
  cashApp: ['simple-icons', 'cashapp'],
  klarna: ['simple-icons', 'klarna'],
  afterpay: ['simple-icons', 'afterpay'],
  amex: ['simple-icons', 'americanexpress'],
  visa: ['simple-icons', 'visa'],
  mastercard: ['simple-icons', 'mastercard'],
  discover: ['simple-icons', 'discover'],

  // Mobility / rideshare brands
  uber: ['simple-icons', 'uber'],
  lyft: ['simple-icons', 'lyft'],

  // Social media & content platforms
  instagram: ['simple-icons', 'instagram'],
  facebook: ['simple-icons', 'facebook'],
  // `x` is the current brand mark; `twitter` keeps the legacy bird for consumers
  // who still reference it.
  x: ['simple-icons', 'x'],
  twitter: ['simple-icons', 'twitter'],
  youtube: ['simple-icons', 'youtube'],
  tiktok: ['simple-icons', 'tiktok'],
  linkedin: ['simple-icons', 'linkedin'],
  reddit: ['simple-icons', 'reddit'],
  pinterest: ['simple-icons', 'pinterest'],
  snapchat: ['simple-icons', 'snapchat'],
  whatsapp: ['simple-icons', 'whatsapp'],
  messenger: ['simple-icons', 'messenger'],
  signal: ['simple-icons', 'signal'],
  wechat: ['simple-icons', 'wechat'],
  line: ['simple-icons', 'line'],
  threads: ['simple-icons', 'threads'],
  mastodon: ['simple-icons', 'mastodon'],
  bluesky: ['simple-icons', 'bluesky'],
  twitch: ['simple-icons', 'twitch'],
  tumblr: ['simple-icons', 'tumblr'],
  vimeo: ['simple-icons', 'vimeo'],
  medium: ['simple-icons', 'medium'],
  substack: ['simple-icons', 'substack'],
  spotify: ['simple-icons', 'spotify'],
  soundcloud: ['simple-icons', 'soundcloud'],
  patreon: ['simple-icons', 'patreon'],
  behance: ['simple-icons', 'behance'],
  dribbble: ['simple-icons', 'dribbble'],

  // Big tech platforms & operating systems
  apple: ['simple-icons', 'apple'],
  google: ['simple-icons', 'google'],
  microsoft: ['simple-icons', 'microsoft'],
  amazon: ['simple-icons', 'amazon'],
  meta: ['simple-icons', 'meta'],
  android: ['simple-icons', 'android'],
  linux: ['simple-icons', 'linux'],
  ubuntu: ['simple-icons', 'ubuntu'],

  // Languages (extensions)
  kotlin: ['simple-icons', 'kotlin'],
  swift: ['simple-icons', 'swift'],
  php: ['simple-icons', 'php'],
  ruby: ['simple-icons', 'ruby'],
  rubyOnRails: ['simple-icons', 'rubyonrails'],
  cSharp: ['simple-icons', 'csharp'],
  dotNet: ['simple-icons', 'dotnet'],
  cPlusPlus: ['simple-icons', 'cplusplus'],
  c: ['simple-icons', 'c'],
  scala: ['simple-icons', 'scala'],
  elixir: ['simple-icons', 'elixir'],
  dart: ['simple-icons', 'dart'],

  // Frameworks & runtimes (extensions)
  angular: ['simple-icons', 'angular'],
  solid: ['simple-icons', 'solid'],
  astro: ['simple-icons', 'astro'],
  remix: ['simple-icons', 'remix'],
  nuxt: ['simple-icons', 'nuxtdotjs'],
  flutter: ['simple-icons', 'flutter'],
  tailwind: ['simple-icons', 'tailwindcss'],
  bun: ['simple-icons', 'bun'],
  deno: ['simple-icons', 'deno'],

  // Package managers & build / test tooling
  npm: ['simple-icons', 'npm'],
  pnpm: ['simple-icons', 'pnpm'],
  yarn: ['simple-icons', 'yarn'],
  webpack: ['simple-icons', 'webpack'],
  esbuild: ['simple-icons', 'esbuild'],
  rollup: ['simple-icons', 'rollupdotjs'],
  jest: ['simple-icons', 'jest'],
  vitestRunner: ['simple-icons', 'vitest'],
  cypress: ['simple-icons', 'cypress'],
  playwright: ['simple-icons', 'playwright'],
  storybook: ['simple-icons', 'storybook'],
  eslint: ['simple-icons', 'eslint'],
  prettier: ['simple-icons', 'prettier'],
  git: ['simple-icons', 'git'],

  // Messaging & infra (extensions)
  nginx: ['simple-icons', 'nginx'],
  apacheKafka: ['simple-icons', 'apachekafka'],
  rabbitmq: ['simple-icons', 'rabbitmq'],
  graphql: ['simple-icons', 'graphql'],

  // — Car manufacturers (every brand available in simple-icons) —
  // Japanese
  toyota: ['simple-icons', 'toyota'],
  acura: ['simple-icons', 'acura'],
  honda: ['simple-icons', 'honda'],
  nissan: ['simple-icons', 'nissan'],
  infiniti: ['simple-icons', 'infiniti'],
  mazda: ['simple-icons', 'mazda'],
  mitsubishi: ['simple-icons', 'mitsubishi'],
  subaru: ['simple-icons', 'subaru'],
  suzuki: ['simple-icons', 'suzuki'],

  // Korean
  hyundai: ['simple-icons', 'hyundai'],
  kia: ['simple-icons', 'kia'],

  // American
  ford: ['simple-icons', 'ford'],
  chevrolet: ['simple-icons', 'chevrolet'],
  cadillac: ['simple-icons', 'cadillac'],
  chrysler: ['simple-icons', 'chrysler'],
  jeep: ['simple-icons', 'jeep'],
  ram: ['simple-icons', 'ram'],
  tesla: ['simple-icons', 'tesla'],
  lucidMotors: ['simple-icons', 'lucid'],

  // German
  volkswagen: ['simple-icons', 'volkswagen'],
  audi: ['simple-icons', 'audi'],
  porsche: ['simple-icons', 'porsche'],
  bmw: ['simple-icons', 'bmw'],
  mini: ['simple-icons', 'mini'],
  mercedes: ['simple-icons', 'mercedes'],
  smart: ['simple-icons', 'smart'],
  opel: ['simple-icons', 'opel'],

  // Other European
  vauxhall: ['simple-icons', 'vauxhall'],
  skoda: ['simple-icons', 'skoda'],
  seatCar: ['simple-icons', 'seat'],
  renault: ['simple-icons', 'renault'],
  dacia: ['simple-icons', 'dacia'],
  peugeot: ['simple-icons', 'peugeot'],
  citroen: ['simple-icons', 'citroen'],
  dsAutomobiles: ['simple-icons', 'dsautomobiles'],
  fiat: ['simple-icons', 'fiat'],
  alfaRomeo: ['simple-icons', 'alfaromeo'],
  maserati: ['simple-icons', 'maserati'],
  ferrari: ['simple-icons', 'ferrari'],
  lamborghini: ['simple-icons', 'lamborghini'],
  bugatti: ['simple-icons', 'bugatti'],
  bentley: ['simple-icons', 'bentley'],
  rollsRoyce: ['simple-icons', 'rollsroyce'],
  astonMartin: ['simple-icons', 'astonmartin'],
  jaguar: ['simple-icons', 'jaguar'],
  landRover: ['simple-icons', 'landrover'],
  mclaren: ['simple-icons', 'mclaren'],
  volvo: ['simple-icons', 'volvo'],
  polestar: ['simple-icons', 'polestar'],
  koenigsegg: ['simple-icons', 'koenigsegg'],

  // Other
  mg: ['simple-icons', 'mg'],
  tata: ['simple-icons', 'tata'],
  mahindra: ['simple-icons', 'mahindra'],
  proton: ['simple-icons', 'proton'],
} as const satisfies Record<string, IconRef>;

/** Statically-typed semantic icon names — adds compile-time checking to `<IconGlyph name=…>`. */
export type GlyphName = keyof typeof glyphManifest;

/** Statically-typed connector names — used with `<IconGlyph kind="connector" name=…>`. */
export type ConnectorName = keyof typeof connectorManifest;
