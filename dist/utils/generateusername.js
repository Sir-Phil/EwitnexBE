"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generate a suggested username based on first name and last name
const generateSuggestedUsername = (firstName, lastName, count = 3) => {
    const sanitizedFirstName = firstName.toLowerCase().replace(/\s+/g, '');
    const sanitizedLastName = lastName.toLowerCase().replace(/\s+/g, '');
    const suggestedUsernames = [];
    for (let i = 0; i < count; i++) {
        const randomSuffix = Math.floor(Math.random() * 1000); // Add a random number for uniqueness
        suggestedUsernames.push(`${sanitizedFirstName}.${sanitizedLastName}.${randomSuffix}`);
    }
    ;
    return suggestedUsernames;
};
exports.default = generateSuggestedUsername;
