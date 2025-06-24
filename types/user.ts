export type UserRegistration = {
  applicationId: string;
  data: Record<string, any>;
  id: string;
  insertInstant: number;
  lastLoginInstant: number;
  lastUpdateInstant: number;
  preferredLanguages: string[];
  roles: string[];
  tokens: Record<string, any>;
  usernameStatus: string;
  verified: boolean;
  verifiedInstant: number;
};

export type TwoFactor = {
  methods: any[];
  recoveryCodes: any[];
};

export type User = {
  active: boolean;
  birthDate: string;
  connectorId: string;
  data: Record<string, any>;
  email: string;
  firstName: string;
  id: string;
  insertInstant: number;
  lastLoginInstant: number;
  lastName: string;
  lastUpdateInstant: number;
  memberships: any[];
  mobilePhone: string;
  passwordChangeRequired: boolean;
  passwordLastUpdateInstant: number;
  preferredLanguages: string[];
  registrations: UserRegistration[];
  tenantId: string;
  twoFactor: TwoFactor;
  uniqueUsername: string;
  username: string;
  usernameStatus: string;
  verified: boolean;
  verifiedInstant: number;
};
