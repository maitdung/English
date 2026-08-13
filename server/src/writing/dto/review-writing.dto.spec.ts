import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CourseLevel } from '../../../generated/prisma/client';
import { ReviewWritingDto, WritingTaskType } from './review-writing.dto';

const validBody = {
  consent: true,
  taskType: WritingTaskType.GENERAL,
  level: CourseLevel.A2,
  content: 'Learning English helps me communicate with people everywhere.',
};

describe('ReviewWritingDto', () => {
  it('accepts only explicit boolean consent', async () => {
    const dto = plainToInstance(ReviewWritingDto, validBody);

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it.each([
    ['missing', undefined],
    ['false', false],
    ['string true', 'true'],
  ])('rejects %s consent', async (_label, consent) => {
    const body = { ...validBody, consent };
    const dto = plainToInstance(ReviewWritingDto, body);
    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'consent')).toBe(true);
  });
});
