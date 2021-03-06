//@ts-nocheck
const dataManager = new DataManager();
dataManager.cartCounter();

let total = 0;
const cart = new Cart();
let cartContent = cart.displayCart();

//calcul du total
document.querySelector("table").insertAdjacentHTML(
    "beforeend",
    `<tr>
        <th colspan="3" id="Total">Total: ${total} doudoullars</th>
    </tr>`);

//desactiver boutons si panier vide
if (localStorage.length == 0) {
    let btn = document.querySelectorAll(".btn");
    for (let i = 0; i < btn.length; i++) {
        btn[i].classList.add("disabled");
    }
}

//bouton vider le panier
document.getElementById("clearCartBtn").addEventListener("click", function () {
    //demande de confirmation
    if (window.confirm("Etes vous certain(e) de vouloir vider votre panier?")) {
        localStorage.clear();
        location.reload();
    }
});

//bouton supprimer un article 
let elt = document.querySelectorAll("td img");
for (let i = 0; i < localStorage.length; i++) {
    elt[i].onclick = function () {
        //voir l'id du bouton poubelle cliqué
        let idToRemove = elt[i].getAttribute("id");
        //supprimer l'article correspondant
        localStorage.removeItem(`article${idToRemove}`);
        location.reload();
    };
}

//validation commande
let submitForm = document.getElementById("form");
submitForm.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();
    let confirm = window.confirm("Voulez vous vraiment soumettre les informations?");
    if (!confirm) {
        return;
    }
    submit(cartContent);
});

/**
 * form submit
 *
 * @param   {Array}  cartContent  [cartContent description]
 *
 * @return  {Promise}               [return description]
 */
async function submit(cartContent) {
    const formContent = {
        "firstName" : document.getElementById("validationServer01").value,
        "lastName" : document.getElementById("validationServer02").value,
        "address" : document.getElementById("validationServer03").value,
        "city" : document.getElementById("validationServer05").value,
        "email" : document.getElementById("validationServerUsername").value
    };

    const response = await dataManager.postOrderRequest(formContent, cartContent);
    dataManager.saveOrder(response.orderId, response.contact, total);
    window.location = "./confirm.html?" + response.orderId;
}

/**
 * validation champs formuaire
 *
 * @param   {HTMLElement}  input
 *
 * @return  {void}
 */
function validInput(field){
    if (field.validity.valid) {
        field.classList.add("is-valid");
        field.classList.remove("is-invalid");
    }
    else {
        field.classList.add("is-invalid");
        field.classList.remove("is-valid");
    }
}