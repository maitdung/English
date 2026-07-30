import { CourseLevel, CourseStatus } from '../../../generated/prisma/client';

export const a1CourseMetadata = {
  slug: 'english-a1-complete',
  title: 'English A1 Complete Course',
  shortDescription:
    'Giáo trình tiếng Anh A1 toàn diện với từ vựng, ngữ pháp và bốn kỹ năng.',
  description:
    'Khóa học tiếng Anh A1 được xây dựng theo lộ trình từ cơ bản đến hoàn thành trình độ A1. Người học luyện từ vựng, ngữ pháp, hội thoại, nghe, nói, đọc, viết và bài tập ôn tập theo từng unit.',
  level: CourseLevel.A1,
  status: CourseStatus.PUBLISHED,
  estimatedHours: 90,
} as const;
