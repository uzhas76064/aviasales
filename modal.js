const modal = document.getElementById('modal'),
    closeButton = modal.querySelector('.modal__close');

closeButton.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'none';
});