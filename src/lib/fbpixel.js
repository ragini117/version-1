export const pageview = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
};

// 🔹 Signup / Registration
export const completeRegistration = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "CompleteRegistration");
  }
};

// 🔹 Platform usage / Lead
export const lead = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead");
  }
};

// 🔹 Paid plan / Purchase
export const purchase = (value) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", {
      value: value,
      currency: "INR",
    });
  }
};
