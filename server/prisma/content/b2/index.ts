import {
  createProgressionCourse,
  type ProgressionLessonSeed,
} from '../progression/factory';

const b2Seeds: ProgressionLessonSeed[] = [
  {
    id: 1,
    slug: 'b2-negotiation-and-conflict-resolution',
    title: 'Negotiation & Conflict Resolution',
    category: 'speaking',
    description:
      'Negotiate competing priorities, manage disagreement and reach workable compromises with precise B2 language.',
    tags: ['negotiation', 'conflict', 'compromise', 'professional-speaking'],
    vocabulary: [
      [
        'compromise',
        '/ˈkɒmprəmaɪz/',
        'noun',
        'sự thỏa hiệp',
        'The final schedule was a reasonable compromise.',
        'Lịch cuối cùng là một thỏa hiệp hợp lý.',
      ],
      [
        'constraint',
        '/kənˈstreɪnt/',
        'noun',
        'sự hạn chế',
        'Budget constraints affected the original proposal.',
        'Hạn chế ngân sách ảnh hưởng đề xuất ban đầu.',
      ],
      [
        'counteroffer',
        '/ˈkaʊntərɒfə/',
        'noun',
        'đề nghị ngược lại',
        'The supplier submitted a detailed counteroffer.',
        'Nhà cung cấp đưa ra đề nghị ngược lại chi tiết.',
      ],
      [
        'concession',
        '/kənˈseʃən/',
        'noun',
        'sự nhượng bộ',
        'Both sides made one important concession.',
        'Cả hai bên đưa ra một nhượng bộ quan trọng.',
      ],
      [
        'deadlock',
        '/ˈdedlɒk/',
        'noun',
        'thế bế tắc',
        'A neutral facilitator helped break the deadlock.',
        'Một điều phối viên trung lập giúp phá thế bế tắc.',
      ],
      [
        'mutual',
        '/ˈmjuːtʃuəl/',
        'adjective',
        'lẫn nhau',
        'The agreement created mutual benefits.',
        'Thỏa thuận tạo lợi ích cho cả hai bên.',
      ],
      [
        'underlying',
        '/ˌʌndəˈlaɪɪŋ/',
        'adjective',
        'tiềm ẩn, cốt lõi',
        'We first identified the underlying concern.',
        'Trước tiên chúng tôi xác định mối lo cốt lõi.',
      ],
      [
        'perspective',
        '/pəˈspektɪv/',
        'noun',
        'góc nhìn',
        'Try to understand the issue from her perspective.',
        'Hãy cố hiểu vấn đề từ góc nhìn của cô ấy.',
      ],
      [
        'feasible',
        '/ˈfiːzəbl/',
        'adjective',
        'khả thi',
        'The revised timeline is financially feasible.',
        'Lịch điều chỉnh khả thi về tài chính.',
      ],
      [
        'mediate',
        '/ˈmiːdieɪt/',
        'verb',
        'hòa giải',
        'A senior colleague offered to mediate the dispute.',
        'Một đồng nghiệp cấp cao đề nghị hòa giải tranh chấp.',
      ],
      [
        'consensus',
        '/kənˈsensəs/',
        'noun',
        'sự đồng thuận',
        'The group reached consensus after two meetings.',
        'Nhóm đạt đồng thuận sau hai cuộc họp.',
      ],
      [
        'trade-off',
        '/ˈtreɪd ɒf/',
        'noun',
        'sự đánh đổi',
        'There is a trade-off between speed and accuracy.',
        'Có sự đánh đổi giữa tốc độ và độ chính xác.',
      ],
    ],
    grammarTitle: 'mixed conditionals and negotiation hypotheticals',
    grammarExplanation:
      'Mixed conditionals connect an unreal past condition with a present result, or a present condition with a past result. They are useful for evaluating decisions without making accusations.',
    grammarExamples: [
      [
        'If we had clarified the scope earlier, we would not be in this deadlock now.',
        'Nếu làm rõ phạm vi sớm hơn, giờ chúng ta đã không bế tắc.',
      ],
      [
        'If the current process were more flexible, we could have accepted the first offer.',
        'Nếu quy trình hiện tại linh hoạt hơn, chúng ta đã có thể nhận đề nghị đầu tiên.',
      ],
      [
        'Provided that quality is protected, we could shorten the review period.',
        'Miễn chất lượng được bảo vệ, chúng ta có thể rút ngắn thời gian duyệt.',
      ],
    ],
    dialogueTitle: 'Resolving a launch-date dispute',
    dialogue: [
      [
        'Client',
        'We need the product released two weeks earlier than planned.',
        'Chúng tôi cần sản phẩm ra mắt sớm hơn kế hoạch hai tuần.',
      ],
      [
        'Lead',
        'I understand the urgency, but testing is our main constraint.',
        'Tôi hiểu tính cấp bách, nhưng kiểm thử là hạn chế chính.',
      ],
      [
        'Client',
        'Could some non-essential features be postponed?',
        'Có thể hoãn một số tính năng không thiết yếu không?',
      ],
      [
        'Lead',
        'That is feasible, provided that the security review remains unchanged.',
        'Điều đó khả thi, miễn việc duyệt bảo mật không thay đổi.',
      ],
      [
        'Client',
        'Our priority is the payment function. We can make that concession.',
        'Ưu tiên của chúng tôi là thanh toán. Chúng tôi có thể nhượng bộ điều đó.',
      ],
      [
        'Lead',
        'Then our counteroffer is an earlier core release followed by two updates.',
        'Vậy đề nghị ngược lại là phát hành phần cốt lõi sớm rồi có hai bản cập nhật.',
      ],
      [
        'Client',
        'What trade-off would that involve?',
        'Phương án đó có sự đánh đổi nào?',
      ],
      [
        'Lead',
        'Fewer launch features, but the same quality and a lower operational risk.',
        'Ít tính năng khi ra mắt hơn, nhưng cùng chất lượng và rủi ro vận hành thấp hơn.',
      ],
    ],
    readingTitle: 'From positions to interests',
    readingPassage:
      'Negotiations often fail because participants defend fixed positions rather than examine the interests beneath them. A tenant may demand a lower rent, while a landlord refuses any reduction. At the level of positions, the dispute appears impossible. Yet the tenant may actually need predictable costs, and the landlord may need reliable long-term occupancy. A longer contract with smaller annual increases could address both interests. Skilled negotiators therefore ask diagnostic questions, summarise the other side’s perspective and generate several options before judging them. This approach does not guarantee agreement, but it makes hidden trade-offs visible and reduces the risk that a temporary disagreement becomes a personal conflict.',
    readingTranslation:
      'Đàm phán thường thất bại vì người tham gia bảo vệ lập trường cố định thay vì xem xét lợi ích bên dưới. Người thuê có thể đòi giảm giá, còn chủ nhà từ chối. Ở mức lập trường, tranh chấp tưởng như không thể giải quyết. Nhưng người thuê thực ra cần chi phí ổn định, còn chủ nhà cần người thuê lâu dài đáng tin. Hợp đồng dài hơn với mức tăng nhỏ hằng năm có thể đáp ứng cả hai. Vì vậy người đàm phán giỏi đặt câu hỏi chẩn đoán, tóm tắt góc nhìn bên kia và tạo nhiều lựa chọn trước khi đánh giá. Cách này không đảm bảo thỏa thuận nhưng làm rõ đánh đổi ẩn và giảm nguy cơ bất đồng trở thành xung đột cá nhân.',
    readingQuestions: [
      {
        question: 'Why do negotiations often fail according to the passage?',
        options: [
          'Participants focus on fixed positions.',
          'There are too many options.',
          'Contracts are always short.',
          'Questions are never allowed.',
        ],
        answer: 0,
      },
      {
        question:
          'What solution could meet both the tenant’s and landlord’s interests?',
        options: [
          'No written contract.',
          'A longer contract with predictable increases.',
          'A personal argument.',
          'Immediate cancellation.',
        ],
        answer: 1,
      },
      {
        question: 'What does the interest-based approach reveal?',
        options: [
          'Guaranteed agreement.',
          'Hidden trade-offs and possible options.',
          'Only legal rules.',
          'The strongest speaker.',
        ],
        answer: 1,
      },
    ],
    listeningTranscript:
      'Before we return to the price discussion, I would like to clarify the underlying concerns. Our team needs predictable delivery dates because delays affect several clients. Your team needs larger order volumes to keep the quoted price. If we commit to a six-month volume range rather than a fixed monthly number, would you be able to guarantee priority production? That arrangement might give both sides flexibility without shifting all the risk to either party.',
    listeningQuestions: [
      {
        question: 'What does the speaker want to clarify?',
        options: [
          'The office address.',
          'Underlying concerns.',
          'Past salaries.',
          'The product colour.',
        ],
        answer: 1,
      },
      {
        question: 'Why does the supplier need larger volumes?',
        options: [
          'To keep the quoted price.',
          'To change the delivery address.',
          'To employ a mediator.',
          'To cancel production.',
        ],
        answer: 0,
      },
      {
        question: 'What compromise is proposed?',
        options: [
          'A fixed daily number.',
          'No commitment.',
          'A six-month volume range.',
          'Immediate full payment.',
        ],
        answer: 2,
      },
    ],
    speakingTask:
      'Negotiate a project deadline with competing cost, scope and quality constraints. Identify underlying interests, make a conditional counteroffer and close with a clear compromise.',
    writingTask:
      'Write a 140–170 word negotiation summary. Record each side’s priorities, concessions, unresolved risks and the conditions attached to the proposed agreement.',
    writingSample:
      'Both parties agreed that an earlier launch remains desirable, although the full feature set cannot be delivered safely. The client’s priority is the payment function, while our principal constraint is the security review. As a compromise, the core product will be released two weeks early and two non-essential features will follow in scheduled updates. This agreement is conditional on the testing period remaining unchanged. If new requirements are introduced, the launch date will be reviewed jointly.',
  },
  {
    id: 2,
    slug: 'b2-global-issues-and-public-policy',
    title: 'Global Issues & Public Policy',
    category: 'reading',
    description:
      'Evaluate policy claims, compare stakeholder perspectives and construct evidence-based arguments about global challenges.',
    tags: ['public-policy', 'global-issues', 'evidence', 'argumentation'],
    vocabulary: [
      [
        'stakeholder',
        '/ˈsteɪkhəʊldə/',
        'noun',
        'bên liên quan',
        'Local stakeholders joined the consultation.',
        'Các bên liên quan địa phương tham gia tham vấn.',
      ],
      [
        'inequality',
        '/ˌɪnɪˈkwɒləti/',
        'noun',
        'sự bất bình đẳng',
        'The policy aims to reduce regional inequality.',
        'Chính sách nhằm giảm bất bình đẳng vùng miền.',
      ],
      [
        'regulation',
        '/ˌreɡjəˈleɪʃən/',
        'noun',
        'quy định',
        'New regulation requires clearer energy labels.',
        'Quy định mới yêu cầu nhãn năng lượng rõ hơn.',
      ],
      [
        'subsidy',
        '/ˈsʌbsədi/',
        'noun',
        'trợ cấp',
        'The subsidy made home insulation affordable.',
        'Trợ cấp giúp cách nhiệt nhà ở vừa túi tiền.',
      ],
      [
        'infrastructure',
        '/ˈɪnfrəstrʌktʃə/',
        'noun',
        'cơ sở hạ tầng',
        'Rural infrastructure needs long-term investment.',
        'Hạ tầng nông thôn cần đầu tư dài hạn.',
      ],
      [
        'allocate',
        '/ˈæləkeɪt/',
        'verb',
        'phân bổ',
        'The council allocated funds to public transport.',
        'Hội đồng phân bổ quỹ cho giao thông công cộng.',
      ],
      [
        'incentive',
        '/ɪnˈsentɪv/',
        'noun',
        'động lực khuyến khích',
        'Tax incentives encouraged cleaner technology.',
        'Ưu đãi thuế khuyến khích công nghệ sạch hơn.',
      ],
      [
        'unintended',
        '/ˌʌnɪnˈtendɪd/',
        'adjective',
        'ngoài dự kiến',
        'The rule had unintended effects on small firms.',
        'Quy định gây tác động ngoài dự kiến lên doanh nghiệp nhỏ.',
      ],
      [
        'accountability',
        '/əˌkaʊntəˈbɪləti/',
        'noun',
        'trách nhiệm giải trình',
        'Public reporting improves accountability.',
        'Báo cáo công khai cải thiện trách nhiệm giải trình.',
      ],
      [
        'implementation',
        '/ˌɪmplɪmenˈteɪʃən/',
        'noun',
        'sự triển khai',
        'Implementation took longer than expected.',
        'Việc triển khai lâu hơn dự kiến.',
      ],
      [
        'viable',
        '/ˈvaɪəbl/',
        'adjective',
        'có thể thực hiện lâu dài',
        'The trial showed that the model was viable.',
        'Thử nghiệm cho thấy mô hình khả thi lâu dài.',
      ],
      [
        'disparity',
        '/dɪˈspærəti/',
        'noun',
        'sự chênh lệch',
        'The report highlights a digital access disparity.',
        'Báo cáo nêu bật chênh lệch tiếp cận số.',
      ],
    ],
    grammarTitle: 'modal verbs for deduction, criticism and policy evaluation',
    grammarExplanation:
      'Use must, may and cannot for degrees of deduction. Use should have or could have to evaluate past policy choices and missed alternatives.',
    grammarExamples: [
      [
        'The lower participation rate may reflect limited access.',
        'Tỷ lệ tham gia thấp hơn có thể phản ánh khả năng tiếp cận hạn chế.',
      ],
      [
        'The programme must have reduced costs for eligible families.',
        'Chương trình hẳn đã giảm chi phí cho các gia đình đủ điều kiện.',
      ],
      [
        'Officials should have consulted small businesses earlier.',
        'Các quan chức lẽ ra nên tham vấn doanh nghiệp nhỏ sớm hơn.',
      ],
    ],
    dialogueTitle: 'Evaluating a transport subsidy',
    dialogue: [
      [
        'Analyst',
        'The subsidy increased bus use by eighteen percent.',
        'Trợ cấp làm lượng dùng xe buýt tăng mười tám phần trăm.',
      ],
      [
        'Councillor',
        'That must have reduced traffic in the centre.',
        'Điều đó hẳn đã giảm giao thông ở trung tâm.',
      ],
      [
        'Analyst',
        'Possibly, but the data cannot prove a direct link yet.',
        'Có thể, nhưng dữ liệu chưa thể chứng minh liên hệ trực tiếp.',
      ],
      [
        'Councillor',
        'Which groups benefited most?',
        'Nhóm nào hưởng lợi nhiều nhất?',
      ],
      [
        'Analyst',
        'Students and full-time workers. Rural residents participated less.',
        'Sinh viên và người làm toàn thời gian. Cư dân nông thôn tham gia ít hơn.',
      ],
      [
        'Councillor',
        'We should have included more rural routes in the trial.',
        'Lẽ ra chúng ta nên đưa thêm tuyến nông thôn vào thử nghiệm.',
      ],
      [
        'Analyst',
        'Yes, and future funding could be allocated by access level.',
        'Đúng, và quỹ tương lai có thể phân bổ theo mức tiếp cận.',
      ],
      [
        'Councillor',
        'Let us publish the disparity before expanding the programme.',
        'Hãy công bố chênh lệch trước khi mở rộng chương trình.',
      ],
    ],
    readingTitle: 'When a successful average hides unequal outcomes',
    readingPassage:
      'A national digital-skills programme reported that eighty percent of participants found employment within six months. The headline figure suggested strong success, but an independent review separated the results by region, age and prior education. Employment rose sharply among urban graduates, while improvement was much smaller for older rural participants. Interviews revealed that unreliable internet access and limited local vacancies affected the second group. The programme had delivered useful training, yet its average result concealed a significant disparity. Reviewers recommended combining online courses with local learning centres, transport support and partnerships with regional employers. Their conclusion was not that the programme should end, but that equal content alone could not guarantee equal opportunity.',
    readingTranslation:
      'Một chương trình kỹ năng số quốc gia báo cáo tám mươi phần trăm người tham gia có việc trong sáu tháng. Con số tiêu đề cho thấy thành công lớn, nhưng đánh giá độc lập tách kết quả theo vùng, tuổi và học vấn trước đó. Việc làm tăng mạnh ở cử nhân thành thị, trong khi cải thiện nhỏ hơn nhiều với người lớn tuổi ở nông thôn. Phỏng vấn cho thấy internet không ổn định và ít việc địa phương ảnh hưởng nhóm thứ hai. Chương trình cung cấp đào tạo hữu ích nhưng kết quả trung bình che giấu chênh lệch đáng kể. Nhóm đánh giá đề nghị kết hợp khóa trực tuyến với trung tâm học địa phương, hỗ trợ đi lại và hợp tác doanh nghiệp vùng. Kết luận không phải dừng chương trình, mà là nội dung ngang nhau chưa đảm bảo cơ hội ngang nhau.',
    readingQuestions: [
      {
        question: 'What did the headline figure conceal?',
        options: [
          'The programme had no participants.',
          'A disparity between participant groups.',
          'Every region had identical results.',
          'The training was illegal.',
        ],
        answer: 1,
      },
      {
        question: 'What affected older rural participants?',
        options: [
          'Too many local jobs.',
          'Unreliable internet and limited vacancies.',
          'Excessive transport support.',
          'University fees only.',
        ],
        answer: 1,
      },
      {
        question: 'What did reviewers recommend?',
        options: [
          'Ending all training.',
          'Using averages only.',
          'Combining online learning with local support.',
          'Removing employer partnerships.',
        ],
        answer: 2,
      },
    ],
    listeningTranscript:
      'The housing pilot met its overall construction target, but affordability remains uncertain. Forty percent of the new homes were classified as affordable; however, that definition was based on regional market prices rather than household income. Lower-income residents may still be unable to meet the monthly cost. The evaluation team recommends publishing income-based figures, consulting tenant groups and testing a rent-support scheme before the policy is expanded nationally.',
    listeningQuestions: [
      {
        question: 'What target did the pilot meet?',
        options: [
          'Its construction target.',
          'Its employment target.',
          'Its transport target.',
          'Its consultation target.',
        ],
        answer: 0,
      },
      {
        question: 'Why is affordability uncertain?',
        options: [
          'No homes were built.',
          'The definition used market prices rather than income.',
          'All homes were free.',
          'Tenant groups set the price.',
        ],
        answer: 1,
      },
      {
        question: 'What should happen before national expansion?',
        options: [
          'Data should remain private.',
          'An income-based approach should be tested.',
          'The pilot should be forgotten.',
          'Construction should stop immediately.',
        ],
        answer: 1,
      },
    ],
    speakingTask:
      'Evaluate a public policy using evidence from several stakeholders. Distinguish fact from inference, identify an unintended effect and recommend a viable revision.',
    writingTask:
      'Write a 160–190 word policy analysis with a claim, supporting evidence, a limitation, stakeholder impact and a justified recommendation.',
    writingSample:
      'The transport subsidy appears to have increased overall bus use, but the available evidence does not demonstrate equal benefit. Participation among rural residents remained comparatively low, which may reflect limited route coverage rather than lack of interest. Officials should have included access measures in the original evaluation. Future funding should therefore support additional rural services and publish results by region and income. This revision would preserve the programme’s main benefit while improving accountability and reducing an unintended disparity.',
  },
  {
    id: 3,
    slug: 'b2-innovation-risk-and-ethics',
    title: 'Innovation, Risk & Ethics',
    category: 'mixed',
    description:
      'Assess emerging technologies, communicate uncertainty and balance innovation with ethical safeguards.',
    tags: ['innovation', 'ethics', 'risk', 'technology'],
    vocabulary: [
      [
        'ethical',
        '/ˈeθɪkəl/',
        'adjective',
        'thuộc đạo đức',
        'The committee raised several ethical concerns.',
        'Ủy ban nêu một số lo ngại đạo đức.',
      ],
      [
        'bias',
        '/ˈbaɪəs/',
        'noun',
        'thiên kiến',
        'Historical data may contain hidden bias.',
        'Dữ liệu lịch sử có thể chứa thiên kiến ẩn.',
      ],
      [
        'transparent',
        '/trænsˈpærənt/',
        'adjective',
        'minh bạch',
        'The selection criteria must be transparent.',
        'Tiêu chí tuyển chọn phải minh bạch.',
      ],
      [
        'safeguard',
        '/ˈseɪfɡɑːd/',
        'noun',
        'biện pháp bảo vệ',
        'Independent review is an important safeguard.',
        'Đánh giá độc lập là biện pháp bảo vệ quan trọng.',
      ],
      [
        'consent',
        '/kənˈsent/',
        'noun',
        'sự đồng thuận',
        'Researchers obtained informed consent.',
        'Nhà nghiên cứu có được sự đồng thuận có hiểu biết.',
      ],
      [
        'automate',
        '/ˈɔːtəmeɪt/',
        'verb',
        'tự động hóa',
        'The system automates repetitive checks.',
        'Hệ thống tự động hóa kiểm tra lặp lại.',
      ],
      [
        'oversight',
        '/ˈəʊvəsaɪt/',
        'noun',
        'sự giám sát',
        'Human oversight remains necessary.',
        'Giám sát của con người vẫn cần thiết.',
      ],
      [
        'accountable',
        '/əˈkaʊntəbl/',
        'adjective',
        'chịu trách nhiệm',
        'A named manager must remain accountable.',
        'Một quản lý cụ thể phải chịu trách nhiệm.',
      ],
      [
        'uncertainty',
        '/ʌnˈsɜːtənti/',
        'noun',
        'sự không chắc chắn',
        'The report communicates uncertainty clearly.',
        'Báo cáo truyền đạt sự không chắc chắn rõ ràng.',
      ],
      [
        'deploy',
        '/dɪˈplɔɪ/',
        'verb',
        'triển khai',
        'The tool was deployed in a limited trial.',
        'Công cụ được triển khai trong thử nghiệm giới hạn.',
      ],
      [
        'implication',
        '/ˌɪmplɪˈkeɪʃən/',
        'noun',
        'hệ quả',
        'The team discussed the privacy implications.',
        'Nhóm thảo luận hệ quả quyền riêng tư.',
      ],
      [
        'proportionate',
        '/prəˈpɔːʃənət/',
        'adjective',
        'tương xứng',
        'The response should be proportionate to the risk.',
        'Phản ứng nên tương xứng với rủi ro.',
      ],
    ],
    grammarTitle: 'advanced passive structures and reporting verbs',
    grammarExplanation:
      'Use passive reporting structures to summarise claims without presenting them as certain facts. Select reporting verbs that accurately show evidence strength.',
    grammarExamples: [
      [
        'The system is believed to reduce processing time.',
        'Hệ thống được cho là giảm thời gian xử lý.',
      ],
      [
        'It has been suggested that the trial lacked sufficient oversight.',
        'Có ý kiến cho rằng thử nghiệm thiếu giám sát đầy đủ.',
      ],
      [
        'Researchers acknowledge that the sample may contain bias.',
        'Các nhà nghiên cứu thừa nhận mẫu có thể chứa thiên kiến.',
      ],
    ],
    dialogueTitle: 'Reviewing an automated recruitment tool',
    dialogue: [
      [
        'Director',
        'The vendor claims the tool will reduce screening time by half.',
        'Nhà cung cấp nói công cụ giảm một nửa thời gian sàng lọc.',
      ],
      [
        'Reviewer',
        'Has the claim been independently verified?',
        'Khẳng định đó đã được xác minh độc lập chưa?',
      ],
      [
        'Director',
        'Not yet. A limited internal trial has been completed.',
        'Chưa. Một thử nghiệm nội bộ giới hạn đã hoàn thành.',
      ],
      [
        'Reviewer',
        'Were candidates informed that automation was being used?',
        'Ứng viên có được thông báo việc dùng tự động hóa không?',
      ],
      [
        'Director',
        'The consent language was included, but it may not have been clear enough.',
        'Nội dung đồng thuận có nhưng có thể chưa đủ rõ.',
      ],
      [
        'Reviewer',
        'Then transparency should be improved before wider deployment.',
        'Vậy cần cải thiện minh bạch trước khi triển khai rộng.',
      ],
      [
        'Director',
        'Could human reviewers examine every rejected application?',
        'Người đánh giá có thể xem mọi hồ sơ bị từ chối không?',
      ],
      [
        'Reviewer',
        'Yes. That would be a proportionate safeguard during the next trial.',
        'Có. Đó là biện pháp bảo vệ tương xứng trong thử nghiệm tới.',
      ],
    ],
    readingTitle: 'Innovation with an exit plan',
    readingPassage:
      'Organisations frequently describe technology trials as low-risk because they involve a limited number of users. Yet a small trial can still create significant harm if participants cannot challenge a decision or withdraw their data. Responsible experimentation therefore requires more than technical testing. Before deployment, teams should define the intended benefit, identify groups that may be affected differently and establish measurable stopping conditions. During the trial, decisions must remain traceable and a responsible person must be able to intervene. Afterward, both positive and negative results should be reported. An innovation is not genuinely successful merely because it works; it must also produce benefits that justify its risks.',
    readingTranslation:
      'Các tổ chức thường mô tả thử nghiệm công nghệ là ít rủi ro vì chỉ có ít người dùng. Tuy nhiên, thử nghiệm nhỏ vẫn có thể gây hại đáng kể nếu người tham gia không thể phản đối quyết định hoặc rút dữ liệu. Thử nghiệm có trách nhiệm vì thế cần nhiều hơn kiểm tra kỹ thuật. Trước triển khai, nhóm phải xác định lợi ích dự kiến, nhóm có thể bị ảnh hưởng khác nhau và điều kiện dừng đo được. Trong thử nghiệm, quyết định phải truy vết được và người chịu trách nhiệm phải can thiệp được. Sau đó, cả kết quả tích cực và tiêu cực cần được báo cáo. Đổi mới không thực sự thành công chỉ vì nó hoạt động; lợi ích phải xứng đáng với rủi ro.',
    readingQuestions: [
      {
        question: 'Why can a small trial still be harmful?',
        options: [
          'It never uses technology.',
          'Participants may lack challenge or withdrawal mechanisms.',
          'It always costs too much.',
          'Results are automatically public.',
        ],
        answer: 1,
      },
      {
        question: 'What should be defined before deployment?',
        options: [
          'Only the product name.',
          'Benefits, affected groups and stopping conditions.',
          'A marketing slogan.',
          'Permanent national use.',
        ],
        answer: 1,
      },
      {
        question: 'How does the passage define genuine success?',
        options: [
          'The tool works technically.',
          'The tool is popular.',
          'Benefits justify risks as well as technical performance.',
          'No results are reported.',
        ],
        answer: 2,
      },
    ],
    listeningTranscript:
      'The review board has approved a three-month trial with additional safeguards. Participation must be voluntary, and users will receive a plain-language explanation of how recommendations are produced. Every automated decision will be reviewed by a trained employee before action is taken. Complaints and unequal outcomes will be monitored weekly. If either exceeds the agreed threshold, deployment will be paused while the cause is investigated.',
    listeningQuestions: [
      {
        question: 'How long will the trial last?',
        options: [
          'Three weeks.',
          'Three months.',
          'One year.',
          'An unlimited period.',
        ],
        answer: 1,
      },
      {
        question: 'Who reviews automated decisions?',
        options: [
          'No one.',
          'A trained employee.',
          'Only the vendor.',
          'Other users.',
        ],
        answer: 1,
      },
      {
        question: 'What happens if an agreed threshold is exceeded?',
        options: [
          'The tool expands immediately.',
          'Deployment is paused for investigation.',
          'Complaints are deleted.',
          'Human review ends.',
        ],
        answer: 1,
      },
    ],
    speakingTask:
      'Present an ethical review of an emerging technology. Explain the claimed benefit, communicate uncertainty, identify affected stakeholders and propose proportionate safeguards.',
    writingTask:
      'Write a 170–200 word ethical risk assessment. Distinguish verified evidence from claims, analyse two implications and recommend conditions for a limited deployment.',
    writingSample:
      'The recruitment tool is claimed to reduce screening time, although this benefit has not yet been independently verified. The main ethical risks concern hidden bias and insufficient transparency for candidates. A limited trial may be justified provided that participation is clearly explained, every rejection is reviewed by a trained employee and unequal outcomes are measured. A named manager should remain accountable, and deployment must be paused if the agreed fairness threshold is exceeded.',
  },
];

export const b2Course = createProgressionCourse(
  'english-b2-critical-communication',
  'B2',
  'English B2 Critical Communication',
  'An upper-intermediate programme for negotiation, policy analysis and ethical decision-making through sustained argument, nuanced language and integrated skills.',
  b2Seeds,
);

export default b2Course;
