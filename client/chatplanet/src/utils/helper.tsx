 
     export  const convertTimestampToTime = (timestamp:string) => {
        const date = new Date(timestamp);
        const hours = String(date.getHours()).padStart(2, '0'); // Ensures 2 digits
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensures 2 digits
        const seconds = String(date.getSeconds()).padStart(2, '0'); // Ensures 2 digits
        return `${hours}:${minutes}:${seconds}`;
      };



       
     export  const convertTimestampDate = (timestamp:string) => {
        const date = new Date(timestamp);

        // Get the formatted date in YYYY-MM-DD format
        const formattedDate = date?.toISOString().split('T')[0]; // "2025-02-17"
        
        // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const dayOfWeek = date?.toLocaleString('en-US', { weekday: 'long' }); // "Monday"

        return `${dayOfWeek}, ${formattedDate}`;
      };


      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      export const capitalizeFirstLetter = (word:any) => {
        return word?.charAt(0).toUpperCase() + word?.slice(1);
      }
      