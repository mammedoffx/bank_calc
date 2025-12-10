const rate = {
  AZN: 1,
  USD: 1.7,
  EUR: 1.98,
  RUB: 0.0198
};

function convert() {
    let amount = +document.getElementById("from").value;
    let from   = document.getElementById("fromCur").value;
    let to     = document.getElementById("to").value;

    document.getElementById("toValue").value = ((amount * rate[from]) / rate[to]).toFixed(2);
}


document.addEventListener("DOMContentLoaded", () => {

    const amount  = document.getElementById("amount");
    const months  = document.getElementById("months");
    const percent = document.getElementById("percent");
    const amountText  = amount.parentElement.querySelector(".slider-value");
    const monthsText  = months.parentElement.querySelector(".slider-value");
    const percentText = percent.parentElement.querySelector(".slider-value");

    const paymentEl = document.querySelector(".payment-main");

    function calculate() {

        let a = +amount.value;
        let m = +months.value;
        let p = +percent.value;

        amountText.innerText  = a.toLocaleString() + " ₼";
        monthsText.innerText  = m + " ay";
        percentText.innerText = p + "%";

        let i = p / 100 / 12;
        let pay = a * (i / (1 - Math.pow(1 + i, -m)));

        paymentEl.innerHTML = pay.toFixed(2) + ' <span class="currency">₼</span>';
    }

    calculate();

    amount.oninput  =
    months.oninput  =
    percent.oninput = calculate;

});




document.addEventListener("DOMContentLoaded", () => {

    const amountSlider = document.getElementById("dep_amount");
    const amountText   = document.getElementById("dep_amount_value");
    const monthButtons = document.querySelectorAll(".dep-month");
    const totalEl  = document.getElementById("dep_total");
    const monthlyEl = document.getElementById("dep_monthly");
    const rateEl   = document.getElementById("dep_rate");
    const aznBtn = document.getElementById("dep_azn");
    const usdBtn = document.getElementById("dep_usd");
 
    const ratesAZN = {
        3: 8,
        6: 8.5,
        12: 8.5,
        18: 9,
        24: 7.5,
        36: 7.5
    };

    const ratesUSD = {
        3: 2,
        6: 2.5,
        12: 3,
        18: 3,
        24: 2.2,
        36: 2.5
    };

    let currency = "AZN";
    let selectedMonths = 3;

    window.selectCurrency = function(cur) {
        currency = cur;

        if (cur === "AZN") {
            aznBtn.style.background = "#000";
            aznBtn.style.color = "#fff";

            usdBtn.style.background = "transparent";
            usdBtn.style.color = "#6b7280";
        } else {
            usdBtn.style.background = "#000";
            usdBtn.style.color = "#fff";

            aznBtn.style.background = "transparent";
            aznBtn.style.color = "#6b7280";
        }

        calculate();
    };

    window.selectMonths = function(btn, months) {
        selectedMonths = months;

        monthButtons.forEach(b => {
            b.style.background = "#f3f4f6";
            b.style.color = "#000";
            b.style.border = "none";
        });

        btn.style.color = "#000";
        btn.style.border = "2px solid #000";

        calculate();
    };

    function calculate() {
        let amount = Number(amountSlider.value);

        amountText.innerText = amount.toLocaleString() + " " + (currency === "AZN" ? "₼" : "$");

        let rate = currency === "AZN" ? ratesAZN[selectedMonths] : ratesUSD[selectedMonths];
        let monthly = (amount * (rate / 100)) / 12;
        let total = monthly * selectedMonths;

        totalEl.innerHTML = total.toFixed(2) + ` <span class="currency">${currency === "AZN" ? "₼" : "$"}</span>`;
        monthlyEl.innerText = monthly.toFixed(2) + " " + (currency === "AZN" ? "₼" : "$");
        rateEl.innerText = rate + " %";
    }

    amountSlider.addEventListener("input", calculate);

    calculate();
});



document.addEventListener("DOMContentLoaded", () => {

    const priceSlider  = document.getElementById("car_price");  
    const downSlider   = document.getElementById("car_down");  
    const monthsSlider = document.getElementById("car_months"); 
    const monthlyEl    = document.getElementById("car_monthly");
    const creditAmountEl = document.getElementById("car_credit_amount");
    const rateEl       = document.getElementById("car_rate");
    const commissionEl = document.getElementById("car_commission");
    const totalEl      = document.getElementById("car_total");
    const btnElectric = document.getElementById("car_electric");
    const btnHybrid   = document.getElementById("car_hybrid");
    const btnOther    = document.getElementById("car_other");

    const interestRates = {
        electric: 14,
        hybrid: 14.5,
        other: 15
    };


    const downPaymentRanges = {
        electric: { min: 10, max: 90 },
        hybrid:  { min: 20, max: 90 },
        other:   { min: 40, max: 90 }
    };

    let carType = "electric";


    window.selectCarType = function(type) {
        carType = type;


        [btnElectric, btnHybrid, btnOther].forEach(btn => {
            btn.style.background = "#f3f4f6";
            btn.style.color = "#6b7280";
        });


        if (type === "electric") {
            btnElectric.style.background = "#000";
            btnElectric.style.color = "#fff";
        } else if (type === "hybrid") {
            btnHybrid.style.background = "#000";
            btnHybrid.style.color = "#fff";
        } else {
            btnOther.style.background = "#000";
            btnOther.style.color = "#fff";
        }

        const range = downPaymentRanges[type];
        downSlider.min = range.min;
        downSlider.max = range.max;

        if (Number(downSlider.value) < range.min) {
            downSlider.value = range.min;
        }

        calculate();
    };


    function calculate() {
        let price  = Number(priceSlider.value);
        let down   = Number(downSlider.value);
        let months = Number(monthsSlider.value);
        let rate   = interestRates[carType];
        let downAmount = price * (down / 100);
        let creditAmount = price - downAmount;
        let commission = Math.max(creditAmount * 0.005, 20);
        let i = rate / 100 / 12;
        let monthly = creditAmount * (i / (1 - Math.pow(1 + i, -months)));
        let total = (monthly * months) + commission;

        monthlyEl.innerText      = monthly.toFixed(2) + " ₼";
        creditAmountEl.innerText = creditAmount.toFixed(2) + " ₼";
        rateEl.innerText         = rate + " %";
        commissionEl.innerText   = commission.toFixed(2) + " ₼";
        totalEl.innerText        = total.toFixed(2) + " ₼";
    }

    priceSlider.oninput  = calculate;
    downSlider.oninput   = calculate;
    monthsSlider.oninput = calculate;
    calculate();
});


document.addEventListener("DOMContentLoaded", () => {

    const amountSlider = document.getElementById("ip_amount");
    const yearsSlider  = document.getElementById("ip_years");
    const amountText = document.getElementById("ip_amount_text");
    const yearsText  = document.getElementById("ip_years_text");
    const monthlyEl = document.getElementById("ip_monthly");
    const totalAmountEl = document.getElementById("ip_total_amount");
    const rateEl = document.getElementById("ip_rate");
    const rateButtons = document.querySelectorAll(".rate-btn");

    let selectedRate = 12;

    window.selectRate = function(button, rate) {
        selectedRate = rate;

        rateButtons.forEach(b => {
            b.classList.remove("active");
            b.style.background = "#f3f4f6";
            b.style.color = "#6b7280";
            b.style.border = "none";
        });

        button.classList.add("active");
        button.style.background = "#f3f4f6";
        button.style.color = "#000";
        button.style.border = "2px solid #000";

        calculate();
    }

    function calculate() {
        let amount = Number(amountSlider.value);
        let years = Number(yearsSlider.value);
        let months = years * 12;
        let rate = selectedRate;

        amountText.innerText = amount.toLocaleString() + " ₼";
        yearsText.innerText = years + " il";

        let i = rate / 100 / 12;
        let monthly = amount * (i / (1 - Math.pow(1 + i, -months)));

        monthlyEl.innerText = monthly.toFixed(2) + " ₼";
        totalAmountEl.innerText = amount.toFixed(2) + " ₼";
        rateEl.innerText = rate + " %";
    }

    amountSlider.oninput = calculate;
    yearsSlider.oninput = calculate;

    calculate();
});