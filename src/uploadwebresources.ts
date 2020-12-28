import { readFile } from 'fs/promises'

import { IXrmAuthService } from './auth';
import { SolutionDal, WebResourceDal, getWebResourceType, ESolutionComponentType } from './data';
import { findFilesInFolder } from './utilities'
import { XrmOrgService } from './xrmorgservice';

export async function uploadWebResources(options: UploadWebResourcesOptions): Promise<void> {

    const xrmOrgService = new XrmOrgService({
        authService: options.authService,
        apiVersion: options.apiVersion,
        preloadEntitySetNames: {
            'webresource': 'webresourceset',
            'solution': 'solutions'
        }
    })

    const solutionDal = new SolutionDal({ xrmOrgService })
    const webResourceDal = new WebResourceDal({ xrmOrgService })

    const solution = await solutionDal.findSolution(options.soltionName);

    const files = await findFilesInFolder(options.deployFolder);

    for await (const filePath of files) {
        try {
            const name = filePath.replace(options.deployFolder, solution.publisherid.customizationprefix + '_').replace(/\\/g,"/")
            const type = getWebResourceType(filePath, options.includeSourceMaps)

            // Skip unknown types
            if (type === null) continue;

            const base64Content = await readFile(filePath, { encoding: 'base64' })

            const webResourceId = await webResourceDal.addOrUpdateWebresource({
                solutionName: solution.uniquename,
                name,
                type,
                base64Content,
            });

            await solutionDal.addSolutionComponent({
                ComponentId: webResourceId,
                ComponentType: ESolutionComponentType.WebResource,
                DoNotIncludeSubcomponents: false,
                AddRequiredComponents: false,
                SolutionUniqueName: solution.uniquename,
                IncludedComponentSettingsValues: null,
            });
            
        } catch (err) {
            //console.error("ERROR: ", err)
            console.error("ERROR");
            return
        }
    }

}

export interface UploadWebResourcesOptions {
    deployFolder: string
    soltionName: string
    apiVersion: string
    authService: IXrmAuthService

    // TODO: Separate source maps to separate function
    includeSourceMaps: boolean
}