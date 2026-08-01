import { toeicPracticeSets } from "./toeicCatalog";
import type { PracticeSet } from "../types/practice";

const corePracticeSets: PracticeSet[] = [
  {
    id: "vocabulary-everyday-essentials",
    title: "Everyday English Essentials",
    description:
      "Ôn những từ và cụm từ thiết yếu để xử lý các tình huống hằng ngày.",
    skill: "vocabulary",
    level: "A1",
    duration: 9,
    icon: "🌱",
    accent: "cyan",
    tags: ["daily life", "essential words", "polite English"],
    featured: true,
    exercises: [
      {
        id: "vocabulary-everyday-essentials-01",
        type: "multiple-choice",
        instruction: "Chọn từ hoàn thành câu tự nhiên nhất.",
        prompt: "Could I have a glass of _____, please?",
        options: ["water", "station", "early", "carry"],
        correctAnswer: 0,
        explanation:
          "“A glass of water” là cụm từ tự nhiên khi gọi một cốc nước.",
        hint: "Đáp án là một thứ có thể uống.",
      },
      {
        id: "vocabulary-everyday-essentials-02",
        type: "fill-blank",
        instruction: "Điền một động từ phù hợp.",
        prompt: "I _____ breakfast at seven every morning.",
        correctAnswer: "have",
        acceptedAnswers: ["have"],
        placeholder: "Nhập một từ...",
        explanation:
          "Tiếng Anh dùng cụm “have breakfast” để nói về việc ăn sáng.",
        hint: "Không dùng “eat” trong cụm cố định phổ biến này.",
      },
      {
        id: "vocabulary-everyday-essentials-03",
        type: "multiple-choice",
        instruction: "Chọn nghĩa đúng của từ in đậm.",
        prompt: "Can I borrow your pen for a minute? What does “borrow” mean?",
        options: [
          "Cho ai đó một món đồ vĩnh viễn",
          "Mượn và sẽ trả lại",
          "Mua một món đồ",
          "Làm mất một món đồ",
        ],
        correctAnswer: 1,
        explanation:
          "“Borrow” nghĩa là nhận một vật để dùng tạm thời rồi trả lại.",
        hint: "Người nói chỉ cần chiếc bút trong một phút.",
      },
      {
        id: "vocabulary-everyday-essentials-04",
        type: "reorder",
        instruction: "Sắp xếp các từ thành một lời nhờ lịch sự; có thể bỏ dấu câu.",
        prompt: "Tạo câu yêu cầu người khác nói lại.",
        tokens: ["repeat", "Could", "that", "you", "please"],
        correctAnswer: "Could you repeat that please",
        explanation:
          "Mẫu “Could you + động từ...?” tạo một lời yêu cầu lịch sự: “Could you repeat that, please?”",
        hint: "Bắt đầu bằng “Could you”.",
      },
    ],
  },
  {
    id: "vocabulary-workplace-collocations",
    title: "Workplace Collocations",
    description:
      "Luyện các cụm từ thường xuất hiện trong email, cuộc họp và dự án.",
    skill: "vocabulary",
    level: "B1",
    duration: 10,
    icon: "💼",
    accent: "blue",
    tags: ["workplace", "collocations", "email"],
    exercises: [
      {
        id: "vocabulary-workplace-collocations-01",
        type: "multiple-choice",
        instruction: "Chọn động từ đi cùng danh từ tự nhiên nhất.",
        prompt: "We need to _____ the deadline by two days.",
        options: ["extend", "grow", "stretch up", "rise"],
        correctAnswer: 0,
        explanation:
          "“Extend a deadline” nghĩa là gia hạn thời hạn hoàn thành công việc.",
        hint: "Tìm động từ có nghĩa là gia hạn.",
      },
      {
        id: "vocabulary-workplace-collocations-02",
        type: "fill-blank",
        instruction: "Điền một từ để tạo collocation đúng.",
        prompt: "Please _____ me an update before Friday.",
        correctAnswer: "give",
        acceptedAnswers: ["give", "send"],
        placeholder: "give / send...",
        explanation:
          "“Give me an update” và “send me an update” đều là cách diễn đạt tự nhiên.",
        hint: "Có hai đáp án thông dụng được chấp nhận.",
      },
      {
        id: "vocabulary-workplace-collocations-03",
        type: "multiple-choice",
        instruction: "Chọn cách diễn đạt đúng nghĩa.",
        prompt: "If you “raise a concern”, what do you do?",
        options: [
          "Bạn che giấu một vấn đề",
          "Bạn nêu ra điều khiến mình lo ngại",
          "Bạn hoàn tất một dự án",
          "Bạn tăng lương cho đồng nghiệp",
        ],
        correctAnswer: 1,
        explanation:
          "“Raise a concern” là nêu một vấn đề hoặc sự lo ngại để mọi người xem xét.",
        hint: "“Raise” ở đây gần nghĩa với “bring up”.",
      },
      {
        id: "vocabulary-workplace-collocations-04",
        type: "reorder",
        instruction: "Sắp xếp thành một câu email tự nhiên; có thể bỏ dấu câu.",
        prompt: "Tạo câu xác nhận bạn sẽ phản hồi sớm.",
        tokens: ["soon", "get", "you", "I'll", "to", "back"],
        correctAnswer: "I'll get back to you soon",
        explanation:
          "“Get back to someone” nghĩa là liên hệ hoặc phản hồi lại người đó.",
        hint: "Đặt “I'll” ở đầu và “soon” ở cuối.",
      },
    ],
  },
  {
    id: "listening-daily-details",
    title: "Listen for Daily Details",
    description:
      "Nghe giờ giấc, địa điểm và thông tin quen thuộc trong các câu ngắn.",
    skill: "listening",
    level: "A1",
    duration: 9,
    icon: "🎧",
    accent: "blue",
    tags: ["details", "time", "daily routines"],
    exercises: [
      {
        id: "listening-daily-details-01",
        type: "listening-choice",
        instruction: "Nghe câu và chọn thời gian đúng.",
        prompt: "What time does the café close today?",
        transcript: "The café closes at six o'clock today.",
        options: ["At five", "At six", "At seven", "At eight"],
        correctAnswer: 1,
        explanation:
          "Người nói nêu trực tiếp “closes at six o'clock”.",
        hint: "Tập trung vào con số sau từ “at”.",
      },
      {
        id: "listening-daily-details-02",
        type: "dictation",
        instruction: "Nghe và chép lại toàn bộ câu.",
        prompt: "Viết chính xác câu bạn nghe được.",
        audioText: "Please leave your bag by the door.",
        correctAnswer: "Please leave your bag by the door.",
        acceptedAnswers: ["Please leave your bag by the door"],
        placeholder: "Please...",
        explanation:
          "Câu yêu cầu đặt chiếc túi cạnh cửa: “Please leave your bag by the door.”",
        hint: "Cụm chỉ vị trí là “by the door”.",
      },
      {
        id: "listening-daily-details-03",
        type: "listening-choice",
        instruction: "Nghe và chọn đáp án đúng.",
        prompt: "Which bus does Anna take?",
        transcript:
          "Anna takes the number twelve bus to school every morning.",
        options: ["Bus 10", "Bus 11", "Bus 12", "Bus 20"],
        correctAnswer: 2,
        explanation:
          "Cụm “the number twelve bus” cho biết Anna đi xe buýt số 12.",
        hint: "Nghe số xuất hiện ngay trước từ “bus”.",
      },
      {
        id: "listening-daily-details-04",
        type: "dictation",
        instruction: "Nghe và nhập lại câu hoàn chỉnh.",
        prompt: "Chép lại câu nói về nghề nghiệp.",
        audioText: "My brother works in a small hotel.",
        correctAnswer: "My brother works in a small hotel.",
        acceptedAnswers: ["My brother works in a small hotel"],
        placeholder: "My brother...",
        explanation:
          "Với chủ ngữ số ít “my brother”, động từ là “works”.",
        hint: "Chú ý âm /s/ ở cuối “works”.",
      },
    ],
  },
  {
    id: "listening-workplace-decisions",
    title: "Workplace Decisions",
    description:
      "Nghe thông báo và trao đổi công việc để xác định lý do, quyết định và bước tiếp theo.",
    skill: "listening",
    level: "B1",
    duration: 12,
    icon: "🎙️",
    accent: "violet",
    tags: ["meetings", "decisions", "inference"],
    featured: true,
    exercises: [
      {
        id: "listening-workplace-decisions-01",
        type: "listening-choice",
        instruction: "Nghe thông báo và chọn lý do chính.",
        prompt: "Why has the meeting been moved?",
        transcript:
          "We've moved the planning meeting to Thursday afternoon because the director will be visiting a client on Wednesday.",
        options: [
          "The meeting room is too small.",
          "The director is unavailable on Wednesday.",
          "The client requested a presentation.",
          "The team finished the project early.",
        ],
        correctAnswer: 1,
        explanation:
          "Giám đốc đi gặp khách hàng vào thứ Tư nên không thể dự họp hôm đó.",
        hint: "Nghe phần theo sau “because”.",
      },
      {
        id: "listening-workplace-decisions-02",
        type: "listening-choice",
        instruction: "Nghe và xác định hành động tiếp theo.",
        prompt: "What should Maya do next?",
        transcript:
          "Maya, the figures look accurate now. Please add the regional totals and send the final report to finance before lunch.",
        options: [
          "Check every figure again",
          "Call the regional manager",
          "Add the totals and send the report",
          "Wait until tomorrow morning",
        ],
        correctAnswer: 2,
        explanation:
          "Người nói yêu cầu Maya thêm tổng theo khu vực rồi gửi báo cáo cho phòng tài chính.",
        hint: "Tìm hai động từ mệnh lệnh sau từ “Please”.",
      },
      {
        id: "listening-workplace-decisions-03",
        type: "dictation",
        instruction: "Nghe và chép lại câu thông báo.",
        prompt: "Viết lại chính xác quyết định về hạn chót.",
        audioText:
          "We've agreed to extend the deadline until next Tuesday.",
        correctAnswer:
          "We've agreed to extend the deadline until next Tuesday.",
        acceptedAnswers: [
          "We've agreed to extend the deadline until next Tuesday",
          "We have agreed to extend the deadline until next Tuesday",
        ],
        placeholder: "We've agreed...",
        explanation:
          "Câu dùng “agree to + verb” và cụm “extend the deadline”.",
        hint: "Mốc thời gian kết thúc bằng “next Tuesday”.",
      },
      {
        id: "listening-workplace-decisions-04",
        type: "listening-choice",
        instruction: "Nghe và suy ra thái độ của người nói.",
        prompt: "How does the speaker feel about the proposal?",
        transcript:
          "The proposal has potential, but I'd like to see clearer cost estimates before we approve it.",
        options: [
          "Completely opposed",
          "Interested but cautious",
          "Ready to approve it immediately",
          "Unaware of the proposal",
        ],
        correctAnswer: 1,
        explanation:
          "“Has potential” thể hiện quan tâm, còn yêu cầu số liệu rõ hơn cho thấy sự thận trọng.",
        hint: "Chú ý sự tương phản trước và sau từ “but”.",
      },
    ],
  },
  {
    id: "speaking-social-confidence",
    title: "Social Confidence",
    description:
      "Nói đuổi các mẫu câu A2 để bắt đầu và duy trì hội thoại tự nhiên.",
    skill: "speaking",
    level: "A2",
    duration: 10,
    icon: "🗣️",
    accent: "violet",
    tags: ["shadowing", "small talk", "pronunciation"],
    exercises: [
      {
        id: "speaking-social-confidence-01",
        type: "shadowing",
        instruction: "Nghe mẫu rồi nói theo ba lần, tăng dần tốc độ.",
        prompt: "Giới thiệu bản thân ngắn gọn.",
        modelText:
          "Hi, I'm Linh. I live in Da Nang, and I'm learning English for work.",
        focusPoints: ["Nối âm “I'm learning”", "Nhấn “Da Nang” và “work”", "Giữ tốc độ đều"],
        explanation:
          "Một phần giới thiệu tự nhiên gồm tên, nơi sống và lý do học.",
        hint: "Chia câu thành ba cụm ý trước khi nói liền mạch.",
      },
      {
        id: "speaking-social-confidence-02",
        type: "shadowing",
        instruction: "Nghe, đánh dấu từ được nhấn rồi nói theo.",
        prompt: "Hỏi thêm thông tin để tiếp tục cuộc trò chuyện.",
        modelText: "That sounds interesting. How did you get started?",
        focusPoints: ["Nhấn “interesting”", "Lên giọng nhẹ ở câu hỏi", "Đọc rõ âm cuối /d/"],
        explanation:
          "Câu hỏi mở “How did you get started?” khuyến khích người kia kể thêm.",
        hint: "Đừng dừng quá lâu giữa hai câu.",
      },
      {
        id: "speaking-social-confidence-03",
        type: "shadowing",
        instruction: "Nói theo với ngữ điệu lịch sự.",
        prompt: "Gọi món tại quán cà phê.",
        modelText: "Could I have a chicken sandwich and a glass of water, please?",
        focusPoints: ["Âm /dʒ/ trong “chicken”", "Nhấn món ăn và đồ uống", "Hạ giọng ở cuối câu"],
        explanation:
          "“Could I have...?” là mẫu gọi món lịch sự và rất thông dụng.",
        hint: "Nói nhẹ từ “Could” và nhấn vào món cần gọi.",
      },
      {
        id: "speaking-social-confidence-04",
        type: "shadowing",
        instruction: "Nghe rồi nói theo, chú ý nhịp câu.",
        prompt: "Xác nhận bạn đã hiểu chỉ đường.",
        modelText: "So I turn left at the bank, and the station is on my right.",
        focusPoints: ["Nhấn “left”, “bank”, “right”", "Ngắt nhẹ sau “bank”", "Đọc rõ âm /t/ cuối"],
        explanation:
          "Lặp lại chỉ dẫn bằng lời của mình giúp xác nhận thông tin và tránh nhầm đường.",
        hint: "Dùng ngữ điệu xác nhận, không đọc như hai câu hỏi rời.",
      },
    ],
  },
  {
    id: "speaking-professional-shadowing",
    title: "Professional Shadowing",
    description:
      "Luyện nhịp, trọng âm và cách diễn đạt chuyên nghiệp trong cuộc họp.",
    skill: "speaking",
    level: "B2",
    duration: 12,
    icon: "🎤",
    accent: "rose",
    tags: ["meetings", "intonation", "professional English"],
    exercises: [
      {
        id: "speaking-professional-shadowing-01",
        type: "shadowing",
        instruction: "Nghe mẫu, chia cụm ý và nói theo ba lần.",
        prompt: "Nêu quan điểm có cân nhắc.",
        modelText:
          "From my perspective, the faster option is attractive, but it carries more risk.",
        focusPoints: ["Nhấn “faster”, “attractive”, “risk”", "Ngắt sau “perspective”", "Thể hiện tương phản ở “but”"],
        explanation:
          "Cấu trúc này nêu ý kiến rồi cân bằng lợi ích với rủi ro.",
        hint: "Hạ giọng nhẹ trước “but”, sau đó nhấn mạnh vế đối lập.",
      },
      {
        id: "speaking-professional-shadowing-02",
        type: "shadowing",
        instruction: "Nói theo với giọng lịch sự, rõ ràng.",
        prompt: "Yêu cầu người khác làm rõ số liệu.",
        modelText:
          "Could you walk us through the assumptions behind these figures?",
        focusPoints: ["Nối âm “walk us”", "Nhấn “assumptions” và “figures”", "Lên giọng nhẹ cuối câu"],
        explanation:
          "“Walk us through” là yêu cầu ai đó giải thích từng bước hoặc chi tiết.",
        hint: "Không đọc “walk” và “us” thành hai từ tách rời.",
      },
      {
        id: "speaking-professional-shadowing-03",
        type: "shadowing",
        instruction: "Nghe và bắt chước ngữ điệu bất đồng mềm mỏng.",
        prompt: "Phản biện mà vẫn giữ tính hợp tác.",
        modelText:
          "I see your point; however, we may be underestimating the implementation time.",
        focusPoints: ["Giọng đồng thuận ở “I see your point”", "Nhấn “however”", "Đọc rõ “underestimating”"],
        explanation:
          "Thừa nhận quan điểm trước khi phản biện giúp lời nói chuyên nghiệp hơn.",
        hint: "Ngắt rõ ở dấu chấm phẩy.",
      },
      {
        id: "speaking-professional-shadowing-04",
        type: "shadowing",
        instruction: "Nói theo và dùng nhịp chuyển ý rõ ràng.",
        prompt: "Chuyển từ vấn đề sang giải pháp.",
        modelText:
          "Now that we've identified the main constraint, let's look at two practical solutions.",
        focusPoints: ["Nhấn “main constraint”", "Nối âm “let's look”", "Nhấn số “two”"],
        explanation:
          "“Now that...” tạo một bước chuyển logic từ phân tích sang hành động.",
        hint: "Ngắt nhẹ sau “constraint”.",
      },
    ],
  },
  {
    id: "reading-everyday-notices",
    title: "Everyday Notices",
    description:
      "Đọc thông báo ngắn và xác định mục đích, thời gian cùng hành động cần làm.",
    skill: "reading",
    level: "A2",
    duration: 10,
    icon: "📖",
    accent: "emerald",
    tags: ["notices", "main idea", "details"],
    exercises: [
      {
        id: "reading-everyday-notices-01",
        type: "multiple-choice",
        instruction: "Đọc thông báo và chọn mục đích chính.",
        prompt:
          "NOTICE: The community pool will close at 4 p.m. on Friday for staff training. It will reopen at 8 a.m. on Saturday. Why was this notice written?",
        options: [
          "To advertise swimming lessons",
          "To explain a temporary closure",
          "To recruit new staff",
          "To change the ticket price",
        ],
        correctAnswer: 1,
        explanation:
          "Thông báo giải thích hồ bơi đóng sớm vì nhân viên tham gia đào tạo.",
        hint: "Tìm thông tin về việc đóng và mở lại.",
      },
      {
        id: "reading-everyday-notices-02",
        type: "multiple-choice",
        instruction: "Đọc tin nhắn và chọn hành động cần làm.",
        prompt:
          "Hi Sam, your parcel is at the front desk. Please collect it before reception closes at 7 p.m. What should Sam do?",
        options: [
          "Call the delivery driver",
          "Pick up the parcel before 7 p.m.",
          "Leave the parcel at reception",
          "Pay for a new parcel",
        ],
        correctAnswer: 1,
        explanation:
          "Tin nhắn yêu cầu Sam lấy bưu kiện trước khi quầy lễ tân đóng lúc 7 giờ.",
        hint: "Chú ý câu bắt đầu bằng “Please”.",
      },
      {
        id: "reading-everyday-notices-03",
        type: "fill-blank",
        instruction: "Đọc bảng chỉ dẫn và điền từ còn thiếu.",
        prompt:
          "LIBRARY: Return all books at the main desk. Do not leave them on the _____.",
        correctAnswer: "tables",
        acceptedAnswers: ["tables", "table"],
        placeholder: "Nhập từ chỉ đồ vật...",
        explanation:
          "Chỉ dẫn yêu cầu trả sách tại quầy chính, thay vì để sách trên bàn.",
        hint: "Đây là nơi người đọc thường đặt sách khi ngồi học.",
      },
      {
        id: "reading-everyday-notices-04",
        type: "multiple-choice",
        instruction: "Đọc email và xác định thời điểm.",
        prompt:
          "The Tuesday yoga class is full, but two places are still available on Thursday evening. When can the reader attend?",
        options: [
          "Tuesday morning",
          "Tuesday evening",
          "Thursday evening",
          "Friday afternoon",
        ],
        correctAnswer: 2,
        explanation:
          "Lớp thứ Ba đã đầy; chỉ lớp tối thứ Năm còn chỗ.",
        hint: "Tìm cụm “still available”.",
      },
    ],
  },
  {
    id: "reading-ideas-and-inference",
    title: "Ideas and Inference",
    description:
      "Đọc các đoạn B2 ngắn để nhận diện lập luận, hàm ý và từ vựng trong ngữ cảnh.",
    skill: "reading",
    level: "B2",
    duration: 13,
    icon: "📰",
    accent: "emerald",
    tags: ["inference", "argument", "context clues"],
    exercises: [
      {
        id: "reading-ideas-and-inference-01",
        type: "multiple-choice",
        instruction: "Đọc đoạn văn và chọn ý chính.",
        prompt:
          "Remote work saves commuting time, but it does not automatically improve productivity. Teams benefit most when they agree on response times, document decisions, and reserve meetings for issues that genuinely require discussion. What is the writer's main point?",
        options: [
          "Remote work always reduces productivity.",
          "Clear working practices make remote work more effective.",
          "All decisions should be made in meetings.",
          "Commuting is useful for teamwork.",
        ],
        correctAnswer: 1,
        explanation:
          "Tác giả nhấn mạnh các quy ước rõ ràng giúp làm việc từ xa hiệu quả, thay vì khẳng định bản thân hình thức này luôn tốt.",
        hint: "Câu thứ hai nêu điều kiện để các nhóm đạt kết quả tốt nhất.",
      },
      {
        id: "reading-ideas-and-inference-02",
        type: "multiple-choice",
        instruction: "Đọc và suy ra lý do.",
        prompt:
          "The museum introduced free Friday evenings last spring. Visitor numbers rose sharply, yet gift-shop revenue barely changed because most new visitors were students. Why did revenue probably remain stable?",
        options: [
          "The museum closed its gift shop.",
          "Students were not allowed to buy gifts.",
          "Many additional visitors spent little in the shop.",
          "Friday tickets became more expensive.",
        ],
        correctAnswer: 2,
        explanation:
          "Đoạn văn cho biết khách mới chủ yếu là sinh viên, từ đó có thể suy ra mức chi tiêu tại cửa hàng thấp.",
        hint: "Kết nối nhóm khách mới với hành vi chi tiêu có khả năng xảy ra.",
      },
      {
        id: "reading-ideas-and-inference-03",
        type: "multiple-choice",
        instruction: "Chọn nghĩa của từ theo ngữ cảnh.",
        prompt:
          "The council's first proposal was rejected, so it presented a revised plan with a more modest budget. In this sentence, “modest” most nearly means:",
        options: ["secret", "limited", "unnecessary", "unpredictable"],
        correctAnswer: 1,
        explanation:
          "Trong ngữ cảnh ngân sách, “modest” nghĩa là không quá lớn hoặc ở mức hạn chế.",
        hint: "Kế hoạch mới được điều chỉnh sau khi đề xuất đầu tiên bị từ chối.",
      },
      {
        id: "reading-ideas-and-inference-04",
        type: "fill-blank",
        instruction: "Điền từ nối thể hiện sự tương phản.",
        prompt:
          "The device is expensive; _____, its low energy use may reduce long-term costs.",
        correctAnswer: "however",
        acceptedAnswers: ["however", "nevertheless"],
        placeholder: "Nhập từ nối...",
        explanation:
          "“However” hoặc “nevertheless” nối hai ý tương phản: giá mua cao nhưng chi phí dài hạn có thể thấp.",
        hint: "Cần một trạng từ nối mang nghĩa “tuy nhiên”.",
      },
    ],
  },
  {
    id: "writing-practical-messages",
    title: "Practical Messages",
    description:
      "Viết tin nhắn và email A2 rõ ràng với mục đích cụ thể.",
    skill: "writing",
    level: "A2",
    duration: 14,
    icon: "✍️",
    accent: "amber",
    tags: ["messages", "email", "functional writing"],
    exercises: [
      {
        id: "writing-practical-messages-01",
        type: "guided-writing",
        instruction: "Viết email ngắn, lịch sự và đủ ba ý trong đề.",
        prompt:
          "Write to your teacher. Explain that you cannot attend tomorrow's class, give a reason, and ask for the homework.",
        placeholder: "Dear Ms. Hoa,\nI'm sorry, but...",
        minimumWords: 35,
        checklist: [
          { label: "Có lời chào", keywords: ["dear", "hello", "hi"] },
          { label: "Nêu việc không thể tham dự", keywords: ["cannot attend", "can't attend", "miss class"] },
          { label: "Đưa ra lý do", keywords: ["because", "appointment", "sick", "work"] },
          { label: "Hỏi bài tập", keywords: ["homework", "assignment"] },
        ],
        sampleAnswer:
          "Dear Ms. Hoa, I'm sorry, but I can't attend tomorrow's class because I have a medical appointment. Could you please send me the homework so I can catch up? Best wishes, Minh",
        explanation:
          "Một email xin nghỉ nên nêu rõ buổi học, lý do và hành động mong muốn.",
        hint: "Dùng “Could you please...?” cho lời nhờ lịch sự.",
      },
      {
        id: "writing-practical-messages-02",
        type: "guided-writing",
        instruction: "Viết một tin nhắn thân thiện và cụ thể.",
        prompt:
          "Invite a friend to have lunch this weekend. Suggest a day, a time, and a place.",
        placeholder: "Hi Alex! Would you like to...",
        minimumWords: 30,
        checklist: [
          { label: "Có lời mời", keywords: ["would you like", "do you want", "join me"] },
          { label: "Nêu ngày", keywords: ["Saturday", "Sunday", "weekend"] },
          { label: "Nêu giờ", keywords: ["a.m.", "p.m.", "o'clock", ":"] },
          { label: "Nêu địa điểm", keywords: ["cafe", "café", "restaurant", "at"] },
        ],
        sampleAnswer:
          "Hi Alex! Would you like to have lunch with me on Saturday? We could meet at Green Café at 12:30 p.m. Let me know if that works for you.",
        explanation:
          "Lời mời rõ ràng cần có hoạt động, ngày, giờ và địa điểm.",
        hint: "Kết thúc bằng một câu hỏi để người nhận dễ phản hồi.",
      },
      {
        id: "writing-practical-messages-03",
        type: "guided-writing",
        instruction: "Viết yêu cầu đơn giản nhưng lịch sự.",
        prompt:
          "Write to a hotel. Ask whether an early check-in is possible and mention your arrival time.",
        placeholder: "Hello, I have a reservation...",
        minimumWords: 35,
        checklist: [
          { label: "Nhắc đến đặt phòng", keywords: ["reservation", "booking"] },
          { label: "Hỏi check-in sớm", keywords: ["early check-in", "check in early"] },
          { label: "Nêu giờ đến", keywords: ["arrive", "arrival", "a.m.", "p.m."] },
          { label: "Có lời cảm ơn", keywords: ["thank", "thanks"] },
        ],
        sampleAnswer:
          "Hello, I have a reservation for next Monday. My flight arrives at 9 a.m., so could you tell me whether an early check-in is possible? Thank you for your help.",
        explanation:
          "Yêu cầu dịch vụ nên cung cấp bối cảnh và thời gian cụ thể.",
        hint: "Dùng “whether ... is possible” để hỏi trang trọng vừa phải.",
      },
      {
        id: "writing-practical-messages-04",
        type: "guided-writing",
        instruction: "Viết phản hồi ngắn về một sản phẩm.",
        prompt:
          "Write a review of a useful app. Say what it does, what you like, and one thing that could improve.",
        placeholder: "I use this app to...",
        minimumWords: 45,
        checklist: [
          { label: "Nêu công dụng", keywords: ["use", "helps", "allows"] },
          { label: "Nêu điểm thích", keywords: ["like", "useful", "easy"] },
          { label: "Nêu điểm cần cải thiện", keywords: ["improve", "better", "however", "but"] },
          { label: "Có đánh giá chung", keywords: ["recommend", "overall", "good"] },
        ],
        sampleAnswer:
          "I use this app to plan my weekly tasks. I like its simple design and helpful reminders. However, the search tool could be faster. Overall, it is useful, and I would recommend it to busy students.",
        explanation:
          "Một review cân bằng nên mô tả chức năng, ưu điểm và một đề xuất cải thiện.",
        hint: "Dùng “However” để chuyển sang điểm hạn chế.",
      },
    ],
  },
  {
    id: "writing-argument-and-synthesis",
    title: "Argument and Synthesis",
    description:
      "Phát triển lập luận C1 với luận đề rõ, bằng chứng phù hợp và sắc thái học thuật.",
    skill: "writing",
    level: "C1",
    duration: 20,
    icon: "🖋️",
    accent: "rose",
    tags: ["argument", "academic writing", "synthesis"],
    exercises: [
      {
        id: "writing-argument-and-synthesis-01",
        type: "guided-writing",
        instruction: "Viết một đoạn lập luận có nhượng bộ và phản biện.",
        prompt:
          "Some companies require employees to work in the office full-time. Argue for a more flexible policy while acknowledging one benefit of office work.",
        placeholder: "Although office-based work can..., a flexible policy...",
        minimumWords: 100,
        checklist: [
          { label: "Có luận đề rõ", keywords: ["should", "more effective", "flexible"] },
          { label: "Có nhượng bộ", keywords: ["although", "while", "admittedly"] },
          { label: "Có lý do hoặc bằng chứng", keywords: ["because", "evidence", "for example"] },
          { label: "Có kết luận", keywords: ["therefore", "overall", "ultimately"] },
        ],
        sampleAnswer:
          "Although office-based work can strengthen informal collaboration, requiring attendance every day ignores the different demands of individual roles. A flexible policy should combine shared office days with focused remote work. For example, teams can schedule workshops in person while allowing employees to complete analytical tasks at home. This approach preserves collaboration, reduces unnecessary commuting, and gives managers a clearer reason for each meeting. Ultimately, flexibility should be designed around outcomes rather than treated as an employee perk.",
        explanation:
          "Đoạn mẫu công nhận lợi ích của ý đối lập trước khi bảo vệ chính sách linh hoạt bằng lý do và ví dụ.",
        hint: "Mở đầu bằng “Although...” rồi nêu luận đề ngay trong hai câu đầu.",
      },
      {
        id: "writing-argument-and-synthesis-02",
        type: "guided-writing",
        instruction: "Viết phần tóm tắt tổng hợp, không liệt kê rời rạc.",
        prompt:
          "Two studies reach different conclusions about phone use in classrooms: one reports lower concentration, while the other finds benefits when phones are used for guided research. Synthesize both findings and propose a policy.",
        placeholder: "Taken together, the studies suggest...",
        minimumWords: 110,
        checklist: [
          { label: "Nêu cả hai phát hiện", keywords: ["concentration", "guided research"] },
          { label: "Tổng hợp thay vì chỉ liệt kê", keywords: ["taken together", "suggest", "depends"] },
          { label: "Đề xuất chính sách", keywords: ["policy", "should", "allow", "restrict"] },
          { label: "Thể hiện sắc thái", keywords: ["may", "can", "rather than", "provided that"] },
        ],
        sampleAnswer:
          "Taken together, the studies suggest that the effect of phones depends less on the device itself than on how it is used. Unrestricted access may divide students' attention, whereas teacher-guided research can make information gathering more immediate. Schools should therefore restrict personal phone use during explanations and independent practice but allow devices for clearly defined learning tasks. Such a policy recognises the risk of distraction without discarding a potentially useful tool. Its success would depend on consistent classroom routines and tasks that genuinely require online access.",
        explanation:
          "Synthesis tốt tìm ra điều kiện chung giải thích hai kết quả khác nhau rồi xây chính sách từ điều kiện đó.",
        hint: "Dùng cấu trúc “whereas” để đặt hai phát hiện trong cùng một câu.",
      },
      {
        id: "writing-argument-and-synthesis-03",
        type: "guided-writing",
        instruction: "Viết phản hồi đánh giá một đề xuất công.",
        prompt:
          "A city plans to make all buses free, but critics worry about cost and overcrowding. Evaluate the proposal and recommend one safeguard.",
        placeholder: "Free public transport could..., yet...",
        minimumWords: 100,
        checklist: [
          { label: "Đánh giá lợi ích", keywords: ["access", "traffic", "emissions", "benefit"] },
          { label: "Đánh giá rủi ro", keywords: ["cost", "crowding", "capacity", "risk"] },
          { label: "Có biện pháp bảo vệ", keywords: ["should", "monitor", "fund", "increase"] },
          { label: "Có phán đoán cân bằng", keywords: ["however", "provided", "viable", "on balance"] },
        ],
        sampleAnswer:
          "Free bus travel could improve access to work and reduce private-car use, particularly for lower-income residents. Yet the policy would be counterproductive if overcrowding made services unreliable. Before a citywide launch, the council should fund additional peak-hour capacity and run a six-month pilot on several routes. Passenger numbers, journey times, and operating costs could then be monitored openly. On balance, the proposal is promising, provided that free fares are paired with investment in service quality rather than treated as a substitute for it.",
        explanation:
          "Bài mẫu cân nhắc lợi ích, rủi ro và đưa ra một cơ chế thử nghiệm có tiêu chí đo lường.",
        hint: "Khuyến nghị nên cụ thể hơn câu chung chung như “the city should be careful”.",
      },
      {
        id: "writing-argument-and-synthesis-04",
        type: "guided-writing",
        instruction: "Viết đoạn giải thích quan hệ nguyên nhân–hệ quả có giới hạn.",
        prompt:
          "Explain why measuring productivity only by hours worked can be misleading. Suggest two better indicators.",
        placeholder: "Hours worked provide a simple measure, but...",
        minimumWords: 95,
        checklist: [
          { label: "Giải thích hạn chế", keywords: ["misleading", "quality", "efficiency", "does not"] },
          { label: "Chỉ số thứ nhất", keywords: ["outcomes", "completed", "quality"] },
          { label: "Chỉ số thứ hai", keywords: ["customer", "error", "deadline", "impact"] },
          { label: "Có ngôn ngữ thận trọng", keywords: ["may", "can", "not necessarily", "should be combined"] },
        ],
        sampleAnswer:
          "Hours worked provide a simple measure, but they do not reveal whether the work is useful, accurate, or completed efficiently. Long hours may reflect a difficult project, yet they can also signal poor processes. Managers should combine output quality—such as the number of tasks completed without rework—with an impact measure, such as customer satisfaction or deadlines met. These indicators are not perfect, but together they offer a more credible picture of contribution than attendance time alone.",
        explanation:
          "Đoạn mẫu tránh khẳng định tuyệt đối và đề xuất hai chỉ số có thể quan sát được.",
        hint: "Nêu tên chỉ số và giải thích ngắn điều nó đo lường.",
      },
    ],
  },
  {
    id: "grammar-present-basics",
    title: "Present Tense Basics",
    description:
      "Củng cố be, hiện tại đơn và trật tự câu hỏi ở trình độ A1.",
    skill: "grammar",
    level: "A1",
    duration: 9,
    icon: "⚙️",
    accent: "cyan",
    tags: ["present simple", "be", "questions"],
    exercises: [
      {
        id: "grammar-present-basics-01",
        type: "multiple-choice",
        instruction: "Chọn dạng đúng của động từ be.",
        prompt: "My parents _____ at home now.",
        options: ["am", "is", "are", "be"],
        correctAnswer: 2,
        explanation:
          "“My parents” là chủ ngữ số nhiều nên đi với “are”.",
        hint: "Xác định chủ ngữ số ít hay số nhiều.",
      },
      {
        id: "grammar-present-basics-02",
        type: "fill-blank",
        instruction: "Điền dạng phủ định đúng.",
        prompt: "He _____ like coffee.",
        correctAnswer: "doesn't",
        acceptedAnswers: ["doesn't", "does not"],
        placeholder: "does...",
        explanation:
          "Hiện tại đơn phủ định với “he” dùng “doesn't + động từ nguyên mẫu”.",
        hint: "Sau chỗ trống đã có động từ nguyên mẫu “like”.",
      },
      {
        id: "grammar-present-basics-03",
        type: "reorder",
        instruction: "Sắp xếp thành câu hỏi; có thể bỏ dấu câu.",
        prompt: "Hỏi người nghe sống ở đâu.",
        tokens: ["live", "do", "Where", "you"],
        correctAnswer: "Where do you live",
        explanation:
          "Câu hỏi hiện tại đơn có trật tự: từ hỏi + do + chủ ngữ + động từ.",
        hint: "“Where” đứng đầu, “live” đứng cuối.",
      },
      {
        id: "grammar-present-basics-04",
        type: "multiple-choice",
        instruction: "Chọn câu đúng ngữ pháp.",
        prompt: "Which sentence is correct?",
        options: [
          "She go to work by bus.",
          "She goes to work by bus.",
          "She going to work by bus.",
          "She does goes to work by bus.",
        ],
        correctAnswer: 1,
        explanation:
          "Trong câu khẳng định hiện tại đơn, động từ với “she” thêm -s: “goes”.",
        hint: "Chỉ cần một động từ đã chia trong câu khẳng định.",
      },
    ],
  },
  {
    id: "grammar-past-and-plans",
    title: "Past Events and Future Plans",
    description:
      "Phân biệt quá khứ đơn với các cách nói về dự định và kế hoạch A2.",
    skill: "grammar",
    level: "A2",
    duration: 11,
    icon: "🧩",
    accent: "amber",
    tags: ["past simple", "going to", "arrangements"],
    exercises: [
      {
        id: "grammar-past-and-plans-01",
        type: "multiple-choice",
        instruction: "Chọn dạng quá khứ đúng.",
        prompt: "We _____ to Hue last weekend.",
        options: ["go", "went", "gone", "going"],
        correctAnswer: 1,
        explanation:
          "“Last weekend” yêu cầu quá khứ đơn; dạng quá khứ của “go” là “went”.",
        hint: "Đây là động từ bất quy tắc.",
      },
      {
        id: "grammar-past-and-plans-02",
        type: "fill-blank",
        instruction: "Điền cụm phủ định ở quá khứ.",
        prompt: "I _____ the email yesterday.",
        correctAnswer: "didn't see",
        acceptedAnswers: ["didn't see", "did not see"],
        placeholder: "did...",
        explanation:
          "Phủ định quá khứ dùng “didn't + động từ nguyên mẫu”: “didn't see”.",
        hint: "Không dùng “didn't saw”.",
      },
      {
        id: "grammar-past-and-plans-03",
        type: "reorder",
        instruction: "Sắp xếp thành câu hỏi quá khứ; có thể bỏ dấu câu.",
        prompt: "Hỏi về hoạt động cuối tuần trước.",
        tokens: ["last", "What", "do", "you", "did", "weekend"],
        correctAnswer: "What did you do last weekend",
        explanation:
          "Sau trợ động từ “did”, động từ chính trở về dạng nguyên mẫu “do”.",
        hint: "Trật tự mở đầu là “What did you...”.",
      },
      {
        id: "grammar-past-and-plans-04",
        type: "multiple-choice",
        instruction: "Chọn cấu trúc diễn tả dự định có bằng chứng hiện tại.",
        prompt: "Look at those dark clouds! It _____ rain.",
        options: ["is going to", "went to", "has", "does"],
        correctAnswer: 0,
        explanation:
          "“Be going to” dùng cho dự đoán dựa trên bằng chứng hiện tại như mây đen.",
        hint: "Người nói nhìn thấy dấu hiệu ngay lúc nói.",
      },
    ],
  },
  {
    id: "grammar-conditionals-and-clauses",
    title: "Conditionals and Relative Clauses",
    description:
      "Luyện cấu trúc B1 để nói về điều kiện, giả định và bổ sung thông tin.",
    skill: "grammar",
    level: "B1",
    duration: 12,
    icon: "🔧",
    accent: "rose",
    tags: ["conditionals", "relative clauses", "accuracy"],
    featured: true,
    exercises: [
      {
        id: "grammar-conditionals-and-clauses-01",
        type: "multiple-choice",
        instruction: "Chọn dạng đúng trong câu điều kiện loại một.",
        prompt: "If it rains tomorrow, we _____ the event indoors.",
        options: ["move", "moved", "will move", "would move"],
        correctAnswer: 2,
        explanation:
          "Điều kiện loại một dùng “if + hiện tại đơn, will + động từ”.",
        hint: "Đây là khả năng thực tế trong tương lai.",
      },
      {
        id: "grammar-conditionals-and-clauses-02",
        type: "fill-blank",
        instruction: "Điền dạng đúng của động từ.",
        prompt: "If I _____ more time, I would join the speaking club.",
        correctAnswer: "had",
        acceptedAnswers: ["had"],
        placeholder: "have → ?",
        explanation:
          "Điều kiện loại hai dùng quá khứ đơn ở mệnh đề if: “If I had...”.",
        hint: "Vế chính có “would”.",
      },
      {
        id: "grammar-conditionals-and-clauses-03",
        type: "reorder",
        instruction: "Sắp xếp thành câu có mệnh đề quan hệ; có thể bỏ dấu câu.",
        prompt: "Tạo câu nói người phụ nữ gọi điện là quản lý của tôi.",
        tokens: ["my", "The", "called", "manager", "woman", "is", "who", "you"],
        correctAnswer: "The woman who called you is my manager",
        explanation:
          "“Who called you” là mệnh đề quan hệ bổ nghĩa cho “the woman”.",
        hint: "Đặt mệnh đề bắt đầu bằng “who” ngay sau danh từ chỉ người.",
      },
      {
        id: "grammar-conditionals-and-clauses-04",
        type: "multiple-choice",
        instruction: "Chọn đại từ quan hệ đúng.",
        prompt: "That's the designer _____ ideas won the competition.",
        options: ["who", "which", "whose", "where"],
        correctAnswer: 2,
        explanation:
          "“Whose” thể hiện sở hữu: các ý tưởng của nhà thiết kế.",
        hint: "Sau chỗ trống là danh từ “ideas”.",
      },
    ],
  },
  {
    id: "toeic-part-2-reflex",
    title: "TOEIC Part 2 Reflex",
    description:
      "Rèn phản xạ chọn câu đáp phù hợp cho câu hỏi và phát biểu ngắn.",
    skill: "toeic",
    level: "B1",
    duration: 10,
    icon: "⚡",
    accent: "orange",
    tags: ["TOEIC", "Part 2", "question-response"],
    exercises: [
      {
        id: "toeic-part-2-reflex-01",
        type: "listening-choice",
        instruction: "Nghe câu hỏi và chọn lời đáp phù hợp nhất.",
        prompt: "Choose the best response.",
        transcript: "When will the new printers be delivered?",
        options: [
          "Probably on Thursday.",
          "In the copy room.",
          "Yes, it prints quickly.",
        ],
        correctAnswer: 0,
        explanation:
          "“When” hỏi thời gian, vì vậy “Probably on Thursday” là câu đáp trực tiếp.",
        hint: "Xác định từ để hỏi ở đầu câu.",
      },
      {
        id: "toeic-part-2-reflex-02",
        type: "listening-choice",
        instruction: "Nghe câu hỏi và chọn lời đáp phù hợp nhất.",
        prompt: "Choose the best response.",
        transcript: "Why don't we take the earlier train?",
        options: [
          "The station is downtown.",
          "Good idea. It will be less crowded.",
          "I bought a return ticket.",
        ],
        correctAnswer: 1,
        explanation:
          "“Why don't we...?” là một lời đề xuất; “Good idea” phản hồi đúng chức năng giao tiếp.",
        hint: "Đừng hiểu máy móc đây là câu hỏi yêu cầu lý do.",
      },
      {
        id: "toeic-part-2-reflex-03",
        type: "listening-choice",
        instruction: "Nghe phát biểu và chọn lời đáp tự nhiên nhất.",
        prompt: "Choose the best response.",
        transcript: "I haven't received the revised contract yet.",
        options: [
          "I'll ask legal to send it again.",
          "The revision was expensive.",
          "Yes, the meeting is contracted.",
        ],
        correctAnswer: 0,
        explanation:
          "Lời đáp đúng đưa ra hành động giải quyết việc người nói chưa nhận được hợp đồng.",
        hint: "Part 2 có thể bắt đầu bằng một phát biểu, không chỉ câu hỏi.",
      },
      {
        id: "toeic-part-2-reflex-04",
        type: "listening-choice",
        instruction: "Nghe câu hỏi và chọn lời đáp phù hợp nhất.",
        prompt: "Choose the best response.",
        transcript: "Who is presenting the sales figures this afternoon?",
        options: [
          "In the main conference room.",
          "The figures increased by ten percent.",
          "I believe Marcus is.",
        ],
        correctAnswer: 2,
        explanation:
          "“Who” hỏi người thực hiện; “Marcus” là đáp án duy nhất chỉ người.",
        hint: "Nghe từ để hỏi và loại đáp án về nơi chốn hoặc số liệu.",
      },
    ],
  },
  {
    id: "toeic-part-5-sprint",
    title: "TOEIC Part 5 Sprint",
    description:
      "Hoàn thành câu nhanh với ngữ pháp và từ vựng công sở thường gặp.",
    skill: "toeic",
    level: "B1",
    duration: 9,
    icon: "⏱️",
    accent: "orange",
    tags: ["TOEIC", "Part 5", "incomplete sentences"],
    exercises: [
      {
        id: "toeic-part-5-sprint-01",
        type: "multiple-choice",
        instruction: "Chọn đáp án hoàn thành câu đúng nhất.",
        prompt:
          "All expense reports must be submitted _____ Friday afternoon.",
        options: ["by", "from", "during", "among"],
        correctAnswer: 0,
        explanation:
          "“By Friday afternoon” nghĩa là chậm nhất vào chiều thứ Sáu.",
        hint: "Cần giới từ chỉ hạn chót.",
      },
      {
        id: "toeic-part-5-sprint-02",
        type: "multiple-choice",
        instruction: "Chọn dạng từ phù hợp.",
        prompt:
          "The manager thanked the team for responding _____ to the customer's request.",
        options: ["prompt", "promptly", "promptness", "prompted"],
        correctAnswer: 1,
        explanation:
          "Cần trạng từ “promptly” để bổ nghĩa cho động từ “responding”.",
        hint: "Xác định từ loại đứng sau động từ.",
      },
      {
        id: "toeic-part-5-sprint-03",
        type: "multiple-choice",
        instruction: "Chọn liên từ phù hợp nhất.",
        prompt:
          "The outdoor event will proceed as planned _____ the weather becomes unsafe.",
        options: ["unless", "because", "although", "therefore"],
        correctAnswer: 0,
        explanation:
          "“Unless” nghĩa là “trừ khi”: sự kiện vẫn diễn ra trừ khi thời tiết trở nên không an toàn.",
        hint: "Cần từ nêu ngoại lệ cho kế hoạch.",
      },
      {
        id: "toeic-part-5-sprint-04",
        type: "multiple-choice",
        instruction: "Chọn dạng động từ đúng.",
        prompt:
          "Ms. Patel _____ the final schedule before she left the office yesterday.",
        options: ["approves", "has approved", "approved", "will approve"],
        correctAnswer: 2,
        explanation:
          "“Yesterday” và hành động đã hoàn tất yêu cầu quá khứ đơn “approved”.",
        hint: "Tìm dấu hiệu thời gian ở cuối câu.",
      },
    ],
  },
  {
    id: "toeic-mini-mix",
    title: "TOEIC Mini Mix",
    description:
      "Bài luyện ngắn kết hợp phản xạ nghe, hội thoại, hoàn thành câu và đọc hiểu.",
    skill: "toeic",
    level: "B2",
    duration: 14,
    icon: "🏆",
    accent: "orange",
    tags: ["TOEIC", "mixed parts", "mini test"],
    featured: true,
    exercises: [
      {
        id: "toeic-mini-mix-01",
        type: "listening-choice",
        instruction: "Nghe câu hỏi kiểu Part 2 và chọn lời đáp tốt nhất.",
        prompt: "Choose the best response.",
        transcript: "Haven't you booked the conference room yet?",
        options: [
          "No, but I'll do it right now.",
          "The conference lasted two hours.",
          "It's on the second floor.",
        ],
        correctAnswer: 0,
        explanation:
          "Câu hỏi xác nhận việc đặt phòng; đáp án A thừa nhận chưa làm và hứa xử lý ngay.",
        hint: "Cẩn thận với câu hỏi phủ định; chọn theo ý nghĩa, không chỉ nghe “yes/no”.",
      },
      {
        id: "toeic-mini-mix-02",
        type: "listening-choice",
        instruction: "Nghe đoạn hội thoại kiểu Part 3 và chọn đáp án.",
        prompt: "What problem are the speakers discussing?",
        transcript:
          "Woman: The shipment arrived this morning, but twelve boxes were missing. Man: I'll contact the supplier and check whether they were sent separately.",
        options: [
          "An incomplete delivery",
          "A damaged computer",
          "An incorrect invoice total",
          "A delayed staff meeting",
        ],
        correctAnswer: 0,
        explanation:
          "Người phụ nữ nói 12 thùng hàng bị thiếu, nên vấn đề là đơn giao hàng không đầy đủ.",
        hint: "Tập trung vào vế sau “but”.",
      },
      {
        id: "toeic-mini-mix-03",
        type: "multiple-choice",
        instruction: "Hoàn thành câu kiểu Part 5.",
        prompt:
          "The new software is expected to make order processing more _____.",
        options: ["efficient", "efficiency", "efficiently", "efficiencies"],
        correctAnswer: 0,
        explanation:
          "Sau “make + object + adjective” cần tính từ “efficient”.",
        hint: "“More” ở đây bổ nghĩa cho một tính từ.",
      },
      {
        id: "toeic-mini-mix-04",
        type: "multiple-choice",
        instruction: "Đọc email kiểu Part 7 và chọn đáp án.",
        prompt:
          "EMAIL: Your registration for the design workshop is confirmed. Because the morning session is full, you have been placed in the 2 p.m. session. Please arrive fifteen minutes early to collect your badge. What is the reader asked to do?",
        options: [
          "Register for another workshop",
          "Attend the morning session",
          "Arrive before the 2 p.m. session",
          "Print a badge at home",
        ],
        correctAnswer: 2,
        explanation:
          "Người đọc được xếp vào ca 2 giờ chiều và được yêu cầu đến sớm 15 phút.",
        hint: "Tìm câu bắt đầu bằng “Please”.",
      },
    ],
  },
];

/** Unified offline catalog used by the library, daily plan, and TOEIC page. */
export const practiceSets: PracticeSet[] = [
  ...corePracticeSets,
  ...toeicPracticeSets,
];
