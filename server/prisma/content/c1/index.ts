import {
  createProgressionCourse,
  type ProgressionLessonSeed,
} from '../progression/factory';

const c1Seeds: ProgressionLessonSeed[] = [
  {
    id: 1,
    slug: 'c1-research-evidence-and-academic-argument',
    title: 'Research, Evidence & Academic Argument',
    category: 'writing',
    description:
      'Synthesise research, qualify claims and construct academically credible arguments with C1 precision.',
    tags: ['academic-writing', 'research', 'synthesis', 'critical-thinking'],
    vocabulary: [
      [
        'methodology',
        '/ˌmeθəˈdɒlədʒi/',
        'noun',
        'phương pháp luận',
        'The paper explains its methodology in detail.',
        'Bài báo giải thích phương pháp luận chi tiết.',
      ],
      [
        'correlation',
        '/ˌkɒrəˈleɪʃən/',
        'noun',
        'mối tương quan',
        'Correlation alone does not establish causation.',
        'Tương quan không tự chứng minh quan hệ nhân quả.',
      ],
      [
        'causation',
        '/kɔːˈzeɪʃən/',
        'noun',
        'quan hệ nhân quả',
        'The experiment was designed to test causation.',
        'Thí nghiệm được thiết kế để kiểm tra quan hệ nhân quả.',
      ],
      [
        'robust',
        '/rəʊˈbʌst/',
        'adjective',
        'vững chắc',
        'The conclusion requires more robust evidence.',
        'Kết luận cần bằng chứng vững chắc hơn.',
      ],
      [
        'replicate',
        '/ˈreplɪkeɪt/',
        'verb',
        'lặp lại nghiên cứu',
        'A second team failed to replicate the result.',
        'Nhóm thứ hai không lặp lại được kết quả.',
      ],
      [
        'confounding',
        '/kənˈfaʊndɪŋ/',
        'adjective',
        'gây nhiễu',
        'The analysis controlled for confounding variables.',
        'Phân tích kiểm soát các biến gây nhiễu.',
      ],
      [
        'empirical',
        '/ɪmˈpɪrɪkəl/',
        'adjective',
        'dựa trên thực nghiệm',
        'The claim lacks empirical support.',
        'Khẳng định thiếu hỗ trợ thực nghiệm.',
      ],
      [
        'premise',
        '/ˈpremɪs/',
        'noun',
        'tiền đề',
        'The argument depends on a questionable premise.',
        'Lập luận phụ thuộc một tiền đề đáng ngờ.',
      ],
      [
        'substantiate',
        '/səbˈstænʃieɪt/',
        'verb',
        'chứng minh bằng bằng chứng',
        'The data do not substantiate the broader claim.',
        'Dữ liệu không chứng minh khẳng định rộng hơn.',
      ],
      [
        'nuance',
        '/ˈnjuːɑːns/',
        'noun',
        'sắc thái tinh tế',
        'The summary preserves the nuance of the findings.',
        'Bản tóm tắt giữ được sắc thái của phát hiện.',
      ],
      [
        'generalisable',
        '/ˈdʒenərəlaɪzəbl/',
        'adjective',
        'có thể khái quát',
        'The sample may not produce generalisable conclusions.',
        'Mẫu có thể không tạo kết luận khái quát được.',
      ],
      [
        'contend',
        '/kənˈtend/',
        'verb',
        'lập luận rằng',
        'Several scholars contend that the model is incomplete.',
        'Một số học giả cho rằng mô hình chưa hoàn chỉnh.',
      ],
    ],
    grammarTitle: 'hedging, stance and complex noun phrases',
    grammarExplanation:
      'Academic claims are calibrated through hedging and stance. Complex noun phrases compress information, while cautious reporting verbs distinguish evidence from interpretation.',
    grammarExamples: [
      [
        'The findings appear to indicate a modest but persistent effect.',
        'Các phát hiện dường như cho thấy tác động nhỏ nhưng dai dẳng.',
      ],
      [
        'One plausible interpretation of the observed regional variation is unequal access.',
        'Một cách giải thích hợp lý cho khác biệt vùng quan sát được là tiếp cận không ngang nhau.',
      ],
      [
        'These results should not be taken as conclusive evidence of causation.',
        'Các kết quả này không nên được xem là bằng chứng kết luận về nhân quả.',
      ],
    ],
    dialogueTitle: 'Challenging an overconfident conclusion',
    dialogue: [
      [
        'Researcher',
        'Our survey proves that remote work increases productivity.',
        'Khảo sát của chúng tôi chứng minh làm từ xa tăng năng suất.',
      ],
      [
        'Reviewer',
        '“Proves” may be too strong for a cross-sectional survey.',
        '“Chứng minh” có thể quá mạnh với khảo sát cắt ngang.',
      ],
      [
        'Researcher',
        'The correlation is statistically significant.',
        'Tương quan có ý nghĩa thống kê.',
      ],
      [
        'Reviewer',
        'Significance does not eliminate confounding variables or establish causation.',
        'Ý nghĩa thống kê không loại bỏ biến nhiễu hay xác lập nhân quả.',
      ],
      [
        'Researcher',
        'Would “is associated with higher reported productivity” be more accurate?',
        '“Có liên hệ với năng suất tự báo cáo cao hơn” có chính xác hơn không?',
      ],
      [
        'Reviewer',
        'Yes, especially if you acknowledge the self-selected sample.',
        'Có, đặc biệt nếu thừa nhận mẫu tự chọn.',
      ],
      [
        'Researcher',
        'We could also recommend a longitudinal follow-up.',
        'Chúng tôi cũng có thể đề nghị nghiên cứu dọc tiếp theo.',
      ],
      [
        'Reviewer',
        'That would preserve the value of the finding without overstating it.',
        'Điều đó giữ giá trị phát hiện mà không phóng đại.',
      ],
    ],
    readingTitle: 'The appeal and danger of a single explanation',
    readingPassage:
      'When a social trend changes rapidly, commentators often search for a single decisive cause. Such explanations are memorable, but complex outcomes rarely emerge from one variable acting alone. Consider a decline in urban car use. Improved public transport may contribute, yet fuel prices, remote working, demographic change and parking regulation may also matter. Moreover, these factors can interact: remote workers may move farther from city centres, reducing weekday travel while increasing occasional long journeys. A credible analysis therefore distinguishes correlation from causation, compares competing explanations and states what evidence would challenge its preferred account. Intellectual caution is not indecision. It is a disciplined recognition that confidence should remain proportionate to the quality and scope of available evidence.',
    readingTranslation:
      'Khi một xu hướng xã hội thay đổi nhanh, bình luận viên thường tìm một nguyên nhân quyết định duy nhất. Cách giải thích như vậy dễ nhớ, nhưng kết quả phức tạp hiếm khi xuất phát từ một biến. Ví dụ mức dùng ô tô đô thị giảm. Giao thông công cộng tốt hơn có thể góp phần, nhưng giá nhiên liệu, làm việc từ xa, thay đổi dân số và quy định đỗ xe cũng quan trọng. Các yếu tố còn tương tác: người làm từ xa có thể chuyển xa trung tâm, giảm đi lại ngày thường nhưng tăng chuyến dài thỉnh thoảng. Phân tích đáng tin vì thế phân biệt tương quan với nhân quả, so sánh giải thích cạnh tranh và nêu bằng chứng nào sẽ thách thức quan điểm ưu tiên. Thận trọng trí tuệ không phải do dự; đó là sự công nhận có kỷ luật rằng mức tin cậy phải tương xứng chất lượng và phạm vi bằng chứng.',
    readingQuestions: [
      {
        question: 'Why are single-cause explanations attractive?',
        options: [
          'They are always empirically correct.',
          'They are memorable and simple.',
          'They include every interaction.',
          'They prevent commentary.',
        ],
        answer: 1,
      },
      {
        question: 'What makes the car-use example complex?',
        options: [
          'Only fuel prices changed.',
          'Several factors may interact.',
          'No evidence exists.',
          'Every city is identical.',
        ],
        answer: 1,
      },
      {
        question: 'How does the author define intellectual caution?',
        options: [
          'Avoiding all conclusions.',
          'Matching confidence to evidence quality and scope.',
          'Choosing the most popular explanation.',
          'Ignoring competing accounts.',
        ],
        answer: 1,
      },
    ],
    listeningTranscript:
      'The study reports a substantial improvement after the intervention, but two qualifications deserve emphasis. First, participants volunteered and may already have been more motivated than the target population. Second, the outcome was measured immediately after training, so persistence remains unknown. The findings justify a larger trial; they do not yet substantiate permanent national adoption. A follow-up should use random assignment, include delayed measurement and publish results for participants who did not complete the programme.',
    listeningQuestions: [
      {
        question: 'What is the first limitation?',
        options: [
          'Participants were randomly selected.',
          'Volunteers may have been unusually motivated.',
          'No intervention occurred.',
          'The sample was national.',
        ],
        answer: 1,
      },
      {
        question: 'What remains unknown?',
        options: [
          'The intervention name.',
          'Whether improvement persists.',
          'The immediate outcome.',
          'Participant age.',
        ],
        answer: 1,
      },
      {
        question: 'What do the findings justify?',
        options: [
          'Permanent adoption.',
          'A larger, more robust trial.',
          'No further research.',
          'Removing delayed measurement.',
        ],
        answer: 1,
      },
    ],
    speakingTask:
      'Critique a research claim in a short seminar response. Identify its premise, evaluate methodology, offer an alternative explanation and calibrate your conclusion.',
    writingTask:
      'Write a 190–230 word critical synthesis of two hypothetical studies. Compare methodology and findings, identify limitations and present a qualified conclusion.',
    writingSample:
      'Both studies report an association between flexible scheduling and employee well-being, yet their conclusions differ in strength. The first draws on a large cross-sectional survey and is therefore useful for identifying patterns, although self-selection and unmeasured workplace culture may confound the relationship. The second uses a smaller randomised trial and provides more robust evidence of a short-term effect, but its six-week duration limits claims about persistence. Taken together, the findings appear to support cautious experimentation rather than universal adoption. A longer multi-site trial would be required to substantiate broader causal claims.',
  },
  {
    id: 2,
    slug: 'c1-leadership-strategy-and-nuanced-communication',
    title: 'Leadership, Strategy & Nuanced Communication',
    category: 'speaking',
    description:
      'Communicate strategic choices, handle ambiguity and influence senior stakeholders without oversimplifying uncertainty.',
    tags: ['leadership', 'strategy', 'influence', 'nuanced-speaking'],
    vocabulary: [
      [
        'strategic',
        '/strəˈtiːdʒɪk/',
        'adjective',
        'mang tính chiến lược',
        'The board approved a strategic investment.',
        'Hội đồng phê duyệt đầu tư chiến lược.',
      ],
      [
        'alignment',
        '/əˈlaɪnmənt/',
        'noun',
        'sự đồng thuận định hướng',
        'The workshop created alignment across departments.',
        'Hội thảo tạo đồng thuận giữa các phòng ban.',
      ],
      [
        'ambiguity',
        '/ˌæmbɪˈɡjuːəti/',
        'noun',
        'sự mơ hồ',
        'Effective leaders can operate under ambiguity.',
        'Lãnh đạo hiệu quả có thể làm việc trong mơ hồ.',
      ],
      [
        'contingency',
        '/kənˈtɪndʒənsi/',
        'noun',
        'phương án dự phòng',
        'The team prepared a contingency for supply failure.',
        'Nhóm chuẩn bị phương án dự phòng khi nguồn cung thất bại.',
      ],
      [
        'leverage',
        '/ˈliːvərɪdʒ/',
        'verb',
        'tận dụng',
        'We can leverage existing customer relationships.',
        'Chúng ta có thể tận dụng quan hệ khách hàng hiện có.',
      ],
      [
        'rationale',
        '/ˌræʃəˈnɑːl/',
        'noun',
        'cơ sở lý luận',
        'The director explained the rationale for the change.',
        'Giám đốc giải thích cơ sở của thay đổi.',
      ],
      [
        'coherent',
        '/kəʊˈhɪərənt/',
        'adjective',
        'mạch lạc, nhất quán',
        'The recommendations form a coherent strategy.',
        'Các đề xuất tạo thành chiến lược nhất quán.',
      ],
      [
        'resistance',
        '/rɪˈzɪstəns/',
        'noun',
        'sự phản đối',
        'Early consultation reduced internal resistance.',
        'Tham vấn sớm giảm phản đối nội bộ.',
      ],
      [
        'trajectory',
        '/trəˈdʒektəri/',
        'noun',
        'quỹ đạo phát triển',
        'The latest figures changed the project trajectory.',
        'Số liệu mới thay đổi quỹ đạo dự án.',
      ],
      [
        'reconcile',
        '/ˈrekənsaɪl/',
        'verb',
        'dung hòa',
        'The plan must reconcile growth with reliability.',
        'Kế hoạch phải dung hòa tăng trưởng với độ tin cậy.',
      ],
      [
        'pragmatic',
        '/præɡˈmætɪk/',
        'adjective',
        'thực tế',
        'A phased launch is the most pragmatic option.',
        'Ra mắt theo giai đoạn là lựa chọn thực tế nhất.',
      ],
      [
        'credibility',
        '/ˌkredəˈbɪləti/',
        'noun',
        'uy tín',
        'Transparent reporting protects leadership credibility.',
        'Báo cáo minh bạch bảo vệ uy tín lãnh đạo.',
      ],
    ],
    grammarTitle: 'inversion and cleft structures for strategic emphasis',
    grammarExplanation:
      'Inversion and cleft structures allow advanced speakers to control emphasis. They should clarify the message rather than merely make it sound formal.',
    grammarExamples: [
      [
        'Only after the pilot failed did the board reconsider the timeline.',
        'Chỉ sau khi thử nghiệm thất bại, hội đồng mới xem lại lịch.',
      ],
      [
        'What the organisation needs is a coherent transition plan.',
        'Điều tổ chức cần là một kế hoạch chuyển đổi nhất quán.',
      ],
      [
        'Rarely have the risks and opportunities been so closely connected.',
        'Hiếm khi rủi ro và cơ hội lại liên kết chặt như vậy.',
      ],
    ],
    dialogueTitle: 'Presenting an uncertain strategic choice',
    dialogue: [
      [
        'Chair',
        'Which expansion option are you recommending?',
        'Bạn đề xuất phương án mở rộng nào?',
      ],
      [
        'Strategy Lead',
        'A phased entry is the most pragmatic, although the evidence is not decisive.',
        'Gia nhập theo giai đoạn thực tế nhất, dù bằng chứng chưa quyết định.',
      ],
      [
        'Chair',
        'Why not move immediately while demand is high?',
        'Tại sao không hành động ngay khi nhu cầu cao?',
      ],
      [
        'Strategy Lead',
        'What concerns me is the gap in local service capacity.',
        'Điều tôi lo là khoảng trống năng lực dịch vụ địa phương.',
      ],
      [
        'Chair',
        'Could existing partners close that gap?',
        'Đối tác hiện có có thể lấp khoảng trống đó không?',
      ],
      [
        'Strategy Lead',
        'Potentially. We should test that assumption before committing major capital.',
        'Có thể. Ta nên kiểm tra giả định đó trước khi cam kết vốn lớn.',
      ],
      [
        'Chair',
        'How will you maintain momentum?',
        'Bạn sẽ duy trì động lực thế nào?',
      ],
      [
        'Strategy Lead',
        'We will launch one region, publish clear criteria and prepare a contingency for slower demand.',
        'Chúng tôi sẽ ra mắt một vùng, công bố tiêu chí rõ và chuẩn bị dự phòng nếu nhu cầu chậm.',
      ],
    ],
    readingTitle: 'The strategic value of saying “not yet”',
    readingPassage:
      'Leadership is often associated with decisive action, yet the ability to delay commitment can be equally strategic. A premature decision may create momentum, but it can also lock an organisation into assumptions that have not been tested. Saying “not yet” is credible only when it is accompanied by a disciplined process: leaders must identify what remains uncertain, specify which evidence would change the decision and set a deadline for reconsideration. Indefinite delay erodes trust; purposeful delay can protect it. The distinction lies in whether waiting generates information or merely avoids responsibility. Mature strategic communication therefore combines a clear current direction with explicit conditions under which that direction will be revised.',
    readingTranslation:
      'Lãnh đạo thường gắn với hành động quyết đoán, nhưng khả năng trì hoãn cam kết cũng có thể mang tính chiến lược. Quyết định sớm có thể tạo động lực nhưng cũng khóa tổ chức vào giả định chưa kiểm chứng. Nói “chưa” chỉ đáng tin khi đi kèm quy trình có kỷ luật: lãnh đạo phải xác định điều chưa chắc, nêu bằng chứng nào sẽ thay đổi quyết định và đặt hạn xem xét lại. Trì hoãn vô hạn làm mất niềm tin; trì hoãn có mục đích có thể bảo vệ nó. Khác biệt nằm ở việc chờ đợi tạo thông tin hay chỉ né trách nhiệm. Giao tiếp chiến lược trưởng thành vì thế kết hợp định hướng hiện tại rõ với điều kiện cụ thể để điều chỉnh.',
    readingQuestions: [
      {
        question: 'What risk accompanies premature decisions?',
        options: [
          'They generate too much evidence.',
          'They can lock in untested assumptions.',
          'They always reduce momentum.',
          'They prevent any action.',
        ],
        answer: 1,
      },
      {
        question: 'When is “not yet” credible?',
        options: [
          'When no deadline exists.',
          'When it follows a disciplined evidence process.',
          'When leaders avoid responsibility.',
          'When uncertainty is hidden.',
        ],
        answer: 1,
      },
      {
        question: 'What distinguishes purposeful from indefinite delay?',
        options: [
          'Whether waiting generates useful information.',
          'The leader’s job title.',
          'The number of meetings.',
          'Whether a decision is popular.',
        ],
        answer: 0,
      },
    ],
    listeningTranscript:
      'Our recommendation is to retain the current product while conducting a controlled regional pilot of the new model. This is not an argument for preserving the status quo indefinitely. Rather, the pilot will test three assumptions: customer willingness to pay, partner service capacity and the cost of regulatory compliance. Only when those thresholds are met will we recommend national expansion. If demand is weaker than forecast, the contingency is to integrate the strongest new features into the existing product.',
    listeningQuestions: [
      {
        question: 'What is being recommended now?',
        options: [
          'Immediate national expansion.',
          'A controlled regional pilot.',
          'Permanent cancellation.',
          'No product changes ever.',
        ],
        answer: 1,
      },
      {
        question: 'How many assumptions will be tested?',
        options: ['Two.', 'Three.', 'Four.', 'Five.'],
        answer: 1,
      },
      {
        question: 'What is the contingency for weak demand?',
        options: [
          'Ignore all results.',
          'Integrate strong features into the current product.',
          'Expand more quickly.',
          'Remove the existing product immediately.',
        ],
        answer: 1,
      },
    ],
    speakingTask:
      'Deliver a strategic recommendation to senior stakeholders. State the direction, acknowledge ambiguity, explain the rationale, define decision thresholds and answer a challenging objection.',
    writingTask:
      'Write a 200–240 word executive recommendation. Reconcile competing priorities, explain uncertainty and include a contingency with measurable review conditions.',
    writingSample:
      'A phased regional entry is recommended because it preserves strategic momentum while limiting exposure to untested assumptions. The strongest opportunity is clear customer interest; the principal uncertainty is local service capacity. What the organisation needs is evidence that partners can meet response-time and quality thresholds at scale. The pilot should therefore run for six months with monthly public metrics. Only after these thresholds have been met should national expansion be authorised. If demand or service quality falls below the agreed range, the contingency is to integrate the most successful features into the current offer.',
  },
  {
    id: 3,
    slug: 'c1-culture-identity-and-interpretation',
    title: 'Culture, Identity & Interpretation',
    category: 'mixed',
    description:
      'Interpret culturally complex texts, challenge reductive narratives and discuss identity with linguistic sensitivity.',
    tags: ['culture', 'identity', 'interpretation', 'critical-reading'],
    vocabulary: [
      [
        'identity',
        '/aɪˈdentəti/',
        'noun',
        'bản sắc',
        'Identity changes across contexts and relationships.',
        'Bản sắc thay đổi theo bối cảnh và quan hệ.',
      ],
      [
        'heritage',
        '/ˈherɪtɪdʒ/',
        'noun',
        'di sản',
        'The project records local linguistic heritage.',
        'Dự án ghi lại di sản ngôn ngữ địa phương.',
      ],
      [
        'narrative',
        '/ˈnærətɪv/',
        'noun',
        'câu chuyện, diễn ngôn',
        'The exhibition challenges a familiar national narrative.',
        'Triển lãm thách thức một diễn ngôn quốc gia quen thuộc.',
      ],
      [
        'stereotype',
        '/ˈsteriətaɪp/',
        'noun',
        'khuôn mẫu',
        'The film avoids the stereotype of passive youth.',
        'Bộ phim tránh khuôn mẫu thanh niên thụ động.',
      ],
      [
        'assimilation',
        '/əˌsɪməˈleɪʃən/',
        'noun',
        'sự đồng hóa',
        'The novel questions the cost of forced assimilation.',
        'Tiểu thuyết chất vấn cái giá của đồng hóa cưỡng ép.',
      ],
      [
        'hybrid',
        '/ˈhaɪbrɪd/',
        'adjective',
        'lai ghép',
        'The musicians created a hybrid artistic form.',
        'Các nhạc sĩ tạo ra hình thức nghệ thuật lai ghép.',
      ],
      [
        'interpret',
        '/ɪnˈtɜːprɪt/',
        'verb',
        'diễn giải',
        'Readers may interpret the silence differently.',
        'Người đọc có thể diễn giải sự im lặng khác nhau.',
      ],
      [
        'contextualise',
        '/kənˈtekstʃuəlaɪz/',
        'verb',
        'đặt vào bối cảnh',
        'The curator contextualised each historical object.',
        'Giám tuyển đặt mỗi hiện vật lịch sử vào bối cảnh.',
      ],
      [
        'marginalise',
        '/ˈmɑːdʒɪnəlaɪz/',
        'verb',
        'gạt ra bên lề',
        'Official accounts can marginalise minority voices.',
        'Tường thuật chính thức có thể gạt tiếng nói thiểu số ra bên lề.',
      ],
      [
        'belonging',
        '/bɪˈlɒŋɪŋ/',
        'noun',
        'cảm giác thuộc về',
        'Language can create a powerful sense of belonging.',
        'Ngôn ngữ có thể tạo cảm giác thuộc về mạnh mẽ.',
      ],
      [
        'reductive',
        '/rɪˈdʌktɪv/',
        'adjective',
        'đơn giản hóa quá mức',
        'A single label offers a reductive interpretation.',
        'Một nhãn duy nhất tạo cách hiểu quá đơn giản.',
      ],
      [
        'perspective',
        '/pəˈspektɪv/',
        'noun',
        'góc nhìn',
        'The archive includes several competing perspectives.',
        'Kho lưu trữ gồm nhiều góc nhìn cạnh tranh.',
      ],
    ],
    grammarTitle: 'nominalisation and reference chains in analytical prose',
    grammarExplanation:
      'Nominalisation can create concise analytical prose, while varied reference chains connect ideas without monotonous repetition. Excessive abstraction, however, may obscure agency.',
    grammarExamples: [
      [
        'The marginalisation of regional voices shaped the official narrative.',
        'Việc gạt tiếng nói vùng miền ra bên lề định hình tường thuật chính thức.',
      ],
      [
        'This interpretation, while influential, overlooks the hybrid nature of the tradition.',
        'Cách diễn giải này dù có ảnh hưởng nhưng bỏ qua tính lai ghép của truyền thống.',
      ],
      [
        'Such representations can reinforce assumptions that the work itself seeks to challenge.',
        'Những cách thể hiện như vậy có thể củng cố giả định mà chính tác phẩm muốn thách thức.',
      ],
    ],
    dialogueTitle: 'Interpreting a controversial exhibition',
    dialogue: [
      [
        'Curator',
        'Some visitors feel the exhibition is critical of national tradition.',
        'Một số khách thấy triển lãm phê phán truyền thống quốc gia.',
      ],
      [
        'Scholar',
        'It questions a dominant narrative, but that is not the same as rejecting heritage.',
        'Nó chất vấn diễn ngôn chủ đạo, không đồng nghĩa phủ nhận di sản.',
      ],
      [
        'Curator',
        'How should we contextualise the most controversial section?',
        'Nên đặt phần gây tranh cãi nhất vào bối cảnh thế nào?',
      ],
      [
        'Scholar',
        'Include the historical policy and the voices that were marginalised by it.',
        'Hãy đưa chính sách lịch sử và tiếng nói bị gạt ra bên lề.',
      ],
      [
        'Curator',
        'Could that appear politically one-sided?',
        'Điều đó có thể có vẻ thiên lệch chính trị không?',
      ],
      [
        'Scholar',
        'Only if competing perspectives are presented as equally supported when they are not.',
        'Chỉ khi các góc nhìn cạnh tranh được trình bày như có bằng chứng ngang nhau dù không phải.',
      ],
      [
        'Curator',
        'So balance requires context, not simply equal space.',
        'Vậy cân bằng cần bối cảnh, không chỉ thời lượng ngang nhau.',
      ],
      [
        'Scholar',
        'Exactly. Interpretation should remain open without becoming evidence-free.',
        'Đúng. Diễn giải nên cởi mở nhưng không tách khỏi bằng chứng.',
      ],
    ],
    readingTitle: 'A tradition is not a frozen object',
    readingPassage:
      'Public debates often treat tradition as though it were a fixed inheritance that must either be preserved intact or abandoned. Historical practice suggests a more complex picture. Traditions survive precisely because communities reinterpret them: materials change, audiences expand, meanings shift and previously marginalised participants claim a voice. Continuity is real, but it is selective rather than complete. The question is therefore not whether a contemporary form is perfectly identical to its predecessor. A more productive inquiry asks which elements have been retained, who authorised the changes and whose sense of belonging is strengthened or weakened. This perspective resists both careless novelty and a reductive nostalgia that mistakes one historical version for timeless authenticity.',
    readingTranslation:
      'Tranh luận công chúng thường xem truyền thống như di sản cố định phải được giữ nguyên hoặc từ bỏ. Thực hành lịch sử cho thấy bức tranh phức tạp hơn. Truyền thống tồn tại chính vì cộng đồng diễn giải lại: vật liệu thay đổi, khán giả mở rộng, ý nghĩa chuyển dịch và người từng bị gạt ra bên lề có tiếng nói. Tính liên tục là thật nhưng có chọn lọc chứ không toàn vẹn. Vì vậy câu hỏi không phải hình thức đương đại có hoàn toàn giống tiền thân không. Cách hỏi hiệu quả hơn là yếu tố nào được giữ, ai cho phép thay đổi và cảm giác thuộc về của ai được tăng hoặc giảm. Góc nhìn này chống cả đổi mới cẩu thả lẫn hoài cổ đơn giản hóa vốn nhầm một phiên bản lịch sử với tính xác thực vĩnh cửu.',
    readingQuestions: [
      {
        question: 'Why do traditions survive according to the passage?',
        options: [
          'They never change.',
          'Communities continually reinterpret them.',
          'Only governments preserve them.',
          'Audiences remain identical.',
        ],
        answer: 1,
      },
      {
        question: 'What does the author say about continuity?',
        options: [
          'It is imaginary.',
          'It is complete and permanent.',
          'It is real but selective.',
          'It prevents new participation.',
        ],
        answer: 2,
      },
      {
        question: 'What inquiry does the author recommend?',
        options: [
          'Whether forms are perfectly identical.',
          'Which elements and groups are affected by change.',
          'How to end all tradition.',
          'Which version is oldest only.',
        ],
        answer: 1,
      },
    ],
    listeningTranscript:
      'The archive project initially described itself as a record of local memory. During consultation, residents pointed out that most collected stories came from property owners and long-established families. Migrant workers, young people and speakers of minority languages were largely absent. The project has therefore revised its method: interviews are now conducted in several languages, community researchers are paid, and contributors can challenge the curator’s summary before publication. The archive remains selective, but its selection process is now more transparent and participatory.',
    listeningQuestions: [
      {
        question: 'Who was underrepresented initially?',
        options: [
          'Property owners.',
          'Long-established families.',
          'Migrant workers and minority-language speakers.',
          'Curators.',
        ],
        answer: 2,
      },
      {
        question: 'What methodological change was made?',
        options: [
          'Interviews stopped.',
          'Community researchers are paid and several languages are used.',
          'Only written records are accepted.',
          'Summaries cannot be challenged.',
        ],
        answer: 1,
      },
      {
        question: 'What limitation remains?',
        options: [
          'The archive is still selective.',
          'No consultation occurred.',
          'The process is completely secret.',
          'There are no contributors.',
        ],
        answer: 0,
      },
    ],
    speakingTask:
      'Interpret a cultural text or practice from two perspectives. Contextualise the evidence, challenge one reductive stereotype and explain how identity or belonging is affected.',
    writingTask:
      'Write a 210–250 word interpretive essay. Develop a nuanced thesis, analyse representation and context, acknowledge an alternative reading and avoid unsupported generalisation.',
    writingSample:
      'The exhibition presents tradition not as a fixed collection of objects but as an ongoing negotiation over memory and belonging. Its use of contemporary materials may initially appear to reject heritage; however, this interpretation overlooks the historical adaptability of the form. By including migrant and minority-language perspectives, the curators challenge a reductive national narrative while retaining recognisable techniques. An alternative reading might view the changes as excessive, yet that concern should be evaluated against evidence of who shaped earlier definitions of authenticity.',
  },
];

export const c1Course = createProgressionCourse(
  'english-c1-advanced-discourse',
  'C1',
  'English C1 Advanced Discourse',
  'An advanced programme for academic argument, strategic leadership and culturally nuanced interpretation through sustained, evidence-led communication.',
  c1Seeds,
);

export default c1Course;
