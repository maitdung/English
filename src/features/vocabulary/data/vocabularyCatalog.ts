export type VocabularyStatus =
  | "new"
  | "learning"
  | "mastered"
  | "review";

export type VocabularyLevel =
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2";

export type VocabularyWord = {
  id: number;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  topic: string;
  status: VocabularyStatus;
  level: VocabularyLevel;
};

type VocabularySeed = [
  word: string,
  phonetic: string,
  meaning: string,
  example: string,
  level: VocabularyLevel,
];

const catalogByTopic: Record<string, VocabularySeed[]> = {
  "Giao tiếp": [
    ["greet", "/ɡriːt/", "chào hỏi", "She greeted every guest warmly.", "A1"],
    ["introduce", "/ˌɪntrəˈdjuːs/", "giới thiệu", "Let me introduce my colleague.", "A1"],
    ["conversation", "/ˌkɒnvəˈseɪʃn/", "cuộc trò chuyện", "We had a friendly conversation.", "A2"],
    ["interrupt", "/ˌɪntəˈrʌpt/", "ngắt lời", "Try not to interrupt the speaker.", "B1"],
    ["clarify", "/ˈklærəfaɪ/", "làm rõ", "Could you clarify your last point?", "B2"],
    ["articulate", "/ɑːˈtɪkjələt/", "diễn đạt rõ ràng", "She is an articulate and confident presenter.", "C1"],
    ["respond", "/rɪˈspɒnd/", "phản hồi", "Please respond to the question.", "A2"],
    ["persuade", "/pəˈsweɪd/", "thuyết phục", "He persuaded us to try a new approach.", "B2"],
    ["equivocate", "/ɪˈkwɪvəkeɪt/", "nói lập lờ, né tránh", "The spokesperson continued to equivocate when asked for a clear answer.", "C2"],
    ["interlocutor", "/ˌɪntəˈlɒkjətə/", "người đối thoại", "A skilled interviewer adapts each question to the interlocutor.", "C2"],
  ],
  "Gia đình": [
    ["relative", "/ˈrelətɪv/", "họ hàng", "Most of my relatives live nearby.", "A1"],
    ["household", "/ˈhaʊshəʊld/", "hộ gia đình", "There are four people in our household.", "A2"],
    ["childhood", "/ˈtʃaɪldhʊd/", "tuổi thơ", "I spent my childhood in Da Nang.", "A2"],
    ["supportive", "/səˈpɔːtɪv/", "hay hỗ trợ", "My parents are very supportive.", "B1"],
    ["generation", "/ˌdʒenəˈreɪʃn/", "thế hệ", "Three generations share this home.", "B1"],
    ["upbringing", "/ˈʌpbrɪŋɪŋ/", "sự nuôi dạy", "Her upbringing shaped her values.", "B2"],
    ["resemble", "/rɪˈzembl/", "giống với", "You closely resemble your father.", "B2"],
    ["bond", "/bɒnd/", "mối gắn kết", "Travel strengthened their family bond.", "B1"],
    ["consanguinity", "/ˌkɒnsæŋˈɡwɪnəti/", "quan hệ huyết thống", "The archive allowed researchers to trace degrees of consanguinity.", "C2"],
    ["filial", "/ˈfɪliəl/", "thuộc bổn phận của con cái", "He felt a strong sense of filial responsibility toward his parents.", "C2"],
  ],
  "Công việc": [
    ["colleague", "/ˈkɒliːɡ/", "đồng nghiệp", "My colleague helped with the report.", "A2"],
    ["deadline", "/ˈdedlaɪn/", "hạn chót", "The project deadline is Friday.", "A2"],
    ["negotiate", "/nɪˈɡəʊʃieɪt/", "đàm phán", "We need to negotiate a fair contract.", "B2"],
    ["productive", "/prəˈdʌktɪv/", "năng suất", "It was a productive meeting.", "B1"],
    ["promotion", "/prəˈməʊʃn/", "sự thăng chức", "She earned a promotion this year.", "B1"],
    ["delegate", "/ˈdelɪɡeɪt/", "ủy quyền", "A good manager knows how to delegate.", "B2"],
    ["initiative", "/ɪˈnɪʃətɪv/", "tính chủ động", "He showed initiative at work.", "B2"],
    ["proficiency", "/prəˈfɪʃnsi/", "sự thành thạo", "English proficiency is required.", "C1"],
    ["remuneration", "/rɪˌmjuːnəˈreɪʃn/", "tiền thù lao", "The remuneration package reflects the role's considerable responsibilities.", "C2"],
    ["sinecure", "/ˈsɪnɪkjʊə/", "chức vụ nhàn hạ nhưng hưởng lương cao", "Critics argued that the advisory post had become a political sinecure.", "C2"],
  ],
  "Du lịch": [
    ["destination", "/ˌdestɪˈneɪʃn/", "điểm đến", "Hoi An is a popular destination.", "A2"],
    ["itinerary", "/aɪˈtɪnərəri/", "lịch trình chuyến đi", "Our itinerary includes three cities.", "B1"],
    ["departure", "/dɪˈpɑːtʃə/", "sự khởi hành", "Departure is scheduled for 8 a.m.", "A2"],
    ["accommodation", "/əˌkɒməˈdeɪʃn/", "chỗ ở", "The price includes accommodation.", "B1"],
    ["picturesque", "/ˌpɪktʃəˈresk/", "đẹp như tranh", "We stayed in a picturesque village.", "B2"],
    ["spontaneous", "/spɒnˈteɪniəs/", "ngẫu hứng", "They took a spontaneous weekend trip.", "B2"],
    ["customs", "/ˈkʌstəmz/", "hải quan", "We collected our bags after customs.", "A2"],
    ["hospitality", "/ˌhɒspɪˈtæləti/", "lòng hiếu khách", "The region is famous for its hospitality.", "C1"],
    ["sojourn", "/ˈsɒdʒən/", "kỳ lưu trú tạm thời", "Her brief sojourn in Kyoto transformed the way she viewed urban life.", "C2"],
    ["peripatetic", "/ˌperɪpəˈtetɪk/", "thường xuyên đi đây đó", "His peripatetic career took him to research stations on four continents.", "C2"],
  ],
  "Giáo dục": [
    ["assignment", "/əˈsaɪnmənt/", "bài tập được giao", "I submitted my assignment online.", "A2"],
    ["curriculum", "/kəˈrɪkjələm/", "chương trình học", "The curriculum includes practical projects.", "B2"],
    ["comprehend", "/ˌkɒmprɪˈhend/", "hiểu thấu", "Visual examples help learners comprehend ideas.", "B2"],
    ["evaluate", "/ɪˈvæljueɪt/", "đánh giá", "Teachers evaluate progress every month.", "B1"],
    ["scholarship", "/ˈskɒləʃɪp/", "học bổng", "She received a university scholarship.", "B1"],
    ["discipline", "/ˈdɪsəplɪn/", "tính kỷ luật", "Language learning requires discipline.", "B2"],
    ["retain", "/rɪˈteɪn/", "ghi nhớ, giữ lại", "Review helps you retain new vocabulary.", "B2"],
    ["pedagogy", "/ˈpedəɡɒdʒi/", "phương pháp sư phạm", "Modern pedagogy encourages active learning.", "C1"],
    ["epistemology", "/ɪˌpɪstəˈmɒlədʒi/", "nhận thức luận", "The seminar examines how epistemology shapes scientific inquiry.", "C2"],
    ["erudition", "/ˌeruˈdɪʃn/", "sự uyên bác", "Her lectures combine formidable erudition with remarkable clarity.", "C2"],
  ],
  "Sức khỏe": [
    ["symptom", "/ˈsɪmptəm/", "triệu chứng", "A cough can be a common symptom.", "A2"],
    ["recover", "/rɪˈkʌvə/", "hồi phục", "She recovered quickly after the illness.", "A2"],
    ["nutrition", "/njuˈtrɪʃn/", "dinh dưỡng", "Good nutrition improves your energy.", "B1"],
    ["well-being", "/ˌwel ˈbiːɪŋ/", "sức khỏe toàn diện", "Sleep is essential for well-being.", "B1"],
    ["sedentary", "/ˈsedntri/", "ít vận động", "A sedentary lifestyle can affect health.", "B2"],
    ["resilient", "/rɪˈzɪliənt/", "có khả năng phục hồi", "Regular exercise makes the body resilient.", "B2"],
    ["diagnosis", "/ˌdaɪəɡˈnəʊsɪs/", "chẩn đoán", "The doctor explained the diagnosis.", "B2"],
    ["preventive", "/prɪˈventɪv/", "mang tính phòng ngừa", "Preventive care reduces health risks.", "C1"],
    ["comorbidity", "/ˌkəʊmɔːˈbɪdəti/", "bệnh đồng mắc", "The study investigates how comorbidity affects long-term recovery.", "C2"],
    ["pathogenesis", "/ˌpæθəˈdʒenəsɪs/", "cơ chế phát sinh bệnh", "Researchers are still investigating the pathogenesis of the disorder.", "C2"],
  ],
  "Công nghệ": [
    ["device", "/dɪˈvaɪs/", "thiết bị", "This device connects to the internet.", "A2"],
    ["feature", "/ˈfiːtʃə/", "tính năng", "The app has a useful search feature.", "A2"],
    ["efficient", "/ɪˈfɪʃnt/", "hiệu quả", "Automation makes the process more efficient.", "B1"],
    ["privacy", "/ˈprɪvəsi/", "quyền riêng tư", "Review your privacy settings regularly.", "B1"],
    ["vulnerability", "/ˌvʌlnərəˈbɪləti/", "lỗ hổng", "The update fixes a security vulnerability.", "B2"],
    ["integrate", "/ˈɪntɪɡreɪt/", "tích hợp", "We will integrate the two systems.", "B2"],
    ["scalable", "/ˈskeɪləbl/", "có khả năng mở rộng", "The platform needs a scalable architecture.", "C1"],
    ["ubiquitous", "/juːˈbɪkwɪtəs/", "phổ biến khắp nơi", "Smartphones have become ubiquitous.", "C1"],
    ["interoperability", "/ˌɪntərɒpərəˈbɪləti/", "khả năng tương tác giữa các hệ thống", "Open standards improve interoperability across healthcare platforms.", "C2"],
    ["obsolescence", "/ˌɒbsəˈlesns/", "sự lỗi thời", "Modular components can reduce the risk of premature obsolescence.", "C2"],
  ],
  "Môi trường": [
    ["recycle", "/ˌriːˈsaɪkl/", "tái chế", "We recycle paper and plastic.", "A2"],
    ["pollution", "/pəˈluːʃn/", "ô nhiễm", "Air pollution affects large cities.", "A2"],
    ["sustainable", "/səˈsteɪnəbl/", "bền vững", "We need sustainable sources of energy.", "B1"],
    ["conserve", "/kənˈsɜːv/", "bảo tồn, tiết kiệm", "Small changes can conserve water.", "B1"],
    ["biodiversity", "/ˌbaɪəʊdaɪˈvɜːsəti/", "đa dạng sinh học", "Forests support rich biodiversity.", "B2"],
    ["renewable", "/rɪˈnjuːəbl/", "có thể tái tạo", "Solar power is renewable energy.", "B2"],
    ["degradation", "/ˌdeɡrəˈdeɪʃn/", "sự suy thoái", "Soil degradation threatens agriculture.", "C1"],
    ["stewardship", "/ˈstjuːədʃɪp/", "sự quản lý có trách nhiệm", "Environmental stewardship benefits everyone.", "C1"],
    ["anthropogenic", "/ˌænθrəpəˈdʒenɪk/", "do hoạt động của con người gây ra", "The report distinguishes natural variation from anthropogenic climate change.", "C2"],
    ["eutrophication", "/ˌjuːtrəfɪˈkeɪʃn/", "sự phú dưỡng nguồn nước", "Fertiliser runoff accelerated eutrophication in the coastal lagoon.", "C2"],
  ],
  "Cảm xúc": [
    ["delighted", "/dɪˈlaɪtɪd/", "vui mừng", "I was delighted to hear the news.", "A2"],
    ["anxious", "/ˈæŋkʃəs/", "lo lắng", "He felt anxious before the interview.", "B1"],
    ["frustrated", "/frʌˈstreɪtɪd/", "thất vọng, bực bội", "She felt frustrated by the delay.", "B1"],
    ["grateful", "/ˈɡreɪtfl/", "biết ơn", "I am grateful for your support.", "B1"],
    ["overwhelmed", "/ˌəʊvəˈwelmd/", "choáng ngợp", "He was overwhelmed by the workload.", "B2"],
    ["empathetic", "/ˌempəˈθetɪk/", "đồng cảm", "An empathetic listener makes people feel safe.", "B2"],
    ["apprehensive", "/ˌæprɪˈhensɪv/", "e ngại", "She was apprehensive about the change.", "C1"],
    ["contentment", "/kənˈtentmənt/", "sự mãn nguyện", "Simple routines can bring contentment.", "C1"],
  ],
  "Ẩm thực": [
    ["ingredient", "/ɪnˈɡriːdiənt/", "nguyên liệu", "Fresh herbs are the key ingredient.", "A2"],
    ["recipe", "/ˈresəpi/", "công thức nấu ăn", "This recipe is easy to follow.", "A1"],
    ["flavour", "/ˈfleɪvə/", "hương vị", "Lime adds a fresh flavour.", "A2"],
    ["appetite", "/ˈæpɪtaɪt/", "sự thèm ăn", "The walk gave me a good appetite.", "B1"],
    ["nutritious", "/njuˈtrɪʃəs/", "bổ dưỡng", "Beans are affordable and nutritious.", "B1"],
    ["savoury", "/ˈseɪvəri/", "có vị mặn/đậm đà", "I prefer savoury snacks.", "B2"],
    ["culinary", "/ˈkʌlɪnəri/", "thuộc ẩm thực", "Hue has a remarkable culinary tradition.", "C1"],
    ["meticulous", "/məˈtɪkjələs/", "tỉ mỉ", "The chef is meticulous about presentation.", "C1"],
  ],
  "Mua sắm": [
    ["receipt", "/rɪˈsiːt/", "hóa đơn", "Keep the receipt for a refund.", "A1"],
    ["discount", "/ˈdɪskaʊnt/", "giảm giá", "Students receive a ten-percent discount.", "A2"],
    ["affordable", "/əˈfɔːdəbl/", "vừa túi tiền", "The store sells affordable clothes.", "B1"],
    ["purchase", "/ˈpɜːtʃəs/", "mua hàng", "You can cancel the purchase online.", "B1"],
    ["warranty", "/ˈwɒrənti/", "bảo hành", "The laptop comes with a two-year warranty.", "B1"],
    ["refund", "/ˈriːfʌnd/", "hoàn tiền", "They offered a full refund.", "A2"],
    ["impulsive", "/ɪmˈpʌlsɪv/", "bốc đồng", "Avoid impulsive purchases.", "B2"],
    ["consumerism", "/kənˈsjuːmərɪzəm/", "chủ nghĩa tiêu dùng", "The article examines modern consumerism.", "C1"],
  ],
  "Xã hội": [
    ["community", "/kəˈmjuːnəti/", "cộng đồng", "The project supports the local community.", "A2"],
    ["volunteer", "/ˌvɒlənˈtɪə/", "tình nguyện viên", "She works as a volunteer on weekends.", "A2"],
    ["diversity", "/daɪˈvɜːsəti/", "sự đa dạng", "Cultural diversity strengthens a city.", "B1"],
    ["equality", "/iˈkwɒləti/", "sự bình đẳng", "Education can promote equality.", "B1"],
    ["inclusion", "/ɪnˈkluːʒn/", "sự hòa nhập", "The policy encourages inclusion.", "B2"],
    ["advocate", "/ˈædvəkeɪt/", "ủng hộ, vận động", "They advocate for safer streets.", "B2"],
    ["cohesion", "/kəʊˈhiːʒn/", "sự gắn kết", "Trust improves social cohesion.", "C1"],
    ["marginalised", "/ˈmɑːdʒɪnəlaɪzd/", "bị gạt ra bên lề", "The program helps marginalised groups.", "C1"],
  ],
};

const initialStatuses: VocabularyStatus[] = [
  "mastered",
  "learning",
  "review",
  "new",
];

export const vocabularyWords: VocabularyWord[] = Object.entries(
  catalogByTopic,
).flatMap(([topic, words], topicIndex) =>
  words.map(([word, phonetic, meaning, example, level], wordIndex) => {
    const id = topicIndex * 100 + wordIndex + 1;

    return {
      id,
      word,
      phonetic,
      meaning,
      example,
      topic,
      level,
      status: initialStatuses[(topicIndex + wordIndex) % initialStatuses.length],
    };
  }),
);

export const vocabularyTopics = [
  "Tất cả",
  ...Object.keys(catalogByTopic),
];

export const vocabularyLevels = [
  "Tất cả",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
] as const;
