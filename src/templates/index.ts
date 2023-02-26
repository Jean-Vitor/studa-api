import * as fs from 'fs';
import * as handlebars from 'handlebars';
import path from 'path';

export enum TemplateKey {
  CONFIRMATION_TOKEN = 'CONFIRMATION_TOKEN'
}

const templatesMap = new Map<TemplateKey, string>();

templatesMap.set(TemplateKey.CONFIRMATION_TOKEN, path.resolve('./src/templates/html/confirmationToken.hbs'));

export default function renderTemplate(templateKey: TemplateKey, data: any): string {
  try {
    const templatePath = templatesMap.get(templateKey)!;
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);
    return template(data);
  } catch (e) {
    console.error(e)
    throw e;
  }
};
