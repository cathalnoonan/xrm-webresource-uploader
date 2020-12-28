export interface WebResource {
    name: string
    solutionName: string
    type: WebResourceType
    base64Content: string
}

export interface WebResourceNameModel {
    name: string
    webresourceid: string
    webresourcetype: WebResourceType
}

export enum WebResourceType {
    HTML = 1,
    CSS = 2,
    JS = 3,
    XML = 4,
    PNG = 5,
    JPG = 6,
    GIF = 7,
    Silverlight = 8,
    XSL = 9,
    ICO = 10,
    SVG = 11,
    RESX = 12,
}