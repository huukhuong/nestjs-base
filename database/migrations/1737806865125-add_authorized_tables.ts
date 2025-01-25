import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuthorizedTables1737806865125 implements MigrationInterface {
    name = 'AddAuthorizedTables1737806865125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`permission_groups\` (
                \`id\` varchar(36) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`permissions\` (
                \`id\` varchar(36) NOT NULL,
                \`code\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`group\` varchar(36) NULL,
                UNIQUE INDEX \`IDX_8dad765629e83229da6feda1c1\` (\`code\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`roles\` (
                \`id\` varchar(36) NOT NULL,
                \`code\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                UNIQUE INDEX \`IDX_f6d54f95c31b73fb1bdd8e91d0\` (\`code\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`roles_permissions\` (
                \`role_id\` varchar(36) NOT NULL,
                \`permission_id\` varchar(36) NOT NULL,
                INDEX \`IDX_7d2dad9f14eddeb09c256fea71\` (\`role_id\`),
                INDEX \`IDX_337aa8dba227a1fe6b73998307\` (\`permission_id\`),
                PRIMARY KEY (\`role_id\`, \`permission_id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`roles_users\` (
                \`user_id\` varchar(36) NOT NULL,
                \`role_id\` varchar(36) NOT NULL,
                INDEX \`IDX_fe845889e03e87003e6d9a06ca\` (\`user_id\`),
                INDEX \`IDX_de502d3ca59c0bfd32fa882939\` (\`role_id\`),
                PRIMARY KEY (\`user_id\`, \`role_id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`permissions\`
            ADD CONSTRAINT \`FK_2ef772d7a97c084ec1ed17954c0\` FOREIGN KEY (\`group\`) REFERENCES \`permission_groups\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles_permissions\`
            ADD CONSTRAINT \`FK_7d2dad9f14eddeb09c256fea719\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles_permissions\`
            ADD CONSTRAINT \`FK_337aa8dba227a1fe6b73998307b\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles_users\`
            ADD CONSTRAINT \`FK_fe845889e03e87003e6d9a06caa\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles_users\`
            ADD CONSTRAINT \`FK_de502d3ca59c0bfd32fa8829393\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`roles_users\` DROP FOREIGN KEY \`FK_de502d3ca59c0bfd32fa8829393\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles_users\` DROP FOREIGN KEY \`FK_fe845889e03e87003e6d9a06caa\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles_permissions\` DROP FOREIGN KEY \`FK_337aa8dba227a1fe6b73998307b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`roles_permissions\` DROP FOREIGN KEY \`FK_7d2dad9f14eddeb09c256fea719\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`permissions\` DROP FOREIGN KEY \`FK_2ef772d7a97c084ec1ed17954c0\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_de502d3ca59c0bfd32fa882939\` ON \`roles_users\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_fe845889e03e87003e6d9a06ca\` ON \`roles_users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`roles_users\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_337aa8dba227a1fe6b73998307\` ON \`roles_permissions\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_7d2dad9f14eddeb09c256fea71\` ON \`roles_permissions\`
        `);
        await queryRunner.query(`
            DROP TABLE \`roles_permissions\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_f6d54f95c31b73fb1bdd8e91d0\` ON \`roles\`
        `);
        await queryRunner.query(`
            DROP TABLE \`roles\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_8dad765629e83229da6feda1c1\` ON \`permissions\`
        `);
        await queryRunner.query(`
            DROP TABLE \`permissions\`
        `);
        await queryRunner.query(`
            DROP TABLE \`permission_groups\`
        `);
    }

}
