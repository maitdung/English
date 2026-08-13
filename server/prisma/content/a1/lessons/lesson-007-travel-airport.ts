const lesson = {
  slug: 'travel-and-airport',
  title: 'Travel and Airport',
  description:
    'Learn essential vocabulary for traveling by plane, navigating the airport, and using the Past Simple tense to describe trips.',
  type: 'comprehensive_lesson',
  durationMinutes: 120,
  content: {
    warmup:
      'Have you ever traveled by plane? What do you usually do when you arrive at the airport? Today, we will learn how to navigate an airport and talk about past trips.',
    objectives: [
      'Identify and use common airport and travel vocabulary.',
      'Understand flight announcements and check-in dialogues.',
      'Use the Past Simple tense to talk about completed actions in the past.',
      'Use prepositions of movement (through, to, into) correctly.',
    ],
    pronunciation: {
      focus: "The '-ed' ending in regular Past Simple verbs (/t/, /d/, /ɪd/).",
      tips: "If the verb ends in a voiceless sound (like p, k, sh, ch), '-ed' sounds like /t/ (e.g., booked). If it ends in a voiced sound (like l, n, v, or vowels), it sounds like /d/ (e.g., arrived). If it ends in /t/ or /d/, it sounds like /ɪd/ (e.g., landed, boarded).",
    },
    grammarNotes: [
      {
        topic: 'Past Simple Tense',
        explanation:
          "We use the Past Simple to talk about actions that started and finished in the past. Regular verbs add '-ed' (book -> booked, arrive -> arrived). Irregular verbs change their form (go -> went, take -> took, fly -> flew).",
        examples: [
          'I booked my ticket online yesterday. (Tôi đã đặt vé trực tuyến vào ngày hôm qua.)',
          'We flew to Paris last summer. (Chúng tôi đã bay đến Paris vào mùa hè năm ngoái.)',
          "The plane didn't leave on time. (Máy bay đã không khởi hành đúng giờ.)",
          'Did you check in your luggage? (Bạn đã ký gửi hành lý chưa?)',
        ],
      },
      {
        topic: 'Prepositions of Movement',
        explanation:
          "We use prepositions of movement to show the direction in which someone or something is going. 'To' shows the destination. 'Through' means moving from one side of something to the other. 'Into' means moving inside something.",
        examples: [
          'We walked to the boarding gate. (Chúng tôi đã đi bộ đến cổng lên máy bay.)',
          'You must go through security. (Bạn phải đi qua cửa an ninh.)',
          'The passengers walked into the plane. (Các hành khách đã đi vào trong máy bay.)',
        ],
      },
    ],
    dialogues: [
      {
        title: 'At the Check-in Desk',
        translation: 'Tại quầy làm thủ tục',
        lines: [
          {
            speaker: 'Agent',
            english:
              'Good morning. Can I see your passport and ticket, please?',
            vietnamese:
              'Chào buổi sáng. Xin vui lòng cho tôi xem hộ chiếu và vé của bạn?',
          },
          {
            speaker: 'Passenger',
            english: 'Here they are.',
            vietnamese: 'Chúng đây ạ.',
          },
          {
            speaker: 'Agent',
            english: 'Thank you. Are you checking any bags?',
            vietnamese: 'Cảm ơn. Bạn có ký gửi hành lý nào không?',
          },
          {
            speaker: 'Passenger',
            english: 'Just this one suitcase.',
            vietnamese: 'Chỉ một chiếc vali này thôi.',
          },
          {
            speaker: 'Agent',
            english:
              'Please put it on the scale. Would you like a window seat or an aisle seat?',
            vietnamese:
              'Vui lòng đặt nó lên cân. Bạn muốn ghế cạnh cửa sổ hay ghế cạnh lối đi?',
          },
          {
            speaker: 'Passenger',
            english: 'An aisle seat, please.',
            vietnamese: 'Làm ơn cho ghế cạnh lối đi.',
          },
          {
            speaker: 'Agent',
            english:
              'Here is your boarding pass. Your flight leaves from Gate 12. Have a good flight!',
            vietnamese:
              'Đây là thẻ lên máy bay của bạn. Chuyến bay của bạn khởi hành từ Cổng 12. Chúc bạn có một chuyến bay tốt đẹp!',
          },
        ],
      },
      {
        title: 'Going Through Security',
        translation: 'Đi qua khu vực an ninh',
        lines: [
          {
            speaker: 'Officer',
            english:
              'Please put your bags in the tray. Take off your shoes and jacket.',
            vietnamese:
              'Vui lòng đặt túi của bạn vào khay. Cởi giày và áo khoác ra.',
          },
          {
            speaker: 'Passenger',
            english: 'Do I need to take out my laptop?',
            vietnamese: 'Tôi có cần lấy máy tính xách tay ra không?',
          },
          {
            speaker: 'Officer',
            english: 'Yes, please put laptops and liquids in a separate tray.',
            vietnamese:
              'Có, vui lòng để máy tính xách tay và chất lỏng vào một khay riêng.',
          },
          {
            speaker: 'Passenger',
            english: 'Okay, done. Can I walk through the scanner now?',
            vietnamese:
              'Được rồi, xong rồi. Bây giờ tôi có thể đi qua máy quét chưa?',
          },
          {
            speaker: 'Officer',
            english: 'Yes, please walk through.',
            vietnamese: 'Vâng, xin mời đi qua.',
          },
        ],
      },
    ],
    listening: {
      preQuestions: [
        'Why do flights sometimes get delayed?',
        'What information do you usually hear in an airport announcement?',
      ],
      transcript:
        'Attention all passengers on flight VN123 to Tokyo. This flight is delayed by forty-five minutes due to bad weather at the destination. The new departure time is 2:30 PM. Please remain in the departure lounge. We will announce boarding as soon as the plane is ready. We apologize for the inconvenience. In the meantime, passengers can enjoy a free drink at the airport cafe using their boarding pass. Thank you for your patience.',
      translation:
        'Xin lưu ý tất cả hành khách trên chuyến bay VN123 đi Tokyo. Chuyến bay này bị hoãn 45 phút do thời tiết xấu ở điểm đến. Thời gian khởi hành mới là 2:30 chiều. Vui lòng ở lại trong phòng chờ khởi hành. Chúng tôi sẽ thông báo lên máy bay ngay khi máy bay sẵn sàng. Chúng tôi xin lỗi vì sự bất tiện này. Trong thời gian chờ đợi, hành khách có thể thưởng thức đồ uống miễn phí tại quán cà phê sân bay bằng thẻ lên máy bay của mình. Cảm ơn sự kiên nhẫn của quý khách.',
    },
    reading: {
      text: "Last summer, Sarah took her first international flight to London. She arrived at the airport three hours before her departure time because she was very nervous. First, she looked at the large departure board to find her check-in desk. When she got there, the friendly airline staff checked her passport and weighed her suitcase. Fortunately, her luggage was not too heavy. She received her boarding pass and walked to the security check. At security, she had to take off her shoes, remove her laptop from her backpack, and put everything into a plastic tray. After passing through the metal detector safely, she gathered her things and walked to the duty-free shops. She bought a small bottle of water and a magazine to read. Then, she checked the screens again and saw that her flight was delayed by thirty minutes. She walked to Gate 15 and sat down to wait. Finally, they announced boarding. She showed her boarding pass and passport one last time and walked into the plane. She had a window seat, so she could look outside. The flight attendants were very friendly and explained the safety rules. When the plane took off, Sarah felt a little bit scared, but also very excited. During the flight, she watched a movie and ate a hot meal. Twelve hours later, the plane landed safely at Heathrow Airport. Sarah smiled as she walked out of the plane and headed towards customs. She knew that passing through customs would take some time, but she didn't mind. Her great adventure in the United Kingdom had finally begun.",
      translation:
        'Mùa hè năm ngoái, Sarah đã thực hiện chuyến bay quốc tế đầu tiên đến London. Cô đến sân bay ba giờ trước giờ khởi hành vì rất lo lắng. Đầu tiên, cô nhìn vào bảng khởi hành lớn để tìm quầy làm thủ tục. Khi đến đó, nhân viên hàng không thân thiện đã kiểm tra hộ chiếu và cân chiếc vali của cô. May mắn thay, hành lý của cô không quá nặng. Cô nhận được thẻ lên máy bay và đi đến khu vực kiểm tra an ninh. Tại khu vực an ninh, cô phải cởi giày, lấy máy tính xách tay ra khỏi ba lô và đặt mọi thứ vào một khay nhựa. Sau khi đi qua máy dò kim loại an toàn, cô thu dọn đồ đạc và đi đến các cửa hàng miễn thuế. Cô mua một chai nước nhỏ và một cuốn tạp chí để đọc. Sau đó, cô kiểm tra màn hình một lần nữa và thấy chuyến bay của mình bị hoãn 30 phút. Cô đi bộ đến Cổng 15 và ngồi xuống đợi. Cuối cùng, họ cũng thông báo lên máy bay. Cô xuất trình thẻ lên máy bay và hộ chiếu lần cuối và bước vào máy bay. Cô có ghế cạnh cửa sổ, vì vậy cô có thể nhìn ra ngoài. Các tiếp viên hàng không rất thân thiện và giải thích các quy tắc an toàn. Khi máy bay cất cánh, Sarah cảm thấy hơi sợ hãi một chút, nhưng cũng rất phấn khích. Trong suốt chuyến bay, cô đã xem một bộ phim và ăn một bữa ăn nóng. Mười hai giờ sau, máy bay hạ cánh an toàn xuống Sân bay Heathrow. Sarah mỉm cười khi bước ra khỏi máy bay và hướng về phía hải quan. Cô biết rằng việc đi qua hải quan sẽ mất một thời gian, nhưng cô không bận tâm. Cuộc phiêu lưu tuyệt vời của cô tại Vương quốc Anh cuối cùng đã bắt đầu.',
    },
    speaking: {
      task: 'Role-play with a partner. Student A is the check-in agent. Student B is the passenger. The passenger wants to check in for a flight to New York, check one bag, and request a window seat.',
      prompts: [
        'Where are you flying to today?',
        'Can I have your passport?',
        'Did you pack your bags yourself?',
        'Here is your boarding pass.',
      ],
      sampleAnswer:
        'Agent: Hello, where are you flying to today?\nPassenger: I am flying to New York.\nAgent: Can I have your passport, please?\nPassenger: Yes, here it is.\nAgent: Do you have any bags to check?\nPassenger: Yes, just this one suitcase.\nAgent: Would you like a window seat or an aisle seat?\nPassenger: A window seat, please.\nAgent: Here is your boarding pass. Your gate is 24.',
    },
    writing: {
      task: 'Write a short paragraph (60-80 words) about your last trip. Where did you go? How did you travel? What did you do at the airport?',
      usefulLanguage: [
        'Last year / Last month, I traveled to...',
        'I went by plane / car / train.',
        'When I arrived at the airport, I...',
        'First, I went to...',
        'Then, I...',
      ],
      checklist: [
        'Did you use the Past Simple tense?',
        'Did you use airport vocabulary?',
        "Are your sentences connected with words like 'first', 'then', 'after that'?",
      ],
      sampleAnswer:
        'Last year, I traveled to Japan for a holiday. I went by plane. I arrived at the airport early in the morning. First, I went to the check-in desk to drop off my suitcase. The agent gave me my boarding pass. Then, I went through security. It was very fast. After that, I bought a coffee and walked to my gate. The flight was great and we landed on time.',
    },
    practice:
      'Complete these exercises to master your airport vocabulary and the Past Simple tense.',
    review:
      'Remember: Use Past Simple for completed actions. Regular verbs end in -ed. Irregular verbs must be memorized. At the airport, you check in, go through security, wait at the gate, and board the plane.',
    miniTest: 'Test your skills with the 40 questions below.',
    homework:
      'Find an English flight ticket online. Write down 5 pieces of information you can see on it (e.g., flight number, gate, seat).',
  },
  vocabularies: [
    {
      word: 'airport',
      ipa: '/ˈeəpɔːt/',
      partOfSpeech: 'noun',
      meaning:
        'a place where planes land and take off and that has buildings for passengers to wait in',
      example: 'We need to be at the airport two hours before the flight.',
      translation: 'sân bay',
      pronunciationTips: 'Stress is on the first syllable: AIR-port.',
      commonMistakes:
        "Don't forget the 'r' sound in the middle if using American pronunciation.",
    },
    {
      word: 'passport',
      ipa: '/ˈpɑːspɔːt/',
      partOfSpeech: 'noun',
      meaning:
        'an official document containing personal information and usually a photograph that allows a person to travel to foreign countries',
      example: 'Please show your passport at the check-in desk.',
      translation: 'hộ chiếu',
      pronunciationTips: 'Stress on the first syllable.',
      commonMistakes: "Make sure to pronounce both 'p's clearly.",
    },
    {
      word: 'ticket',
      ipa: '/ˈtɪkɪt/',
      partOfSpeech: 'noun',
      meaning:
        'a printed piece of paper that gives you the right to travel on a train, bus, plane, etc.',
      example: 'I bought a plane ticket to Tokyo.',
      translation: 'vé',
      exampleTranslation: 'Tôi đã mua một vé máy bay đến Tokyo.',
      pronunciationTips: "Short 'i' sound.",
      commonMistakes: "Often confused with 'boarding pass' at the airport.",
    },
    {
      word: 'boarding pass',
      ipa: '/ˈbɔːdɪŋ pɑːs/',
      partOfSpeech: 'noun',
      meaning: 'a piece of paper you must show to get on an aircraft',
      example: 'You cannot enter the plane without your boarding pass.',
      translation: 'thẻ lên máy bay',
      pronunciationTips: "Stress is on 'boarding'.",
      commonMistakes:
        "Don't call it a 'ticket' after you check in; it is a boarding pass.",
    },
    {
      word: 'luggage',
      ipa: '/ˈlʌɡɪdʒ/',
      partOfSpeech: 'noun',
      meaning:
        'the bags, suitcases, etc. that contain your things and that you take with you when you are travelling',
      example: 'We have two pieces of luggage.',
      translation: 'hành lý',
      pronunciationTips: "Ends with a /dʒ/ sound, similar to 'j' in 'jump'.",
      commonMistakes: "Luggage is uncountable. Do not say 'luggages'.",
    },
    {
      word: 'suitcase',
      ipa: '/ˈsuːtkeɪs/',
      partOfSpeech: 'noun',
      meaning:
        'a large, rectangular container with a handle, for carrying clothes and possessions while travelling',
      example: 'My suitcase is very heavy.',
      translation: 'vali',
      pronunciationTips: "The 'ui' is pronounced like 'oo' in 'soon'.",
      commonMistakes:
        'Unlike luggage, suitcase is countable (one suitcase, two suitcases).',
    },
    {
      word: 'check-in desk',
      ipa: '/ˈtʃek ɪn desk/',
      partOfSpeech: 'noun',
      meaning:
        'the place at the airport where you show your ticket and leave your large bags',
      example: 'Drop your bags at the check-in desk.',
      translation: 'quầy làm thủ tục',
      pronunciationTips: "Link the 'k' in check to the 'i' in in: che-kin.",
      commonMistakes: "Sometimes just called 'check-in'.",
    },
    {
      word: 'security',
      ipa: '/sɪˈkjʊərəti/',
      partOfSpeech: 'noun',
      meaning:
        'the place in an airport where passengers and their bags are checked before they can get on a plane',
      example: 'You cannot take large bottles of liquid through security.',
      translation: 'khu vực an ninh',
      pronunciationTips: 'Stress is on the second syllable: se-CU-ri-ty.',
      commonMistakes: 'Often mispronounced with stress on the first syllable.',
    },
    {
      word: 'gate',
      ipa: '/ɡeɪt/',
      partOfSpeech: 'noun',
      meaning:
        'the part of an airport where passengers get on or off an aircraft',
      example: 'Our flight leaves from gate 24.',
      translation: 'cổng',
      pronunciationTips: "Long 'a' sound.",
      commonMistakes: "Make sure to pronounce the final 't' sound.",
    },
    {
      word: 'flight',
      ipa: '/flaɪt/',
      partOfSpeech: 'noun',
      meaning: 'a journey in an aircraft',
      example: 'The flight to New York takes eight hours.',
      translation: 'chuyến bay',
      pronunciationTips: "The 'gh' is silent.",
      commonMistakes: "Do not confuse with 'fly' (verb).",
    },
    {
      word: 'passenger',
      ipa: '/ˈpæsɪndʒə(r)/',
      partOfSpeech: 'noun',
      meaning:
        'a person who is travelling in a vehicle but is not driving it, flying it, or working on it',
      example: 'All passengers must fasten their seatbelts.',
      translation: 'hành khách',
      pronunciationTips: 'Stress on the first syllable.',
      commonMistakes: "Spelling mistake: often misspelled as 'passanger'.",
    },
    {
      word: 'delay',
      ipa: '/dɪˈleɪ/',
      partOfSpeech: 'noun/verb',
      meaning:
        'a situation in which you have to wait longer than expected for something to happen',
      example: 'There is a delay because of the snow.',
      translation: 'sự chậm trễ, hoãn',
      pronunciationTips: 'Stress is on the second syllable.',
      commonMistakes: "Used as an adjective with 'ed': The flight is delayed.",
    },
    {
      word: 'board',
      ipa: '/bɔːd/',
      partOfSpeech: 'verb',
      meaning:
        'to get onto or allow people to get onto a boat, train, or aircraft',
      example: "It's time to board the plane.",
      translation: 'lên (máy bay, tàu)',
      pronunciationTips: "Rhymes with 'lord'.",
      commonMistakes: "Often confused with 'broad' or 'bored' in writing.",
    },
    {
      word: 'take off',
      ipa: '/teɪk ɒf/',
      partOfSpeech: 'phrasal verb',
      meaning: 'when an aircraft leaves the ground and begins to fly',
      example: 'The plane will take off in ten minutes.',
      translation: 'cất cánh',
      pronunciationTips: "Link the 'k' in take to the 'o' in off.",
      commonMistakes:
        "Also means to remove clothing, e.g., 'take off your shoes'.",
    },
    {
      word: 'land',
      ipa: '/lænd/',
      partOfSpeech: 'verb',
      meaning:
        'to arrive on the ground or other surface after moving down through the air',
      example: 'The flight landed safely at 7 PM.',
      translation: 'hạ cánh',
      pronunciationTips: "Open your mouth wide for the short 'a' sound.",
      commonMistakes: "As a noun, it means 'đất', but here it is a verb.",
    },
    {
      word: 'customs',
      ipa: '/ˈkʌstəmz/',
      partOfSpeech: 'noun',
      meaning:
        "the place at a port, airport, or border where travelers' bags are examined for illegal or taxable goods",
      example: 'We had to open our bags at customs.',
      translation: 'hải quan',
      pronunciationTips: "Pronounce the 's' at the end like a 'z'.",
      commonMistakes:
        "Do not confuse with 'custom' (phong tục). It always has an 's' for the airport area.",
    },
    {
      word: 'destination',
      ipa: '/ˌdestɪˈneɪʃn/',
      partOfSpeech: 'noun',
      meaning:
        'the place where someone is going or where something is being sent',
      example: 'Tokyo is our final destination.',
      translation: 'điểm đến',
      pronunciationTips: 'Stress is on the third syllable: nay.',
      commonMistakes: 'Make sure to pronounce all 4 syllables clearly.',
    },
    {
      word: 'aisle',
      ipa: '/aɪl/',
      partOfSpeech: 'noun',
      meaning:
        'a long, narrow space between rows of seats in an aircraft, cinema, or church',
      example: 'I prefer an aisle seat so I can stand up easily.',
      translation: 'lối đi',
      pronunciationTips:
        "The 's' is silent. It is pronounced exactly like 'I'll'.",
      commonMistakes: "Do not say 'ai-zul'.",
    },
    {
      word: 'window seat',
      ipa: '/ˈwɪndəʊ siːt/',
      partOfSpeech: 'noun',
      meaning: 'a seat that is next to a window on a plane, train, or bus',
      example: 'She loves the window seat to look at the clouds.',
      translation: 'ghế cạnh cửa sổ',
      pronunciationTips: "Stress is usually on 'window'.",
      commonMistakes: "Don't confuse with 'aisle seat'.",
    },
    {
      word: 'flight attendant',
      ipa: '/flaɪt əˈtendənt/',
      partOfSpeech: 'noun',
      meaning: 'someone whose job is to look after passengers on an aircraft',
      example: 'The flight attendant brought us some water.',
      translation: 'tiếp viên hàng không',
      pronunciationTips: "Stress is on 'ten' in attendant.",
      commonMistakes: "Modern term; replaces 'stewardess' or 'steward'.",
    },
  ],
  exercises: [
    {
      type: 'multiple_choice',
      question:
        'You need to show your _______ before you can fly to another country.',
      options: ['destination', 'passport', 'flight', 'aisle'],
      correctAnswer: 'passport',
      explanation:
        'A passport is the official document needed for international travel.',
      points: 2,
    },
    {
      type: 'multiple_choice',
      question: 'I have two large _______ to check in.',
      options: ['luggages', 'suitcases', 'passports', 'gates'],
      correctAnswer: 'suitcases',
      explanation: 'Suitcase is countable. Luggage is uncountable.',
      points: 2,
    },
    {
      type: 'multiple_choice',
      question: 'The plane will _______ at 8:00 AM.',
      options: ['take off', 'board', 'gate', 'customs'],
      correctAnswer: 'take off',
      explanation: 'Take off means to leave the ground and begin to fly.',
      points: 2,
    },
    {
      type: 'multiple_choice',
      question: 'Our flight leaves from _______ 15.',
      options: ['check-in', 'security', 'gate', 'aisle'],
      correctAnswer: 'gate',
      explanation: 'Passengers get on the aircraft at the gate.',
      points: 2,
    },
    {
      type: 'multiple_choice',
      question:
        'I usually prefer a(n) _______ seat because I like to look out at the clouds.',
      options: ['aisle', 'window', 'front', 'delay'],
      correctAnswer: 'window',
      explanation: 'A window seat is next to the window.',
      points: 2,
    },
    {
      type: 'multiple_choice',
      question: 'We waited for an hour because there was a weather _______.',
      options: ['delay', 'luggage', 'customs', 'board'],
      correctAnswer: 'delay',
      explanation:
        'A delay is a situation where you wait longer than expected.',
      points: 2,
    },
    {
      type: 'multiple_choice',
      question: 'Yesterday, I _______ my flight online.',
      options: ['book', 'booked', 'booking', 'books'],
      correctAnswer: 'booked',
      explanation:
        'Use Past Simple (booked) for actions finished in the past (yesterday).',
      points: 2,
    },
    {
      type: 'multiple_choice',
      question: 'They _______ to Paris last summer.',
      options: ['flew', 'fly', 'flied', 'flying'],
      correctAnswer: 'flew',
      explanation: "The past simple of 'fly' is 'flew'.",
      points: 2,
    },
    {
      type: 'multiple_choice',
      question:
        'He _______ check in his bags because he only had a small backpack.',
      options: ["don't", "doesn't", "didn't", "wasn't"],
      correctAnswer: "didn't",
      explanation:
        "Use 'didn't' to make negative sentences in the Past Simple.",
      points: 2,
    },
    {
      type: 'multiple_choice',
      question: 'We walked _______ the metal detector at security.',
      options: ['to', 'into', 'through', 'on'],
      correctAnswer: 'through',
      explanation: 'Through means moving from one side to the other.',
      points: 2,
    },
    {
      type: 'fill_blank',
      question: 'You must go to the check-in _______ to drop off your bags.',
      correctAnswer: 'desk',
      explanation: 'The check-in desk is where you start the process.',
      points: 2,
    },
    {
      type: 'fill_blank',
      question: 'A _______ is a person travelling on a plane.',
      correctAnswer: 'passenger',
      explanation: 'Passengers are people who travel in vehicles.',
      points: 2,
    },
    {
      type: 'fill_blank',
      question:
        'The flight _______ brought us food and drinks during the flight.',
      correctAnswer: 'attendant',
      explanation: 'A flight attendant takes care of passengers.',
      points: 2,
    },
    {
      type: 'fill_blank',
      question:
        'When we arrive, we have to go through _______ so they can check our bags.',
      correctAnswer: 'customs',
      explanation: 'Customs is where they check for taxable or illegal goods.',
      points: 2,
    },
    {
      type: 'fill_blank',
      question: 'The plane _______ safely on the runway at 5 PM.',
      correctAnswer: 'landed',
      explanation: "Use the past tense 'landed'.",
      points: 2,
    },
    {
      type: 'matching',
      question: 'Match the word with its opposite or related concept: take off',
      options: ['land', 'customs', 'aisle', 'suitcase'],
      correctAnswer: 'land',
      explanation: 'Take off is the opposite of land.',
      points: 2,
    },
    {
      type: 'matching',
      question:
        'Match the word with its opposite or related concept: window seat',
      options: ['aisle seat', 'boarding pass', 'flight', 'delay'],
      correctAnswer: 'aisle seat',
      explanation:
        'Window seat and aisle seat are the two main types of seats.',
      points: 2,
    },
    {
      type: 'matching',
      question: 'Match the word with its opposite or related concept: ticket',
      options: ['boarding pass', 'security', 'passenger', 'delay'],
      correctAnswer: 'boarding pass',
      explanation: 'You use your ticket to get your boarding pass.',
      points: 2,
    },
    {
      type: 'matching',
      question: 'Match the word with its opposite or related concept: bag',
      options: ['luggage', 'customs', 'gate', 'flight'],
      correctAnswer: 'luggage',
      explanation: 'Luggage is a synonym for bags/suitcases.',
      points: 2,
    },
    {
      type: 'matching',
      question: 'Match the word with its opposite or related concept: fly',
      options: ['flight', 'check-in', 'security', 'passenger'],
      correctAnswer: 'flight',
      explanation: 'Flight is the noun form of fly.',
      points: 2,
    },
    {
      type: 'sentence_order',
      question:
        'Order the words to make a sentence: showed / my / I / passport / agent / to / the',
      options: ['I', 'showed', 'my', 'passport', 'to', 'the', 'agent'],
      correctAnswer: 'I showed my passport to the agent',
      explanation: 'Subject + verb + object + preposition + noun.',
      points: 2,
    },
    {
      type: 'sentence_order',
      question:
        'Order the words to make a sentence: went / security / We / through / fast / very',
      options: ['We', 'went', 'through', 'security', 'very', 'fast'],
      correctAnswer: 'We went through security very fast',
      explanation: 'Subject + verb + prepositional phrase + adverb.',
      points: 2,
    },
    {
      type: 'sentence_order',
      question:
        'Order the words to make a sentence: time / did / What / plane / the / land / ?',
      options: ['What', 'time', 'did', 'the', 'plane', 'land', '?'],
      correctAnswer: 'What time did the plane land ?',
      explanation: 'Question word + auxiliary verb + subject + main verb.',
      points: 2,
    },
    {
      type: 'sentence_order',
      question:
        'Order the words to make a sentence: flight / was / delayed / The / an / by / hour',
      options: ['The', 'flight', 'was', 'delayed', 'by', 'an', 'hour'],
      correctAnswer: 'The flight was delayed by an hour',
      explanation: 'Subject + passive verb + preposition + time.',
      points: 2,
    },
    {
      type: 'sentence_order',
      question:
        'Order the words to make a sentence: took / shoes / his / He / off',
      options: ['He', 'took', 'his', 'shoes', 'off'],
      correctAnswer: 'He took his shoes off',
      explanation: 'Subject + phrasal verb + object.',
      points: 2,
    },
    {
      type: 'true_false',
      question:
        "True or False: The word 'luggage' is countable, so you can say 'two luggages'.",
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation:
        "Luggage is uncountable. You should say 'two bags' or 'two pieces of luggage'.",
      points: 2,
    },
    {
      type: 'true_false',
      question: "True or False: The past tense of 'go' is 'went'.",
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: "'Go' is an irregular verb.",
      points: 2,
    },
    {
      type: 'true_false',
      question:
        'True or False: You show your boarding pass when you want to get on the plane.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'A boarding pass is required to board the aircraft.',
      points: 2,
    },
    {
      type: 'true_false',
      question:
        'True or False: A window seat is next to the aisle where people walk.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation:
        'An aisle seat is next to the aisle. A window seat is next to the window.',
      points: 2,
    },
    {
      type: 'true_false',
      question:
        "True or False: 'Customs' is the place where they check for illegal items in your bags after you arrive.",
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'This is the correct definition of customs.',
      points: 2,
    },
    {
      type: 'listening_question',
      question: 'According to the listening, why is flight VN123 delayed?',
      options: ['Bad weather', 'A broken plane', 'No pilot', 'Lost luggage'],
      correctAnswer: 'Bad weather',
      explanation:
        "The announcement states the flight is delayed 'due to bad weather at the destination'.",
      points: 2,
    },
    {
      type: 'listening_question',
      question: 'According to the listening, how long is the delay?',
      options: [
        'Thirty minutes',
        'Forty-five minutes',
        'One hour',
        'Two hours',
      ],
      correctAnswer: 'Forty-five minutes',
      explanation: "The announcement says 'delayed by forty-five minutes'.",
      points: 2,
    },
    {
      type: 'listening_question',
      question: 'According to the listening, what can passengers get for free?',
      options: ['A meal', 'A magazine', 'A drink', 'A hotel room'],
      correctAnswer: 'A drink',
      explanation: 'Passengers can enjoy a free drink at the airport cafe.',
      points: 2,
    },
    {
      type: 'listening_question',
      question: 'According to the listening, where should the passengers wait?',
      options: [
        'At the check-in desk',
        'In the departure lounge',
        'In the cafe',
        'On the plane',
      ],
      correctAnswer: 'In the departure lounge',
      explanation:
        "The announcement asks them to 'remain in the departure lounge'.",
      points: 2,
    },
    {
      type: 'listening_question',
      question:
        'According to the listening, what do passengers need to show to get the free item?',
      options: ['Passport', 'Ticket', 'Luggage', 'Boarding pass'],
      correctAnswer: 'Boarding pass',
      explanation: "They can get it 'using their boarding pass'.",
      points: 2,
    },
    {
      type: 'reading_question',
      question:
        'According to the reading, how many hours before the flight did Sarah arrive at the airport?',
      options: ['One hour', 'Two hours', 'Three hours', 'Four hours'],
      correctAnswer: 'Three hours',
      explanation:
        "The text says 'She arrived at the airport three hours before her departure time'.",
      points: 2,
    },
    {
      type: 'reading_question',
      question:
        'According to the reading, what did Sarah have to remove from her backpack at security?',
      options: ['Shoes', 'Water', 'Laptop', 'Magazine'],
      correctAnswer: 'Laptop',
      explanation:
        "The text says she had to 'remove her laptop from her backpack'.",
      points: 2,
    },
    {
      type: 'reading_question',
      question: 'According to the reading, what kind of seat did Sarah have?',
      options: ['Aisle seat', 'Middle seat', 'Window seat', 'Front seat'],
      correctAnswer: 'Window seat',
      explanation:
        "The text says 'She had a window seat, so she could look outside.'",
      points: 2,
    },
    {
      type: 'reading_question',
      question: "According to the reading, how long was Sarah's flight?",
      options: ['Three hours', 'Ten hours', 'Twelve hours', 'Fifteen hours'],
      correctAnswer: 'Twelve hours',
      explanation:
        "The text mentions 'Twelve hours later, the plane landed safely'.",
      points: 2,
    },
    {
      type: 'reading_question',
      question:
        'According to the reading, how did Sarah feel when the plane took off?',
      options: [
        'Angry and tired',
        'Scared but excited',
        'Bored and sleepy',
        'Hungry and thirsty',
      ],
      correctAnswer: 'Scared but excited',
      explanation:
        "The text says 'Sarah felt a little bit scared, but also very excited.'",
      points: 2,
    },
  ],
};
export default lesson;
