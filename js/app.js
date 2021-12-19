const packageWrapper = document.querySelector("#package");
const choosePackage = packageWrapper.querySelector(".select__input");

const products = document.querySelector("#products");
const orders = document.querySelector("#orders");
const accounting = document.querySelector("#accounting");
const terminal = document.querySelector("#terminal");

const totalPrice = document.querySelector("#total-price");

const packagePrices = {
    basic: 0,
    professional: 25,
    premium: 60,
}

const additionalPrices = {
    accounting: 35,
    terminal: 5,
}

const formItemsPrices = {
    products: 0,
    orders: 0,
    package: 0,
    terminal: 0,
    accounting: 0,
}

const multipliers = {
    products: 0.5,
    orders: 0.75,
}

function handlePackageOptionsSelection(e) {
    e.currentTarget.classList.toggle("open");

    if (e.target.tagName === "LI") {
        const optionLabel = e.target.innerText;

        choosePackage.innerText = optionLabel;
        choosePackage.classList.add("selected");

        const packageType = e.target.dataset.value;
        const packagePrice = packagePrices[packageType];

        const listItem = document.querySelector(`.calc__summary .list__item[data-id=package]`);
        listItem.querySelector(".item__calc").innerText = packageType[0].toUpperCase() + packageType.slice(1);
        listItem.querySelector(".item__price").innerText = `$${packagePrice}`;
        formItemsPrices.package = packagePrice;

        listItem.classList.add("open");

        calculateTotalPrice();
    }
}

function isPositiveInteger(data) {
    if (data && data.trim().length > 0) { //sprawdzam czy nie jest pustym stringiem
        return Number.isInteger(Number(data)) && Number(data) > 0
    }
    return false;
}

function handleNumberInputValidation(e) {
    const errorElement = e.currentTarget.parentElement.querySelector("p.error__text");

    if (!isPositiveInteger(e.target.value)) {
        e.currentTarget.classList.add("error");
        if (!errorElement){
            const errorMessage = document.createElement("p");
            errorMessage.classList.add("error__text")
            errorMessage.innerText = "Only positive integers";
            e.currentTarget.parentElement.appendChild(errorMessage);
        }
    } else {
        e.currentTarget.classList.remove("error");
        errorElement && e.currentTarget.parentElement.removeChild(errorElement);
    }
    calculateInputValue(e.currentTarget);
}

function calculateInputValue(input) {
    const listItem = document.querySelector(`.calc__summary .list__item[data-id=${input.id}]`);
    const multiplier = multipliers[input.id] || 1;

    if (isPositiveInteger(input.value)) {
        listItem.classList.add("open");

        listItem.querySelector(".item__calc").innerText = `${input.value} * $${multiplier}`
        listItem.querySelector(".item__price").innerText = `$${input.value * multiplier}`

        formItemsPrices[input.id] = input.value * multiplier;
    } else {
        listItem.classList.remove("open");
        formItemsPrices[input.id] = 0;
    }
    calculateTotalPrice();
}

function handleCheckboxClick(e) {
    const listItem = document.querySelector(`.calc__summary .list__item[data-id=${e.target.id}]`);
    let additionalCost = additionalPrices[e.target.id] || 0;

    if (e.target.checked) {
        listItem.classList.add("open");
    } else {
        listItem.classList.remove("open");
        additionalCost = 0;
    }
    listItem.querySelector(".item__price").innerText = `$${additionalCost}`;
    formItemsPrices[e.target.id] = additionalCost;
    calculateTotalPrice();
}

function calculateTotalPrice() {
    totalPrice.classList.add("open");
    let result = 0;
    totalPrice.querySelector(".total__price").innerText = `$${result}`;
    // const prices = [...document.querySelectorAll(".item__price")].map((el) => Number(el.innerText.slice(1)));

    const prices = Object.values(formItemsPrices);
    console.log(prices);
    result = prices.reduce((prev, curr) => prev + curr);
    console.log(result);
    totalPrice.querySelector(".total__price").innerText = `$${result}`

}

packageWrapper.addEventListener("click", handlePackageOptionsSelection);
products.addEventListener("change", handleNumberInputValidation);
orders.addEventListener("change", handleNumberInputValidation);
accounting.addEventListener("click", handleCheckboxClick)
terminal.addEventListener("click", handleCheckboxClick)
