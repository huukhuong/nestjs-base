import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixRbacJoinFk1778482614321 implements MigrationInterface {
  name = 'FixRbacJoinFk1778482614321';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      DROP CONSTRAINT "FK_0833863bd542bea8424bdb983ed"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      DROP CONSTRAINT "FK_79db14d906a31d97687f5ae1635"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      DROP CONSTRAINT "FK_781a1c15149789c1609fe1b0258"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      DROP CONSTRAINT "FK_0475850442d60bd704c58041551"
    `);
    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      DROP CONSTRAINT "FK_5d5086bd299f773d403574cf1c8"
    `);
    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      DROP CONSTRAINT "FK_0ab5175ebb91e7a07f850acf42e"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      DROP COLUMN "user"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      DROP COLUMN "permission"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      DROP COLUMN "user"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      DROP COLUMN "role"
    `);
    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      DROP COLUMN "role"
    `);
    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      DROP COLUMN "permission"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      ADD CONSTRAINT "FK_3495bd31f1862d02931e8e8d2e8" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      ADD CONSTRAINT "FK_8145f5fadacd311693c15e41f10" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"
    `);
    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      DROP CONSTRAINT "FK_8145f5fadacd311693c15e41f10"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      DROP CONSTRAINT "FK_3495bd31f1862d02931e8e8d2e8"
    `);
    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      ADD "permission" uuid
    `);
    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      ADD "role" uuid
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      ADD "role" uuid
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      ADD "user" uuid
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      ADD "permission" uuid
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      ADD "user" uuid
    `);
    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      ADD CONSTRAINT "FK_0ab5175ebb91e7a07f850acf42e" FOREIGN KEY ("permission") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      ADD CONSTRAINT "FK_5d5086bd299f773d403574cf1c8" FOREIGN KEY ("role") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      ADD CONSTRAINT "FK_0475850442d60bd704c58041551" FOREIGN KEY ("role") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      ADD CONSTRAINT "FK_781a1c15149789c1609fe1b0258" FOREIGN KEY ("user") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      ADD CONSTRAINT "FK_79db14d906a31d97687f5ae1635" FOREIGN KEY ("permission") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      ADD CONSTRAINT "FK_0833863bd542bea8424bdb983ed" FOREIGN KEY ("user") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }
}
