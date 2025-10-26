export function formatDate(isoString) {
  // 1. Create a Date object from the ISO string.
  // The 'Z' at the end indicates UTC time.
  const date = new Date(isoString);

  // 2. Define month abbreviations
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // 3. Extract components (using UTC methods to keep the date consistent with the 'Z' input)
  const day = date.getUTCDate();
  const monthIndex = date.getUTCMonth();
  const year = date.getUTCFullYear();

  // 4. Format the day: prepend '0' if less than 10
  const formattedDay = day < 10 ? `0${day}` : day;

  // 5. Assemble the final string
  return `${formattedDay} ${monthNames[monthIndex]} ${year}`;
}
export function formatCurrency (amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR", // Using Indian Rupee symbol as per your input '₹'
    minimumFractionDigits: 2,
  }).format(amount);
};
export function isNumberKey(evt) {
  const charCode = (evt.which) ? evt.which : evt.keyCode;

  // Allow control keys (Backspace, Tab, Enter, Arrows, Delete, etc.)
  // Key codes 8, 9, 13, 37-40, 46, etc.
  if (charCode === 8 || charCode === 9 || charCode === 13 || charCode === 46 || (charCode >= 37 && charCode <= 40)) {
      return true;
  }
  
  // Allow numeric characters (48-57) from the main keyboard
  // Allow numeric characters (96-105) from the numeric keypad
  if ((charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105)) {
      return true;
  }

  // Prevent all other characters
  evt.preventDefault();
  return false;
}