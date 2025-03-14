document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.querySelector(".toggle-mode");
    const projectList = document.getElementById("project-list");
    const skillsList = document.getElementById("skills-list");
    const contactForm = document.getElementById("contact-form");

    // Apply saved dark mode preference
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        toggleBtn.textContent = "☀️";
        updateSkillsTextColor("dark");
    }

    // Toggle Dark Mode
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            toggleBtn.textContent = "☀️";
            updateSkillsTextColor("dark");
        } else {
            localStorage.setItem("theme", "light");
            toggleBtn.textContent = "🌙";
            updateSkillsTextColor("light");
        }
    });

    // Fetch Projects from Backend
    fetch("/projects")
        .then(response => response.json())
        .then(data => {
            projectList.innerHTML = data.map(project => `
                <div class="col-md-4">
                    <div class="card shadow-lg">
                        <img src="${project.image_url}" class="card-img-top" alt="${project.title}">
                        <div class="card-body">
                            <h5 class="card-title">${project.title}</h5>
                            <p class="card-text">${project.description}</p>
                            <a href="${project.project_link}" class="btn btn-primary" target="_blank">View Project</a>
                        </div>
                    </div>
                </div>
            `).join("");
        });

    // Fetch Skills from Backend
    fetch("/skills")
    .then(response => response.json())
    .then(data => {
        const skillsContainer = document.getElementById("skills-list");
        skillsContainer.innerHTML = data.map(skill => `
            <div class="col-md-3 col-sm-6 mb-3">
                <div class="skill-box p-3 shadow-sm text-center">
                    <i class="bi bi-check-circle-fill text-success"></i>
                    <strong class="skill-text">${skill.skill_name}</strong> 
                    <strong class="skill-category">${skill.category}</strong> 
                    <span class="badge bg-primary">${skill.level}</span>
                </div>
            </div>
        `).join("");
        updateSkillsTextColor(document.body.classList.contains("dark-mode") ? "dark" : "light");
    })
    .catch(error => console.error("Error fetching skills:", error));

    // 📌 Function to Update Skills Text Color in Dark Mode
    function updateSkillsTextColor(mode) {
        const skillTexts = document.querySelectorAll(".skill-text, .skill-category");
        if (mode === "dark") {
            skillTexts.forEach(text => text.classList.add("text-light"));
        } else {
            skillTexts.forEach(text => text.classList.remove("text-light"));
        }
    }

    // 📌 Contact Form Submission Handler
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Get form data
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        // Validate input
        if (!name || !email || !message) {
            alert("All fields are required.");
            return;
        }

        // Send data to backend
        try {
            const response = await fetch("/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Message sent successfully!");
                contactForm.reset();
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message. Please try again.");
        }
    });
});

// 📌 Function to Close Video Box
function closeVideoBox() {
    let videoBox = document.getElementById("videoBox");
    let iframe = videoBox.querySelector("iframe");

    // Hide the video box
    videoBox.style.display = "none";

    // Stop the video by resetting the src
    iframe.src = iframe.src;
}

// 📌 Function to Toggle Mobile Menu
function toggleMobileMenu() {
    var navbar = document.getElementById("navbarNav");
    navbar.classList.toggle("show");
}
