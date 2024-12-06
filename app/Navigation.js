
/**
 * Navigation.js
 * Este archivo gestiona la navegación entre las secciones de la aplicación.
 */

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');

    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            sections.forEach(section => {
                section.style.display = section.id === targetId ? 'block' : 'none';
            });

            if (targetId === 'movies') {
                // Inicializa la vista principal de Movies
                indexContr();
            }
        });
    });

    // Inicialización: Mostrar solo la primera sección
    sections.forEach((section, index) => {
        section.style.display = index === 0 ? 'block' : 'none';
    });
});