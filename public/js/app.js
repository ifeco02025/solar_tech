document.addEventListener("DOMContentLoaded", () => {



  /* =========================
     SWIPER INIT
  ========================= */
/* =========================
   HERO SWIPER
========================= */
  console.log("Swiper =", typeof Swiper);
  
new Swiper(".mySwiper", {
  loop: true,

  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});


  /* =========================
     DARK MODE TOGGLE
  ========================= */
  const darkToggle = document.getElementById("darkModeToggle");

  if (darkToggle) {
    const darkIcon = darkToggle.querySelector("i");

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      darkIcon.classList.remove("fa-moon");
      darkIcon.classList.add("fa-sun");
    }

    darkToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      const isDark = document.body.classList.contains("dark-mode");

      if (isDark) {
        darkIcon.classList.remove("fa-moon");
        darkIcon.classList.add("fa-sun");
        localStorage.setItem("theme", "dark");
      } else {
        darkIcon.classList.remove("fa-sun");
        darkIcon.classList.add("fa-moon");
        localStorage.setItem("theme", "light");
      }
    });
  }

    /* =========================
     MOBILE MENU
  ========================= */
  const menuToggle = document.getElementById("menuToggle");
  const navbar = document.getElementById("navbar");

  if (menuToggle && navbar) {

    menuToggle.addEventListener("click", () => {

      navbar.classList.toggle("active");

      const icon = menuToggle.querySelector("i");

      if (navbar.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
      } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }

    });

    // Close menu when link clicked
    document.querySelectorAll(".nav-links a").forEach(link => {

      link.addEventListener("click", () => {

        navbar.classList.remove("active");

        const icon = menuToggle.querySelector("i");
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

      });

    });

  }

});