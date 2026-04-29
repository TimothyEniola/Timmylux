export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  const safeUser = {
    name: user.name || "Guest User",
    email: user.email || "guest@example.com",
    profileImage: user.profileImage || null,
  };
  localStorage.setItem("currentUser", JSON.stringify(safeUser));
  if (safeUser.profileImage) {
    localStorage.setItem("userProfileImage", safeUser.profileImage);
  }
  window.dispatchEvent(new Event("userDataChanged"));
}

export function clearCurrentUser() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("userProfileImage");
  window.dispatchEvent(new Event("userDataChanged"));
}

export function getDisplayNameFromEmail(email) {
  if (!email) return "Guest User";
  const namePart = email.split("@")[0] || "Guest";
  return namePart
    .split(/[._-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
