/* =========================================
   PRESENTATION LAYER
   app.js
========================================= */

const App = {

    profile: null,

    projects: [],

    services: [],

    currentCategory: "ALL",


    /* =====================================
       INITIALIZATION
    ===================================== */

    async init() {

        this.setupProjectModal();

        this.setupServiceForm();

        this.loadLocalStorageCount();

        await Promise.all([
            this.loadProfile(),
            this.loadProjects(),
            this.loadServices()
        ]);

    },


    /* =====================================
       PROFILE
    ===================================== */

    async loadProfile() {

        try {

            const data = await ApiService.getProfile();

            this.profile = data;

            this.renderProfile();

            this.renderSkills();

            this.renderExperience();

        } catch (error) {

            console.error("Profile Error:", error);

            this.showError(
                "about-description",
                "Gagal memuat data profile."
            );

        }

    },


    renderProfile() {

        const profile = this.profile;

        if (!profile) {
            return;
        }


        /*
         * Hero
         */

        this.setText(
            "profile-name",
            profile.nama
        );

        this.setText(
            "profile-card-name",
            profile.nama
        );

        this.setText(
            "profile-role",
            profile.role
        );

        this.setText(
            "profile-description",
            profile.description
        );


        /*
         * Profile Image
         */

        const image = document.getElementById(
            "profile-image"
        );

        if (image && profile.image) {

            image.src = profile.image;

            image.alt =
                `Foto ${profile.nama}`;

        }


        /*
         * About
         */

        this.setText(
            "about-description",
            profile.about
        );


        /*
         * Information
         */

        this.setText(
            "profile-nim",
            profile.nim
        );

        this.setText(
            "profile-program",
            profile.programStudi
        );

        this.setText(
            "profile-faculty",
            profile.fakultas
        );

        this.setText(
            "profile-university",
            profile.universitas
        );

        this.setText(
            "profile-status",
            profile.status
        );

        this.setText(
            "profile-email",
            profile.email
        );


        /*
         * Interests
         */

        const interestContainer =
            document.getElementById(
                "interest-container"
            );

        if (interestContainer) {

            if (
                !profile.interests ||
                profile.interests.length === 0
            ) {

                interestContainer.innerHTML =
                    `<span class="loading-text">
                        Belum ada data interest.
                    </span>`;

            } else {

                interestContainer.innerHTML =
                    profile.interests
                        .map(
                            interest => `
                                <span class="interest-tag">
                                    ${this.escapeHTML(interest)}
                                </span>
                            `
                        )
                        .join("");

            }

        }


        /*
         * LinkedIn
         */

        const linkedinLinks =
            document.querySelectorAll(
                "#linkedin-link, #contact-linkedin"
            );

        linkedinLinks.forEach(link => {

            link.href = profile.linkedin;

        });


        /*
         * Contact Email
         */

        const emailLink =
            document.getElementById(
                "contact-email"
            );

        if (emailLink) {

            emailLink.href =
                `mailto:${profile.email}`;

            emailLink.querySelector(
                "span"
            ).textContent =
                profile.email;

        }

    },


    /* =====================================
       SKILLS
    ===================================== */

    renderSkills() {

        if (!this.profile) {
            return;
        }

        this.renderSkillGroup(
            "hard-skills-container",
            this.profile.hardSkills
        );

        this.renderSkillGroup(
            "soft-skills-container",
            this.profile.softSkills
        );

    },


    renderSkillGroup(
        containerId,
        skills
    ) {

        const container =
            document.getElementById(
                containerId
            );

        if (!container) {
            return;
        }


        /*
         * EMPTY STATE
         */

        if (!skills || skills.length === 0) {

            container.innerHTML = `
                <div class="col-12">
                    <div class="state-box empty-state">
                        Belum ada data keahlian.
                    </div>
                </div>
            `;

            return;
        }


        /*
         * SUCCESS STATE
         */

        container.innerHTML =
            skills
                .map(
                    skill => `
                        <div class="col-md-6 col-lg-4">

                            <article class="skill-card">

                                <div class="skill-icon">
                                    ${this.escapeHTML(skill.icon)}
                                </div>

                                <h4>
                                    ${this.escapeHTML(skill.nama)}
                                </h4>

                                <p>
                                    ${this.escapeHTML(
                                        skill.deskripsi
                                    )}
                                </p>

                                <div class="tag-list">

                                    ${skill.tags
                                        .map(
                                            tag => `
                                                <span class="tag">
                                                    ${this.escapeHTML(tag)}
                                                </span>
                                            `
                                        )
                                        .join("")}

                                </div>

                            </article>

                        </div>
                    `
                )
                .join("");

    },


    /* =====================================
       EXPERIENCE
    ===================================== */

    renderExperience() {

        const container =
            document.getElementById(
                "experience-container"
            );

        if (!container || !this.profile) {
            return;
        }


        const experience =
            this.profile.experience;


        if (
            !experience ||
            experience.length === 0
        ) {

            container.innerHTML = `
                <div class="state-box empty-state">
                    Belum ada data experience.
                </div>
            `;

            return;
        }


        container.innerHTML =
            experience
                .map(
                    (item, index) => `
                        <article class="experience-item">

                            <span class="experience-number">
                                ${String(index + 1).padStart(2, "0")}
                            </span>

                            <h3>
                                ${this.escapeHTML(item.nama)}
                            </h3>

                            <div class="experience-organization">
                                ${this.escapeHTML(
                                    item.organisasi
                                )}
                            </div>

                            <p>
                                ${this.escapeHTML(
                                    item.deskripsi
                                )}
                            </p>

                        </article>
                    `
                )
                .join("");

    },


    /* =====================================
       PROJECTS
    ===================================== */

    async loadProjects() {

        const container =
            document.getElementById(
                "project-container"
            );

        try {

            this.showLoading(
                container,
                "Memuat project..."
            );


            const data =
                await ApiService.getProjects();


            this.projects = Array.isArray(data)
                ? data
                : [];


            /*
             * EMPTY STATE
             */

            if (this.projects.length === 0) {

                this.showEmpty(
                    container,
                    "Belum ada data project."
                );

                return;
            }


            /*
             * FILTER
             */

            this.renderProjectFilters();


            /*
             * PROJECT SUCCESS
             */

            this.renderProjects();

        } catch (error) {

            console.error(
                "Project Error:",
                error
            );

            this.showError(
                "project-container",
                "Gagal memuat data project."
            );

        }

    },


    renderProjectFilters() {

        const filterContainer =
            document.getElementById(
                "project-filter"
            );

        if (!filterContainer) {
            return;
        }


        const categories = [
            ...new Set(
                this.projects.map(
                    project => project.kategori
                )
            )
        ];


        filterContainer.innerHTML = `
            <button
                class="filter-btn active"
                data-category="ALL"
            >
                Semua
            </button>

            ${categories
                .map(
                    category => `
                        <button
                            class="filter-btn"
                            data-category="${this.escapeHTML(
                                category
                            )}"
                        >
                            ${this.escapeHTML(category)}
                        </button>
                    `
                )
                .join("")}
        `;


        /*
         * Filter event
         */

        const buttons =
            filterContainer.querySelectorAll(
                ".filter-btn"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    this.currentCategory =
                        button.dataset.category;


                    this.renderProjects();

                }
            );

        });

    },


    renderProjects() {

        const container =
            document.getElementById(
                "project-container"
            );

        if (!container) {
            return;
        }


        let filteredProjects =
            this.projects;


        if (
            this.currentCategory !==
            "ALL"
        ) {

            filteredProjects =
                this.projects.filter(
                    project =>
                        project.kategori ===
                        this.currentCategory
                );

        }


        /*
         * EMPTY FILTER STATE
         */

        if (
            filteredProjects.length === 0
        ) {

            this.showEmpty(
                container,
                "Tidak ada project pada kategori ini."
            );

            return;
        }


        /*
         * SUCCESS STATE
         */

        container.innerHTML =
            filteredProjects
                .map(
                    (project, index) =>
                        this.createProjectCard(
                            project,
                            index
                        )
                )
                .join("");


        /*
         * Detail button events
         */

        const buttons =
            container.querySelectorAll(
                ".project-detail-btn"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const projectId =
                        Number(
                            button.dataset.projectId
                        );

                    this.openProjectModal(
                        projectId
                    );

                }
            );

        });

    },


    createProjectCard(
        project,
        index
    ) {

        return `
            <div class="col-md-6 col-lg-4">

                <article class="project-card">

                    <img
                        class="project-image"
                        src="${this.safeUrl(project.image)}"
                        alt="${this.escapeHTML(
                            project.nama
                        )}"
                        onerror="
                            this.src='https://placehold.co/900x560/png?text=Project'
                        "
                    >

                    <div class="project-body">

                        <div class="project-top">

                            <span>
                                ${String(index + 1).padStart(2, "0")}
                            </span>

                            <span class="project-category">
                                ${this.escapeHTML(
                                    project.kategori
                                )}
                            </span>

                        </div>


                        <h3>
                            ${this.escapeHTML(
                                project.nama
                            )}
                        </h3>


                        <p>
                            ${this.escapeHTML(
                                project.deskripsi
                            )}
                        </p>


                        <div class="tag-list">

                            ${project.tags
                                .map(
                                    tag => `
                                        <span class="tag">
                                            ${this.escapeHTML(
                                                tag
                                            )}
                                        </span>
                                    `
                                )
                                .join("")}

                        </div>


                        <button
                            type="button"
                            class="project-detail-btn"
                            data-project-id="${project.id}"
                        >
                            Lihat Detail
                            <i class="bi bi-arrow-right"></i>
                        </button>

                    </div>

                </article>

            </div>
        `;

    },


    /* =====================================
       UNIVERSAL MODAL
    ===================================== */

    setupProjectModal() {

        const modalElement =
            document.getElementById(
                "projectModal"
            );

        if (!modalElement) {
            return;
        }


        /*
         * Bootstrap 5 Modal API
         */

        this.projectModal =
            new bootstrap.Modal(
                modalElement
            );

    },


    openProjectModal(id) {

        const project =
            this.projects.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );


        if (!project) {
            return;
        }


        this.setText(
            "modalCategory",
            project.kategori
        );

        this.setText(
            "modalTitle",
            project.nama
        );

        this.setText(
            "modalDescription",
            project.deskripsi
        );

        this.setText(
            "modalDetail",
            project.detail
        );


        /*
         * Image
         */

        const image =
            document.getElementById(
                "modalImage"
            );


        if (image) {

            image.src =
                this.safeUrl(
                    project.image
                );

            image.alt =
                this.escapeHTML(
                    project.nama
                );

        }


        /*
         * Metrics
         */

        const metrics =
            document.getElementById(
                "modalMetrics"
            );


        if (metrics) {

            metrics.innerHTML =
                (project.metrics || [])
                    .map(
                        metric => `
                            <span class="metric-item">
                                ${this.escapeHTML(
                                    metric
                                )}
                            </span>
                        `
                    )
                    .join("");

        }


        /*
         * Tags
         */

        const tags =
            document.getElementById(
                "modalTags"
            );


        if (tags) {

            tags.innerHTML =
                (project.tags || [])
                    .map(
                        tag => `
                            <span class="tag">
                                ${this.escapeHTML(
                                    tag
                                )}
                            </span>
                        `
                    )
                    .join("");

        }


        /*
         * Link
         */

        const link =
            document.getElementById(
                "modalLink"
            );


        if (link) {

            if (
                project.link &&
                project.link !== "#"
            ) {

                link.href =
                    this.safeUrl(
                        project.link
                    );

                link.style.display =
                    "inline-flex";

            } else {

                link.style.display =
                    "none";

            }

        }


        /*
         * Show modal
         */

        if (this.projectModal) {

            this.projectModal.show();

        }

    },


    /* =====================================
       SERVICES
    ===================================== */

    async loadServices() {

        const container =
            document.getElementById(
                "services-container"
            );


        try {

            this.showLoading(
                container,
                "Memuat layanan..."
            );


            const data =
                await ApiService.getServices();


            this.services =
                Array.isArray(data)
                    ? data
                    : [];


            if (
                this.services.length === 0
            ) {

                this.showEmpty(
                    container,
                    "Belum ada data layanan."
                );

                return;
            }


            this.renderServices();

            this.renderServiceOptions();


        } catch (error) {

            console.error(
                "Services Error:",
                error
            );


            this.showError(
                "services-container",
                "Gagal memuat layanan."
            );


            const select =
                document.getElementById(
                    "service-select"
                );


            if (select) {

                select.innerHTML = `
                    <option value="">
                        Layanan gagal dimuat
                    </option>
                `;

            }

        }

    },


    renderServices() {

        const container =
            document.getElementById(
                "services-container"
            );


        if (!container) {
            return;
        }


        container.innerHTML =
            this.services
                .map(
                    service => `
                        <div class="col-md-6 col-lg-4">

                            <article class="service-card">

                                <div class="service-icon">

                                    <i class="bi ${
                                        this.escapeHTML(
                                            service.icon
                                        )
                                    }"></i>

                                </div>


                                <h3>
                                    ${this.escapeHTML(
                                        service.nama
                                    )}
                                </h3>


                                <p>
                                    ${this.escapeHTML(
                                        service.deskripsi
                                    )}
                                </p>


                                <div class="tag-list mb-3">

                                    ${(service.fitur || [])
                                        .map(
                                            feature => `
                                                <span class="tag">
                                                    ${this.escapeHTML(
                                                        feature
                                                    )}
                                                </span>
                                            `
                                        )
                                        .join("")}

                                </div>


                                <div class="service-price">
                                    ${this.escapeHTML(
                                        service.harga
                                    )}
                                </div>

                            </article>

                        </div>
                    `
                )
                .join("");

    },


    renderServiceOptions() {

        const select =
            document.getElementById(
                "service-select"
            );


        if (!select) {
            return;
        }


        select.innerHTML = `
            <option value="">
                Pilih layanan
            </option>

            ${this.services
                .map(
                    service => `
                        <option
                            value="${this.escapeHTML(
                                service.nama
                            )}"
                        >
                            ${this.escapeHTML(
                                service.nama
                            )}
                        </option>
                    `
                )
                .join("")}
        `;

    },


    /* =====================================
       SERVICE FORM
    ===================================== */

    setupServiceForm() {

        const form =
            document.getElementById(
                "service-form"
            );


        if (!form) {
            return;
        }


        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const button =
                    document.getElementById(
                        "submit-service"
                    );


                const formData =
                    new FormData(form);


                const payload = {

                    name:
                        formData.get("name"),

                    email:
                        formData.get("email"),

                    service:
                        formData.get("service"),

                    message:
                        formData.get("message"),

                    createdAt:
                        new Date().toISOString()

                };


                /*
                 * Button loading
                 */

                const originalText =
                    button.innerHTML;


                button.disabled = true;

                button.innerHTML = `
                    <span
                        class="spinner-border spinner-border-sm me-2"
                    ></span>
                    Mengirim...
                `;


                try {

                    /*
                     * REST POST
                     */

                    await ApiService.submitServiceOrder(
                        payload
                    );


                    /*
                     * localStorage
                     */

                    this.saveOrder(
                        payload
                    );


                    /*
                     * Toast
                     */

                    this.showToast(
                        "Permintaan berhasil dikirim dan disimpan."
                    );


                    form.reset();


                } catch (error) {

                    console.error(
                        "Submit Error:",
                        error
                    );


                    this.showToast(
                        "Permintaan gagal dikirim. Silakan coba lagi.",
                        true
                    );

                } finally {

                    button.disabled =
                        false;

                    button.innerHTML =
                        originalText;

                }

            }
        );

    },


    /* =====================================
       LOCAL STORAGE
    ===================================== */

    saveOrder(payload) {

        let orders = [];


        try {

            orders =
                JSON.parse(
                    localStorage.getItem(
                        "portfolioOrders"
                    )
                ) || [];

        } catch (error) {

            orders = [];

        }


        orders.push(payload);


        localStorage.setItem(
            "portfolioOrders",
            JSON.stringify(orders)
        );


        this.updateOrderCount(
            orders.length
        );

    },


    loadLocalStorageCount() {

        let orders = [];


        try {

            orders =
                JSON.parse(
                    localStorage.getItem(
                        "portfolioOrders"
                    )
                ) || [];

        } catch (error) {

            orders = [];

        }


        this.updateOrderCount(
            orders.length
        );

    },


    updateOrderCount(count) {

        const badge =
            document.getElementById(
                "order-count"
            );


        if (badge) {

            badge.textContent =
                count;

        }

    },


    /* =====================================
       TOAST
    ===================================== */

    showToast(
        message,
        isError = false
    ) {

        const toastElement =
            document.getElementById(
                "appToast"
            );


        const toastMessage =
            document.getElementById(
                "toastMessage"
            );


        if (!toastElement ||
            !toastMessage) {

            return;

        }


        toastMessage.textContent =
            message;


        if (isError) {

            toastElement.classList.add(
                "text-danger"
            );

        } else {

            toastElement.classList.remove(
                "text-danger"
            );

        }


        const toast =
            bootstrap.Toast.getOrCreateInstance(
                toastElement,
                {
                    delay: 3500
                }
            );


        toast.show();

    },


    /* =====================================
       UI STATES
    ===================================== */

    showLoading(
        container,
        message
    ) {

        if (!container) {
            return;
        }


        container.innerHTML = `
            <div class="col-12">
                <div class="state-box loading-state">
                    <i class="bi bi-arrow-repeat"></i>
                    ${this.escapeHTML(message)}
                </div>
            </div>
        `;

    },


    showEmpty(
        container,
        message
    ) {

        if (!container) {
            return;
        }


        container.innerHTML = `
            <div class="col-12">
                <div class="state-box empty-state">
                    <i class="bi bi-inbox"></i>
                    ${this.escapeHTML(message)}
                </div>
            </div>
        `;

    },


    showError(
        containerOrId,
        message
    ) {

        const container =
            typeof containerOrId === "string"
                ? document.getElementById(
                    containerOrId
                )
                : containerOrId;


        if (!container) {
            return;
        }


        container.innerHTML = `
            <div class="col-12">
                <div class="state-box error-state">
                    <i class="bi bi-exclamation-triangle"></i>
                    ${this.escapeHTML(message)}
                </div>
            </div>
        `;

    },


    /* =====================================
       SECURITY
       XSS PROTECTION
    ===================================== */

    escapeHTML(value) {

        return String(value ?? "")
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    },


    safeUrl(value) {

        const url =
            String(value || "").trim();


        if (
            url.startsWith("https://") ||
            url.startsWith("http://") ||
            url.startsWith("./") ||
            url.startsWith("../") ||
            url === "#"
        ) {

            return this.escapeHTML(
                url
            );

        }


        return "#";

    },


    /* =====================================
       HELPER
    ===================================== */

    setText(
        id,
        value
    ) {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                value ?? "";

        }

    }

};


/* =========================================
   START APPLICATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        App.init();

    }
);