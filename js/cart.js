/* =========================
   CART TOTALS
========================= */

function cartTotals(){

  const cart=getCart();

  const subtotal=cart.reduce(
    (sum,item)=>{
      const price=Number(item.price)||0;
      const qty=Math.max(0,Number(item.qty)||0);

      return sum+(price*qty);
    },
    0
  );

  const restaurant=cart[0]
    ?restaurantById(cart[0].restaurantId)
    :null;

  const delivery=cart.length
    ?Number(restaurant?.fee)||50
    :0;

  const promoCode=localStorage.getItem("ff_promo");

  const discount=
    promoCode==="FLEET100"&&subtotal>=500
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
   PROMO MESSAGE
========================= */

function getPromoMessage(totals){

  if(totals.discount){

    return`
      <div class="promo-success">

        <div class="promo-status-icon">
          ✓
        </div>

        <div class="promo-copy">

          <strong>
            FLEET100 applied
          </strong>

          <small>
            You saved ${money(totals.discount)}
          </small>

        </div>

      </div>
    `;
  }


  const remaining=Math.max(
    0,
    500-totals.subtotal
  );


  return`
    <div class="promo-hint">

      <div class="promo-status-icon">
        🏷️
      </div>

      <div class="promo-copy">

        <strong>
          Save ৳100 with FLEET100
        </strong>

        <small>
          ${
            remaining>0
              ?`Add ${money(remaining)} more to unlock.`
              :"You're eligible for ৳100 off."
          }
        </small>

      </div>

    </div>
  `;
}


/* =========================
   CART ITEM HTML
========================= */

function cartItemHTML(item){

  const qty=Math.max(
    1,
    Number(item.qty)||1
  );

  const price=Number(item.price)||0;

  const category=
    item.category||"Food";


  return`
    <article
      class="cart-item"
      data-cart-item="${escapeHTML(item.id)}">

      <div class="cart-item-image">

        <img
          src="${getImagePath(item.image)}"
          alt="${escapeHTML(item.name)}"
          loading="lazy"
          onerror="imageFallback(this)">

      </div>


      <div class="cart-item-main">

        <span class="cart-item-category">
          ${escapeHTML(category)}
        </span>

        <h3>
          ${escapeHTML(item.name)}
        </h3>

        <p>
          ${escapeHTML(item.restaurant||"FoodFleet")}
        </p>

        <strong class="cart-item-price">
          ${money(price)}
        </strong>

      </div>


      <div class="cart-item-actions">

        <div class="qty-control">

          <button
            type="button"
            data-qty="${escapeHTML(item.id)}"
            data-delta="-1"
            aria-label="Decrease quantity">

            −

          </button>


          <span>
            ${qty}
          </span>


          <button
            type="button"
            data-qty="${escapeHTML(item.id)}"
            data-delta="1"
            aria-label="Increase quantity">

            +

          </button>

        </div>

      </div>

    </article>
  `;
}


/* =========================
   EMPTY CART
========================= */

function renderEmptyCart(list,summary){

  localStorage.removeItem("ff_promo");


  list.innerHTML=`

    <div class="empty-state cart-empty">

      <div class="empty-icon">
        🛒
      </div>

      <h2>
        Your cart is waiting
      </h2>

      <p>
        Add something delicious
        and we'll take it from there.
      </p>

      <a
        class="primary-btn"
        href="restaurants.html">

        Explore food
        <span>→</span>

      </a>

    </div>

  `;


  summary.innerHTML="";

  updateHeader();
}


/* =========================
   SUMMARY HTML
========================= */

function renderSummary(summary,totals,itemCount){

  summary.innerHTML=`

    <div class="summary-brand">
      FOODFLEET
    </div>


    <div class="summary-head">

      <div>

        <h3>
          Order summary
        </h3>

      </div>


      <span class="summary-count">
        ${itemCount}
        ${itemCount===1?"item":"items"}
      </span>

    </div>


    <div class="summary-lines">

      <div class="summary-row">

        <span>
          Subtotal
        </span>

        <b>
          ${money(totals.subtotal)}
        </b>

      </div>


      <div class="summary-row">

        <span>
          Delivery fee
        </span>

        <b>
          ${money(totals.delivery)}
        </b>

      </div>


      ${
        totals.discount
          ?`
            <div class="summary-row discount-line">

              <span>
                FLEET100 discount
              </span>

              <b>
                −${money(totals.discount)}
              </b>

            </div>
          `
          :""
      }

    </div>


    <div class="summary-total">

      <span>
        Total
      </span>

      <strong>
        ${money(totals.total)}
      </strong>

    </div>


    ${getPromoMessage(totals)}


    <a
      class="primary-btn full-btn"
      href="checkout.html">

      <span>
        Continue to checkout
      </span>

      <strong>
        →
      </strong>

    </a>


    <p class="summary-note">

      🔒 Demo checkout.
      No real payment is processed.

    </p>

  `;
}


/* =========================
   RENDER CART
========================= */

function renderCart(){

  const list=$("#cart-items");

  const summary=$("#cart-summary");

  const cart=getCart();


  if(!list||!summary){
    return;
  }


  /* EMPTY */

  if(!cart.length){

    renderEmptyCart(
      list,
      summary
    );

    return;
  }


  /* CART ITEMS */

  list.innerHTML=cart
    .map(cartItemHTML)
    .join("");


  /* QUANTITY */

  $$("[data-qty]",list)
    .forEach(button=>{

      button.addEventListener(
        "click",
        ()=>{

          const id=
            button.dataset.qty;

          const delta=
            Number(button.dataset.delta)||0;


          changeQty(
            id,
            delta
          );


          renderCart();

          updateHeader();

        }
      );

    });


  /* TOTALS */

  const totals=
    cartTotals();


  /* ITEM COUNT */

  const itemCount=
    cart.reduce(
      (sum,item)=>{

        return sum+
          Math.max(
            0,
            Number(item.qty)||0
          );

      },
      0
    );


  /* SUMMARY */

  renderSummary(
    summary,
    totals,
    itemCount
  );

}


/* =========================
   CART PAGE INIT
========================= */

document.addEventListener(
  "DOMContentLoaded",
  ()=>{

    renderCart();

    updateHeader();

  }
);