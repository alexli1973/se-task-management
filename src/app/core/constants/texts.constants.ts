export const LOGIN_TEXTS = {
  title: 'ברוך שובך',
  subtitle: 'התחבר למרחב העבודה שלך.',
  email: {
    label: 'דוא"ל',
    placeholder: 'alice@example.com',
    error: 'יש להזין אימייל תקין',
  },
  password: {
    label: 'סיסמה',
    placeholder: 'alice123',
    error: 'יש להזין סיסמה',
  },
  submit: 'התחברות ←',
  submitting: 'מתחבר...',
  promo: {
    eyebrow: 'ניהול משימות, פשוט',
    titleLine1: 'תכנן את העבודה.',
    titleLine2: 'ואז בצע אותה.',
    description:
      'לוח קטן וממוקד להעברת משימות מרעיון להשלמה. התחבר כדי להציץ.',
  },
  demoUsers: 'משתמשים לדוגמה:',
  errors: {
    invalidCredentials: 'האימייל או הסיסמה אינם נכונים',
    navigationFailed: 'ניווט נכשל',
  },
} as const;

export const DASHBOARD_TEXTS = {
  logout: 'התנתק',
  newTask: 'משימה חדשה',
  // Parameterized message keeps the Hebrew (and its word order) out of the template
  summary: (tasks: number, columns: number) => `${tasks} משימות ב-${columns} עמודות`,
} as const;

export const FILTERS_TEXTS = {
  priorityLabel: 'עדיפות',
  all: 'הכל',
  searchPlaceholder: 'חיפוש משימות...',
} as const;

export const NEW_TASK_TEXTS = {
  title: {
    label: 'כותרת',
    placeholder: 'כתיבת README והערות ארכיטקטורה',
    error: 'יש להזין כותרת',
  },
  description: {
    label: 'תיאור · אופציונלי',
    placeholder: 'מבנה התיקיות, איך להריץ, ומה הייתי משפר עם עוד זמן.',
  },
  statusLabel: 'סטטוס',
  priorityLabel: 'עדיפות',
  submit: 'צור משימה',
  cancel: 'ביטול',
  endpoint: 'POST /tasks',
} as const;

export const BOARD_TEXTS = {
  // Column labels keyed by TaskStatus
  columns: {
    'todo': 'לעשות',
    'in-progress': 'בתהליך',
    'done': 'הושלם',
  },
  // Priority labels keyed by TaskPriority
  priorities: {
    high: 'גבוהה',
    medium: 'בינונית',
    low: 'נמוכה',
  },
} as const;
