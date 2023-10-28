import {v4 as uuidv4} from "uuid"

// Function to generate custom event code
export function generateCustomEventCode(category: string): string {
    // Generate a unique identifier using uuid
    const uniqueIdentifier = uuidv4();
  
    // Create the event code by combining category and unique identifier
    return `${category}${uniqueIdentifier}`;
  }