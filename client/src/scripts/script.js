(function() {
    setTimeout(() => {
        const classActive = 'nav-links-item-active'
        const navigationLinks = document.querySelectorAll('.link')
        navigationLinks[0].parentNode.classList.add(classActive)
        navigationLinks.forEach(item => {
            item.addEventListener('click', function() {
                document.querySelector(`.${classActive}`).classList.remove(classActive)
                this.parentNode.classList.add(classActive)
            })
        })
    }, 0)
    
})()