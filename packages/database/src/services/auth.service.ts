import { authRepository } from "../repositories/auth.repository";
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

export class AuthService {
  async signIn(credentials: SignInRequest): Promise<FusionApiResponseLoginResponse> {
    return await authRepository.signIn(credentials);
  }

  async signUp(data: SignUpRequest): Promise<FusionApiResponseRegistrationResponse> {
    return await authRepository.signUp(data);
  }

  async getUserInfo(token: string): Promise<FusionApiResponseUserinfoResponse> {
    return await authRepository.getUserInfo(token);
  }

  async refreshJWT(refreshToken: string): Promise<FusionApiResponseJWTRefreshResponse> {
    return await authRepository.refreshJWT(refreshToken);
  }

  async logout(token: string, refreshToken: string, global: boolean = true): Promise<FusionApiResponseVoid> {
    return await authRepository.logout(token, refreshToken, global);
  }

  async approveDevice(data: { clientId: string, clientSecret: string, token: string, userCode: string }): Promise<FusionApiResponseDeviceApprovalResponse> {
    return await authRepository.approveDevice(data);
  }
}

export const authService = new AuthService();
