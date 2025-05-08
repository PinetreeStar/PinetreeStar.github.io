function openModal(string){document.getElementById(string).style.display = "block"}

function closeModal(string){document.getElementById(string).style.display = "none"}

window.onclick = function(event) {
    document.querySelectorAll(".modal").forEach(function(modal) {
        if (event.target == modal){
            modal.style.display = "none";
        }
    })
}