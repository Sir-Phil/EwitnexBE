export function isValidEmail(email: string): boolean {
    // Add your email validation logic here 
   const emailRegrex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegrex.test(email);
  }
  
export  function isValidPhoneNumber(phoneNumber: string) {
    // Add your phone number validation logic here
    // customize based on any country's phone number format
    const phonRegrx = /^[\d\s().-]+$/;
    return phonRegrx.test(phoneNumber);
  }
  
export  function isValidUsername(username: string) {
    // Add your username validation logic here
    const usernameRegrex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    return usernameRegrex.test(username);
  }
  