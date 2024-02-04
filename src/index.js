import Notiflix from 'notiflix';
import axios from "axios";
import { apiKey } from "./config";

axios.defaults.headers.common["x-api-key"] = apiKey;

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

async function fetchBreeds() {
  try {
    breedSelect.style.display = 'none';
    Notiflix.Loading.standard('Loading data, please wait...');

    const response = await axios.get('https://api.thecatapi.com/v1/breeds');
    const breeds = response.data;

    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.text = breed.name;
      breedSelect.appendChild(option);
    });

    breedSelect.style.display = 'block';
    Notiflix.Loading.remove(); 
    breedSelect.disabled = false;
    breedSelect.selectedIndex = 0;
    breedSelect.addEventListener('change', handleBreedSelection);

    return breeds;
  } catch (err) {
    console.error(err);
    Notiflix.Loading.remove(); 
    Notiflix.Notify.failure('Oops! Something went wrong. Try reloading the page!'); 
  }
}

async function fetchCatByBreed(breedId) {
  try {
    catInfo.style.display = 'none';
    Notiflix.Loading.standard('Loading data, please wait...');

    const response = await axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`);
    const catData = response.data[0];

    const catContainer = document.createElement('div');
    catContainer.classList.add('cat-container');

    const catImage = document.createElement('img');
    catImage.src = catData.url;
    catImage.alt = 'Cat Image';
    catImage.classList.add('cat-image');

    const catText = document.createElement('div');
    catText.classList.add('cat-text');
    catText.innerHTML = `
      <p class="breed-name">${catData.breeds[0].name}</p>
      <p class="description">${catData.breeds[0].description}</p>
      <p class="temperament"><span>Temperament:</span> ${catData.breeds[0].temperament}</p>
    `;

    catContainer.appendChild(catImage);
    catContainer.appendChild(catText);

    catInfo.innerHTML = '';
    catInfo.appendChild(catContainer);

    catInfo.style.display = 'block';
    Notiflix.Loading.remove();
  } catch (err) {
    console.error(err);
    Notiflix.Loading.remove();
    Notiflix.Notify.failure('Oops! Something went wrong. Try reloading the page!');
  }
}

function handleBreedSelection() {
  const selectedBreedId = breedSelect.value;
  if (selectedBreedId) {
    catInfo.style.display = 'none';
    fetchCatByBreed(selectedBreedId);
  }
}

fetchBreeds(); 