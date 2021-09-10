console.log('on page/script.js');

let myFile;
let filteredFile;

const wordElement = document.getElementById('word');
const meaningsDiv = document.getElementById('meanings');
const synonymsDiv = document.getElementById('synonyms');
const antonymDiv = document.getElementById('antonyms');
const newWordButton = document.getElementById('new_word');

function newWord() {

  antonymDiv.hidden = true;
  synonymsDiv.hidden = true;

  const randomWord = getRandomItem(filteredFile);
  const { WORD, MEANINGS, SYNONYMS, ANTONYMS } = randomWord;

  console.log(randomWord);

  wordElement.textContent = WORD;
  placeSynonyms(SYNONYMS);
  placeAntonym(ANTONYMS);
  placeMeanings(Object.values(MEANINGS));
}

function placeSynonyms(synonyms) {
  synonymsDiv.innerHTML = '';

  if (synonyms.length > 1) {

    synonymsDiv.hidden = false;
    const synonymsElement = document.createElement('p');
    synonymsElement.classList.add('synonyms');

    const fornatedSynonyms = formatList(synonyms);

    synonymsElement.innerHTML = `<span>Synonyms: </span>  ${fornatedSynonyms}`;
    synonymsDiv.appendChild(synonymsElement);
  }
}

function placeAntonym(antonym) {
  antonymDiv.innerHTML = '';

  if (antonym.length > 0) {

    antonymDiv.hidden = false;
    const antonymElement = document.createElement('p');
    antonymElement.classList.add('synonyms');

    const fornatedAntonyms = formatList(antonym);

    antonymElement.innerHTML = `<span>Antonym: </span>  ${fornatedAntonyms}`;
    antonymDiv.appendChild(antonymElement);
  }
}

function placeMeanings(meanings) {
  meaningsDiv.innerHTML = '';

  meanings.forEach(meaning => {

    const meaningCard = document.createElement('div');
    meaningCard.classList.add('meaning_card');

    const typeElement = document.createElement('p');
    typeElement.classList.add('type');
    typeElement.innerHTML = `<span>Class: </span>  ${meaning[0]}.`;
    meaningCard.appendChild(typeElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.innerHTML = `<span>Meaning: </span>  ${formatMeanings(meaning[1])}`;
    meaningCard.appendChild(descriptionElement);

    if (meaning[2].length > 0) {
      const contextElement = document.createElement('p');
      contextElement.classList.add('contexts');
      const fornatedContexts = formatList(meaning[2]);
      contextElement.innerHTML = `<span>Context: </span>  ${fornatedContexts}`;
      meaningCard.appendChild(contextElement);
    }

    if (meaning[3].length > 0) {
      const examplesElement = document.createElement('p');
      examplesElement.classList.add('examples');
      const fornatedExamples = formatList(meaning[3]);
      examplesElement.innerHTML = `<span>Example: </span>  ${fornatedExamples}`;
      meaningCard.appendChild(examplesElement);
    }

    meaningsDiv.appendChild(meaningCard);
  });
}

function formatMeanings(meanings) {
  const formatedMeanings = meanings.split('; ').map(mean => mean.charAt(0).toUpperCase() + mean.slice(1)).join('; ') + '.';
  return formatedMeanings;
}

function formatList(list) {
  const formatedList = list.map(el => el.charAt(0).toUpperCase() + el.slice(1)).join(', ') + '.';
  return formatedList;
}

function randomNumber(length) {
  return Math.floor(Math.random() * length);
}

function filterBy(obj, key) {
  const words = Object.keys(obj);
  words.forEach(word => {
    if (!Object.keys(obj[word][key]).length > 0) {
      delete obj[word];
    }
  });
  return obj;
}

function getRandomItem(obj) {
  const keys = Object.keys(obj);
  const randNum = Math.floor(Math.random() * keys.length);
  const randomKey = keys[randNum];
  const randomItem = obj[randomKey];
  return { WORD: [randomKey], ...randomItem };
}

function randomJson() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letter = letters[randomNumber(letters.length)];
  const jsonPath = `./data/D${letter}.json`;
  return jsonPath;
}

function getJson(root) {
  root.getFile(randomJson(), {}, function (fileEntry) {
    fileEntry.file(function (file) {
      var reader = new FileReader();
      reader.onloadend = function (e) {
        myFile = JSON.parse(this.result);
        filteredFile = filterBy(myFile, 'MEANINGS');
        newWord();
      };
      reader.readAsText(file);
    });
  });
}

function start() {
  chrome.runtime.getPackageDirectoryEntry(getJson);
  newWordButton.onclick = newWord;
}

start();
