
import 'express';
    declare global {
      namespace Express {
        interface Request {
          user?: {
             id: string;
             firstname:string;
             lastname:string
              email: string;
           };
        }
      }
    }
    export {}