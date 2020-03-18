const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    inputCitiesTo = formSearch.querySelector('.input__cities-to'),
    dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputDateDepart = formSearch.querySelector('.input__date-depart');

const cities = ['Москва', 'Челябинск', 'Санкт-Петербург', 'Ухань', 'Нижний Новгород', 'Берн',
            'Берлин', 'Самара', 'Париж', 'Краснодар', 'Калининград', 'Варшава', 'Прага', 'Пекин',
            'Вашингтон', 'Нью-Йорк', 'Казань', 'Вроцлав', 'Ростов-на-Дону'];

const showCity = (input, list) => {
    list.textContent = '';

    if (input.value !== '') {
        const filterCities = cities.filter((item) => {
            let fixedItems = item.toLowerCase();
            return fixedItems.includes(input.value.toLowerCase());
        });

        filterCities.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item;
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

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesFrom.addEventListener('click', (e) => {
    hideCities(inputCitiesFrom, dropdownCitiesFrom, e);
});
