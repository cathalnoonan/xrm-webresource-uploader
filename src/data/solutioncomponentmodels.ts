export interface AddSolutionComponentRequest {
    ComponentId: string
    ComponentType: ESolutionComponentType
    SolutionUniqueName: string
    AddRequiredComponents: boolean
    DoNotIncludeSubcomponents: boolean
    IncludedComponentSettingsValues: string
}

export interface AddSolutionComponentResponse {
    id: string
}

// https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/solutioncomponent?view=dynamics-ce-odata-9
export enum ESolutionComponentType {
    // Ignoring the unexpected types.
    WebResource = 61
}