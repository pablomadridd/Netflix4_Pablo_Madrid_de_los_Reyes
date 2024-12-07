import interact from 'interactjs';

// Configuración de elementos arrastrables (draggables)
const setupDraggableItems = () => {
    interact('.draggable-item').draggable({
        listeners: {
            move(event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                // Mueve el elemento visualmente
                target.style.transform = `translate(${x}px, ${y}px)`;

                // Almacena las coordenadas en atributos del elemento
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            },
        },
        inertia: true, // Suaviza el movimiento
    });
};

// Configuración de la zona de soltado (dropzone)
const setupDropzone = () => {
    interact('#favorite-list').dropzone({
        accept: '.draggable-item', // Acepta solo elementos con esta clase
        overlap: 0.5, // Elemento debe estar al 50% dentro del contenedor
        ondrop(event) {
            console.log('Dropped:', event.relatedTarget);
        },
    });
};

// Carga las películas favoritas desde el localStorage
export const loadFavoriteMovies = () => {
    const favoriteList = document.getElementById('favorite-list');
    const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');

    favoriteList.innerHTML = ''; // Limpia la lista antes de cargar
    favoriteMovies.forEach((movie, index) => {
        const li = document.createElement('li');
        li.innerText = movie.title || `Movie ${index + 1}`;
        li.id = `movie-${index}`;
        li.classList.add('draggable-item'); // Añade la clase necesaria para interact.js
        favoriteList.appendChild(li);
    });

    // Configura *drag and drop* nuevamente después de cargar los elementos
    setupDraggableItems();
    setupDropzone();
};

// Inicializa las configuraciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    setupDraggableItems();
    setupDropzone();
});
