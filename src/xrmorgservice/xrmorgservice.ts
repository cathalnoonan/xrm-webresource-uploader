import { EntityDefinition } from '.';
import { IXrmAuthService } from '../auth'
import { httpService } from '../http'
import { StringDictionary } from '../utilities';

export class XrmOrgService {

    private _options: XrmOrgServiceOptions
    private _entitySetNames: StringDictionary = {}

    constructor(options: XrmOrgServiceOptions) {
        this._options = options
        this._entitySetNames = this._options.preloadEntitySetNames ?? {}

        this._entitySetNames.EntityDefinitions = 'EntityDefinitions'
    }

    public async retrieve<T = any>(entityName: string, entityId: string, odataParams?: string): Promise<T> {
        const { environmentUrl, apiVersion } = this.getProperties()

        const entitySetName = await this.getEntitySetName(entityName);

        const url = `${environmentUrl}/api/data/${apiVersion}/${entitySetName}(${entityId})${odataParams}`

        const headers = await this.getRequestHeaders();

        const response = await httpService.get(url, { headers: headers })

        return response.data
    }

    public async retrieveMultiple<T = any>(entityName: string, odataParams?: string): Promise<T[]> {
        const { environmentUrl, apiVersion } = this.getProperties()

        const entitySetName = await this.getEntitySetName(entityName)

        const url = `${environmentUrl}/api/data/${apiVersion}/${entitySetName}${odataParams}`

        const headers = await this.getRequestHeaders()

        const response = await httpService.get(url, { headers: headers })

        // @ts-ignore
        return response.data.value
    }

    public async create(entityName: string, data: any): Promise<string> {
        const { environmentUrl, apiVersion } = this.getProperties()

        const entitySetName = await this.getEntitySetName(entityName);

        const url = `${environmentUrl}/api/data/${apiVersion}/${entitySetName}`

        const headers = await this.getRequestHeaders()

        const response = await httpService.post(url, data, { headers })

        const entityIdHeader = <string>response.headers['OData-EntityId'] ?? <string>response.headers['odata-entityid'];

        const entityId = entityIdHeader.match(/[0-9A-Fa-f]{8}[-]?([0-9A-Fa-f]{4}[-]?){3}[0-9A-Fa-f]{12}/)[0]

        return entityId
    }

    public async update(entityName: string, entityId: string, data: any): Promise<any> {
        const { environmentUrl, apiVersion } = this.getProperties()

        const entitySetName = await this.getEntitySetName(entityName);

        const url = `${environmentUrl}/api/data/${apiVersion}/${entitySetName}(${entityId})`

        const headers = await this.getRequestHeaders()

        const response = await httpService.patch(url, data, { headers })

        return response.data
    }

    public async executeAction<TResponse = any>(actionName: string, data?: any): Promise<TResponse | void> {
        const { environmentUrl, apiVersion } = this.getProperties()

        const url = `${environmentUrl}/api/data/${apiVersion}/${actionName}`

        const headers = await this.getRequestHeaders()

        const response = await httpService.post(url, data, { headers })

        return <TResponse>response.data
    }

    private async getRequestHeaders(): Promise<any> {
        const { authService } = this.getProperties()

        const token = await authService.getAccessToken();

        return {
            'Authorization': 'Bearer ' + token.access_token,
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            'If-None-Match': 'null',
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'Prefer': 'odata.include-annotations=*',//; return=representation', // TBC: return=representation
        }
    }

    private async getEntitySetName(entityName: string): Promise<string> {
        if (!this._entitySetNames[entityName]) {

            const entityMetadata = await this.retrieve<EntityDefinition>(
                'EntityDefinitions',
                `LogicalName='${entityName}'`,
                '?$select=EntitySetName');

            this._entitySetNames[entityName] = entityMetadata.EntitySetName
        }

        return this._entitySetNames[entityName];
    }

    private getProperties() {
        return {
            apiVersion: this._options.apiVersion,
            authService: this._options.authService,
            environmentUrl: this._options.authService.environmentUrl,
        }
    }
}

export interface XrmOrgServiceOptions {
    authService: IXrmAuthService
    apiVersion: string
    preloadEntitySetNames?: StringDictionary
}

