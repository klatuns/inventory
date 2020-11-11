function openNav() {
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
    burger.addEventListener("click", () => {
        console.log("clickeddddd");
        nav.classList.toggle("nav-active");
    });
}
openNav();