//----- VARIABLES -----
const form = document.getElementById('form');
const inputArray = Array.from(form.querySelectorAll('input[placeholder="0"]'))
const buttons = Array.from(document.querySelectorAll('button[type=button]'));
const bill = inputArray.filter(input => input.id === 'bill')[0]
const numberPeople = inputArray.filter(input => input.id === 'number-people')[0]
const tipInput = document.getElementById('tip')
const tipAmount = document.getElementById('tip-amount')
const total = document.getElementById('total')

//------EVENTOS--------

//Validar campos de bill y number-people
inputArray.forEach((input) => {

    input.addEventListener("blur", (e) => {

        e.preventDefault();
        if (!zeroValidation(e)) updateTipTotal();

    })
})

//Click en un tip button
buttons.forEach((button) => {

    button.addEventListener("click", (e) => {

        deleteTip()
        e.target.classList.add('active')
        updateTipTotal()

    })
})

//Click en el input de tip
tip.addEventListener('click', (e) => {
    deleteTip()
    updateTipTotal()
})
//Cambio de foco en el input de tip
tip.addEventListener('blur', (e) => {
    updateTipTotal()
})

//Click en Reset button
const resetButton = document.querySelector('button[type=reset]')
resetButton.addEventListener('click', (e) => {
    bill.value = ''
    numberPeople.value = ''
    tipAmount.textContent = '$0.00'
    total.textContent = '$0.00'
    tipInput.value = ''
    deleteTip()
})


//------FUNCIONES-------

//Eliminar boton de tip seleccionado
function deleteTip() {
    buttons.forEach((button) => {
        if (button.classList.contains('active')) {
            button.classList.remove('active')
        }
    })
}

//Valida que los campos no sean 0, si es asi cambia estilo y pone mensaje, retorna true/false.
function zeroValidation(e) {
    //Variables 
    const input = e.target
    const value = input.value.trim()
    const divLabel = document.getElementById(`div-label-${e.target.id}`)
    const existingMessage = divLabel.querySelector(".is-zero-label");

    const isInvalid = value === "0" || value === '';

    //Si es 0 o vacio se pone borde rojo
    input.classList.toggle('is-zero', isInvalid);

    if (isInvalid) {
        if (!existingMessage) {
            //Si no hay mensaje aun se pone uno
            const message = document.createElement('P')
            message.textContent = "Can't be zero";
            message.classList.add('is-zero-label')
            divLabel.appendChild(message)
        }
    } else {
        //Si hay mensaje se eliminan
        if (existingMessage) existingMessage.remove()
    }
    return isInvalid
}

//Calcular y cambia en el HTML los valores del tip amount y total
function updateTipTotal() {

    //Extraer valores de bill, number people y tip
    const billValue = getBill(bill);
    const numberPeopleValue = getNumberPeople(numberPeople)
    let tipValue = getTip();

    //Validar que ni bill ni numberPeople sea 0 o NaN
    if (isInvalidInput(billValue, numberPeopleValue)) return;

    //Calcular valores
    const tipAmountValue = calculateTipPerson(billValue, numberPeopleValue, tipValue);
    const totalValue = calculateTotalPerson(billValue, numberPeopleValue, tipValue);

    //Extraer elementos y asigan valores
    tipAmount.textContent = `$${tipAmountValue}`;
    total.textContent = `$${totalValue}`;

    //Cambiar estado del boton
    resetButton.classList.add('active')
}

//------FUNCIONES AUXILIARES-------

//Parsea el input bill
function getBill(bill) {
    return parseFloat(bill.value);
}

//Parsea el input numberPeople
function getNumberPeople(numberPeople) {
    return parseInt(numberPeople.value);
}

//Busca el boton de tip seleccionado, si no hay busca si hay valor en el input de tip, sino retorna 0
function getTip() {
    const selected = buttons.find(button => button.classList.contains('active'))
    if (selected) return parseFloat(selected.innerText);
    if (tipInput.value) return parseFloat(tipInput.value.replace('%', ''));
    return 0;
}

//Validar si los valores de bill y numberPeople no son ni 0 ni Nan
function isInvalidInput(billValue, numberPeopleValue) {
    return (Number.isNaN(billValue) || Number.isNaN(numberPeopleValue) || billValue <= 0 || numberPeopleValue <= 0)
}

//Calcula el tip por persona
function calculateTipPerson(billValue, numberPeopleValue, tip) {
    return parseFloat((billValue * tip / 100) / numberPeopleValue).toFixed(2);
}

//Calcular el total por persona
function calculateTotalPerson(billValue, numberPeopleValue, tip) {
    return parseFloat((billValue * (1 + tip / 100)) / numberPeopleValue).toFixed(2);
}