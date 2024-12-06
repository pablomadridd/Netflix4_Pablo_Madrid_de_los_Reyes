// Datos iniciales

let initial_movies = [];


localStorage.my_movies = localStorage.my_movies || JSON.stringify(initial_movies);

const apiKey = '1cd433a5a1670216a3daa0882ca24975';

const indexView = (movies) => {
    let i = 0;
    let view = "";

    while (i < movies.length) {
        view += `
            <div class="movie">
                <div class="movie-img">
                    <img data-my-id="${i}" src="${movies[i].thumbnail}" onerror="this.src='files/noimage.png'"/>
                </div>
                <div class="title">
                    ${movies[i].title || "<em>No title</em>"}
                </div>
                <div class="actions">
                    <button class="edit" data-my-id="${i}">Edit</button>
                    <button class="show" data-my-id="${i}">View</button>
                    <button class="delete" data-my-id="${i}">Delete</button>
                </div>
            </div>\n`;
        i++;
    }

    view += `<div class="actions">
                <button class="new">Add Movie</button>
                <button class="reset">Reset</button>
                <button class="search-view">Search Movies</button>
                <button class="my-keywords">My Keywords</button>
             </div>`;
    

    

    return view;
};


const editView = (i, movie) => {
    return `<h2>Edit Movie </h2>
        <div class="field">
        Title <br>
        <input  type="text" id="title" placeholder="Title" 
                value="${movie.title}">
        </div>
        <div class="field">
        Director <br>
        <input  type="text" id="director" placeholder="Director" 
                value="${movie.director}">
        </div>
        <div class="field">
        Thumbnail <br>
        <input  type="text" id="thumbnail" placeholder="Thumbnail URL" 
                value="${movie.thumbnail}">
        </div>
        <div class="actions">
            <button class="update" data-my-id="${i}">
                Update
            </button>
            <button class="index">
                Back
            </button>
       `;
}


const showView = (movie) => {
    return `
        <h2 style="color: var(--primary); font-size: 24px; margin-bottom: 10px; text-align: left;">${movie.title}</h2>
        <div style="margin-bottom: 15px; text-align: left;">
            <strong>Director:</strong> ${movie.director || "<em>No director</em>"}
        </div>
        <div class="movie-img" style="max-width: 300px;">
            <img src="${movie.thumbnail}" onerror="this.src='files/noimage.png'" alt="${movie.title}" style="width: 100%; height: auto; border-radius: 5px;">
        </div>
        <div class="actions" style="margin-top: 15px;">
            <button class="index">Back</button>
        </div>
    `;
};


const newView = () => {
    return `
        <h2>Create Movie</h2>
        <div class="field">
            Title <br>
            <input type="text" id="title" placeholder="Title">
        </div>
        <div class="field">
            Director <br>
            <input type="text" id="director" placeholder="Director">
        </div>
        <div class="field">
            Thumbnail <br>
            <input type="text" id="thumbnail" placeholder="Thumbnail URL">
        </div>
        <div class="actions">
            <button class="create">Save</button>  <!-- Cambiado de Create a Save -->
            <button class="index">Back</button>
        </div>
    `;
};

const keywordsView = (movieId) => {
    const apiKey = '1cd433a5a1670216a3daa0882ca24975';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    };

    fetch(`https://api.themoviedb.org/3/movie/${movieId}/keywords?api_key=${apiKey}`, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const keywords = processKeywords(data.keywords);
            
            let view = `
                <h2>Keywords for Movie</h2>
                <ul style="list-style: none; padding: 0;">
            `;
            keywords.forEach(keyword => {
                view += `
                    <li style="margin-bottom: 10px;">
                        ${keyword} 
                        <button class="add-keyword" data-keyword="${keyword}">Add to my list</button>
                    </li>
                `;
            });
            view += `</ul>
                <button class="index">Back</button>
            `;
            document.getElementById('main').innerHTML = view;
        })
        .catch(err => {
            console.error('Error fetching keywords:', err);
            alert("An error occurred while fetching keywords. Please try again later.");
        });
};




const processKeywords = (keywords) => {
    const cleanedKeywords = keywords
        .map(keywordObj => keywordObj.name)
        .filter(name => !!name) 
        .map(name => cleanKeyword(name)); 

    return [...new Set(cleanedKeywords)]; 
};

const cleanKeyword = (keyword) => {
    return keyword
        .replace(/[^a-zñáéíóú0-9 ]+/igm, "")  
        .trim()                               
        .toLowerCase();               
};

const myKeywordsView = () => {
    let customKeywords = JSON.parse(localStorage.customKeywords || "[]");

    let view = `
        <h2>My Keywords</h2>
        <ul style="list-style: none; padding: 0;">
    `;
    customKeywords.forEach(keyword => {
        view += `
            <li style="margin-bottom: 10px;">
                ${keyword}
                <button class="remove-keyword" data-keyword="${keyword}" style="margin-left: 10px;">Remove</button>
            </li>
        `;
    });
    view += `</ul>
        <button class="index">Back</button>
    `;

    document.getElementById('main').innerHTML = view;
};

const removeKeywordFromList = (keyword) => {
    let customKeywords = JSON.parse(localStorage.customKeywords || "[]");
    customKeywords = customKeywords.filter(k => k !== keyword); 
    localStorage.customKeywords = JSON.stringify(customKeywords); 
    alert(`Keyword "${keyword}" removed from your list.`);
    myKeywordsView(); 
};








// CONTROLLERS 
const indexContr = () => {
 let my_movies = JSON.parse(localStorage.my_movies);
 document.getElementById('main').innerHTML = indexView(my_movies);
 };


 const showContr = (i) => {
    let movie = JSON.parse(localStorage.my_movies)[i];
    document.getElementById('main').innerHTML = showView(movie);
};

const newContr = () => {
    document.getElementById('main').innerHTML = newView();
};

const createContr = () => {
    const title = document.getElementById('title').value.trim();
    const director = document.getElementById('director').value.trim();
    let thumbnail = document.getElementById('thumbnail').value.trim();

    
    if (!thumbnail.startsWith("http")) {
        thumbnail = `files/${thumbnail.replace(/^files\//, '')}`;
    }

    if (!title || !director || !thumbnail) {
        alert("Please fill all fields correctly.");
        return;
    }

    const newMovie = { title, director, thumbnail };
    let my_movies = JSON.parse(localStorage.my_movies);
    my_movies.push(newMovie);
    localStorage.my_movies = JSON.stringify(my_movies);
    indexContr();
};

const editContr = (i) => {
    let movie = JSON.parse(localStorage.my_movies)[i];
    document.getElementById('main').innerHTML = editView(i, movie);
};


const updateContr = (i) => {
    let my_movies = JSON.parse(localStorage.my_movies);
    const title = document.getElementById('title').value.trim();
    const director = document.getElementById('director').value.trim();
    let thumbnail = document.getElementById('thumbnail').value.trim();

    
    if (!thumbnail.startsWith("http")) {
        thumbnail = `files/${thumbnail.replace(/^files\//, '')}`;
    }

    if (!title || !director || !thumbnail) {
        alert("Please fill all fields correctly.");
        return;
    }

    my_movies[i].title = title;
    my_movies[i].director = director;
    my_movies[i].thumbnail = thumbnail;

    localStorage.my_movies = JSON.stringify(my_movies);
    indexContr();
};

const deleteContr = (i) => {
    if (confirm("Are you sure you want to delete this movie?")) {
       
        let my_movies = JSON.parse(localStorage.my_movies);
        my_movies.splice(i, 1);

        localStorage.my_movies = JSON.stringify(my_movies);

        indexContr();
    }
};


const resetContr = () => {
    if (confirm("Are you sure you want to reset the movie database to the initial state?")) {

        localStorage.my_movies = JSON.stringify(initial_movies);

        indexContr();
    }
};


const searchView = () => {
    return `
        <h2>Search for a Movie</h2>
        <div style="display: flex; justify-content: center; gap: 10px;">
            <input type="text" id="search-query" placeholder="Enter movie title" />
            <button class="search">Search</button>
            <button class="index">Back</button> <!-- Botón Back agregado -->
        </div>
        <div id="search-results">
            <p>No search results yet. Please enter a movie title and press search.</p>
        </div>
    `;
};

const searchContr = () => {
    const query = document.getElementById('search-query').value.trim();
    if (!query) {
        alert("Please enter a valid movie title.");
        return;
    }
    
    const apiKey = '1cd433a5a1670216a3daa0882ca24975'; 
    
    fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${apiKey}`, {
        method: 'GET',
        headers: {
            accept: 'application/json', 
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.results && data.results.length > 0) {
                resultsView(data.results);
            } else {
                document.getElementById('search-results').innerHTML = "<p>No movies found for your search query.</p>";
            }
        })
        .catch(err => {
            console.error('Error fetching data:', err);
            alert("An error occurred while fetching data. Please try again later.");
        });
};


const resultsView = (results) => {
    let view = `
        <h2>Search Results</h2>
        <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 15px;">
            <input type="text" id="search-query" placeholder="Enter movie title" />
            <button class="search">Search</button>
            <button class="index">Back</button>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
    `;

    results.forEach(movie => {
        const sanitizedMovie = JSON.stringify({
            id: movie.id || null,
            title: movie.title || "Unknown",
            poster_path: movie.poster_path || null
        });

        view += `
            <div class="movie-result" style="margin: 10px; border: 1px solid #ccc; padding: 10px; width: 200px; text-align: center;">
                <img src="https://image.tmdb.org/t/p/w200${movie.poster_path || ""}" 
                     alt="${movie.title}" style="width: 100%; height: auto;" />
                <h3>${movie.title}</h3>
                <p>Release Date: ${movie.release_date || "N/A"}</p>
                <button class="keywords" data-my-id="${movie.id}">View Keywords</button>
                <button class="add-from-api" data-movie='${sanitizedMovie}'>Add</button>
            </div>
        `;
    });

    view += `</div>`;
    document.getElementById('main').innerHTML = view; 
};


const addFromAPIContr = (movieData) => {
    const movie = JSON.parse(movieData);
    let my_movies = JSON.parse(localStorage.my_movies || "[]");

    if (!movie.id || !movie.title) {
        alert("Cannot add this movie because some necessary data is missing.");
        return;
    }

    if (my_movies.some(m => m.id === movie.id)) {
        alert("This movie is already in your database.");
        return;
    }

    const newMovie = {
        id: movie.id,
        title: movie.title,
        director: "Unknown", 
        thumbnail: movie.poster_path 
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` 
            : "files/noimage.png"
    };

    my_movies.push(newMovie);
    localStorage.my_movies = JSON.stringify(my_movies);
    alert("Movie added successfully!");
    indexContr();
};

const addKeywordToList = (keyword) => {
    let customKeywords = JSON.parse(localStorage.customKeywords || "[]");

    if (!customKeywords.includes(keyword)) {
        customKeywords.push(keyword); 
        localStorage.customKeywords = JSON.stringify(customKeywords); 
        alert(`Keyword "${keyword}" added to your list!`);
    } else {
        alert(`Keyword "${keyword}" is already in your list.`);
    }
};

// End nuevo



// EVENT ROUTER
const matchEvent = (ev, sel) => ev.target.matches(sel);
const myId = (ev) => Number(ev.target.dataset.myId);

document.addEventListener('click', ev => {
    if (matchEvent(ev, '.index')) indexContr();
    else if (matchEvent(ev, '.edit')) editContr(myId(ev));
    else if (matchEvent(ev, '.update')) updateContr(myId(ev));
    else if (matchEvent(ev, '.show')) showContr(myId(ev));
    else if (matchEvent(ev, '.new')) newContr();
    else if (matchEvent(ev, '.create')) createContr();
    else if (matchEvent(ev, '.delete')) deleteContr(myId(ev));
    else if (matchEvent(ev, '.reset')) resetContr();
    else if (matchEvent(ev, '.search')) searchContr();
    else if (matchEvent(ev, '.add-from-api')) {
        const movieData = ev.target.dataset.movie;
        if (!movieData) {
            alert("Error: Could not retrieve movie data. Please try again.");
            return;
        }
        addFromAPIContr(movieData);
    }
    else if (matchEvent(ev, '.search-view')) {
        document.getElementById('main').innerHTML = searchView();
    }
    else if (matchEvent(ev, '.add-keyword')) addKeywordToList(ev.target.dataset.keyword);
    else if (matchEvent(ev, '.my-keywords')) myKeywordsView();
    else if (matchEvent(ev, '.remove-keyword')) removeKeywordFromList(ev.target.dataset.keyword);
    else if (matchEvent(ev, '.keywords')) keywordsView(myId(ev));
});

