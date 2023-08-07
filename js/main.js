const $containerFront = document.querySelector('.front');
const $containerForm = document.querySelector('.form');
const $containerCards = document.querySelector('.cards');
const $btnCreateCustomer = document.getElementById('btn-create');
const $btnShowCustomers = document.getElementById('btn-show');
const $btnBack = document.querySelector('.btn-back');
const $form = document.forms.form;
const changeRegistr = document.getElementById('registration');
const btnSubmit = document.getElementById('submit');

$btnBack.style.display = 'none';
$containerForm.style.display = 'none';
$containerCards.style.display = 'none';

const username = document.getElementById('username');
const age = document.getElementById('age');
const email = document.getElementById('email');
const tel = document.getElementById('tel');
const card = document.getElementById('card');
const password = document.getElementById('password');
const rePassword = document.getElementById('repassword');

const patternUsername = /^[A-ZА-Я][a-zа-я]{1,}\s[A-ZА-Я][a-zа-я]{1,}$/;
const patternAge = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/;
const patternEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const patternTel = /^[\+]?3?[\s]?8?[\s]?\(?0\d{2}?\)?[\s]?\d{3}[\s|-]?\d{2}[\s|-]?\d{2}$/;
const patternCard = /^\d{4}([\s]|)\d{4}([\s]|)\d{4}([\s]|)\d{4}$/;

let valueUsername;
let valueAge;
let valueEmail;
let valueTel;
let valueCard;
let valuePassword;
let valueRePassword;
let id;

const value = localStorage.getItem('getUser');
let list = value ? JSON.parse(value) : [];
let users;
let $clickedEl;

$btnCreateCustomer.addEventListener('click', function () {
    $form.elements.id = null;
    $containerForm.style.display = 'block';
    $containerFront.style.display = 'none';
    $containerCards.style.display = 'none';
    $btnBack.style.display = 'block';
    changeRegistr.textContent = 'Registration';
    btnSubmit.textContent = 'Submit';
    $form.reset();
    showEmptyForm();
});

$btnShowCustomers.addEventListener('click', function () {
    $containerForm.style.display = 'none';
    $btnShowCustomers.style.display = 'none';
    $containerCards.style.display = 'flex';
    $btnBack.style.display = 'block';
    getUser();
    if (list.length === 0) {
        $containerCards.innerHTML = 'no users added';
        $btnBack.style.display = 'none';
    }
});

$btnBack.addEventListener('click', function () {
    $containerCards.style.display = 'none';
    $containerForm.style.display = 'none';
    $containerFront.style.display = 'flex';
    $btnShowCustomers.style.display = 'block';
    $btnBack.style.display = 'none';
    showEmptyForm();
});

//form
$form.addEventListener('submit', function (event) {
    event.preventDefault();
    checkAll();
    checkInput();
    valueUsername = $form.elements.username.value;
    valueAge = $form.elements.age.value;
    valueEmail = $form.elements.email.value;
    valueTel = $form.elements.tel.value;
    valueCard = $form.elements.card.value;
    valuePassword = $form.elements.password.value;
    valueRePassword = $form.elements.repassword.value;
    id = $form.elements.id ? $form.elements.id : "id" + Math.random().toString(6).slice(2);
    if (checkCorrect(username, patternUsername) === true && checkCorrect(age, patternAge) === true && checkCorrect(email, patternEmail) === true && checkCorrect(tel, patternTel) === true && checkCorrect(card, patternCard) === true && checkLength(password, 7, 20) && checkPasswordMatch(password, rePassword) === true) {
        $containerForm.style.display = 'none';
        $containerCards.style.display = 'none';
        $containerFront.style.display = 'flex';
        $btnShowCustomers.style.display = 'block';
        if ($form.elements.id) {
            list = list.map((el) => el.id === $form.elements.id ? { id: id, name: valueUsername, age: valueAge, email: valueEmail, tel: valueTel, card: valueCard, password: valuePassword, rePassword: valueRePassword } : el);
            $containerCards.style.display = 'flex';
            $btnShowCustomers.style.display = 'none';
            $btnBack.style.display = 'block';
            getUser();
        } else list.push({ id: id, name: valueUsername, age: valueAge, email: valueEmail, tel: valueTel, card: valueCard, password: valuePassword, rePassword: valueRePassword });
        localStorage.setItem('getUser', JSON.stringify(list));
        $containerCards.style.display = 'flex';
        $btnShowCustomers.style.display = 'none';
        getUser();
    }
});

function checkAll() {
    checkRequired([username, age, email, tel, card, password, rePassword]);
    checkLength(password, 7, 20);
    checkCorrect(username, patternUsername);
    checkCorrect(age, patternAge);
    checkCorrect(email, patternEmail);
    checkCorrect(tel, patternTel);
    checkCorrect(card, patternCard);
};

function checkInput() {
    $form.addEventListener('input', function (event) {
        event.preventDefault();
        let formControl = document.querySelectorAll('.form-control');
        const input = document.querySelectorAll('input');
        for (let i = 0; i < input.length; i++) {
            if (input[i].value === '') {
                formControl[i].className = 'form-control';
            } else {
                checkAll()
            }
        }
    });
};

function getFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
};

function showEmptyForm() {
    let formControl = document.querySelectorAll('.form-control');
    for (let i = 0; i < formControl.length; i++) {
        formControl[i].className = 'form-control';
    }
};

function showError(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    formControl.className = 'form-control error';
    small.textContent = message;
};

function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
};

function checkRequired(inputArr) {
    inputArr.forEach((input) => {
        if (input.value.trim() === "") {
            showError(input, `${getFieldName(input)} is required`);
            return false;
        }
        showSuccess(input);
        return true;
    });
};

function checkLength(input, min, max) {
    if (input.value.length < min) {
        showError(input, `${getFieldName(input)} must be at least ${min} characters`);
        return false;
    } else if (input.value.length > max) {
        showError(input, `${getFieldName(input)} must be less than ${max} characters`);
        return false;
    } showSuccess(input);
    return true;
};

function checkCorrect(input, pattern) {
    if (pattern.test(input.value.trim())) {
        showSuccess(input);
        return true;
    } showError(input, `${getFieldName(input)} is not valid`);
    return false;
};

function checkPasswordMatch(inputPass, inputRePass) {
    if (inputPass.value !== inputRePass.value) {
        showError(inputRePass, 'Password do not match');
        return false;
    } return true;
};

//list
$containerCards.addEventListener('click', function (event) {
    $clickedEl = event.target;
});

function getUser() {
    const value = localStorage.getItem('getUser');
    list = JSON.parse(value);
    if (list === null) {
        list = [];
    } else {
        outputList(list);
    }
};

function outputList(list) {
    $containerCards.innerHTML = '';
    for (let i = 0; i < list.length; i++) {
        const elem = document.createElement('div');
        elem.setAttribute('data-id', list[i].id);
        elem.textContent = list[i].name;
        elem.classList.add('card');
        $containerCards.appendChild(elem);
        const info = document.createElement('div');
        const view = document.createElement('button');
        const edit = document.createElement('button');
        const remove = document.createElement('button');
        info.classList.add('card');
        view.classList.add('card-btn');
        edit.classList.add('card-btn');
        remove.classList.add('card-btn');
        edit.setAttribute('data-id', list[i].id);
        remove.setAttribute('data-id', list[i].id);
        view.textContent = 'view';
        edit.textContent = 'edit';
        remove.textContent = 'remove';
        elem.appendChild(view);
        elem.appendChild(edit);
        elem.appendChild(remove);
        info.innerHTML = '';
        view.addEventListener('click', function () {
            elem.innerHTML = '';
            elem.appendChild(info);
            const close = document.createElement('div');
            close.classList.add('close');
            close.addEventListener('click', () => {
                elem.textContent = list[i].name;
                elem.appendChild(view);
                elem.appendChild(edit);
                elem.appendChild(remove);
            });
            info.innerHTML = `user: ${list[i].name}<br>age: ${list[i].age}<br>email: ${list[i].email}<br>tel: ${list[i].tel}<br>card: ${list[i].card}`;
            info.appendChild(close);
        });
        edit.addEventListener('click', function () {
            $containerForm.style.display = 'block';
            changeRegistr.textContent = 'Edit user';
            btnSubmit.textContent = 'Save';
            $form.elements.username.value = list[i].name;
            $form.elements.age.value = list[i].age;
            $form.elements.email.value = list[i].email;
            $form.elements.tel.value = list[i].tel;
            $form.elements.card.value = list[i].card;
            $form.elements.password.value = list[i].password;
            $form.elements.id = list[i].id;
        });
        remove.addEventListener('click', function () {
            $containerForm.style.display = 'none';
            elem.innerHTML = '';
            elem.appendChild(info);
            info.textContent = `Are you sure you want to delete user: ${list[i].name}?`;
            const btnAgree = document.createElement('button');
            const btnDisAgree = document.createElement('button');
            btnAgree.textContent = 'yes';
            btnDisAgree.textContent = 'no';
            btnAgree.classList.add('card-btn');
            btnDisAgree.classList.add('card-btn');
            info.appendChild(btnAgree);
            info.appendChild(btnDisAgree);
            btnAgree.addEventListener('click', removeElem);
            btnDisAgree.addEventListener('click', () => {
                elem.textContent = list[i].name;
                elem.appendChild(view);
                elem.appendChild(edit);
                elem.appendChild(remove);
                $containerForm.style.display = 'none';
            });
        });
    }
};

function removeElem() {
    $containerForm.style.display = 'none';
    if ($clickedEl.tagName === 'BUTTON') {
        list = list.filter((item) => item.id !== $clickedEl.getAttribute('data-id'));
        localStorage.setItem('getUser', JSON.stringify(list));
        outputList(list);
        if (list.length === 0) {
            $containerCards.innerHTML = 'no users added';
            $btnBack.style.display = 'none';
        }
    }
};