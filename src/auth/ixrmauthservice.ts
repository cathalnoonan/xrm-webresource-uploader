import { AccessToken } from '.'

export interface IXrmAuthService {
    getAccessToken(): Promise<AccessToken>
    environmentUrl: string
}