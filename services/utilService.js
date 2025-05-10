export const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) return dateTimeStr;
  
  const options = { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleString('en-US', options);
};