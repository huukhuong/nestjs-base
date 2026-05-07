import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import Handlebars from 'handlebars';
import { BadRequestException } from 'src/common/exceptions';

@Injectable()
export class MailTemplateService {
  assertTemplateExists(templateName: string) {
    const normalizedTemplateName = this.normalizeTemplateName(templateName);
    const templatePath = this.resolveTemplatePath(normalizedTemplateName);
    if (!templatePath) {
      throw new BadRequestException({
        message: `Template "${normalizedTemplateName}" not found`,
      });
    }
  }

  renderTemplate(templateName: string, variables: Record<string, unknown>) {
    const normalizedTemplateName = this.normalizeTemplateName(templateName);
    const templatePath = this.resolveTemplatePath(normalizedTemplateName);
    if (!templatePath) {
      throw new BadRequestException({
        message: `Template "${normalizedTemplateName}" not found`,
      });
    }

    const source = readFileSync(templatePath, 'utf8');
    const compiled = Handlebars.compile(source);
    return compiled(variables);
  }

  private normalizeTemplateName(templateName: string): string {
    const normalizedTemplateName = templateName.trim();
    if (!/^[a-zA-Z0-9/_-]+$/.test(normalizedTemplateName)) {
      throw new BadRequestException({
        message: 'Invalid template name',
      });
    }

    return normalizedTemplateName;
  }

  private resolveTemplatePath(templateName: string): string | null {
    const templateFile = `${templateName}.hbs`;
    const candidates = [
      join(process.cwd(), 'dist/src/mail/templates', templateFile),
      join(process.cwd(), 'src/mail/templates', templateFile),
    ];

    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        return candidate;
      }
    }

    return null;
  }
}
