document.addEventListener("turbolinks:load", function() { 
    $('a.dropdown-toggle').on("click", function(e){
        $(this).next("ul").toggle()
        e.stopPropagation()
        e.preventDefault()
    })
})