import type { WorldBank } from "./types";

const bank: WorldBank = {
  slug: "tieng-anh",
  levels: [
    {
      title: "Chào bạn từ mới",
      questions: [
        ["m", "« Con mèo » trong tiếng Anh là gì?", ["dog", "cat", "bird", "fish"], 1, "« Cat » nghĩa là con mèo. Meo meo!"],
        ["t", "« Apple » nghĩa là quả táo.", true, "Đúng rồi! « Apple » là quả táo đỏ ngon lành."],
        ["m", "« Red » là màu gì?", ["Màu đỏ", "Màu xanh lá", "Màu vàng", "Màu đen"], 0, "« Red » là màu đỏ, giống màu quả dâu tây."],
        ["m", "Số « 5 » trong tiếng Anh là gì?", ["four", "six", "five", "nine"], 2, "Số 5 là « five ». Four là 4, six là 6, nine là 9."],
        ["t", "« Pen » nghĩa là cái thước kẻ.", false, "« Pen » là cái bút mực. Thước kẻ là « ruler » nhé."],
        ["m", "« Cặp sách » trong tiếng Anh là gì?", ["book", "pencil", "eraser", "school bag"], 3, "Cặp sách là « school bag ». Book là quyển sách, pencil là bút chì."],
        ["m", "Buổi sáng gặp cô giáo, em chào thế nào?", ["Good night", "Goodbye", "Good morning", "Good evening"], 2, "Buổi sáng ta chào « Good morning ». « Good night » là chúc ngủ ngon."],
        ["t", "« Dog » nghĩa là con chó.", true, "Chính xác! « Dog » là con chó. Gâu gâu!"],
        ["m", "Chọn từ chỉ màu sắc:", ["ten", "blue", "book", "hello"], 1, "« Blue » là màu xanh dương. Các từ còn lại không phải màu sắc."],
        ["m", "« Ten » là số mấy?", ["2", "8", "12", "10"], 3, "« Ten » là số 10, bằng số ngón tay của hai bàn tay em."],
        ["t", "« Goodbye » dùng để chào khi mới gặp nhau.", false, "« Goodbye » là tạm biệt, dùng khi chia tay. Khi gặp nhau ta nói « Hello »."],
        ["m", "« Con chim » trong tiếng Anh là gì?", ["bird", "duck", "fish", "frog"], 0, "Con chim là « bird ». Duck là con vịt, frog là con ếch."],
        ["m", "Bạn hỏi « What's your name? », em trả lời:", ["I'm fine.", "My name is Nam.", "I'm eight.", "Thank you."], 1, "Câu hỏi tên thì trả lời « My name is ... » (Tên mình là ...)."],
        ["t", "« Yellow » nghĩa là màu vàng.", true, "Đúng rồi! « Yellow » là màu vàng như ông mặt trời."],
        ["m", "« Eraser » là đồ dùng gì?", ["Cái bút chì", "Quyển vở", "Cục tẩy", "Cái kéo"], 2, "« Eraser » là cục tẩy, dùng để xóa vết bút chì."],
      ],
    },
    {
      title: "Nhà mình vui ghê",
      questions: [
        ["m", "« Mẹ » trong tiếng Anh là gì?", ["father", "sister", "brother", "mother"], 3, "Mẹ là « mother ». Father là bố, sister là chị/em gái."],
        ["t", "« Grandfather » nghĩa là bà.", false, "« Grandfather » là ông. Bà là « grandmother » nhé."],
        ["m", "Chọn từ đúng: I have ___ apple.", ["a", "two", "an", "some"], 2, "« Apple » bắt đầu bằng nguyên âm a nên dùng « an »: an apple."],
        ["m", "Chọn từ đúng: This is ___ cat.", ["a", "an", "two", "these"], 0, "« Cat » bắt đầu bằng phụ âm c nên dùng « a »: a cat."],
        ["t", "« Milk » nghĩa là sữa.", true, "Đúng rồi! « Milk » là sữa, uống sữa giúp em cao lớn."],
        ["m", "Số nhiều của « book » là gì?", ["bookes", "books", "bookies", "book"], 1, "Hầu hết danh từ chỉ cần thêm « s » khi số nhiều: books."],
        ["m", "Hỏi « How old are you? », em trả lời:", ["I'm nine years old.", "I'm fine, thanks.", "I'm from Viet Nam.", "I'm a student."], 0, "« How old are you? » hỏi tuổi, nên trả lời « I'm nine years old. »"],
        ["t", "« Bread » nghĩa là cơm.", false, "« Bread » là bánh mì. Cơm là « rice »."],
        ["m", "Chọn từ khác loại:", ["rice", "bread", "milk", "sister"], 3, "« Sister » chỉ người trong gia đình, các từ còn lại là đồ ăn, đồ uống."],
        ["m", "Số nhiều của « box » là gì?", ["boxs", "box", "boxes", "boxies"], 2, "Từ tận cùng bằng x, s, ch, sh thì thêm « es »: boxes."],
        ["t", "« Brother » nghĩa là anh trai hoặc em trai.", true, "Chính xác! « Brother » dùng cho cả anh trai và em trai."],
        ["m", "« Đôi mắt » trong tiếng Anh là gì?", ["ears", "eyes", "hands", "legs"], 1, "Đôi mắt là « eyes ». Ears là tai, hands là bàn tay, legs là chân."],
        ["m", "Chọn từ đúng: My father's mother is my ___.", ["aunt", "sister", "mother", "grandmother"], 3, "Mẹ của bố là bà nội, tiếng Anh là « grandmother »."],
        ["t", "Số nhiều của « child » là « childs ».", false, "Số nhiều của « child » là « children », đây là từ đặc biệt."],
        ["m", "Mời bạn ăn, em nói: « Would you like some ___? »", ["cake", "book", "pen", "desk"], 0, "Mời ăn thì dùng đồ ăn: « Would you like some cake? » (Bạn ăn bánh không?)"],
      ],
    },
    {
      title: "Ngữ pháp siêu nhí",
      questions: [
        ["m", "Chọn từ đúng: She ___ a teacher.", ["am", "are", "is", "be"], 2, "« She » (cô ấy) đi với « is »: She is a teacher."],
        ["t", "« They are students. » là câu đúng.", true, "Đúng rồi! « They » (họ) luôn đi với « are »."],
        ["m", "Chọn từ đúng: I ___ a new bike.", ["has", "is", "am", "have"], 3, "« I » đi với « have »: I have a new bike (Tớ có xe đạp mới)."],
        ["m", "Chọn từ đúng: My brother ___ two cats.", ["have", "has", "is", "are"], 1, "« My brother » là một người (như « he ») nên dùng « has »."],
        ["t", "Câu « He can swims. » là câu đúng.", false, "Sau « can » dùng động từ nguyên mẫu: « He can swim. »"],
        ["m", "Chọn từ đúng: The ball is ___ the box. (bên trong)", ["in", "on", "under", "behind"], 0, "« In » nghĩa là bên trong: quả bóng ở trong hộp."],
        ["m", "Chọn từ đúng: We ___ in class 4A.", ["is", "am", "be", "are"], 3, "« We » (chúng tớ) đi với « are »: We are in class 4A."],
        ["t", "« Under » nghĩa là ở dưới.", true, "Chính xác! « Under the table » là ở dưới gầm bàn."],
        ["m", "« Can you dance? » – Nam biết nhảy. Nam trả lời:", ["Yes, I can.", "Yes, I do.", "No, I can't.", "Yes, I am."], 0, "Hỏi bằng « Can » thì trả lời bằng « can »: Yes, I can."],
        ["m", "Chọn từ đúng: The cat is ___ the table. (ở trên)", ["under", "on", "in", "next"], 1, "« On » nghĩa là ở trên (chạm vào mặt bàn): on the table."],
        ["t", "Câu « There are a pen on the desk. » là câu đúng.", false, "Một cái bút là số ít nên dùng « There is a pen on the desk. »"],
        ["m", "Chọn câu đúng:", ["I is happy.", "You am tall.", "He is my friend.", "They is here."], 2, "« He » đi với « is ». Nhớ nhé: I am, you/we/they are, he/she/it is."],
        ["m", "Hỏi « Where is the lamp? », câu trả lời đúng là:", ["It's next to the bed.", "It's blue.", "Yes, it is.", "It's a lamp."], 0, "« Where » hỏi ở đâu, nên trả lời vị trí: next to the bed (bên cạnh giường)."],
        ["t", "Câu « She has long hair. » là câu đúng.", true, "Đúng rồi! « She » đi với « has »: Cô ấy có mái tóc dài."],
        ["m", "Chọn từ đúng: ___ you play the piano? – Yes, I can.", ["Do", "Can", "Are", "Is"], 1, "Câu trả lời là « Yes, I can » nên câu hỏi phải bắt đầu bằng « Can »."],
      ],
    },
    {
      title: "Một ngày bận rộn",
      questions: [
        ["m", "Chọn từ đúng: He ___ football every Sunday.", ["plays", "play", "playing", "is play"], 0, "Thói quen dùng hiện tại đơn; « He » thì động từ thêm s: plays."],
        ["t", "Câu « She go to school by bus. » là câu đúng.", false, "Chủ ngữ « She » thì động từ thêm s/es: « She goes to school by bus. »"],
        ["m", "Chọn từ đúng: Look! The children ___ in the park.", ["plays", "are playing", "play", "is playing"], 1, "« Look! » báo việc đang xảy ra, dùng hiện tại tiếp diễn: are playing."],
        ["m", "« Doctor » là nghề gì?", ["Giáo viên", "Nông dân", "Công nhân", "Bác sĩ"], 3, "« Doctor » là bác sĩ, người chữa bệnh cho mọi người."],
        ["t", "« It's rainy today. » nghĩa là « Hôm nay trời mưa. »", true, "Đúng rồi! « Rainy » là có mưa. Nhớ mang ô nhé!"],
        ["m", "« A farmer » làm việc ở đâu?", ["In a hospital", "In a school", "On a farm", "In a factory"], 2, "« Farmer » là nông dân, làm việc trên cánh đồng, trang trại: on a farm."],
        ["m", "Chọn từ đúng: What time ___ you get up?", ["does", "do", "are", "is"], 1, "Chủ ngữ « you » dùng trợ động từ « do »: What time do you get up?"],
        ["t", "« Seven thirty » nghĩa là 7 giờ 15 phút.", false, "« Seven thirty » là 7 giờ 30 phút. 7 giờ 15 là « seven fifteen »."],
        ["m", "Chọn từ đúng: My mother ___ TV now.", ["watch", "watches", "is watching", "watched"], 2, "Có « now » (bây giờ) nên dùng hiện tại tiếp diễn: is watching."],
        ["m", "Chọn từ đúng: Linh ___ like fish.", ["doesn't", "don't", "isn't", "aren't"], 0, "« Linh » là một người (như « she ») nên phủ định dùng « doesn't »."],
        ["t", "« Tuesday » là thứ Ba.", true, "Chính xác! Monday là thứ Hai, Tuesday là thứ Ba."],
        ["m", "Hỏi « What's the weather like? », câu trả lời hợp lý:", ["It's Monday.", "It's seven o'clock.", "It's a bird.", "It's sunny."], 3, "Câu hỏi về thời tiết, nên trả lời « It's sunny. » (Trời nắng)."],
        ["m", "Chọn từ đúng: ___ does your father do? – He's a driver.", ["Where", "When", "What", "Who"], 2, "« What does your father do? » là câu hỏi về nghề nghiệp."],
        ["t", "Câu « I am write a letter now. » là câu đúng.", false, "Hiện tại tiếp diễn là am/is/are + V-ing: « I am writing a letter now. »"],
        ["m", "Chọn từ đúng: Does she ___ English on Monday?", ["has", "having", "to have", "have"], 3, "Sau « Does » dùng động từ nguyên mẫu: Does she have English on Monday?"],
      ],
    },
    {
      title: "Nhà thám hiểm tài ba",
      questions: [
        ["m", "Chọn từ đúng: Yesterday I ___ to the zoo.", ["go", "went", "goes", "going"], 1, "« Yesterday » là quá khứ; quá khứ của « go » là « went »."],
        ["t", "Quá khứ của « play » là « played ».", true, "Đúng rồi! « Play » là động từ có quy tắc, thêm « ed »: played."],
        ["m", "Chọn từ đúng: An elephant is ___ than a dog.", ["big", "biggest", "bigger", "more big"], 2, "So sánh hơn của « big » là « bigger » (gấp đôi chữ g rồi thêm er)."],
        ["m", "Chọn từ đúng: ___ you at home last night?", ["Were", "Was", "Did", "Are"], 0, "« Last night » là quá khứ; « you » đi với « were »."],
        ["t", "Câu « She didn't went to school. » là câu đúng.", false, "Sau « didn't » dùng động từ nguyên mẫu: « She didn't go to school. »"],
        ["m", "Chọn từ đúng: My ruler is ___ than yours.", ["long", "longest", "more long", "longer"], 3, "Tính từ ngắn thêm « er » khi so sánh hơn: longer than."],
        ["m", "Chọn từ đúng: This book is ___ interesting than that one.", ["more", "most", "very", "much"], 0, "Tính từ dài như « interesting » dùng « more ... than »."],
        ["t", "« Better » là dạng so sánh hơn của « good ».", true, "Chính xác! « Good » là từ đặc biệt: good → better."],
        ["m", "Hỏi « What did you do last weekend? », câu trả lời hợp lý:", ["I visit my grandma.", "I'm visiting my grandma.", "I will visit my grandma.", "I visited my grandma."], 3, "Hỏi về cuối tuần trước thì trả lời bằng quá khứ đơn: I visited my grandma."],
        ["m", "Chọn từ đúng: Mai ___ her homework two hours ago.", ["does", "is doing", "did", "do"], 2, "« Two hours ago » (2 giờ trước) là quá khứ; quá khứ của « do » là « did »."],
        ["t", "Quá khứ của « buy » là « buyed ».", false, "« Buy » là động từ bất quy tắc, quá khứ là « bought »."],
        ["m", "Chọn từ đúng: Summer is ___ than winter.", ["hot", "hotter", "hoter", "more hot"], 1, "So sánh hơn của « hot » là « hotter » (gấp đôi chữ t rồi thêm er)."],
        ["m", "Chọn từ đúng: ___ did you go to Da Lat? – Last summer.", ["What", "Where", "Who", "When"], 3, "Câu trả lời là thời gian (Last summer) nên hỏi bằng « When »."],
        ["t", "Câu « Tom is taller than Peter. » là câu so sánh hơn đúng.", true, "Đúng rồi! « Taller than » nghĩa là cao hơn."],
        ["m", "Ở thư viện, bạn Nam nói to. Em nhắc bạn thế nào?", ["Please be quiet.", "Please speak louder.", "Let's sing a song.", "Please run fast."], 0, "Ở thư viện cần giữ yên lặng: « Please be quiet. » (Làm ơn giữ trật tự)."],
      ],
    },
  ],
};

export default bank;

/** Curriculum targets for the 20-unit Tiếng Anh 3 — Global Success track. */
export type Grade3UnitVocabulary = { word: string; vietnameseMeaning: string; exampleSentence: string };
export type Grade3UnitPattern = { pattern: string; exampleSentence: string; vietnameseMeaning: string };
export type Grade3EnglishUnit = {
  unit: number;
  title: string;
  vocabulary: Grade3UnitVocabulary[];
  patterns: Grade3UnitPattern[];
  phonics: { sounds: string; words: string[] };
};

export const GRADE3_GLOBAL_SUCCESS_UNITS: Grade3EnglishUnit[] = [
  {
    "unit": 1,
    "title": "Hello",
    "vocabulary": [
      {
        "word": "hi",
        "vietnameseMeaning": "chào",
        "exampleSentence": "Hi, Mai!"
      },
      {
        "word": "bye",
        "vietnameseMeaning": "tạm biệt",
        "exampleSentence": "Bye, Ben!"
      },
      {
        "word": "fine",
        "vietnameseMeaning": "khỏe",
        "exampleSentence": "I'm fine, thank you."
      },
      {
        "word": "hello",
        "vietnameseMeaning": "xin chào",
        "exampleSentence": "Hello, Mai!"
      },
      {
        "word": "goodbye",
        "vietnameseMeaning": "tạm biệt",
        "exampleSentence": "Goodbye, Ben!"
      }
    ],
    "patterns": [
      {
        "pattern": "Hello. / Hi. I’m … — Hello. / Hi, … I’m …",
        "exampleSentence": "Hi, I’m Mai.",
        "vietnameseMeaning": "Chào. Mình là Mai."
      },
      {
        "pattern": "Hi. How are you? — Fine, thank you.",
        "exampleSentence": "Hi, Ben. How are you? — Fine, thank you.",
        "vietnameseMeaning": "Chào Ben. Bạn khỏe không? — Mình khỏe, cảm ơn."
      },
      {
        "pattern": "Goodbye. / Bye.",
        "exampleSentence": "Goodbye, Lucy. Bye!",
        "vietnameseMeaning": "Tạm biệt Lucy nhé. Chào bạn!"
      }
    ],
    "phonics": {
      "sounds": "/h/ vs /b/",
      "words": [
        "hello",
        "bye"
      ]
    }
  },
  {
    "unit": 2,
    "title": "Our names",
    "vocabulary": [
      {
        "word": "my",
        "vietnameseMeaning": "của mình",
        "exampleSentence": "My name's Mai."
      },
      {
        "word": "name",
        "vietnameseMeaning": "tên",
        "exampleSentence": "What's your name?"
      },
      {
        "word": "how",
        "vietnameseMeaning": "bao nhiêu; như thế nào",
        "exampleSentence": "How old are you?"
      },
      {
        "word": "old",
        "vietnameseMeaning": "tuổi",
        "exampleSentence": "I'm eight years old."
      },
      {
        "word": "your",
        "vietnameseMeaning": "của bạn",
        "exampleSentence": "What's your name?"
      }
    ],
    "patterns": [
      {
        "pattern": "What’s your name? — My name’s …",
        "exampleSentence": "What’s your name? — My name’s Mai.",
        "vietnameseMeaning": "Bạn tên gì? — Mình tên là Mai."
      },
      {
        "pattern": "How old are you? — I’m … years old.",
        "exampleSentence": "How old are you? — I’m eight years old.",
        "vietnameseMeaning": "Bạn bao nhiêu tuổi? — Mình tám tuổi."
      }
    ],
    "phonics": {
      "sounds": "/m/ vs /n/",
      "words": [
        "Mary",
        "Nam"
      ]
    }
  },
  {
    "unit": 3,
    "title": "Our friends",
    "vocabulary": [
      {
        "word": "Mr",
        "vietnameseMeaning": "thầy (dùng trước tên thầy giáo)",
        "exampleSentence": "This is Mr Long."
      },
      {
        "word": "Ms",
        "vietnameseMeaning": "cô (dùng trước tên cô giáo)",
        "exampleSentence": "This is Ms Hoa."
      },
      {
        "word": "friend",
        "vietnameseMeaning": "bạn",
        "exampleSentence": "This is my friend."
      },
      {
        "word": "teacher",
        "vietnameseMeaning": "giáo viên",
        "exampleSentence": "This is my teacher."
      },
      {
        "word": "this",
        "vietnameseMeaning": "đây; này",
        "exampleSentence": "This is my friend."
      }
    ],
    "patterns": [
      {
        "pattern": "This is … / That’s …",
        "exampleSentence": "This is my friend. That’s Ms Hoa.",
        "vietnameseMeaning": "Đây là bạn của mình. Kia là cô Hoa."
      },
      {
        "pattern": "Is this / that …? — Yes, it is. / No, it isn’t. It’s …",
        "exampleSentence": "Is this your friend? — Yes, it is.",
        "vietnameseMeaning": "Đây có phải bạn của bạn không? — Đúng vậy."
      }
    ],
    "phonics": {
      "sounds": "/ð/ vs /θ/",
      "words": [
        "that",
        "thank"
      ]
    }
  },
  {
    "unit": 4,
    "title": "Our bodies",
    "vocabulary": [
      {
        "word": "face",
        "vietnameseMeaning": "mặt",
        "exampleSentence": "This is my face."
      },
      {
        "word": "mouth",
        "vietnameseMeaning": "miệng",
        "exampleSentence": "Open your mouth."
      },
      {
        "word": "nose",
        "vietnameseMeaning": "mũi",
        "exampleSentence": "Touch your nose."
      },
      {
        "word": "open",
        "vietnameseMeaning": "mở",
        "exampleSentence": "Open your eyes."
      },
      {
        "word": "touch",
        "vietnameseMeaning": "chạm vào",
        "exampleSentence": "Touch your ears."
      }
    ],
    "patterns": [
      {
        "pattern": "What’s this? — It’s …",
        "exampleSentence": "What’s this? — It’s my nose.",
        "vietnameseMeaning": "Đây là gì? — Đây là mũi của mình."
      },
      {
        "pattern": "Touch / Open your …!",
        "exampleSentence": "Touch your nose. Open your mouth.",
        "vietnameseMeaning": "Chạm vào mũi. Mở miệng ra."
      }
    ],
    "phonics": {
      "sounds": "/eə/ vs /ɪə/",
      "words": [
        "hair",
        "ears"
      ]
    }
  },
  {
    "unit": 5,
    "title": "My hobbies",
    "vocabulary": [
      {
        "word": "cooking",
        "vietnameseMeaning": "nấu ăn",
        "exampleSentence": "I like cooking."
      },
      {
        "word": "drawing",
        "vietnameseMeaning": "vẽ",
        "exampleSentence": "I like drawing."
      },
      {
        "word": "painting",
        "vietnameseMeaning": "tô/vẽ tranh bằng màu",
        "exampleSentence": "I like painting."
      },
      {
        "word": "running",
        "vietnameseMeaning": "chạy",
        "exampleSentence": "I like running."
      },
      {
        "word": "singing",
        "vietnameseMeaning": "ca hát",
        "exampleSentence": "I like singing."
      },
      {
        "word": "swimming",
        "vietnameseMeaning": "bơi",
        "exampleSentence": "I like swimming."
      },
      {
        "word": "walking",
        "vietnameseMeaning": "đi bộ",
        "exampleSentence": "I like walking."
      }
    ],
    "patterns": [
      {
        "pattern": "What’s your hobby? — It’s …",
        "exampleSentence": "What’s your hobby? — It’s painting.",
        "vietnameseMeaning": "Sở thích của bạn là gì? — Là vẽ tranh."
      },
      {
        "pattern": "What’s your hobby? — I like …",
        "exampleSentence": "What’s your hobby? — I like swimming.",
        "vietnameseMeaning": "Sở thích của bạn là gì? — Mình thích bơi."
      }
    ],
    "phonics": {
      "sounds": "/p/ vs /r/",
      "words": [
        "painting",
        "running"
      ]
    }
  },
  {
    "unit": 6,
    "title": "Our school",
    "vocabulary": [
      {
        "word": "art room",
        "vietnameseMeaning": "phòng mỹ thuật",
        "exampleSentence": "This is our art room."
      },
      {
        "word": "classroom",
        "vietnameseMeaning": "phòng học",
        "exampleSentence": "This is our classroom."
      },
      {
        "word": "computer room",
        "vietnameseMeaning": "phòng máy tính",
        "exampleSentence": "Let’s go to the computer room."
      },
      {
        "word": "gym",
        "vietnameseMeaning": "phòng thể dục",
        "exampleSentence": "Let’s go to the gym."
      },
      {
        "word": "library",
        "vietnameseMeaning": "thư viện",
        "exampleSentence": "Let’s go to the library."
      },
      {
        "word": "music room",
        "vietnameseMeaning": "phòng âm nhạc",
        "exampleSentence": "This is our music room."
      },
      {
        "word": "playground",
        "vietnameseMeaning": "sân chơi",
        "exampleSentence": "Let’s go to the playground."
      }
    ],
    "patterns": [
      {
        "pattern": "Is this our …? — Yes, it is. / No, it isn’t.",
        "exampleSentence": "Is this our library? — Yes, it is.",
        "vietnameseMeaning": "Đây có phải thư viện của trường mình không? — Đúng vậy."
      },
      {
        "pattern": "Let’s go to the … — OK, let’s go.",
        "exampleSentence": "Let’s go to the playground. — OK, let’s go.",
        "vietnameseMeaning": "Chúng mình ra sân chơi nhé. — Được, đi thôi."
      }
    ],
    "phonics": {
      "sounds": "/pl/ vs /kl/",
      "words": [
        "playground",
        "classroom"
      ]
    }
  },
  {
    "unit": 7,
    "title": "Classroom instructions",
    "vocabulary": [
      {
        "word": "close",
        "vietnameseMeaning": "đóng",
        "exampleSentence": "Close your book, please."
      },
      {
        "word": "come in",
        "vietnameseMeaning": "đi vào",
        "exampleSentence": "Come in, please."
      },
      {
        "word": "go out",
        "vietnameseMeaning": "đi ra ngoài",
        "exampleSentence": "Go out, please."
      },
      {
        "word": "sit down",
        "vietnameseMeaning": "ngồi xuống",
        "exampleSentence": "Sit down, please."
      },
      {
        "word": "stand up",
        "vietnameseMeaning": "đứng lên",
        "exampleSentence": "Stand up, please."
      }
    ],
    "patterns": [
      {
        "pattern": "… , please!",
        "exampleSentence": "Stand up, please!",
        "vietnameseMeaning": "Làm ơn đứng lên."
      },
      {
        "pattern": "May I …? — Yes, you can. / No, you can’t.",
        "exampleSentence": "May I come in? — Yes, you can.",
        "vietnameseMeaning": "Em có thể vào lớp không ạ? — Được, em vào đi."
      }
    ],
    "phonics": {
      "sounds": "/sp/ vs /st/",
      "words": [
        "speak",
        "stand"
      ]
    }
  },
  {
    "unit": 8,
    "title": "My school things",
    "vocabulary": [
      {
        "word": "notebook",
        "vietnameseMeaning": "quyển vở",
        "exampleSentence": "I have a notebook."
      },
      {
        "word": "pencil case",
        "vietnameseMeaning": "hộp bút",
        "exampleSentence": "I have a pencil case."
      },
      {
        "word": "book",
        "vietnameseMeaning": "quyển sách",
        "exampleSentence": "I have a book."
      },
      {
        "word": "pencil",
        "vietnameseMeaning": "bút chì",
        "exampleSentence": "I have a pencil."
      },
      {
        "word": "ruler",
        "vietnameseMeaning": "thước kẻ",
        "exampleSentence": "I have a ruler."
      }
    ],
    "patterns": [
      {
        "pattern": "I have …",
        "exampleSentence": "I have a ruler.",
        "vietnameseMeaning": "Mình có một chiếc thước kẻ."
      },
      {
        "pattern": "Do you have …? — Yes, I do. / No, I don’t.",
        "exampleSentence": "Do you have a notebook? — Yes, I do.",
        "vietnameseMeaning": "Bạn có quyển vở không? — Có."
      }
    ],
    "phonics": {
      "sounds": "/ʊ/ vs /eɪ/",
      "words": [
        "book",
        "eraser"
      ]
    }
  },
  {
    "unit": 9,
    "title": "Colour",
    "vocabulary": [
      {
        "word": "black",
        "vietnameseMeaning": "màu đen",
        "exampleSentence": "It’s black."
      },
      {
        "word": "brown",
        "vietnameseMeaning": "màu nâu",
        "exampleSentence": "It’s brown."
      },
      {
        "word": "green",
        "vietnameseMeaning": "màu xanh lá cây",
        "exampleSentence": "It’s green."
      },
      {
        "word": "orange",
        "vietnameseMeaning": "màu cam",
        "exampleSentence": "It’s orange."
      },
      {
        "word": "white",
        "vietnameseMeaning": "màu trắng",
        "exampleSentence": "They’re white."
      }
    ],
    "patterns": [
      {
        "pattern": "What colour is it? — It’s …",
        "exampleSentence": "What colour is it? — It’s green.",
        "vietnameseMeaning": "Nó màu gì? — Nó màu xanh lá cây."
      },
      {
        "pattern": "What colour are they? — They’re …",
        "exampleSentence": "What colour are they? — They’re white.",
        "vietnameseMeaning": "Chúng màu gì? — Chúng màu trắng."
      }
    ],
    "phonics": {
      "sounds": "/bl/ vs /br/",
      "words": [
        "blue",
        "brown"
      ]
    }
  },
  {
    "unit": 10,
    "title": "Break time activities",
    "vocabulary": [
      {
        "word": "break time",
        "vietnameseMeaning": "giờ ra chơi",
        "exampleSentence": "I play at break time."
      },
      {
        "word": "chat",
        "vietnameseMeaning": "trò chuyện",
        "exampleSentence": "I chat at break time."
      },
      {
        "word": "play badminton",
        "vietnameseMeaning": "chơi cầu lông",
        "exampleSentence": "I play badminton at break time."
      },
      {
        "word": "play basketball",
        "vietnameseMeaning": "chơi bóng rổ",
        "exampleSentence": "I play basketball at break time."
      },
      {
        "word": "play chess",
        "vietnameseMeaning": "chơi cờ vua",
        "exampleSentence": "I play chess at break time."
      },
      {
        "word": "play table tennis",
        "vietnameseMeaning": "chơi bóng bàn",
        "exampleSentence": "I play table tennis at break time."
      },
      {
        "word": "play volleyball",
        "vietnameseMeaning": "chơi bóng chuyền",
        "exampleSentence": "I play volleyball at break time."
      },
      {
        "word": "word puzzles",
        "vietnameseMeaning": "trò chơi ô chữ",
        "exampleSentence": "I do word puzzles at break time."
      }
    ],
    "patterns": [
      {
        "pattern": "I … at break time.",
        "exampleSentence": "I play chess at break time.",
        "vietnameseMeaning": "Mình chơi cờ vào giờ ra chơi."
      },
      {
        "pattern": "What do you do at break time? — I …",
        "exampleSentence": "What do you do at break time? — I chat with my friends.",
        "vietnameseMeaning": "Bạn làm gì vào giờ ra chơi? — Mình trò chuyện với bạn."
      }
    ],
    "phonics": {
      "sounds": "/f/ vs /v/",
      "words": [
        "football",
        "volleyball"
      ]
    }
  },
  {
    "unit": 11,
    "title": "My family",
    "vocabulary": [
      {
        "word": "sure",
        "vietnameseMeaning": "chắc chắn",
        "exampleSentence": "Are you sure?"
      },
      {
        "word": "eleven",
        "vietnameseMeaning": "mười một",
        "exampleSentence": "She is eleven years old."
      },
      {
        "word": "twelve",
        "vietnameseMeaning": "mười hai",
        "exampleSentence": "She is twelve years old."
      },
      {
        "word": "thirteen",
        "vietnameseMeaning": "mười ba",
        "exampleSentence": "She is thirteen years old."
      },
      {
        "word": "fourteen",
        "vietnameseMeaning": "mười bốn",
        "exampleSentence": "She is fourteen years old."
      },
      {
        "word": "fifteen",
        "vietnameseMeaning": "mười lăm",
        "exampleSentence": "She is fifteen years old."
      },
      {
        "word": "sixteen",
        "vietnameseMeaning": "mười sáu",
        "exampleSentence": "She is sixteen years old."
      },
      {
        "word": "seventeen",
        "vietnameseMeaning": "mười bảy",
        "exampleSentence": "She is seventeen years old."
      },
      {
        "word": "eighteen",
        "vietnameseMeaning": "mười tám",
        "exampleSentence": "She is eighteen years old."
      },
      {
        "word": "nineteen",
        "vietnameseMeaning": "mười chín",
        "exampleSentence": "She is nineteen years old."
      },
      {
        "word": "twenty",
        "vietnameseMeaning": "hai mươi",
        "exampleSentence": "She is twenty years old."
      }
    ],
    "patterns": [
      {
        "pattern": "Who’s this / that? — It’s my …",
        "exampleSentence": "Who’s that? — It’s my father.",
        "vietnameseMeaning": "Kia là ai vậy? — Đó là bố của mình."
      },
      {
        "pattern": "How old is he / she? — He’s / She’s …",
        "exampleSentence": "How old is your sister? — She’s twelve.",
        "vietnameseMeaning": "Chị/em gái của bạn bao nhiêu tuổi? — Chị/em ấy 12 tuổi."
      }
    ],
    "phonics": {
      "sounds": "/əʊ/ vs /ʊə/",
      "words": [
        "old",
        "sure"
      ]
    }
  },
  {
    "unit": 12,
    "title": "Jobs",
    "vocabulary": [
      {
        "word": "cook",
        "vietnameseMeaning": "đầu bếp",
        "exampleSentence": "My father is a cook."
      },
      {
        "word": "job",
        "vietnameseMeaning": "nghề nghiệp",
        "exampleSentence": "What’s her job?"
      },
      {
        "word": "nurse",
        "vietnameseMeaning": "y tá",
        "exampleSentence": "She is a nurse."
      },
      {
        "word": "singer",
        "vietnameseMeaning": "ca sĩ",
        "exampleSentence": "He is a singer."
      },
      {
        "word": "worker",
        "vietnameseMeaning": "công nhân / người lao động",
        "exampleSentence": "She is a worker."
      }
    ],
    "patterns": [
      {
        "pattern": "What’s his / her job? — He’s / She’s …",
        "exampleSentence": "What’s her job? — She’s a nurse.",
        "vietnameseMeaning": "Cô ấy làm nghề gì? — Cô ấy là y tá."
      },
      {
        "pattern": "Is he / she …? — Yes, he / she is. / No, he / she isn’t.",
        "exampleSentence": "Is he a cook? — No, he isn’t. He’s a singer.",
        "vietnameseMeaning": "Chú ấy có phải đầu bếp không? — Không. Chú ấy là ca sĩ."
      }
    ],
    "phonics": {
      "sounds": "/ə/ (book-map focus words: mother, doctor)",
      "words": [
        "mother",
        "doctor"
      ]
    }
  },
  {
    "unit": 13,
    "title": "My house",
    "vocabulary": [
      {
        "word": "bathroom",
        "vietnameseMeaning": "phòng tắm",
        "exampleSentence": "The bathroom is there."
      },
      {
        "word": "bedroom",
        "vietnameseMeaning": "phòng ngủ",
        "exampleSentence": "The bedroom is here."
      },
      {
        "word": "chair",
        "vietnameseMeaning": "cái ghế",
        "exampleSentence": "The chair is in the living room."
      },
      {
        "word": "house",
        "vietnameseMeaning": "ngôi nhà",
        "exampleSentence": "This is my house."
      },
      {
        "word": "kitchen",
        "vietnameseMeaning": "nhà bếp",
        "exampleSentence": "The kitchen is there."
      },
      {
        "word": "living room",
        "vietnameseMeaning": "phòng khách",
        "exampleSentence": "The living room is here."
      },
      {
        "word": "here",
        "vietnameseMeaning": "ở đây",
        "exampleSentence": "The bedroom is here."
      },
      {
        "word": "there",
        "vietnameseMeaning": "ở kia / ở đó",
        "exampleSentence": "The kitchen is there."
      }
    ],
    "patterns": [
      {
        "pattern": "Where’s the …? — It’s here / there.",
        "exampleSentence": "Where’s the kitchen? — It’s there.",
        "vietnameseMeaning": "Nhà bếp ở đâu? — Ở đằng kia."
      },
      {
        "pattern": "Where are the …? — They’re …",
        "exampleSentence": "Where are the chairs? — They’re in the living room.",
        "vietnameseMeaning": "Những cái ghế ở đâu? — Chúng ở trong phòng khách."
      }
    ],
    "phonics": {
      "sounds": "/ɑʊ/",
      "words": [
        "house"
      ]
    }
  },
  {
    "unit": 14,
    "title": "My bedroom",
    "vocabulary": [
      {
        "word": "door",
        "vietnameseMeaning": "cửa ra vào",
        "exampleSentence": "The door is big."
      },
      {
        "word": "room",
        "vietnameseMeaning": "căn phòng",
        "exampleSentence": "There is a bed in the room."
      },
      {
        "word": "small",
        "vietnameseMeaning": "nhỏ",
        "exampleSentence": "The window is small."
      },
      {
        "word": "bed",
        "vietnameseMeaning": "cái giường",
        "exampleSentence": "There is a bed in my room."
      },
      {
        "word": "desk",
        "vietnameseMeaning": "bàn học",
        "exampleSentence": "The books are on the desk."
      }
    ],
    "patterns": [
      {
        "pattern": "There’s / There are … in the room.",
        "exampleSentence": "There are two windows in the room.",
        "vietnameseMeaning": "Có hai cái cửa sổ trong phòng."
      },
      {
        "pattern": "The … is … / The … are …",
        "exampleSentence": "The books are on the desk.",
        "vietnameseMeaning": "Những quyển sách ở trên bàn học."
      }
    ],
    "phonics": {
      "sounds": "/uː/ vs /ɔː/",
      "words": [
        "room",
        "door"
      ]
    }
  },
  {
    "unit": 15,
    "title": "At the dining table",
    "vocabulary": [
      {
        "word": "bean",
        "vietnameseMeaning": "đậu",
        "exampleSentence": "I’d like some beans, please."
      },
      {
        "word": "chicken",
        "vietnameseMeaning": "thịt gà",
        "exampleSentence": "I’d like some chicken, please."
      },
      {
        "word": "egg",
        "vietnameseMeaning": "trứng",
        "exampleSentence": "I’d like an egg, please."
      },
      {
        "word": "fish",
        "vietnameseMeaning": "cá (món ăn)",
        "exampleSentence": "I’d like some fish, please."
      },
      {
        "word": "juice",
        "vietnameseMeaning": "nước ép",
        "exampleSentence": "I’d like some juice, please."
      },
      {
        "word": "meat",
        "vietnameseMeaning": "thịt",
        "exampleSentence": "I’d like some meat, please."
      },
      {
        "word": "water",
        "vietnameseMeaning": "nước",
        "exampleSentence": "I’d like some water, please."
      }
    ],
    "patterns": [
      {
        "pattern": "Would you like some …? — Yes, please. / No, thanks.",
        "exampleSentence": "Would you like some milk? — No, thanks.",
        "vietnameseMeaning": "Bạn có muốn uống sữa không? — Không, cảm ơn."
      },
      {
        "pattern": "What would you like to eat / drink? — I’d like some …, please.",
        "exampleSentence": "What would you like to eat? — I’d like some rice, please.",
        "vietnameseMeaning": "Bạn muốn ăn gì? — Cho mình xin một ít cơm."
      }
    ],
    "phonics": {
      "sounds": "/e/ vs /iː/",
      "words": [
        "bread",
        "meat"
      ]
    }
  },
  {
    "unit": 16,
    "title": "My pets",
    "vocabulary": [
      {
        "word": "goldfish",
        "vietnameseMeaning": "cá vàng",
        "exampleSentence": "I have a goldfish."
      },
      {
        "word": "parrot",
        "vietnameseMeaning": "con vẹt",
        "exampleSentence": "I have a parrot."
      },
      {
        "word": "rabbit",
        "vietnameseMeaning": "con thỏ",
        "exampleSentence": "I have a rabbit."
      },
      {
        "word": "many",
        "vietnameseMeaning": "nhiều (dùng khi hỏi số lượng)",
        "exampleSentence": "How many pets do you have?"
      },
      {
        "word": "bird",
        "vietnameseMeaning": "con chim",
        "exampleSentence": "I have a bird."
      }
    ],
    "patterns": [
      {
        "pattern": "Do you have any …? — Yes, I do. / No, I don’t.",
        "exampleSentence": "Do you have any rabbits? — Yes, I do.",
        "vietnameseMeaning": "Bạn có con thỏ nào không? — Có."
      },
      {
        "pattern": "How many … do you have? — I have …",
        "exampleSentence": "How many pets do you have? — I have two.",
        "vietnameseMeaning": "Bạn có bao nhiêu con vật nuôi? — Mình có hai con."
      }
    ],
    "phonics": {
      "sounds": "/ɒ/ vs /əʊ/",
      "words": [
        "dog",
        "goldfish"
      ]
    }
  },
  {
    "unit": 17,
    "title": "Our toys",
    "vocabulary": [
      {
        "word": "bus",
        "vietnameseMeaning": "xe buýt đồ chơi",
        "exampleSentence": "I have a toy bus."
      },
      {
        "word": "car",
        "vietnameseMeaning": "ô tô đồ chơi",
        "exampleSentence": "She has a toy car."
      },
      {
        "word": "kite",
        "vietnameseMeaning": "con diều",
        "exampleSentence": "He has a kite."
      },
      {
        "word": "plane",
        "vietnameseMeaning": "máy bay đồ chơi",
        "exampleSentence": "I have a toy plane."
      },
      {
        "word": "ship",
        "vietnameseMeaning": "tàu thủy đồ chơi",
        "exampleSentence": "They have a toy ship."
      },
      {
        "word": "teddy bear",
        "vietnameseMeaning": "gấu bông",
        "exampleSentence": "She has a teddy bear."
      },
      {
        "word": "toy",
        "vietnameseMeaning": "đồ chơi",
        "exampleSentence": "This is my toy."
      },
      {
        "word": "train",
        "vietnameseMeaning": "tàu hỏa đồ chơi",
        "exampleSentence": "He has a toy train."
      },
      {
        "word": "truck",
        "vietnameseMeaning": "xe tải đồ chơi",
        "exampleSentence": "They have a toy truck."
      }
    ],
    "patterns": [
      {
        "pattern": "He / She has …",
        "exampleSentence": "She has a kite.",
        "vietnameseMeaning": "Bạn ấy có một chiếc diều."
      },
      {
        "pattern": "They have …",
        "exampleSentence": "They have two cars.",
        "vietnameseMeaning": "Họ có hai chiếc ô tô."
      }
    ],
    "phonics": {
      "sounds": "/aɪ/ vs /ɔɪ/",
      "words": [
        "kite",
        "toy"
      ]
    }
  },
  {
    "unit": 18,
    "title": "Playing and doing",
    "vocabulary": [
      {
        "word": "drawing a picture",
        "vietnameseMeaning": "vẽ tranh",
        "exampleSentence": "I’m drawing a picture."
      },
      {
        "word": "listening to music",
        "vietnameseMeaning": "nghe nhạc",
        "exampleSentence": "I’m listening to music."
      },
      {
        "word": "playing basketball",
        "vietnameseMeaning": "chơi bóng rổ",
        "exampleSentence": "I’m playing basketball."
      },
      {
        "word": "reading",
        "vietnameseMeaning": "đọc sách",
        "exampleSentence": "I’m reading."
      },
      {
        "word": "singing",
        "vietnameseMeaning": "ca hát",
        "exampleSentence": "I’m singing."
      }
    ],
    "patterns": [
      {
        "pattern": "I’m …",
        "exampleSentence": "What are you doing? — I’m reading.",
        "vietnameseMeaning": "Bạn đang làm gì? — Mình đang đọc sách."
      },
      {
        "pattern": "What are you doing? — I’m …",
        "exampleSentence": "What are you doing? — I’m reading.",
        "vietnameseMeaning": "Bạn đang làm gì? — Mình đang đọc sách."
      }
    ],
    "phonics": {
      "sounds": "/n/ vs /ŋ/",
      "words": [
        "listen",
        "singing"
      ]
    }
  },
  {
    "unit": 19,
    "title": "Outdoor activities",
    "vocabulary": [
      {
        "word": "cycling",
        "vietnameseMeaning": "đạp xe",
        "exampleSentence": "He’s cycling."
      },
      {
        "word": "flying a kite",
        "vietnameseMeaning": "thả diều",
        "exampleSentence": "She’s flying a kite."
      },
      {
        "word": "painting",
        "vietnameseMeaning": "vẽ tranh",
        "exampleSentence": "She’s painting outside."
      },
      {
        "word": "playing badminton",
        "vietnameseMeaning": "chơi cầu lông",
        "exampleSentence": "He’s playing badminton."
      },
      {
        "word": "running",
        "vietnameseMeaning": "chạy",
        "exampleSentence": "He’s running."
      },
      {
        "word": "skating",
        "vietnameseMeaning": "trượt pa-tanh / trượt ván",
        "exampleSentence": "She’s skating."
      },
      {
        "word": "skipping",
        "vietnameseMeaning": "nhảy dây",
        "exampleSentence": "She’s skipping."
      },
      {
        "word": "walking",
        "vietnameseMeaning": "đi bộ",
        "exampleSentence": "He’s walking."
      }
    ],
    "patterns": [
      {
        "pattern": "He’s / She’s …",
        "exampleSentence": "What’s she doing? — She’s flying a kite.",
        "vietnameseMeaning": "Bạn ấy đang làm gì? — Bạn ấy đang thả diều."
      },
      {
        "pattern": "What’s he / she doing? — He’s / She’s …",
        "exampleSentence": "What’s she doing? — She’s flying a kite.",
        "vietnameseMeaning": "Bạn ấy đang làm gì? — Bạn ấy đang thả diều."
      }
    ],
    "phonics": {
      "sounds": "/pl/ vs /fl/",
      "words": [
        "play",
        "fly"
      ]
    }
  },
  {
    "unit": 20,
    "title": "At the zoo",
    "vocabulary": [
      {
        "word": "climbing",
        "vietnameseMeaning": "đang leo trèo",
        "exampleSentence": "The monkey is climbing."
      },
      {
        "word": "counting",
        "vietnameseMeaning": "đang đếm",
        "exampleSentence": "The monkey is counting."
      },
      {
        "word": "horse",
        "vietnameseMeaning": "con ngựa",
        "exampleSentence": "I can see a horse."
      },
      {
        "word": "monkey",
        "vietnameseMeaning": "con khỉ",
        "exampleSentence": "I can see a monkey."
      },
      {
        "word": "peacock",
        "vietnameseMeaning": "con công",
        "exampleSentence": "I can see a peacock."
      },
      {
        "word": "swinging",
        "vietnameseMeaning": "đang đu",
        "exampleSentence": "The monkey is swinging."
      },
      {
        "word": "tiger",
        "vietnameseMeaning": "con hổ",
        "exampleSentence": "I can see a tiger."
      },
      {
        "word": "parrot",
        "vietnameseMeaning": "con vẹt",
        "exampleSentence": "I can see a parrot."
      },
      {
        "word": "dancing",
        "vietnameseMeaning": "đang nhảy múa",
        "exampleSentence": "The parrot is dancing."
      }
    ],
    "patterns": [
      {
        "pattern": "What can you see? — I can see …",
        "exampleSentence": "What can you see? — I can see a tiger.",
        "vietnameseMeaning": "Bạn nhìn thấy gì? — Mình nhìn thấy một con hổ."
      },
      {
        "pattern": "What’s the … doing? — It’s …",
        "exampleSentence": "What’s the monkey doing? — It’s climbing.",
        "vietnameseMeaning": "Con khỉ đang làm gì? — Nó đang leo trèo."
      }
    ],
    "phonics": {
      "sounds": "/æ/ vs /ɑː/",
      "words": [
        "parrot",
        "dancing"
      ]
    }
  }
];
