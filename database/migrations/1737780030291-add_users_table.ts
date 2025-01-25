import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersTable1737780030291 implements MigrationInterface {
    name = 'AddUsersTable1737780030291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` varchar(36) NOT NULL,
                \`first_name\` varchar(50) NULL,
                \`last_name\` varchar(50) NULL,
                \`username\` varchar(255) NOT NULL,
                \`email\` varchar(255) NULL,
                \`phone_number\` varchar(15) NULL,
                \`password\` varchar(60) NOT NULL,
                \`avatar\` varchar(255) NULL,
                \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active',
                \`email_verified_at\` timestamp NULL,
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`),
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                UNIQUE INDEX \`IDX_17d1817f241f10a3dbafb169fd\` (\`phone_number\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_17d1817f241f10a3dbafb169fd\` ON \`users\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users\`
        `);
    }

}
