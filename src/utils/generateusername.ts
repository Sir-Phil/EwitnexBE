// Generate a suggested username based on first name and last name
const generateSuggestedUsername = (firstName: string, lastName: string, count: number = 3): string[] => {

    const sanitizedFirstName = firstName.toLowerCase().replace(/\s+/g, '');
    const sanitizedLastName = lastName.toLowerCase().replace(/\s+/g, '');
    const suggestedUsernames = [];

    for (let i = 0; i < count; i++){
    const randomSuffix = Math.floor(Math.random() * 1000); // Add a random number for uniqueness
    suggestedUsernames.push(`${sanitizedFirstName}.${sanitizedLastName}.${randomSuffix}`);
    
  };
  return suggestedUsernames
  };

export default generateSuggestedUsername