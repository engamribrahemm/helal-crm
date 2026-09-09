window.HELAL_CRM_USERS = [
  { username: "amr", passHash: "ba1dce0f8b928f25ce97897161b0a488c328a999a69556863ba53ab1ed0ecd4f" },
  { username: "admin", passHash: "e0d9a9e13a69f26b6cecb9dd447a2c026a45320ad27b80e78369ae8ab5f20636" },
  { username: "helal", passHash: "779120a62c11040c7cd384f46e8ffd51c13912e31eb1e6d09640a402af7261b1" },
  { username: "sales", passHash: "6ff7709efe8e9be20a86ebdef8ce967a38ebd51cede90d2d2740403c69c8b607" }
];

window.HelalAuth = {
  sessionKey: "helal-crm-session",

  sha256: async function (text) {
    var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(function (b) {
      return b.toString(16).padStart(2, "0");
    }).join("");
  },

  isLoggedIn: function () {
    try {
      return sessionStorage.getItem(this.sessionKey) === "ok" ||
        localStorage.getItem(this.sessionKey) === "ok";
    } catch (e) {
      return false;
    }
  },

  signIn: async function (username, password, remember) {
    var name = String(username || "").trim().toLowerCase();
    var pass = String(password || "");
    var hash = await this.sha256(pass);
    var match = (window.HELAL_CRM_USERS || []).some(function (user) {
      return user.username.toLowerCase() === name && user.passHash === hash;
    });
    if (!match) return false;
    try {
      sessionStorage.setItem(this.sessionKey, "ok");
      if (remember) localStorage.setItem(this.sessionKey, "ok");
      else localStorage.removeItem(this.sessionKey);
    } catch (e) {}
    return true;
  },

  signOut: function () {
    try {
      sessionStorage.removeItem(this.sessionKey);
      localStorage.removeItem(this.sessionKey);
    } catch (e) {}
    location.replace("./index.html");
  }
};
