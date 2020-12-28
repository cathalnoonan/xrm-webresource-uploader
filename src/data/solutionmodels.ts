export interface SolutionModel {
    uniquename: string
    ismanaged: boolean
    publisherid: PublisherPrefixModel
}

export interface PublisherPrefixModel {
    customizationprefix: string
    publisherid: string
}