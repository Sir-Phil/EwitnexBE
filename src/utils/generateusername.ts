// Generate a suggested username based on first name and last name
const generateSuggestedUsername = (firstName: string, lastName: string) => {
    const sanitizedFirstName = firstName.toLowerCase().replace(/\s+/g, '');
    const sanitizedLastName = lastName.toLowerCase().replace(/\s+/g, '');
    const randomSuffix = Math.floor(Math.random() * 1000); // Add a random number for uniqueness
    return `${sanitizedFirstName}.${sanitizedLastName}.${randomSuffix}`;
  };

  export default generateSuggestedUsername