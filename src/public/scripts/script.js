let originalRoastingHTML = '';

window.onload = function () {
    originalRoastingHTML = document.querySelector(".form-roasting").innerHTML;
};

function selectDrink(drinkId) {
    const drinkRadio = document.getElementById(drinkId);
    drinkRadio.checked = true;

    drinkChosen();
}

function drinkChosen() {
    const formRoasting = document.querySelector('.form-roasting');

    const drink = document.querySelector('input[name="drink"]:checked').value;

    if (drink.toLowerCase() == "chocolate") {
        formRoasting.innerHTML = '';
    } else {
        formRoasting.innerHTML = originalRoastingHTML;
    }
}

async function fetchCart() {
    try {
        const res = await fetch("/cart", { credentials: "include" });
        if (!res.ok) throw new Error("Erro ao carregar o carrinho");
        const cart = await res.json();
        const cartList = document.getElementById("cart");
        if (cartList) {
            cartList.innerHTML = cart.map(item => `<li>${item}</li>`).join("");
        }
    } catch (error) {
        console.error("Erro ao buscar o carrinho:", error);
    }
}

async function addToCart(product) {
    try {
        const res = await fetch("/add-to-cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ product }),
        });
        if (!res.ok) throw new Error("Erro ao adicionar item ao carrinho");
        await fetchCart(); // Atualiza o carrinho após adicionar o item
    } catch (error) {
        console.error("Erro ao adicionar item ao carrinho:", error);
    }
}

async function clearCart() {
    try {
        const res = await fetch("/clear-cart", {
            method: "POST",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Erro ao limpar o carrinho");
        await fetchCart();
    } catch (error) {
        console.error("Erro ao limpar o carrinho:", error);
    }
}

fetchCart();

function submitOrder() {
    const selectedDrink = [];
    document.querySelectorAll('.drinks-container input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            selectedDrink.push(checkbox.value.trim());
        }
    });

    if (selectedDrink.length == 0) {
        const orderSummary = "<b>Selecione sua bebida!</b>";

        document.getElementById('alertMessage').innerHTML = orderSummary;
        document.getElementById('customAlert').style.display = 'flex';

        resetForm();
        return;
    }

    let selectedRoasting = document.querySelector('input[name="roasting"]:checked');

    const coffeRegex = /caf[eé]/i;
    const hasCafe = selectedDrink.some(item => coffeRegex.test(item));


    if (hasCafe && !selectedRoasting) {
        const orderSummary = "<b>Selecione a Torra do Café!</b>";

        document.getElementById('alertMessage').innerHTML = orderSummary;
        document.getElementById('customAlert').style.display = 'flex';

        resetForm();
        return;
    }

    selectedRoasting = selectedRoasting ? selectedRoasting.value : 'Nenhuma';

    const selectedGarnishes = [];
    document.querySelectorAll('.garnish-container input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            selectedGarnishes.push(checkbox.nextElementSibling.textContent.trim());
        }
    });

    let orderSummary;

    if (hasCafe) {
        orderSummary = `
    <b>Pedido realizado com sucesso!</b><br><br>
    <b>Bebida selecionada:</b> ${selectedDrink.length > 1 ? selectedDrink.join(', ') : selectedDrink}<br>
    <b>Torra selecionada:</b> ${selectedRoasting}<br>
    <b>Acompanhamentos:</b> ${selectedGarnishes.length > 0 ? selectedGarnishes.join(', ') : 'Nenhum'}
    `;
    } else {
        orderSummary = `
    <b>Pedido realizado com sucesso!</b><br><br>
    <b>Bebida selecionada:</b> ${selectedDrink.length > 1 ? selectedDrink.join(', ') : selectedDrink}<br>
    <b>Acompanhamentos:</b> ${selectedGarnishes.length > 0 ? selectedGarnishes.join(', ') : 'Nenhum'}
    `;
    }

    document.getElementById('alertMessage').innerHTML = orderSummary;
    document.getElementById('customAlert').style.display = 'flex';

    resetForm();
}

function resetForm() {
    document.querySelectorAll('input[name="drink"]').forEach(radio => {
        radio.checked = false;
    });

    document.querySelectorAll('input[name="roasting"]').forEach(radio => {
        radio.checked = false;
    });

    document.querySelectorAll('.garnish-container input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
}

function closeAlert() {
    const formRoasting = document.querySelector('.form-roasting');
    formRoasting.innerHTML = originalRoastingHTML;

    document.getElementById('customAlert').style.display = 'none';
}