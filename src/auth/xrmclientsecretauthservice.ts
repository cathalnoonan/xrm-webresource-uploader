import * as qs from 'querystring'
import { AccessToken, IXrmAuthService } from "."
import { httpService } from '../http'

export class XrmClientSecretAuthService implements IXrmAuthService {

    private _currentToken: AccessToken = null
    private _options: XrmClientSecretAuthServiceOptions = null
    
    constructor (options: XrmClientSecretAuthServiceOptions) {
        this._options = options;
    }

    public async getAccessToken(): Promise<AccessToken> {
        await this.acquireToken()
        return this._currentToken
    }

    public get environmentUrl() {
        return this._options.environmentUrl
    }

    private async acquireToken(): Promise<void> {
        if (!this.shouldRefreshToken()) return;

        const {
            clientId,
            clientSecret,
            environmentUrl,
            tenantId,
        } = this._options

        const url = `https://login.microsoftonline.com/${tenantId}/oauth2/token`
        const data = qs.stringify({
            client_id: clientId,
            resource: environmentUrl,
            client_secret: clientSecret,
            grant_type: 'client_credentials',
        })
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        const response = await httpService.post(url, data, config)
        
        this._currentToken = { 
            ...response.data,
            tokenAssignedOn: new Date(),
        }
    }

    private shouldRefreshToken(): boolean {
        if (this._currentToken === null)
            return true

        const offset = Number.parseInt(this._currentToken.expires_in) - (this._options.tokenTolerance ?? 60)
        const tokenExpiry = this._currentToken.tokenAssignedOn.getTime() + offset
        const now = new Date().getTime()
        if (now < tokenExpiry)
            return true

        return false
    }

}

export interface XrmClientSecretAuthServiceOptions {
    tenantId: string
    environmentUrl: string
    clientId: string
    clientSecret: string
    tokenTolerance?: number
}