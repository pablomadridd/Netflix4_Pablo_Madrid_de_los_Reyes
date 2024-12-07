import interact from 'interactjs';

// Configurar elementos arrastrables
const setupDraggableItems = () => {
  interact('.movie').draggable({
    listeners: {
      start(event) {
        console.log('Drag Start:', event.target);
        event.target.style.opacity = '0.8';
        event.target.style.transform = 'scale(1.1)';
      },
      move(event) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },
      end(event) {
        console.log('Drag End:', event.target);
        event.target.style.opacity = '1';
        event.target.style.transform = 'scale(1)';
      },
    },
  });
};

// Configurar las zonas donde se puede soltar
const setupDropzone = () => {
  interact('#main').dropzone({
    accept: '.movie',
    overlap: 0.5,
    ondropactivate(event) {
      console.log('Dropzone Activated');
      event.target.style.backgroundColor = '#ffcccc'; // Cambia color cuando está activo
    },
    ondropdeactivate(event) {
      console.log('Dropzone Deactivated');
      event.target.style.backgroundColor = ''; // Restaura el color
    },
    ondrop(event) {
      const droppedItem = event.relatedTarget;
      const dropTarget = event.target;

      console.log('Item Dropped:', droppedItem);

      dropTarget.appendChild(droppedItem);
      updateMovieOrder();
    },
  });
};

// Función para actualizar el orden en localStorage
const updateMovieOrder = () => {
  const movies = Array.from(document.querySelectorAll('.movie')).map((movie, index) => ({
    id: movie.getAttribute('data-my-id'),
    title: movie.querySelector('.title').textContent,
    order: index,
  }));

  localStorage.setItem('movies', JSON.stringify(movies));
  console.log('Nuevo orden guardado:', movies);
};

// Inicializa Drag and Drop al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  setupDraggableItems();
  setupDropzone();
});
