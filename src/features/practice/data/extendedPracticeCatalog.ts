import type { PracticeSet } from "../types/practice";

/**
 * Chương mở rộng cho sáu kỹ năng nền tảng.
 *
 * Các bộ này được viết như những bài học độc lập (không sinh câu theo mẫu)
 * để mỗi lần quay lại người học gặp một ngữ cảnh và mục tiêu mới.
 */
export const extendedPracticeSets: PracticeSet[] = [
  {
    id: "vocabulary-travel-survival",
    title: "Travel Survival Phrases",
    description:
      "Từ vựng và cụm từ thực dụng để đặt phòng, qua sân bay và xử lý thay đổi chuyến đi.",
    skill: "vocabulary",
    level: "A2",
    duration: 12,
    icon: "🧳",
    accent: "cyan",
    tags: ["travel", "survival English", "collocations"],
    exercises: [
      {
        id: "vocabulary-travel-survival-01",
        type: "multiple-choice",
        instruction: "Chọn từ phù hợp với tình huống ở sân bay.",
        prompt: "The hotel clerk asked me to show my ____ before checking in.",
        options: ["passport", "platform", "luggage", "boarding"],
        correctAnswer: 0,
        explanation:
          "Passport là giấy tờ thường được yêu cầu khi làm thủ tục nhận phòng.",
        hint: "Đây là một giấy tờ tùy thân, không phải đồ hành lý.",
      },
      {
        id: "vocabulary-travel-survival-02",
        type: "fill-blank",
        instruction: "Điền động từ tạo thành lời hỏi đường tự nhiên.",
        prompt: "Could you _____ me where Gate 12 is?",
        correctAnswer: "tell",
        acceptedAnswers: ["tell", "show"],
        placeholder: "tell / show...",
        explanation:
          "Tell me where... và show me where... đều là cách lịch sự để hỏi vị trí.",
        hint: "Cụm thường gặp nhất là “Could you tell me...?”.",
      },
      {
        id: "vocabulary-travel-survival-03",
        type: "reorder",
        instruction: "Sắp xếp thành câu yêu cầu đổi chỗ ngồi.",
        prompt: "Nói rằng bạn muốn đổi chỗ ngồi.",
        tokens: ["would", "I", "like", "to", "change", "my", "seat"],
        correctAnswer: "I would like to change my seat",
        explanation:
          "I would like to + động từ là mẫu yêu cầu lịch sự trong dịch vụ.",
        hint: "Bắt đầu bằng chủ ngữ I, sau đó là would like to.",
      },
      {
        id: "vocabulary-travel-survival-04",
        type: "multiple-choice",
        instruction: "Chọn collocation đúng trong thông báo chuyến bay.",
        prompt: "The flight has been _____ due to bad weather.",
        options: ["delayed", "borrowed", "packed", "rehearsed"],
        correctAnswer: 0,
        explanation:
          "A flight is delayed nghĩa là chuyến bay bị trễ; due to bad weather là nguyên nhân.",
        hint: "Thời tiết xấu thường làm chuyến bay bị trễ.",
      },
    ],
  },
  {
    id: "vocabulary-ideas-and-collocations",
    title: "Ideas & Academic Collocations",
    description:
      "Mở rộng vốn từ B2 bằng collocation dùng trong thảo luận, báo cáo và lập luận.",
    skill: "vocabulary",
    level: "B2",
    duration: 14,
    icon: "💡",
    accent: "blue",
    tags: ["academic English", "collocations", "critical thinking"],
    exercises: [
      {
        id: "vocabulary-ideas-and-collocations-01",
        type: "multiple-choice",
        instruction: "Chọn tính từ phù hợp với ngữ cảnh báo cáo.",
        prompt:
          "The report identifies a _____ gap between policy and practice.",
        options: ["significant", "sleepy", "portable", "edible"],
        correctAnswer: 0,
        explanation:
          "A significant gap là khoảng cách đáng kể, thường dùng trong báo cáo phân tích.",
        hint: "Tìm tính từ chỉ mức độ quan trọng hoặc lớn.",
      },
      {
        id: "vocabulary-ideas-and-collocations-02",
        type: "fill-blank",
        instruction: "Điền động từ trong collocation về đàm phán.",
        prompt: "Both sides agreed to _____ a compromise before Friday.",
        correctAnswer: "reach",
        acceptedAnswers: ["reach"],
        placeholder: "reach...",
        explanation:
          "Reach a compromise nghĩa là đạt được thỏa hiệp sau khi thương lượng.",
        hint: "Collocation là reach + a compromise.",
      },
      {
        id: "vocabulary-ideas-and-collocations-03",
        type: "multiple-choice",
        instruction: "Chọn nghĩa đúng của cụm từ in đậm.",
        prompt:
          "The audit will help the company mitigate financial risk. What does “mitigate” mean?",
        options: [
          "Make a problem less severe",
          "Hide a problem completely",
          "Predict a problem exactly",
          "Create a new problem",
        ],
        correctAnswer: 0,
        explanation:
          "Mitigate nghĩa là làm giảm mức độ nghiêm trọng, không nhất thiết xóa bỏ hoàn toàn.",
        hint: "Từ này gần nghĩa với reduce hoặc lessen.",
      },
      {
        id: "vocabulary-ideas-and-collocations-04",
        type: "reorder",
        instruction: "Sắp xếp thành câu mô tả một phân tích toàn diện.",
        prompt: "Nói rằng đề xuất xem xét cả chi phí và tác động.",
        tokens: [
          "The",
          "proposal",
          "takes",
          "into",
          "account",
          "cost",
          "and",
          "impact",
        ],
        correctAnswer: "The proposal takes into account cost and impact",
        explanation:
          "Take into account là cụm động từ nghĩa là cân nhắc một yếu tố khi quyết định.",
        hint: "Đặt takes into account liền nhau sau proposal.",
      },
    ],
  },
  {
    id: "listening-service-calls",
    title: "Service Calls & Solutions",
    description:
      "Nghe cuộc gọi dịch vụ để bắt vấn đề, yêu cầu và giải pháp được đề xuất.",
    skill: "listening",
    level: "B1",
    duration: 14,
    icon: "☎️",
    accent: "blue",
    tags: ["phone calls", "customer service", "problem solving"],
    exercises: [
      {
        id: "listening-service-calls-01",
        type: "listening-choice",
        instruction: "Nghe cuộc gọi và xác định yêu cầu của khách hàng.",
        prompt: "What does the customer want to change?",
        transcript:
          "Customer: I need to move my delivery from Tuesday to Thursday. Agent: That's fine. I'll update the appointment and email you a confirmation.",
        options: [
          "The delivery address",
          "The delivery date",
          "The product color",
          "The payment method",
        ],
        correctAnswer: 1,
        explanation:
          "Khách hàng muốn chuyển lịch giao từ Tuesday sang Thursday.",
        hint: "Nghe cặp ngày trong câu đầu tiên.",
      },
      {
        id: "listening-service-calls-02",
        type: "dictation",
        instruction: "Nghe và chép lại câu xác nhận dịch vụ.",
        prompt: "Viết chính xác câu bạn nghe được.",
        audioText:
          "Your replacement card will arrive within five business days.",
        correctAnswer:
          "Your replacement card will arrive within five business days.",
        acceptedAnswers: [
          "Your replacement card will arrive within five business days",
        ],
        placeholder: "Your replacement...",
        explanation:
          "Within five business days là cụm chỉ thời hạn thường dùng trong dịch vụ khách hàng.",
        hint: "Chú ý âm /s/ ở business và số five.",
      },
      {
        id: "listening-service-calls-03",
        type: "listening-choice",
        instruction: "Nghe để tìm lý do yêu cầu hoàn tiền.",
        prompt: "Why is the caller requesting a refund?",
        transcript:
          "Caller: The headphones I received do not match the model I ordered. Agent: I'm sorry about that. We can issue a refund or send the correct model today.",
        options: [
          "The headphones arrived late",
          "The headphones are the wrong model",
          "The caller lost the receipt",
          "The store is closing",
        ],
        correctAnswer: 1,
        explanation:
          "Caller nói rõ sản phẩm nhận được không đúng model đã đặt.",
        hint: "Tập trung vào do not match.",
      },
      {
        id: "listening-service-calls-04",
        type: "listening-choice",
        instruction: "Xác định hành động tiếp theo của nhân viên.",
        prompt: "What will the agent do next?",
        transcript:
          "Agent: I can see your application, but one signature is missing. Please upload the signed page, and I will review it this afternoon.",
        options: [
          "Close the application",
          "Upload a new photo",
          "Review the signed page",
          "Mail a paper form",
        ],
        correctAnswer: 2,
        explanation:
          "Sau khi người dùng tải trang đã ký lên, agent sẽ review it this afternoon.",
        hint: "Nghe hành động sau and I will.",
      },
    ],
  },
  {
    id: "listening-news-and-meetings",
    title: "News Briefings & Meetings",
    description:
      "Nghe bài nói B2 để phân biệt ý chính, bằng chứng và quyết định trong cuộc họp.",
    skill: "listening",
    level: "B2",
    duration: 16,
    icon: "📰",
    accent: "violet",
    tags: ["briefings", "meetings", "inference"],
    featured: true,
    exercises: [
      {
        id: "listening-news-and-meetings-01",
        type: "listening-choice",
        instruction: "Nghe phần tóm tắt họp và chọn quyết định chính.",
        prompt: "What did the team decide to do first?",
        transcript:
          "After reviewing the pilot results, the team decided to fix the onboarding screens before adding any new features. A second test will follow in June.",
        options: [
          "Add new features",
          "Fix the onboarding screens",
          "Cancel the pilot",
          "Hire a new design team",
        ],
        correctAnswer: 1,
        explanation:
          "Quyết định đầu tiên là sửa onboarding screens rồi mới làm test thứ hai.",
        hint: "Nghe động từ decided to.",
      },
      {
        id: "listening-news-and-meetings-02",
        type: "listening-choice",
        instruction: "Nghe bản tin và suy ra tác động.",
        prompt: "What is likely to happen after the announcement?",
        transcript:
          "The city has approved a temporary bus lane on Riverside Road. Officials expect morning journeys to become more reliable while construction crews repair the bridge.",
        options: [
          "The bridge will be demolished",
          "Morning bus journeys may become more predictable",
          "All roads will close at night",
          "Construction will stop immediately",
        ],
        correctAnswer: 1,
        explanation:
          "Temporary bus lane được kỳ vọng làm hành trình buổi sáng ổn định hơn.",
        hint: "Expect ... to become là dấu hiệu dự đoán kết quả.",
      },
      {
        id: "listening-news-and-meetings-03",
        type: "dictation",
        instruction: "Nghe và chép lại câu nêu bằng chứng.",
        prompt: "Viết chính xác câu bạn nghe được.",
        audioText:
          "The survey results suggest that flexible hours improve retention.",
        correctAnswer:
          "The survey results suggest that flexible hours improve retention.",
        acceptedAnswers: [
          "The survey results suggest that flexible hours improve retention",
        ],
        placeholder: "The survey results...",
        explanation:
          "Suggest that giới thiệu kết luận thận trọng dựa trên dữ liệu khảo sát.",
        hint: "Nối âm results suggest và giữ rõ âm /v/ trong improve.",
      },
      {
        id: "listening-news-and-meetings-04",
        type: "listening-choice",
        instruction: "Nhận diện thái độ của người nói.",
        prompt: "How does the speaker view the proposed budget?",
        transcript:
          "The budget is ambitious, but the timeline leaves little room for testing. I would support it if the launch date were moved back by two weeks.",
        options: [
          "Fully confident",
          "Cautiously supportive",
          "Strongly opposed",
          "Uninterested",
        ],
        correctAnswer: 1,
        explanation:
          "Người nói ủng hộ có điều kiện, thể hiện qua if the launch date were moved.",
        hint: "Chú ý but và điều kiện if.",
      },
    ],
  },
  {
    id: "speaking-roleplay-travel",
    title: "Travel Role-play",
    description:
      "Shadowing các lượt nói thực tế khi nhận phòng, hỏi đường và xử lý thay đổi chuyến đi.",
    skill: "speaking",
    level: "A2",
    duration: 13,
    icon: "🗺️",
    accent: "violet",
    tags: ["shadowing", "travel", "role-play"],
    exercises: [
      {
        id: "speaking-roleplay-travel-01",
        type: "shadowing",
        instruction: "Nói theo ba lần, giữ ngữ điệu thân thiện.",
        prompt: "Nhận phòng tại khách sạn.",
        modelText: "Hello, I have a reservation under the name Nguyen.",
        focusPoints: [
          "Nối âm have a",
          "Nhấn reservation và Nguyen",
          "Hạ giọng ở cuối câu",
        ],
        explanation: "Mẫu câu ngắn giúp nhân viên tìm đặt phòng nhanh chóng.",
        hint: "Đọc under the name như một cụm liền.",
      },
      {
        id: "speaking-roleplay-travel-02",
        type: "shadowing",
        instruction: "Nói theo với giọng hỏi đường lịch sự.",
        prompt: "Hỏi cách đi tới bảo tàng.",
        modelText: "Excuse me, could you tell me how to get to the museum?",
        focusPoints: [
          "Nhấn tell và museum",
          "Lên giọng ở cuối câu hỏi",
          "Âm /t/ rõ trong get",
        ],
        explanation:
          "Could you tell me how to... là cấu trúc hỏi đường lịch sự.",
        hint: "Không nhấn đều mọi từ; tập trung vào museum.",
      },
      {
        id: "speaking-roleplay-travel-03",
        type: "shadowing",
        instruction: "Nói theo để thông báo thay đổi chuyến bay.",
        prompt: "Báo rằng chuyến bay bị hoãn.",
        modelText:
          "My flight has been delayed, so I may arrive after midnight.",
        focusPoints: [
          "Nhấn delayed và midnight",
          "Ngắt nhẹ sau so",
          "Giữ âm /d/ cuối delayed",
        ],
        explanation:
          "Nêu nguyên nhân và hệ quả giúp người nghe chuẩn bị đón bạn.",
        hint: "So nối hai ý, không cần dừng quá lâu.",
      },
      {
        id: "speaking-roleplay-travel-04",
        type: "shadowing",
        instruction: "Nói theo với thái độ giải quyết vấn đề.",
        prompt: "Báo món ăn bị giao nhầm.",
        modelText:
          "I ordered the vegetable soup, but this one contains chicken.",
        focusPoints: [
          "Nhấn vegetable soup và chicken",
          "Thể hiện tương phản ở but",
          "Đọc rõ contains",
        ],
        explanation: "Mẫu câu lịch sự nêu món đã gọi và điểm không khớp.",
        hint: "Không cần xin lỗi dài; nói rõ sự khác nhau trước.",
      },
    ],
  },
  {
    id: "speaking-meeting-turns",
    title: "Meeting Turns & Facilitation",
    description:
      "Luyện nói B2 để vào lượt, tóm tắt, phản biện mềm và giao việc trong cuộc họp.",
    skill: "speaking",
    level: "B2",
    duration: 15,
    icon: "🤝",
    accent: "rose",
    tags: ["shadowing", "meetings", "facilitation"],
    exercises: [
      {
        id: "speaking-meeting-turns-01",
        type: "shadowing",
        instruction: "Nói theo, dùng giọng lịch sự để vào lượt.",
        prompt: "Xin phép bổ sung một ý.",
        modelText: "May I add one point before we move on to the next item?",
        focusPoints: [
          "Nhấn add one point",
          "Ngắt trước before",
          "Lên giọng nhẹ ở cuối",
        ],
        explanation:
          "Mẫu May I... giúp giành lượt nói mà không cắt lời đột ngột.",
        hint: "Giữ before we move on thành một cụm.",
      },
      {
        id: "speaking-meeting-turns-02",
        type: "shadowing",
        instruction: "Nói theo để tóm tắt và kiểm tra sự đồng thuận.",
        prompt: "Tóm tắt quyết định của nhóm.",
        modelText: "So, we are agreed to test the smaller version next week.",
        focusPoints: [
          "Nhấn agreed và next week",
          "Ngắt sau So",
          "Kết thúc rõ ràng",
        ],
        explanation:
          "Tóm tắt giúp mọi người xác nhận cùng hiểu một quyết định.",
        hint: "Dùng giọng khẳng định ở agreed.",
      },
      {
        id: "speaking-meeting-turns-03",
        type: "shadowing",
        instruction: "Nói theo với ngữ điệu phản biện mềm.",
        prompt: "Nêu lo ngại mà vẫn giữ hợp tác.",
        modelText:
          "I understand the benefit, although I am concerned about the maintenance cost.",
        focusPoints: [
          "Nhấn benefit và maintenance cost",
          "Ngắt trước although",
          "Giọng bình tĩnh ở concerned",
        ],
        explanation:
          "Thừa nhận lợi ích trước khi nêu lo ngại làm ý kiến dễ được tiếp nhận.",
        hint: "Although nối hai vế; không cần nhấn mạnh quá mức.",
      },
      {
        id: "speaking-meeting-turns-04",
        type: "shadowing",
        instruction: "Nói theo như một người điều phối cuộc họp.",
        prompt: "Giao hành động và thời hạn.",
        modelText:
          "Could you own the first draft and send it to the team by Wednesday?",
        focusPoints: [
          "Nhấn own và Wednesday",
          "Lên giọng ở câu hỏi",
          "Nối send it",
        ],
        explanation:
          "Câu hỏi lịch sự nhưng nêu rõ người phụ trách, đầu việc và hạn chót.",
        hint: "Own ở đây nghĩa là chịu trách nhiệm, không phải sở hữu.",
      },
    ],
  },
  {
    id: "reading-workplace-emails",
    title: "Workplace Email Trails",
    description:
      "Đọc chuỗi email B1 để tìm người phụ trách, thời hạn và hành động tiếp theo.",
    skill: "reading",
    level: "B1",
    duration: 15,
    icon: "📨",
    accent: "emerald",
    tags: ["emails", "details", "workplace reading"],
    exercises: [
      {
        id: "reading-workplace-emails-01",
        type: "multiple-choice",
        instruction: "Đọc email và xác định việc người nhận cần làm.",
        prompt:
          "EMAIL: Please check the attached figures and reply with any corrections by 3 p.m. What should the reader do?",
        options: [
          "Create a new budget",
          "Check the figures and reply",
          "Schedule a meeting next week",
          "Delete the attachment",
        ],
        correctAnswer: 1,
        explanation:
          "Email yêu cầu kiểm tra số liệu và trả lời trước 3 giờ chiều.",
        hint: "Theo dõi hai động từ sau Please.",
      },
      {
        id: "reading-workplace-emails-02",
        type: "multiple-choice",
        instruction: "Tìm chi tiết về địa điểm giao hàng.",
        prompt:
          "MESSAGE: The sample boxes will arrive Thursday. Since the loading dock is busy, ask the driver to use the side entrance. Where should the driver go?",
        options: [
          "The main office",
          "The side entrance",
          "The loading dock",
          "The reception elevator",
        ],
        correctAnswer: 1,
        explanation:
          "Người gửi yêu cầu tài xế dùng side entrance vì loading dock đang bận.",
        hint: "Since giới thiệu lý do; câu sau nêu địa điểm mới.",
      },
      {
        id: "reading-workplace-emails-03",
        type: "multiple-choice",
        instruction: "Suy luận lý do một cuộc họp bị đổi.",
        prompt:
          "EMAIL: The client has added two colleagues to Friday's call, so I have reserved the larger meeting room. Why was the room changed?",
        options: [
          "The original room was damaged",
          "More people will join the call",
          "The client canceled the call",
          "The meeting moved to Thursday",
        ],
        correctAnswer: 1,
        explanation:
          "Có thêm hai đồng nghiệp của khách hàng nên cần phòng lớn hơn.",
        hint: "Nối added two colleagues với larger room.",
      },
      {
        id: "reading-workplace-emails-04",
        type: "multiple-choice",
        instruction: "Đọc thông báo và chọn thời hạn đúng.",
        prompt:
          "NOTICE: Expense claims for March must reach Finance no later than April 5. Claims submitted after that date will be processed in May. When is the deadline?",
        options: ["March 5", "April 5", "April 30", "May 5"],
        correctAnswer: 1,
        explanation:
          "No later than April 5 nghĩa là hạn cuối là ngày 5 tháng 4.",
        hint: "No later than chỉ hạn chót.",
      },
    ],
  },
  {
    id: "reading-articles-and-evidence",
    title: "Articles, Claims & Evidence",
    description:
      "Đọc bài viết C1 để phân biệt luận điểm, bằng chứng và giới hạn của một kết luận.",
    skill: "reading",
    level: "C1",
    duration: 18,
    icon: "🧠",
    accent: "emerald",
    tags: ["critical reading", "evidence", "argument"],
    featured: true,
    exercises: [
      {
        id: "reading-articles-and-evidence-01",
        type: "multiple-choice",
        instruction: "Đọc đoạn văn và chọn luận điểm chính.",
        prompt:
          "A pilot program reduced printing by 18 percent in one department. The authors caution that the result may not generalize to teams with different workflows. What is the main claim?",
        options: [
          "Printing can never be reduced",
          "The pilot showed a promising but limited result",
          "All departments use the same workflow",
          "The authors oppose pilot programs",
        ],
        correctAnswer: 1,
        explanation:
          "Đoạn văn vừa ghi nhận kết quả tích cực vừa nêu giới hạn khả năng khái quát.",
        hint: "Chú ý cả reduced 18 percent và may not generalize.",
      },
      {
        id: "reading-articles-and-evidence-02",
        type: "multiple-choice",
        instruction: "Suy luận điều cần kiểm tra thêm.",
        prompt:
          "The survey found that commuters who listened to podcasts reported higher concentration. Because the survey was voluntary, the researchers recommend a controlled experiment. Why?",
        options: [
          "Podcasts are impossible to measure",
          "Volunteers may differ from non-volunteers",
          "Commuters dislike experiments",
          "Concentration is unrelated to travel",
        ],
        correctAnswer: 1,
        explanation:
          "Người tự nguyện tham gia có thể khác nhóm còn lại, nên cần thí nghiệm kiểm soát để kiểm tra quan hệ nhân quả.",
        hint: "Voluntary là manh mối về sai lệch chọn mẫu.",
      },
      {
        id: "reading-articles-and-evidence-03",
        type: "multiple-choice",
        instruction: "Chọn nghĩa của từ theo lập luận.",
        prompt:
          "The proposal is plausible, but the evidence remains inconclusive. What does “inconclusive” mean here?",
        options: [
          "Not sufficient to settle the question",
          "Already proven beyond doubt",
          "Unrelated to the proposal",
          "Too simple to understand",
        ],
        correctAnswer: 0,
        explanation:
          "Inconclusive nghĩa là chưa đủ để đưa ra kết luận dứt khoát.",
        hint: "Đoạn văn nói proposal plausible nhưng chưa chốt được.",
      },
      {
        id: "reading-articles-and-evidence-04",
        type: "multiple-choice",
        instruction: "Xác định bằng chứng hỗ trợ kết luận.",
        prompt:
          "After introducing a quiet zone, the library recorded fewer noise complaints but no change in total visits. Which statement is best supported?",
        options: [
          "The quiet zone reduced complaints without reducing attendance",
          "The library became more popular",
          "Visitors stopped using the library",
          "Noise complaints increased",
        ],
        correctAnswer: 0,
        explanation:
          "Dữ liệu trực tiếp cho thấy complaints giảm còn visits không đổi.",
        hint: "Đối chiếu hai kết quả: fewer complaints và no change in visits.",
      },
    ],
  },
  {
    id: "writing-email-workflows",
    title: "Email Workflows",
    description:
      "Viết email B1 có bối cảnh, hành động, thời hạn và giọng điệu chuyên nghiệp.",
    skill: "writing",
    level: "B1",
    duration: 18,
    icon: "📧",
    accent: "amber",
    tags: ["email", "workplace writing", "clarity"],
    exercises: [
      {
        id: "writing-email-workflows-01",
        type: "guided-writing",
        instruction: "Viết email yêu cầu đồng nghiệp gửi tài liệu.",
        prompt:
          "Write to a colleague. Ask for the latest presentation, explain why you need it, and give a deadline.",
        placeholder: "Hi Alex, could you please...",
        minimumWords: 45,
        checklist: [
          { label: "Có lời chào", keywords: ["hi", "hello", "dear"] },
          {
            label: "Yêu cầu bản trình bày mới nhất",
            keywords: ["latest presentation", "updated slides", "newest deck"],
          },
          {
            label: "Nêu mục đích",
            keywords: ["meeting", "review", "prepare", "presentation"],
          },
          {
            label: "Có thời hạn",
            keywords: ["by", "before", "tomorrow", "deadline"],
          },
        ],
        sampleAnswer:
          "Hi Alex, could you send me the latest presentation? I need it to prepare for tomorrow's client meeting. If possible, please send it by 4 p.m. today. Thanks for your help.",
        explanation:
          "Email công việc hiệu quả trả lời đủ cần gì, để làm gì và khi nào cần.",
        hint: "Dùng Could you... để yêu cầu lịch sự.",
      },
      {
        id: "writing-email-workflows-02",
        type: "guided-writing",
        instruction: "Viết email cập nhật tiến độ.",
        prompt:
          "Write to your manager. Report one completed task, one delay, and your next step.",
        placeholder: "Hello Ms. Mai, here's a quick update...",
        minimumWords: 50,
        checklist: [
          {
            label: "Nêu việc đã hoàn thành",
            keywords: ["completed", "finished", "done"],
          },
          {
            label: "Nêu sự chậm trễ",
            keywords: ["delay", "delayed", "late", "waiting"],
          },
          {
            label: "Nêu bước tiếp theo",
            keywords: ["next", "will", "plan", "follow up"],
          },
          {
            label: "Có câu kết lịch sự",
            keywords: ["please let me know", "regards", "thank"],
          },
        ],
        sampleAnswer:
          "Hello Ms. Mai, the product descriptions are completed and ready for review. The photo edits are delayed because we are waiting for the studio files. I will follow up with the studio this afternoon and send a new schedule tomorrow. Please let me know if you have questions.",
        explanation:
          "Một progress update nên tách rõ completed, blocked và next action để người quản lý dễ quyết định.",
        hint: "Dùng các tiêu đề ý nhỏ trong một đoạn ngắn: completed, delayed, next.",
      },
      {
        id: "writing-email-workflows-03",
        type: "guided-writing",
        instruction: "Viết email xử lý một lỗi dịch vụ.",
        prompt:
          "Write to a supplier. Describe a missing item, request a solution, and attach evidence.",
        placeholder: "Dear Supplier Team, we received...",
        minimumWords: 50,
        checklist: [
          {
            label: "Mô tả món bị thiếu",
            keywords: ["missing", "not included", "short", "item"],
          },
          {
            label: "Nêu mã đơn hàng",
            keywords: ["order", "invoice", "reference"],
          },
          {
            label: "Yêu cầu giải pháp",
            keywords: ["send", "replace", "refund", "resolve"],
          },
          {
            label: "Nhắc bằng chứng đính kèm",
            keywords: ["attached", "photo", "evidence"],
          },
        ],
        sampleAnswer:
          "Dear Supplier Team, we received order 4812 today, but one wireless keyboard was missing from the box. Could you please send a replacement this week? I have attached a photo of the package and the delivery note for reference. Thank you for your quick help.",
        explanation:
          "Nêu mã đơn và bằng chứng giúp nhà cung cấp tra cứu, còn request cụ thể giúp xử lý nhanh.",
        hint: "Dùng but để chuyển từ hàng đã nhận sang món bị thiếu.",
      },
      {
        id: "writing-email-workflows-04",
        type: "guided-writing",
        instruction: "Viết email mời họp có agenda rõ ràng.",
        prompt:
          "Invite a small team to a 30-minute meeting. State the time, purpose, and two agenda items.",
        placeholder: "Hi team, could we meet...",
        minimumWords: 50,
        checklist: [
          {
            label: "Nêu thời gian và thời lượng",
            keywords: ["Tuesday", "Wednesday", "a.m.", "p.m.", "30-minute"],
          },
          {
            label: "Nêu mục đích cuộc họp",
            keywords: ["meet", "discuss", "review", "purpose"],
          },
          {
            label: "Có agenda thứ nhất",
            keywords: ["budget", "timeline", "progress", "agenda"],
          },
          {
            label: "Có agenda thứ hai và lời xác nhận",
            keywords: ["next steps", "questions", "confirm", "let me know"],
          },
        ],
        sampleAnswer:
          "Hi team, could we meet for 30 minutes at 10 a.m. on Wednesday to review the launch plan? Our agenda will include the remaining timeline and the marketing budget. Please confirm that you can attend, and send me any questions in advance.",
        explanation:
          "Lời mời họp tốt cho người nhận biết thời lượng, mục tiêu, nội dung và cách xác nhận.",
        hint: "Tách hai agenda bằng first / second hoặc and.",
      },
    ],
  },
  {
    id: "writing-opinion-briefs",
    title: "Opinion Briefs & Synthesis",
    description:
      "Viết đoạn C1 có quan điểm, bằng chứng, phản biện và kết luận ngắn gọn.",
    skill: "writing",
    level: "C1",
    duration: 22,
    icon: "🖋️",
    accent: "rose",
    tags: ["argument", "synthesis", "advanced writing"],
    featured: true,
    exercises: [
      {
        id: "writing-opinion-briefs-01",
        type: "guided-writing",
        instruction: "Viết một đoạn lập luận có điều kiện và bằng chứng.",
        prompt:
          "Argue whether a four-day workweek should be tested. State your position, use one benefit and acknowledge one risk.",
        placeholder: "A four-day workweek should...",
        minimumWords: 80,
        checklist: [
          {
            label: "Nêu quan điểm rõ",
            keywords: ["should", "argue", "in my view", "I believe"],
          },
          {
            label: "Đưa một lợi ích",
            keywords: ["productivity", "well-being", "benefit", "save"],
          },
          {
            label: "Thừa nhận một rủi ro",
            keywords: ["however", "risk", "challenge", "although"],
          },
          {
            label: "Đề xuất cách thử nghiệm",
            keywords: ["pilot", "trial", "measure", "evaluate"],
          },
        ],
        sampleAnswer:
          "A four-day workweek should be tested through a limited pilot rather than adopted immediately. A shorter schedule may improve well-being and reduce commuting, but it could also create pressure if the workload remains unchanged. The company should run a three-month trial, measure output and customer response, and review the evidence before expanding it.",
        explanation:
          "Đoạn lập luận thuyết phục nêu vị trí, cân bằng lợi ích–rủi ro và đưa ra cách kiểm chứng.",
        hint: "Đừng chỉ nêu ý kiến; hãy nói cách đo kết quả.",
      },
      {
        id: "writing-opinion-briefs-02",
        type: "guided-writing",
        instruction: "Tổng hợp hai quan sát thành một khuyến nghị.",
        prompt:
          "A library has fewer complaints after creating quiet zones, but attendance is unchanged. Recommend the next step and justify it.",
        placeholder: "The library should...",
        minimumWords: 75,
        checklist: [
          {
            label: "Đề cập cả hai kết quả",
            keywords: ["complaints", "attendance", "visits", "unchanged"],
          },
          {
            label: "Đưa khuyến nghị",
            keywords: ["recommend", "should", "continue", "expand"],
          },
          {
            label: "Giải thích lý do",
            keywords: ["because", "since", "evidence", "suggests"],
          },
          {
            label: "Nêu cách theo dõi",
            keywords: ["monitor", "survey", "measure", "review"],
          },
        ],
        sampleAnswer:
          "The library should continue the quiet-zone trial and monitor it for another term. The fall in complaints suggests that the zones solve a real problem, while unchanged attendance indicates that they have not discouraged visitors. A short survey and room-level usage data would show whether the approach should be expanded.",
        explanation:
          "Synthesis tốt giữ cả kết quả tích cực và trung tính trước khi đưa ra bước tiếp theo.",
        hint: "Dùng while để đặt hai kết quả cạnh nhau.",
      },
      {
        id: "writing-opinion-briefs-03",
        type: "guided-writing",
        instruction: "Viết phản hồi chính sách với điều kiện rõ ràng.",
        prompt:
          "Respond to a proposal to collect more customer data. Support or oppose it, and include one privacy safeguard.",
        placeholder: "The proposal is worth considering if...",
        minimumWords: 80,
        checklist: [
          {
            label: "Nêu lập trường",
            keywords: ["support", "oppose", "worth", "concern"],
          },
          {
            label: "Nêu lợi ích hoặc mục đích",
            keywords: ["insight", "service", "improve", "purpose"],
          },
          {
            label: "Nêu biện pháp bảo vệ riêng tư",
            keywords: ["consent", "privacy", "anonymize", "access"],
          },
          {
            label: "Đặt điều kiện triển khai",
            keywords: ["provided", "only if", "before", "limit"],
          },
        ],
        sampleAnswer:
          "The proposal is worth considering if customers give informed consent and the company collects only data that serves a clear purpose. Anonymized records and role-based access would reduce privacy risks. Before launch, the team should publish a retention policy and test whether the additional data actually improves the service.",
        explanation:
          "Lập luận về dữ liệu cần kết hợp mục đích sử dụng với hàng rào bảo vệ, không chỉ nói có hoặc không.",
        hint: "Dùng if / provided để làm rõ điều kiện ủng hộ.",
      },
      {
        id: "writing-opinion-briefs-04",
        type: "guided-writing",
        instruction: "Viết bản tóm tắt khuyến nghị cho lãnh đạo.",
        prompt:
          "Summarize a pilot that reduced printing by 18 percent but may not generalize. Recommend how to decide whether to scale it.",
        placeholder: "The pilot provides encouraging evidence, but...",
        minimumWords: 85,
        checklist: [
          {
            label: "Nêu kết quả 18 percent",
            keywords: ["18", "percent", "reduced", "printing"],
          },
          {
            label: "Nêu giới hạn khái quát",
            keywords: ["generalize", "limited", "department", "workflow"],
          },
          {
            label: "Đề xuất thử nghiệm tiếp",
            keywords: ["replicate", "expand", "second", "trial"],
          },
          {
            label: "Nêu tiêu chí quyết định",
            keywords: ["evidence", "measure", "cost", "scale"],
          },
        ],
        sampleAnswer:
          "The pilot provides encouraging evidence, reducing printing by 18 percent in one department. However, the result may not generalize to teams with different workflows. I recommend replicating the trial in two contrasting departments, measuring savings and staff effort, and scaling the program only if the benefits remain material.",
        explanation:
          "Bản tóm tắt cho lãnh đạo nên ngắn, có số liệu, giới hạn và tiêu chí quyết định.",
        hint: "Đặt however trước giới hạn để tránh kết luận quá mức.",
      },
    ],
  },
  {
    id: "grammar-modal-requests",
    title: "Modal Requests & Obligations",
    description:
      "Dùng can, could, should, must và have to để yêu cầu, khuyên và nói về nghĩa vụ.",
    skill: "grammar",
    level: "B1",
    duration: 13,
    icon: "🛠️",
    accent: "amber",
    tags: ["modals", "requests", "obligation"],
    exercises: [
      {
        id: "grammar-modal-requests-01",
        type: "multiple-choice",
        instruction: "Chọn modal phù hợp với lời nhờ lịch sự.",
        prompt: "_____ you send me the revised agenda before the meeting?",
        options: ["Could", "Must", "Shouldn't", "Have"],
        correctAnswer: 0,
        explanation:
          "Could you...? là mẫu yêu cầu lịch sự; must diễn tả nghĩa vụ chứ không phù hợp ở đây.",
        hint: "Câu hỏi bắt đầu bằng một lời nhờ.",
      },
      {
        id: "grammar-modal-requests-02",
        type: "fill-blank",
        instruction: "Điền modal diễn tả nghĩa vụ nội quy.",
        prompt: "Visitors _____ wear a badge while they are in the lab.",
        correctAnswer: "must",
        acceptedAnswers: ["must", "have to"],
        placeholder: "must / have to...",
        explanation:
          "Must hoặc have to đều diễn tả quy định bắt buộc trong ngữ cảnh này.",
        hint: "Đây là quy định của phòng thí nghiệm.",
      },
      {
        id: "grammar-modal-requests-03",
        type: "reorder",
        instruction: "Sắp xếp thành lời khuyên có điều kiện.",
        prompt: "Khuyên người nghe nên sao lưu tệp trước khi cập nhật.",
        tokens: [
          "You",
          "should",
          "back",
          "up",
          "the",
          "file",
          "before",
          "updating",
        ],
        correctAnswer: "You should back up the file before updating",
        explanation:
          "Should + động từ nguyên mẫu đưa ra lời khuyên; back up là phrasal verb.",
        hint: "Đặt should ngay sau You.",
      },
      {
        id: "grammar-modal-requests-04",
        type: "multiple-choice",
        instruction: "Chọn câu modal không làm thay đổi nghĩa chính.",
        prompt: "Which sentence gives permission to leave early?",
        options: [
          "You may leave early.",
          "You must leave early.",
          "You should leave early.",
          "You cannot leave early.",
        ],
        correctAnswer: 0,
        explanation:
          "May diễn tả sự cho phép; must là bắt buộc, should là lời khuyên, cannot là cấm.",
        hint: "Tìm modal gần nghĩa với be allowed to.",
      },
    ],
  },
  {
    id: "grammar-advanced-linking",
    title: "Advanced Linking & Emphasis",
    description:
      "Nối ý chặt chẽ bằng despite, whereas, inversion và cấu trúc nhấn mạnh ở B2–C1.",
    skill: "grammar",
    level: "B2",
    duration: 15,
    icon: "🔗",
    accent: "rose",
    tags: ["linking", "emphasis", "advanced grammar"],
    featured: true,
    exercises: [
      {
        id: "grammar-advanced-linking-01",
        type: "multiple-choice",
        instruction: "Chọn từ nối đi với cụm danh từ.",
        prompt:
          "_____ the limited budget, the team delivered the project on time.",
        options: ["Despite", "Although", "Because", "Whereas"],
        correctAnswer: 0,
        explanation:
          "Despite + noun phrase (the limited budget) diễn tả sự tương phản.",
        hint: "Sau chỗ trống không có chủ ngữ và động từ đầy đủ.",
      },
      {
        id: "grammar-advanced-linking-02",
        type: "fill-blank",
        instruction: "Điền từ nối so sánh hai xu hướng.",
        prompt: "Online sales increased, _____ store visits remained stable.",
        correctAnswer: "whereas",
        acceptedAnswers: ["whereas", "while"],
        placeholder: "whereas / while...",
        explanation:
          "Whereas hoặc while nối hai mệnh đề có xu hướng tương phản.",
        hint: "Hai kết quả được đặt cạnh nhau để so sánh.",
      },
      {
        id: "grammar-advanced-linking-03",
        type: "reorder",
        instruction: "Sắp xếp câu nhấn mạnh bằng only after.",
        prompt:
          "Nói rằng chỉ sau khi thử nghiệm nhóm mới mở rộng chương trình.",
        tokens: [
          "Only",
          "after",
          "the",
          "trial",
          "did",
          "the",
          "team",
          "expand",
          "the",
          "program",
        ],
        correctAnswer: "Only after the trial did the team expand the program",
        explanation:
          "Only after ở đầu câu kéo theo đảo trợ động từ did trước chủ ngữ.",
        hint: "Sau Only after the trial là did the team.",
      },
      {
        id: "grammar-advanced-linking-04",
        type: "multiple-choice",
        instruction: "Chọn cấu trúc nhấn mạnh đúng.",
        prompt:
          "It was the clear timeline _____ convinced the client to approve the plan.",
        options: ["what", "that", "where", "whose"],
        correctAnswer: 1,
        explanation:
          "Cấu trúc It was...that nhấn mạnh chủ thể hoặc lý do: chính timeline rõ ràng đã thuyết phục khách hàng.",
        hint: "Đây là cleft sentence, không phải mệnh đề địa điểm.",
      },
    ],
  },
];
