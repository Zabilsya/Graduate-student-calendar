let URLs = {};

if (process.env.NODE_ENV === "production") {
  URLs = {
    baseURL: "/api",
    socketURL: "https://thoughtwall.herokuapp.com/api",
  };
} else {
  URLs = {
    baseURL: "/api",
    socketURL: "/api",
  };
}

export default URLs;