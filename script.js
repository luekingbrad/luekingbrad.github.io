const username = "luekingbrad";

const featuredRepos = [
  "AI-Assisted SOC Analyst",
  "Phishnet",
  "Personal-AI-Assistant",
  "Cat-Dog-Image-Classification-CNN",
  "Handwritten-Digit-Classification",
  "Malware-Family-Clustering-UsingKMeans",
  "AI-LSTM-Web-Log-Anomaly-Detection",
  "Spam-Detection-Using-Unsupervised-Machine-Learning",
  "LSTM-SMS-Spam-Detection"
];

const repoContainer = document.getElementById("repo-container");

fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  })
  .then(repositories => {

    const selectedRepositories = repositories.filter(repo =>
      featuredRepos.some(featuredName =>
        repo.name.toLowerCase() === featuredName.toLowerCase()
      )
    );

    repoContainer.innerHTML = "";

    if (selectedRepositories.length === 0) {
      repoContainer.innerHTML = `
        <p>No featured projects were found.</p>
      `;
      return;
    }

    selectedRepositories.forEach(repo => {

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
  })
  .catch(error => {

    console.error("Error loading GitHub repositories:", error);

    repoContainer.innerHTML = `
      <p>
        Unable to load projects from GitHub.
        Please visit my GitHub profile for the complete repository list.
      </p>
    `;
  });
