const URL_PARAMS = new URLSearchParams(window.location.search);
const TOKEN = URL_PARAMS.get('token');

//show an element 
const show = (selector) => {
    document.querySelector(selector).style.display = 'block';
};

//hide an element
const hide = (selector) => {
    document.querySelector(selector).style.display = 'none';
};

const checkFollowing = async (token) => {
    try {
        const response = await fetch(`/check-following?token=${token}`);
        const message = await response.text();
        document.querySelector('.result').innerText = message; // Display the message in a designated element
    } catch (error) {
        console.error('Error checking following status:', error);
        document.querySelector('.result').innerText = 'An error occurred while checking the following status.';
    }
};


if (TOKEN) {
    hide('.content.unauthorized');
    show('.content.authorized');
    checkFollowing(TOKEN);
} else {
    // Handle the OAuth flow by checking the code
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
        // Fetch the token from your backend
        fetch(`/oauth-callback?code=${code}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.token) {
                    hide('.content.unauthorized');
                    show('.content.authorized');
                    checkFollowing(data.token);
                } else {
                    console.error('No token received');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}