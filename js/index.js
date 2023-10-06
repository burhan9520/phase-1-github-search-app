document.addEventListener('DOMContentLoaded', () => {
    const githubForm = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
  
    // Function to fetch user data based on username
    async function fetchUserData(username) {
      const url = `https://api.github.com/search/users?q=${username}`;
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        const data = await response.json();
        return data.items;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return [];
      }
    }
  
    // Function to fetch user repositories based on username
    async function fetchUserRepos(username) {
      const url = `https://api.github.com/users/${username}/repos`;
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching user repos:', error);
        return [];
      }
    }
  
    // Function to display user information
    function displayUser(user) {
      const userElement = document.createElement('li');
      userElement.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}" />
        <p><strong>${user.login}</strong></p>
        <a href="${user.html_url}" target="_blank">View Profile</a>
      `;
      userElement.addEventListener('click', async () => {
        const userRepos = await fetchUserRepos(user.login);
        displayUserRepos(userRepos);
      });
      userList.appendChild(userElement);
    }
  
    // Function to display user repositories
    function displayUserRepos(repos) {
      reposList.innerHTML = '';
  
      if (repos.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No repositories found for this user.';
        reposList.appendChild(message);
      } else {
        const repoList = document.createElement('ul');
        repos.forEach(repo => {
          const repoItem = document.createElement('li');
          repoItem.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            <p>${repo.description || 'No description available'}</p>
          `;
          repoList.appendChild(repoItem);
        });
        reposList.appendChild(repoList);
      }
    }
  
    // Event listener for the search form submission
    githubForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();
  
      if (searchTerm) {
        const users = await fetchUserData(searchTerm);
        userList.innerHTML = '';
  
        if (users.length === 0) {
          const message = document.createElement('p');
          message.textContent = 'No users found with that username.';
          userList.appendChild(message);
        } else {
          users.forEach(user => {
            displayUser(user);
          });
        }
      }
    });
  });
  