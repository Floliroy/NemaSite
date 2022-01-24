document.addEventListener('turbolinks:load', function() {
    const dropdown_buttons = document.querySelectorAll('[data-bs-toggle="dropdown"]')

    dropdown_buttons.forEach(function(element) {
        element.addEventListener('click', function(event) {
            event.preventDefault()
            $(this).toggle()
        })
    })
})