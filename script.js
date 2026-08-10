const username = "luekingbrad";

const featuredRepos = [
  "AI-Assisted SOC Analyst",
  "Phishnet",
  "Personal-AI-Assistant",
  "AI-LSTM-Web-Log-Anomaly-Detection",
  "Cat-Dog-Image-Classification-CNN",
  "Handwritten-Digit-Classification",
  "Malware-Family-Clustering-UsingKMeans",
  "Spam-Detection-Using-Unsupervised-Machine-Learning",
  "LSTM-SMS-Spam-Detection"
];

const repoContainer = document.getElementById("repo-container");

async function loadRepositories() {
  try {
    repoContainer.innerHTML = "<p>Loading projects...</p>";

    const repositories = await Promise.all(
      featuredRepos.map(async (repoName) => {
        const response = await fetch(
          `https://api.github.com/repos/${username}/${encodeURIComponent(repoName)}`
        );

        if (!response.ok) {
          throw new Error(`Unable to load repository: ${repoName}`);
        }

        return response.json();
      })
    );

    repoContainer.innerHTML = "";

    repositories.forEach((repo) => {
      const repoCard = document.createElement("div");
      repoCard.classList.add("repo-card");

      repoCard.innerHTML = `
        <h3>${repo.name}</h3>

        <p>
          ${repo.description || "No description available."}
        </p>

        <a 
          href="${repo.html_url}" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          View on GitHub →
        </a>
      `;

      repoContainer.appendChild(repoCard);
    });

  } catch (error) {
    console.error("Error loading GitHub repositories:", error);

    repoContainer.innerHTML = `
      <p>
        Unable to load projects from GitHub.
        Please visit my GitHub profile for the complete repository list.
      </p>
    `;
  }
}

loadRepositories();
