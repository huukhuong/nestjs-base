import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

export class SnakeNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  tableName(className: string, customName: string): string {
    if (customName) {
      return customName;
    }
    const snakeCase = this.camelToSnakeCase(className);
    return this.pluralize(snakeCase);
  }

  columnName(propertyName: string): string {
    return this.camelToSnakeCase(propertyName);
  }

  columnNameCustomized(propertyName: string): string {
    return this.camelToSnakeCase(propertyName);
  }

  relationName(propertyName: string): string {
    return this.camelToSnakeCase(propertyName);
  }

  camelToSnakeCase(str: string): string {
    let snakeCaseName = str.replace(
      /[A-Z]/g,
      letter => `_${letter.toLowerCase()}`,
    );

    if (snakeCaseName.startsWith('_')) {
      snakeCaseName = snakeCaseName.substring(1);
    }

    if (snakeCaseName.endsWith('_')) {
      snakeCaseName = snakeCaseName.slice(0, -1);
    }

    return snakeCaseName;
  }

  private pluralize(str: string): string {
    // Simple pluralization rules
    if (str.endsWith('y')) {
      return str.slice(0, -1) + 'ies';
    }
    if (
      str.endsWith('s') ||
      str.endsWith('x') ||
      str.endsWith('z') ||
      str.endsWith('ch') ||
      str.endsWith('sh')
    ) {
      return str + 'es';
    }
    return str + 's';
  }
}
