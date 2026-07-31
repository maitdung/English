import {
  createProgressionCourse,
  type ProgressionLessonSeed,
} from '../progression/factory';

const a2Seeds: ProgressionLessonSeed[] = [
  {
    id: 1,
    slug: 'a2-plans-and-weekend-activities',
    title: 'Plans & Weekend Activities',
    category: 'conversation' as const,
    description:
      'Make arrangements, discuss preferences and describe weekend experiences using practical A2 language.',
    tags: ['plans', 'weekend', 'future', 'conversation'],
    vocabulary: [
      [
        'arrange',
        '/əˈreɪndʒ/',
        'verb',
        'sắp xếp',
        'We arranged to meet outside the cinema.',
        'Chúng tôi sắp xếp gặp nhau bên ngoài rạp chiếu phim.',
      ],
      [
        'available',
        '/əˈveɪləbl/',
        'adjective',
        'rảnh, có sẵn',
        'Are you available on Saturday afternoon?',
        'Bạn có rảnh vào chiều thứ Bảy không?',
      ],
      [
        'suggestion',
        '/səˈdʒestʃən/',
        'noun',
        'lời đề nghị',
        'Mai made a useful suggestion for the trip.',
        'Mai đưa ra một gợi ý hữu ích cho chuyến đi.',
      ],
      [
        'prefer',
        '/prɪˈfɜː/',
        'verb',
        'thích hơn',
        'I prefer outdoor activities in cool weather.',
        'Tôi thích hoạt động ngoài trời khi thời tiết mát.',
      ],
      [
        'cancel',
        '/ˈkænsəl/',
        'verb',
        'hủy bỏ',
        'They cancelled the picnic because of the storm.',
        'Họ hủy buổi dã ngoại vì cơn bão.',
      ],
      [
        'postpone',
        '/pəʊstˈpəʊn/',
        'verb',
        'hoãn lại',
        'Can we postpone the meeting until Sunday?',
        'Chúng ta có thể hoãn cuộc gặp đến Chủ nhật không?',
      ],
      [
        'crowded',
        '/ˈkraʊdɪd/',
        'adjective',
        'đông đúc',
        'The night market becomes crowded after seven.',
        'Chợ đêm trở nên đông đúc sau bảy giờ.',
      ],
      [
        'relaxing',
        '/rɪˈlæksɪŋ/',
        'adjective',
        'thư giãn',
        'Walking by the lake was very relaxing.',
        'Đi bộ bên hồ rất thư giãn.',
      ],
      [
        'performance',
        '/pəˈfɔːməns/',
        'noun',
        'buổi biểu diễn',
        'The dance performance starts at eight.',
        'Buổi biểu diễn múa bắt đầu lúc tám giờ.',
      ],
      [
        'reservation',
        '/ˌrezəˈveɪʃən/',
        'noun',
        'sự đặt chỗ',
        'I made a reservation for four people.',
        'Tôi đã đặt chỗ cho bốn người.',
      ],
      [
        'instead',
        '/ɪnˈsted/',
        'adverb',
        'thay vào đó',
        'It may rain, so let us visit the museum instead.',
        'Có thể trời mưa, nên thay vào đó hãy đi bảo tàng.',
      ],
      [
        'definitely',
        '/ˈdefɪnətli/',
        'adverb',
        'chắc chắn',
        'I will definitely join you for dinner.',
        'Tôi chắc chắn sẽ tham gia bữa tối cùng bạn.',
      ],
    ],
    grammarTitle: 'be going to and present continuous for plans',
    grammarExplanation:
      'Use be going to for intentions and predictions based on evidence. Use the present continuous for arrangements that already have a time, place or other confirmed detail.',
    grammarExamples: [
      [
        'I am going to try a new sport this weekend.',
        'Cuối tuần này tôi định thử một môn thể thao mới.',
      ],
      [
        'We are meeting Lan at the station at nine.',
        'Chúng tôi sẽ gặp Lan ở nhà ga lúc chín giờ.',
      ],
      [
        'It is going to rain, so take an umbrella.',
        'Trời sắp mưa, vì vậy hãy mang ô.',
      ],
    ],
    dialogueTitle: 'Choosing a Saturday plan',
    dialogue: [
      [
        'An',
        'Are you available this Saturday?',
        'Bạn có rảnh thứ Bảy này không?',
      ],
      [
        'Linh',
        'Yes. I am meeting Hoa for coffee in the morning, but my afternoon is free.',
        'Có. Buổi sáng mình gặp Hoa uống cà phê, nhưng buổi chiều rảnh.',
      ],
      [
        'An',
        'I am going to visit the new art centre. Would you like to come?',
        'Mình định đến trung tâm nghệ thuật mới. Bạn muốn đi cùng không?',
      ],
      [
        'Linh',
        'That sounds good. Is it usually crowded?',
        'Nghe hay đấy. Nơi đó thường đông không?',
      ],
      [
        'An',
        'A little, so I am making a reservation online.',
        'Hơi đông, nên mình đang đặt chỗ trực tuyến.',
      ],
      [
        'Linh',
        'Great. What time are we meeting?',
        'Tuyệt. Mấy giờ chúng ta gặp nhau?',
      ],
      [
        'An',
        'Let us meet at the entrance at two thirty.',
        'Hãy gặp nhau ở lối vào lúc hai giờ rưỡi.',
      ],
      [
        'Linh',
        'Perfect. I will definitely be there.',
        'Hoàn hảo. Mình chắc chắn sẽ đến.',
      ],
    ],
    readingTitle: 'A weekend with a flexible plan',
    readingPassage:
      'Last Friday, Minh and his friends planned a cycling trip for Saturday morning. They checked the route, prepared water and arranged to meet at seven. However, the weather forecast showed heavy rain. Instead of cancelling the whole day, Minh suggested visiting a science museum. The group booked tickets online and met at the bus stop at nine. The museum was crowded, but the interactive exhibitions were interesting. In the afternoon, the rain stopped, so they walked through a nearby park and took photographs. Everyone agreed that the changed plan was still enjoyable because they stayed flexible and made decisions together.',
    readingTranslation:
      'Thứ Sáu tuần trước, Minh và bạn bè lên kế hoạch đi xe đạp vào sáng thứ Bảy. Họ kiểm tra tuyến đường, chuẩn bị nước và hẹn gặp lúc bảy giờ. Tuy nhiên, dự báo có mưa lớn. Thay vì hủy cả ngày, Minh đề nghị thăm bảo tàng khoa học. Nhóm đặt vé trực tuyến và gặp nhau ở trạm xe buýt lúc chín giờ. Bảo tàng đông nhưng các khu trưng bày tương tác rất thú vị. Buổi chiều mưa tạnh, nên họ đi bộ trong công viên gần đó và chụp ảnh. Mọi người đều thấy kế hoạch thay đổi vẫn vui vì họ linh hoạt và cùng nhau quyết định.',
    readingQuestions: [
      {
        question: 'Why did the group change its original plan?',
        options: [
          'The bicycles were broken.',
          'Heavy rain was forecast.',
          'The museum was free.',
          'Minh was late.',
        ],
        answer: 1,
      },
      {
        question: 'What did they do before going to the museum?',
        options: [
          'They booked tickets online.',
          'They ate in the park.',
          'They bought new bicycles.',
          'They cancelled the weekend.',
        ],
        answer: 0,
      },
      {
        question: 'What lesson did the group learn?',
        options: [
          'Outdoor plans are always better.',
          'Flexible planning can still create a good day.',
          'Museums are never crowded.',
          'Friends should plan separately.',
        ],
        answer: 1,
      },
    ],
    listeningTranscript:
      'Hi everyone, this is a quick update about Sunday. The football match is postponed because the field is too wet. Instead, we are meeting at Riverside Sports Centre at ten thirty for badminton. The centre provides rackets, but please bring comfortable shoes and water. After the game, we are having lunch at Green Bowl Café. Please message me before eight tonight if you cannot come, because I need to confirm our reservation.',
    listeningQuestions: [
      {
        question: 'Why was the football match postponed?',
        options: [
          'The team was tired.',
          'The field was too wet.',
          'The centre was closed.',
          'The rackets were missing.',
        ],
        answer: 1,
      },
      {
        question: 'What should participants bring?',
        options: [
          'A football and lunch.',
          'Tickets and a jacket.',
          'Comfortable shoes and water.',
          'A badminton net.',
        ],
        answer: 2,
      },
      {
        question: 'When must people confirm if they cannot attend?',
        options: [
          'Before eight tonight.',
          'At ten thirty.',
          'After lunch.',
          'On Monday morning.',
        ],
        answer: 0,
      },
    ],
    speakingTask:
      'Plan a weekend activity with a partner. Suggest two options, compare them, agree on a time and place, and prepare an alternative plan for bad weather.',
    writingTask:
      'Write a 70–90 word message inviting a friend to a weekend activity. Include the arrangement, what to bring and an alternative if the weather changes.',
    writingSample:
      'Hi Nam, are you available on Saturday? I am going to visit the riverside market, and I would love you to join me. Let us meet at the main gate at 4 p.m. Please bring a light jacket and your camera. If it rains, we can visit the city museum instead. Could you confirm by Friday evening?',
  },
  {
    id: 2,
    slug: 'a2-travel-problems-and-solutions',
    title: 'Travel Problems & Solutions',
    category: 'mixed' as const,
    description:
      'Handle common travel problems, ask for assistance and describe past events clearly and politely.',
    tags: ['travel', 'past-simple', 'problem-solving', 'services'],
    vocabulary: [
      [
        'delay',
        '/dɪˈleɪ/',
        'noun',
        'sự chậm trễ',
        'The train arrived after a forty-minute delay.',
        'Tàu đến sau khi chậm bốn mươi phút.',
      ],
      [
        'platform',
        '/ˈplætfɔːm/',
        'noun',
        'sân ga',
        'Our train leaves from platform six.',
        'Tàu của chúng tôi rời sân ga số sáu.',
      ],
      [
        'connection',
        '/kəˈnekʃən/',
        'noun',
        'chuyến nối',
        'We missed our connection to Hue.',
        'Chúng tôi lỡ chuyến nối đến Huế.',
      ],
      [
        'receipt',
        '/rɪˈsiːt/',
        'noun',
        'hóa đơn',
        'Keep the receipt for your travel claim.',
        'Hãy giữ hóa đơn cho yêu cầu bồi hoàn chuyến đi.',
      ],
      [
        'refund',
        '/ˈriːfʌnd/',
        'noun',
        'tiền hoàn lại',
        'The company offered a full refund.',
        'Công ty đề nghị hoàn tiền toàn bộ.',
      ],
      [
        'replacement',
        '/rɪˈpleɪsmənt/',
        'noun',
        'sự thay thế',
        'The hotel found a replacement room quickly.',
        'Khách sạn nhanh chóng tìm phòng thay thế.',
      ],
      [
        'lost property',
        '/lɒst ˈprɒpəti/',
        'noun',
        'đồ thất lạc',
        'Ask at the lost property office.',
        'Hãy hỏi tại văn phòng đồ thất lạc.',
      ],
      [
        'complaint',
        '/kəmˈpleɪnt/',
        'noun',
        'lời phàn nàn',
        'She made a polite complaint about the noise.',
        'Cô ấy phàn nàn lịch sự về tiếng ồn.',
      ],
      [
        'apologise',
        '/əˈpɒlədʒaɪz/',
        'verb',
        'xin lỗi',
        'The receptionist apologised for the mistake.',
        'Nhân viên lễ tân xin lỗi về sai sót.',
      ],
      [
        'immediately',
        '/ɪˈmiːdiətli/',
        'adverb',
        'ngay lập tức',
        'Staff solved the problem immediately.',
        'Nhân viên giải quyết vấn đề ngay lập tức.',
      ],
      [
        'damaged',
        '/ˈdæmɪdʒd/',
        'adjective',
        'bị hư hỏng',
        'My suitcase was damaged during the flight.',
        'Va-li của tôi bị hỏng trong chuyến bay.',
      ],
      [
        'assistance',
        '/əˈsɪstəns/',
        'noun',
        'sự hỗ trợ',
        'Please ask a member of staff for assistance.',
        'Vui lòng nhờ một nhân viên hỗ trợ.',
      ],
    ],
    grammarTitle: 'past simple and past continuous',
    grammarExplanation:
      'Use the past continuous for an action in progress and the past simple for the shorter event that interrupted it or moved the story forward.',
    grammarExamples: [
      [
        'I was waiting for the bus when I noticed my bag was missing.',
        'Tôi đang đợi xe buýt thì nhận ra túi của mình bị mất.',
      ],
      [
        'While we were checking in, the system stopped working.',
        'Trong khi chúng tôi làm thủ tục, hệ thống ngừng hoạt động.',
      ],
      [
        'The agent apologised and offered a replacement ticket.',
        'Nhân viên xin lỗi và đưa vé thay thế.',
      ],
    ],
    dialogueTitle: 'A missing suitcase',
    dialogue: [
      [
        'Passenger',
        'Excuse me, my suitcase did not arrive on the belt.',
        'Xin lỗi, va-li của tôi không xuất hiện trên băng chuyền.',
      ],
      [
        'Agent',
        'I am sorry to hear that. May I see your baggage receipt?',
        'Tôi rất tiếc. Tôi có thể xem biên nhận hành lý không?',
      ],
      [
        'Passenger',
        'Yes, here it is. I was waiting near belt four.',
        'Vâng, đây ạ. Tôi đã đợi gần băng chuyền số bốn.',
      ],
      [
        'Agent',
        'Can you describe the suitcase?',
        'Bạn có thể mô tả chiếc va-li không?',
      ],
      [
        'Passenger',
        'It is medium-sized, blue and has a red label.',
        'Nó cỡ vừa, màu xanh và có nhãn đỏ.',
      ],
      [
        'Agent',
        'Thank you. The system shows that it stayed in Bangkok.',
        'Cảm ơn. Hệ thống cho thấy nó còn ở Bangkok.',
      ],
      ['Passenger', 'When will I receive it?', 'Khi nào tôi sẽ nhận được?'],
      [
        'Agent',
        'We will deliver it to your hotel tomorrow morning.',
        'Chúng tôi sẽ giao đến khách sạn của bạn vào sáng mai.',
      ],
    ],
    readingTitle: 'How a travel problem became manageable',
    readingPassage:
      'During her first solo trip, Hanh was travelling from Da Nang to Kuala Lumpur when her flight was delayed for three hours. At first, she felt anxious because she had a bus connection after landing. She visited the airline desk, explained the situation calmly and showed her bus reservation. The agent apologised and moved her to an earlier connecting flight through Singapore. Hanh also contacted the bus company and changed her ticket online. She kept every receipt and took screenshots of the new bookings. Although the journey was longer than expected, clear communication and careful records helped her reach the destination without losing money.',
    readingTranslation:
      'Trong chuyến đi một mình đầu tiên, Hạnh đang đi từ Đà Nẵng đến Kuala Lumpur thì chuyến bay bị hoãn ba giờ. Ban đầu cô lo vì có chuyến xe buýt nối tiếp sau khi hạ cánh. Cô đến quầy hãng bay, bình tĩnh giải thích tình huống và đưa đặt chỗ xe buýt. Nhân viên xin lỗi và chuyển cô sang chuyến nối sớm hơn qua Singapore. Hạnh cũng liên hệ công ty xe buýt và đổi vé trực tuyến. Cô giữ mọi hóa đơn và chụp màn hình đặt chỗ mới. Dù hành trình dài hơn dự kiến, giao tiếp rõ ràng và lưu hồ sơ cẩn thận giúp cô đến nơi mà không mất tiền.',
    readingQuestions: [
      {
        question: 'What was Hanh worried about?',
        options: [
          'Losing her passport.',
          'Missing a bus connection.',
          'Finding a hotel.',
          'Buying food.',
        ],
        answer: 1,
      },
      {
        question: 'How did the airline agent help?',
        options: [
          'By giving her cash.',
          'By cancelling the trip.',
          'By moving her to an earlier connection.',
          'By booking a hotel.',
        ],
        answer: 2,
      },
      {
        question: 'What helped Hanh manage the problem?',
        options: [
          'Ignoring the delay.',
          'Clear communication and careful records.',
          'Travelling without reservations.',
          'Waiting silently.',
        ],
        answer: 1,
      },
    ],
    listeningTranscript:
      'Attention passengers travelling to Nha Trang on service SE8. The train is currently delayed by approximately twenty-five minutes because of a technical inspection. Please remain near platform three and watch the information screens. Passengers with connections in Nha Trang should speak to the assistance desk beside the main entrance. Keep your ticket and any receipts if you need to make a delay claim. We apologise for the inconvenience and will provide another update at six fifteen.',
    listeningQuestions: [
      {
        question: 'How long is the expected delay?',
        options: [
          'Fifteen minutes.',
          'Twenty-five minutes.',
          'Thirty-five minutes.',
          'One hour.',
        ],
        answer: 1,
      },
      {
        question: 'Where should passengers with connections go?',
        options: [
          'Platform eight.',
          'The café.',
          'The assistance desk.',
          'The ticket machine.',
        ],
        answer: 2,
      },
      {
        question: 'Why should passengers keep receipts?',
        options: [
          'To buy food.',
          'To make a delay claim.',
          'To enter the platform.',
          'To change seats.',
        ],
        answer: 1,
      },
    ],
    speakingTask:
      'Role-play a conversation at a service desk. Explain a delayed journey or lost item, provide details, ask for a solution and confirm the next step.',
    writingTask:
      'Write an 80–100 word polite complaint about a travel problem. Describe what happened, explain its effect and request a reasonable solution.',
    writingSample:
      'Dear Customer Service, I am writing about train SE8 on 12 May. While I was waiting on platform three, the service was delayed for more than two hours. As a result, I missed my connection and had to buy another ticket. I have attached both receipts. Could you please review my case and provide a refund for the replacement ticket?',
  },
  {
    id: 3,
    slug: 'a2-healthy-routines-and-community',
    title: 'Healthy Routines & Community',
    category: 'mixed' as const,
    description:
      'Discuss habits, give practical advice and take part in simple community health initiatives.',
    tags: ['health', 'advice', 'habits', 'community'],
    vocabulary: [
      [
        'balanced',
        '/ˈbælənst/',
        'adjective',
        'cân bằng',
        'A balanced meal includes several food groups.',
        'Một bữa ăn cân bằng gồm nhiều nhóm thực phẩm.',
      ],
      [
        'habit',
        '/ˈhæbɪt/',
        'noun',
        'thói quen',
        'Walking after dinner became a healthy habit.',
        'Đi bộ sau bữa tối trở thành thói quen lành mạnh.',
      ],
      [
        'energy',
        '/ˈenədʒi/',
        'noun',
        'năng lượng',
        'A short break can improve your energy.',
        'Một khoảng nghỉ ngắn có thể cải thiện năng lượng.',
      ],
      [
        'hydrated',
        '/haɪˈdreɪtɪd/',
        'adjective',
        'đủ nước',
        'Drink regularly to stay hydrated.',
        'Hãy uống đều để cơ thể đủ nước.',
      ],
      [
        'stress',
        '/stres/',
        'noun',
        'căng thẳng',
        'Deep breathing may reduce stress.',
        'Hít thở sâu có thể giảm căng thẳng.',
      ],
      [
        'stretch',
        '/stretʃ/',
        'verb',
        'duỗi cơ',
        'Remember to stretch before exercise.',
        'Hãy nhớ duỗi cơ trước khi tập.',
      ],
      [
        'volunteer',
        '/ˌvɒlənˈtɪə/',
        'verb',
        'tình nguyện',
        'Many students volunteer at the health fair.',
        'Nhiều học sinh tình nguyện tại hội chợ sức khỏe.',
      ],
      [
        'encourage',
        '/ɪnˈkʌrɪdʒ/',
        'verb',
        'khuyến khích',
        'Friends can encourage each other to exercise.',
        'Bạn bè có thể khuyến khích nhau tập thể dục.',
      ],
      [
        'routine',
        '/ruːˈtiːn/',
        'noun',
        'lịch sinh hoạt',
        'Her morning routine begins with a glass of water.',
        'Lịch buổi sáng của cô ấy bắt đầu bằng một cốc nước.',
      ],
      [
        'portion',
        '/ˈpɔːʃən/',
        'noun',
        'khẩu phần',
        'Choose a smaller portion of fried food.',
        'Hãy chọn khẩu phần đồ chiên nhỏ hơn.',
      ],
      [
        'regularly',
        '/ˈreɡjələli/',
        'adverb',
        'đều đặn',
        'He checks his progress regularly.',
        'Anh ấy kiểm tra tiến độ đều đặn.',
      ],
      [
        'well-being',
        '/ˌwel ˈbiːɪŋ/',
        'noun',
        'sức khỏe toàn diện',
        'Sleep supports physical and mental well-being.',
        'Giấc ngủ hỗ trợ sức khỏe thể chất và tinh thần.',
      ],
    ],
    grammarTitle: 'should, must and have to for advice and obligation',
    grammarExplanation:
      'Use should for advice, must for a strong rule from the speaker and have to for an external rule or practical necessity.',
    grammarExamples: [
      [
        'You should take a short walk during lunch.',
        'Bạn nên đi bộ ngắn trong giờ trưa.',
      ],
      [
        'Visitors must wash their hands before entering.',
        'Khách phải rửa tay trước khi vào.',
      ],
      [
        'I have to take this medicine with food.',
        'Tôi phải uống thuốc này cùng thức ăn.',
      ],
    ],
    dialogueTitle: 'Planning a healthy community week',
    dialogue: [
      [
        'Mai',
        'Our neighbourhood is organising a healthy living week.',
        'Khu phố của chúng ta đang tổ chức tuần sống khỏe.',
      ],
      [
        'Bao',
        'That is a good idea. What activities are planned?',
        'Đó là ý hay. Có những hoạt động gì?',
      ],
      [
        'Mai',
        'There will be morning walks and a cooking workshop.',
        'Sẽ có đi bộ buổi sáng và hội thảo nấu ăn.',
      ],
      [
        'Bao',
        'Should participants bring anything?',
        'Người tham gia có nên mang gì không?',
      ],
      [
        'Mai',
        'They should bring water, and they must wear comfortable shoes.',
        'Họ nên mang nước và phải đi giày thoải mái.',
      ],
      [
        'Bao',
        'I can volunteer at the information desk.',
        'Mình có thể tình nguyện ở bàn thông tin.',
      ],
      [
        'Mai',
        'Great. We also have to prepare signs for each activity.',
        'Tuyệt. Chúng ta cũng phải chuẩn bị biển cho từng hoạt động.',
      ],
      [
        'Bao',
        'Let us ask the school art club to help.',
        'Hãy nhờ câu lạc bộ mỹ thuật của trường giúp.',
      ],
    ],
    readingTitle: 'Small habits, shared results',
    readingPassage:
      'A community centre in Can Tho recently ran a four-week well-being challenge. Participants did not follow a strict diet or difficult exercise programme. Instead, they chose three small habits: drinking more water, walking for twenty minutes and turning off screens before bed. Each person recorded progress on a simple card and met the group every Saturday. Volunteers shared affordable recipes and organised short stretching sessions. At the end, most participants reported better sleep and more energy. The organisers explained that the social support was important: people continued because friends noticed their effort, celebrated small improvements and helped them restart after a difficult day.',
    readingTranslation:
      'Một trung tâm cộng đồng ở Cần Thơ gần đây tổ chức thử thách sức khỏe kéo dài bốn tuần. Người tham gia không theo chế độ ăn nghiêm ngặt hay chương trình tập khó. Thay vào đó, họ chọn ba thói quen nhỏ: uống nhiều nước hơn, đi bộ hai mươi phút và tắt màn hình trước khi ngủ. Mỗi người ghi tiến độ vào thẻ đơn giản và gặp nhóm mỗi thứ Bảy. Tình nguyện viên chia sẻ công thức tiết kiệm và tổ chức các buổi duỗi cơ ngắn. Cuối chương trình, phần lớn người tham gia ngủ tốt hơn và có nhiều năng lượng hơn. Ban tổ chức giải thích rằng hỗ trợ xã hội rất quan trọng: mọi người tiếp tục vì bạn bè ghi nhận nỗ lực, ăn mừng tiến bộ nhỏ và giúp họ bắt đầu lại sau một ngày khó khăn.',
    readingQuestions: [
      {
        question: 'How many habits did participants choose?',
        options: ['Two.', 'Three.', 'Four.', 'Seven.'],
        answer: 1,
      },
      {
        question: 'What did volunteers provide?',
        options: [
          'Expensive equipment.',
          'Medical treatment.',
          'Affordable recipes and stretching sessions.',
          'Daily exams.',
        ],
        answer: 2,
      },
      {
        question: 'Why was social support important?',
        options: [
          'It made the programme stricter.',
          'It helped people continue and restart.',
          'It removed the need for sleep.',
          'It replaced all exercise.',
        ],
        answer: 1,
      },
    ],
    listeningTranscript:
      'Welcome to the Saturday health fair. Free health checks are available in Room A until two o’clock. The healthy cooking demonstration begins at eleven in the main hall, and the family exercise class starts at twelve thirty outside. You should wear comfortable clothes for the class and bring a bottle of water. Children under twelve must stay with an adult. If you would like to volunteer next month, please leave your name at the information desk.',
    listeningQuestions: [
      {
        question: 'Where are the free health checks?',
        options: [
          'Outside.',
          'In Room A.',
          'At the information desk.',
          'In the kitchen.',
        ],
        answer: 1,
      },
      {
        question: 'What should people bring to the exercise class?',
        options: ['A chair.', 'Food.', 'A bottle of water.', 'A medical form.'],
        answer: 2,
      },
      {
        question: 'What rule applies to children under twelve?',
        options: [
          'They must stay with an adult.',
          'They cannot enter Room A.',
          'They must volunteer.',
          'They need special shoes.',
        ],
        answer: 0,
      },
    ],
    speakingTask:
      'Give a friend advice about improving one daily habit. Ask about the problem, suggest three realistic actions and agree on a one-week goal.',
    writingTask:
      'Write an 80–100 word community notice for a healthy activity. Include the purpose, time, place, what people should bring and one important rule.',
    writingSample:
      'Join our Sunday Morning Walk at Riverside Park from 7 to 8 a.m. The activity is suitable for beginners and aims to improve energy and well-being. Participants should bring water, wear comfortable shoes and arrive ten minutes early. Children under twelve must come with an adult. Registration is free at the community centre before Friday.',
  },
];

export const a2Course = createProgressionCourse(
  'english-a2-everyday-progress',
  'A2',
  'English A2 Everyday Progress',
  'An elementary English programme that develops confident everyday communication through connected topics, practical grammar and integrated skills.',
  a2Seeds,
);

export default a2Course;
