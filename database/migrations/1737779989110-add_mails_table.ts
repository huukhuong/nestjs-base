import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMailsTable1737779989110 implements MigrationInterface {
    name = 'AddMailsTable1737779989110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`mails\` (
                \`id\` varchar(36) NOT NULL,
                \`recipient\` varchar(255) NOT NULL,
                \`subject\` varchar(255) NOT NULL,
                \`content\` varchar(255) NOT NULL,
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`mails\`
        `);
    }

}
