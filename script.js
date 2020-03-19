//DOM-ЭЛЕМЕНТЫ
const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    inputCitiesTo = formSearch.querySelector('.input__cities-to'),
    dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputDateDepart = formSearch.querySelector('.input__date-depart'),
    dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to');

//ДАННЫЕ

let cities = [];
let origin = 'SVX';
let destination = 'KGD';
let depart_date = '2020-05-25';

const cityAPI = 'db/cities.json';
const API_KEY = 'c2e0a7135d44c34f3b75da7f6cea6c6e';
const CALENDAR = `http://min-prices.aviasales.ru/calendar_preload?origin=${origin}&destination=${destination}&depart_date=${depart_date}`;
const proxy = 'https://cors-anywhere.herokuapp.com/';

//РЕАЛИЗАЦИЯ ФУНКЦИЙ

const getData = (url, callback) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4 ) return;

        if (request.status === 200) {
            callback(request.response);
        }
        else {
            console.error(request.status);
        }
    });
    request.send();
}


const showCity = (input, list) => {
    list.textContent = '';

    if (input.value !== '') {
        const filterCities = cities.filter((item) => {
            let fixedItems = item.name.toLowerCase();
            return fixedItems.includes(input.value.toLowerCase());
        });

        filterCities.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);
        });
    }
}

const hideCities = (input, listToHide, e) => {
    const target = e.target;
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        listToHide.textContent = '';
    }
}

//ОБРАБОТКА СОБЫТИЙ

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesTo.addEventListener('click', (e) => {
    hideCities(inputCitiesTo, dropdownCitiesTo, e);
});

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesFrom.addEventListener('click', (e) => {
    hideCities(inputCitiesFrom, dropdownCitiesFrom, e);
});

//ВЫЗОВ ФУНКЦИЙ

getData(cityAPI, (data) => {
    cities = JSON.parse(data).filter((item) => {
        return item.name;
    });
    console.log(JSON.parse(data));
});

getData(CALENDAR, (data) => {
    let t = JSON.parse(data);
    console.log(t.current_depart_date_prices );
    t.current_depart_date_prices.forEach((item) => {
        console.log(`Самые лучшие цены: ${item.value}`);
    });
});
