'use strict';
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-03-28T16:33:06.386Z',
    '2023-04-02T14:43:26.374Z',
    '2023-04-04T18:49:59.371Z',
    '2023-04-06T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Mohammed abbou',
  movements: [100, 100],
  interestRate: 1.5,
  pin: 8777,

  movementsDates: ['2023-04-04T18:49:59.371Z',
    '2023-04-06T12:01:20.894Z'],
  currency: 'USD',
  locale: 'ar-DZ',
};

const account4 = {
  owner: 'abdou bou',
  movements: [100, 100],
  interestRate: 1.3,
  pin: 2005,

  movementsDates: ['2023-04-04T18:49:59.371Z',
    '2023-04-06T12:01:20.894Z'],
  currency: 'USD',
  locale: 'ar-DZ',
};
const account5 = {
  owner: 'khalil ben',
  movements: [100, 100],
  interestRate: 1.2,
  pin: 1234,

  movementsDates: ['2023-04-04T18:49:59.371Z',
    '2023-04-06T12:01:20.894Z'],
  currency: 'USD',
  locale: 'ar-DZ',
};



const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnLogout = document.querySelector('.btn--logout')

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const showAcc = document.querySelector('.show-acc')

// Functions

const getTheDate = function (D, locale) {
  const calcDaysPassed = (date1, date2) => Math.floor(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24))
  const date = new Date(D)
  const daysPassed = calcDaysPassed(new Date(), date)

  if (daysPassed === 0) return 'Today'
  if (daysPassed === 1) return 'Yesterday'
  if (daysPassed < 7) return `${daysPassed} days ago`
  if (daysPassed >= 7 && daysPassed < 14) return `weak ago`
  return new Intl.DateTimeFormat(locale).format(date)
}

const formatMoney = (money, currency) => new Intl.NumberFormat(currentAccount.locale, {
  style: 'currency',
  currency: currency
}).format(money)

const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
      btnLogout.style.opacity = 0;
      btnLogout.style.display = 'none';
      showAcc.classList.remove('hidden')
    }
    time--;
  };
  let time = 10;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? currentAccount.movements.slice().sort((a, b) => a - b) : currentAccount.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${getTheDate(currentAccount.movementsDates[i], currentAccount.locale)}</div>
        <div class="movements__value">${formatMoney(mov, currentAccount.currency)}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatMoney(acc.balance, currentAccount.currency)}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatMoney(incomes, currentAccount.currency)}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatMoney(Math.abs(out), currentAccount.currency)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${formatMoney(interest, currentAccount.currency)}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

// Event handlers
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const dateNow = new Date()
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    labelDate.innerHTML = `${Intl.DateTimeFormat(currentAccount.locale, {
      hour: 'numeric',
      minute: 'numeric',
      day: '2-digit',
      month: 'narrow',
      year: 'numeric'
    }).format(dateNow)}`
    showAcc.classList.add('hidden')
    
    containerApp.style.opacity = 1;
    btnLogout.style.opacity = 1;
    btnLogout.style.display = 'block';
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    labelTimer.textContent = ''
    updateUI(currentAccount);
    if (timer) clearInterval(timer)
    timer = startLogoutTimer()
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date())
    receiverAcc.movementsDates.push(new Date());
    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(+inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date());
      updateUI(currentAccount)

    }, 1000)
    clearInterval(timer);
    timer = startLogoutTimer();
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
btnLogout.addEventListener('click', (e) => {
  e.preventDefault();
  containerApp.style.opacity = 0
  btnLogout.style.opacity = 0
  showAcc.classList.remove('hidden')
})
