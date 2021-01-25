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

export const NO_FEED: Feed = {
    teamId: 0,
    feedId: 0,
    feedType: FeedTypes.UPDATE,
    text: {},
    date: new Date()
};