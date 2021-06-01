# Розробка ігор на JavaScript

Сьогодні гру можна створити на будь-якій пристосованій для цього платформі, але JS не виняток.

# Основи HTML, CSS

Для початку треба створити сторінку, на якій буде відображатись холст. Для цього нам потрібно зовсім трохи HTML.

 ```html
  <!DOCTYPE html>
<html>
    <head>
        <title>JS Game</title>
        <link rel="stylesheet" href="style.css">
        <meta charset="utf-8">
    </head>
    <body>
        <div class="wrapper">
            <canvas width="0" height="0" class="canvas" id="canvas">Ваш браузер не поддерживает JavaScript и HTML5!</canvas>
        </div>
        <script src="main.js"></script>
    </body>
</html>
  ```

Тепер потрібно додати стилі:

```CSS
  body, html
{
    width: 100%;
    height: 100%;
    padding: 0px;
    margin: 0px;
    overflow: hidden;
}
 
.wrapper
{
    width: 100%;
    height: 100%;
}
 
.canvas
{
    width: 100%;
    height: 100%;
    background: #000;
}
  ```

За допомогою стилів змінюється видиме дозвіл. Однак при цьому розміри картинки залишаться колишніми: вона просто розтягнеться або стиснеться. Тому фактичні ширина і висота будуть вказані пізніше - через скрипт.

# Скрипт для игры

Для початку додамо заготовку скрипта для гри:

```js
var canvas = document.getElementById("canvas"); //Отримання полотна з DOM
var ctx = canvas.getContext("2d"); //Отримання контексту - через нього можна працювати з полотном
 
var scale = 0.07; //Масштаб героїв
 
Resize(); // При завантаженні сторінки задається розмір полотна
 
window.addEventListener("resize", Resize); //При зміні розмірів вікна будуть змінюватися розміри полотна
 
window.addEventListener("keydown", function (e) { KeyDown(e); }); //Отримання натискань з клавіатури
 
var objects = []; //Масив ігрових об'єктів
var roads = []; //Масив з фонами
 
var player = null; //Об'єкт, яким керує гравець, - тут буде вказано номер об'єкта в масиві objects
 
function Start()
{
    timer = setInterval(Update, 1000 / 60); //Стан гри буде оновлюватися 60 разів в секунду - при такій частоті оновлення відбувається здаватиметься дуже плавним
}
 
function Stop()
{
    clearInterval(timer); //Зупинка поновлення
}
 
function Update() //Оновлення гри
{
    Draw();
}
 
function Draw() //Робота з графікою
{
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Очищення полотна від попереднього кадру
}
 
function KeyDown(e)
{
    switch(e.keyCode)
    {
        case 37: //Вліво
            break;
 
        case 39: //Вправо
            break;
 
        case 38: //Вгору
            break;
 
        case 40: //Вниз
            break;
 
        case 27: //Esc
            break;
    }
}
 
function Resize()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
  ```
В цьому скрипті є все, що необхідно для створення гри: дані (масиви), функції оновлення, промальовування і управління. Залишається тільки доповнити це основний логікою. Тобто вказати, як саме об'єкти будуть себе вести і як будуть виводитися на полотно.

# Логіка гри

Під час виклику функції Update () будуть змінюватися стану ігрових об'єктів. Після цього вони отрісовиваємих на canvas за допомогою функції Draw (). Тобто насправді ми не рухаємо об'єкти на полотні - ми малюємо їх один раз, потім міняємо координати, стираємо старе зображення і виводимо об'єкти з новими координатами. Все це відбувається так швидко, що створюється ілюзія руху.

Створемо класс Road
```js
  class Road
{
    constructor(image, y)
    {
        this.x = 0;
        this.y = y;
 
        this.image = new Image();
        
        this.image.src = image;
    }
 
    Update(road) 
    {
        this.y += speed; //При оновленні зображення зміщується вниз
 
        if(this.y > window.innerHeight) //Якщо зображення пішло за край полотна, то міняємо положення
        {
            this.y = road.y - this.image.height + speed; //Нове положення вказується з урахуванням другого фону
        }
    }
}
  ```
 
 У масив з фонами додаються два об'єкти класу Road:
 ```js
  var roads = 
[
    new Road("images/road.jpg", 0),
    new Road("images/road.jpg", 626)
]; //Массив с фонами
  ```
Тепер можна змінити функцію Update (), щоб положення зображень змінювалося з кожним кадром.

 ```js
  function Update() //Обновление игры
{
    roads[0].Update(roads[1]);
    roads[1].Update(roads[0]);
 
    Draw();
}
  ```

Залишається тільки додати висновок цих зображень:

  ```js
 function Draw() //Робота з графікою
{
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Очищення полотна від попереднього кадру
 
    for(var i = 0; i < roads.length; i++)
    {
        ctx.drawImage
        (
            roads[i].image, //Зображення для відтворення
            0, //Початкове положення по осі X на зображенні
            0, //Початкове положення по осі Y на зображенні
            roads[i].image.width, //Ширина зображення
            roads[i].image.height, //Висота зображення
            roads[i].x, //Положення по осі X на полотні
            roads[i].y, //Положення по осі Y на полотні
            canvas.width, //Ширина зображення на полотні
            canvas.width //Так як ширина і висота фону однакові, як висоти вказується ширина
        );
    }
}
  ```
Пора додати гравця і NPC. Для цього потрібно написати клас Hero. У ньому буде метод Move (), за допомогою якого гравець управляє своїм автомобілем. Рух NPC буде здійснюватися за допомогою Update (), в якому просто змінюється координата Y. 

  ```js
  class Hero
{
    constructor(image, x, y)
    {
        this.x = x;
        this.y = y;
 
        this.image = new Image();
 
        this.image.src = image;
    }
 
    Update()
    {
        this.y += speed;
    }
 
    Move(v, d) 
    {
        if(v == "x") //Переміщення по осі X
        {
            this.x += d; //Зсув
 
            //Якщо при зміщенні об'єкт виходить за краї полотна, то зміни відкочуються
            if(this.x + this.image.width * scale > canvas.width)
            {
                this.x -= d; 
            }
    
            if(this.x < 0)
            {
                this.x = 0;
            }
        }
        else //Переміщення по осі Y
        {
            this.y += d;
 
            if(this.y + this.image.height * scale > canvas.height)
            {
                this.y -= d;
            }
 
            if(this.y < 0)
            {
                this.y = 0;
            }
        }
        
    }
}
  ```

Створимо перший об'єкт, щоб перевірити.

  ```js
  var objects = 
[
    new Hero("images/hero.png", 15, 10)
]; //Масив ігрових об'єктів
var player = 0; //Номер об'єкта, яким керує гравець
  ```

Тепер в функцію Draw () потрібно додати команду відтворення автомобілів.

  ```js
  for(var i = 0; i < objects.length; i++)
{
    ctx.drawImage
    (
        objects[i].image, //Зображення для відтворення
        0, //Початкове положення по осі X на зображенні
        0, //Початкове положення по осі Y на зображенні
        objects[i].image.width, //Ширина зображення
        objects[i].image.height, //Висота зображення
        objects[i].x, //Положення по осі X на полотні
        objects[i].y, //Положення по осі Y на полотні
        objects[i].image.width * scale, //Ширина зображення на полотні, помножена на масштаб
        objects[i].image.height * scale //Висота зображення на полотні, помножена на масштаб
    );
}
  ```

У функцію KeyDown (), яка викликається при натисканні на клавіатуру, потрібно додати виклик методу Move ().

  ```js
  function KeyDown(e)
{
    switch(e.keyCode)
    {
        case 37: //Вліво
            objects[player].Move("x", -speed);
            break;
 
        case 39: //Вправо
            objects[player].Move("x", speed);
            break;
 
        case 38: //Вгору
            objects[player].Move("y", -speed);
            break;
 
        case 40: //Вниз
            objects[player].Move("y", speed);
            break;
 
        case 27: //Esc
            if(timer == null)
            {
                Start();
            }
            else
            {
                Stop();
            }
            break;
    }
}
  ```
  
# Генерація ігрових об'єктів

Наступний крок - додавання ворогів. Вони будуть створюватися на ходу і віддалятися, коли зайдуть за край.

Для цього знадобиться функція генерації випадкових чисел:

  ```js
  function RandomInteger(min, max) 
{
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
  ```
  
З її допомогою в функції Update () з певною ймовірністю буде створюватися об'єкт і додаватися в масив objects:
  ```js
  if(RandomInteger(0, 10000) > 9700)
{
    objects.push(new Hero("images/enemy.png", RandomInteger(30, canvas.width - 50), RandomInteger(250, 400) * -1));
}
  ```
При зіткненні поки нічого не відбувається, але це буде виправлено пізніше. Спочатку потрібно переконатися, що об'єкти, які зникли з поля зору, видаляються. Це потрібно, щоб не забивати оперативну пам'ять.

В клас Hero додаємо поле dead зі значенням false, а потім міняємо його в методі Update ():
 
  ```js
  if(this.y > canvas.height + 50)
{
    this.dead = true;
}
  ```
Тепер потрібно змінити функцію поновлення гри, замінивши там код, пов'язаний з об'єктами:

  ```js
  var hasDead = false;
 
for(var i = 0; i < objects.length; i++)
{
    if(i != player)
    {
        objects[i].Update();
 
        if(objects[i].dead)
        {
            hasDead = true;
        }
    }
}
 
if(hasDead)
{
    objects.shift();
}
  ```

Якщо не видаляти об'єкти, то гра почне гальмувати комп'ютер, коли буде згенеровано занадто багато машин.

# Зіткнення ігрових об'єктів

Тепер можна приступити до реалізації колізії (англ. Collision - зіткнення). Для це потрібно написати для класу Hero метод Collide (), в якому будуть перевірятися координати героїв:

  ```js
  Collide(hero)
{
    var hit = false;
 
    if(this.y < hero.y + hero.image.height * scale && this.y + this.image.height * scale > hero.y) //Якщо об'єкти знаходяться на одній лінії по горизонталі
    {
        if(this.x + this.image.width * scale > hero.x && this.x < hero.x + hero.image.width * scale) //Якщо об'єкти знаходяться на одній лінії по вертикалі
        {
            hit = true;
        }
    }
 
    return hit;
}
  ```

Тепер потрібно в функцію Update () додати перевірку колізії:

  ```js
  var hit = false;
 
for(var i = 0; i < objects.length; i++)
{
    if(i != player)
    {
        hit = objects[player].Collide(objects[i]);
 
        if(hit)
        {
            alert("You are dead!");
            Stop();
            break;
        }
    }
}
  ```
  
 ## Матеріал підготував 
* *студент групи ІВ-92 Гаргаєв Кирило* - [KirillGargaiev](https://github.com/KirillGargaiev) 
