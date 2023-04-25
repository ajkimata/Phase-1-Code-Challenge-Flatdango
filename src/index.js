// // Your code here
// const baseApiUrl = 'http://localhost:3000';
// const filmsUrl = `${baseApiUrl}/films`;
// const filmUrl = `${baseApiUrl}/films/1`;

// // Retrieve all films from the API and render them in the films menu
// async function renderFilmsMenu() {
//   const filmsMenu = document.querySelector('#films');

//   try {
//     const response = await fetch(filmsUrl);
//     const filmsData = await response.json();

//     // Remove placeholder li element from the menu
//     filmsMenu.innerHTML = '';

//     // Render each film in the menu
//     filmsData.forEach(filmData => {
//       const { id, title } = filmData;
//       const filmItem = document.createElement('li');
//       filmItem.classList.add('film');
//       filmItem.textContent = title;
//       filmItem.addEventListener('click', () => {
//         renderFilmDetails(id);
//       });
//       filmsMenu.appendChild(filmItem);
//     });
//   } catch (error) {
//     console.error('Error fetching films data', error);
//   }
// }

// // Retrieve a film's details from the API and render them on the page
// async function renderFilmDetails(filmId) {
//   const filmDetails = document.querySelector('#film-details');

//   try {
//     const response = await fetch(`${filmsUrl}/${filmId}`);
//     const filmData = await response.json();

//     const { title, runtime, showtime, tickets_sold, capacity, poster } = filmData;

//     const availableTickets = capacity - tickets_sold;

//     // Render movie details on the page
//     filmDetails.innerHTML = `
//       <img class="movie-poster" src="${poster}" alt="Movie Poster">
//       <h2 class="movie-title">${title}</h2>
//       <p class="movie-runtime">Runtime: ${runtime} minutes</p>
//       <p class="movie-showtime">Showtime: ${showtime}</p>
//       <p class="movie-tickets">Available Tickets: ${availableTickets}</p>
//       <button id="buy-ticket-button">Buy Ticket</button>
//     `;

//     // Add event listener to buy ticket button
//     const buyTicketButton = document.querySelector('#buy-ticket-button');
//     buyTicketButton.addEventListener('click', async () => {
//       if (availableTickets > 0) {
//         // Update available tickets count on the page
//         const movieTickets = document.querySelector('.movie-tickets');
//         movieTickets.textContent = `Available Tickets: ${availableTickets - 1}`;

//         // Update tickets_sold count on the server
//         try {
//           const response = await fetch(`${filmsUrl}/${filmId}`, {
//             method: 'PATCH',
//             headers: {
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//               tickets_sold: tickets_sold + 1
//             })
//           });
//           const updatedFilmData = await response.json();

//           // Update available tickets count on the page again in case the server updated the data
//           const updatedAvailableTickets = updatedFilmData.capacity - updatedFilmData.tickets_sold;
//           movieTickets.textContent = `Available Tickets: ${updatedAvailableTickets}`;
//         } catch (error) {
//           console.error('Error buying ticket', error);
//         }
//       } else {
//         alert('Sorry, this showing is sold out.');
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching film data', error);
//   }
// }

// // Render films menu and first film's details on page load
// window.addEventListener('load', () => {
//   renderFilmsMenu();
//   renderFilmDetails(1);
// });


// Make a GET request to retrieve all films
fetch('http://localhost:3000/films')
  .then(response => response.json())
  .then(films => {
    // Populate the film menu with the retrieved films
    const filmMenu = document.getElementById('films');
    filmMenu.innerHTML = '';
    films.forEach(film => {
      const li = document.createElement('li');
      li.classList.add('film', 'item');
      li.textContent = film.title;
      li.addEventListener('click', () => displayFilmDetails(film.id));
      filmMenu.appendChild(li);
    });
  });

// Make a GET request to retrieve a specific film's details and display them
function displayFilmDetails(filmId) {
  fetch(`http://localhost:3000/films/${filmId}`)
    .then(response => response.json())
    .then(film => {
      // Populate the film details section with the retrieved film's details
      const title = document.getElementById('title');
      title.textContent = film.title;
      const runtime = document.getElementById('runtime');
      runtime.textContent = `${film.runtime} minutes`;
      const filmInfo = document.getElementById('film-info');
      filmInfo.textContent = film.description;
      const showtime = document.getElementById('showtime');
      showtime.textContent = film.showtime;
      const ticketNum = document.getElementById('ticket-num');
      const availableTickets = film.capacity - film.tickets_sold;
      ticketNum.textContent = `${availableTickets}`;
      const poster = document.getElementById('poster');
      poster.src = film.poster;
      // Add event listener to the "Buy Ticket" button
      const buyTicketButton = document.getElementById('buy-ticket');
      buyTicketButton.addEventListener('click', () => {
        if (availableTickets > 0) {
          ticketNum.textContent = `${availableTickets - 1}`;
        }
      });
    });
}
const filmDetails = document.getElementById('film-details');
const buyTicketButton = document.getElementById('buy-ticket');
const ticketsRemaining = document.getElementById('tickets-remaining');

// Fetch film data for first film
fetch('http://localhost:3000/films/1')
  .then(response => response.json())
  .then(data => {
    // Update film details
    filmDetails.querySelector('img').setAttribute('src', data.poster);
    filmDetails.querySelector('h2').textContent = data.title;
    filmDetails.querySelector('p.runtime').textContent = `${data.runtime} mins`;
    filmDetails.querySelector('p.showtime').textContent = data.showtime;

    // Calculate and display tickets remaining
    const ticketsAvailable = data.capacity - data.tickets_sold;
    ticketsRemaining.textContent = `${ticketsAvailable} tickets remaining`;
    if (ticketsAvailable === 0) {
      buyTicketButton.disabled = true;
    }
  });

// Handle buy ticket button click
buyTicketButton.addEventListener('click', () => {
  // Make PATCH request to update tickets sold
  fetch('http://localhost:3000/films/1', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tickets_sold: 28 // Update with actual number of tickets sold
    })
  })
  .then(response => response.json())
  .then(data => {
    // Calculate and display tickets remaining
    const ticketsAvailable = data.capacity - data.tickets_sold;
    ticketsRemaining.textContent = `${ticketsAvailable} tickets remaining`;
    if (ticketsAvailable === 0) {
      buyTicketButton.disabled = true;
    }
  });
});
const filmList = document.getElementById('films');

// Fetch list of films
fetch('http://localhost:3000/films')
  .then(response => response.json())
  .then(data => {
    // Render list of films
    data.forEach(film => {
      const li = document.createElement('li');
      li.textContent = film.title;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
        // Make DELETE request to delete film on server
        fetch(`http://localhost:3000/films/${film.id}`, {
          method: 'DELETE'
        })
        .then(() => {
          // Remove film from list on page
          li.remove();
        });
      });

      li.appendChild(deleteButton);
      filmList.appendChild(li);
    });
  });
