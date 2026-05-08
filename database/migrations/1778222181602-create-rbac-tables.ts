import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRbacTables1778222181602 implements MigrationInterface {
  name = 'CreateRbacTables1778222181602';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4 (),
        "code" character varying(100) NOT NULL,
        "name" character varying(255) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_f6d54f95c31b73fb1bdd8e91d0" ON "roles" ("code")`,
    );
    await queryRunner.query(`
      CREATE TABLE "user_roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4 (),
        "user_id" uuid NOT NULL,
        "role_id" uuid NOT NULL,
        "user" uuid,
        "role" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_23ed6f04fe43066df08379fd03" ON "user_roles" ("user_id", "role_id")`,
    );
    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4 (),
        "code" character varying(150) NOT NULL,
        "name" character varying(255) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8dad765629e83229da6feda1c1" ON "permissions" ("code")`,
    );
    await queryRunner.query(`
      CREATE TABLE "user_permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4 (),
        "user_id" uuid NOT NULL,
        "permission_id" uuid NOT NULL,
        "user" uuid,
        "permission" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_01f4295968ba33d73926684264f" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a537c48b1f80e8626a71cb5658" ON "user_permissions" ("user_id", "permission_id")`,
    );
    await queryRunner.query(`
      CREATE TABLE "role_permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4 (),
        "role_id" uuid NOT NULL,
        "permission_id" uuid NOT NULL,
        "role" uuid,
        "permission" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_25d24010f53bb80b78e412c965" ON "role_permissions" ("role_id", "permission_id")`,
    );
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      ADD CONSTRAINT "FK_781a1c15149789c1609fe1b0258" FOREIGN KEY ("user") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      ADD CONSTRAINT "FK_0475850442d60bd704c58041551" FOREIGN KEY ("role") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      ADD CONSTRAINT "FK_0833863bd542bea8424bdb983ed" FOREIGN KEY ("user") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      ADD CONSTRAINT "FK_79db14d906a31d97687f5ae1635" FOREIGN KEY ("permission") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      ADD CONSTRAINT "FK_5d5086bd299f773d403574cf1c8" FOREIGN KEY ("role") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      ADD CONSTRAINT "FK_0ab5175ebb91e7a07f850acf42e" FOREIGN KEY ("permission") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      DROP CONSTRAINT "FK_0ab5175ebb91e7a07f850acf42e"
    `);
    await queryRunner.query(`
      ALTER TABLE "role_permissions"
      DROP CONSTRAINT "FK_5d5086bd299f773d403574cf1c8"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      DROP CONSTRAINT "FK_79db14d906a31d97687f5ae1635"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permissions"
      DROP CONSTRAINT "FK_0833863bd542bea8424bdb983ed"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      DROP CONSTRAINT "FK_0475850442d60bd704c58041551"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_roles"
      DROP CONSTRAINT "FK_781a1c15149789c1609fe1b0258"
    `);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_25d24010f53bb80b78e412c965"`,
    );
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a537c48b1f80e8626a71cb5658"`,
    );
    await queryRunner.query(`DROP TABLE "user_permissions"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8dad765629e83229da6feda1c1"`,
    );
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_23ed6f04fe43066df08379fd03"`,
    );
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f6d54f95c31b73fb1bdd8e91d0"`,
    );
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
