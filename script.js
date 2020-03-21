//DOM-ЭЛЕМЕНТЫ
const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    inputCitiesTo = formSearch.querySelector('.input__cities-to'),
    dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputDateDepart = formSearch.querySelector('.input__date-depart'),
    dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
    cheapestTicket = document.getElementById('cheapest-ticket'),
    otherCheapTickets = document.getElementById('other-cheap-tickets'),
    modalOpen = document.getElementById('modal');

//ДАННЫЕ

let cities = [];

const cityAPI = 'db/cities.json';
const API_KEY = 'c2e0a7135d44c34f3b75da7f6cea6c6e';
const proxy = 'https://cors-anywhere.herokuapp.com/';
const MAX_COUNT = 10;

//РЕАЛИЗАЦИЯ ФУНКЦИЙ


//ПОЛУЧЕНИЕ ДАННЫХ ИЗ БАЗЫ
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

//ПОЛУЧЕНИЕ ДАТЫ ДЛЯ ВЫВОДА В КАРТОЧКУ
const getDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        year : 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

//ВЫВОД ИМЕНИ ГОРОДА ДЛЯ ВЫВОДА В КАРТОЧКУ
const getnameCity = (code) => {
    const objCity = cities.find((item) => item.code === code);
    return objCity.name;
}

//ФОРМИРОВАНИЕ ССЫЛКИ ДЛЯ ПЕРЕХОДА НА СТРАНИЦУ ОПЛАТЫ
const getLink = (data) => {
    let link = 'https://www.aviasales.ru/search/';
    link = link + data.origin;

    const date = new Date(data.depart_date);
    const day = date.getDate();

    link += day < 10 ? '0' + day : day;

    const month = date.getMonth() + 1;

    link += month < 10 ? '0' + month : month;
    link += data.destination;
    link += '1';

    return link;
}

//ПОЛУЧЕНИЕ ИНФОРМАЦИИ О КОЛИЧЕСТВЕ ПЕРЕСАДОК
const getChanges = (num) => {
    if (num) {
        return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
    }
    else {
        return 'Без пересадок';
    }
}

//СОЗДАНИЕ КАРТОЧЕК С БИЛЕТАМИ
const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';

    if (data) {
        deep = `
        <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="${getLink(data)}" class="button button__buy" target="_blank">Купить
                    за ${data.value}₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города
                        <span class="city__name">${getnameCity(data.origin)}</span>
                    </div>
                    <div class="date">${getDate(data.depart_date)}</div>
                </div>

                <div class="block-right">
                    <div class="changes">${getChanges(data.number_of_changes)}</div>
                    <div class="city__to">Город назначения:
                        <span class="city__name">${getnameCity(data.destination)}</span>
                    </div>
                </div>
	        </div>
        </div>
        `;
    }
    else {
        deep = '<h3>К сожалению неа текущую дату билетов не найдено</h3>';
    }

    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
}

const renderCheapYear = (cheapTickets) => {
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';

    let sortTickets = cheapTickets.sort((a, b) => {
        return a.value - b.value;
    });

    for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
        const ticket = createCard(cheapTickets[i]);
        otherCheapTickets.appendChild(ticket);
    }

    console.log(sortTickets);
}

const renderCheapDay = (cheapTicket) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>'

    const ticket = createCard(cheapTicket[0]);
    cheapestTicket.appendChild(ticket);
    console.log(ticket);
}

const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;
    const cheapTicketDay = cheapTicketYear.filter((item) => {
        return item.depart_date === date;
    })

    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear.sort());
}

const showCity = (input, list) => {
    list.textContent = '';

    if (input.value !== '') {
        const filterCities = cities.filter((item, i) => {
            let fixedItems = item.name.toLowerCase();
            return fixedItems.startsWith(input.value.toLowerCase());
        });

        filterCities.forEach((item, i, array) => {
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

const formingData = (e) => {
    e.preventDefault();

    const cityFrom = cities.find((item) => inputCitiesFrom.value === item.name);
    const cityTo = cities.find((item) => inputCitiesTo.value === item.name);

    const formData = {
        from: cityFrom,
        to: cityTo,
        when: inputDateDepart.value,
    }

    if (formData.from && formData.to) {
        const requestString = `http://min-prices.aviasales.ru/calendar_preload?origin=${formData.from.code}&destination=${formData.to.code}&depart_date=${formData.when}`;

        getData(requestString, (response) => {
            renderCheap(response, formData.when);
        })
    }
    else modal.style.display = 'block';
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

formSearch.addEventListener('submit', (e) => {
    formingData(e);
});

//ВЫЗОВ ФУНКЦИЙ

getData(cityAPI, (data) => {
    cities = JSON.parse(data).filter((item) => {
        return item.name;
    });

    cities.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        else if ( a.name > b.name) {
            return 1;
        };
    })
});