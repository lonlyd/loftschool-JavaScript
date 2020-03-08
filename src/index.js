const modal = document.querySelector('.modal');
const address = document.querySelector('.address');
const closeBtn = document.querySelector('.modal_close');
const allFeedbacks = document.querySelector('.feedbacks');
// const date = document.querySelector('.date');
const inputName = document.querySelector('#name');
const inputPlace = document.querySelector('#place');
const inputFeedback = document.querySelector('#feedback');
const addBtn = document.querySelector('#add_button');
const placemarks = [];

ymaps.ready(init);
function init() {
    let myPlacemark,
        clusterer,
        placemarks = [],
        coordinate,
        // allFeedbacks = document.querySelector('.feedbacks'),
        map = new ymaps.Map('map', {
            center: [55.75, 37.66],
            zoom: 11,
            controls: ['zoomControl']
        });

    clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel'
    });

    clusterer.add(placemarks);
    map.geoObjects.add(clusterer);

    // Слушаем клик на карте.
    map.events.add('click', function (e) {
        let coords = e.get('coords');

        coordinate = coords;
        allFeedbacks.innerHTML = 'Отзывов ещё нет';
        balloonOpen();
        myPlacemark = createPlacemark(coords);
        getAddress(coords);
    });

    function createPlacemark(coords) {
        return new ymaps.Placemark(coords);
    }

    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {

        ymaps.geocode(coords).then(function (res) {
            let firstGeoObject = res.geoObjects.get(0);

            myPlacemark.properties.set({
                // Формируем строку с данными об объекте.
                iconCaption: [
                    // Название населенного пункта или вышестоящее административно-территориальное образование.
                    firstGeoObject.getLocalities().length
                        ? firstGeoObject.getLocalities()
                        : firstGeoObject.getAdministrativeAreas(),
                    // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                    firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                ].filter(Boolean).join(', '),
                // В качестве контента балуна задаем строку с адресом объекта.
                balloonContent: firstGeoObject.getAddressLine()
            });
            address.innerText = firstGeoObject.getAddressLine();
        });
    }

    addBtn.addEventListener('click', () => {
        if (inputName.value && inputPlace.value && inputFeedback.value) {
            let addressLine = address.innerText,
                date = new Date().toLocaleDateString(),
                newPlacemark = new ymaps.Placemark(
                    coordinate,
                    {
                        balloonContentHeader: inputPlace.value,
                        balloonContentBody: `<a onclick="balloonFullOpen()" class="balloon__address_link">${ addressLine }</a><br><br>${ inputFeedback.value }<br><br>`,
                        balloonContentFooter: date
                    },
                    {
                        preset: 'islands#orangeDotIcon',
                        draggable: false,
                        openBalloonOnClick: false
                    }
                );

            map.geoObjects.add(newPlacemark);
            clusterer.add(newPlacemark);
            placemarks.push(newPlacemark);

            if (allFeedbacks.innerHTML === 'Отзывов ещё нет') {
                allFeedbacks.innerHTML = '';
            }
            newPlacemark.commentContent = `<span class="user_name"><strong>${ inputName.value }</strong></span>
                <span class="place_name">${ inputPlace.value }</span>
                <span class="date">${ date } </span>
                <div class="user_feedback">${ inputFeedback.value } </div>`;
            allFeedbacks.innerHTML += newPlacemark.commentContent;
            newPlacemark.place = address.innerText;
            inputsClear();
            newPlacemark.events.add('click', () => {
                balloonOpen();
                allFeedbacks.innerHTML = newPlacemark.commentContent;
                address.innerHTML = newPlacemark.place;
            });
        } else {
            // alert('Не все поля заполнены');
        }
    });

    // addBtn.addEventListener('click', () => {
    //     if (inputName && inputPlace && inputFeedback) {
    //         localStorage(myPlacemark, inputName, inputPlace, inputFeedback)
    //     }
    // });
    //
    // let localStorage = function (myPlacemark, inputName, inputPlace, inputFeedback) {
    //     let feedbacks = {};
    //     let date = new Date().toLocaleDateString();
    //``
    //     feedbacks = {
    //         address: myPlacemark,
    //         name: inputName,
    //         place: inputPlace,
    //         feedback: inputFeedback,
    //         inputDate: date
    //     }
    //
    //     localStorage.feedback = JSON.stringify(feedbacks);
    // }
}
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    inputsClear();
});

let inputsClear = () => {
    inputName.value = '';
    inputPlace.value = '';
    inputFeedback.value = '';
};

const balloonOpen = () => {
    modal.style.top = event.clientY + 'px';
    modal.style.left = event.clientX + 'px';
    modal.style.display = 'block';
}
const balloonFullOpen = () => {
    address.innerText = '';
    allFeedbacks.innerHTML = '';
    // const addressLine = document.querySelector('.address');
    for (let i = 0; i < placemarks.length; i++) {
        if (address.innerText === placemarks[i].place) {
            address.innerText = placemarks[i].place;
            allFeedbacks.innerHTML += placemarks[i].commentContent;
        }
    }

    modal.style.top = event.clientY + 'px';
    modal.style.left = event.clientX + 'px';
    modal.style.display = 'block';
};
