export const UserRole = {
  ENTERPRISE: "ENTERPRISE",
  AFFILIATE: "AFFILIATE",
  ADMIN: "ADMIN",
} as const;

export const UserStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;

export const CommissionType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
} as const;

export const ConversionStatus = {
  PENDING: "PENDING",
  VALIDATED: "VALIDATED",
  REJECTED: "REJECTED",
} as const;

export const WithdrawalStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  PAID: "PAID",
  REJECTED: "REJECTED",
} as const;

export const WithdrawalMethod = {
  BANK_AL_MAGHRIB: "BANK_AL_MAGHRIB",
  CIH: "CIH",
  ATTIJARIWAFA: "ATTIJARIWAFA",
  CASH_PLUS: "CASH_PLUS",
  WAFACASH: "WAFACASH",
  INWI_MONEY: "INWI_MONEY",
  ORANGE_MONEY: "ORANGE_MONEY",
} as const;

export const ApplicationStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export const DisputeStatus = {
  OPEN: "OPEN",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
} as const;

export const CATEGORIES = [
  "Mode & Beauté",
  "Électronique",
  "Maison & Décoration",
  "Santé & Bien-être",
  "Food & Restaurants",
  "Services & SaaS",
  "Voyage & Loisirs",
  "Autres",
];

export const WITHDRAWAL_METHODS = [
  { value: WithdrawalMethod.BANK_AL_MAGHRIB, label: "Bank Al-Maghrib", labelAr: "بنك المغرب" },
  { value: WithdrawalMethod.CIH, label: "CIH Bank", labelAr: "سي.آي.إتش" },
  { value: WithdrawalMethod.ATTIJARIWAFA, label: "Attijariwafa Bank", labelAr: "اتجاري وفا بنك" },
  { value: WithdrawalMethod.CASH_PLUS, label: "Cash Plus", labelAr: "كاش بلوس" },
  { value: WithdrawalMethod.WAFACASH, label: "Wafacash", labelAr: "وافا كاش" },
  { value: WithdrawalMethod.INWI_MONEY, label: "Inwi Money", labelAr: "إينوي موني" },
  { value: WithdrawalMethod.ORANGE_MONEY, label: "Orange Money", labelAr: "أورانج موني" },
] as const;
