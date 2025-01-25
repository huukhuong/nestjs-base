import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationTables1737786739772 implements MigrationInterface {
    name = 'AddLocationTables1737786739772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`administrative_regions\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`name_en\` varchar(255) NOT NULL,
                \`code_name\` varchar(255) NULL,
                \`code_name_en\` varchar(255) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`districts\` (
                \`code\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`name_en\` varchar(255) NULL,
                \`full_name\` varchar(255) NULL,
                \`full_name_en\` varchar(255) NULL,
                \`code_name\` varchar(255) NULL,
                \`province\` varchar(255) NULL,
                \`administrative_unit\` int NULL,
                PRIMARY KEY (\`code\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`provinces\` (
                \`code\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`name_en\` varchar(255) NULL,
                \`full_name\` varchar(255) NOT NULL,
                \`full_name_en\` varchar(255) NULL,
                \`code_name\` varchar(255) NULL,
                \`administrative_unit\` int NULL,
                \`administrative_region\` int NULL,
                PRIMARY KEY (\`code\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`administrative_units\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`full_name\` varchar(255) NULL,
                \`full_name_en\` varchar(255) NULL,
                \`short_name\` varchar(255) NULL,
                \`short_name_en\` varchar(255) NULL,
                \`code_name\` varchar(255) NULL,
                \`code_name_en\` varchar(255) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`wards\` (
                \`code\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`name_en\` varchar(255) NULL,
                \`full_name\` varchar(255) NULL,
                \`full_name_en\` varchar(255) NULL,
                \`code_name\` varchar(255) NULL,
                \`district\` varchar(255) NULL,
                \`administrative_unit\` int NULL,
                PRIMARY KEY (\`code\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`districts\`
            ADD CONSTRAINT \`FK_b4bd10f0aa0bec83ddea56f15f4\` FOREIGN KEY (\`province\`) REFERENCES \`provinces\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`districts\`
            ADD CONSTRAINT \`FK_5fa99f12915ba65a904d58eef62\` FOREIGN KEY (\`administrative_unit\`) REFERENCES \`administrative_units\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`provinces\`
            ADD CONSTRAINT \`FK_740f89661d136c0592dc654b5e7\` FOREIGN KEY (\`administrative_unit\`) REFERENCES \`administrative_units\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`provinces\`
            ADD CONSTRAINT \`FK_70e2e735f43097f0f6ea4874870\` FOREIGN KEY (\`administrative_region\`) REFERENCES \`administrative_regions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`wards\`
            ADD CONSTRAINT \`FK_75ec022e019c20583d7319725c7\` FOREIGN KEY (\`district\`) REFERENCES \`districts\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`wards\`
            ADD CONSTRAINT \`FK_8d67793a6363bbfa1448372f463\` FOREIGN KEY (\`administrative_unit\`) REFERENCES \`administrative_units\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`wards\` DROP FOREIGN KEY \`FK_8d67793a6363bbfa1448372f463\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`wards\` DROP FOREIGN KEY \`FK_75ec022e019c20583d7319725c7\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`provinces\` DROP FOREIGN KEY \`FK_70e2e735f43097f0f6ea4874870\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`provinces\` DROP FOREIGN KEY \`FK_740f89661d136c0592dc654b5e7\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`districts\` DROP FOREIGN KEY \`FK_5fa99f12915ba65a904d58eef62\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`districts\` DROP FOREIGN KEY \`FK_b4bd10f0aa0bec83ddea56f15f4\`
        `);
        await queryRunner.query(`
            DROP TABLE \`wards\`
        `);
        await queryRunner.query(`
            DROP TABLE \`administrative_units\`
        `);
        await queryRunner.query(`
            DROP TABLE \`provinces\`
        `);
        await queryRunner.query(`
            DROP TABLE \`districts\`
        `);
        await queryRunner.query(`
            DROP TABLE \`administrative_regions\`
        `);
    }

}
