// ==========================================
// API SERVICE
// ==========================================

const ApiService = {

    // ==========================================
    // DATA KEAHLIAN / SKILLS
    // ==========================================
    async getKeahlian() {

        return [
            {
                icon: "HTML",
                nama: "HTML",
                deskripsi:
                    "Membuat struktur halaman web menggunakan HTML5.",
                tags: [
                    "HTML5",
                    "Web Development"
                ]
            },

            {
                icon: "CSS",
                nama: "CSS",
                deskripsi:
                    "Mendesain tampilan website menggunakan CSS dan membuat layout yang responsif.",
                tags: [
                    "CSS",
                    "Responsive Design"
                ]
            },

            {
                icon: "Java",
                nama: "Java",
                deskripsi:
                    "Mempelajari pemrograman berorientasi objek menggunakan Java.",
                tags: [
                    "Java",
                    "OOP"
                ]
            },

            {
                icon: "UI/UX",
                nama: "UI/UX Design",
                deskripsi:
                    "Membuat rancangan antarmuka dan pengalaman pengguna.",
                tags: [
                    "Figma",
                    "UI Design"
                ]
            }
        ];

    },


    // ==========================================
    // DATA PROJECT
    // ==========================================
    async getProjects() {

        return [
            {
                id: 1,
                kategori: "UI/UX",
                nama: "ImmuniCare",
                deskripsi:
                    "Aplikasi yang membantu orang tua memantau jadwal imunisasi, informasi vaksin, dan pengingat imunisasi.",
                detail:
                    "ImmuniCare merupakan konsep aplikasi yang dirancang untuk membantu orang tua dalam memantau informasi dan jadwal imunisasi anak.",
                tags: [
                    "UI/UX",
                    "Figma",
                    "Design"
                ]
            },

            {
                id: 2,
                kategori: "Web System",
                nama: "Sistem Konseling Mahasiswa",
                deskripsi:
                    "Sistem yang dirancang untuk membantu mahasiswa mengajukan konseling secara lebih terstruktur.",
                detail:
                    "Project ini merupakan konsep sistem informasi yang membantu proses pengajuan dan pengelolaan konseling mahasiswa.",
                tags: [
                    "Web System",
                    "System Analysis",
                    "Database"
                ]
            },

            {
                id: 3,
                kategori: "AI",
                nama: "LENTERA-AI",
                deskripsi:
                    "Konsep platform pembelajaran STEM berbasis Edge AI untuk membantu siswa di daerah dengan keterbatasan koneksi internet.",
                detail:
                    "LENTERA-AI merupakan konsep platform pembelajaran yang memanfaatkan Edge AI untuk mendukung pembelajaran STEM.",
                tags: [
                    "AI",
                    "STEM",
                    "Education"
                ]
            },

            {
                id: 4,
                kategori: "AI & Algorithm",
                nama: "UCS Health Insurance",
                deskripsi:
                    "Sistem konsep penerapan Uniform Cost Search untuk mengoptimalkan alur verifikasi klaim asuransi kesehatan.",
                detail:
                    "Project ini menerapkan konsep Uniform Cost Search untuk membantu menentukan alur verifikasi klaim asuransi kesehatan berdasarkan biaya atau prioritas proses.",
                tags: [
                    "UCS",
                    "AI",
                    "Insurance"
                ]
            }
        ];

    },


    // ==========================================
    // ALIAS PROJECT
    // ==========================================
    async getProyek() {

        return this.getProjects();

    }

};