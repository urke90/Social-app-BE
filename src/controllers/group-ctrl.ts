import { Prisma, prisma } from '@/database/prisma-client';
import { idSchema } from '@/lib/zod/content';

import {
  createGroupSchema,
  groupNameQuery,
  updateGroupSchema,
} from '@/lib/zod/group';
import { Role } from '@prisma/client';
import type { Response } from 'express';
import type {
  TypedRequest,
  TypedRequestBody,
  TypedRequestQuery,
} from 'zod-express-middleware';

// ----------------------------------------------------------------

/**
 * SOLITIONS
 * 1. SQL radio bih 2 inster inot
 * 2. napravitit custom ID i  2 insert-a sa tim ID
 * 3. Napraviti query za create Group pa korisiti dalje created group id za novi crate
 * U OBA SLUCAJA KORISTITI TRANSAKCIJU
 */

export const createGroup = async (
  req: TypedRequestBody<typeof createGroupSchema>,
  res: Response
) => {
  const { authorId, members, name, bio, coverImage, profileImage } = req.body;
  // const groupId = uuidv4();

  const newMembers =
    members?.filter((member) => member.userId !== authorId) || [];

  try {
    const newGroup = await prisma.group.create({
      data: {
        authorId,
        name,
        coverImage,
        profileImage,
        bio,
        members: {
          create: [...newMembers, { userId: authorId, role: Role.ADMIN }],
        },
      },
    });

    res.status(201).json({ group: newGroup });
  } catch (error) {
    console.log('Error creating group', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        res.status(400).json({ message: 'Invalid author ID' });
      }
    }
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const updateGroup = async (
  req: TypedRequest<typeof idSchema, any, typeof updateGroupSchema>,
  res: Response
) => {
  const id = req.params.id;
  const { bio, coverImage, members, name, profileImage } = req.body;

  try {
    const updatedGroup = await prisma.group.update({
      where: {
        id,
      },
      data: {
        name,
        profileImage,
        coverImage,
        bio,
        members: {
          deleteMany: {},
          create: members,
        },
      },
    });

    console.log('updatedGroup', updatedGroup);

    res.status(200).json({ group: updatedGroup });
  } catch (error) {
    console.log('Error updating group', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        res.status(400).json({ message: 'Invalid author ID' });
      }
    }
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const getGroups = async (
  req: TypedRequestQuery<typeof groupNameQuery>,
  res: Response
) => {
  // ? DA LI IMA POTREBE DA  TRIM-ujemo VREDNOST ???
  const name = req.query.name;

  try {
    const groups = await prisma.group.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
    console.log('groups', groups);
    const modifiedGroups = groups.map(({ id, name, bio, profileImage }) => ({
      id,
      name,
      profileImage,
      bio,
    }));

    res.status(200).json({ groups: modifiedGroups });
  } catch (error) {
    console.log('Error getting groups', error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};
