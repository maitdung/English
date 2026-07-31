import generatedTravelAirportLesson from './lesson-007-travel-airport';
import { adaptGeneratedLesson } from './adapter';
import { foundationLessons } from './foundations';

export const lesson007TravelAirport = adaptGeneratedLesson(
  generatedTravelAirportLesson,
  {
    id: 7,
    level: 'A1',
    category: 'mixed',
    tags: [
      'travel',
      'airport',
      'past-simple',
      'transportation',
      'conversation',
    ],
  },
);

export const a1Lessons = [
  ...foundationLessons,
  lesson007TravelAirport,
] as const;

export default a1Lessons;
