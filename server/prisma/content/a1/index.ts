import type { Course } from '../types';
import { a1Lessons, lesson007TravelAirport } from './lessons';

export const a1Course: Course = {
  id: 'english-a1-foundations',
  level: 'A1',
  title: 'English A1 Foundations',
  description:
    'A complete beginner English course covering essential vocabulary, grammar, reading, listening, speaking, and writing skills.',
  lessons: [...a1Lessons],
};

export { a1Lessons, lesson007TravelAirport };

export default a1Course;
