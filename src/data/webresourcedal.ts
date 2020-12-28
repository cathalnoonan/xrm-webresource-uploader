import { AddSolutionComponentRequest, AddSolutionComponentResponse,ESolutionComponentType,WebResource, WebResourceNameModel } from '.'
import { XrmOrgService } from '../xrmorgservice'

export class WebResourceDal {

    _options: WebResourceDalOptions

    constructor (options: WebResourceDalOptions) {
        this._options = options
    }

    public async listWebResourcesInSolution(solutionName: string): Promise<WebResourceNameModel[]> {
        const query = '?fetchXml=' + encodeURIComponent(
            '<fetch>'+
            '<entity name="webresource">'+
            '<attribute name="name" />'+
            '<attribute name="webresourceid" />'+
            '<attribute name="webresourcetype" />'+
            '<link-entity name="solutioncomponent" from="objectid" to="webresourceid" alias="solutioncomponent">'+
            '<link-entity name="solution" from="solutionid" to="solutionid" alias="solution">'+
            '<filter>'+
            `<condition attribute="uniquename" operator="eq" value="${solutionName}" />`+
            '</filter>'+
            '</link-entity>'+
            '</link-entity>'+
            '</entity>'+
            '</fetch>'
        )

        const webresources = await this._options.xrmOrgService.retrieveMultiple<WebResourceNameModel>('webresource', query)

        return webresources
    }

    public async addOrUpdateWebresource(webresource: WebResource): Promise<string> {
        let webResourceId = await this.findWebResourceByName(webresource.name)

        if (webResourceId !== null) {
            await this.updateWebResource(webresource, webResourceId)
        } else {
            webResourceId = await this.createWebResource(webresource)
        }

        return webResourceId;
    }

    private async findWebResourceByName(webresourceName: string): Promise<string> {
        const query = '?' + [
            '$select=name,webresourceid',
            `$filter=name eq '${webresourceName}'`,
        ].join('&')
        
        const webresources = await this._options.xrmOrgService.retrieveMultiple<WebResourceNameModel>('webresource', query)

        if (webresources.length > 0) {
            return webresources[0].webresourceid
        } else {
            return null
        }
    }

    private async createWebResource(model: WebResource): Promise<string> {
        const entity = {
            content: model.base64Content,
            displayname: model.name,
            name: model.name,
            webresourcetype: model.type,
        }

        const entityId = await this._options.xrmOrgService.create('webresource', entity)

        // TODO? : Add to solution

        return entityId
    }

    private async updateWebResource(model: WebResource, webResourceId: string): Promise<string> {
        const entity = {
            content: model.base64Content,
            displayname: model.name,
            name: model.name,
            webresourcetype: model.type,
        }

        /*const entityId =*/ await this._options.xrmOrgService.update('webresource', webResourceId, entity)

        // TODO? : Add to solution

        return webResourceId
    }
}

export interface WebResourceDalOptions {
    xrmOrgService: XrmOrgService
}