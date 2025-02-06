document.getElementById('y')?.addEventListener('click', (event) => {
    event.preventDefault()
    chrome.runtime.openOptionsPage()
})

document.getElementById('n')?.addEventListener('click', (event) => {
    event.preventDefault()
    window.close()
})
