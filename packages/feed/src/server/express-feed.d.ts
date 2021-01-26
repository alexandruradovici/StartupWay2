import { Feed } from "../share/entities";

declare module 'express-serve-static-core' {
   export interface Request {
      feed: Feed[],
   }
}