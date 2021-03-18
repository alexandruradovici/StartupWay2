import { Recovery } from "../common";
import { ParsedCSV, UpdateCSV } from '../common/index';
export declare class AdminServer {
    private static INSTANCE?;
    private users;
    /**
     * Internal function that parses a single line from a .CSV file
     * Params are sent via deconstruction an array ...arr
     * @param loc - location
     * @param workshopNo - workshop day
     * @param teamMentor - mentor email
     * @param teamId - teamId for database
     * @param teamTrack - team type
     * @param businessTrack - team business track
     * @param teamName - name of the team
     * @param pitcher - pitcher name
     * @param role - user role in team
     * @param firstName - user firstname
     * @param lastName - user lastname
     * @param email - user email
     * @param phone - user phonenumber
     * @param facebook - user facebook link
     * @param linkedin - user linkedin link
     * @param shortDescRO - team short description RO
     * @param shortDescEN - team short description EN
     * @param birthDate - user birthdate
     * @param faculty - user faculty
     * @param group - user group at faculty
     * @param findProgram - shot description on how the user found the program
     * @returns { teamId:string, workshop:WorkshopObj, team:{}, product:{}, user:{} } parsedCSV | null - contains all the info about the user and it's asociated team and product
     */
    parseCSVData(loc?: string, workshopNo?: string, teamMentor?: string, teamId?: string, teamTrack?: string, businessTrack?: string, teamName?: string, pitcher?: string, role?: string, firstName?: string, lastName?: string, email?: string, phone?: string, facebook?: string, linkedin?: string, shortDescRO?: string, shortDescEN?: string, birthDate?: string, faculty?: string, group?: string, findProgram?: string): ParsedCSV | null;
    parseUpdateCSV(loc?: string, teamName?: string, descRO?: string, descEN?: string): UpdateCSV | null;
    /**
     * Internal function that creates a random password
     * @returns { string } - the generated password
     */
    randomPassword(): string;
    /**
     * Function that generates a recovery token used in password recovery
     * @returns {string} the recovery token
     */
    _randomRecoveryGenerator(): string;
    /**
     * Function that formats a Date object to a readeable string
     * @param date - Date object
     * @returns {string} a readeable date string or ""
     */
    formatDate(date: Date): string;
    /**
     * Function that extract information from the database about all teams that have passed 20th may assesment and
     * 		all of their uploaded files.
     * @returns {Promise<any[]>} an array of informations about each team
     */
    getUDCData(): Promise<any[]>;
    /**
     * Function that extract information from the database about all teams and their descriptions
     * @returns {Promise<any[]>} an array of informations about each team
     */
    getTeamData(): Promise<any[]>;
    /**
     * Function that adds a recovery object containing the information about a users password recovery into the database
     * @param recovery - object that contains information about the incoming recovery of password request
     * @returns {Promise<Recovery>} - a recovery object
     */
    addRecovery(recovery: Recovery): Promise<Recovery | null>;
    /**
     * Function that deletes a recovery object from the databse
     * @param recoveryId - unique indentifier to find the specified recovery in the database
     */
    deleteRecovery(recoveryId: string): Promise<boolean>;
    /**
     * Function that finds a recovery object in the database based on it's unique id
     * @param id - unique identifier to find the recovery object in the database
     * @returns {Promise<Recovery>} a recovery object
     */
    findRecoveryById(recoveryId: string): Promise<Recovery | null>;
    /**
     * Function that finds a recovery object in the databse based on it's unique recoveryLink
     * @param recoveryLink - unique recovery link that can be only once in the database
     * @returns {Promise<Recovery>} a recovery object
     */
    findRecoveryByToken(recoveryLink: string): Promise<Recovery | null>;
    static getInstance(): AdminServer;
}
//# sourceMappingURL=server.d.ts.map