import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

import {
  CourseLevel,
  CourseStatus,
  ExerciseType,
  LessonType,
  PrismaClient,
  UserRole,
  UserStatus,
} from '../generated/prisma/client';

import { ContentImporter, courses, serializeError } from './content';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Thiếu biến môi trường DATABASE_URL.');
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

const ADMIN_TEST_EMAIL = 'test+1785464559@example.com';
const ADMIN_TEST_PASSWORD = 'NewPass123!';

async function seedAdminTestAccount(): Promise<void> {
  const passwordHash = await bcrypt.hash(ADMIN_TEST_PASSWORD, 12);

  await prisma.user.upsert({
    where: {
      email: ADMIN_TEST_EMAIL,
    },
    create: {
      email: ADMIN_TEST_EMAIL,
      passwordHash,
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
    update: {
      passwordHash,
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      refreshTokenHash: null,
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
    },
  });

  console.log(`✅ Đã đảm bảo tài khoản admin test: ${ADMIN_TEST_EMAIL}`);
}

function readBooleanEnvironment(name: string, defaultValue: boolean): boolean {
  const rawValue = process.env[name];

  if (rawValue === undefined) {
    return defaultValue;
  }

  const value = rawValue.trim().toLowerCase();

  if (['true', '1', 'yes'].includes(value)) {
    return true;
  }

  if (['false', '0', 'no'].includes(value)) {
    return false;
  }

  throw new Error(`Biến môi trường ${name} phải là true hoặc false.`);
}

interface ContentSeedEnvironment {
  dryRun: boolean;
  validate: boolean;
  verbose: boolean;
}

function readContentSeedEnvironment(): ContentSeedEnvironment {
  return {
    dryRun: readBooleanEnvironment('CONTENT_SEED_DRY_RUN', false),
    validate: readBooleanEnvironment('CONTENT_SEED_VALIDATE', true),
    verbose: readBooleanEnvironment('CONTENT_SEED_VERBOSE', true),
  };
}

async function seedContentEngine(
  environment: ContentSeedEnvironment,
): Promise<void> {
  const importer = new ContentImporter(prisma, {
    dryRun: environment.dryRun,
    validate: environment.validate,
    verbose: environment.verbose,
    clearExisting: false,
  });

  await importer.importCourses([...courses]);
}

async function seedEnglishA1(): Promise<void> {
  const courseSlug = 'english-a1-foundations';

  const existingCourse = await prisma.course.findUnique({
    where: {
      slug: courseSlug,
    },
    select: {
      id: true,
    },
  });

  if (existingCourse) {
    await prisma.course.delete({
      where: {
        id: existingCourse.id,
      },
    });
  }

  await prisma.course.create({
    data: {
      slug: courseSlug,
      title: 'English A1 Foundations',
      shortDescription:
        'Xây dựng nền tảng tiếng Anh từ những chủ đề giao tiếp thiết yếu.',
      description:
        'Khóa học dành cho người mới bắt đầu, bao gồm từ vựng, hội thoại, ngữ pháp cơ bản và bài tập thực hành theo chuẩn CEFR A1.',
      level: CourseLevel.A1,
      status: CourseStatus.PUBLISHED,
      estimatedHours: 24,
      orderIndex: 1,
      publishedAt: new Date(),
      units: {
        create: [
          {
            title: 'Unit 1: Greetings and Introductions',
            description:
              'Học cách chào hỏi, giới thiệu bản thân và hỏi thông tin cơ bản.',
            orderIndex: 1,
            lessons: {
              create: [
                {
                  slug: 'hello-and-goodbye',
                  title: 'Hello and Goodbye',
                  description: 'Các cách chào hỏi và tạm biệt thông dụng.',
                  type: LessonType.VOCABULARY,
                  orderIndex: 1,
                  durationMinutes: 15,
                  isFree: true,
                  content: {
                    objective: [
                      'Sử dụng lời chào phù hợp theo thời điểm.',
                      'Phân biệt cách chào trang trọng và thân mật.',
                      'Tự tin bắt đầu và kết thúc cuộc hội thoại.',
                    ],
                    introduction:
                      'Trong bài học này, bạn sẽ làm quen với những lời chào cơ bản nhất trong tiếng Anh.',
                    grammarNotes: [
                      {
                        title: 'Good morning',
                        description:
                          'Dùng từ buổi sáng đến khoảng 12 giờ trưa.',
                      },
                      {
                        title: 'Good afternoon',
                        description:
                          'Dùng từ khoảng 12 giờ trưa đến cuối buổi chiều.',
                      },
                      {
                        title: 'Good evening',
                        description: 'Dùng khi gặp ai đó vào buổi tối.',
                      },
                      {
                        title: 'Good night',
                        description:
                          'Thường dùng khi tạm biệt hoặc trước khi đi ngủ.',
                      },
                    ],
                  },
                  vocabularies: {
                    create: [
                      {
                        word: 'hello',
                        phonetic: '/həˈləʊ/',
                        partOfSpeech: 'interjection',
                        meaning: 'xin chào',
                        example: 'Hello! Nice to meet you.',
                        exampleTranslation: 'Xin chào! Rất vui được gặp bạn.',
                        orderIndex: 1,
                      },
                      {
                        word: 'hi',
                        phonetic: '/haɪ/',
                        partOfSpeech: 'interjection',
                        meaning: 'chào',
                        example: 'Hi, Anna! How are you?',
                        exampleTranslation: 'Chào Anna! Bạn khỏe không?',
                        orderIndex: 2,
                      },
                      {
                        word: 'good morning',
                        phonetic: '/ˌɡʊd ˈmɔːnɪŋ/',
                        partOfSpeech: 'phrase',
                        meaning: 'chào buổi sáng',
                        example: 'Good morning, everyone.',
                        exampleTranslation: 'Chào buổi sáng mọi người.',
                        orderIndex: 3,
                      },
                      {
                        word: 'good afternoon',
                        phonetic: '/ˌɡʊd ˌɑːftəˈnuːn/',
                        partOfSpeech: 'phrase',
                        meaning: 'chào buổi chiều',
                        example: 'Good afternoon, Mr Brown.',
                        exampleTranslation: 'Chào buổi chiều, ông Brown.',
                        orderIndex: 4,
                      },
                      {
                        word: 'good evening',
                        phonetic: '/ˌɡʊd ˈiːvnɪŋ/',
                        partOfSpeech: 'phrase',
                        meaning: 'chào buổi tối',
                        example: 'Good evening. Welcome to our hotel.',
                        exampleTranslation:
                          'Chào buổi tối. Chào mừng đến khách sạn của chúng tôi.',
                        orderIndex: 5,
                      },
                      {
                        word: 'goodbye',
                        phonetic: '/ˌɡʊdˈbaɪ/',
                        partOfSpeech: 'interjection',
                        meaning: 'tạm biệt',
                        example: 'Goodbye! See you tomorrow.',
                        exampleTranslation: 'Tạm biệt! Hẹn gặp bạn ngày mai.',
                        orderIndex: 6,
                      },
                      {
                        word: 'see you',
                        phonetic: '/ˌsiː ˈjuː/',
                        partOfSpeech: 'phrase',
                        meaning: 'hẹn gặp lại',
                        example: 'See you next week.',
                        exampleTranslation: 'Hẹn gặp bạn tuần sau.',
                        orderIndex: 7,
                      },
                      {
                        word: 'welcome',
                        phonetic: '/ˈwelkəm/',
                        partOfSpeech: 'interjection',
                        meaning: 'chào mừng',
                        example: 'Welcome to our class.',
                        exampleTranslation:
                          'Chào mừng bạn đến lớp học của chúng tôi.',
                        orderIndex: 8,
                      },
                      {
                        word: 'good night',
                        phonetic: '/ˌɡʊd ˈnaɪt/',
                        partOfSpeech: 'phrase',
                        meaning: 'chúc ngủ ngon; tạm biệt vào ban đêm',
                        example: 'Good night, Mom. See you in the morning.',
                        exampleTranslation:
                          'Chúc mẹ ngủ ngon. Hẹn gặp mẹ vào buổi sáng.',
                        orderIndex: 9,
                      },
                      {
                        word: 'nice to meet you',
                        phonetic: '/ˌnaɪs tə ˈmiːt juː/',
                        partOfSpeech: 'phrase',
                        meaning: 'rất vui được gặp bạn',
                        example: 'Hello, I am Alex. Nice to meet you.',
                        exampleTranslation:
                          'Xin chào, tôi là Alex. Rất vui được gặp bạn.',
                        orderIndex: 10,
                      },
                      {
                        word: 'how are you',
                        phonetic: '/ˌhaʊ ɑː ˈjuː/',
                        partOfSpeech: 'phrase',
                        meaning: 'bạn khỏe không',
                        example: 'Hi, Emma. How are you?',
                        exampleTranslation: 'Chào Emma. Bạn khỏe không?',
                        orderIndex: 11,
                      },
                      {
                        word: 'fine',
                        phonetic: '/faɪn/',
                        partOfSpeech: 'adjective',
                        meaning: 'khỏe, ổn',
                        example: 'I am fine, thank you.',
                        exampleTranslation: 'Tôi khỏe, cảm ơn bạn.',
                        orderIndex: 12,
                      },
                      {
                        word: 'thank you',
                        phonetic: '/ˈθæŋk juː/',
                        partOfSpeech: 'phrase',
                        meaning: 'cảm ơn bạn',
                        example: 'I am fine, thank you.',
                        exampleTranslation: 'Tôi khỏe, cảm ơn bạn.',
                        orderIndex: 13,
                      },
                      {
                        word: 'thanks',
                        phonetic: '/θæŋks/',
                        partOfSpeech: 'interjection',
                        meaning: 'cảm ơn',
                        example: 'Thanks for your help.',
                        exampleTranslation: 'Cảm ơn vì sự giúp đỡ của bạn.',
                        orderIndex: 14,
                      },
                      {
                        word: 'please',
                        phonetic: '/pliːz/',
                        partOfSpeech: 'adverb',
                        meaning: 'làm ơn, vui lòng',
                        example: 'Please sit down.',
                        exampleTranslation: 'Vui lòng ngồi xuống.',
                        orderIndex: 15,
                      },
                      {
                        word: 'sorry',
                        phonetic: '/ˈsɒri/',
                        partOfSpeech: 'adjective',
                        meaning: 'xin lỗi',
                        example: 'Sorry, I am late.',
                        exampleTranslation: 'Xin lỗi, tôi đến muộn.',
                        orderIndex: 16,
                      },
                      {
                        word: 'excuse me',
                        phonetic: '/ɪkˈskjuːz miː/',
                        partOfSpeech: 'phrase',
                        meaning: 'xin lỗi; cho tôi hỏi',
                        example: 'Excuse me, what is your name?',
                        exampleTranslation: 'Xin lỗi, bạn tên là gì?',
                        orderIndex: 17,
                      },
                      {
                        word: 'see you later',
                        phonetic: '/ˌsiː juː ˈleɪtə/',
                        partOfSpeech: 'phrase',
                        meaning: 'hẹn gặp lại sau',
                        example: 'I have to go. See you later.',
                        exampleTranslation: 'Tôi phải đi rồi. Hẹn gặp lại sau.',
                        orderIndex: 18,
                      },
                      {
                        word: 'see you tomorrow',
                        phonetic: '/ˌsiː juː təˈmɒrəʊ/',
                        partOfSpeech: 'phrase',
                        meaning: 'hẹn gặp bạn ngày mai',
                        example: 'Goodbye, Nam. See you tomorrow.',
                        exampleTranslation:
                          'Tạm biệt Nam. Hẹn gặp bạn ngày mai.',
                        orderIndex: 19,
                      },
                      {
                        word: 'take care',
                        phonetic: '/ˌteɪk ˈkeə/',
                        partOfSpeech: 'phrase',
                        meaning: 'giữ gìn sức khỏe nhé',
                        example: 'Goodbye! Take care.',
                        exampleTranslation: 'Tạm biệt! Giữ gìn sức khỏe nhé.',
                        orderIndex: 20,
                      },
                    ],
                  },
                  exercises: {
                    create: [
                      {
                        type: ExerciseType.MULTIPLE_CHOICE,
                        question:
                          'Bạn gặp giáo viên lúc 8 giờ sáng. Bạn nên nói gì?',
                        instructions: 'Chọn đáp án phù hợp nhất.',
                        options: [
                          'Good morning',
                          'Good night',
                          'Goodbye',
                          'See you',
                        ],
                        correctAnswer: 'Good morning',
                        explanation:
                          'Good morning được dùng khi chào ai đó vào buổi sáng.',
                        points: 10,
                        orderIndex: 1,
                      },
                      {
                        type: ExerciseType.MULTIPLE_CHOICE,
                        question: 'Cụm từ nào có nghĩa là “hẹn gặp lại”?',
                        options: [
                          'See you',
                          'Good morning',
                          'Welcome',
                          'Hello',
                        ],
                        correctAnswer: 'See you',
                        explanation:
                          'See you được dùng khi tạm biệt và mong gặp lại.',
                        points: 10,
                        orderIndex: 2,
                      },
                      {
                        type: ExerciseType.FILL_BLANK,
                        question:
                          'Điền từ còn thiếu: “_____! Nice to meet you.”',
                        instructions: 'Nhập một lời chào phù hợp.',
                        correctAnswer: ['Hello', 'Hi'],
                        explanation:
                          'Hello hoặc Hi đều có thể dùng trong câu này.',
                        points: 10,
                        orderIndex: 3,
                      },
                      {
                        type: ExerciseType.TRUE_FALSE,
                        question:
                          '“Good night” thường dùng để chào ai đó khi vừa gặp vào buổi tối.',
                        options: ['True', 'False'],
                        correctAnswer: false,
                        explanation:
                          'Khi vừa gặp vào buổi tối, ta thường nói Good evening. Good night thường dùng khi tạm biệt hoặc đi ngủ.',
                        points: 10,
                        orderIndex: 4,
                      },
                    ],
                  },
                },
                {
                  slug: 'introducing-yourself',
                  title: 'Introducing Yourself',
                  description:
                    'Giới thiệu tên, quê quán và nghề nghiệp của bản thân.',
                  type: LessonType.SPEAKING,
                  orderIndex: 2,
                  durationMinutes: 20,
                  isFree: true,
                  content: {
                    objective: [
                      'Giới thiệu tên của bản thân.',
                      'Hỏi và trả lời về quê quán.',
                      'Hỏi và trả lời về nghề nghiệp.',
                    ],
                    dialogue: [
                      {
                        speaker: 'Anna',
                        text: 'Hi! My name is Anna. What is your name?',
                      },
                      {
                        speaker: 'Minh',
                        text: 'Hello, Anna. I am Minh.',
                      },
                      {
                        speaker: 'Anna',
                        text: 'Nice to meet you, Minh. Where are you from?',
                      },
                      {
                        speaker: 'Minh',
                        text: 'I am from Vietnam.',
                      },
                    ],
                    grammarNotes: [
                      {
                        pattern: 'My name is + name',
                        example: 'My name is Minh.',
                      },
                      {
                        pattern: 'I am from + country/city',
                        example: 'I am from Vietnam.',
                      },
                      {
                        pattern: 'I am a/an + job',
                        example: 'I am a student.',
                      },
                    ],
                  },
                  vocabularies: {
                    create: [
                      {
                        word: 'name',
                        phonetic: '/neɪm/',
                        partOfSpeech: 'noun',
                        meaning: 'tên',
                        example: 'My name is David.',
                        exampleTranslation: 'Tên tôi là David.',
                        orderIndex: 1,
                      },
                      {
                        word: 'from',
                        phonetic: '/frɒm/',
                        partOfSpeech: 'preposition',
                        meaning: 'đến từ',
                        example: 'I am from Vietnam.',
                        exampleTranslation: 'Tôi đến từ Việt Nam.',
                        orderIndex: 2,
                      },
                      {
                        word: 'country',
                        phonetic: '/ˈkʌntri/',
                        partOfSpeech: 'noun',
                        meaning: 'đất nước',
                        example: 'What country are you from?',
                        exampleTranslation: 'Bạn đến từ đất nước nào?',
                        orderIndex: 3,
                      },
                      {
                        word: 'city',
                        phonetic: '/ˈsɪti/',
                        partOfSpeech: 'noun',
                        meaning: 'thành phố',
                        example: 'Hanoi is a beautiful city.',
                        exampleTranslation: 'Hà Nội là một thành phố đẹp.',
                        orderIndex: 4,
                      },
                      {
                        word: 'student',
                        phonetic: '/ˈstjuːdənt/',
                        partOfSpeech: 'noun',
                        meaning: 'học sinh, sinh viên',
                        example: 'I am a student.',
                        exampleTranslation: 'Tôi là một học sinh/sinh viên.',
                        orderIndex: 5,
                      },
                      {
                        word: 'teacher',
                        phonetic: '/ˈtiːtʃə/',
                        partOfSpeech: 'noun',
                        meaning: 'giáo viên',
                        example: 'She is an English teacher.',
                        exampleTranslation: 'Cô ấy là giáo viên tiếng Anh.',
                        orderIndex: 6,
                      },
                      {
                        word: 'job',
                        phonetic: '/dʒɒb/',
                        partOfSpeech: 'noun',
                        meaning: 'công việc, nghề nghiệp',
                        example: 'What is your job?',
                        exampleTranslation: 'Công việc của bạn là gì?',
                        orderIndex: 7,
                      },
                      {
                        word: 'meet',
                        phonetic: '/miːt/',
                        partOfSpeech: 'verb',
                        meaning: 'gặp',
                        example: 'Nice to meet you.',
                        exampleTranslation: 'Rất vui được gặp bạn.',
                        orderIndex: 8,
                      },
                    ],
                  },
                  exercises: {
                    create: [
                      {
                        type: ExerciseType.MULTIPLE_CHOICE,
                        question: 'Câu nào dùng để giới thiệu tên?',
                        options: [
                          'My name is Lan.',
                          'I am from Vietnam.',
                          'Good night.',
                          'See you tomorrow.',
                        ],
                        correctAnswer: 'My name is Lan.',
                        explanation:
                          'My name is... là cấu trúc giới thiệu tên.',
                        points: 10,
                        orderIndex: 1,
                      },
                      {
                        type: ExerciseType.FILL_BLANK,
                        question: 'Điền từ còn thiếu: “I am _____ Vietnam.”',
                        correctAnswer: 'from',
                        explanation: 'Cấu trúc đúng là I am from + địa điểm.',
                        points: 10,
                        orderIndex: 2,
                      },
                      {
                        type: ExerciseType.SENTENCE_ORDER,
                        question: 'Sắp xếp thành câu đúng.',
                        options: ['name', 'My', 'is', 'Minh'],
                        correctAnswer: ['My', 'name', 'is', 'Minh'],
                        explanation: 'Câu đúng là: My name is Minh.',
                        points: 10,
                        orderIndex: 3,
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Unit 2: Family and Friends',
            description:
              'Mô tả các thành viên gia đình và những người xung quanh.',
            orderIndex: 2,
            lessons: {
              create: [
                {
                  slug: 'my-family',
                  title: 'My Family',
                  description:
                    'Từ vựng cơ bản về các thành viên trong gia đình.',
                  type: LessonType.VOCABULARY,
                  orderIndex: 1,
                  durationMinutes: 18,
                  isFree: false,
                  content: {
                    objective: [
                      'Gọi tên các thành viên trong gia đình.',
                      'Giới thiệu người thân.',
                      'Dùng tính từ sở hữu my, your, his, her.',
                    ],
                    introduction:
                      'Gia đình là một trong những chủ đề giao tiếp phổ biến nhất ở trình độ A1.',
                  },
                  vocabularies: {
                    create: [
                      {
                        word: 'family',
                        phonetic: '/ˈfæməli/',
                        partOfSpeech: 'noun',
                        meaning: 'gia đình',
                        example: 'I have a small family.',
                        exampleTranslation: 'Tôi có một gia đình nhỏ.',
                        orderIndex: 1,
                      },
                      {
                        word: 'father',
                        phonetic: '/ˈfɑːðə/',
                        partOfSpeech: 'noun',
                        meaning: 'bố, cha',
                        example: 'My father is a doctor.',
                        exampleTranslation: 'Bố tôi là một bác sĩ.',
                        orderIndex: 2,
                      },
                      {
                        word: 'mother',
                        phonetic: '/ˈmʌðə/',
                        partOfSpeech: 'noun',
                        meaning: 'mẹ',
                        example: 'My mother is very kind.',
                        exampleTranslation: 'Mẹ tôi rất tốt bụng.',
                        orderIndex: 3,
                      },
                      {
                        word: 'brother',
                        phonetic: '/ˈbrʌðə/',
                        partOfSpeech: 'noun',
                        meaning: 'anh/em trai',
                        example: 'I have one brother.',
                        exampleTranslation: 'Tôi có một người anh/em trai.',
                        orderIndex: 4,
                      },
                      {
                        word: 'sister',
                        phonetic: '/ˈsɪstə/',
                        partOfSpeech: 'noun',
                        meaning: 'chị/em gái',
                        example: 'My sister is twelve years old.',
                        exampleTranslation: 'Chị/em gái tôi 12 tuổi.',
                        orderIndex: 5,
                      },
                      {
                        word: 'parents',
                        phonetic: '/ˈpeərənts/',
                        partOfSpeech: 'noun',
                        meaning: 'bố mẹ',
                        example: 'My parents live in Hanoi.',
                        exampleTranslation: 'Bố mẹ tôi sống ở Hà Nội.',
                        orderIndex: 6,
                      },
                      {
                        word: 'husband',
                        phonetic: '/ˈhʌzbənd/',
                        partOfSpeech: 'noun',
                        meaning: 'chồng',
                        example: 'Her husband is a teacher.',
                        exampleTranslation: 'Chồng cô ấy là giáo viên.',
                        orderIndex: 7,
                      },
                      {
                        word: 'wife',
                        phonetic: '/waɪf/',
                        partOfSpeech: 'noun',
                        meaning: 'vợ',
                        example: 'His wife is from Canada.',
                        exampleTranslation: 'Vợ anh ấy đến từ Canada.',
                        orderIndex: 8,
                      },
                    ],
                  },
                  exercises: {
                    create: [
                      {
                        type: ExerciseType.MULTIPLE_CHOICE,
                        question: '“Mother” có nghĩa là gì?',
                        options: ['Mẹ', 'Bố', 'Chị gái', 'Vợ'],
                        correctAnswer: 'Mẹ',
                        explanation: 'Mother có nghĩa là mẹ.',
                        points: 10,
                        orderIndex: 1,
                      },
                      {
                        type: ExerciseType.MATCHING,
                        question: 'Nối từ tiếng Anh với nghĩa tiếng Việt.',
                        options: [
                          {
                            left: 'father',
                            right: 'bố',
                          },
                          {
                            left: 'sister',
                            right: 'chị/em gái',
                          },
                          {
                            left: 'brother',
                            right: 'anh/em trai',
                          },
                        ],
                        correctAnswer: {
                          father: 'bố',
                          sister: 'chị/em gái',
                          brother: 'anh/em trai',
                        },
                        explanation: 'Đây là các từ chỉ thành viên gia đình.',
                        points: 20,
                        orderIndex: 2,
                      },
                      {
                        type: ExerciseType.FILL_BLANK,
                        question: 'Điền từ: “My _____ is my mother’s husband.”',
                        correctAnswer: 'father',
                        explanation: 'Chồng của mẹ là bố.',
                        points: 10,
                        orderIndex: 3,
                      },
                    ],
                  },
                },
                {
                  slug: 'describing-people',
                  title: 'Describing People',
                  description: 'Miêu tả ngoại hình và tính cách cơ bản.',
                  type: LessonType.GRAMMAR,
                  orderIndex: 2,
                  durationMinutes: 22,
                  isFree: false,
                  content: {
                    objective: [
                      'Sử dụng tính từ mô tả người.',
                      'Dùng động từ to be với tính từ.',
                      'Dùng have/has để mô tả đặc điểm.',
                    ],
                    grammarNotes: [
                      {
                        pattern: 'Subject + be + adjective',
                        example: 'She is friendly.',
                      },
                      {
                        pattern: 'Subject + have/has + noun',
                        example: 'He has brown eyes.',
                      },
                    ],
                  },
                  vocabularies: {
                    create: [
                      {
                        word: 'tall',
                        phonetic: '/tɔːl/',
                        partOfSpeech: 'adjective',
                        meaning: 'cao',
                        example: 'My brother is tall.',
                        exampleTranslation: 'Anh/em trai tôi cao.',
                        orderIndex: 1,
                      },
                      {
                        word: 'short',
                        phonetic: '/ʃɔːt/',
                        partOfSpeech: 'adjective',
                        meaning: 'thấp, ngắn',
                        example: 'She has short hair.',
                        exampleTranslation: 'Cô ấy có mái tóc ngắn.',
                        orderIndex: 2,
                      },
                      {
                        word: 'young',
                        phonetic: '/jʌŋ/',
                        partOfSpeech: 'adjective',
                        meaning: 'trẻ',
                        example: 'He is a young teacher.',
                        exampleTranslation: 'Anh ấy là một giáo viên trẻ.',
                        orderIndex: 3,
                      },
                      {
                        word: 'friendly',
                        phonetic: '/ˈfrendli/',
                        partOfSpeech: 'adjective',
                        meaning: 'thân thiện',
                        example: 'Our new classmate is friendly.',
                        exampleTranslation:
                          'Bạn cùng lớp mới của chúng tôi rất thân thiện.',
                        orderIndex: 4,
                      },
                      {
                        word: 'kind',
                        phonetic: '/kaɪnd/',
                        partOfSpeech: 'adjective',
                        meaning: 'tốt bụng',
                        example: 'My grandmother is very kind.',
                        exampleTranslation: 'Bà tôi rất tốt bụng.',
                        orderIndex: 5,
                      },
                      {
                        word: 'funny',
                        phonetic: '/ˈfʌni/',
                        partOfSpeech: 'adjective',
                        meaning: 'hài hước',
                        example: 'David is very funny.',
                        exampleTranslation: 'David rất hài hước.',
                        orderIndex: 6,
                      },
                    ],
                  },
                  exercises: {
                    create: [
                      {
                        type: ExerciseType.MULTIPLE_CHOICE,
                        question: 'Chọn câu đúng về ngữ pháp.',
                        options: [
                          'She is friendly.',
                          'She friendly is.',
                          'She are friendly.',
                          'She have friendly.',
                        ],
                        correctAnswer: 'She is friendly.',
                        explanation:
                          'Cấu trúc đúng là Subject + be + adjective.',
                        points: 10,
                        orderIndex: 1,
                      },
                      {
                        type: ExerciseType.FILL_BLANK,
                        question: 'Điền từ: “He _____ brown eyes.”',
                        correctAnswer: 'has',
                        explanation: 'Với chủ ngữ he, ta dùng has.',
                        points: 10,
                        orderIndex: 2,
                      },

                      {
                        type: ExerciseType.SENTENCE_ORDER,
                        question: 'Sắp xếp thành câu đúng.',
                        options: ['is', 'My', 'kind', 'mother'],
                        correctAnswer: ['My', 'mother', 'is', 'kind'],
                        explanation: 'Câu đúng là: My mother is kind.',
                        points: 10,
                        orderIndex: 3,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Đã tạo khóa học English A1 Foundations.');
}

async function main(): Promise<void> {
  const environment = readContentSeedEnvironment();

  console.log('🌱 Bắt đầu nạp dữ liệu học tập...');
  console.log(`🧪 Dry run: ${environment.dryRun ? 'yes' : 'no'}`);
  console.log(`🔎 Validate content: ${environment.validate ? 'yes' : 'no'}`);

  if (!environment.dryRun) {
    await seedAdminTestAccount();
    await seedEnglishA1();
  } else {
    console.log(
      'ℹ️ Dry-run đang bật: bỏ qua seed dữ liệu cũ để không thay đổi database.',
    );
  }

  await seedContentEngine(environment);

  const [courseCount, unitCount, lessonCount, vocabularyCount, exerciseCount] =
    await Promise.all([
      prisma.course.count(),
      prisma.unit.count(),
      prisma.lesson.count(),
      prisma.vocabulary.count(),
      prisma.exercise.count(),
    ]);

  console.log('📚 Tổng số khóa học:', courseCount);
  console.log('📂 Tổng số unit:', unitCount);
  console.log('📖 Tổng số bài học:', lessonCount);
  console.log('🧠 Tổng số từ vựng:', vocabularyCount);
  console.log('✅ Tổng số bài tập:', exerciseCount);
}

main()
  .catch((error: unknown) => {
    console.error('❌ Seed thất bại:');
    console.error(JSON.stringify(serializeError(error), null, 2));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
