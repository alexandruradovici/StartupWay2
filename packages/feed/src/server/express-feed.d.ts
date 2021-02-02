import { Feed } from "../common/";

declare module 'express-serve-static-core' {
   export interface Request {
      feed: Feed[],
   }
}