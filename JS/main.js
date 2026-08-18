// CIVIC REPORTING APP
// main.js//

// Mobile Menu Toggle

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

// Close menu when a link is clicked

const links = document.querySelectorAll(".nav-links a");

links.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});

// Smooth Scrolling

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if(target){

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});

// Navbar Shadow on Scroll

window.addEventListener("scroll", () => {

    const header = document.querySelector("header");

    if(window.scrollY > 50){

        header.style.boxShadow = "0 3px 15px rgba(0,0,0,.15)";

    }else{

        header.style.boxShadow = "none";

    }

});

// Welcome Message

console.log("Welcome to Civic Reporting App");