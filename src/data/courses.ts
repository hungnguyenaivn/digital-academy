export type Course = {
  id: string;
  name: string;
  planetImage: string;
};

// Dữ liệu mock. Thứ tự hành tinh theo 7 frame "Khóa học 1…7" trong Figma; tên khóa là tên giả.
export const courses: Course[] = [
  { id: "english-3", name: "Tiếng Anh lớp 3", planetImage: "/home/planets/earth.webp" }, // Trái Đất
  { id: "math", name: "Toán tư duy", planetImage: "/home/planets/mars.webp" }, // Sao Hỏa
  { id: "vietnamese", name: "Tiếng Việt", planetImage: "/home/planets/venus.webp" }, // Sao Kim
  { id: "it", name: "Tin học", planetImage: "/home/planets/mercury.webp" }, // Sao Thủy
  { id: "science", name: "Khoa học tự nhiên", planetImage: "/home/planets/uranus.webp" }, // Sao Thiên Vương
  { id: "art", name: "Mỹ thuật sáng tạo", planetImage: "/home/planets/neptune.webp" }, // Sao Hải Vương
  { id: "scratch", name: "Lập trình Scratch cho các bạn nhỏ", planetImage: "/home/planets/gj-504b.webp" }, // GJ 504 b
];
