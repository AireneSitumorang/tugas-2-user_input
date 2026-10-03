/* =========================================
   DATA ACCESS LAYER
   api-service.js
========================================= */

const ApiService = {

    /*
     * Fungsi umum untuk mengambil data JSON
     */
    async request(url, options = {}) {

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(
                `Request gagal dengan status ${response.status}`
            );
        }

        return await response.json();
    },


    /*
     * Mengambil data profile
     */
    async getProfile() {

        return await this.request(
            "./data/profile.json"
        );
    },


    /*
     * Mengambil data project
     */
    async getProjects() {

        return await this.request(
            "./data/projects.json"
        );
    },


    /*
     * Mengambil data services
     *
     * Sesuai struktur modul:
     * proyek/services.json
     */
    async getServices() {

        return await this.request(
            "./proyek/services.json"
        );
    },


    /*
     * Mengirim data form menggunakan REST POST
     *
     * Endpoint ini digunakan sebagai mock API
     * untuk kebutuhan praktikum.
     */
    async submitServiceOrder(payload) {

        return await this.request(
            "https://jsonplaceholder.typicode.com/posts",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)
            }
        );
    }

};