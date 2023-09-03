document.addEventListener("keydown", function(event) {
    const Heading = document.getElementById("name");
    if (event.keyCode === 13) {
        // Start the CSS animation
        Heading.style.animation = "none"; // Reset the animation
        void Heading.offsetWidth; // Trigger a reflow
        Heading.style.animation = "text-fade 1s ease-in-out"; // Start the animation

        // After a short delay (e.g., 500 milliseconds), update the text content
        setTimeout(function() {
            Heading.textContent = "Rutherford";
        }, 500); // Adjust the delay as needed
    }
});