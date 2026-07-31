import { Injectable, NotFoundException } from '@nestjs/common';

import { CourseStatus, ProgressStatus } from '../../generated/prisma/client';
import { CoursesService } from '../courses/courses.service';
import { PrismaService } from '../prisma/prisma.service';

function startOfDay(date = new Date()): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0,
  );
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return startOfDay(nextDate);
}

@Injectable()
export class LearningProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coursesService: CoursesService,
  ) {}

  async getMe(userId: string) {
    const [
      enrollments,
      lessonProgress,
      exerciseAttempts,
      dailyActivity,
      vocabularyReviews,
    ] = await Promise.all([
      this.prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            select: {
              id: true,
              slug: true,
              title: true,
              level: true,
              status: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.lessonProgress.findMany({
        where: { userId },
        include: {
          lesson: {
            select: {
              id: true,
              slug: true,
              title: true,
              type: true,
              durationMinutes: true,
              unit: {
                select: {
                  course: {
                    select: {
                      id: true,
                      slug: true,
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.exerciseAttempt.findMany({
        where: { userId },
        orderBy: { submittedAt: 'desc' },
        take: 50,
      }),
      this.prisma.dailyLearningActivity.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 60,
      }),
      this.prisma.vocabularyReview.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 100,
      }),
    ]);

    const streakDays = this.calculateStreak(dailyActivity);
    const totalMinutes = dailyActivity.reduce(
      (total, item) => total + item.minutes,
      0,
    );
    const completedLessons = lessonProgress.filter(
      (item) => item.status === ProgressStatus.COMPLETED,
    ).length;
    const inProgressLessons = lessonProgress.filter(
      (item) => item.status === ProgressStatus.IN_PROGRESS,
    ).length;
    const completedEnrollments = enrollments.filter(
      (item) => item.completedAt !== null,
    ).length;
    const quizHighScore = exerciseAttempts.reduce(
      (best, attempt) => Math.max(best, attempt.score),
      0,
    );

    return {
      streakDays,
      totalMinutes,
      quizHighScore,
      completedLessons,
      inProgressLessons,
      completedEnrollments,
      enrollmentCount: enrollments.length,
      lessonProgressCount: lessonProgress.length,
      exerciseAttemptCount: exerciseAttempts.length,
      vocabularyReviewCount: vocabularyReviews.length,
      enrollments,
      lessonProgress,
      exerciseAttempts,
      dailyActivity,
      vocabularyReviews,
    };
  }

  async enrollCourse(userId: string, courseSlug: string) {
    const course = await this.prisma.course.findFirst({
      where: {
        slug: courseSlug,
        status: CourseStatus.PUBLISHED,
      },
      select: {
        id: true,
        slug: true,
        title: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Không tìm thấy khóa học.');
    }

    return this.prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
      create: {
        userId,
        courseId: course.id,
        progressPercent: 0,
        lastAccessedAt: new Date(),
      },
      update: {
        lastAccessedAt: new Date(),
      },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            level: true,
            status: true,
          },
        },
      },
    });
  }

  async completeLesson(
    userId: string,
    courseSlug: string,
    lessonSlug: string,
    payload: {
      progressPercent?: number;
      score?: number;
      timeSpentMinutes?: number;
    },
  ) {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        slug: lessonSlug,
        unit: {
          course: {
            slug: courseSlug,
            status: CourseStatus.PUBLISHED,
          },
        },
      },
      select: {
        id: true,
        unit: {
          select: {
            courseId: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài học.');
    }

    const lessonProgress = await this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: lesson.id,
        },
      },
      create: {
        userId,
        lessonId: lesson.id,
        status: ProgressStatus.COMPLETED,
        progressPercent: payload.progressPercent ?? 100,
        bestScore: payload.score ?? null,
        lastScore: payload.score ?? null,
        timeSpentMinutes: payload.timeSpentMinutes ?? 0,
        startedAt: new Date(),
        completedAt: new Date(),
        lastAccessedAt: new Date(),
      },
      update: {
        status: ProgressStatus.COMPLETED,
        progressPercent: Math.min(100, payload.progressPercent ?? 100),
        bestScore:
          payload.score !== undefined ? Math.max(payload.score, 0) : undefined,
        lastScore: payload.score ?? undefined,
        timeSpentMinutes: {
          increment: payload.timeSpentMinutes ?? 0,
        },
        completedAt: new Date(),
        lastAccessedAt: new Date(),
      },
    });

    await this.updateEnrollmentProgress(userId, lesson.unit.courseId);
    await this.bumpDailyActivity(userId, {
      minutes: payload.timeSpentMinutes ?? 0,
      lessonsCompleted: 1,
      exercisesCompleted: 0,
      vocabularyReviewed: 0,
      score: payload.score ?? 0,
    });

    return lessonProgress;
  }

  async recordExerciseAttempt(
    userId: string,
    courseSlug: string,
    lessonSlug: string,
    exerciseId: string,
    submittedAnswer: unknown,
  ) {
    const exercise = await this.prisma.exercise.findFirst({
      where: {
        id: exerciseId,
        lesson: {
          slug: lessonSlug,
          unit: {
            course: {
              slug: courseSlug,
              status: CourseStatus.PUBLISHED,
            },
          },
        },
      },
      select: {
        id: true,
        lessonId: true,
        correctAnswer: true,
        points: true,
        type: true,
        options: true,
      },
    });

    if (!exercise) {
      throw new NotFoundException('Không tìm thấy bài tập.');
    }

    const result = await this.coursesService.checkExercise(
      courseSlug,
      lessonSlug,
      exerciseId,
      submittedAnswer,
    );

    const attemptNumber = await this.prisma.exerciseAttempt.count({
      where: { userId, exerciseId },
    });

    const attempt = await this.prisma.exerciseAttempt.create({
      data: {
        userId,
        exerciseId,
        lessonId: exercise.lessonId,
        attemptNumber: attemptNumber + 1,
        answer: submittedAnswer as never,
        isCorrect: result.isCorrect,
        score: result.pointsEarned,
        submittedAt: new Date(),
      },
    });

    await this.bumpDailyActivity(userId, {
      minutes: 1,
      lessonsCompleted: 0,
      exercisesCompleted: 1,
      vocabularyReviewed: 0,
      score: result.pointsEarned,
    });

    return {
      ...result,
      attempt,
    };
  }

  async reviewVocabulary(userId: string, vocabularyId: string, score = 100) {
    const vocabulary = await this.prisma.vocabulary.findUnique({
      where: { id: vocabularyId },
      select: { id: true },
    });

    if (!vocabulary) {
      throw new NotFoundException('Không tìm thấy từ vựng.');
    }

    const current = await this.prisma.vocabularyReview.findUnique({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId,
        },
      },
    });

    const isCorrect = score >= 60;
    const repetitions = (current?.repetitions ?? 0) + (isCorrect ? 1 : 0);
    const attempts = (current?.attempts ?? 0) + 1;
    const correctAttempts =
      (current?.correctAttempts ?? 0) + (isCorrect ? 1 : 0);
    const easeFactor = Math.max(
      1.3,
      (current?.easeFactor ?? 2.5) +
        (isCorrect ? 0.1 : -0.2) +
        (score > 90 ? 0.05 : 0),
    );
    const intervalDays = isCorrect
      ? Math.min(30, (current?.intervalDays ?? 1) * 2)
      : 1;
    const nextReviewAt = addDays(new Date(), intervalDays);

    const review = await this.prisma.vocabularyReview.upsert({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId,
        },
      },
      create: {
        userId,
        vocabularyId,
        intervalDays,
        easeFactor,
        repetitions,
        attempts,
        correctAttempts,
        lastReviewedAt: new Date(),
        nextReviewAt,
        lastScore: score,
      },
      update: {
        intervalDays,
        easeFactor,
        repetitions,
        attempts,
        correctAttempts,
        lastReviewedAt: new Date(),
        nextReviewAt,
        lastScore: score,
      },
    });

    await this.bumpDailyActivity(userId, {
      minutes: 1,
      lessonsCompleted: 0,
      exercisesCompleted: 0,
      vocabularyReviewed: 1,
      score,
    });

    return review;
  }

  private async updateEnrollmentProgress(
    userId: string,
    courseId: string,
  ): Promise<void> {
    const [completedLessons, totalLessons] = await Promise.all([
      this.prisma.lessonProgress.count({
        where: {
          userId,
          status: ProgressStatus.COMPLETED,
          lesson: {
            unit: {
              courseId,
            },
          },
        },
      }),
      this.prisma.lesson.count({
        where: {
          unit: {
            courseId,
          },
        },
      }),
    ]);

    const progressPercent =
      totalLessons > 0
        ? Math.min(100, Math.round((completedLessons / totalLessons) * 100))
        : 0;

    const completedAt = progressPercent >= 100 ? new Date() : null;

    await this.prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      create: {
        userId,
        courseId,
        progressPercent,
        completedAt,
        lastAccessedAt: new Date(),
      },
      update: {
        progressPercent,
        completedAt,
        lastAccessedAt: new Date(),
      },
    });
  }

  private async bumpDailyActivity(
    userId: string,
    delta: {
      minutes: number;
      lessonsCompleted: number;
      exercisesCompleted: number;
      vocabularyReviewed: number;
      score: number;
    },
  ): Promise<void> {
    const today = startOfDay(new Date());

    await this.prisma.dailyLearningActivity.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      create: {
        userId,
        date: today,
        minutes: delta.minutes,
        lessonsCompleted: delta.lessonsCompleted,
        exercisesCompleted: delta.exercisesCompleted,
        vocabularyReviewed: delta.vocabularyReviewed,
        score: delta.score,
      },
      update: {
        minutes: {
          increment: delta.minutes,
        },
        lessonsCompleted: {
          increment: delta.lessonsCompleted,
        },
        exercisesCompleted: {
          increment: delta.exercisesCompleted,
        },
        vocabularyReviewed: {
          increment: delta.vocabularyReviewed,
        },
        score: {
          increment: delta.score,
        },
      },
    });
  }

  private calculateStreak(
    records: Array<{ date: Date; minutes: number }>,
  ): number {
    if (records.length === 0) {
      return 0;
    }

    const activeDays = new Set(
      records
        .filter((record) => record.minutes > 0)
        .map((record) => startOfDay(record.date).getTime()),
    );

    let streak = 0;
    let cursor = startOfDay(new Date());

    while (activeDays.has(cursor.getTime())) {
      streak += 1;
      cursor = addDays(cursor, -1);
    }

    return streak;
  }
}
