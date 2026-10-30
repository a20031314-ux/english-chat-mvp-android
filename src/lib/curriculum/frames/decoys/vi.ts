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
  ],
  "vi-f4-01|không những": [
    "không nhưng",
    "những không",
    "không nhiều"
  ],
  "vi-f4-01|Không những": [
    "Không nhưng",
    "Những không",
    "Không nhiều"
  ],
  "vi-f4-02|Dù": [
    "Vì",
    "Do",
    "Để"
  ],
  "vi-f4-02|dù": [
    "vì",
    "do",
    "để"
  ],
  "vi-f4-03|để": [
    "đề",
    "vì",
    "do"
  ],
  "vi-f4-04|càng": [
    "cành",
    "căng",
    "cũng"
  ],
  "vi-f4-05|hơi": [
    "hời",
    "hỏi",
    "hơn"
  ],
  "vi-f4-05|Hơi": [
    "Hời",
    "Hỏi",
    "Hơn"
  ],
  "vi-f4-06|khá": [
    "khác",
    "khả",
    "khà"
  ],
  "vi-f4-07|Về": [
    "Vì",
    "Với",
    "Vế"
  ],
  "vi-f4-07|về": [
    "vì",
    "với",
    "vế"
  ],
  "vi-f4-08|Tuy nhiên": [
    "Tùy nhiên",
    "Tuy nhưng",
    "Tuy nên"
  ],
  "vi-f4-08|tuy nhiên": [
    "tùy nhiên",
    "tuy nhưng",
    "tuy nên"
  ],
  "vi-f4-09|Ngoài ra": [
    "Ngoài vào",
    "Ngoại ra",
    "Ngoài đi"
  ],
  "vi-f4-09|ngoài ra": [
    "ngoài vào",
    "ngoại ra",
    "ngoài đi"
  ],
  "vi-f4-10|Nói thẳng ra": [
    "Nói thằng ra",
    "Nói thẳng vào",
    "Nói thẳng lên"
  ],
  "vi-f4-10|nói thẳng ra": [
    "nói thằng ra",
    "nói thẳng vào",
    "nói thẳng lên"
  ],
  "vi-f4-11|Điều quan trọng là": [
    "Điều quan trọng thì",
    "Điều quan trọng nhưng",
    "Điều quan trọng như"
  ],
  "vi-f4-11|điều quan trọng là": [
    "điều quan trọng thì",
    "điều quan trọng nhưng",
    "điều quan trọng như"
  ],
  "vi-f4-12|e là": [
    "é là",
    "ê là",
    "e mà"
  ],
  "vi-f4-13|Mặt khác": [
    "Mặc khác",
    "Mặt kia",
    "Mặt khắc"
  ],
  "vi-f4-13|mặt khác": [
    "mặc khác",
    "mặt kia",
    "mặt khắc"
  ],
  "vi-f4-14|đồng ý một phần": [
    "đồng ý một phận",
    "đồng ý một mặt",
    "đồng ý một khúc"
  ],
  "vi-f4-15|Chốt lại": [
    "Chốt lên",
    "Chột lại",
    "Chốt đi"
  ],
  "vi-f4-15|chốt lại": [
    "chốt lên",
    "chột lại",
    "chốt đi"
  ],
  "vi-f4-16|Tóm lại": [
    "Tóm lên",
    "Tốm lại",
    "Tóm lấy"
  ],
  "vi-f4-16|tóm lại": [
    "tóm lên",
    "tốm lại",
    "tóm lấy"
  ],
  "vi-f4-17|giảm được không": [
    "giảm được chưa",
    "giảm có không",
    "giảm được hay"
  ],
  "vi-f4-18|Nếu được thì": [
    "Nếu được là",
    "Nếu được nên",
    "Nếu được mà"
  ],
  "vi-f4-18|nếu được thì": [
    "nếu được là",
    "nếu được nên",
    "nếu được mà"
  ],
  "vi-f4-19|xác nhận lại": [
    "xác nhận vào",
    "sát nhận lại",
    "xác định lại"
  ],
  "vi-f4-20|chịu trách nhiệm": [
    "chịu trách nghiệm",
    "chịu chách nhiệm",
    "chịu nhiệm trách"
  ],
  "vi-f5-01|Chính": [
    "Chín",
    "Chỉnh",
    "Chình"
  ],
  "vi-f5-01|chính": [
    "chín",
    "chỉnh",
    "chình"
  ],
  "vi-f5-02|Ngay cả": [
    "Ngày cả",
    "Ngay cũng",
    "Ngay khi"
  ],
  "vi-f5-02|ngay cả": [
    "ngày cả",
    "ngay cũng",
    "ngay khi"
  ],
  "vi-f5-03|Đến cả": [
    "Đến cùng",
    "Đến khi",
    "Đền cả"
  ],
  "vi-f5-03|đến cả": [
    "đến cùng",
    "đến khi",
    "đền cả"
  ],
  "vi-f5-04|rồi mà": [
    "rồi mả",
    "rồi nhưng",
    "rồi mới"
  ],
  "vi-f5-05|chứ": [
    "chư",
    "chữ",
    "chú"
  ],
  "vi-f5-06|đấy": [
    "đây",
    "đáy",
    "đầy"
  ],
  "vi-f5-07|Sao lại": [
    "Sao là",
    "Sau lại",
    "Xao lại"
  ],
  "vi-f5-07|sao lại": [
    "sao là",
    "sau lại",
    "xao lại"
  ],
  "vi-f5-08|Có phải": [
    "Có phái",
    "Cố phải",
    "Có phại"
  ],
  "vi-f5-08|có phải": [
    "có phái",
    "cố phải",
    "có phại"
  ],
  "vi-f5-09|Đối với": [
    "Đối vơi",
    "Đội với",
    "Đối cho"
  ],
  "vi-f5-09|đối với": [
    "đối vơi",
    "đội với",
    "đối cho"
  ],
  "vi-f5-10|Trong bối cảnh": [
    "Trong bối cánh",
    "Trên bối cảnh",
    "Trong bồi cảnh"
  ],
  "vi-f5-10|trong bối cảnh": [
    "trong bối cánh",
    "trên bối cảnh",
    "trong bồi cảnh"
  ],
  "vi-f5-11|nhằm": [
    "nhầm",
    "nhắm",
    "nhằng"
  ],
  "vi-f5-12|Không phải là": [
    "Không phái là",
    "Không phải thì",
    "Không phải như"
  ],
  "vi-f5-12|không phải là": [
    "không phái là",
    "không phải thì",
    "không phải như"
  ],
  "vi-f5-13|nhè nhẹ": [
    "nhẹ nhè",
    "nhè nhè",
    "nhẹ nhẹ"
  ],
  "vi-f5-14|Nói thật lòng": [
    "Nói thật lồng",
    "Nói thật lỏng",
    "Nói thất lòng"
  ],
  "vi-f5-14|nói thật lòng": [
    "nói thật lồng",
    "nói thật lỏng",
    "nói thất lòng"
  ],
  "vi-f5-15|Biết là": [
    "Biệt là",
    "Biết làm",
    "Biết là thì"
  ],
  "vi-f5-15|biết là": [
    "biệt là",
    "biết làm",
    "biết là thì"
  ],
  "vi-f5-16|Nói gì thì nói": [
    "Nói gì cũng nói",
    "Nói gì là nói",
    "Nói gì mà nói"
  ],
  "vi-f5-16|nói gì thì nói": [
    "nói gì cũng nói",
    "nói gì là nói",
    "nói gì mà nói"
  ],
  "vi-f5-17|được cái là": [
    "được cái mà",
    "được cải là",
    "được cái thì"
  ],
  "vi-f5-17|Được cái là": [
    "Được cái mà",
    "Được cải là",
    "Được cái thì"
  ],
  "vi-f5-18|Xin phép được": [
    "Xin phép bị",
    "Xin phép phải",
    "Xin phép đã"
  ],
  "vi-f5-18|xin phép được": [
    "xin phép bị",
    "xin phép phải",
    "xin phép đã"
  ],
  "vi-f5-19|Thay mặt": [
    "Thay mắt",
    "Thay vì",
    "Thây mặt"
  ],
  "vi-f5-19|thay mặt": [
    "thay mắt",
    "thay vì",
    "thây mặt"
  ]
};
