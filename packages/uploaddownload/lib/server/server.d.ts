import { UploadDownloadLink } from "../common";
export declare class UploadDownloadServer {
    private static INSTANCE?;
    private static zips;
    formatDate(date: Date): string;
    checkZipsDB(): Promise<boolean>;
    addLink(uploadDownloadLink: UploadDownloadLink): Promise<UploadDownloadLink | null>;
    deleteLink(uuid: string): Promise<Boolean>;
    getLinkByUuid(uuid: string): Promise<UploadDownloadLink | null>;
    getLinksByProductIdAndFileType(productId: string, fileType: string): Promise<UploadDownloadLink[]>;
    getLinksByProductId(productId: string, date: string): Promise<UploadDownloadLink[]>;
    getLinksByFileTypePass(fileType: string, date: string): Promise<UploadDownloadLink[]>;
    addS3File(uuid: string, fileData: string, fileType: string): Promise<Boolean>;
    getS3Object(uuid: string): Promise<string>;
    getS3Url(uuid: string, userId?: string): Promise<string>;
    deleteS3File(uuid: string): Promise<Boolean>;
    generateZip(type: string, date: string, linkUuid: string, option?: string, city?: string, team?: string | string[]): Promise<void>;
    checkZip(type: string, date: string, option?: string, city?: string, team?: string | string[]): Promise<void>;
    getZip(type: string, date: string, option?: string, city?: string, team?: string | string[]): Promise<string>;
    static getInstance(): UploadDownloadServer;
}
//# sourceMappingURL=server.d.ts.map