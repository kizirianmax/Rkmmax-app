class StandardsRegistry {
    constructor() {
        this.standards = {};
    }

    addStandard(standardId, details) {
        if (!this.standards[standardId]) {
            this.standards[standardId] = details;
        } else {
            throw new Error('Standard already exists.');
        }
    }

    getStandard(standardId) {
        return this.standards[standardId] || null;
    }

    removeStandard(standardId) {
        if (this.standards[standardId]) {
            delete this.standards[standardId];
        } else {
            throw new Error('Standard does not exist.');
        }
    }

    listStandards() {
        return this.standards;
    }
}

// Usage
const registry = new StandardsRegistry();
registry.addStandard('ABNT', { name: 'Associação Brasileira de Normas Técnicas', year: 1940 });
registry.addStandard('APA', { name: 'American Psychological Association', year: 1929 });
registry.addStandard('IEEE', { name: 'Institute of Electrical and Electronics Engineers', year: 1963 });
registry.addStandard('ISO', { name: 'International Organization for Standardization', year: 1947 });

export default StandardsRegistry;