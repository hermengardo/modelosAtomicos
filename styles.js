document.addEventListener("DOMContentLoaded", function () {
    const Heading = document.getElementById("model-title");
    Heading.style.animation = "text-fade 0.75s ease-in";
});

document.addEventListener("keydown", function(event) {
    const Heading = document.getElementById("name");
    Heading.style.animation = "none";
    if (event.keyCode === 13 || event.key === "ArrowRight") {
        Heading.style.animation = "text-fade 0.75s ease-in";
        Heading.textContent = "Thomson";
    }
});