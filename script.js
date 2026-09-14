const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
let from = document.querySelector("#fromCurrency .selected").dataset.value;
let to = document.querySelector("#toCurrency .selected").dataset.value;
let fromIn = document.querySelector("#fromAmount");
let toIn = document.querySelector("#toAmount");
const btn = document.querySelector("#convertBtn");
const invbtn = document.querySelector("#invertBtn");



document.addEventListener("DOMContentLoaded", () => {    
    document.querySelectorAll(".custom-select").forEach((select) => {       
        const selected = select.querySelector(".selected");
        const options = select.querySelector(".options");
        const img = select.parentElement.querySelector("img");


        select.addEventListener("mouseenter", () => {
            options.classList.add("open");     
        });

        select.addEventListener("mouseleave", () => {
            options.classList.remove("open");     
        });

        selected.addEventListener("click", () => {
            options.classList.toggle("open");       
        });



        options.querySelectorAll("[data-value]").forEach((option) => {
            option.addEventListener("click", () => {
                selected.innerHTML = `${option.innerText} <span>▾</span>`;
                selected.dataset.value = option.dataset.value;
                console.log(selected.dataset.value);
                options.classList.remove("open");
                updateFlag(selected.dataset.value, img);
                if (select.id === "fromCurrency") {
                    from = selected.dataset.value;
                } else {
                    to = selected.dataset.value;
                }
            });
        });
    });
});

const updateFlag = (currCode, img) => {
    let countryCode = countryList[currCode];
    let newSrc = `https://flagcdn.com/h20/${countryCode.toLowerCase()}.png`;
    img.src = newSrc;


}

const doConversion = async (source,target) =>{
    const URL = `${BASE_URL}/${source.toLowerCase()}.json`;
    let response = await fetch(URL);
    let data = await response.json();
    let rate = data[source.toLowerCase()][target.toLowerCase()];
    console.log(data);
    return { rate, data} ;
}

const updateExchangeRate = async () => {
  const { rate, data} =await doConversion(from,to);
   console.log(rate);
    result.textContent = `1 ${from} = ${rate} ${to}`;
    resultTime.textContent = `On Date: ${data.date}`;
}

btn.addEventListener("click", () => {
updateExchangeRate();
    })


invbtn.addEventListener("click", async() => {
    let x = from;
    from = to;
    to = x;


    const fromSelected = document.querySelector("#fromCurrency .selected");
    const toSelected = document.querySelector("#toCurrency .selected");

    const fromImg = document.querySelector("#fromCurrency").parentElement.querySelector("img");
    const toImg = document.querySelector("#toCurrency").parentElement.querySelector("img");


    let tempHTML = fromSelected.innerHTML;
    fromSelected.innerHTML = toSelected.innerHTML;
    toSelected.innerHTML = tempHTML;

    fromSelected.dataset.value = from;
    toSelected.dataset.value = to;

    let tempVal = fromIn.value;
    fromIn.value = toIn.value;
    toIn.value = tempVal;

    updateFlag(from, fromImg);
    updateFlag(to, toImg);
updateExchangeRate();
})





const inputs = document.querySelectorAll("#fromAmount, #toAmount");

inputs.forEach((input) => {
    input.addEventListener("input", async () => {
        const sourceIn = input.id === "fromAmount" ? fromIn : toIn;
        const targetIn = input.id === "fromAmount" ? toIn : fromIn;
        const sourceCurrency = input.id === "fromAmount" ? from : to;
        const targetCurrency = input.id === "fromAmount" ? to : from;

        if (sourceIn.value === "" || sourceIn.value < 1) {
            targetIn.value = "";
            return;
        }

        const { rate, data } = await doConversion(sourceCurrency, targetCurrency);
        console.log(rate);

        targetIn.value = (sourceIn.value * rate)
    });

});

/* CURRENT WEAKNESS:
Race condition on fast typing: every keystroke fires a fetch.
 If someone types "100" quickly, three requests go out and whichever resolves last wins — not necessarily the one for "100".*/