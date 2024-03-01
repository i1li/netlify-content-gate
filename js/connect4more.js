netlifyIdentity.on('login', (user) => {
  document.getElementById('username').value = user.user_metadata.full_name;
  document.getElementById('user-email').value = user.email;
  if (user) {
    user.jwt().then(token => {
        fetch('/.netlify/functions/vip-content', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.text())
        .then(htmlContent => {
            document.querySelector('.vip-container').innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Error:', error);
            document.querySelector('.vip-container').innerHTML = `<p>Error: ${error.message}</p>`;
        });
    });
}
});
netlifyIdentity.on('logout', () => {
document.getElementById('username').value = '';
document.getElementById('user-email').value = '';
document.querySelector('.vip-container').innerHTML = '';
});
document.addEventListener('DOMContentLoaded', () => {
const form = document.querySelector('form[name="access-request"]');
form.addEventListener('submit', (event) => {
    if (!document.getElementById('user-email').value) {
    event.preventDefault();
    alert('You must be logged in to submit the form.');
    }
});
});
