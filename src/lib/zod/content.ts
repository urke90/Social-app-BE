import { EContentTypeLowercase } from '@/types/content';
import { EContentType } from '@prisma/client';
import z from 'zod';

// ----------------------------------------------------------------

/**
 * ! COMMON
 * 1. title: string; DA
 * 2. type: 'POST'| 'POST' | 'PODCAST'; DA
 * 3. groupId: id DA
 * 4. coverImage: string;
 * 5. description: string;
 * 6. tags: string[];
 */

/**
 * ! SPECIFIC
 * 1. meetupLocation: string
 * ! 2.  meetupCordinates ===> yet to see { lat: number, lng: number }???
 * 3. meetupDate: Date
 * 4. podcastFile : File ===> just url to the cloudinary file
 * 5. podcastTitle: string
 * 6. viewsCount: number;
 * 7. likesCount: number;
 * 8. commentsCount: number;
 * 9. comments: IContent
 */

/**
 * CONTENT CREATE
 * ruta za search grupe, fitler je na BE, implementirati debouncing na FE
 */

/**
 * GROUPS CREATE
 */

export const contentTypeSchema = z.object({
  type: z.nativeEnum(EContentTypeLowercase),
});

export const allContentQuerySchema = z.object({
  type: z.enum(['post', 'meetup', 'podcast']),
  page: z.string().optional(),
});

export const commentsSchema = z.object({
  id: z
    .string()
    .trim()
    .uuid('ID must be unique and uuid')
    .length(36, 'ID must be exactly 36 characters long!'),
  text: z
    .string()
    .trim()
    .min(3, 'Comments must be at least 3 characters long!'),
  createdAt: z.string().date('Created at date is required!'),
  updatedAt: z.string().date('Updated at date is required!'),
  authorId: z
    .string()
    .trim()
    .uuid('ID must be unique and uuid')
    .length(36, 'ID must be exactly 36 characters long!'),
  contentId: z
    .string()
    .trim()
    .uuid('ID must be unique and uuid')
    .length(36, 'ID must be exactly 36 characters long!'),
});

/***************************************************************** CREATE ***********************************************************/

const contentCreateBaseSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters long!'),
  groupId: z
    .string()
    .trim()
    .uuid('ID must be unique and uuid')
    .length(36, 'ID must be exactly 36 characters long!'),
  authorId: z
    .string()
    .trim()
    .uuid('ID must be unique and uuid')
    .length(36, 'ID must be exactly 36 characters long!'),
  description: z
    .string()
    .trim()
    .min(3, 'Description must be at least 3 characters long!'),
  coverImage: z.string().trim().url().optional(),
  tags: z.array(z.string().min(1, 'Tag must be at least 1 character long!')),
  comments: z.array(commentsSchema).optional(),
});

export const createPostSchema = contentCreateBaseSchema.extend({
  type: z.literal(EContentType.POST),
});

export const createMeetupSchema = contentCreateBaseSchema.extend({
  type: z.literal(EContentType.MEETUP),
  meetupLocation: z
    .string()
    .trim()
    .min(3, 'Location must be at least 3 characters long!'),
  meetupLocationImage: z.string().trim().url().optional(),
  meetupDate: z.coerce.date({
    required_error: 'Date is required!',
    invalid_type_error: 'Invalid date format!',
  }),
});

export const createPodcastSchema = contentCreateBaseSchema.extend({
  type: z.literal(EContentType.PODCAST),
  podcastFile: z.string().trim().url('Please provide valid URL!'),
  podcastTitle: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters long!'),
});

/***************************************************************** CREATE ***********************************************************/

/***************************************************************** UPDATE ***********************************************************/
const contentUpdateBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters long!')
    .optional(),
  description: z
    .string()
    .trim()
    .min(3, 'Description must be at least 3 characters long!')
    .optional(),
  coverImage: z.string().trim().url().optional(),
  tags: z
    .array(z.string().min(1, 'Tag must be at least 1 character long!'))
    .optional(),
  comments: z.array(commentsSchema).optional(),
});
export const updatePostSchema = contentUpdateBaseSchema.extend({});

export const updateMeetupSchema = contentUpdateBaseSchema.extend({
  meetupLocation: z
    .string()
    .trim()
    .min(3, 'Location must be at least 3 characters long!')
    .optional(),
  meetupLocationImage: z.string().trim().url().optional(),
  meetupDate: z.coerce
    .date({
      required_error: 'Date is required!',
      invalid_type_error: 'Invalid date format!',
    })
    .optional(),
});

export const updatePodcastSchema = contentUpdateBaseSchema.extend({
  podcastFile: z.string().trim().url('Please provide valid URL!').optional(),
  podcastTitle: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters long!')
    .optional(),
});