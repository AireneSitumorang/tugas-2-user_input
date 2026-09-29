const ApiService = {

    async getKeahlian() {

        const response = await fetch(
            "./data/keahlian.json"
        );

        if (!response.ok) {
            throw new Error(
                `Data keahlian gagal dimuat. Status: ${response.status}`
            );
        }

        return await response.json();
    },


    async getProjects() {

        const response = await fetch(
            "./data/project.json"
        );

        if (!response.ok) {
            throw new Error(
                `Data project gagal dimuat. Status: ${response.status}`
            );
        }

        return await response.json();
    }

};