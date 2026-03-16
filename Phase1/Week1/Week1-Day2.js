////////////////////////////////
/////// WEEK 1 DAY 2 ///////////
////////////////////////////////

async function fetchUser(id) {
  try {
    const response = await fetch(`https://api.github.com/users/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(
      `I'm gracefully telling you that there was an error ${error.message}`
    );
    return null;
  }
}

async function fetchRepos(id) {
  try {
    const response = await fetch(`https://api.github.com/users/${id}/repos`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(
      `I'm gracefully telling you that there was an error ${error.message}`
    );
    return null;
  }
}

const [user, repos] = await Promise.all([
  fetchUser('XavierDM'),
  fetchRepos('XavierDM'),
]);
//const user = await fetchUser('XavierDM');
const followerText = user.followers === 1 ? 'loyal subject' : 'loyal subjects';
//console.log(repos[0]);
const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
console.log(
  `${user.name} has ${totalStars} total stars across ${repos.length} repos`
);
const date = new Date(user.created_at).toLocaleDateString('nl-BE');
console.log(
  `${user.name} has ${user.public_repos} repos with ${user.followers} ${followerText}. The account was created on ${date}`
);
