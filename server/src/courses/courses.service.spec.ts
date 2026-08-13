import { NotFoundException } from '@nestjs/common';

import { ExerciseType, Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CoursesService } from './courses.service';

type ExerciseDelegateMock = {
  findFirst: jest.Mock;
};

type ExerciseRecord = {
  type: ExerciseType;
  options: Prisma.JsonValue;
  correctAnswer: Prisma.JsonValue;
  explanation: string | null;
  points: number;
};

describe('CoursesService checkExercise', () => {
  let service: CoursesService;
  let exerciseDelegate: ExerciseDelegateMock;

  beforeEach(() => {
    exerciseDelegate = {
      findFirst: jest.fn(),
    };
    service = new CoursesService({
      exercise: exerciseDelegate,
    } as unknown as PrismaService);
  });

  function mockExercise(overrides: Partial<ExerciseRecord> = {}): void {
    exerciseDelegate.findFirst.mockResolvedValue({
      type: ExerciseType.MULTIPLE_CHOICE,
      options: ['Hello', 'Goodbye', 'Thank you'],
      correctAnswer: 0,
      explanation: 'Hello is the correct greeting.',
      points: 10,
      ...overrides,
    });
  }

  it('accepts an option index when content stores a numeric multiple-choice answer', async () => {
    mockExercise();

    const result = await service.checkExercise(
      'english-a1-foundations',
      'greetings-and-introductions',
      'exercise-1',
      0,
    );

    expect(result).toEqual({
      isCorrect: true,
      correctAnswer: 0,
      explanation: 'Hello is the correct greeting.',
      pointsEarned: 10,
      maxPoints: 10,
    });
  });

  it('maps a submitted option index to legacy content that stores the option text', async () => {
    mockExercise({
      options: ['destination', 'passport', 'flight', 'aisle'],
      correctAnswer: 'passport',
      points: 2,
    });

    const result = await service.checkExercise(
      'english-a1-foundations',
      'travel-and-airport',
      'exercise-2',
      1,
    );

    expect(result).toMatchObject({
      isCorrect: true,
      correctAnswer: 'passport',
      pointsEarned: 2,
      maxPoints: 2,
    });
  });

  it('also accepts option text for numeric multiple-choice content', async () => {
    mockExercise({
      options: ['Hello', 'Goodbye', 'Thank you'],
      correctAnswer: 0,
    });

    const result = await service.checkExercise(
      'english-a1-foundations',
      'greetings-and-introductions',
      'exercise-3',
      '  HELLO ',
    );

    expect(result.isCorrect).toBe(true);
  });

  it('normalizes ordered sentence answers without changing word order', async () => {
    mockExercise({
      type: ExerciseType.SENTENCE_ORDER,
      options: ['What', 'time', 'did', 'the', 'plane', 'land', '?'],
      correctAnswer: 'What time did the plane land ?',
    });

    const correctResult = await service.checkExercise(
      'english-a1-foundations',
      'travel-and-airport',
      'exercise-4',
      '  what time did the plane land? ',
    );
    const incorrectResult = await service.checkExercise(
      'english-a1-foundations',
      'travel-and-airport',
      'exercise-4',
      'the plane did land what time?',
    );

    expect(correctResult.isCorrect).toBe(true);
    expect(incorrectResult.isCorrect).toBe(false);
  });

  it('accepts string-array ordering content when the learner submits a sentence', async () => {
    mockExercise({
      type: ExerciseType.SENTENCE_ORDER,
      options: ['Can', 'you', 'help', 'me', 'please'],
      correctAnswer: ['Can', 'you', 'help', 'me', 'please'],
    });

    const result = await service.checkExercise(
      'english-a1-foundations',
      'everyday-requests',
      'exercise-5',
      'can   you help me please',
    );

    expect(result.isCorrect).toBe(true);
  });

  it('scopes the exercise lookup to the published course and lesson', async () => {
    mockExercise();

    await service.checkExercise(
      'english-a1-foundations',
      'greetings-and-introductions',
      'exercise-6',
      0,
    );

    expect(exerciseDelegate.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'exercise-6',
        lesson: {
          slug: 'greetings-and-introductions',
          unit: {
            course: {
              slug: 'english-a1-foundations',
              status: 'PUBLISHED',
            },
          },
        },
      },
      select: {
        type: true,
        options: true,
        correctAnswer: true,
        explanation: true,
        points: true,
      },
    });
  });

  it('rejects an exercise outside the requested published lesson', async () => {
    exerciseDelegate.findFirst.mockResolvedValue(null);

    await expect(
      service.checkExercise(
        'english-a1-foundations',
        'missing-lesson',
        'missing-exercise',
        0,
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
