import {
  createProgressionCourse,
  type ProgressionLessonSeed,
} from '../progression/factory';

const c2Seeds: ProgressionLessonSeed[] = [
  {
    id: 1,
    slug: 'c2-precision-nuance-and-stance',
    title: 'Precision, Nuance & Stance',
    category: 'speaking',
    description:
      'Express finely balanced positions, qualify claims accurately and handle disagreement without collapsing complexity.',
    tags: ['precision', 'nuance', 'stance', 'formal-discourse'],
    vocabulary: [
      [
        'nuance',
        '/ˈnjuːɑːns/',
        'noun',
        'sắc thái tinh tế',
        'The argument depends on a crucial nuance.',
        'Lập luận phụ thuộc vào một sắc thái quan trọng.',
      ],
      [
        'hedge',
        '/hedʒ/',
        'verb',
        'nói giảm, làm mềm',
        'She hedged the claim to avoid overstatement.',
        'Cô ấy nói giảm để tránh phóng đại.',
      ],
      [
        'stark',
        '/stɑːk/',
        'adjective',
        'rõ rệt, gay gắt',
        'The contrast was stark in the final report.',
        'Sự tương phản rất rõ trong báo cáo cuối.',
      ],
      [
        'qualify',
        '/ˈkwɒlɪfaɪ/',
        'verb',
        'giới hạn, làm rõ',
        'I would qualify that conclusion in two ways.',
        'Tôi muốn giới hạn kết luận đó theo hai cách.',
      ],
      [
        'ambivalent',
        '/æmˈbɪvələnt/',
        'adjective',
        'lưỡng lự, hai mặt',
        'The response was ambivalent rather than negative.',
        'Phản hồi là lưỡng lự chứ không hẳn tiêu cực.',
      ],
      [
        'counterintuitive',
        '/ˌkaʊntərɪnˈtjuːɪtɪv/',
        'adjective',
        'trái trực giác',
        'The result was counterintuitive at first glance.',
        'Kết quả ban đầu có vẻ trái trực giác.',
      ],
      [
        'irrespective',
        '/ˌɪrɪˈspektɪv/',
        'adjective',
        'bất kể',
        'The rule applies irrespective of seniority.',
        'Quy tắc áp dụng bất kể thâm niên.',
      ],
      [
        'albeit',
        '/ˌɔːlˈbiːɪt/',
        'conjunction',
        'mặc dù',
        'The proposal is workable, albeit imperfect.',
        'Đề xuất khả thi, dù chưa hoàn hảo.',
      ],
      [
        'salient',
        '/ˈseɪliənt/',
        'adjective',
        'nổi bật, then chốt',
        'Only the salient points should be repeated.',
        'Chỉ những điểm then chốt mới nên được lặp lại.',
      ],
      [
        'dispassionate',
        '/dɪsˈpæʃənət/',
        'adjective',
        'khách quan, bình tĩnh',
        'The review remained dispassionate throughout.',
        'Bản đánh giá luôn giữ được tính khách quan.',
      ],
      [
        'concede',
        '/kənˈsiːd/',
        'verb',
        'thừa nhận nhượng bộ',
        'I concede that the second reading is stronger.',
        'Tôi thừa nhận cách đọc thứ hai thuyết phục hơn.',
      ],
      [
        'moderate',
        '/ˈmɒdərət/',
        'verb',
        'làm dịu, điều tiết',
        'Careful wording can moderate the tension.',
        'Cách diễn đạt cẩn thận có thể làm dịu căng thẳng.',
      ],
    ],
    grammarTitle:
      'stance markers, concession and contrast for precise argument',
    grammarExplanation:
      'C2 speakers use concession, contrast and stance markers to position ideas precisely. The goal is not ornament but analytical control.',
    grammarExamples: [
      [
        'Although the evidence is limited, the pattern is still salient.',
        'Dù bằng chứng hạn chế, mô hình vẫn rất đáng chú ý.',
      ],
      [
        'I concede that the first draft was more direct, albeit less balanced.',
        'Tôi thừa nhận bản nháp đầu trực diện hơn, dù kém cân bằng hơn.',
      ],
      [
        'Irrespective of the method chosen, the conclusion must remain dispassionate.',
        'Bất kể chọn phương pháp nào, kết luận vẫn phải khách quan.',
      ],
    ],
    dialogueTitle: 'Negotiating a carefully qualified position',
    dialogue: [
      [
        'Panelist',
        'I support the policy in principle, though I would qualify that support.',
        'Về nguyên tắc tôi ủng hộ chính sách, nhưng muốn giới hạn sự ủng hộ đó.',
      ],
      [
        'Moderator',
        'Which part would you qualify most strongly?',
        'Phần nào bạn muốn giới hạn mạnh nhất?',
      ],
      [
        'Panelist',
        'The rollout timeline. The target is admirable, albeit ambitious.',
        'Tiến độ triển khai. Mục tiêu đáng khen nhưng khá tham vọng.',
      ],
      [
        'Moderator',
        'So you are not opposed to the aim itself?',
        'Vậy bạn không phản đối chính mục tiêu?',
      ],
      [
        'Panelist',
        'No. I concede the ambition is justified; the concern is execution under pressure.',
        'Không. Tôi thừa nhận tham vọng là hợp lý; vấn đề là thực thi khi bị ép thời gian.',
      ],
      [
        'Moderator',
        'How should that be stated publicly?',
        'Nên nói điều đó thế nào trước công chúng?',
      ],
      [
        'Panelist',
        'By being explicit that the strategy is workable, but only with strict safeguards.',
        'Nói rõ rằng chiến lược khả thi, nhưng chỉ khi có biện pháp bảo vệ chặt chẽ.',
      ],
      [
        'Moderator',
        'That is a more dispassionate framing.',
        'Đó là một cách khung vấn đề khách quan hơn.',
      ],
    ],
    readingTitle: 'Why the strongest answer is sometimes a qualified one',
    readingPassage:
      'Public debate often rewards the most confident voice, even when the most accurate voice is the one that qualifies itself. Qualified claims are not evasions. They indicate where a conclusion is strong, where it is provisional and where further evidence may change the balance of judgment. In policy, science and law, this distinction matters because certainty and responsibility are not the same thing. A speaker who admits limits may sound weaker in the moment, yet that discipline can make the argument more durable. The audience is then asked to evaluate the structure of the reasoning rather than mistake volume for authority. Precision is therefore not an aesthetic preference; it is a safeguard against misleading simplicity.',
    readingTranslation:
      'Tranh luận công chúng thường thưởng cho giọng nói tự tin nhất, ngay cả khi giọng nói chính xác nhất lại là giọng biết tự giới hạn. Lập luận có điều kiện không phải lẩn tránh. Chúng chỉ ra chỗ nào kết luận mạnh, chỗ nào còn tạm thời và chỗ nào bằng chứng mới có thể làm đổi cán cân đánh giá. Trong chính sách, khoa học và luật, phân biệt này quan trọng vì chắc chắn và trách nhiệm không giống nhau. Người nói thừa nhận giới hạn có thể nghe yếu hơn lúc đầu, nhưng kỷ luật đó làm lập luận bền hơn. Người nghe phải đánh giá cấu trúc suy luận thay vì nhầm âm lượng với thẩm quyền. Vì thế độ chính xác không chỉ là thẩm mỹ; nó là hàng rào chống lại sự đơn giản hóa gây hiểu lầm.',
    readingQuestions: [
      {
        question: 'What does a qualified claim indicate?',
        options: [
          'It is always wrong.',
          'Where evidence is strong and where it may change.',
          'That authority is unnecessary.',
          'That debate should stop.',
        ],
        answer: 1,
      },
      {
        question: 'Why can a limited claim be more durable?',
        options: [
          'It avoids all responsibility.',
          'It is louder.',
          'It reflects reasoning discipline.',
          'It hides uncertainty.',
        ],
        answer: 2,
      },
      {
        question: 'What does the passage warn against?',
        options: [
          'Detailed structure.',
          'Misleading simplicity.',
          'Careful evidence.',
          'Public debate.',
        ],
        answer: 1,
      },
    ],
    listeningTranscript:
      'Let me be precise about the recommendation. I am not saying the project should be slowed down indefinitely; rather, I am saying the current timeline is too stark a contrast with the evidence base. If we publish now, we may later have to concede that the benchmark was never realistic. A short extension, combined with a stricter review of the salient risks, would moderate that problem without changing the overall direction.',
    listeningQuestions: [
      {
        question: 'What is the speaker not recommending?',
        options: [
          'A complete cancellation.',
          'An indefinite slowdown.',
          'A shorter review.',
          'More precise wording.',
        ],
        answer: 1,
      },
      {
        question: 'What might happen if they publish now?',
        options: [
          'The benchmark could seem unrealistic later.',
          'All risks vanish.',
          'The project becomes perfect.',
          'There will be no review.',
        ],
        answer: 0,
      },
      {
        question: 'What would help moderate the problem?',
        options: [
          'Ignoring the risks.',
          'A short extension and stricter review.',
          'A louder presentation.',
          'Removing the benchmark.',
        ],
        answer: 1,
      },
    ],
    speakingTask:
      'Present a position that contains both support and reservation. Qualify your strongest claim, concede one limitation and close with a balanced public framing.',
    writingTask:
      'Write a 220–260 word position paper. Distinguish principle from implementation, qualify your claims carefully and avoid flattening nuance into certainty.',
    writingSample:
      'I support the reform in principle, albeit with important reservations about timing and implementation. The central claim is sound: the current system is too rigid to handle the pressure it now faces. What must be qualified is the assumption that speed alone will improve outcomes. A short extension for review is not a retreat; it is a dispassionate way to preserve the reform’s credibility. Irrespective of political pressure, the final proposal should explain which elements are non-negotiable and which remain open to revision.',
  },
  {
    id: 2,
    slug: 'c2-synthesis-evidence-and-critique',
    title: 'Synthesis, Evidence & Critique',
    category: 'reading',
    description:
      'Integrate multiple sources, assess competing evidence and write with disciplined critical control at C2 level.',
    tags: ['synthesis', 'evidence', 'critique', 'academic-writing'],
    vocabulary: [
      [
        'synthesis',
        '/ˈsɪnθəsɪs/',
        'noun',
        'sự tổng hợp',
        'The essay creates a strong synthesis of sources.',
        'Bài luận tạo nên sự tổng hợp nguồn rất chặt chẽ.',
      ],
      [
        'corroborate',
        '/kəˈrɒbəreɪt/',
        'verb',
        'xác nhận',
        'Several documents corroborate the claim.',
        'Nhiều tài liệu xác nhận luận điểm.',
      ],
      [
        'methodological',
        '/ˌmeθədəˈlɒdʒɪkəl/',
        'adjective',
        'thuộc phương pháp',
        'The critique exposed methodological weaknesses.',
        'Phê bình chỉ ra điểm yếu về phương pháp.',
      ],
      [
        'extrapolate',
        '/ɪkˈstræpəleɪt/',
        'verb',
        'suy rộng',
        'It is risky to extrapolate from one case.',
        'Suy rộng từ một trường hợp là rủi ro.',
      ],
      [
        'triangulate',
        '/traɪˈæŋɡjʊleɪt/',
        'verb',
        'đối chiếu từ nhiều nguồn',
        'Researchers triangulated interviews with archival data.',
        'Nhà nghiên cứu đối chiếu phỏng vấn với dữ liệu lưu trữ.',
      ],
      [
        'cohesion',
        '/kəʊˈhiːʒən/',
        'noun',
        'sự liên kết',
        'The report lacks cohesion between sections.',
        'Báo cáo thiếu sự liên kết giữa các phần.',
      ],
      [
        'salvage',
        '/ˈsælvɪdʒ/',
        'verb',
        'cứu vãn, khai thác',
        'The author salvaged one useful insight from the data.',
        'Tác giả khai thác được một nhận định hữu ích từ dữ liệu.',
      ],
      [
        'contend',
        '/kənˈtend/',
        'verb',
        'cho rằng, tranh luận',
        'Critics contend that the model oversimplifies reality.',
        'Người phê bình cho rằng mô hình đơn giản hóa thực tế.',
      ],
      [
        'scope',
        '/skəʊp/',
        'noun',
        'phạm vi',
        'The scope of the study was intentionally narrow.',
        'Phạm vi nghiên cứu được cố ý đặt hẹp.',
      ],
      [
        'bias',
        '/ˈbaɪəs/',
        'noun',
        'thiên lệch',
        'A hidden bias shaped the sample selection.',
        'Thiên lệch ẩn định hình việc chọn mẫu.',
      ],
      [
        'nuanced',
        '/ˈnjuːɑːnst/',
        'adjective',
        'tinh tế, nhiều lớp',
        'The most nuanced reading is also the most cautious.',
        'Cách đọc tinh tế nhất cũng là cách thận trọng nhất.',
      ],
      [
        'evidence-led',
        '/ˈevɪdəns led/',
        'adjective',
        'dựa trên bằng chứng',
        'The conclusion should remain evidence-led.',
        'Kết luận nên tiếp tục dựa trên bằng chứng.',
      ],
    ],
    grammarTitle:
      'advanced hedging and discourse cohesion for source-based argument',
    grammarExplanation:
      'C2 writing balances hedging, cohesion and source integration. A strong argument is not a loud one; it is a controlled one that links evidence without losing precision.',
    grammarExamples: [
      [
        'The evidence appears to corroborate, rather than prove, the hypothesis.',
        'Bằng chứng dường như xác nhận, chứ chưa chứng minh, giả thuyết.',
      ],
      [
        'It would be misleading to extrapolate too far from this narrow sample.',
        'Sẽ gây hiểu nhầm nếu suy rộng quá xa từ mẫu hẹp này.',
      ],
      [
        'What the sources collectively suggest is a more nuanced interpretation.',
        'Điều các nguồn cộng lại gợi ý là một cách diễn giải tinh tế hơn.',
      ],
    ],
    dialogueTitle: 'Reviewing a literature synthesis',
    dialogue: [
      [
        'Supervisor',
        'Your draft reads clearly, but I am not sure the synthesis is complete.',
        'Bản nháp rõ ràng, nhưng tôi chưa chắc phần tổng hợp đã đầy đủ.',
      ],
      [
        'Candidate',
        'I tried to triangulate the archival material with the interviews.',
        'Tôi đã cố đối chiếu tài liệu lưu trữ với phỏng vấn.',
      ],
      [
        'Supervisor',
        'That helps, though the methodological scope still feels narrow.',
        'Điều đó có ích, nhưng phạm vi phương pháp vẫn còn hẹp.',
      ],
      [
        'Candidate',
        'I can widen it if that will salvage the central claim.',
        'Tôi có thể mở rộng nếu điều đó giúp cứu luận điểm chính.',
      ],
      [
        'Supervisor',
        'Only if the cohesion improves as well.',
        'Chỉ khi mức liên kết giữa các phần cũng tốt hơn.',
      ],
      [
        'Candidate',
        'Understood. I will revise the framing so the evidence remains explicit.',
        'Hiểu rồi. Tôi sẽ sửa khung lập luận để bằng chứng vẫn rõ.',
      ],
      [
        'Supervisor',
        'That would make the critique more persuasive.',
        'Như vậy phần phê bình sẽ thuyết phục hơn.',
      ],
      [
        'Candidate',
        'Then I will tighten the claims and qualify the rest.',
        'Vậy tôi sẽ siết chặt các luận điểm và giới hạn phần còn lại.',
      ],
    ],
    readingTitle: 'What synthesis adds to summary',
    readingPassage:
      'A summary repeats what sources say. Synthesis does something harder: it relates those sources to one another so that patterns, tensions and blind spots become visible. A competent synthesis does not merely collect evidence; it arranges it in a way that clarifies the stakes of the question being asked. This requires methodological discipline because sources rarely speak with equal weight or equal reliability. The writer must decide which claims corroborate one another, which remain in tension and which are too limited to support broad extrapolation. The result is a text that is both more economical and more demanding than summary. It asks the reader to think with the author rather than simply receive information.',
    readingTranslation:
      'Tóm tắt chỉ lặp lại điều nguồn nói. Tổng hợp khó hơn: nó đặt các nguồn vào quan hệ với nhau để làm lộ mô hình, căng thẳng và điểm mù. Một bản tổng hợp đủ năng lực không chỉ gom bằng chứng; nó sắp xếp chúng theo cách làm rõ điều đáng bàn của câu hỏi. Điều này đòi hỏi kỷ luật phương pháp vì các nguồn hiếm khi có cùng trọng lượng hoặc độ tin cậy. Người viết phải quyết định luận điểm nào bổ trợ nhau, luận điểm nào còn căng thẳng và luận điểm nào quá hẹp để suy rộng. Kết quả là văn bản vừa cô đọng hơn vừa đòi hỏi hơn tóm tắt. Nó yêu cầu người đọc suy nghĩ cùng tác giả thay vì chỉ nhận thông tin.',
    readingQuestions: [
      {
        question: 'How does synthesis differ from summary?',
        options: [
          'It ignores sources.',
          'It relates sources to reveal patterns and tensions.',
          'It only repeats quotations.',
          'It always shortens the text.',
        ],
        answer: 1,
      },
      {
        question: 'Why is methodological discipline needed?',
        options: [
          'All sources are identical.',
          'Sources vary in weight and reliability.',
          'The reader cannot think.',
          'Extrapolation is always safe.',
        ],
        answer: 1,
      },
      {
        question: 'What does synthesis ask of the reader?',
        options: [
          'Passive reception.',
          'Thinking with the author.',
          'Immediate agreement.',
          'No evidence.',
        ],
        answer: 1,
      },
    ],
    listeningTranscript:
      'The report should not be read as a final answer. It is better understood as a synthesis of three separate lines of evidence, each with different limitations. One line corroborates the general trend, another exposes a bias in the sample and the third suggests that the apparent effect may be smaller than first assumed. The safest conclusion is therefore evidence-led but restrained: we can justify the direction of travel, yet we should not overstate the scope of the findings.',
    listeningQuestions: [
      {
        question: 'How should the report be read?',
        options: [
          'As a final answer.',
          'As a synthesis with limitations.',
          'As an error.',
          'As a legal verdict.',
        ],
        answer: 1,
      },
      {
        question: 'What does one line of evidence expose?',
        options: [
          'A bias in the sample.',
          'A perfect conclusion.',
          'No limitations.',
          'A larger effect than expected.',
        ],
        answer: 0,
      },
      {
        question: 'What is the safest conclusion?',
        options: [
          'Overstate the findings.',
          'Remain evidence-led but restrained.',
          'Ignore the trend.',
          'Reject all data.',
        ],
        answer: 1,
      },
    ],
    speakingTask:
      'Explain how several sources interact, note where they corroborate and where they conflict, and present a restrained but defensible conclusion.',
    writingTask:
      'Write a 240–280 word critical synthesis. Integrate at least two perspectives, note limitations and keep the final claim evidence-led rather than absolute.',
    writingSample:
      'Taken together, the sources suggest a real but bounded effect. The strongest evidence corroborates the claim that the reform improved access in urban areas, yet the same material also exposes a sample bias that limits generalisation. It would be misleading to extrapolate the result to all regions without qualification. A more nuanced reading is that the intervention is viable under specific conditions, but the present evidence does not justify broader certainty. That conclusion is not weak; it is methodologically disciplined.',
  },
  {
    id: 3,
    slug: 'c2-style-rhetoric-and-adaptation',
    title: 'Style, Rhetoric & Adaptation',
    category: 'mixed',
    description:
      'Adapt tone for different audiences, shape rhetorical impact and control register with native-like flexibility.',
    tags: ['style', 'rhetoric', 'register', 'adaptation'],
    vocabulary: [
      [
        'register',
        '/ˈredʒɪstə/',
        'noun',
        'phong cách/ngữ vực',
        'The register changes between settings.',
        'Ngữ vực thay đổi giữa các bối cảnh.',
      ],
      [
        'rhetorical',
        '/rɪˈtɒrɪkəl/',
        'adjective',
        'thuộc tu từ',
        'The opening is a rhetorical question.',
        'Phần mở đầu là một câu hỏi tu từ.',
      ],
      [
        'cadence',
        '/ˈkeɪdəns/',
        'noun',
        'nhịp điệu',
        'The cadence of the sentence feels natural.',
        'Nhịp điệu câu nghe tự nhiên.',
      ],
      [
        'concise',
        '/kənˈsaɪs/',
        'adjective',
        'ngắn gọn',
        'The final statement should stay concise.',
        'Tuyên bố cuối cùng nên ngắn gọn.',
      ],
      [
        'elaborate',
        '/ɪˈlæbərət/',
        'verb',
        'diễn giải kỹ',
        'He elaborated only where the point needed support.',
        'Anh ấy chỉ diễn giải kỹ khi điểm đó cần hỗ trợ.',
      ],
      [
        'eloquent',
        '/ˈeləkwənt/',
        'adjective',
        'hùng biện',
        'The speech was polished and eloquent.',
        'Bài phát biểu trau chuốt và giàu sức hùng biện.',
      ],
      [
        'underscored',
        '/ˌʌndəˈskɔːd/',
        'verb',
        'nhấn mạnh',
        'The incident underscored the urgency of change.',
        'Sự cố nhấn mạnh tính cấp bách của thay đổi.',
      ],
      [
        'deftly',
        '/ˈdeftli/',
        'adverb',
        'khéo léo',
        'She deftly shifted between registers.',
        'Cô ấy chuyển ngữ vực rất khéo léo.',
      ],
      [
        'subtle',
        '/ˈsʌtl/',
        'adjective',
        'tinh tế',
        'A subtle shift in tone changed the meaning.',
        'Một chuyển đổi tinh tế trong giọng điệu đã đổi nghĩa.',
      ],
      [
        'ornate',
        '/ɔːˈneɪt/',
        'adjective',
        'cầu kỳ',
        'The ornate phrasing weakened the message.',
        'Cách diễn đạt cầu kỳ làm yếu thông điệp.',
      ],
      [
        'plainspoken',
        '/ˈpleɪnspəʊkən/',
        'adjective',
        'thẳng thắn, giản dị',
        'A plainspoken answer often carries more weight.',
        'Câu trả lời thẳng thắn thường có sức nặng hơn.',
      ],
      [
        'adaptability',
        '/əˌdæptəˈbɪləti/',
        'noun',
        'khả năng thích ứng',
        'Adaptability is essential in high-level communication.',
        'Khả năng thích ứng là thiết yếu trong giao tiếp cấp cao.',
      ],
    ],
    grammarTitle: 'register shifting, parallelism and rhetorical control',
    grammarExplanation:
      'C2 speakers control register, cadence and emphasis with precision. The aim is to sound natural, not decorative, and to adapt the same idea for different audiences.',
    grammarExamples: [
      [
        'What this policy does is remove ambiguity without sounding ornate.',
        'Điều chính sách này làm là loại bỏ mơ hồ mà không nghe cầu kỳ.',
      ],
      [
        'The message should be plainspoken when addressing the public.',
        'Thông điệp nên thẳng thắn khi nói với công chúng.',
      ],
      [
        'Deftly shifting register can strengthen, rather than dilute, authority.',
        'Chuyển ngữ vực khéo léo có thể tăng chứ không làm loãng uy tín.',
      ],
    ],
    dialogueTitle: 'Adapting the same message for different audiences',
    dialogue: [
      [
        'Director',
        'We need a version of the announcement that sounds less ornate.',
        'Ta cần một phiên bản thông báo nghe bớt cầu kỳ hơn.',
      ],
      [
        'Writer',
        'I can make it more plainspoken without losing precision.',
        'Tôi có thể làm nó thẳng thắn hơn mà không mất độ chính xác.',
      ],
      [
        'Director',
        'Good. The staff version should feel candid, not rhetorical.',
        'Tốt. Bản cho nhân viên nên chân thành, không mang tính tu từ quá mức.',
      ],
      [
        'Writer',
        'Then I will keep the cadence clean and the claims concise.',
        'Vậy tôi sẽ giữ nhịp câu gọn và các luận điểm ngắn.',
      ],
      [
        'Director',
        'Will that still underscore the urgency?',
        'Như vậy có còn nhấn mạnh tính cấp bách không?',
      ],
      [
        'Writer',
        'Yes. The emphasis will come from structure rather than flourish.',
        'Có. Sự nhấn mạnh sẽ đến từ cấu trúc chứ không phải phô trương.',
      ],
      [
        'Director',
        'That should work across audiences.',
        'Như vậy sẽ hợp với nhiều nhóm người đọc.',
      ],
      [
        'Writer',
        'Exactly. Adaptability matters as much as content.',
        'Đúng vậy. Khả năng thích ứng quan trọng ngang nội dung.',
      ],
    ],
    readingTitle: 'A strong style is controlled, not inflated',
    readingPassage:
      'At advanced levels of language use, style is often mistaken for ornament. Yet the most effective prose is usually controlled rather than inflated. Control allows a writer to adapt register, pace and emphasis according to purpose and audience. A public statement may need to be plainspoken; an academic paragraph may require elaboration; a briefing note may benefit from concise parallelism. What unites these choices is not decoration but adaptability. Strong style therefore depends less on sounding impressive than on sounding appropriate. It gives the writer room to shift from explanation to emphasis without losing coherence. That flexibility is one of the clearest markers of mastery.',
    readingTranslation:
      'Ở cấp độ ngôn ngữ cao, phong cách thường bị nhầm với sự cầu kỳ. Nhưng văn hay nhất thường là văn được kiểm soát chứ không phô trương. Sự kiểm soát cho phép người viết thích ứng ngữ vực, nhịp điệu và điểm nhấn theo mục đích và đối tượng. Một tuyên bố công khai có thể cần thẳng thắn; một đoạn học thuật có thể cần diễn giải kỹ; một ghi chú ngắn có thể hưởng lợi từ song song ngắn gọn. Điểm chung của các lựa chọn này không phải trang trí mà là khả năng thích ứng. Vì vậy phong cách mạnh phụ thuộc ít hơn vào việc nghe có vẻ ấn tượng và nhiều hơn vào việc nghe có đúng chỗ. Nó cho người viết khả năng chuyển từ giải thích sang nhấn mạnh mà không mất mạch lạc. Sự linh hoạt đó là dấu hiệu rõ nhất của trình độ cao.',
    readingQuestions: [
      {
        question: 'What does the passage say strong style depends on?',
        options: [
          'Decoration.',
          'Appropriateness and adaptability.',
          'Long sentences only.',
          'Technical jargon.',
        ],
        answer: 1,
      },
      {
        question: 'When might plainspoken style be best?',
        options: [
          'In a public statement.',
          'In every poem.',
          'Only in fiction.',
          'Never.',
        ],
        answer: 0,
      },
      {
        question: 'What marker of mastery is highlighted?',
        options: [
          'Inflated language.',
          'Flexibility without loss of coherence.',
          'Excessive repetition.',
          'Avoiding audience awareness.',
        ],
        answer: 1,
      },
    ],
    listeningTranscript:
      'The key point for stakeholders is simple: the tone has to be adapted, not intensified. If we speak to the public, we should stay plainspoken; if we brief specialists, we can elaborate. The mistake would be to use one ornate version everywhere, because that would weaken the message rather than underscore it. What matters is that the cadence remains steady while the register changes.',
    listeningQuestions: [
      {
        question: 'What should be adapted?',
        options: [
          'The tone.',
          'The facts.',
          'The deadline.',
          'The speaker identity.',
        ],
        answer: 0,
      },
      {
        question: 'What would weaken the message?',
        options: [
          'Using one ornate version everywhere.',
          'Being plainspoken with the public.',
          'Elaborating for specialists.',
          'Keeping cadence steady.',
        ],
        answer: 0,
      },
      {
        question: 'What should remain steady?',
        options: [
          'The register.',
          'The cadence.',
          'The audience.',
          'The topic.',
        ],
        answer: 1,
      },
    ],
    speakingTask:
      'Rewrite the same message for two different audiences. Control register, justify your stylistic choices and explain how tone shapes authority.',
    writingTask:
      'Write a 200–240 word communication brief. Adapt the same core message for two audiences and explain how style affects credibility.',
    writingSample:
      'The announcement for staff should be plainspoken and candid, because clarity matters more than flourish in an internal setting. The public-facing version should remain concise, emphasising the outcome and underscoring the urgency without sounding alarmist. In both cases, the core facts stay the same; what changes is the register. That distinction matters because effective communication depends not on sounding ornate, but on sounding appropriate. If the tone is well controlled, the same message can travel across audiences without losing force.',
  },
];

export const c2Course = createProgressionCourse(
  'english-c2-mastery',
  'C2',
  'English C2 Mastery',
  'A mastery-level programme for precision, synthesis and register control across demanding academic, professional and public contexts.',
  c2Seeds,
);

export default c2Course;
