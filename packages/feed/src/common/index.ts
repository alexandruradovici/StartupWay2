export interface FeedText
{
    [key: string]: any;
}

export enum FeedTypes {
    INVESTMENT = "Investment",
    AWARD = "Award",
    UPDATE = "Update",
    COLLABORATORS = "Collaborators"
};
export interface Feed {
    feedId: number;
    teamId: number;
    feedType: FeedTypes;
    text: FeedText;
    date: Date;
}