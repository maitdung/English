import type { Exercise, Lesson, VocabularyItem } from '../../types';

type LessonSeed = {
  id: number;
  slug: string;
  title: string;
  category: Lesson['metadata']['category'];
  description: string;
  grammarTitle: string;
  grammar: string;
  grammarExamples: Array<[string, string]>;
  dialogue: Array<[string, string, string]>;
  readingTitle: string;
  reading: string;
  readingTranslation: string;
  listening: string;
  words: Array<[string, string, string, string, string]>;
  speaking: string;
  writing: string;
};

const ipa = '/ˈwɜːd/';

function vocabulary(words: LessonSeed['words']): VocabularyItem[] {
  return words.map(([word, type, meaning, example, translation]) => ({
    word,
    ipa,
    type,
    meaning,
    example,
    exampleTranslation: translation,
  }));
}

function choice(
  id: string,
  question: string,
  options: string[],
  answer: number,
  explanation: string,
): Exercise {
  return {
    id,
    type: 'multiple-choice',
    question,
    options,
    answer,
    explanation,
  };
}

function makeExercises(seed: LessonSeed): Exercise[] {
  const prefix = seed.slug;
  const words = seed.words;
  const exercises: Exercise[] = words
    .slice(0, 12)
    .map(([word, , meaning], i) =>
      choice(
        `${prefix}-exercise-${String(i + 1).padStart(3, '0')}`,
        `Từ nào có nghĩa là: ${meaning}?`,
        [
          word,
          words[(i + 1) % words.length][0],
          words[(i + 2) % words.length][0],
          words[(i + 3) % words.length][0],
        ],
        0,
        `Đáp án: ${word}. Hãy đọc lại ví dụ trong phần từ vựng.`,
      ),
    );
  const base = exercises.length;
  const readingQs = [
    [
      'Ý chính của bài đọc là gì?',
      'Nhân vật thực hành ngôn ngữ trong một tình huống đời thường.',
    ],
    [
      'Nhân vật chính có thái độ như thế nào?',
      'Chủ động, lịch sự và sẵn sàng học hỏi.',
    ],
    [
      'Chi tiết nào giúp suy ra bối cảnh?',
      'Các từ khóa và hành động được nêu trực tiếp trong đoạn.',
    ],
  ];
  readingQs.forEach(([q, correct], i) =>
    exercises.push(
      choice(
        `${prefix}-exercise-${String(base + i + 1).padStart(3, '0')}`,
        q,
        [
          correct,
          'Nhân vật đang ngủ.',
          'Không có thông tin nào.',
          'Câu chuyện xảy ra ở tương lai xa.',
        ],
        0,
        `Đọc kỹ đoạn văn: ${correct}`,
      ),
    ),
  );
  const listenBase = exercises.length;
  const listenQs = [
    [
      'Người nói muốn người nghe làm gì?',
      'Chú ý đến thông tin chính và phản hồi phù hợp.',
    ],
    ['Thông điệp được nói với giọng điệu nào?', 'Thân thiện và rõ ràng.'],
    [
      'Kỹ năng nghe nào hữu ích nhất?',
      'Nghe từ khóa trước, rồi kiểm tra ý nghĩa theo ngữ cảnh.',
    ],
  ];
  listenQs.forEach(([q, correct], i) =>
    exercises.push(
      choice(
        `${prefix}-exercise-${String(listenBase + i + 1).padStart(3, '0')}`,
        q,
        [
          correct,
          'Đoán từng từ mà không nghe.',
          'Bỏ qua ngữ cảnh.',
          'Chỉ dịch từng chữ.',
        ],
        0,
        `Theo transcript: ${correct}`,
      ),
    ),
  );
  const practiceBase = exercises.length;
  exercises.push(
    {
      id: `${prefix}-exercise-${String(practiceBase + 1).padStart(3, '0')}`,
      type: 'fill-blank',
      question: `Điền từ phù hợp: "I use ${words[0][0]} every day."`,
      answer: words[0][0],
      explanation: `Dùng ${words[0][0]} theo ngữ cảnh bài học.`,
    },
    {
      id: `${prefix}-exercise-${String(practiceBase + 2).padStart(3, '0')}`,
      type: 'true-false',
      question: `Đúng hay sai: "${words[1][0]}" là một từ nằm trong bài học này.`,
      answer: true,
      explanation: 'Đúng: hãy ôn lại nghĩa và ví dụ của từ.',
    },
    {
      id: `${prefix}-exercise-${String(practiceBase + 3).padStart(3, '0')}`,
      type: 'ordering',
      question: 'Sắp xếp thành câu lịch sự: "please / help / me / can / you"',
      answer: ['Can', 'you', 'help', 'me', 'please'],
      explanation: 'Câu hỏi lịch sự bắt đầu bằng Can you...?',
    },
    {
      id: `${prefix}-exercise-${String(practiceBase + 4).padStart(3, '0')}`,
      type: 'matching',
      question: `Ghép "${words[2][0]}" với nghĩa tiếng Việt phù hợp.`,
      options: [words[2][2], words[3][2], words[4][2]],
      answer: words[2][2],
      explanation: `"${words[2][0]}" = ${words[2][2]}.`,
    },
    choice(
      `${prefix}-exercise-${String(practiceBase + 5).padStart(3, '0')}`,
      'Chọn chiến lược ôn từ hiệu quả nhất.',
      [
        'Đặt một câu cá nhân và ôn lại theo chu kỳ.',
        'Chỉ đọc danh sách một lần.',
        'Bỏ qua phát âm.',
        'Học thật nhiều nhưng không kiểm tra.',
      ],
      0,
      'Kết hợp ngữ cảnh, phát âm và lặp lại ngắt quãng.',
    ),
    choice(
      `${prefix}-exercise-${String(practiceBase + 6).padStart(3, '0')}`,
      'Khi chưa hiểu một từ trong bài đọc, em nên làm gì trước?',
      [
        'Đoán nghĩa từ ngữ cảnh rồi kiểm tra.',
        'Dừng đọc hoàn toàn.',
        'Chọn ngẫu nhiên.',
        'Dịch cả đoạn từng chữ.',
      ],
      0,
      'Ngữ cảnh thường cho biết loại từ và ý chính.',
    ),
    {
      id: `${prefix}-exercise-${String(practiceBase + 7).padStart(3, '0')}`,
      type: 'fill-blank',
      question: 'Viết một từ nối phù hợp: "First, I listen. ___, I answer."',
      answer: 'Then',
      explanation: 'Then dùng để nối bước tiếp theo.',
    },
  );
  return exercises;
}

function buildLesson(seed: LessonSeed): Lesson {
  const exercises = makeExercises(seed);
  const readingQuestions = exercises
    .slice(12, 15)
    .map(({ question, options = [], answer }) => ({
      question,
      options,
      answer: Number(answer),
    }));
  const listeningQuestions = exercises
    .slice(15, 18)
    .map(({ question, options = [], answer }) => ({
      question,
      options,
      answer: Number(answer),
    }));
  return {
    metadata: {
      id: seed.id,
      slug: seed.slug,
      title: seed.title,
      description: seed.description,
      level: 'A1',
      category: seed.category,
      estimatedMinutes: 95,
      tags: [
        'a1',
        seed.category,
        'vocabulary',
        'four-skills',
        'vietnamese-guide',
      ],
    },
    objectives: [
      'Nắm và dùng ít nhất 20 từ/cụm từ theo chủ đề.',
      'Hiểu điểm ngữ pháp qua ví dụ Anh–Việt.',
      'Luyện đọc, nghe, nói và viết trong cùng một ngữ cảnh.',
      'Tự kiểm tra bằng 25 bài tập có phản hồi.',
    ],
    vocabulary: vocabulary(seed.words),
    dialogue: {
      title: `Hội thoại: ${seed.title}`,
      lines: seed.dialogue.map(([speaker, text, translation]) => ({
        speaker,
        text,
        translation,
      })),
    },
    grammar: [
      {
        title: seed.grammarTitle,
        explanation: seed.grammar,
        examples: seed.grammarExamples.map(([english, vietnamese]) => ({
          english,
          vietnamese,
        })),
      },
    ],
    reading: {
      title: seed.readingTitle,
      passage: seed.reading,
      translation: seed.readingTranslation,
      questions: readingQuestions,
    },
    listening: { transcript: seed.listening, questions: listeningQuestions },
    speaking: [
      {
        title: 'Nói có hướng dẫn',
        instruction: `${seed.speaking}\nMẹo: nói chậm, nhấn từ khóa và tự ghi âm hai lần để nhận ra điểm cần cải thiện.`,
      },
    ],
    writing: [
      {
        title: 'Viết có khung',
        instruction: `${seed.writing}\nDùng ít nhất 6 từ mới, một cấu trúc ngữ pháp của bài và từ nối First/Then/Finally.`,
        sample:
          'First, I choose the right words. Then, I write clear sentences about my real life. Finally, I check grammar, spelling, and punctuation.',
      },
    ],
    exercises,
  };
}

const seeds: LessonSeed[] = [
  {
    id: 1,
    slug: 'introductions-and-daily-life',
    title: 'Introductions & Daily Life',
    category: 'vocabulary',
    description:
      'Tự giới thiệu, xây vốn từ đời sống và dùng động từ to be một cách tự tin.',
    grammarTitle: 'Động từ to be: am / is / are',
    grammar:
      'Dùng am với I, is với he/she/it và are với you/we/they. Trong tiếng Việt không có động từ tương đương ở mọi câu, vì vậy người học Việt cần nhớ luôn có to be trước danh từ, tính từ hoặc nơi chốn.',
    grammarExamples: [
      ['I am a student.', 'Tôi là học sinh.'],
      ['She is from Da Nang.', 'Cô ấy đến từ Đà Nẵng.'],
      ['Are they busy today?', 'Hôm nay họ có bận không?'],
    ],
    dialogue: [
      [
        'Linh',
        'Hi, I am Linh. Nice to meet you.',
        'Chào, mình là Linh. Rất vui được gặp bạn.',
      ],
      [
        'Tom',
        'Nice to meet you too. Where are you from?',
        'Mình cũng rất vui. Bạn đến từ đâu?',
      ],
      [
        'Linh',
        'I am from Hue, but I live in Hanoi now.',
        'Mình đến từ Huế, nhưng hiện sống ở Hà Nội.',
      ],
      ['Tom', 'What do you do?', 'Bạn làm nghề gì?'],
      [
        'Linh',
        'I am a designer. I work with a friendly team.',
        'Mình là nhà thiết kế. Mình làm việc với một đội thân thiện.',
      ],
      ['Tom', 'That sounds great!', 'Nghe tuyệt đấy!'],
    ],
    readingTitle: 'A New Classmate',
    reading:
      'Mai is a new student in an English class. She is twenty years old and she is from Can Tho. Her classmates are kind. Every morning, Mai reviews five words, listens to a short audio, and writes one sentence for each word. She is shy at first, but she asks questions when she does not understand. After class, she practises with her study partner. Her goal is simple: speak English clearly and enjoy the learning process.',
    readingTranslation:
      'Mai là học viên mới trong lớp tiếng Anh. Cô ấy 20 tuổi và đến từ Cần Thơ. Các bạn cùng lớp rất tốt bụng. Mỗi sáng Mai ôn năm từ, nghe một audio ngắn và viết một câu cho mỗi từ. Lúc đầu cô ấy nhút nhát nhưng hỏi khi chưa hiểu. Sau giờ học cô luyện cùng bạn học. Mục tiêu của cô là nói tiếng Anh rõ ràng và tận hưởng quá trình học.',
    listening:
      'Hello, everyone. Welcome to our first class. Please write your name, city, and one hobby on this card. Then introduce yourself to a partner. You do not need perfect English; simple, clear sentences are enough. Listen carefully, smile, and ask one follow-up question.',
    speaking:
      'Giới thiệu bản thân trong 45 giây: tên, quê quán, nghề/ngành học, một sở thích và một mục tiêu tiếng Anh.',
    writing: 'Viết 70–90 từ giới thiệu bản thân cho một người bạn quốc tế.',
    words: [
      [
        'introduce',
        'verb',
        'giới thiệu',
        'Let me introduce myself.',
        'Hãy để tôi giới thiệu bản thân.',
      ],
      [
        'classmate',
        'noun',
        'bạn cùng lớp',
        'My classmate is helpful.',
        'Bạn cùng lớp của tôi rất hay giúp đỡ.',
      ],
      [
        'hometown',
        'noun',
        'quê hương',
        'Hue is my hometown.',
        'Huế là quê hương tôi.',
      ],
      [
        'occupation',
        'noun',
        'nghề nghiệp',
        'What is your occupation?',
        'Nghề nghiệp của bạn là gì?',
      ],
      [
        'friendly',
        'adjective',
        'thân thiện',
        'Our teacher is friendly.',
        'Giáo viên của chúng tôi thân thiện.',
      ],
      [
        'confident',
        'adjective',
        'tự tin',
        'I feel confident today.',
        'Hôm nay tôi thấy tự tin.',
      ],
      [
        'practice',
        'verb',
        'luyện tập',
        'I practice English daily.',
        'Tôi luyện tiếng Anh hằng ngày.',
      ],
      [
        'review',
        'verb',
        'ôn lại',
        'Review the new words tonight.',
        'Tối nay hãy ôn lại từ mới.',
      ],
      [
        'goal',
        'noun',
        'mục tiêu',
        'My goal is to speak well.',
        'Mục tiêu của tôi là nói tốt.',
      ],
      [
        'hobby',
        'noun',
        'sở thích',
        'Reading is my hobby.',
        'Đọc sách là sở thích của tôi.',
      ],
      [
        'neighbor',
        'noun',
        'hàng xóm',
        'My neighbor is a nurse.',
        'Hàng xóm của tôi là y tá.',
      ],
      [
        'routine',
        'noun',
        'thói quen hằng ngày',
        'My morning routine is simple.',
        'Thói quen buổi sáng của tôi đơn giản.',
      ],
      [
        'usually',
        'adverb',
        'thường xuyên',
        'I usually study at night.',
        'Tôi thường học vào buổi tối.',
      ],
      [
        'sometimes',
        'adverb',
        'đôi khi',
        'She sometimes cooks dinner.',
        'Cô ấy đôi khi nấu bữa tối.',
      ],
      [
        'together',
        'adverb',
        'cùng nhau',
        'We learn together.',
        'Chúng tôi học cùng nhau.',
      ],
      [
        'question',
        'noun',
        'câu hỏi',
        'Ask a clear question.',
        'Hãy hỏi một câu rõ ràng.',
      ],
      [
        'answer',
        'noun',
        'câu trả lời',
        'Her answer is correct.',
        'Câu trả lời của cô ấy đúng.',
      ],
      [
        'improve',
        'verb',
        'cải thiện',
        'Practice can improve speaking.',
        'Luyện tập có thể cải thiện nói.',
      ],
      [
        'simple',
        'adjective',
        'đơn giản',
        'Use simple sentences first.',
        'Trước tiên hãy dùng câu đơn giản.',
      ],
      [
        'important',
        'adjective',
        'quan trọng',
        'Pronunciation is important.',
        'Phát âm rất quan trọng.',
      ],
    ],
  },
  {
    id: 2,
    slug: 'food-and-healthy-habits',
    title: 'Food & Healthy Habits',
    category: 'grammar',
    description:
      'Từ vựng ăn uống, gọi món lịch sự và dùng danh từ đếm được/không đếm được.',
    grammarTitle: 'Danh từ đếm được, không đếm được và some / any',
    grammar:
      'Danh từ đếm được có số ít/số nhiều: an apple, two apples. Danh từ không đếm được không thêm -s: rice, water. Dùng some trong câu khẳng định và lời mời; dùng any trong câu hỏi hoặc phủ định.',
    grammarExamples: [
      ['There are some bananas.', 'Có một ít chuối.'],
      ['Is there any milk?', 'Có sữa không?'],
      ['I do not have any sugar.', 'Tôi không có chút đường nào.'],
    ],
    dialogue: [
      [
        'Customer',
        'Good morning. Can I have a bowl of noodle soup, please?',
        'Chào buổi sáng. Tôi có thể gọi một bát phở không?',
      ],
      [
        'Server',
        'Of course. Would you like some herbs?',
        'Tất nhiên. Bạn có muốn thêm rau thơm không?',
      ],
      [
        'Customer',
        'Yes, and a glass of water, please.',
        'Có, và một cốc nước nhé.',
      ],
      ['Server', 'Do you want any chili?', 'Bạn có muốn ớt không?'],
      [
        'Customer',
        'No, thank you. I do not eat very spicy food.',
        'Không, cảm ơn. Tôi không ăn đồ quá cay.',
      ],
      [
        'Server',
        'Your meal will be ready soon.',
        'Bữa ăn của bạn sẽ sẵn sàng sớm.',
      ],
    ],
    readingTitle: 'Nam Plans a Healthy Lunch',
    reading:
      'Nam wants more energy for his afternoon English class. At the market, he buys vegetables, eggs, brown rice, yogurt, and fruit. He does not buy many soft drinks because they contain a lot of sugar. At home, he makes a simple lunch: rice, grilled chicken, a salad, and an orange. He drinks water with the meal. Nam says healthy food does not need to be expensive or difficult. Planning meals helps him save money and avoid wasting food.',
    readingTranslation:
      'Nam muốn có thêm năng lượng cho lớp tiếng Anh buổi chiều. Ở chợ, cậu mua rau, trứng, gạo lứt, sữa chua và trái cây. Cậu không mua nhiều nước ngọt vì chúng có nhiều đường. Ở nhà, cậu làm bữa trưa đơn giản: cơm, gà nướng, salad và cam. Cậu uống nước cùng bữa ăn. Nam nói đồ ăn lành mạnh không cần đắt hoặc khó làm. Lên kế hoạch bữa ăn giúp cậu tiết kiệm và không lãng phí thức ăn.',
    listening:
      'Today we have a healthy snack workshop. Please bring one piece of fruit, a small bottle of water, and a notebook. We will make yogurt with banana and discuss easy breakfast ideas. If you have any food allergy, tell the teacher before the activity.',
    speaking:
      'Đóng vai gọi món tại quán: hỏi giá, gọi một món chính và đồ uống, nêu một lựa chọn lành mạnh.',
    writing: 'Viết thực đơn lành mạnh cho một ngày, khoảng 80 từ.',
    words: [
      [
        'ingredient',
        'noun',
        'nguyên liệu',
        'Fresh ingredients make a good meal.',
        'Nguyên liệu tươi tạo nên bữa ăn ngon.',
      ],
      [
        'recipe',
        'noun',
        'công thức nấu ăn',
        'This recipe is easy to follow.',
        'Công thức này dễ làm theo.',
      ],
      [
        'portion',
        'noun',
        'khẩu phần',
        'Use a small portion of rice.',
        'Dùng một khẩu phần cơm nhỏ.',
      ],
      [
        'vegetable',
        'noun',
        'rau củ',
        'Eat vegetables every day.',
        'Hãy ăn rau mỗi ngày.',
      ],
      [
        'fruit',
        'noun',
        'trái cây',
        'Mango is a sweet fruit.',
        'Xoài là trái cây ngọt.',
      ],
      [
        'protein',
        'noun',
        'chất đạm',
        'Eggs contain protein.',
        'Trứng chứa chất đạm.',
      ],
      [
        'balanced',
        'adjective',
        'cân bằng',
        'A balanced meal gives energy.',
        'Bữa ăn cân bằng cung cấp năng lượng.',
      ],
      [
        'hungry',
        'adjective',
        'đói',
        'I am hungry after class.',
        'Tôi đói sau giờ học.',
      ],
      [
        'thirsty',
        'adjective',
        'khát',
        'She is thirsty after running.',
        'Cô ấy khát sau khi chạy.',
      ],
      [
        'order',
        'verb',
        'gọi món',
        'We order soup and tea.',
        'Chúng tôi gọi súp và trà.',
      ],
      [
        'menu',
        'noun',
        'thực đơn',
        'The menu has many choices.',
        'Thực đơn có nhiều lựa chọn.',
      ],
      [
        'bill',
        'noun',
        'hóa đơn',
        'Can I have the bill, please?',
        'Cho tôi xin hóa đơn được không?',
      ],
      [
        'delicious',
        'adjective',
        'ngon',
        'The soup is delicious.',
        'Món súp rất ngon.',
      ],
      [
        'spicy',
        'adjective',
        'cay',
        'This sauce is spicy.',
        'Nước sốt này cay.',
      ],
      [
        'sweet',
        'adjective',
        'ngọt',
        'I prefer less sweet tea.',
        'Tôi thích trà ít ngọt.',
      ],
      ['fresh', 'adjective', 'tươi', 'The fish is fresh.', 'Cá tươi.'],
      [
        'avoid',
        'verb',
        'tránh',
        'Avoid too much sugar.',
        'Tránh quá nhiều đường.',
      ],
      [
        'energy',
        'noun',
        'năng lượng',
        'Breakfast gives me energy.',
        'Bữa sáng cho tôi năng lượng.',
      ],
      ['market', 'noun', 'chợ', 'The market opens early.', 'Chợ mở sớm.'],
      [
        'waste',
        'verb',
        'lãng phí',
        'Do not waste food.',
        'Đừng lãng phí thức ăn.',
      ],
    ],
  },
  {
    id: 3,
    slug: 'home-and-city-reading',
    title: 'Home & City Reading',
    category: 'reading',
    description:
      'Đọc hiểu về nhà ở và thành phố, mở rộng tính từ nơi chốn và giới từ.',
    grammarTitle: 'There is / There are và giới từ nơi chốn',
    grammar:
      'Dùng There is cho một vật/sự việc, There are cho nhiều vật. Giới từ in, on, next to, between, opposite cho biết vị trí. Hãy hình dung bản đồ nhỏ trước khi chọn giới từ.',
    grammarExamples: [
      ['There is a park near my house.', 'Có một công viên gần nhà tôi.'],
      [
        'There are two cafes opposite the bank.',
        'Có hai quán cà phê đối diện ngân hàng.',
      ],
      [
        'The library is between the school and the museum.',
        'Thư viện ở giữa trường học và bảo tàng.',
      ],
    ],
    dialogue: [
      [
        'Visitor',
        'Excuse me, is there a library near here?',
        'Xin lỗi, có thư viện nào gần đây không?',
      ],
      [
        'Resident',
        'Yes, it is next to the post office.',
        'Có, nó ở cạnh bưu điện.',
      ],
      [
        'Visitor',
        'Is it far from the bus stop?',
        'Nó có xa trạm xe buýt không?',
      ],
      [
        'Resident',
        'No. Walk straight for five minutes.',
        'Không. Đi thẳng năm phút.',
      ],
      ['Visitor', 'Thank you for your help.', 'Cảm ơn bạn đã giúp đỡ.'],
      ['Resident', 'You are welcome.', 'Không có gì.'],
    ],
    readingTitle: 'A Walk Around My Neighborhood',
    reading:
      'My apartment is in a quiet neighborhood, but the city center is only fifteen minutes away by bus. There is a small bakery on the corner, and the owner knows many local people. Opposite the bakery, there is a public library with a bright reading room. On Saturday mornings, children borrow books while their parents drink coffee nearby. I like this area because it is convenient and peaceful. When friends visit, I show them the park behind my building and the night market beside the river.',
    readingTranslation:
      'Căn hộ của tôi ở một khu phố yên tĩnh nhưng trung tâm thành phố chỉ cách 15 phút xe buýt. Có một tiệm bánh nhỏ ở góc đường, chủ tiệm biết nhiều người địa phương. Đối diện tiệm bánh là thư viện công cộng có phòng đọc sáng. Sáng thứ Bảy, trẻ em mượn sách còn bố mẹ uống cà phê gần đó. Tôi thích khu này vì tiện lợi và bình yên. Khi bạn đến chơi, tôi chỉ cho họ công viên phía sau tòa nhà và chợ đêm cạnh sông.',
    listening:
      'Attention, visitors. The city museum opens at nine o’clock. The ticket desk is on the first floor, next to the information point. The photography exhibition is upstairs. Please keep your ticket until you leave the building. Thank you and enjoy your visit.',
    speaking:
      'Mô tả khu phố của em cho khách du lịch: ít nhất năm địa điểm và ba giới từ nơi chốn.',
    writing:
      'Viết 80–100 từ mô tả nơi em sống và một địa điểm yêu thích gần đó.',
    words: [
      [
        'apartment',
        'noun',
        'căn hộ',
        'Her apartment is on the fifth floor.',
        'Căn hộ của cô ấy ở tầng năm.',
      ],
      [
        'neighborhood',
        'noun',
        'khu phố',
        'This neighborhood is quiet.',
        'Khu phố này yên tĩnh.',
      ],
      [
        'convenient',
        'adjective',
        'tiện lợi',
        'The location is convenient.',
        'Vị trí thuận tiện.',
      ],
      [
        'crowded',
        'adjective',
        'đông đúc',
        'The street is crowded at night.',
        'Con đường đông đúc vào ban đêm.',
      ],
      [
        'peaceful',
        'adjective',
        'yên bình',
        'The park feels peaceful.',
        'Công viên có cảm giác yên bình.',
      ],
      [
        'corner',
        'noun',
        'góc đường',
        'Turn left at the corner.',
        'Rẽ trái ở góc đường.',
      ],
      [
        'opposite',
        'preposition',
        'đối diện',
        'The bank is opposite the cafe.',
        'Ngân hàng đối diện quán cà phê.',
      ],
      [
        'between',
        'preposition',
        'ở giữa',
        'The shop is between two houses.',
        'Cửa hàng ở giữa hai ngôi nhà.',
      ],
      [
        'nearby',
        'adverb',
        'gần đây',
        'Is there a pharmacy nearby?',
        'Có nhà thuốc nào gần đây không?',
      ],
      [
        'direction',
        'noun',
        'chỉ đường',
        'Ask for directions politely.',
        'Hãy hỏi đường lịch sự.',
      ],
      [
        'straight',
        'adverb',
        'thẳng',
        'Go straight ahead.',
        'Đi thẳng về phía trước.',
      ],
      [
        'cross',
        'verb',
        'băng qua',
        'Cross the road carefully.',
        'Băng qua đường cẩn thận.',
      ],
      [
        'bridge',
        'noun',
        'cây cầu',
        'The bridge crosses the river.',
        'Cây cầu bắc qua sông.',
      ],
      [
        'public',
        'adjective',
        'công cộng',
        'This is a public library.',
        'Đây là thư viện công cộng.',
      ],
      [
        'borrow',
        'verb',
        'mượn',
        'I borrow books weekly.',
        'Tôi mượn sách hằng tuần.',
      ],
      [
        'return',
        'verb',
        'trả lại',
        'Return the book on Monday.',
        'Trả sách vào thứ Hai.',
      ],
      [
        'entrance',
        'noun',
        'lối vào',
        'Meet me at the entrance.',
        'Gặp tôi ở lối vào.',
      ],
      [
        'exit',
        'noun',
        'lối ra',
        'The exit is on the right.',
        'Lối ra ở bên phải.',
      ],
      [
        'building',
        'noun',
        'tòa nhà',
        'That building is very old.',
        'Tòa nhà đó rất cũ.',
      ],
      [
        'river',
        'noun',
        'con sông',
        'A river runs through the city.',
        'Một con sông chảy qua thành phố.',
      ],
    ],
  },
  {
    id: 4,
    slug: 'daily-routines-listening',
    title: 'Daily Routines Listening',
    category: 'listening',
    description:
      'Nghe lịch trình thường ngày, phát âm đuôi -s và dùng Hiện tại đơn.',
    grammarTitle: 'Hiện tại đơn và trạng từ tần suất',
    grammar:
      'Hiện tại đơn diễn tả thói quen, sự thật và lịch trình. Với he/she/it, động từ thường thêm -s/-es. Trạng từ tần suất đứng trước động từ thường nhưng sau to be: I usually study; She is always ready.',
    grammarExamples: [
      ['I get up at six.', 'Tôi thức dậy lúc sáu giờ.'],
      [
        'He watches English videos every evening.',
        'Anh ấy xem video tiếng Anh mỗi tối.',
      ],
      ['We are usually free on Sunday.', 'Chúng tôi thường rảnh vào Chủ nhật.'],
    ],
    dialogue: [
      [
        'Anna',
        'What time do you usually get up?',
        'Bạn thường dậy lúc mấy giờ?',
      ],
      [
        'Minh',
        'I get up at six and make breakfast.',
        'Tôi dậy lúc sáu giờ và làm bữa sáng.',
      ],
      [
        'Anna',
        'Do you study English every day?',
        'Bạn học tiếng Anh mỗi ngày không?',
      ],
      [
        'Minh',
        'Yes, I listen on the bus and review at lunch.',
        'Có, tôi nghe trên xe buýt và ôn vào giờ trưa.',
      ],
      ['Anna', 'That is a useful routine.', 'Đó là một thói quen hữu ích.'],
      ['Minh', 'Small steps work for me.', 'Những bước nhỏ phù hợp với tôi.'],
    ],
    readingTitle: 'How Bao Builds a Study Habit',
    reading:
      'Bao works in a busy shop, so he does not have three free hours for English every day. Instead, he uses short moments. He listens to a podcast during his bus ride, repeats useful phrases while walking, and writes three sentences before bed. On Friday, he checks his progress and chooses words to review next week. Bao sometimes misses a day, but he starts again the next morning. His routine is flexible, realistic, and successful.',
    readingTranslation:
      'Bảo làm ở một cửa hàng bận rộn nên không có ba giờ rảnh học tiếng Anh mỗi ngày. Thay vào đó, cậu dùng những khoảng ngắn. Cậu nghe podcast trên xe buýt, lặp lại cụm hữu ích khi đi bộ và viết ba câu trước khi ngủ. Thứ Sáu, cậu kiểm tra tiến độ và chọn từ ôn tuần sau. Đôi khi cậu bỏ lỡ một ngày nhưng bắt đầu lại vào sáng hôm sau. Thói quen của Bảo linh hoạt, thực tế và thành công.',
    listening:
      'Good evening. Here is tomorrow’s study reminder. At seven thirty, watch the five-minute pronunciation video. At lunch, review ten flashcards. At eight p.m., join the speaking room for twenty minutes. Do not worry if you are late; enter quietly and listen first. Regular practice is more important than perfect practice.',
    speaking:
      'Nói về một ngày điển hình của em, từ lúc thức dậy đến trước khi ngủ. Dùng ít nhất bốn trạng từ tần suất.',
    writing: 'Viết kế hoạch học tiếng Anh bảy ngày, khoảng 90 từ.',
    words: [
      [
        'alarm',
        'noun',
        'chuông báo thức',
        'My alarm rings at six.',
        'Chuông báo thức reo lúc sáu giờ.',
      ],
      ['wake up', 'verb', 'thức dậy', 'I wake up early.', 'Tôi thức dậy sớm.'],
      [
        'commute',
        'verb',
        'đi làm/đi học hằng ngày',
        'She commutes by bus.',
        'Cô ấy đi làm bằng xe buýt.',
      ],
      [
        'schedule',
        'noun',
        'lịch trình',
        'Check your study schedule.',
        'Kiểm tra lịch học của bạn.',
      ],
      [
        'appointment',
        'noun',
        'cuộc hẹn',
        'I have a doctor appointment.',
        'Tôi có cuộc hẹn bác sĩ.',
      ],
      [
        'deadline',
        'noun',
        'hạn chót',
        'The deadline is Friday.',
        'Hạn chót là thứ Sáu.',
      ],
      [
        'available',
        'adjective',
        'rảnh/có sẵn',
        'Are you available tonight?',
        'Tối nay bạn rảnh không?',
      ],
      ['early', 'adverb', 'sớm', 'We arrive early.', 'Chúng tôi đến sớm.'],
      ['late', 'adverb', 'muộn', 'Do not stay up late.', 'Đừng thức khuya.'],
      [
        'always',
        'adverb',
        'luôn luôn',
        'She always checks her work.',
        'Cô ấy luôn kiểm tra bài.',
      ],
      [
        'usually',
        'adverb',
        'thường',
        'I usually walk home.',
        'Tôi thường đi bộ về nhà.',
      ],
      [
        'often',
        'adverb',
        'thường xuyên',
        'They often call their parents.',
        'Họ thường gọi cho bố mẹ.',
      ],
      [
        'rarely',
        'adverb',
        'hiếm khi',
        'He rarely drinks coffee.',
        'Anh ấy hiếm khi uống cà phê.',
      ],
      [
        'never',
        'adverb',
        'không bao giờ',
        'I never skip breakfast.',
        'Tôi không bao giờ bỏ bữa sáng.',
      ],
      [
        'habit',
        'noun',
        'thói quen',
        'Reading is a good habit.',
        'Đọc sách là thói quen tốt.',
      ],
      [
        'reminder',
        'noun',
        'lời nhắc',
        'Set a reminder on your phone.',
        'Đặt lời nhắc trên điện thoại.',
      ],
      [
        'focus',
        'verb',
        'tập trung',
        'Focus on one task.',
        'Tập trung vào một việc.',
      ],
      ['break', 'noun', 'giờ nghỉ', 'Take a short break.', 'Hãy nghỉ ngắn.'],
      [
        'progress',
        'noun',
        'tiến bộ',
        'I can see my progress.',
        'Tôi có thể thấy tiến bộ của mình.',
      ],
      [
        'repeat',
        'verb',
        'lặp lại',
        'Repeat the sentence aloud.',
        'Lặp lại câu to.',
      ],
    ],
  },
  {
    id: 5,
    slug: 'service-and-speaking',
    title: 'Service & Speaking',
    category: 'speaking',
    description:
      'Giao tiếp dịch vụ chuyên nghiệp: hỏi thông tin, đề nghị hỗ trợ và xử lý vấn đề lịch sự.',
    grammarTitle: 'Can / Could / Would like trong giao tiếp lịch sự',
    grammar:
      'Can thân thiện, Could lịch sự hơn khi nhờ vả, Would like dùng để gọi món hoặc diễn đạt mong muốn. Giọng lịch sự gồm lời chào, câu hỏi rõ ràng và lời cảm ơn.',
    grammarExamples: [
      ['Could you help me, please?', 'Bạn có thể giúp tôi được không?'],
      ['I would like to book a table.', 'Tôi muốn đặt một bàn.'],
      ['Can I pay by card?', 'Tôi có thể thanh toán bằng thẻ không?'],
    ],
    dialogue: [
      [
        'Guest',
        'Good afternoon. Could you help me with my reservation?',
        'Chào buổi chiều. Bạn có thể giúp tôi về đặt chỗ không?',
      ],
      [
        'Staff',
        'Certainly. May I have your name, please?',
        'Chắc chắn rồi. Tôi có thể xin tên của bạn không?',
      ],
      [
        'Guest',
        'It is Nguyen. I booked a room for two nights.',
        'Tôi là Nguyễn. Tôi đặt phòng hai đêm.',
      ],
      [
        'Staff',
        'I can see your booking. Here is your key card.',
        'Tôi thấy đặt chỗ của bạn. Đây là thẻ phòng.',
      ],
      [
        'Guest',
        'Thank you. Could I have the Wi-Fi password too?',
        'Cảm ơn. Tôi có thể xin mật khẩu Wi-Fi nữa không?',
      ],
      [
        'Staff',
        'Of course. It is written on this card.',
        'Tất nhiên. Nó được ghi trên thẻ này.',
      ],
    ],
    readingTitle: 'A Helpful Customer Service Team',
    reading:
      'At a small hotel in Hoi An, the staff receive a message from a guest whose suitcase has not arrived. Instead of only saying sorry, they ask useful questions and contact the airline. They offer the guest a phone charger, a map, and information about nearby shops. The suitcase arrives the next morning. The guest writes a positive review because the team communicates clearly and acts quickly. Good service means listening carefully and finding practical solutions.',
    readingTranslation:
      'Tại một khách sạn nhỏ ở Hội An, nhân viên nhận tin nhắn từ khách có vali chưa đến. Thay vì chỉ xin lỗi, họ hỏi câu hữu ích và liên lạc hãng bay. Họ cho khách mượn sạc điện thoại, bản đồ và thông tin cửa hàng gần đó. Vali đến sáng hôm sau. Khách viết đánh giá tích cực vì đội ngũ giao tiếp rõ và hành động nhanh. Dịch vụ tốt là lắng nghe kỹ và tìm giải pháp thực tế.',
    listening:
      'Hello, customer support speaking. I am sorry that your order is delayed. I have checked the system, and it will arrive tomorrow before noon. Would you like a text message when the driver is near your address? Thank you for your patience.',
    speaking:
      'Đóng vai nhân viên và khách hàng: một đơn hàng bị chậm. Hỏi thông tin, xin lỗi, đề xuất giải pháp và kết thúc lịch sự.',
    writing:
      'Viết email 80–100 từ cho bộ phận hỗ trợ: nêu vấn đề, mã đơn và giải pháp mong muốn.',
    words: [
      [
        'reservation',
        'noun',
        'đặt chỗ',
        'I have a reservation for tonight.',
        'Tôi có đặt chỗ cho tối nay.',
      ],
      [
        'customer',
        'noun',
        'khách hàng',
        'The customer needs help.',
        'Khách hàng cần giúp đỡ.',
      ],
      [
        'service',
        'noun',
        'dịch vụ',
        'The service is excellent.',
        'Dịch vụ rất tuyệt.',
      ],
      [
        'request',
        'noun',
        'yêu cầu',
        'Your request is clear.',
        'Yêu cầu của bạn rõ ràng.',
      ],
      [
        'assist',
        'verb',
        'hỗ trợ',
        'How can I assist you?',
        'Tôi có thể hỗ trợ bạn thế nào?',
      ],
      [
        'confirm',
        'verb',
        'xác nhận',
        'Please confirm your email.',
        'Vui lòng xác nhận email.',
      ],
      [
        'cancel',
        'verb',
        'hủy',
        'Can I cancel the booking?',
        'Tôi có thể hủy đặt chỗ không?',
      ],
      [
        'available',
        'adjective',
        'còn trống/có sẵn',
        'A table is available.',
        'Có bàn trống.',
      ],
      [
        'payment',
        'noun',
        'thanh toán',
        'Payment is by card.',
        'Thanh toán bằng thẻ.',
      ],
      ['receipt', 'noun', 'biên lai', 'Keep the receipt.', 'Giữ lại biên lai.'],
      [
        'refund',
        'noun',
        'hoàn tiền',
        'Ask for a refund politely.',
        'Hãy yêu cầu hoàn tiền lịch sự.',
      ],
      [
        'delay',
        'noun',
        'sự chậm trễ',
        'We apologize for the delay.',
        'Chúng tôi xin lỗi vì sự chậm trễ.',
      ],
      [
        'problem',
        'noun',
        'vấn đề',
        'Let us solve the problem.',
        'Hãy cùng giải quyết vấn đề.',
      ],
      [
        'solution',
        'noun',
        'giải pháp',
        'This solution is practical.',
        'Giải pháp này thực tế.',
      ],
      [
        'apologize',
        'verb',
        'xin lỗi',
        'I apologize for the mistake.',
        'Tôi xin lỗi vì lỗi này.',
      ],
      [
        'patient',
        'adjective',
        'kiên nhẫn',
        'Thank you for being patient.',
        'Cảm ơn bạn đã kiên nhẫn.',
      ],
      [
        'urgent',
        'adjective',
        'khẩn cấp',
        'This is an urgent request.',
        'Đây là yêu cầu khẩn cấp.',
      ],
      [
        'deliver',
        'verb',
        'giao',
        'They deliver the package today.',
        'Họ giao kiện hàng hôm nay.',
      ],
      [
        'replace',
        'verb',
        'thay thế',
        'We can replace the item.',
        'Chúng tôi có thể thay món hàng.',
      ],
      [
        'satisfied',
        'adjective',
        'hài lòng',
        'The guest is satisfied.',
        'Khách hàng hài lòng.',
      ],
    ],
  },
  {
    id: 6,
    slug: 'emails-and-writing',
    title: 'Emails & Writing',
    category: 'writing',
    description:
      'Viết email rõ ràng từ câu chủ đề đến lời kết, sử dụng liên từ và dấu câu cơ bản.',
    grammarTitle: 'Liên từ và cấu trúc email ngắn',
    grammar:
      'Một email dễ đọc có lời chào, mục đích, chi tiết, hành động mong muốn và lời kết. Dùng because để nêu lý do, but để tương phản, so để nêu kết quả. Mỗi đoạn nên chỉ có một ý chính.',
    grammarExamples: [
      [
        'I am writing because I need information.',
        'Tôi viết vì tôi cần thông tin.',
      ],
      [
        'The course is useful, but the time is difficult.',
        'Khóa học hữu ích nhưng giờ học khó phù hợp.',
      ],
      [
        'Please reply soon, so I can plan.',
        'Vui lòng trả lời sớm để tôi có thể lên kế hoạch.',
      ],
    ],
    dialogue: [
      [
        'Hoa',
        'Can you check my email before I send it?',
        'Bạn có thể kiểm tra email của mình trước khi gửi không?',
      ],
      [
        'David',
        'Sure. What is the purpose of the email?',
        'Được. Mục đích của email là gì?',
      ],
      [
        'Hoa',
        'I want to ask for course information.',
        'Tôi muốn hỏi thông tin khóa học.',
      ],
      [
        'David',
        'Start with a greeting and make your request clear.',
        'Hãy bắt đầu bằng lời chào và nêu yêu cầu rõ ràng.',
      ],
      ['Hoa', 'Should I add a subject line?', 'Tôi có nên thêm tiêu đề không?'],
      [
        'David',
        'Yes. A clear subject saves time for the reader.',
        'Có. Tiêu đề rõ ràng giúp người đọc tiết kiệm thời gian.',
      ],
    ],
    readingTitle: 'An Email That Gets a Quick Reply',
    reading:
      'Dear Ms. Brown, I am writing to ask about the Saturday speaking club. I am a beginner learner, and I would like to know the meeting time, address, and fee. I can attend after two p.m. because I work in the morning. Could you also tell me whether I need to register before coming? Thank you for your help. Best regards, Thu. This email works well because its subject and purpose are clear, and its questions are easy to answer.',
    readingTranslation:
      'Kính gửi cô Brown, tôi viết để hỏi về câu lạc bộ nói thứ Bảy. Tôi là người mới học và muốn biết thời gian họp, địa chỉ và phí. Tôi có thể tham gia sau 2 giờ chiều vì làm buổi sáng. Cô cũng có thể cho tôi biết tôi có cần đăng ký trước không? Cảm ơn cô. Trân trọng, Thu. Email này hiệu quả vì chủ đề và mục đích rõ, các câu hỏi dễ trả lời.',
    listening:
      'Writing tip of the day: before sending an email, read the subject line and first sentence aloud. Check that the reader can understand your purpose in ten seconds. Then check names, dates, attachments, and your polite closing. Clear writing shows respect for the reader’s time.',
    speaking:
      'Giải thích cho bạn cách viết một email lịch sự: các phần cần có và ba cụm từ nên dùng.',
    writing:
      'Viết email 100 từ xin thông tin về một lớp học hoặc câu lạc bộ. Có subject line, greeting, ba câu hỏi và closing.',
    words: [
      [
        'subject line',
        'noun',
        'tiêu đề email',
        'Use a clear subject line.',
        'Hãy dùng tiêu đề email rõ ràng.',
      ],
      [
        'greeting',
        'noun',
        'lời chào',
        'Dear Lan is a greeting.',
        'Dear Lan là lời chào.',
      ],
      [
        'purpose',
        'noun',
        'mục đích',
        'State your purpose early.',
        'Nêu mục đích sớm.',
      ],
      [
        'detail',
        'noun',
        'chi tiết',
        'Add important details.',
        'Thêm chi tiết quan trọng.',
      ],
      [
        'paragraph',
        'noun',
        'đoạn văn',
        'Keep each paragraph short.',
        'Giữ mỗi đoạn ngắn.',
      ],
      [
        'attachment',
        'noun',
        'tệp đính kèm',
        'I attached my document.',
        'Tôi đã đính kèm tài liệu.',
      ],
      [
        'reply',
        'verb',
        'trả lời',
        'Please reply by Friday.',
        'Vui lòng trả lời trước thứ Sáu.',
      ],
      [
        'forward',
        'verb',
        'chuyển tiếp',
        'Forward the email to me.',
        'Chuyển tiếp email cho tôi.',
      ],
      [
        'receive',
        'verb',
        'nhận',
        'Did you receive my message?',
        'Bạn đã nhận tin nhắn của tôi chưa?',
      ],
      [
        'polite',
        'adjective',
        'lịch sự',
        'Use polite language.',
        'Hãy dùng ngôn ngữ lịch sự.',
      ],
      [
        'formal',
        'adjective',
        'trang trọng',
        'This is a formal email.',
        'Đây là email trang trọng.',
      ],
      [
        'informal',
        'adjective',
        'thân mật',
        'Use informal words with friends.',
        'Dùng từ thân mật với bạn bè.',
      ],
      [
        'clarify',
        'verb',
        'làm rõ',
        'Could you clarify the date?',
        'Bạn có thể làm rõ ngày không?',
      ],
      [
        'mention',
        'verb',
        'đề cập',
        'Mention the booking number.',
        'Đề cập mã đặt chỗ.',
      ],
      [
        'include',
        'verb',
        'bao gồm',
        'Include your phone number.',
        'Bao gồm số điện thoại của bạn.',
      ],
      [
        'request',
        'noun',
        'yêu cầu',
        'Make a polite request.',
        'Đưa ra yêu cầu lịch sự.',
      ],
      [
        'because',
        'conjunction',
        'bởi vì',
        'I stayed home because it rained.',
        'Tôi ở nhà vì trời mưa.',
      ],
      [
        'however',
        'adverb',
        'tuy nhiên',
        'However, I can join online.',
        'Tuy nhiên, tôi có thể tham gia trực tuyến.',
      ],
      [
        'therefore',
        'adverb',
        'vì vậy',
        'Therefore, please confirm today.',
        'Vì vậy, vui lòng xác nhận hôm nay.',
      ],
      [
        'regards',
        'noun',
        'lời chào cuối thư',
        'Best regards, Mai.',
        'Trân trọng, Mai.',
      ],
    ],
  },
];

export const foundationLessons = seeds.map(buildLesson);
