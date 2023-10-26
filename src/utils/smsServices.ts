import twilio from "twilio";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const formatPhoneNumber = (inputPhoneNumber: string) => {
  try {
    const phoneNumber = parsePhoneNumberFromString(inputPhoneNumber);

    if (!phoneNumber) {
      throw new Error("Invalid phone number");
    }

    const formattedNumber = phoneNumber.format("E.164");
    return formattedNumber;
  } catch (error: any) {
    console.error(`Error formatting phone number: ${error.message}`);
    return null;
  }
};

const twilioClient = twilio(
  process.env.TWILIO_ACC_SID || "",
  process.env.TWILIO_AUTH_TOKEN || ""
);

const sendVerificationCode = async (
  phoneNumber: string
): Promise<string | null> => {
  if (!phoneNumber) {
    throw new Error("Phone number is missing.");
  }

  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

  if (!formattedPhoneNumber) {
    throw new Error("Invalid phone number.");
  }

  try {
    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_SERVICE_SID as string)
      .verifications.create({
        to: formattedPhoneNumber,
        channel: "sms",
        //code: verificationCode as any,
      });

    console.log(`Verification code sent to ${formattedPhoneNumber}: ${verification.sid}`);
    return verificationCode; // Return the generated code
  } catch (error: any) {
    console.error(`Error sending verification code: ${error.message}`);
    return null;
  }
};

export default sendVerificationCode;
