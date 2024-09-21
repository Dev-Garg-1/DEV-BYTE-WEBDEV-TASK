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


if(TOKEN) {
    hide('.content.unauthorized');
    show('.content.authorized');
    checkFollowing(TOKEN);
}