
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

// https://pixabay.com/api/29942317-e3405ade5aa33d4d063a2fbeb


const inputSearchImages = document.querySelector('.input-search');
const formSearchImages = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
let lightbox; // Create a SimpleLightbox instance

formSearchImages.addEventListener('submit', function (event) {
  event.preventDefault();
  const keyword = inputSearchImages.value.trim();

  if (keyword) {
    showLoadingSpinner();

    fetch(`https://pixabay.com/api/?key=29942317-e3405ade5aa33d4d063a2fbeb&q=${keyword}&image_type=photo&orientation=horizontal&safesearch=true`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => {

        hideLoadingSpinner();

        if (data.hits.length > 0) {

          renderImages(data.hits);
        } else {
          iziToast.error({
            title: 'Error',
            message: 'Sorry, there are no images matching your search query. Please try again!',
          });
        }
      })
      .catch((error) => {

        hideLoadingSpinner();
        console.log(error);
      });
  } else {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search keyword.',
    });
  }
});

function showLoadingSpinner() {

  gallery.innerHTML = '<p>Loading images, please wait...</p>';
}

function hideLoadingSpinner() {

  gallery.innerHTML = '';
}

function renderImages(images) {

  const lightboxImages = [];


  const imageList = images.map((image) => {
    lightboxImages.push({
      src: image.largeImageURL,
      title: `Likes: ${image.likes}, Views: ${image.views}, Comments: ${image.comments}, Downloads: ${image.downloads}`,
    });
    return `<a href="${image.largeImageURL}" data-lightbox="gallery" data-title="${image.tags}">
              <img src="${image.webformatURL}" alt="${image.tags}">
              <ul>
              <li>Likes:<br /> ${image.likes}</li>
              <li>Views:<br /> ${image.views}</li>
              <li>Comments:<br /> ${image.comments}</li>
              <li>Downloads:<br /> ${image.downloads}</li>
              </ul>
            </a>`;
  }).join('');

  gallery.innerHTML = `${imageList}`;

const lightbox = new SimpleLightbox('a[data-lightbox="gallery"]');
lightbox.refresh(); 
}
