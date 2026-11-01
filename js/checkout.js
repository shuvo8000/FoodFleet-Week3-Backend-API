/* =========================
   CHECKOUT TOTALS
========================= */

function checkoutTotals(){

  const cart=getCart();

  const subtotal=cart.reduce((sum,item)=>{
    const price=Number(item.price)||0;
    const qty=Math.max(0,Number(item.qty)||0);

    return sum+(price*qty);
  },0);

  const restaurant=cart[0]
    ?restaurantById(cart[0].restaurantId)
    :null;

  const delivery=cart.length
    ?Number(restaurant?.fee)||50
    :0;

  const promoApplied=
    localStorage.getItem("ff_promo")==="FLEET100";

  const discount=
    promoApplied&&subtotal>=500
      ?100
      :0;

  const total=Math.max(
    0,
    subtotal+delivery-discount
  );

  return{
    subtotal,
    delivery,
    discount,
    total
  };
}


/* =========================
   CHECKOUT SUMMARY
========================= */

function renderCheckoutSummary(){

  const cart=getCart();
  const summary=$("#checkout-summary");

  if(!summary){
    return;
  }

  const totals=checkoutTotals();

  const itemCount=cart.reduce(
    (sum,item)=>{
      return sum+Math.max(
        0,
        Number(item.qty)||0
      );
    },
    0
  );

  summary.innerHTML=`

    <div class="summary-head">

      <div>
        <span class="summary-label">
          FoodFleet
        </span>

        <h3>
          Order summary
        </h3>
      </div>

      <span class="summary-count">
        ${itemCount}
        ${itemCount===1?"item":"items"}
      </span>

    </div>


    <div class="mini-items">

      ${cart.map(item=>{

        const price=Number(item.price)||0;
        const qty=Number(item.qty)||0;

        return`
          <div>

            <span>
              ${escapeHTML(item.name)}

              <small>
                × ${qty}
              </small>
            </span>

            <b>
              ${money(price*qty)}
            </b>

          </div>
        `;

      }).join("")}

    </div>


    <div class="summary-lines">

      <span>
        <span>Subtotal</span>
        <b>${money(totals.subtotal)}</b>
      </span>

      <span>
        <span>Delivery fee</span>
        <b>${money(totals.delivery)}</b>
      </span>

      ${
        totals.discount
          ?`
            <span class="discount-line">

              <span>
                FLEET100 discount
              </span>

              <b>
                −${money(totals.discount)}
              </b>

            </span>
          `
          :""
      }

    </div>


    <div class="summary-total">

      <span>Total</span>

      <strong>
        ${money(totals.total)}
      </strong>

    </div>


    ${
      totals.discount
        ?`
          <div class="promo-success">

            <span class="promo-status-icon">
              ✓
            </span>

            <div>

              <strong>
                FLEET100 applied
              </strong>

              <small>
                You saved ${money(totals.discount)}
              </small>

            </div>

          </div>
        `
        :""
    }

  `;

  const total=$("#checkout-total");

  if(total){
    total.textContent=money(totals.total);
  }
}


/* =========================
   RENDER CHECKOUT
========================= */

function renderCheckout(){

  const cart=getCart();

  if(!cart.length){
    location.href="cart.html";
    return;
  }

  const user=currentUser();

  if(user){

    const name=$("#checkout-name");
    const mobile=$("#checkout-mobile");
    const address=$("#checkout-address");

    if(name&&!name.value){
      name.value=user.name||"";
    }

    if(mobile&&!mobile.value){
      mobile.value=user.mobile||"";
    }

    if(address&&!address.value){
      address.value=user.address||"";
    }
  }


  const division=$("#checkout-division");

  if(!division){
    return;
  }


  division.innerHTML=`

    <option value="">
      Select division
    </option>

    ${Object.keys(DIVISIONS).map(item=>`
      <option value="${escapeHTML(item)}">
        ${escapeHTML(item)} Division
      </option>
    `).join("")}

  `;


  const savedDivision=getDivision();

  if(
    Object.prototype.hasOwnProperty.call(
      DIVISIONS,
      savedDivision
    )
  ){

    division.value=savedDivision;

  }


  /* REMOVE OLD CITY DATA */

  localStorage.removeItem(
    "ff_city"
  );


  renderCheckoutSummary();
}


/* =========================
   PROMO MESSAGE
========================= */

function showPromoMessage(message,type){

  const box=$("#promo-message");

  if(!box){
    return;
  }

  box.textContent=message;
  box.className=`form-message ${type}`;
}


/* =========================
   PLACE ORDER
========================= */

function placeOrder(event){

  event.preventDefault();

  const cart=getCart();

  if(!cart.length){

    toast(
      "Your cart is empty.",
      "error"
    );

    return;
  }


  const name=
    $("#checkout-name")
      ?.value
      .trim()||"";

  const mobile=
    $("#checkout-mobile")
      ?.value
      .trim()
      .replace(/\s+/g,"")||"";

  const address=
    $("#checkout-address")
      ?.value
      .trim()||"";

  const division=
    $("#checkout-division")
      ?.value||"";

  const payment=
    document.querySelector(
      'input[name="payment"]:checked'
    );


  /* =========================
     VALIDATION
  ========================= */

  if(name.length<2){

    toast(
      "Enter your full name.",
      "error"
    );

    $("#checkout-name")?.focus();

    return;
  }


  if(!/^01[3-9]\d{8}$/.test(mobile)){

    toast(
      "Enter a valid Bangladesh mobile number.",
      "error"
    );

    $("#checkout-mobile")?.focus();

    return;
  }


  if(address.length<5){

    toast(
      "Enter your delivery address.",
      "error"
    );

    $("#checkout-address")?.focus();

    return;
  }


  if(!division){

    toast(
      "Select your division.",
      "error"
    );

    $("#checkout-division")?.focus();

    return;
  }


  if(!payment){

    toast(
      "Select a payment method.",
      "error"
    );

    return;
  }


  /* =========================
     RESTAURANT
  ========================= */

  const restaurant=cart[0]
    ?restaurantById(cart[0].restaurantId)
    :null;

  if(!restaurant){

    toast(
      "Restaurant information is missing.",
      "error"
    );

    return;
  }


  /* =========================
     TOTALS
  ========================= */

  const totals=checkoutTotals();


  /* =========================
     SAVE LOCATION
  ========================= */

  localStorage.setItem(
    "ff_division",
    division
  );

  localStorage.removeItem(
    "ff_city"
  );


  /* =========================
     ORDER ID
  ========================= */

  const orderId=
    "FF"+
    Date.now()
      .toString()
      .slice(-6);


  /* =========================
     CREATE ORDER
  ========================= */

  const order={

    id:orderId,

    date:
      new Date().toISOString(),

    restaurant:
      restaurant.name,

    restaurantId:
      restaurant.id,

    items:
      cart.map(item=>({
        ...item
      })),

    subtotal:
      totals.subtotal,

    delivery:
      totals.delivery,

    discount:
      totals.discount,

    total:
      totals.total,

    address,

    division,

    paymentMethod:
      payment.value,

    status:
      "Order Confirmed"

  };


  /* =========================
     SAVE ORDER
  ========================= */

  const orders=getOrders();

  orders.unshift(order);

  setData(
    "ff_orders",
    orders
  );


  /* =========================
     CLEAR CART
  ========================= */

  setData(
    "ff_cart",
    []
  );

  localStorage.removeItem(
    "ff_promo"
  );


  /* =========================
     UPDATE USER
  ========================= */

  const user=currentUser();

  if(user){

    const users=getData(
      "ff_users",
      []
    );

    const index=users.findIndex(
      item=>item.id===user.id
    );

    if(index!==-1){

      users[index].name=name;
      users[index].mobile=mobile;
      users[index].address=address;
      users[index].division=division;

      /* Remove old city field */
      delete users[index].city;

      setData(
        "ff_users",
        users
      );

      localStorage.setItem(
        "ff_current_user",
        users[index].id
      );
    }
  }


  /* =========================
     UPDATE UI
  ========================= */

  updateHeader();

  toast(
    `Order ${orderId} placed successfully 🎉`
  );


  /* =========================
     REDIRECT
  ========================= */

  setTimeout(()=>{
    location.href="orders.html";
  },800);
}


/* =========================
   INIT
========================= */

document.addEventListener(
  "DOMContentLoaded",
  ()=>{

    renderCheckout();


    const division=$("#checkout-division");


    /* =========================
       DIVISION CHANGE
    ========================= */

    division?.addEventListener(
      "change",
      ()=>{

        const selectedDivision=
          division.value;

        if(selectedDivision){

          localStorage.setItem(
            "ff_division",
            selectedDivision
          );

        }else{

          localStorage.removeItem(
            "ff_division"
          );
        }


        /* Remove old city */
        localStorage.removeItem(
          "ff_city"
        );

      }
    );


    /* =========================
       PROMO
    ========================= */

    $("#apply-promo")?.addEventListener(
      "click",
      ()=>{

        const input=$("#promo-code");

        if(!input){
          return;
        }

        const code=
          input.value
            .trim()
            .toUpperCase();

        const subtotal=
          getCart().reduce(
            (sum,item)=>{
              return sum+
                (Number(item.price)||0)*
                (Number(item.qty)||0);
            },
            0
          );


        if(!code){

          showPromoMessage(
            "Enter a promo code.",
            "error"
          );

          return;
        }


        if(code!=="FLEET100"){

          localStorage.removeItem(
            "ff_promo"
          );

          showPromoMessage(
            "That promo code isn't valid.",
            "error"
          );

          renderCheckoutSummary();

          return;
        }


        if(subtotal<500){

          localStorage.removeItem(
            "ff_promo"
          );

          showPromoMessage(
            "Minimum order of ৳500 required.",
            "error"
          );

          renderCheckoutSummary();

          return;
        }


        localStorage.setItem(
          "ff_promo",
          "FLEET100"
        );


        showPromoMessage(
          "Promo applied! You saved ৳100.",
          "success"
        );


        renderCheckoutSummary();


        toast(
          "FLEET100 applied — ৳100 saved!"
        );

      }
    );


    /* =========================
       CHECKOUT FORM
    ========================= */

    $("#checkout-form")?.addEventListener(
      "submit",
      placeOrder
    );

  }
);