// server/prisma/content/content.test.ts

import assert from 'node:assert/strict';
import test from 'node:test';

import { auditContent, courses, registry } from '.';

test('content registry contains courses', () => {
  assert.ok(
    courses.length > 0,
    'Content registry must contain at least one course.',
  );
});

test('all source content passes audit', () => {
  const result = auditContent([...courses]);

  const errors = result.issues.filter((issue) => issue.severity === 'error');

  assert.equal(
    result.valid,
    true,
    errors
      .map((issue) => `[${issue.code}] ${issue.path}: ${issue.message}`)
      .join('\n'),
  );

  assert.equal(errors.length, 0);
});

test('registry statistics match source content', () => {
  const registryStats = registry.getStats();

  const expectedLessons = courses.reduce(
    (total, course) => total + course.lessons.length,
    0,
  );

  const expectedVocabularies = courses.reduce(
    (courseTotal, course) =>
      courseTotal +
      course.lessons.reduce(
        (lessonTotal, lesson) => lessonTotal + lesson.vocabulary.length,
        0,
      ),
    0,
  );

  const expectedExercises = courses.reduce(
    (courseTotal, course) =>
      courseTotal +
      course.lessons.reduce(
        (lessonTotal, lesson) => lessonTotal + lesson.exercises.length,
        0,
      ),
    0,
  );

  assert.equal(registryStats.courses, courses.length);

  assert.equal(registryStats.lessons, expectedLessons);

  assert.equal(registryStats.vocabularies, expectedVocabularies);

  assert.equal(registryStats.exercises, expectedExercises);
});

test('course ids are unique', () => {
  const ids = courses.map((course) => course.id);

  assert.equal(new Set(ids).size, ids.length, 'Duplicate course ids detected.');
});

test('lesson ids and slugs are unique inside each course', () => {
  for (const course of courses) {
    const lessonIds = course.lessons.map((lesson) => lesson.metadata.id);

    const lessonSlugs = course.lessons.map((lesson) => lesson.metadata.slug);

    assert.equal(
      new Set(lessonIds).size,
      lessonIds.length,
      `Duplicate lesson ids in course ${course.id}.`,
    );

    assert.equal(
      new Set(lessonSlugs).size,
      lessonSlugs.length,
      `Duplicate lesson slugs in course ${course.id}.`,
    );
  }
});

test('exercise ids are globally unique', () => {
  const exerciseIds = courses.flatMap((course) =>
    course.lessons.flatMap((lesson) =>
      lesson.exercises.map((exercise) => exercise.id),
    ),
  );

  assert.equal(
    new Set(exerciseIds).size,
    exerciseIds.length,
    'Duplicate exercise ids detected.',
  );
});

test('every lesson has required learning content', () => {
  for (const course of courses) {
    for (const lesson of course.lessons) {
      const path = `${course.id}/${lesson.metadata.slug}`;

      assert.ok(
        lesson.objectives.length > 0,
        `${path}: objectives are missing.`,
      );

      assert.ok(
        lesson.vocabulary.length > 0,
        `${path}: vocabulary is missing.`,
      );

      assert.ok(
        lesson.dialogue.lines.length > 0,
        `${path}: dialogue is missing.`,
      );

      assert.ok(lesson.grammar.length > 0, `${path}: grammar is missing.`);

      assert.ok(
        lesson.reading.passage.trim().length > 0,
        `${path}: reading passage is missing.`,
      );

      assert.ok(
        lesson.listening.transcript.trim().length > 0,
        `${path}: listening transcript is missing.`,
      );

      assert.ok(
        lesson.speaking.length > 0,
        `${path}: speaking tasks are missing.`,
      );

      assert.ok(
        lesson.writing.length > 0,
        `${path}: writing tasks are missing.`,
      );

      assert.ok(lesson.exercises.length > 0, `${path}: exercises are missing.`);
    }
  }
});
