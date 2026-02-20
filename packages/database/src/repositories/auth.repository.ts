import { apiRequest } from "../api-client";
import { 
  SignInRequest, 
  SignUpRequest, 
  FusionApiResponseLoginResponse, 
  FusionApiResponseRegistrationResponse,
  FusionApiResponseUserinfoResponse,
  FusionApiResponseJWTRefreshResponse,
  FusionApiResponseVoid,
  FusionApiResponseDeviceApprovalResponse
} from "@think-id/types";

export class AuthRepository {
  async signIn(credentials: SignInRequest): Promise<FusionApiResponseLoginResponse> {
    return await apiRequest<FusionApiResponseLoginResponse>("/api/auth/signin", "POST", credentials);
  }

  async signUp(data: SignUpRequest): Promise<FusionApiResponseRegistrationResponse> {
    return await apiRequest<FusionApiResponseRegistrationResponse>("/api/auth/signupUser", "POST", data);
  }

  async getUserInfo(token: string): Promise<FusionApiResponseUserinfoResponse> {
    return await apiRequest<FusionApiResponseUserinfoResponse>("/api/auth/getJWTUserInfo", "GET", undefined, { token });
  }

  async refreshJWT(refreshToken: string): Promise<FusionApiResponseJWTRefreshResponse> {
    return await apiRequest<FusionApiResponseJWTRefreshResponse>("/api/auth/refreshJWT", "POST", { refreshToken });
  }

  async logout(token: string, refreshToken: string, global: boolean = true): Promise<FusionApiResponseVoid> {
    return await apiRequest<FusionApiResponseVoid>("/api/auth/logout", "POST", undefined, { 
      params: { global: global.toString(), refreshToken },
      token 
    });
  }

  // FusionAuth helpers if needed
  async approveDevice(data: { clientId: string, clientSecret: string, token: string, userCode: string }): Promise<FusionApiResponseDeviceApprovalResponse> {
    return await apiRequest<FusionApiResponseDeviceApprovalResponse>("/api/auth/approveDevice", "POST", undefined, {
      params: data
    });
  }
}

export const authRepository = new AuthRepository();
