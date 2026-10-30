/**
 * vi 문장구조 조각마다 헷갈리는 오답(2026-10-30, scripts/frame-decoys.ts) — "틀 id|조각" → 살짝 틀린 꼴. Claude가 씀, 원어민 확인 전.
 */
export const VI_DECOYS: Record<string, string[]> = {
  "vi-f1-01|Tôi là": [
    "Tôi có",
    "Là tôi",
    "Tôi thì"
  ],
  "vi-f1-01|tôi là": [
    "tôi có",
    "là tôi",
    "tôi thì"
  ],
  "vi-f1-02|tên là": [
    "tên có",
    "là tên",
    "tên của"
  ],
  "vi-f1-03|là người": [
    "là cái",
    "có người",
    "người là"
  ],
  "vi-f1-04|Chào": [
    "Cháo",
    "Chảo",
    "Chao"
  ],
  "vi-f1-04|chào": [
    "cháo",
    "chảo",
    "chao"
  ],
  "vi-f1-05|tên là gì": [
    "tên gì là",
    "tên là ai",
    "là tên gì"
  ],
  "vi-f1-06|có": [
    "là",
    "thì",
    "rất"
  ],
  "vi-f1-07|Ở đây có": [
    "Ở đâu có",
    "Ở đây là",
    "Có ở đây"
  ],
  "vi-f1-07|ở đây có": [
    "ở đâu có",
    "ở đây là",
    "có ở đây"
  ],
  "vi-f1-08|bao nhiêu tiền": [
    "bao lâu tiền",
    "bao nhiêu cái",
    "nhiêu bao tiền"
  ],
  "vi-f1-09|ở đâu": [
    "là đâu",
    "ở nào",
    "đâu ở"
  ],
  "vi-f1-10|Cho tôi": [
    "Tôi cho",
    "Cho của tôi",
    "Cho với tôi"
  ],
  "vi-f1-10|cho tôi": [
    "tôi cho",
    "cho của tôi",
    "cho với tôi"
  ],
  "vi-f1-11|Tôi không": [
    "Không tôi",
    "Tôi đừng",
    "Tôi là không"
  ],
  "vi-f1-11|tôi không": [
    "không tôi",
    "tôi đừng",
    "tôi là không"
  ],
  "vi-f1-12|nói chậm thôi": [
    "chậm nói thôi",
    "nói chậm rồi",
    "nói chậm thì"
  ],
  "vi-f1-13|Tôi có": [
    "Tôi là",
    "Có tôi",
    "Tôi là có"
  ],
  "vi-f1-13|tôi có": [
    "tôi là",
    "có tôi",
    "tôi là có"
  ],
  "vi-f1-14|Tôi ở": [
    "Tôi là",
    "Tôi tại",
    "Ở tôi"
  ],
  "vi-f1-14|tôi ở": [
    "tôi là",
    "tôi tại",
    "ở tôi"
  ],
  "vi-f1-14|Em ở": [
    "Em là",
    "Em tại",
    "Ở em"
  ],
  "vi-f1-14|em ở": [
    "em là",
    "em tại",
    "ở em"
  ],
  "vi-f1-15|Cảm ơn": [
    "Ơn cảm",
    "Cảm phiền",
    "Cảm ơi"
  ],
  "vi-f1-15|cảm ơn": [
    "ơn cảm",
    "cảm phiền",
    "cảm ơi"
  ],
  "vi-f1-16|Hẹn gặp lại": [
    "Hẹn lại gặp",
    "Hẹn thấy lại",
    "Hẹn gặp nữa"
  ],
  "vi-f1-16|hẹn gặp lại": [
    "hẹn lại gặp",
    "hẹn thấy lại",
    "hẹn gặp nữa"
  ],
  "vi-f2-01|đã": [
    "sẽ",
    "rồi",
    "sắp"
  ],
  "vi-f2-02|rồi": [
    "sẽ",
    "rối",
    "chưa"
  ],
  "vi-f2-03|sẽ": [
    "rồi",
    "sẻ",
    "đã"
  ],
  "vi-f2-04|đang": [
    "đáng",
    "rồi",
    "đã"
  ],
  "vi-f2-05|muốn": [
    "muộn",
    "muôn",
    "mượn"
  ],
  "vi-f2-06|thích": [
    "thịch",
    "thính",
    "là"
  ],
  "vi-f2-07|không thích": [
    "thích không",
    "đừng thích",
    "không là thích"
  ],
  "vi-f2-08|Làm ơn": [
    "Ơn làm",
    "Cảm ơn",
    "Làm ân"
  ],
  "vi-f2-08|làm ơn": [
    "ơn làm",
    "cảm ơn",
    "làm ân"
  ],
  "vi-f2-09|cho thêm": [
    "cho nữa",
    "cho hơn",
    "thêm cho"
  ],
  "vi-f2-09|Cho thêm": [
    "Cho nữa",
    "Cho hơn",
    "Thêm cho"
  ],
  "vi-f2-10|một bát": [
    "một con",
    "một bác",
    "bát một"
  ],
  "vi-f2-11|nhé": [
    "nhè",
    "chưa",
    "rồi"
  ],
  "vi-f2-12|chưa": [
    "chữa",
    "không",
    "sẽ"
  ],
  "vi-f2-13|quá": [
    "qua",
    "quà",
    "rất"
  ],
  "vi-f2-14|Vì": [
    "Ví",
    "Nếu",
    "Tuy"
  ],
  "vi-f2-14|vì": [
    "ví",
    "nếu",
    "tuy"
  ],
  "vi-f2-15|bị đau": [
    "được đau",
    "đau bị",
    "bị đâu"
  ],
  "vi-f2-16|mấy giờ": [
    "bao giờ",
    "mấy tiếng",
    "giờ mấy"
  ],
  "vi-f2-17|rẽ trái": [
    "trái rẽ",
    "rẻ trái",
    "rẽ trải"
  ],
  "vi-f2-17|Rẽ trái": [
    "Trái rẽ",
    "Rẻ trái",
    "Rẽ trải"
  ],
  "vi-f2-18|món gì ngon": [
    "gì món ngon",
    "món ai ngon",
    "món gì ngọn"
  ],
  "vi-f2-19|Dạo này": [
    "Này dạo",
    "Dạo nào",
    "Đạo này"
  ],
  "vi-f2-19|dạo này": [
    "này dạo",
    "dạo nào",
    "đạo này"
  ],
  "vi-f3-01|hơn": [
    "nhất",
    "hớn",
    "quá"
  ],
  "vi-f3-02|nhất": [
    "nhật",
    "hơn",
    "nhát"
  ],
  "vi-f3-03|nào tốt hơn": [
    "nào hơn tốt",
    "đâu tốt hơn",
    "nào tốt hớn"
  ],
  "vi-f3-04|bị": [
    "được",
    "bỉ",
    "là"
  ],
  "vi-f3-05|bị hỏng rồi": [
    "được hỏng rồi",
    "hỏng bị rồi",
    "bị hỏng chưa"
  ],
  "vi-f3-06|sửa giúp tôi": [
    "giúp sửa tôi",
    "sửa giúp của tôi",
    "sữa giúp tôi"
  ],
  "vi-f3-07|Nếu": [
    "Nêu",
    "Vì",
    "Tuy"
  ],
  "vi-f3-07|nếu": [
    "nêu",
    "vì",
    "tuy"
  ],
  "vi-f3-08|Tuy": [
    "Vì",
    "Nếu",
    "Tùy"
  ],
  "vi-f3-08|tuy": [
    "vì",
    "nếu",
    "tùy"
  ],
  "vi-f3-09|Sau khi": [
    "Khi sau",
    "Sao khi",
    "Trước khi"
  ],
  "vi-f3-09|sau khi": [
    "khi sau",
    "sao khi",
    "trước khi"
  ],
  "vi-f3-10|Trước khi": [
    "Khi trước",
    "Sau khi",
    "Trược khi"
  ],
  "vi-f3-10|trước khi": [
    "khi trước",
    "sau khi",
    "trược khi"
  ],
  "vi-f3-11|Lúc đầu": [
    "Đầu lúc",
    "Lúc đâu",
    "Lúc cuối"
  ],
  "vi-f3-11|lúc đầu": [
    "đầu lúc",
    "lúc đâu",
    "lúc cuối"
  ],
  "vi-f3-12|Cuối cùng": [
    "Cùng cuối",
    "Cuối cũng",
    "Đầu tiên"
  ],
  "vi-f3-12|cuối cùng": [
    "cùng cuối",
    "cuối cũng",
    "đầu tiên"
  ],
  "vi-f3-13|nghĩ là": [
    "nghỉ là",
    "là nghĩ",
    "nghĩ về"
  ],
  "vi-f3-14|nói là": [
    "nói với",
    "là nói",
    "nói của"
  ],
  "vi-f3-15|Theo tôi": [
    "Tôi theo",
    "Theo của tôi",
    "Thèo tôi"
  ],
  "vi-f3-15|theo tôi": [
    "tôi theo",
    "theo của tôi",
    "thèo tôi"
  ],
  "vi-f3-16|vừa": [
    "vữa",
    "rồi",
    "sắp"
  ],
  "vi-f3-17|sắp": [
    "sập",
    "vừa",
    "đã"
  ],
  "vi-f3-18|Không hẳn": [
    "Hẳn không",
    "Không hằn",
    "Không hết"
  ],
  "vi-f3-18|không hẳn": [
    "hẳn không",
    "không hằn",
    "không hết"
  ],
  "vi-f3-19|Có lẽ": [
    "Có lẻ",
    "Lẽ có",
    "Có lễ"
  ],
  "vi-f3-19|có lẽ": [
    "có lẻ",
    "lẽ có",
    "có lễ"
  ]
};
