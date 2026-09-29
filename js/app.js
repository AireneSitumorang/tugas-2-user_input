const App = {

    projects: [],


    /* =================================================
       INIT
    ================================================= */

    async init() {

        await this.loadKeahlian();

        await this.loadProjects();

        this.setupModal();

    },


    /* =================================================
       LOAD KEAHLIAN
    ================================================= */

    async loadKeahlian() {

        const container =
            document.getElementById(
                "keahlian-container"
            );

        try {

            container.innerHTML = `
                <p class="loading">
                    Memuat data keahlian...
                </p>
            `;

            const data =
                await ApiService.getKeahlian();


            if (!data || data.length === 0) {

                container.innerHTML = `
                    <p class="loading">
                        Belum ada data keahlian.
                    </p>
                `;

                return;
            }


            container.innerHTML =
                data.map((skill, index) => {

                    const tags =
                        skill.tags
                            .map(tag => `
                                <span>${this.escapeHTML(tag)}</span>
                            `)
                            .join("");


                    return `

                        <article class="skill-card">

                            <div class="skill-icon">
                                ${this.escapeHTML(skill.icon)}
                            </div>

                            <span class="skill-number">
                                ${String(index + 1).padStart(2, "0")}
                            </span>

                            <h3>
                                ${this.escapeHTML(skill.nama)}
                            </h3>

                            <p>
                                ${this.escapeHTML(skill.deskripsi)}
                            </p>

                            <div class="tags">
                                ${tags}
                            </div>

                        </article>

                    `;

                }).join("");

        } catch (error) {

            container.innerHTML = `
                <p class="error">
                    ${this.escapeHTML(error.message)}
                </p>
            `;

        }

    },


    /* =================================================
       LOAD PROJECT
    ================================================= */

    async loadProjects() {

        const container =
            document.getElementById(
                "project-container"
            );

        try {

            container.innerHTML = `
                <p class="loading">
                    Memuat data project...
                </p>
            `;

            const data =
                await ApiService.getProjects();


            this.projects = data;


            if (!data || data.length === 0) {

                container.innerHTML = `
                    <p class="loading">
                        Belum ada data project.
                    </p>
                `;

                return;
            }


            this.renderProjects();

        } catch (error) {

            container.innerHTML = `
                <p class="error">
                    ${this.escapeHTML(error.message)}
                </p>
            `;

        }

    },


    /* =================================================
       RENDER PROJECT
    ================================================= */

    renderProjects() {

        const container =
            document.getElementById(
                "project-container"
            );


        container.innerHTML =
            this.projects.map((project, index) => {

                const tags =
                    project.tags
                        .map(tag => `
                            <span>
                                ${this.escapeHTML(tag)}
                            </span>
                        `)
                        .join("");


                return `

                    <article
                        class="project-card ${
                            index === 0 ? "featured" : ""
                        }"
                    >

                        <div class="project-top">

                            <span>
                                ${String(index + 1).padStart(2, "0")}
                            </span>

                            <span>
                                ${this.escapeHTML(
                                    project.kategori
                                )}
                            </span>

                        </div>


                        <h3>
                            ${this.escapeHTML(project.nama)}
                        </h3>


                        <p>
                            ${this.escapeHTML(project.deskripsi)}
                        </p>


                        <div class="tags">
                            ${tags}
                        </div>


                        <button
                            class="project-detail-btn"
                            data-project-id="${project.id}"
                        >
                            Lihat Detail
                        </button>

                    </article>

                `;

            }).join("");


        const buttons =
            document.querySelectorAll(
                ".project-detail-btn"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.projectId
                        );

                    this.openProjectModal(id);

                }
            );

        });

    },


    /* =================================================
       OPEN MODAL
    ================================================= */

    openProjectModal(id) {

        const project =
            this.projects.find(
                item => item.id === id
            );


        if (!project) {
            return;
        }


        document.getElementById(
            "modalCategory"
        ).textContent = project.kategori;


        document.getElementById(
            "modalTitle"
        ).textContent = project.nama;


        document.getElementById(
            "modalDescription"
        ).textContent = project.detail;


        const tagsContainer =
            document.getElementById(
                "modalTags"
            );


        tagsContainer.innerHTML =
            project.tags
                .map(tag => `
                    <span>
                        ${this.escapeHTML(tag)}
                    </span>
                `)
                .join("");


        document.getElementById(
            "projectModal"
        ).classList.add("active");

    },


    /* =================================================
       MODAL SETUP
    ================================================= */

    setupModal() {

        const modal =
            document.getElementById(
                "projectModal"
            );

        const closeButton =
            document.getElementById(
                "closeModal"
            );


        closeButton.addEventListener(
            "click",
            () => {

                modal.classList.remove(
                    "active"
                );

            }
        );


        modal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === modal
                ) {

                    modal.classList.remove(
                        "active"
                    );

                }

            }
        );


        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape"
                ) {

                    modal.classList.remove(
                        "active"
                    );

                }

            }
        );

    },


    /* =================================================
       ESCAPE HTML
    ================================================= */

    escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }

};


/* =====================================================
   START APPLICATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        App.init();

    }
);