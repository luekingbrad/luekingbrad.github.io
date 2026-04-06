const username = "YOUR_GITHUB_USERNAME";
const repoContainer = document.getElementById("repo-container");

fetch(`https://api.github.com/users/${username}/repos`)
  .then(response => response.json())
  .then(data => {
    data.forEach(repo => {
      const repoCard = document.createElement("div");
      repoCard.classList.add("repo-card");

      repoCard.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "No description available."}</p>
        <a href="${repo.html_url}" target="_blank">View on GitHub</a>
      `;

      repoContainer.appendChild(repoCard);
    });
  })
  .catch(error => {
    repoContainer.innerHTML = "<p>Error loading repositories.</p>";
    console.error(error);
  });