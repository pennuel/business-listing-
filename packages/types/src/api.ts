/**
 * THiNK Authentication REST Service API Types
 * Generated from OpenAPI 3.0.1
 */

export interface ServiceRequest {
  serviceName?: string;
  serviceDescription?: string;
  costing?: string;
  costingDescription?: string;
  price?: number;
  currency: string;
  duration?: number; // int32
  businessId?: number; // int64
  typeId?: number; // int64
  locationId?: number; // int64
}

export interface BusinessType {
  businessTypeName?: string;
  id?: number; // int64
  offerings?: OfferingEntity;
  industry?: IndustryEntity;
  sector?: SectorEntity;
}

export interface Country {
  countryName?: string;
  flagLogo?: string;
  countryCode?: string;
  countryId?: number; // int64
  counties: County[];
}

export interface County {
  countyName?: string;
  countyId?: number; // int64
  country?: Country;
  subCounties: SubCounty[];
}

export interface IndustryEntity {
  industryName?: string;
  industryId?: number; // int64
}

export interface LocationEntity {
  address?: string;
  postalAddress?: string;
  longitude?: number; // float
  latitude?: number; // float
  locationId?: number; // int64
  country?: Country;
  county?: County;
  subCounty?: SubCounty;
}

export interface OfferingEntity {
  offeringName?: string;
  offeringId?: number; // int64
  businessType: BusinessType[];
}

export interface SectorEntity {
  sectorName?: string;
  sectorId?: number; // int64
}

export interface ServicesEntity {
  createdAt: string; // date-time
  updatedAt: string; // date-time
  serviceDescription?: string;
  serviceName?: string;
  costing?: string;
  costingDescription?: string;
  price?: number;
  currency: string;
  duration?: number; // int32
  serviceId?: number; // int64
  type?: BusinessType;
  locationEntity?: LocationEntity;
}

export interface SubCounty {
  subCountyName?: string;
  subCountyId?: number; // int64
  county?: County;
  country?: Country;
}

export interface ReviewRequest {
  starRating?: number; // int32
  reviews?: string;
  businessId?: number; // int64
  comment?: string;
  authorName?: string;
  reply?: string;
}

export interface Reviews {
  createdAt: string; // date-time
  starRating?: number; // int32
  reviews?: string;
  comment?: string;
  authorName?: string;
  reply?: string;
  reviewsID?: number; // int64
}

export interface BusinessInfoRequest {
  businessName?: string;
  logo?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  schedule?: {
    weekday?: Record<string, string>;
    weekend?: Record<string, string>;
    holiday?: Record<string, string>;
  };
  businessDocuments?: Record<string, string>;
  categoryId?: number; // int64
  sizeId?: number; // int64
  description?: string;
  coverImage?: string;
  gallery?: string[];
  amenities?: string[];
  weekdaySchedule?: string;
  weekendSchedule?: string;
  holidayHours?: string;
  status?: string;
  paymentStatus?: string;
  isManuallyOpen?: boolean;
  tagline?: string;
  verificationDoc?: string;
  pin?: string;
  formattedAddress?: string;
  latitude?: number; // float
  longitude?: number; // float
  placeId?: string;
  address?: string;
  county?: string;
  subCounty?: string;
  country?: string;
  userId?: string;
}

export interface Analytics {
  views: number; // int32
  calls: number; // int32
  directions: number; // int32
  websiteClicks: number; // int32
  id?: string;
  date?: string; // date
  businessInfo?: BusinessInfo;
}

export interface Branding {
  mediaUrl?: string;
  link?: string;
  brandId?: number; // int64
}

export interface BusinessInfo {
  createdAt: string; // date-time
  updatedAt: string; // date-time
  businessName?: string;
  logo?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  schedule?: {
    weekday?: Record<string, string>;
    weekend?: Record<string, string>;
    holiday?: Record<string, string>;
  };
  businessDocuments?: Record<string, string>;
  description?: string;
  coverImage?: string;
  gallery?: string[];
  amenities?: string[];
  weekdaySchedule?: string;
  weekendSchedule?: string;
  holidayHours?: string;
  status?: string;
  paymentStatus?: string;
  isManuallyOpen?: boolean;
  tagline?: string;
  verificationDoc?: string;
  pin?: string;
  formattedAddress?: string;
  latitude?: number; // float
  longitude?: number; // float
  placeId?: string;
  address?: string;
  county?: string;
  subCounty?: string;
  country?: string;
  bizId?: number; // int64
  user?: User;
  analytics: Analytics[];
  complaints: ComplaintsEntity[];
  reviews: Reviews[];
  branding: Branding[];
  services: ServicesEntity[];
  location: LocationEntity[];
  category?: Category;
  size?: SizeEntity;
}

export interface Category {
  categoryName?: string;
  categoryId?: number; // int64
  sector?: SectorEntity;
  industry?: IndustryEntity;
  offeringEntity?: OfferingEntity;
  businessType?: BusinessType;
  servicesEntity?: ServicesEntity;
}

export interface ComplaintsEntity {
  complaints?: string;
  complaintID?: number; // int64
}

export interface SizeEntity {
  businessSize?: string;
  levelOfTechnology?: string;
  id?: number; // int64
}

export interface User {
  createdAt: string; // date-time
  updatedAt: string; // date-time
  name?: string;
  email?: string;
  emailVerified?: string; // date-time
  image?: string;
  id?: string;
  businesses: BusinessInfo[];
}

export interface BusinessTypeRequest {
  businessTypeName?: string;
}

export interface SignUpRequest {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  is_Admin?: boolean;
  is_Moderator?: boolean;
  password?: string;
  confirm_password?: string;
  dob?: string; // date
}

export interface AuthenticatorConfiguration {
  algorithm?: 'HmacSHA1' | 'HmacSHA256' | 'HmacSHA512';
  codeLength?: number; // int32
  timeStep?: number; // int32
}

export interface Error {
  code?: string;
  data?: Record<string, any>;
  message?: string;
}

export interface Errors {
  fieldErrors?: Record<string, Error[]>;
  generalErrors?: Error[];
}

export interface FusionApiResponseRegistrationResponse {
  status?: number; // int32
  message?: RegistrationResponse;
  error?: Errors;
}

export interface LocalTime {
  hour?: number; // int32
  minute?: number; // int32
  second?: number; // int32
  nano?: number; // int32
}

export interface RegistrationResponse {
  refreshToken?: string;
  registration?: UserRegistration;
  registrationVerificationId?: string;
  token?: string;
  tokenExpirationInstant?: string; // date-time
  user?: User;
}

export interface TwoFactorMethod {
  authenticator?: AuthenticatorConfiguration;
  email?: string;
  id?: string;
  lastUsed?: boolean;
  method?: string;
  mobilePhone?: string;
  secret?: string;
}

export interface UserRegistration {
  data?: Record<string, any>;
  preferredLanguages?: Array<{
    language?: string;
    displayName?: string;
    country?: string;
    variant?: string;
    script?: string;
    unicodeLocaleAttributes: string[];
    unicodeLocaleKeys: string[];
    displayLanguage?: string;
    displayScript?: string;
    displayCountry?: string;
    displayVariant?: string;
    extensionKeys: string[];
    iso3Language?: string;
    iso3Country?: string;
  }>;
  applicationId?: string; // uuid
  authenticationToken?: string;
  cleanSpeakId?: string; // uuid
  id?: string; // uuid
  insertInstant?: string; // date-time
  lastLoginInstant?: string; // date-time
  lastUpdateInstant?: string; // date-time
  roles: string[];
  timezone?: {
    id?: string;
    rules?: {
      fixedOffset?: boolean;
      transitions: Array<{
        offsetBefore?: { totalSeconds?: number; id?: string };
        offsetAfter?: { totalSeconds?: number; id?: string };
        duration?: {
          seconds?: number;
          zero?: boolean;
          nano?: number;
          negative?: boolean;
          positive?: boolean;
          units: Array<{
            durationEstimated?: boolean;
            timeBased?: boolean;
            dateBased?: boolean;
          }>;
        };
        gap?: boolean;
        dateTimeAfter?: string; // date-time
        overlap?: boolean;
        instant?: string; // date-time
        dateTimeBefore?: string; // date-time
      }>;
      transitionRules: Array<{
        month?: 'JANUARY' | 'FEBRUARY' | 'MARCH' | 'APRIL' | 'MAY' | 'JUNE' | 'JULY' | 'AUGUST' | 'SEPTEMBER' | 'OCTOBER' | 'NOVEMBER' | 'DECEMBER';
        timeDefinition?: 'UTC' | 'WALL' | 'STANDARD';
        standardOffset?: { totalSeconds?: number; id?: string };
        offsetBefore?: { totalSeconds?: number; id?: string };
        offsetAfter?: { totalSeconds?: number; id?: string };
        dayOfWeek?: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
        dayOfMonthIndicator?: number;
        localTime?: LocalTime;
        midnightEndOfDay?: boolean;
      }>;
    };
  };
  username?: string;
  usernameStatus?: 'ACTIVE' | 'PENDING' | 'REJECTED';
  verified?: boolean;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface FusionApiResponseLoginResponse {
  status?: number; // int32
  message?: LoginResponse;
  error?: Errors;
}

export interface LoginPreventedResponse {
  actionId?: string; // uuid
  actionerUserId?: string; // uuid
  expiry?: string; // date-time
  localizedName?: string;
  localizedOption?: string;
  localizedReason?: string;
  name?: string;
  option?: string;
  reason?: string;
  reasonCode?: string;
}

export interface LoginResponse {
  actions?: LoginPreventedResponse[];
  changePasswordId?: string;
  changePasswordReason?: 'Administrative' | 'Breached' | 'Expired' | 'Validation';
  configurableMethods?: string[];
  emailVerificationId?: string;
  methods?: TwoFactorMethod[];
  pendingIdPLinkId?: string;
  refreshToken?: string;
  refreshTokenId?: string; // uuid
  registrationVerificationId?: string;
  state?: Record<string, any>;
  threatsDetected: Array<'ImpossibleTravel'>;
  token?: string;
  tokenExpirationInstant?: string; // date-time
  trustToken?: string;
  twoFactorId?: string;
  twoFactorTrustId?: string;
  user?: User;
}

export interface FusionApiResponseJWTRefreshResponse {
  status?: number; // int32
  message?: JWTRefreshResponse;
  error?: Errors;
}

export interface JWTRefreshResponse {
  refreshToken?: string;
  refreshTokenId?: string; // uuid
  token?: string;
}

export interface FusionApiResponseVoid {
  status?: number; // int32
  message?: Record<string, any>;
  error?: Errors;
}

export interface DeviceInfo {
  description?: string;
  lastAccessedAddress?: string;
  lastAccessedInstant?: string; // date-time
  name?: string;
  type?: string;
}

export interface FusionApiResponseRefreshTokenResponse {
  status?: number; // int32
  message?: RefreshTokenResponse;
  error?: Errors;
}

export interface MetaData {
  data?: Record<string, any>;
  device?: DeviceInfo;
  scopes: string[];
}

export interface RefreshToken {
  applicationId?: string; // uuid
  data?: Record<string, any>;
  id?: string; // uuid
  insertInstant?: string; // date-time
  metaData?: MetaData;
  startInstant?: string; // date-time
  tenantId?: string; // uuid
  token?: string;
  userId?: string; // uuid
}

export interface RefreshTokenResponse {
  refreshToken?: RefreshToken;
  refreshTokens?: RefreshToken[];
}

export interface DeviceApprovalResponse {
  deviceGrantStatus?: string;
  deviceInfo?: DeviceInfo;
  identityProviderLink?: IdentityProviderLink;
  tenantId?: string; // uuid
  userId?: string; // uuid
}

export interface FusionApiResponseDeviceApprovalResponse {
  status?: number; // int32
  message?: DeviceApprovalResponse;
  error?: Errors;
}

export interface IdentityProviderLink {
  data?: Record<string, any>;
  displayName?: string;
  identityProviderId?: string; // uuid
  identityProviderName?: string;
  identityProviderType?: 'Apple' | 'EpicGames' | 'ExternalJWT' | 'Facebook' | 'Google' | 'HYPR' | 'LinkedIn' | 'Nintendo' | 'OpenIDConnect' | 'SAMLv2' | 'SAMLv2IdPInitiated' | 'SonyPSN' | 'Steam' | 'Twitch' | 'Twitter' | 'Xbox';
  identityProviderUserId?: string;
  insertInstant?: string; // date-time
  lastLoginInstant?: string; // date-time
  tenantId?: string; // uuid
  token?: string;
  userId?: string; // uuid
}

export interface ComplaintRequest {
  complaint?: string;
  businessId?: number; // int64
}

export interface CategoryRequest {
  categoryName?: string;
}

export interface PagedResponseListBusinessType {
  item: BusinessType[];
  curentPage: number; // int32
  totalItems: number; // int64
  totalPages: number; // int32
}

export interface FusionApiResponseIssueResponse {
  status?: number; // int32
  message?: IssueResponse;
  error?: Errors;
}

export interface IssueResponse {
  refreshToken?: string;
  token?: string;
}

export interface FusionApiResponseUserinfoResponse {
  status?: number; // int32
  message?: Record<string, any> & { empty?: boolean };
  error?: Errors;
}

export interface PagedResponseListServicesEntity {
  item: ServicesEntity[];
  curentPage: number; // int32
  totalItems: number; // int64
  totalPages: number; // int32
}

export interface PagedResponseListReviews {
  item: Reviews[];
  curentPage: number; // int32
  totalItems: number; // int64
  totalPages: number; // int32
}

export interface PagedResponseListComplaintsEntity {
  item: ComplaintsEntity[];
  curentPage: number; // int32
  totalItems: number; // int64
  totalPages: number; // int32
}

export interface PagedResponseListCategory {
  item: Category[];
  curentPage: number; // int32
  totalItems: number; // int64
  totalPages: number; // int32
}

export interface PagedResponseListBusinessInfo {
  item: BusinessInfo[];
  curentPage: number; // int32
  totalItems: number; // int64
  totalPages: number; // int32
}

export interface Unit {}
