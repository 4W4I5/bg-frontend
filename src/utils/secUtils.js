export const logUserInfo = async () => {
  const userInfo = {
    user_agent: "",
    user_language: "",
    location_lat: null,
    location_long: null,
    ip_address: "",
  };

  // Log User Agent
  userInfo.user_agent = navigator.userAgent;

  // Log Language
  userInfo.user_language = navigator.language || navigator.userLanguage;

  // Log Geolocation
  if (navigator.geolocation) {
    await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userInfo.location_lat = position.coords.latitude;
          userInfo.location_long = position.coords.longitude;
          resolve();
        },
        (error) => {
          console.error("Error obtaining geolocation:", error);
          resolve();
        }
      );
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

  // Log IP Address
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    userInfo.ip_address = data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
  }
  // userInfo.ip_address = ""

  // console.log("Network Info:", JSON.stringify(userInfo, null, 2));

  return userInfo
};
