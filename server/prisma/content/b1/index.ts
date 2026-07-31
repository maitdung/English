import {
  createProgressionCourse,
  type ProgressionLessonSeed,
} from '../progression/factory';

const b1Seeds: ProgressionLessonSeed[] = [
  {
    id: 1,
    slug: 'b1-workplace-collaboration',
    title: 'Workplace Collaboration',
    category: 'mixed' as const,
    description:
      'Collaborate in meetings, negotiate responsibilities and write clear professional updates at B1 level.',
    tags: ['workplace', 'meetings', 'collaboration', 'professional-writing'],
    vocabulary: [
      [
        'agenda',
        '/əˈdʒendə/',
        'noun',
        'chương trình họp',
        'The agenda lists three decisions for today.',
        'Chương trình họp liệt kê ba quyết định hôm nay.',
      ],
      [
        'deadline',
        '/ˈdedlaɪn/',
        'noun',
        'hạn chót',
        'We agreed to move the deadline to Friday.',
        'Chúng tôi đồng ý chuyển hạn chót sang thứ Sáu.',
      ],
      [
        'delegate',
        '/ˈdelɪɡeɪt/',
        'verb',
        'giao việc',
        'A project lead should delegate tasks clearly.',
        'Trưởng dự án nên giao việc rõ ràng.',
      ],
      [
        'contribute',
        '/kənˈtrɪbjuːt/',
        'verb',
        'đóng góp',
        'Every member contributed an idea.',
        'Mỗi thành viên đóng góp một ý tưởng.',
      ],
      [
        'priority',
        '/praɪˈɒrəti/',
        'noun',
        'ưu tiên',
        'Customer safety remains our first priority.',
        'An toàn khách hàng vẫn là ưu tiên hàng đầu.',
      ],
      [
        'feedback',
        '/ˈfiːdbæk/',
        'noun',
        'phản hồi',
        'Constructive feedback improved the proposal.',
        'Phản hồi mang tính xây dựng cải thiện đề xuất.',
      ],
      [
        'coordinate',
        '/kəʊˈɔːdɪneɪt/',
        'verb',
        'phối hợp',
        'Lan coordinates the design and engineering teams.',
        'Lan phối hợp nhóm thiết kế và kỹ thuật.',
      ],
      [
        'efficient',
        '/ɪˈfɪʃənt/',
        'adjective',
        'hiệu quả',
        'A shared checklist makes the process efficient.',
        'Danh sách chung làm quy trình hiệu quả.',
      ],
      [
        'clarify',
        '/ˈklærəfaɪ/',
        'verb',
        'làm rõ',
        'Could you clarify who owns this task?',
        'Bạn có thể làm rõ ai phụ trách việc này không?',
      ],
      [
        'proposal',
        '/prəˈpəʊzəl/',
        'noun',
        'đề xuất',
        'The team approved the revised proposal.',
        'Nhóm phê duyệt đề xuất đã chỉnh sửa.',
      ],
      [
        'outcome',
        '/ˈaʊtkʌm/',
        'noun',
        'kết quả',
        'The meeting produced a positive outcome.',
        'Cuộc họp tạo ra kết quả tích cực.',
      ],
      [
        'responsibility',
        '/rɪˌspɒnsəˈbɪləti/',
        'noun',
        'trách nhiệm',
        'Each responsibility has a named owner.',
        'Mỗi trách nhiệm có một người phụ trách cụ thể.',
      ],
    ],
    grammarTitle: 'first conditional and future time clauses',
    grammarExplanation:
      'Use the first conditional for realistic future results. In time clauses beginning with when, as soon as, before or after, use a present form even when the meaning is future.',
    grammarExamples: [
      [
        'If we finish the draft today, the client will review it tomorrow.',
        'Nếu hoàn thành bản nháp hôm nay, khách hàng sẽ xem vào ngày mai.',
      ],
      [
        'I will send the minutes as soon as the meeting ends.',
        'Tôi sẽ gửi biên bản ngay khi cuộc họp kết thúc.',
      ],
      [
        'Before we launch, the security team will run a final check.',
        'Trước khi ra mắt, nhóm bảo mật sẽ kiểm tra lần cuối.',
      ],
    ],
    dialogueTitle: 'Reassigning work before a deadline',
    dialogue: [
      [
        'Manager',
        'We need to clarify our priorities before Friday.',
        'Chúng ta cần làm rõ ưu tiên trước thứ Sáu.',
      ],
      [
        'Nhi',
        'The research is complete, but the final charts are delayed.',
        'Phần nghiên cứu đã xong nhưng biểu đồ cuối bị chậm.',
      ],
      [
        'Manager',
        'What will happen if we keep the current plan?',
        'Điều gì sẽ xảy ra nếu giữ kế hoạch hiện tại?',
      ],
      [
        'Nhi',
        'We will miss the client review unless someone helps with the charts.',
        'Chúng ta sẽ lỡ buổi duyệt của khách nếu không có người hỗ trợ biểu đồ.',
      ],
      [
        'Huy',
        'I can take that responsibility after I finish the summary.',
        'Tôi có thể nhận trách nhiệm đó sau khi hoàn thành bản tóm tắt.',
      ],
      [
        'Manager',
        'Good. Nhi, please coordinate with Huy and share the source data.',
        'Tốt. Nhi hãy phối hợp với Huy và chia sẻ dữ liệu nguồn.',
      ],
      [
        'Nhi',
        'I will send everything as soon as this meeting ends.',
        'Tôi sẽ gửi mọi thứ ngay khi cuộc họp kết thúc.',
      ],
      [
        'Manager',
        'Excellent. Let us record the new owners in the minutes.',
        'Tuyệt. Hãy ghi người phụ trách mới vào biên bản.',
      ],
    ],
    readingTitle: 'Why a short project meeting worked',
    readingPassage:
      'A small software company replaced its weekly one-hour status meeting with a focused twenty-minute session. Before the meeting, team members updated a shared board with progress, risks and requests for help. During the session, they discussed only blocked tasks and decisions that needed several people. Routine updates stayed on the board. The project manager also ended every discussion with an owner and a deadline. After six weeks, employees reported fewer repeated conversations and faster decisions. The new system did not remove communication; it made communication more purposeful. Team members still scheduled longer discussions when a complex problem required careful analysis.',
    readingTranslation:
      'Một công ty phần mềm nhỏ thay cuộc họp tình hình một giờ mỗi tuần bằng phiên tập trung hai mươi phút. Trước cuộc họp, thành viên cập nhật bảng chung về tiến độ, rủi ro và yêu cầu hỗ trợ. Trong phiên họ chỉ thảo luận nhiệm vụ bị kẹt và quyết định cần nhiều người. Cập nhật thường kỳ được giữ trên bảng. Quản lý dự án cũng kết thúc mỗi cuộc trao đổi bằng người phụ trách và hạn chót. Sau sáu tuần, nhân viên cho biết có ít cuộc nói chuyện lặp lại và quyết định nhanh hơn. Hệ thống mới không loại bỏ giao tiếp; nó làm giao tiếp có mục đích hơn. Nhóm vẫn lên lịch thảo luận dài khi vấn đề phức tạp cần phân tích kỹ.',
    readingQuestions: [
      {
        question: 'What did members do before the meeting?',
        options: [
          'They called every client.',
          'They updated a shared board.',
          'They wrote a long report.',
          'They cancelled blocked tasks.',
        ],
        answer: 1,
      },
      {
        question: 'Which topics were discussed live?',
        options: [
          'Every routine update.',
          'Only social activities.',
          'Blocked tasks and shared decisions.',
          'Personal schedules.',
        ],
        answer: 2,
      },
      {
        question: 'What was the main benefit?',
        options: [
          'Communication became more purposeful.',
          'All meetings disappeared.',
          'Projects no longer had deadlines.',
          'Managers made every decision alone.',
        ],
        answer: 0,
      },
    ],
    listeningTranscript:
      'Before we finish, here are the actions we agreed. Minh will revise the budget by Wednesday afternoon. Trang will contact the two suppliers and compare delivery dates. If either supplier cannot meet our deadline, she will ask the local partner for an alternative quote. I will send the updated agenda as soon as the client confirms Friday’s meeting. Please add any risks to the shared board before tomorrow’s check-in.',
    listeningQuestions: [
      {
        question: 'What will Minh revise?',
        options: [
          'The budget.',
          'The agenda.',
          'The supplier contract.',
          'The shared board.',
        ],
        answer: 0,
      },
      {
        question: 'What will Trang compare?',
        options: [
          'Client feedback.',
          'Delivery dates.',
          'Meeting rooms.',
          'Team salaries.',
        ],
        answer: 1,
      },
      {
        question: 'When will the speaker send the agenda?',
        options: [
          'After the client confirms.',
          'Before Wednesday.',
          'When the supplier calls.',
          'At tomorrow’s check-in.',
        ],
        answer: 0,
      },
    ],
    speakingTask:
      'Run a short project check-in. Report progress, explain one risk, negotiate responsibilities and finish with a clear owner and deadline for each action.',
    writingTask:
      'Write a 100–130 word project update. Summarise completed work, identify one risk, state the next actions and use a first conditional sentence.',
    writingSample:
      'The research phase is now complete, and the team has approved the main findings. We are currently revising the charts for the client presentation. The main risk is the short review period. If we receive feedback by Thursday morning, we will deliver the final version on Friday. Huy will update the charts, Nhi will check the figures, and I will coordinate the client review.',
  },
  {
    id: 2,
    slug: 'b1-media-technology-and-digital-habits',
    title: 'Media, Technology & Digital Habits',
    category: 'reading' as const,
    description:
      'Evaluate online information, explain digital habits and discuss the benefits and risks of everyday technology.',
    tags: ['media-literacy', 'technology', 'online-safety', 'opinions'],
    vocabulary: [
      [
        'reliable',
        '/rɪˈlaɪəbl/',
        'adjective',
        'đáng tin cậy',
        'The article links to reliable research.',
        'Bài báo liên kết đến nghiên cứu đáng tin cậy.',
      ],
      [
        'source',
        '/sɔːs/',
        'noun',
        'nguồn thông tin',
        'Always check the original source of a claim.',
        'Luôn kiểm tra nguồn gốc của một khẳng định.',
      ],
      [
        'headline',
        '/ˈhedlaɪn/',
        'noun',
        'tiêu đề',
        'The headline was more dramatic than the story.',
        'Tiêu đề kịch tính hơn nội dung.',
      ],
      [
        'privacy',
        '/ˈprɪvəsi/',
        'noun',
        'quyền riêng tư',
        'Review the privacy settings on your account.',
        'Hãy xem lại cài đặt quyền riêng tư của tài khoản.',
      ],
      [
        'algorithm',
        '/ˈælɡərɪðəm/',
        'noun',
        'thuật toán',
        'The algorithm recommends similar videos.',
        'Thuật toán đề xuất các video tương tự.',
      ],
      [
        'misleading',
        '/ˌmɪsˈliːdɪŋ/',
        'adjective',
        'gây hiểu lầm',
        'The graph was technically correct but misleading.',
        'Biểu đồ đúng về kỹ thuật nhưng gây hiểu lầm.',
      ],
      [
        'verify',
        '/ˈverɪfaɪ/',
        'verb',
        'xác minh',
        'A journalist tried to verify the photograph.',
        'Một nhà báo cố xác minh bức ảnh.',
      ],
      [
        'permission',
        '/pəˈmɪʃən/',
        'noun',
        'quyền cho phép',
        'The app requested permission to use the camera.',
        'Ứng dụng yêu cầu quyền sử dụng máy ảnh.',
      ],
      [
        'notification',
        '/ˌnəʊtɪfɪˈkeɪʃən/',
        'noun',
        'thông báo',
        'I turned off unnecessary notifications.',
        'Tôi tắt các thông báo không cần thiết.',
      ],
      [
        'influence',
        '/ˈɪnfluəns/',
        'verb',
        'ảnh hưởng',
        'Repeated messages can influence our choices.',
        'Thông điệp lặp lại có thể ảnh hưởng lựa chọn.',
      ],
      [
        'evidence',
        '/ˈevɪdəns/',
        'noun',
        'bằng chứng',
        'The report provides evidence for its conclusion.',
        'Báo cáo cung cấp bằng chứng cho kết luận.',
      ],
      [
        'balanced',
        '/ˈbælənst/',
        'adjective',
        'cân bằng, đa chiều',
        'A balanced article includes several perspectives.',
        'Một bài viết đa chiều gồm nhiều góc nhìn.',
      ],
    ],
    grammarTitle: 'reported speech for statements and questions',
    grammarExplanation:
      'Use reported speech to communicate what another person said. Pronouns, time references and verb forms often change to match the new reporting context.',
    grammarExamples: [
      [
        'The editor said that the image had been verified.',
        'Biên tập viên nói rằng hình ảnh đã được xác minh.',
      ],
      [
        'She asked whether the source was reliable.',
        'Cô ấy hỏi liệu nguồn có đáng tin không.',
      ],
      [
        'He told us not to share the misleading post.',
        'Anh ấy bảo chúng tôi không chia sẻ bài đăng gây hiểu lầm.',
      ],
    ],
    dialogueTitle: 'Checking a surprising online story',
    dialogue: [
      [
        'Vy',
        'Have you seen this story about a four-day school week?',
        'Bạn đã xem tin về tuần học bốn ngày chưa?',
      ],
      [
        'Khoa',
        'I saw the headline, but I am not sure the source is reliable.',
        'Mình thấy tiêu đề nhưng không chắc nguồn đáng tin.',
      ],
      [
        'Vy',
        'The post says that every school will change next month.',
        'Bài đăng nói mọi trường sẽ thay đổi tháng tới.',
      ],
      [
        'Khoa',
        'Did it link to an official announcement?',
        'Nó có dẫn thông báo chính thức không?',
      ],
      [
        'Vy',
        'No. It only included a screenshot.',
        'Không. Nó chỉ có ảnh chụp màn hình.',
      ],
      [
        'Khoa',
        'Our teacher told us to verify screenshots before sharing them.',
        'Giáo viên bảo chúng ta xác minh ảnh chụp trước khi chia sẻ.',
      ],
      [
        'Vy',
        'I found the original report. It describes one small trial, not every school.',
        'Mình tìm thấy báo cáo gốc. Nó nói về một thử nghiệm nhỏ, không phải mọi trường.',
      ],
      [
        'Khoa',
        'Then the headline is misleading. We should not repost it.',
        'Vậy tiêu đề gây hiểu lầm. Chúng ta không nên đăng lại.',
      ],
    ],
    readingTitle: 'The pause-before-sharing method',
    readingPassage:
      'A media literacy group teaches students a simple “pause-before-sharing” method. First, readers stop and notice their emotional reaction. Content that creates immediate anger or excitement may be designed to encourage a quick share. Next, they leave the page and investigate the source: Who created it, and what expertise or interest does that person have? Then they search for independent coverage and trace quotations or images back to their original context. Finally, they decide whether sharing the information will help others. The method takes a few minutes, but students say it prevents many mistakes and makes them more confident when discussing online claims.',
    readingTranslation:
      'Một nhóm giáo dục truyền thông dạy học sinh phương pháp “dừng trước khi chia sẻ”. Đầu tiên, người đọc dừng lại và chú ý phản ứng cảm xúc. Nội dung gây tức giận hoặc phấn khích ngay lập tức có thể được thiết kế để thúc đẩy chia sẻ nhanh. Tiếp theo, họ rời trang và tìm hiểu nguồn: Ai tạo ra và người đó có chuyên môn hay lợi ích gì? Sau đó họ tìm bài đưa tin độc lập và truy về bối cảnh gốc của trích dẫn hoặc hình ảnh. Cuối cùng, họ quyết định việc chia sẻ có giúp người khác không. Phương pháp mất vài phút nhưng học sinh nói nó ngăn nhiều sai lầm và giúp họ tự tin hơn khi thảo luận các khẳng định trực tuyến.',
    readingQuestions: [
      {
        question: 'Why should readers notice emotion first?',
        options: [
          'Emotional content may encourage quick sharing.',
          'Every emotional story is false.',
          'It improves internet speed.',
          'It identifies the author automatically.',
        ],
        answer: 0,
      },
      {
        question: 'What should readers investigate about a source?',
        options: [
          'Its colour and font.',
          'The creator’s expertise and interests.',
          'The number of advertisements only.',
          'The reader’s password.',
        ],
        answer: 1,
      },
      {
        question: 'What result did students report?',
        options: [
          'They stopped using media.',
          'They shared everything faster.',
          'They made fewer mistakes and felt more confident.',
          'They avoided all discussions.',
        ],
        answer: 2,
      },
    ],
    listeningTranscript:
      'In today’s digital habits challenge, choose one app that frequently interrupts you. Open its notification settings and keep only messages that require timely action. Next, check which permissions the app has. If a permission is not necessary for the main function, turn it off. Finally, move the app away from your home screen for one week. Participants reported that these small changes reduced automatic checking without preventing important communication.',
    listeningQuestions: [
      {
        question: 'What should users keep enabled?',
        options: [
          'Every notification.',
          'Messages requiring timely action.',
          'All camera permissions.',
          'Automatic videos.',
        ],
        answer: 1,
      },
      {
        question: 'When should a permission be turned off?',
        options: [
          'When it is not necessary for the main function.',
          'Whenever the phone is charging.',
          'After every message.',
          'Only during weekends.',
        ],
        answer: 0,
      },
      {
        question: 'What effect did participants report?',
        options: [
          'More automatic checking.',
          'No important communication.',
          'Less automatic checking.',
          'More advertisements.',
        ],
        answer: 2,
      },
    ],
    speakingTask:
      'Discuss a surprising online claim. Explain how you would verify it, compare two possible sources and decide whether it is responsible to share.',
    writingTask:
      'Write a 110–140 word balanced opinion paragraph about one digital habit. Include a benefit, a risk, evidence or an example, and a practical recommendation.',
    writingSample:
      'Notifications can help people respond quickly to important messages, but too many alerts interrupt concentration. A study shared by our school counsellor suggested that students checked their phones less often after disabling non-essential notifications. However, completely turning off communication may create other problems. A balanced solution is to keep alerts from family and school while reviewing entertainment apps at planned times.',
  },
  {
    id: 3,
    slug: 'b1-environment-and-local-action',
    title: 'Environment & Local Action',
    category: 'speaking' as const,
    description:
      'Explain environmental cause and effect, compare solutions and present a persuasive local action proposal.',
    tags: ['environment', 'cause-effect', 'solutions', 'presentation'],
    vocabulary: [
      [
        'sustainable',
        '/səˈsteɪnəbl/',
        'adjective',
        'bền vững',
        'The town needs a sustainable transport plan.',
        'Thị trấn cần kế hoạch giao thông bền vững.',
      ],
      [
        'emission',
        '/ɪˈmɪʃən/',
        'noun',
        'khí thải',
        'Electric buses can reduce urban emissions.',
        'Xe buýt điện có thể giảm khí thải đô thị.',
      ],
      [
        'conserve',
        '/kənˈsɜːv/',
        'verb',
        'bảo tồn, tiết kiệm',
        'Simple equipment helps the school conserve water.',
        'Thiết bị đơn giản giúp trường tiết kiệm nước.',
      ],
      [
        'landfill',
        '/ˈlændfɪl/',
        'noun',
        'bãi chôn lấp',
        'Food waste should not go directly to landfill.',
        'Rác thực phẩm không nên đi thẳng đến bãi chôn lấp.',
      ],
      [
        'renewable',
        '/rɪˈnjuːəbl/',
        'adjective',
        'có thể tái tạo',
        'Solar energy is a renewable resource.',
        'Năng lượng mặt trời là nguồn tái tạo.',
      ],
      [
        'campaign',
        '/kæmˈpeɪn/',
        'noun',
        'chiến dịch',
        'Students launched a plastic reduction campaign.',
        'Học sinh phát động chiến dịch giảm nhựa.',
      ],
      [
        'impact',
        '/ˈɪmpækt/',
        'noun',
        'tác động',
        'The project had a measurable impact on waste.',
        'Dự án có tác động đo lường được lên rác thải.',
      ],
      [
        'participate',
        '/pɑːˈtɪsɪpeɪt/',
        'verb',
        'tham gia',
        'More than two hundred residents participated.',
        'Hơn hai trăm cư dân tham gia.',
      ],
      [
        'alternative',
        '/ɔːlˈtɜːnətɪv/',
        'noun',
        'phương án thay thế',
        'Cycling is a practical alternative for short trips.',
        'Đi xe đạp là phương án thiết thực cho chuyến ngắn.',
      ],
      [
        'measure',
        '/ˈmeʒə/',
        'verb',
        'đo lường',
        'The team will measure energy use each month.',
        'Nhóm sẽ đo mức dùng năng lượng mỗi tháng.',
      ],
      [
        'awareness',
        '/əˈweənəs/',
        'noun',
        'nhận thức',
        'The exhibition raised awareness of air pollution.',
        'Triển lãm nâng nhận thức về ô nhiễm không khí.',
      ],
      [
        'incentive',
        '/ɪnˈsentɪv/',
        'noun',
        'động lực khuyến khích',
        'A discount can be an incentive to reuse containers.',
        'Giảm giá có thể khuyến khích tái sử dụng hộp.',
      ],
    ],
    grammarTitle: 'passive voice for processes and formal proposals',
    grammarExplanation:
      'Use the passive when the action or result is more important than the person performing it, especially in process descriptions, reports and formal proposals.',
    grammarExamples: [
      [
        'Food waste is collected from three local markets.',
        'Rác thực phẩm được thu gom từ ba chợ địa phương.',
      ],
      [
        'The results will be measured every month.',
        'Kết quả sẽ được đo mỗi tháng.',
      ],
      [
        'More trees were planted along the main road last year.',
        'Năm ngoái nhiều cây hơn đã được trồng dọc đường chính.',
      ],
    ],
    dialogueTitle: 'Choosing an environmental project',
    dialogue: [
      [
        'Facilitator',
        'We can fund one local environmental project this term.',
        'Học kỳ này chúng ta có thể tài trợ một dự án môi trường địa phương.',
      ],
      [
        'Son',
        'I propose a refill station to reduce plastic bottles.',
        'Tôi đề xuất trạm tiếp nước để giảm chai nhựa.',
      ],
      [
        'Thu',
        'How will its impact be measured?',
        'Tác động của nó sẽ được đo thế nào?',
      ],
      [
        'Son',
        'The number of refills will be recorded each week.',
        'Số lần tiếp nước sẽ được ghi lại mỗi tuần.',
      ],
      [
        'Thu',
        'A bicycle campaign may involve more residents.',
        'Chiến dịch xe đạp có thể thu hút nhiều cư dân hơn.',
      ],
      [
        'Son',
        'That is true, but safe bicycle parking must be provided first.',
        'Đúng, nhưng trước hết phải có chỗ đỗ xe đạp an toàn.',
      ],
      [
        'Facilitator',
        'Could the two ideas be connected?',
        'Hai ý tưởng có thể kết nối không?',
      ],
      [
        'Thu',
        'Yes. Refill stations could be installed beside new bicycle parking.',
        'Có. Trạm tiếp nước có thể lắp cạnh chỗ đỗ xe đạp mới.',
      ],
    ],
    readingTitle: 'A market turns food waste into local value',
    readingPassage:
      'A district market used to send several tonnes of fruit and vegetable waste to landfill every month. In 2025, a partnership was created between stall owners, a community garden and a small composting company. Separate containers were placed behind the market, and sellers were trained to remove plastic packaging. The organic waste is now collected three times a week and processed into compost. Part of the compost is sold, while the rest is provided to schools and neighbourhood gardens. After one year, landfill waste had fallen by thirty percent. The organisers believe the project succeeded because the process was convenient, results were measured and participants regularly received feedback.',
    readingTranslation:
      'Một chợ quận từng gửi vài tấn rác rau quả đến bãi chôn lấp mỗi tháng. Năm 2025, một quan hệ hợp tác được lập giữa tiểu thương, vườn cộng đồng và công ty ủ phân nhỏ. Các thùng riêng được đặt sau chợ và người bán được hướng dẫn bỏ bao bì nhựa. Rác hữu cơ giờ được thu ba lần mỗi tuần và xử lý thành phân. Một phần phân được bán, phần còn lại cung cấp cho trường học và vườn khu phố. Sau một năm, rác chôn lấp giảm ba mươi phần trăm. Ban tổ chức tin dự án thành công vì quy trình thuận tiện, kết quả được đo và người tham gia thường xuyên nhận phản hồi.',
    readingQuestions: [
      {
        question: 'Who participated in the partnership?',
        options: [
          'Only the city council.',
          'Stall owners, a garden and a composting company.',
          'International airlines.',
          'A single school.',
        ],
        answer: 1,
      },
      {
        question: 'What happens to the compost?',
        options: [
          'It is all sent abroad.',
          'It is thrown into landfill.',
          'It is sold or provided to local groups.',
          'It is mixed with plastic.',
        ],
        answer: 2,
      },
      {
        question: 'Why did organisers think the project worked?',
        options: [
          'Participation was compulsory.',
          'The process was convenient and measured.',
          'Waste collection stopped.',
          'Results were kept secret.',
        ],
        answer: 1,
      },
    ],
    listeningTranscript:
      'The council’s clean travel trial begins next Monday. Two electric minibuses will be used on the riverside route, and secure bicycle parking has been installed at four stops. Residents can register for a free travel card online or at the library. During the twelve-week trial, passenger numbers and estimated emissions will be measured. Feedback will be collected through a short monthly survey, and the results will be presented at a public meeting in October.',
    listeningQuestions: [
      {
        question: 'What vehicles will be used?',
        options: [
          'Diesel trucks.',
          'Electric minibuses.',
          'Private taxis.',
          'Tourist boats.',
        ],
        answer: 1,
      },
      {
        question: 'Where can residents register in person?',
        options: [
          'At the library.',
          'At every bus stop.',
          'At the market.',
          'At the public meeting.',
        ],
        answer: 0,
      },
      {
        question: 'How will feedback be collected?',
        options: [
          'Through a monthly survey.',
          'Through daily phone calls.',
          'Only at the final meeting.',
          'Through ticket prices.',
        ],
        answer: 0,
      },
    ],
    speakingTask:
      'Present a local environmental proposal. Explain the problem, compare two solutions, describe how the chosen solution will be implemented and state how impact will be measured.',
    writingTask:
      'Write a 120–150 word proposal for a school or neighbourhood environmental project. Use passive voice, include measurable outcomes and explain how people will participate.',
    writingSample:
      'A refill and recycling point should be installed beside the school canteen. At present, hundreds of single-use bottles are thrown away each week. Reusable bottles could be filled for free, while separate containers would be provided for metal, paper and plastic. The amount of waste will be measured every Friday and published on the student board. Classes that reduce the most waste could receive a small environmental project grant.',
  },
];

export const b1Course = createProgressionCourse(
  'english-b1-connected-skills',
  'B1',
  'English B1 Connected Skills',
  'An intermediate programme connecting workplace communication, media literacy and environmental action through deeper reading, listening, speaking, writing and problem-solving.',
  b1Seeds,
);

export default b1Course;
