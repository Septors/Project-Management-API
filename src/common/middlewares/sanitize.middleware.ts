import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import type {
  Request as ExRequest,
  Response as ExResponse,
  NextFunction as ExNextFunction,
} from 'express-serve-static-core';

const sanitizeHtml = require('sanitize-html');

type Request = ExRequest;
type Response = ExResponse;
type NextFunction = ExNextFunction;

@Injectable()
export class SanitizeMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SanitizeMiddleware.name);
  private readonly htmlWhitelistFields = ['description', 'title', 'name'];

  use(req: Request, res: Response, next: NextFunction) {
    try {
  
      if (req.body !== undefined) {
        req.body = this.sanitizeObject(req.body);
      }


      if (req.query && typeof req.query === 'object') {
        for (const key of Object.keys(req.query)) {

          req.query[key] = this.sanitizeObject(req.query[key], key);
        }
      }


      if (req.params && typeof req.params === 'object') {
        for (const key of Object.keys(req.params)) {
          req.params[key] = this.sanitizeObject(req.params[key], key);
        }
      }
    } catch (err) {

      this.logger.error('SanitizeMiddleware failed, skipping sanitize for this request', err as any);
    }

    next();
  }

  private sanitizeObject(obj: any, parentKey?: string): any {
    if (obj === null || obj === undefined) return obj;

    if (typeof obj === 'string') {
      return this.cleanString(obj, parentKey);
    }

    if (typeof obj === 'number' || typeof obj === 'boolean') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item, parentKey));
    }

    if (typeof obj === 'object') {
      const cleaned: any = {};
      for (const key of Object.keys(obj)) {
        cleaned[key] = this.sanitizeObject(obj[key], key);
      }
      return cleaned;
    }

    return obj;
  }

  private cleanString(str: string, fieldName?: string): string {
    const opts = this.htmlWhitelistFields.includes(fieldName ?? '')
      ? {
          allowedTags: ['b', 'i', 'strong', 'em', 'ul', 'ol', 'li'],
          allowedAttributes: {},
          textFilter: (text: string) => text.replace(/\s+/g, ' '),
        }
      : {
          allowedTags: [],
          allowedAttributes: {},
          textFilter: (text: string) => text.replace(/\s+/g, ' '),
        };

    try {
      return sanitizeHtml(str, opts).trim();
    } catch (e) {
      this.logger.warn(`sanitizeHtml threw for field "${fieldName}", returning original string`, (e as any));
      return str;
    }
  }
}
