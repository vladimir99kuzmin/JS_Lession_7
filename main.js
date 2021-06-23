function Good(product, image, description, price) {
    this.product = product;
    this.image = image;
    this.description = description;
    this.price = price;
}
let catalodList = []
catalodList.push(new Good('Item1', ['./img/1.png', './img/2.png', './img/3.png'], 'Description 1', 95));
catalodList.push(new Good('Item2', ['./img/4.png', './img/5.png', './img/1.png'], 'Description 2', 17));
catalodList.push(new Good('Item3', ['./img/1.png', './img/2.png', './img/3.png'], 'Description 3', 15));
catalodList.push(new Good('Item4', ['./img/1.png', './img/2.png', './img/3.png'], 'Description 4', 32));
catalodList.push(new Good('Item5', ['./img/1.png', './img/2.png', './img/3.png'], 'Description 5', 22));
catalodList.push(new Good('Item6', ['./img/1.png', './img/2.png', './img/3.png'], 'Description 6', 22));
const $catalog = document.querySelector('#catalog');

function drowItems() {
    catalodList.forEach(function (item, id) {
        let imagesHtml = item.image.map(function(src){
            return `<img class="small_img" src="${src}"></img>`;
        }).join('');
        
        let html = `<div id="item-${id}" class="prod_item">
                 <div class="item">
                     <div class="image">${imagesHtml}</div>
                     <div class="description"><h4>${item.product}</h4>${item.description}
                         <div class="price">Цена: 
                             <span>${item.price}</span> $.
                         </div>
                     </div>
                 </div>
                 <div class="sale">                     
                     <div data-id="${id}" class="button">В корзину</div>
                 </div>
             </div>`
        $catalog.insertAdjacentHTML('beforeend', html);
    })
}
drowItems();
let shoppingCart = [];
let emptyBasket = 'Ваша корзина пуста.';

function basketItem(product, price) {
    this.product = product;
    this.price = price;
    this.finalPrice = function() {
            return this.price;
    }
}
function totalSumm(shoppingCart) {
    return shoppingCart.reduce(function (acc, price) {
        return acc + price.finalPrice();
    }, 0);
}
function correctEnding (){
    let corEnd = '';
    if (shoppingCart.length == 1) {
        corEnd = '';
    } else if (shoppingCart.length > 1 && shoppingCart.length <= 4) {
        corEnd = 'а';
    } else {
        corEnd = 'ов';
    }
    return corEnd;
}
let $userAddr;
function drowTotal (shoppingCart) {
    const $basket = document.querySelector('#basket');
    $basket.textContent = '';
    
    if (shoppingCart == 0) {
        $basket.insertAdjacentHTML('beforeend', `<div class="total">${emptyBasket}</div>`);
    } else {
        $basket.insertAdjacentHTML('beforeend', 
        `<div class="total">
            <p>В корзине: ${shoppingCart.length} 
            товар${correctEnding()} на сумму ${totalSumm(shoppingCart)} $.</p>
        </div>
        <div id="buy_hidden">
            <p class="buy" id="buy">Купить</p>
        </div>
        <div id="confirmHtml" class="confirmHtml">
            <p class="buy" id="confirm">Подтвердить</p>
        </div>
        <div id="messageHtml" class="confirmHtml">
            <p class="buy" id="message">Завершить</p>
        </div>
        `);
        
        const $buy_hidden = document.getElementById('buy_hidden');
        const $confirmHtml = document.getElementById('confirmHtml');
        const $messageHtml = document.getElementById('messageHtml');
        
        function showChart(id=0) {
            for (const iterator of shoppingCart) {
                let chartHtml = `<div id="${id}" class="buy_hidden__item">${iterator.product} за ${iterator.finalPrice()} $.`;    
                $buy_hidden.insertAdjacentHTML('afterbegin', `${chartHtml}
                <span data-id="${id}" class="buy_hidden__delete"> (удалить)</span></div>`);
                id++;
            }
        }
        showChart();

        const $buy = document.getElementById('buy');
        const $confirm = document.getElementById('confirm');
        const $message = document.getElementById('message');

        $buy.addEventListener('click', function () {
            $buy_hidden.style.display = 'none';
            $confirmHtml.style.display = 'flex';
            confirmDrow();
        });
        $confirm.addEventListener('click', function () {
            $confirmHtml.style.display = 'none';
            $messageHtml.style.display = 'flex';
            messageDrow();
            let inputAddr = document.getElementById('addr');
            $userAddr = inputAddr.value;
        });
        $message.addEventListener('click', function () {
            $messageHtml.style.display = 'none';
            shoppingCart = 0;
            drowTotal(shoppingCart);
            createConfirmWindow();
        });

        function confirmDrow() {
            let confirmHtml = 
            `<p class="buy_hidden__item">Адрес доставки:</p>
             <input id="addr" type="text" class="buy_hidden__confirm" placeholder="Введите адрес">`;
            $confirmHtml.insertAdjacentHTML('afterbegin', confirmHtml);
        }
        function messageDrow() {
            let messageHtml = 
            `<p class="buy_hidden__item">Комментарий к заказу:</p>
                <form class="form" action="#">
                    <form action="#">
                        <input id="text" class="buy_hidden__confirm" type="text" placeholder="Ваше имя"><br>
                        <input id="email" class="buy_hidden__confirm" type="email" placeholder="Ваш email"><br>
                        <textarea id="message" class="buy_hidden__confirm" cols="30" rows="5" placeholder="Ваш комментарий"></textarea><br>
                    </form>
                </form>`;
            $messageHtml.insertAdjacentHTML('afterbegin', messageHtml);
        }
    }
}
drowTotal(shoppingCart);
$catalog.addEventListener('click', function (e) {
    if (e.target.className ==='button' ) {
        const id = Number(e.target.getAttribute('data-id'));
        const choice = catalodList[id];
        shoppingCart.push(new basketItem(choice.product, choice.price));
        drowTotal(shoppingCart);
    } 

});
const $basket = document.getElementById('basket');
$basket.addEventListener('click', function (e) {
    if (e.target.className === 'buy_hidden__delete') {
        const this_id = Number(e.target.getAttribute('data-id'));
        shoppingCart.splice(this_id, 1)
        drowTotal(shoppingCart);
    }
})
const $popup = document.querySelector('#popup');
$popup.addEventListener('click', function(e) {
    $popup.style.display = 'none';
});
$catalog.addEventListener('click', function(e) {
    if( e.target.tagName === 'IMG' ) {
        $popup.textContent = '';
        $popup.style.display = 'flex';
        
        imgArr = e.target.parentNode;
        let imgCnt = 0;
        $popup.insertAdjacentHTML('beforeend',
            `<img src="${imgArr.children[imgCnt].getAttribute('src')}" class="scale">`);
    };
});
const $wrapper = document.getElementById('wrapper');

function createConfirmWindow() {
    let $orderDiv = document.createElement('div');
    let date = new Date().toLocaleDateString();

    $orderDiv.className = 'orderDiv';
    $orderDiv.insertAdjacentHTML('beforeend', `
    <h2>Ваш заказ от ${date}<br>на сумму ${totalSumm(shoppingCart)} $. передан в обработку.</h2>
    <h4>Адрес доставки: ${$userAddr}</h4>
    <button id="close">Закрыть</button>`);
    $wrapper.append($orderDiv);
    
    $orderDiv.addEventListener('click', function(e) {
        if( e.target.tagName === 'BUTTON' ) {
            $orderDiv.style.display = 'none';
        }
    });
}