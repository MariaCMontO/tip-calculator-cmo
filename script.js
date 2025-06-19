//Variables generales
const form = document.getElementById('form');
const inputArray = Array.from(form.querySelectorAll('input[placeholder="0"]'))
const buttons = Array.from(document.querySelectorAll('button[type=button]'));
const bill = inputArray.filter(input => input.id === 'bill')[0]
const numberPeople = inputArray.filter(input => input.id === 'number-people')[0]
const tipInput = document.getElementById('tip')
const tipAmount = document.getElementById('tip-amount')
const total = document.getElementById('total')

//Eventos
//Validar campos de bill y number-people
inputArray.forEach((input) => {
    input.addEventListener("blur", (e) => {
        e.preventDefault()
        const isZero = zeroValidation(e)
        if (!isZero) {
            updateTipTotal()
        }
    })
})

//Seleccionar un tip
buttons.forEach((button) => {

    button.addEventListener("click", (e) => {

        buttons.forEach((button) => {
            if (button.classList[0] === 'active' && button !== e.target) {
                button.classList.remove('active')
            }
        })
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

//Reset
const resetButton = document.querySelector('button[type=reset]')
resetButton.addEventListener('click', (e) => {
    bill.value=''
    numberPeople.value=''
    tipAmount.textContent='$0.00'
    total.textContent='$0.00'
    tipInput.value=''
    deleteTip()
})


//funciones aux
//Eliminar boton de tip seleccionado
function deleteTip() {
    buttons.forEach((button) => {
        if (button.classList[0] === 'active') {
            button.classList.remove('active')
        }
    })
}

//Valida que los campos no sean 0 y retorna false
function zeroValidation(e) {
    let isZero = false
    //Variables de del div y los mensajes
    const divLabel = document.getElementById(`div-label-${e.target.id}`)
    const currentMessage = divLabel.querySelectorAll(".is-zero-label");

    if (e.target.value === "0" || e.target.value === '') {
        //Si es 0 o vacio se pone borde rojo
        isZero = true
        e.target.classList.add('is-zero');
        if (currentMessage.length === 0) {
            //Si no hay mensaje aun se pone uno
            const message = document.createElement('P')
            message.textContent = "Can't be zero";
            message.classList.add('is-zero-label')
            divLabel.appendChild(message)
        }
    } else {
        //Si no es 0 se remueve is-zero si está aplicado
        e.target.classList.remove('is-zero')
        //Si hay mensajes se eliminan
        if (currentMessage) {
            currentMessage.forEach((message) => {
                message.remove()
            })
        }
    }
    return isZero
}

//Actualiza el valor del tip amount y total
function updateTipTotal() {
    //Extraer valores de bill, number people y tip
    const billValue=+bill.value
    const numberPeopleValue=parseInt(numberPeople.value)
    let tip = buttons.filter(button => button.classList == 'active')[0]

    //Validar que ni bill ni numberPeople sea 0 o NaN
    if( Number.isNaN(billValue) || Number.isNaN(numberPeopleValue) || billValue===0 || numberPeopleValue===0){
        return;
    }

    //Validar si tip es undefined, sino extraer valor
    if (tip === undefined) {
        //Si nop hay tip seleccionado mirar si hay algo en custom
        if (tipInput.value !== '') {
            tip = tipInput.value.replace('%', '')
        } else {
            tip = 0;
        }
    } else {
        tip = tip.innerText.replace('%', '')
    }
    //Calcular valores
    const tipAmountValue = parseFloat((billValue * tip / 100) / numberPeopleValue).toFixed(2);
    const totalValue = parseFloat((billValue * (1 + tip / 100)) / numberPeopleValue).toFixed(2);

    //Extraer elementos y asigan valores
    tipAmount.textContent = `$${tipAmountValue}`;
    total.textContent = `$${totalValue}`;

    //Cambiar estado del boton
    resetButton.classList.add('active')
}