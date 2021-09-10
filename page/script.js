console.log('on page/script.js');

let myFile;
let filteredFile;

const lessonTitle = document.getElementById('title');
const lessonMeanings = document.getElementById('meanings');
const lessonSynonyms = document.getElementById('synonyms');
const newButton = document.getElementById('new_word');

function newWord() {
  const randomWord = getRandomItem(filteredFile);
  const { WORD, MEANINGS, SYNONYMS, ANTONYMS } = randomWord;

  console.log(randomWord);

  lessonTitle.textContent = WORD;
  placeSynonyms(SYNONYMS);
  placeMeanings(Object.values(MEANINGS));
}

function placeSynonyms(synonyms) {
  lessonSynonyms.innerHTML = '';

  if (synonyms.length > 0) {
    const synonymsElement = document.createElement('p');
    synonymsElement.classList.add('synonyms');

    const fornatedSynonyms = formatList(synonyms);

    synonymsElement.innerHTML = `<span>Synonyms: </span>  ${fornatedSynonyms}`;
    lessonSynonyms.appendChild(synonymsElement);
  }
}

function placeMeanings(meanings) {
  lessonMeanings.innerHTML = '';

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

    lessonMeanings.appendChild(meaningCard);
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
  //get words in json
  const words = Object.keys(obj);
  words.forEach(word => {
    // delete the word if word's meanings array is empty
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
  // console.log(randNum, randomKey);
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
  newButton.onclick = newWord;
}

start();
