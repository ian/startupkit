// Format a phone number string into (XXX) XXX-XXXX
export const formatPhoneNumber = (input: string): string => {
  // Strip all non-digit characters
  const digits = input.replace(/\D/g, "");

  // Handle different lengths of input
  if (digits.length < 4) {
    return digits;
  }

  if (digits.length < 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

// Format a phone number with letters (for vanity numbers)
export const formatVanityNumber = (areaCode: string, vanityPart: string): string => {
  // Ensure area code is 3 digits
  const formattedAreaCode = areaCode.replace(/\D/g, "").slice(0, 3)

  // Format the vanity part (assuming it's already in the desired format)
  // This could be something like "555-TACO"

  if (formattedAreaCode.length === 3) {
    return `(${formattedAreaCode}) ${vanityPart}`
  }

  return `${vanityPart}`
}


// Convert formatted phone to E.164 format (+1XXXXXXXXXX)
export const toE164 = (formatted: string): string => {
  const digits = formatted.replace(/\D/g, "");

  // Ensure we have the country code
  if (digits.length > 0) {
    // Assuming US numbers (+1)
    return `+1${digits.slice(0, 10)}`;
  }
  return "";
};

// Convert E.164 to formatted display
export const fromE164 = (e164: string): string => {
  if (!e164) return "";

  // Remove the +1 prefix if present and format
  const numberPart = e164.startsWith("+1")
    ? e164.slice(2)
    : e164.replace(/\D/g, "");
  return formatPhoneNumber(numberPart);
};