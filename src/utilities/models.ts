export interface IId {
    id: string;
}

export interface ISubmitBase extends IId {
    submitId: string;
}

export interface IBase extends IId {
    currentSubmitId: string;
}

export interface ILocalizedStrings {
    [key: string]: string;
}
