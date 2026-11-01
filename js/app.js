const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];


/* =========================
   LOCAL STORAGE
========================= */

function getData(key,fallback=[]){

  try{

    const raw=localStorage.getItem(key);

    if(raw===null){
      return fallback;
    }

    const data=JSON.parse(raw);

    return data??fallback;

  }catch(error){

    return fallback;

  }

}


function setData(key,value){

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );

}


function removeData(key){

  localStorage.removeItem(key);

}


/* =========================
   BASIC HELPERS
========================= */

function money(n){

  return `৳${Number(n||0).toLocaleString("en-BD")}`;

}


function getCity(){

  return localStorage.getItem("ff_city")||"";

}


function getDivision(){

  return localStorage.getItem("ff_division")||"Dhaka";

}


function currentUser(){

  const id=
    localStorage.getItem("ff_current_user");


  if(!id){
    return null;
  }


  return getData("ff_users",[]).find(
    user=>user.id===id
  )||null;

}


function getCart(){

  return getData("ff_cart",[]);

}


function getOrders(){

  return getData("ff_orders",[]);

}


function getFavorites(){

  return getData("ff_favorites",[]);

}


/* =========================
   TOAST
========================= */

function toast(message,type="success"){

  let root=$("#toast-root");


  if(!root){

    root=$("#toast");

  }


  if(!root){

    root=document.createElement("div");

    root.id="toast-root";

    root.className="toast-root";

    document.body.appendChild(root);

  }


  const el=document.createElement("div");

  el.className=`toast ${type}`;

  el.innerHTML=`
    <span>${type==="error"?"!":"✓"}</span>
    <b>${escapeHTML(message)}</b>
  `;


  root.appendChild(el);


  setTimeout(()=>{

    if(el.isConnected){
      el.remove();
    }

  },2800);

}


/* =========================
   HTML SAFETY
========================= */

function escapeHTML(str=""){

  return String(str).replace(
    /[&<>"']/g,
    character=>({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#039;"
    }[character])
  );

}


/* =========================
   USER HELPERS
========================= */

function getUserInitials(name="User"){

  return String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(word=>word[0])
    .join("")
    .slice(0,2)
    .toUpperCase()||"U";

}


/* =========================
   PAGE PATH
========================= */

function isPagesPath(){

  return location.pathname.includes("/pages/");

}


function pagePath(rootPath,pagePath){

  return isPagesPath()
    ?pagePath
    :rootPath;

}


/* =========================
   LOGIN GUARD
========================= */

function requireLogin(){

  const required=
    document.body.dataset.requireLogin==="true";


  if(!required){
    return;
  }


  const user=currentUser();


  if(user){
    return;
  }


  if(isPagesPath()){

    location.href="login.html";

  }else{

    location.href="pages/login.html";

  }

}


/* =========================
   HEADER
========================= */

function updateHeader(){

  const user=currentUser();


  /* =========================
     LOCATION
  ========================= */

  $$("[data-city],[data-current-city]").forEach(el=>{

    el.textContent=
      `${getDivision()} Division`;

  });


  /* =========================
     CART COUNT
  ========================= */

  const count=
    getCart().reduce(
      (sum,item)=>{

        return sum+
          Math.max(
            0,
            Number(item.qty)||0
          );

      },
      0
    );


  $$("[data-cart-count]").forEach(el=>{

    el.textContent=count;

    el.classList.toggle(
      "show",
      count>0
    );

  });


  /* =========================
     PROFILE LINK
  ========================= */

  $$("[data-profile-link]").forEach(el=>{

    const avatar=
      el.querySelector(
        "[data-profile-avatar]"
      );


    const name=
      el.querySelector(
        "[data-profile-name]"
      );


    if(user){

      el.href=
        pagePath(
          "pages/profile.html",
          "profile.html"
        );


      el.title=
        `${user.name||"User"}'s profile`;


      el.classList.remove(
        "header-login-link"
      );


      if(avatar){

        if(user.photo){

          avatar.innerHTML=`
            <img
              src="${escapeHTML(user.photo)}"
              alt="${escapeHTML(user.name||"User")}"
              class="header-avatar-image"
            >
          `;

        }else{

          avatar.textContent=
            getUserInitials(
              user.name
            );

        }

      }


      if(name){

        name.textContent=
          user.name||"Profile";

      }

    }else{

      el.href=
        pagePath(
          "pages/login.html",
          "login.html"
        );


      el.title="Login";


      el.classList.add(
        "header-login-link"
      );


      if(avatar){

        avatar.textContent="↗";

      }


      if(name){

        name.textContent="Login";

      }

    }

  });


  /* =========================
     REGISTER LINK
  ========================= */

  $$("[data-register-link]").forEach(el=>{

    if(user){

      el.style.display="none";

    }else{

      el.style.display="";

    }

  });

}


/* =========================
   CART
========================= */

function addToCart(id){

  const food=FOODS.find(
    item=>item.id===id
  );


  if(!food)return;


  const cart=getCart();


  const item=cart.find(
    item=>item.id===id
  );


  if(item){

    item.qty=
      Math.max(
        1,
        Number(item.qty||0)+1
      );

  }else{

    cart.push({

      id:food.id,
      name:food.name,
      price:Number(food.price)||0,
      qty:1,
      image:food.image,
      restaurant:food.restaurant,
      restaurantId:food.restaurantId,
      category:food.category

    });

  }


  setData(
    "ff_cart",
    cart
  );


  updateHeader();

  showAddFeedback(id);

  toast(
    `${food.name} added to cart`
  );

}


function showAddFeedback(id){

  const buttons=
    $$(`[data-add="${CSS.escape(id)}"]`);


  buttons.forEach(button=>{

    const oldText=
      button.textContent;


    button.textContent="✓ Added";

    button.classList.add("added");


    setTimeout(()=>{

      if(button.isConnected){

        button.textContent=oldText;

        button.classList.remove("added");

      }

    },900);

  });

}


function removeFromCart(id){

  const cart=
    getCart().filter(
      item=>item.id!==id
    );


  setData(
    "ff_cart",
    cart
  );


  updateHeader();

  toast("Removed from cart");

}


function changeQty(id,delta){

  const cart=getCart();


  const item=cart.find(
    item=>item.id===id
  );


  if(!item)return;


  const newQty=
    Number(item.qty||1)+
    Number(delta||0);


  if(newQty<=0){

    removeFromCart(id);

    return;

  }


  item.qty=newQty;


  setData(
    "ff_cart",
    cart
  );


  updateHeader();

}


/* =========================
   FAVORITES
========================= */

function toggleFavorite(id){

  let favorites=
    getFavorites();


  const button=
    $(`[data-favorite="${CSS.escape(id)}"]`);


  if(favorites.includes(id)){

    favorites=
      favorites.filter(
        item=>item!==id
      );


    if(button){

      button.classList.remove(
        "favorite-pop"
      );

    }


    toast(
      "Removed from favorites"
    );

  }else{

    favorites.push(id);


    if(button){

      button.classList.add(
        "favorite-pop"
      );


      setTimeout(()=>{

        if(button.isConnected){

          button.classList.remove(
            "favorite-pop"
          );

        }

      },400);

    }


    toast(
      "Added to favorites ♥"
    );

  }


  setData(
    "ff_favorites",
    favorites
  );


  renderFavoriteButtons();

}


function renderFavoriteButtons(){

  const favorites=
    getFavorites();


  $$("[data-favorite]").forEach(button=>{

    const active=
      favorites.includes(
        button.dataset.favorite
      );


    button.classList.toggle(
      "active",
      active
    );


    button.textContent=
      active
        ?"♥"
        :"♡";


    button.setAttribute(
      "aria-label",
      active
        ?"Remove favorite"
        :"Add favorite"
    );

  });

}


/* =========================
   RESTAURANT
========================= */

function restaurantById(id){

  return RESTAURANTS.find(
    restaurant=>restaurant.id===id
  );

}


function goToRestaurant(id){

  const path=
    pagePath(
      "pages/restaurant.html",
      "restaurant.html"
    );


  location.href=
    `${path}?id=${encodeURIComponent(id)}`;

}


/* =========================
   IMAGE PATH
========================= */

function getImagePath(path){

  if(!path){
    return "";
  }


  if(
    path.startsWith("http://")||
    path.startsWith("https://")||
    path.startsWith("data:")||
    path.startsWith("../")
  ){

    return path;

  }


  const inPages=
    isPagesPath();


  if(path.startsWith("assets/")){

    return inPages
      ?`../${path}`
      :path;

  }


  return inPages
    ?`../assets/images/${path}`
    :`assets/images/${path}`;

}


/* =========================
   IMAGE FALLBACK
========================= */

function imageFallback(img){

  if(!img)return;


  if(img.dataset.fallbackApplied){
    return;
  }


  img.dataset.fallbackApplied="true";


  const fallback=
    isPagesPath()
      ?"../assets/images/food/demo-food.jpg"
      :"assets/images/food/demo-food.jpg";


  img.src=fallback;

}


/* =========================
   FOOD CARD
========================= */

function productCard(food){

  const price=
    Number(food.price)||0;


  const oldPrice=
    Number(food.oldPrice)||0;


  const discount=
    oldPrice>price
      ?Math.round(
          ((oldPrice-price)/oldPrice)*100
        )
      :0;


  return `

    <article class="food-card">

      <div class="food-image-wrap">

        <img
          src="${getImagePath(food.image)}"
          alt="${escapeHTML(food.name)}"
          loading="lazy"
          onerror="imageFallback(this)"
        >


        <button
          class="heart-btn"
          data-favorite="${escapeHTML(food.id)}"
          type="button"
          aria-label="Add favorite">

          ♡

        </button>


        ${
          discount>0
            ?`

              <span class="discount-badge">
                -${discount}%
              </span>

            `
            :""
        }


        ${
          food.spicy
            ?`

              <span class="spicy-badge">
                🌶 Spicy
              </span>

            `
            :""
        }

      </div>


      <div class="food-info">

        <div class="food-top">

          <span class="food-category">
            ${escapeHTML(food.category)}
          </span>

          <span>
            ★ ${Number(food.rating||0).toFixed(1)}
          </span>

        </div>


        <h3>
          ${escapeHTML(food.name)}
        </h3>


        <p>
          ${escapeHTML(food.restaurant)}
        </p>


        <div class="food-bottom">

          <div>

            <strong>
              ${money(price)}
            </strong>

            ${
              oldPrice>price
                ?`

                  <del>
                    ${money(oldPrice)}
                  </del>

                `
                :""
            }

          </div>


          <button
            class="add-btn"
            data-add="${escapeHTML(food.id)}"
            type="button">

            + Add

          </button>

        </div>

      </div>

    </article>

  `;

}


function bindFoodButtons(scope=document){

  $$("[data-add]",scope).forEach(button=>{

    button.onclick=()=>{

      addToCart(
        button.dataset.add
      );

    };

  });


  $$("[data-favorite]",scope).forEach(button=>{

    button.onclick=()=>{

      toggleFavorite(
        button.dataset.favorite
      );

    };

  });


  renderFavoriteButtons();

}


/* =========================
   LOCATION MODAL
   DIVISION ONLY
========================= */

function setupLocationButtons(){

  let modal=
    $("[data-location-modal]");


  if(!modal){

    modal=
      document.createElement("div");


    modal.id=
      "location-modal";


    modal.className=
      "location-modal";


    modal.innerHTML=`

      <div
        class="location-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-title">

        <button
          class="location-close"
          id="location-close"
          type="button"
          aria-label="Close">

          ×

        </button>


        <span class="eyebrow">
          Delivery location
        </span>


        <h2 id="location-title">
          Where should we deliver?
        </h2>


        <p>
          Select your delivery division.
        </p>


        <label for="location-division">

          Division

          <select id="location-division">
          </select>

        </label>


        <button
          class="primary-btn full-btn"
          id="save-location"
          type="button">

          Save location

        </button>

      </div>

    `;


    document.body.appendChild(
      modal
    );

  }


  const divSel=
    $("#location-division",modal);


  const closeBtn=
    $(
      "#location-close,[data-location-close]",
      modal
    );


  const saveBtn=
    $(
      "#save-location,[data-location-save]",
      modal
    );


  if(
    !divSel||
    !closeBtn||
    !saveBtn
  ){

    return;

  }


  /* =========================
     DIVISIONS
  ========================= */

  divSel.innerHTML=
    Object.keys(DIVISIONS)
      .map(division=>`

        <option value="${escapeHTML(division)}">

          ${escapeHTML(division)} Division

        </option>

      `)
      .join("");


  /* =========================
     CLOSE
  ========================= */

  function closeModal(){

    modal.classList.remove(
      "open"
    );

    modal.hidden=true;

  }


  /* =========================
     OPEN
  ========================= */

  function openModal(){

    const savedDivision=
      getDivision();


    const divisionExists=
      Object.prototype.hasOwnProperty.call(
        DIVISIONS,
        savedDivision
      );


    divSel.value=
      divisionExists
        ?savedDivision
        :"Dhaka";


    modal.hidden=false;

    requestAnimationFrame(()=>{

      modal.classList.add(
        "open"
      );

    });


    setTimeout(()=>{

      divSel.focus();

    },150);

  }


  /* =========================
     SAVE
  ========================= */

  saveBtn.onclick=()=>{

    const division=
      divSel.value;


    if(!division){

      toast(
        "Please select your division.",
        "error"
      );

      return;

    }


    localStorage.setItem(
      "ff_division",
      division
    );


    /* City is no longer used */

    localStorage.removeItem(
      "ff_city"
    );


    const user=
      currentUser();


    if(user){

      const users=
        getData(
          "ff_users",
          []
        );


      const index=
        users.findIndex(
          item=>item.id===user.id
        );


      if(index!==-1){

        users[index].division=
          division;

        users[index].city="";


        setData(
          "ff_users",
          users
        );

      }

    }


    updateHeader();

    closeModal();


    toast(
      `Location set to ${division} Division`
    );


    const page=
      document.body.dataset.page;


    if(
      page==="home"&&
      typeof initHome==="function"
    ){

      initHome();

    }


    if(
      (
        page==="restaurants"||
        page==="restaurant"
      )&&
      typeof initRestaurants==="function"
    ){

      initRestaurants();

    }

  };


  /* =========================
     BUTTONS
  ========================= */

  closeBtn.onclick=
    closeModal;


  modal.onclick=
    event=>{

      if(
        event.target===modal
      ){

        closeModal();

      }

    };


  $$(
    "[data-location-open],[data-location-btn]"
  ).forEach(button=>{

    button.onclick=
      openModal;

  });


  document.addEventListener(
    "keydown",
    event=>{

      if(
        event.key==="Escape"&&
        modal.classList.contains("open")
      ){

        closeModal();

      }

    }
  );

}


/* =========================
   MOBILE MENU
========================= */

function setupMobileMenu(){

  const button=
    $("[data-mobile-menu]");


  if(!button)return;


  const nav=
    $("#main-nav")||
    $(".main-nav");


  if(!nav)return;


  button.setAttribute(
    "aria-expanded",
    "false"
  );


  button.onclick=()=>{

    const open=
      nav.classList.toggle(
        "show"
      );


    button.setAttribute(
      "aria-expanded",
      String(open)
    );

  };


  $$("a",nav).forEach(link=>{

    link.addEventListener(
      "click",
      ()=>{

        nav.classList.remove(
          "show"
        );


        button.setAttribute(
          "aria-expanded",
          "false"
        );

      }
    );

  });

}


/* =========================
   GLOBAL INIT
========================= */

document.addEventListener(
  "DOMContentLoaded",
  ()=>{

    requireLogin();

    updateHeader();

    setupLocationButtons();

    setupMobileMenu();

  }
);