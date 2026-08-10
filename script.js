// GitHub Projects
// Dynamically loads project information from GitHub repositories.

// ============================================================
// GitHub Configuration
// ============================================================

const GITHUB_USERNAME = "luekingbrad";

// Project order is intentionally curated to emphasize
// cybersecurity first, followed by AI/ML and foundational work.

const PROJECT_ORDER = [
    "AI-Assisted SOC Analyst",
    "Phishnet",
    "Personal-AI-Assistant",
    "AI-LSTM-Web-Log-Anomaly-Detection",
    "Malware-Family-Clustering-Using-KMeans",
    "Cat-Dog-Image-Classification-CNN",
    "LSTM-SMS-Spam-Detection",
    "Spam-Detection-Using-Unsupervised-Machine-Learning",
    "Handwritten-Digit-Classification"
];


// ============================================================
// Project Descriptions
// ============================================================

const PROJECT_DESCRIPTIONS = {

    "AI-Assisted SOC Analyst": {
        description:
            "A cybersecurity lab combining Wazuh SIEM, Python, and a locally hosted Llama 3.1:8b model through Ollama to automate security alert analysis, prioritize events, map activity to MITRE ATT&CK, and support SOC investigation workflows.",
        technologies:
            "Wazuh, Python, Ollama, Llama 3.1:8b, MITRE ATT&CK, JSON, Ubuntu"
    },

    "Phishnet": {
        description:
            "A Python-based phishing analysis tool that evaluates suspicious URLs using keyword detection, Shannon entropy, URL length, WHOIS domain age, and weighted risk scoring to classify URLs as Low, Medium, or High risk.",
        technologies:
            "Python, WHOIS, Shannon Entropy, URL Analysis, Risk Scoring, CSV"
    },

    "Personal-AI-Assistant": {
        description:
            "A lightweight AI assistant built with Python and Streamlit that integrates with the OpenAI API and maintains local conversation history using JSON-based memory.",
        technologies:
            "Python, Streamlit, OpenAI API, GPT-4.1 Mini, JSON"
    },

    "AI-LSTM-Web-Log-Anomaly-Detection": {
        description:
            "A deep learning cybersecurity project using an LSTM neural network to analyze sequential web-log activity, measure prediction error, establish statistical detection thresholds, and identify potentially anomalous events.",
        technologies:
            "Python, TensorFlow, Keras, LSTM, Web Logs, Anomaly Detection"
    },

    "Malware-Family-Clustering-Using-KMeans": {
        description:
            "A cybersecurity machine learning project using K-Means clustering to identify patterns among malware samples based on characteristics extracted from Portable Executable files.",
        technologies:
            "Python, Pandas, NumPy, scikit-learn, K-Means, PE Analysis"
    },

    "Cat-Dog-Image-Classification-CNN": {
        description:
            "A deep learning project using TensorFlow, Keras, and a Convolutional Neural Network to perform binary image classification of cats and dogs.",
        technologies:
            "Python, TensorFlow, Keras, CNN, Image Processing, Deep Learning"
    },

    "LSTM-SMS-Spam-Detection": {
        description:
            "A deep learning NLP project using an LSTM neural network to classify SMS messages as spam or legitimate through text cleaning, tokenization, sequence padding, and supervised learning.",
        technologies:
            "Python, TensorFlow, Keras, LSTM, NLP, Tokenization"
    },

    "Spam-Detection-Using-Unsupervised-Machine-Learning": {
        description:
            "A machine learning project applying K-Means clustering to identify patterns in spam and legitimate email messages using text vectorization and unsupervised learning.",
        technologies:
            "Python, scikit-learn, CountVectorizer, K-Means, NLP, Machine Learning"
    },

    "Handwritten-Digit-Classification": {
        description:
            "A supervised machine learning project using scikit-learn Logistic Regression to classify handwritten digits from the built-in handwritten digits dataset.",
        technologies:
            "Python, scikit-learn, Logistic Regression, Matplotlib, Machine Learning"
    }

};


// ============================================================
// GitHub API
// ============================================================

async function fetchGitHubProjects() {

    const response = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
    );

    if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`);
    }

    return await response.json();
}


// ============================================================
// Utility Functions
// ============================================================

function normalizeRepositoryName(name) {
    return name
        .toLowerCase()
        .replace(/[_\s]+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}


function findRepository(repositories, projectName) {

    const target = normalizeRepositoryName(projectName);

    return repositories.find(repo => {

        const repoName = normalizeRepositoryName(repo.name);

        return repoName === target;

    });
}


function createProjectCard(repository, projectNumber) {

    const projectInfo =
        PROJECT_DESCRIPTIONS[repository.name] ||
        PROJECT_DESCRIPTIONS[
            PROJECT_ORDER.find(
                project => normalizeRepositoryName(project) === normalizeRepositoryName(repository.name)
            )
        ];

    const card = document.createElement("article");

    card.className = "project-card";

    const description =
        projectInfo?.description ||
        repository.description ||
        "Cybersecurity and technical portfolio project.";

    const technologies =
        projectInfo?.technologies ||
        "Python, Cybersecurity, Machine Learning";


    card.innerHTML = `
        <div class="project-number">
            Project ${projectNumber}
        </div>

        <h3>${escapeHTML(repository.name)}</h3>

        <p class="project-description">
            ${escapeHTML(description)}
        </p>

        <p class="project-technologies">
            <strong>Technologies:</strong>
            ${escapeHTML(technologies)}
        </p>

        <div class="project-links">

            <a
                href="${repository.html_url}"
                target="_blank"
                rel="noopener noreferrer"
                class="project-link"
            >
                View on GitHub
            </a>

        </div>
    `;

    return card;
}


function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ============================================================
// Display Projects
// ============================================================

async function loadProjects() {

    const projectsContainer =
        document.getElementById("projects");

    if (!projectsContainer) {
        console.error(
            'Could not find an element with id="projects".'
        );
        return;
    }

    try {

        const repositories = await fetchGitHubProjects();

        projectsContainer.innerHTML = "";

        let displayedProjects = 0;

        PROJECT_ORDER.forEach((projectName) => {

            const repository =
                findRepository(repositories, projectName);

            if (!repository) {
                console.warn(
                    `GitHub repository not found: ${projectName}`
                );
                return;
            }

            displayedProjects++;

            const card =
                createProjectCard(
                    repository,
                    displayedProjects
                );

            projectsContainer.appendChild(card);

        });


        // If none of the expected repositories were found,
        // show the fallback message.

        if (displayedProjects === 0) {

            projectsContainer.innerHTML = `
                <p class="projects-error">
                    Unable to load projects from GitHub.
                    Please visit my
                    <a
                        href="https://github.com/${GITHUB_USERNAME}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub profile
                    </a>
                    for the complete repository list.
                </p>
            `;

        }

    } catch (error) {

        console.error(
            "Error loading GitHub projects:",
            error
        );

        projectsContainer.innerHTML = `
            <p class="projects-error">
                Unable to load projects from GitHub.
                Please visit my
                <a
                    href="https://github.com/${GITHUB_USERNAME}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub profile
                </a>
                for the complete repository list.
            </p>
        `;

    }

}


// ============================================================
// Mobile Navigation
// ============================================================

function setupMobileNavigation() {

    const menuButton =
        document.getElementById("menu-toggle");

    const navigation =
        document.getElementById("nav-menu");

    if (!menuButton || !navigation) {
        return;
    }

    menuButton.addEventListener("click", () => {

        navigation.classList.toggle("active");

    });

}


// ============================================================
// Initialize Website
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    loadProjects();

    setupMobileNavigation();

});
