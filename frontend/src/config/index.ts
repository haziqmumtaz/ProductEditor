console.log(import.meta.env.VITE_API_URL);
const config = {
  BaseApiUrl: import.meta.env.VITE_API_URL || "http://localhost:3001",
};

export default config;
