import { PROPERTIES } from './propertyDatabase.generated.js';

// Comprehensive Property Database for Match-Making
class PropertyDatabase {
    constructor() {
        this.properties = this.initializeProperties();
    }

    initializeProperties() {
      return PROPERTIES;
    }

    // Get properties by filters
    getProperties(filters = {}) {
        let filtered = [...this.properties];

        if (filters.area) {
            filtered = filtered.filter((prop) => prop.area === filters.area);
        }

        if (filters.minPrice) {
            filtered = filtered.filter(
                (prop) => prop.price >= filters.minPrice,
            );
        }

        if (filters.maxPrice) {
            filtered = filtered.filter(
                (prop) => prop.price <= filters.maxPrice,
            );
        }

        if (filters.type) {
            filtered = filtered.filter((prop) => prop.type === filters.type);
        }

        if (filters.minRooms) {
            filtered = filtered.filter(
                (prop) => prop.rooms >= filters.minRooms,
            );
        }

        if (filters.maxRooms) {
            filtered = filtered.filter(
                (prop) => prop.rooms <= filters.maxRooms,   // ✅ added line
            );
        }

        if (filters.features && filters.features.length > 0) {
            filtered = filtered.filter((prop) =>
                filters.features.every((feature) =>
                    prop.features.includes(feature),
                ),
            );
        }

        return filtered;
    }

    // Get property by ID
    getPropertyById(id) {
        return this.properties.find((prop) => prop.id === id);
    }

    // Add new property
    addProperty(property) {
        property.id =
            "prop_" + (this.properties.length + 1).toString().padStart(3, "0");
        this.properties.push(property);
        return property.id;
    }

    // Get similar properties
    getSimilarProperties(propertyId, limit = 5) {
        const property = this.getPropertyById(propertyId);
        if (!property) return [];

        const similar = this.properties
            .filter((prop) => prop.id !== propertyId)
            .map((prop) => ({
                property: prop,
                similarity: this.calculateSimilarity(property, prop),
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit)
            .map((item) => item.property);

        return similar;
    }

    // Calculate similarity between properties
    calculateSimilarity(prop1, prop2) {
        let similarity = 0;

        // Area similarity
        if (prop1.area === prop2.area) similarity += 30;

        // Type similarity
        if (prop1.type === prop2.type) similarity += 25;

        // Price similarity (within 30%)
        const priceDiff = Math.abs(prop1.price - prop2.price) / prop1.price;
        if (priceDiff < 0.3) similarity += 20;

        // Room count similarity
        const roomDiff = Math.abs(prop1.rooms - prop2.rooms);
        if (roomDiff <= 1) similarity += 15;

        // Feature similarity
        const commonFeatures = prop1.features.filter((feature) =>
            prop2.features.includes(feature),
        );
        similarity += (commonFeatures.length / prop1.features.length) * 10;

        return similarity;
    }

    // Get trending properties
    getTrendingProperties(limit = 10) {
        return this.properties
            .filter(
                (prop) => prop.days_on_market <= 14 || prop.status === "hot",
            )
            .sort((a, b) => {
                if (a.status === "hot" && b.status !== "hot") return -1;
                if (b.status === "hot" && a.status !== "hot") return 1;
                return a.days_on_market - b.days_on_market;
            })
            .slice(0, limit);
    }

    // Get investment opportunities
    getInvestmentOpportunities(limit = 10) {
        return this.properties
            .filter((prop) => prop.roi_potential >= 8)
            .sort((a, b) => b.roi_potential - a.roi_potential)
            .slice(0, limit);
    }
}

// Export for use in main application
export { PropertyDatabase };