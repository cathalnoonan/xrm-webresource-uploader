import { XrmOrgService } from '../xrmorgservice'
import { SolutionModel, AddSolutionComponentRequest, AddSolutionComponentResponse } from '.'

export class SolutionDal {

    private _options: SolutionDalOptions

    constructor(options: SolutionDalOptions) {
        this._options = options
    }

    public async findSolution(solutionName: string): Promise<SolutionModel> {
        const { xrmOrgService } = this.getProperties()

        const query = '?' + [
            '$top=1',
            `$filter=uniquename eq '${solutionName}'`,
            '$select=uniquename,solutionid',
            '$expand=publisherid($select=customizationprefix)',
        ].join('&')

        const solutions = await xrmOrgService.retrieveMultiple<SolutionModel>('solution', query)

        return solutions[0]
    }

    public async addSolutionComponent(request: AddSolutionComponentRequest): Promise<AddSolutionComponentResponse | void> {
        const { xrmOrgService } = this.getProperties()

        return await xrmOrgService.executeAction<AddSolutionComponentResponse>('AddSolutionComponent', request);
    }

    private getProperties() {
        return {
            xrmOrgService: this._options.xrmOrgService
        }
    }
}

export interface SolutionDalOptions {
    xrmOrgService: XrmOrgService
}