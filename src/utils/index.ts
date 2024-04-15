export function convertUnixTimeToDateTime(unixTimestamp: number): string {
  if (typeof unixTimestamp !== "number" || isNaN(unixTimestamp)) {
    throw new Error("Invalid UNIX timestamp provided.");
  }

  // Create a new Date object
  const date = new Date(unixTimestamp * 1000);

  // Get year, month, day, hours (12-hour format), minutes
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = date.getHours() % 12 || 12; // Convert to 12-hour format (12 for midnight)
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // AM/PM indicator
  const amPm = date.getHours() >= 12 ? "PM" : "AM";

  // Format the date and time with AM/PM, excluding seconds
  const formattedDateTime = `${month}/${day}   ${hours}:${minutes} ${amPm}`;

  return formattedDateTime;
}
