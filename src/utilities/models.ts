export interface ILocalizedStrings {
    [key: string]: string;
}

// The order of the enum values must not be changed
export enum ISubmitStatus {
    Pending, Review, Approved, Rejected,
}
