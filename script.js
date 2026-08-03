document.addEventListener("DOMContentLoaded", () => {
  // Target percentage for the orange bar (73%)
  const targetPercentage = 73;
  let remainingCopies = 25;

  const progressBar = document.getElementById("progress-bar");
  const copiesCount = document.getElementById("copies-count");

  const notificationToast = document.getElementById("notification-toast");
  const notificationUser = document.getElementById("notification-user");

  // Names list for pop-up notification
  const userNames = [
    "sarah_m", "alex_r", "mike_k", "emma_w",
    "david_l", "jessica_t", "daniel_p", "sophia_b", "chris_h",
    "amanda_c", "james_o", "olivia_s", "ethan_v", "rachel_f"
  ];

  // Function to show top drop notification
  function showNotification() {
    if (!notificationToast || !notificationUser) return;

    // Select random username
    const randomName = userNames[Math.floor(Math.random() * userNames.length)];
    notificationUser.innerText = `@${randomName} just unlocked the ebook`;

    // Drop down notification
    notificationToast.classList.add("show");

    // Retract up after 3 seconds
    setTimeout(() => {
      notificationToast.classList.remove("show");
    }, 3000);
  }

  // Start notification loop every 5 seconds
  setTimeout(() => {
    showNotification();
    setInterval(showNotification, 8000);
  }, 1000);

  // Animate the orange progress bar fill to 73% on load
  setTimeout(() => {
    if (progressBar) {
      progressBar.style.width = `${targetPercentage}%`;
    }
  }, 200);

  // Dynamic copy count decrease timer
  setInterval(() => {
    if (remainingCopies > 3 && Math.random() < 0.2) {
      remainingCopies--;
      if (copiesCount) {
        copiesCount.innerText = `${remainingCopies} COPIES`;
      }
    }
  }, 12000);
});