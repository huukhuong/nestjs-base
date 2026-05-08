import { DataSource } from 'typeorm';
import { hash } from 'bcrypt';
import { RoleEntity, UserRoleEntity } from 'src/rbac';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserStatus } from 'src/user/entities/user-status.enum';

export async function superAdminSeeder(dataSource: DataSource): Promise<void> {
  const roleCode = 'SUPER_ADMIN';
  const roleName = 'Super Administrator';

  const superAdminEmail = 'superadmin@example.com';
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
  const superAdminUsername = 'superadmin';
  const superAdminFirstName = 'Super';
  const superAdminLastName = 'Admin';

  if (!superAdminEmail || !superAdminPassword) {
    throw new Error(
      'SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required for seeding.',
    );
  }

  const hashRounds = Number(process.env.HASH_ROUNDS || 12);
  const hashedPassword = await hash(superAdminPassword, hashRounds);

  const roleRepository = dataSource.getRepository(RoleEntity);
  const userRepository = dataSource.getRepository(UserEntity);
  const userRoleRepository = dataSource.getRepository(UserRoleEntity);

  let role = await roleRepository.findOne({ where: { code: roleCode } });
  if (!role) {
    role = await roleRepository.save(
      roleRepository.create({ code: roleCode, name: roleName }),
    );
  }

  let user = await userRepository.findOne({
    where: [{ email: superAdminEmail }, { username: superAdminUsername }],
  });
  if (!user) {
    user = await userRepository.save(
      userRepository.create({
        firstName: superAdminFirstName,
        lastName: superAdminLastName,
        username: superAdminUsername,
        email: superAdminEmail,
        password: hashedPassword,
        status: UserStatus.ACTIVE,
      }),
    );
  }

  const existingUserRole = await userRoleRepository.findOne({
    where: { userId: user.id, roleId: role.id },
  });
  if (!existingUserRole) {
    await userRoleRepository.save(
      userRoleRepository.create({
        userId: user.id,
        roleId: role.id,
      }),
    );
  }
}
