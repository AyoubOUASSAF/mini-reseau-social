document.getElementById("menu-toggle").addEventListener("click", () => {
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector("main");

    // Toggle the collapsed class on the sidebar
    sidebar.classList.toggle("collapsed");

    // Adjust the main content margin dynamically
    if (sidebar.classList.contains("collapsed")) {
        mainContent.style.marginLeft = "80px";
    } else {
        mainContent.style.marginLeft = "220px";
    }
});