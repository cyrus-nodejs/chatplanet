// import { useState, useEffect } from 'react';

// const DarkModeToggle = () => {
//   const [darkMode, setDarkMode] = useState(false);

//   // Check for saved dark mode preference
//   useEffect(() => {
//     const savedMode = localStorage.getItem('darkMode') === 'true';
//     setDarkMode(savedMode);
//     if (savedMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, []);

//   // Toggle dark mode
//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     localStorage.setItem('darkMode', !darkMode);
//     if (!darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
//       <div className="flex justify-end p-4">
//         <button
//           onClick={toggleDarkMode}
//           className="p-2 bg-blue-500 text-white rounded"
//         >
//           {darkMode ? 'Light Mode' : 'Dark Mode'}
//         </button>
//       </div>

//       <h1 className="text-3xl text-center py-10">Welcome to Dark/Light Mode Toggle</h1>
//       {/* Rest of your content */}
//     </div>
//   );
// };

// export default DarkModeToggle;
