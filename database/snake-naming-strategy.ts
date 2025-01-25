import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

export class SnakeNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
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
      (letter) => `_${letter.toLowerCase()}`,
    );

    if (snakeCaseName.startsWith('_')) {
      snakeCaseName = snakeCaseName.substring(1);
    }

    if (snakeCaseName.endsWith('_')) {
      snakeCaseName = snakeCaseName.slice(0, -1);
    }

    return snakeCaseName;
  }
}
