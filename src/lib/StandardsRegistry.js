class StandardsRegistry {
    constructor() {
        this.standards = {};
    }

    registerStandard(key, description) {
        if (!this.standards[key]) {
            this.standards[key] = description;
        } else {
            throw new Error(`Standard ${key} is already registered.`);
        }
    }

    getStandard(key) {
        return this.standards[key] || null;
    }

    listStandards() {
        return Object.keys(this.standards);
    }
}

// Example usage:
const registry = new StandardsRegistry();
registry.registerStandard('ABNT', 'Associação Brasileira de Normas Técnicas');
registry.registerStandard('APA', 'American Psychological Association');
registry.registerStandard('IEEE', 'Institute of Electrical and Electronics Engineers');
registry.registerStandard('ISO', 'International Organization for Standardization');

console.log(registry.listStandards()); // ['ABNT', 'APA', 'IEEE', 'ISO']
