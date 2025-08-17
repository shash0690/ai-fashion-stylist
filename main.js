document.getElementById('generateBtn').addEventListener('click', () => {
    const input = document.getElementById('userInput').value;
    if (!input) {
        alert('Please enter a style preference');
        return;
    }

    document.getElementById('result').innerText = `Fetching AI suggestions for: ${input} ...`;

    // Later we will replace this with API call
    setTimeout(() => {
        document.getElementById('result').innerText = `✨ Suggested outfit for "${input}": White shirt with blue jeans`;
    }, 1500);
});
