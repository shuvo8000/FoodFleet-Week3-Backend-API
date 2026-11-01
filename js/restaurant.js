/* =========================
   CATEGORIES
========================= */

function renderCategories(){

  const grid=$("#category-grid");

  if(!grid){
    return;
  }


  grid.innerHTML=CATEGORIES.map(category=>`

    <button
      class="category-card"
      data-category="${escapeHTML(category.key)}"
      data-category-name="${escapeHTML(category.name)}"
      type="button">

      <span class="category-icon">
        ${category.icon}
      </span>

      <b>
        ${escapeHTML(category.name)}
      </b>

      <small>
        ${escapeHTML(category.desc)}
      </small>

    </button>

  `).join("");


  $$("[data-category]",grid).forEach(button=>{

    button.addEventListener(
      "click",
      ()=>{

        const inPages=
          location.pathname.includes("/pages/");

        const path=
          inPages
            ?"restaurants.html"
            :"pages/restaurants.html";


        location.href=
          `${path}?category=${encodeURIComponent(
            button.dataset.category
          )}&categoryName=${encodeURIComponent(
            button.dataset.categoryName
          )}`;

      }
    );

  });
}


/* =========================
   LOCATION
   DIVISION ONLY
========================= */

function getRestaurantsForLocation(){

  const division=getDivision();


  if(division){

    const divisionRestaurants=
      RESTAURANTS.filter(
        restaurant=>
          restaurant.division===division
      );


    if(divisionRestaurants.length){

      return divisionRestaurants;

    }

  }


  return RESTAURANTS;
}


/* =========================
   RESTAURANT CARDS
========================= */

function renderRestaurants(list=RESTAURANTS){

  const grid=
    $("#restaurant-grid")||
    $("#restaurant-results");


  if(!grid){
    return;
  }


  if(!list.length){

    grid.innerHTML=`

      <div class="empty-state">

        <div class="empty-icon">
          🍽️
        </div>

        <h3>
          No restaurants found
        </h3>

        <p>
          We couldn't find a restaurant
          matching your search.
        </p>

        <button
          class="secondary-btn"
          type="button"
          onclick="location.href='restaurants.html'">

          Browse all restaurants

        </button>

      </div>

    `;

    return;
  }


  grid.innerHTML=list.map(
    restaurant=>`

      <article
        class="restaurant-card"
        data-restaurant="${escapeHTML(
          restaurant.id
        )}">

        <div class="restaurant-image">

          <img
            src="${getImagePath(
              restaurant.image
            )}"
            alt="${escapeHTML(
              restaurant.name
            )}"
            loading="lazy"
            onerror="imageFallback(this)">


          <span class="restaurant-tag">
            ${escapeHTML(
              restaurant.tag
            )}
          </span>


          <button
            class="heart-btn"
            data-favorite="${escapeHTML(
              restaurant.id
            )}"
            type="button"
            aria-label="Add favorite">

            ♡

          </button>

        </div>


        <div class="restaurant-info">

          <div class="restaurant-title">

            <h3>
              ${escapeHTML(
                restaurant.name
              )}
            </h3>


            <span>
              ★ ${Number(
                restaurant.rating||0
              ).toFixed(1)}
            </span>

          </div>


          <p>
            ${escapeHTML(
              restaurant.cuisine
            )}
          </p>


          <div class="restaurant-meta">

            <span>
              ◷ ${escapeHTML(
                restaurant.time
              )}
            </span>


            <span>
              ${money(
                restaurant.fee
              )}
              delivery
            </span>

          </div>


          <button
            class="secondary-btn full-btn"
            data-view-restaurant="${escapeHTML(
              restaurant.id
            )}"
            type="button">

            View menu

          </button>

        </div>

      </article>

    `
  ).join("");


  /* =========================
     VIEW MENU
  ========================= */

  $$("[data-view-restaurant]",grid)
    .forEach(button=>{

      button.addEventListener(
        "click",
        ()=>{

          goToRestaurant(
            button.dataset.viewRestaurant
          );

        }
      );

    });


  /* =========================
     FAVORITES
  ========================= */

  $$("[data-favorite]",grid)
    .forEach(button=>{

      button.addEventListener(
        "click",
        ()=>{

          toggleFavorite(
            button.dataset.favorite
          );

          renderFavoriteButtons();

        }
      );

    });


  renderFavoriteButtons();

}


/* =========================
   HOME FOOD
========================= */

function renderHomeFoods(filter="all"){

  const grid=$("#home-food-grid");

  if(!grid){
    return;
  }


  let foods=[...FOODS];


  const restaurants=
    getRestaurantsForLocation();


  const restaurantIds=
    restaurants.map(
      restaurant=>restaurant.id
    );


  const localFoods=
    foods.filter(
      food=>
        restaurantIds.includes(
          food.restaurantId
        )
    );


  if(localFoods.length){
    foods=localFoods;
  }


  /* TOP RATED */

  if(filter==="top"){

    foods=foods.filter(
      food=>
        Number(food.rating)>=4.8
    );

  }


  /* FAST DELIVERY */

  if(filter==="fast"){

    foods=foods.filter(food=>{

      const restaurant=
        restaurantById(
          food.restaurantId
        );


      if(!restaurant){
        return false;
      }


      const time=
        parseInt(
          restaurant.time,
          10
        );


      return time<=25;

    });

  }


  const visibleFoods=
    foods.slice(0,8);


  if(!visibleFoods.length){

    grid.innerHTML=`

      <div class="empty-state">

        <div class="empty-icon">
          🍴
        </div>

        <h3>
          No food available
        </h3>

        <p>
          Try another location or category.
        </p>

      </div>

    `;

    return;
  }


  grid.innerHTML=
    visibleFoods
      .map(productCard)
      .join("");


  bindFoodButtons(grid);

}


/* =========================
   ALL FOOD
========================= */

function renderAllFoods(list=FOODS){

  const grid=$("#all-food-grid");

  if(!grid){
    return;
  }


  if(!list.length){

    grid.innerHTML=`

      <div class="empty-state">

        <div class="empty-icon">
          🔎
        </div>

        <h3>
          No food found
        </h3>

        <p>
          Try another food name or category.
        </p>

      </div>

    `;

    return;
  }


  grid.innerHTML=
    list
      .map(productCard)
      .join("");


  bindFoodButtons(grid);

}


/* =========================
   HOME
========================= */

function initHome(){

  renderCategories();


  renderRestaurants(
    getRestaurantsForLocation()
  );


  renderHomeFoods();


  $$("[data-home-filter]")
    .forEach(button=>{

      button.addEventListener(
        "click",
        ()=>{

          $$("[data-home-filter]")
            .forEach(item=>{
              item.classList.remove("active");
            });


          button.classList.add("active");


          renderHomeFoods(
            button.dataset.homeFilter
          );

        }
      );

    });


  /* =========================
     HOME SEARCH
  ========================= */

  const searchButton=
    $("#home-search-btn");


  const searchInput=
    $("#home-search");


  searchButton?.addEventListener(
    "click",
    ()=>{

      const query=
        searchInput?.value
          .trim()||"";


      const path=
        location.pathname.includes("/pages/")
          ?"restaurants.html"
          :"pages/restaurants.html";


      location.href=
        query
          ?`${path}?q=${encodeURIComponent(query)}`
          :path;

    }
  );


  searchInput?.addEventListener(
    "keydown",
    event=>{

      if(event.key==="Enter"){
        searchButton?.click();
      }

    }
  );

}


/* =========================
   RESTAURANT FILTER
========================= */

function filterRestaurants(){

  const searchInput=
    $("#restaurant-search");


  const q=
    (searchInput?.value||"")
      .toLowerCase()
      .trim();


  const activeFilter=
    $(".filter-btn.active[data-restaurant-filter]");


  const type=
    activeFilter?.dataset.restaurantFilter||
    "all";


  let list=
    getRestaurantsForLocation();


  /* SEARCH */

  if(q){

    list=list.filter(
      restaurant=>{

        const text=`
          ${restaurant.name}
          ${restaurant.cuisine}
          ${restaurant.tag}
          ${restaurant.division}
        `.toLowerCase();


        return text.includes(q);

      }
    );

  }


  /* TOP RATED */

  if(type==="top"){

    list=list.filter(
      restaurant=>
        Number(restaurant.rating)>=4.8
    );

  }


  /* FAST */

  if(type==="fast"){

    list=list.filter(
      restaurant=>{

        const time=
          parseInt(
            restaurant.time,
            10
          );


        return time<=25;

      }
    );

  }


  renderRestaurants(list);

}


/* =========================
   CATEGORY MATCH
========================= */

function foodMatchesCategory(
  food,
  category
){

  if(!category){
    return true;
  }


  const selected=
    category
      .toLowerCase()
      .trim();


  const name=
    (food.name||"")
      .toLowerCase();


  const foodCategory=
    (food.category||"")
      .toLowerCase()
      .trim();


  if(foodCategory===selected){
    return true;
  }


  if(selected==="biryani"){

    return(
      name.includes("biryani")||
      name.includes("kacchi")
    );

  }


  if(selected==="burger"){
    return name.includes("burger");
  }


  if(selected==="pizza"){
    return name.includes("pizza");
  }


  if(selected==="fuchka"){

    return(
      name.includes("fuchka")||
      name.includes("fuska")||
      name.includes("phuchka")
    );

  }


  if(selected==="chotpoti"){
    return name.includes("chotpoti");
  }


  if(selected==="snacks"){

    return(
      foodCategory==="snacks"||
      foodCategory==="street food"||
      name.includes("singara")||
      name.includes("samosa")||
      name.includes("chop")
    );

  }


  if(selected==="chicken"){

    return(
      name.includes("chicken")||
      foodCategory==="chicken"
    );

  }


  if(selected==="chinese"){

    return(
      foodCategory==="chinese"||
      name.includes("chowmein")||
      name.includes("noodle")
    );

  }


  if(selected==="bangla food"){

    return(
      foodCategory==="bangla food"||
      /tehari|kala bhuna|khichuri|bhuna|polao|curry/.test(name)
    );

  }


  if(selected==="dessert"){

    return(
      foodCategory==="dessert"||
      /doi|mishti|donut|sweet/.test(name)
    );

  }


  if(selected==="drinks"){

    return(
      foodCategory==="drinks"||
      /mocha|coffee|juice|drink/.test(name)
    );

  }


  return false;

}


/* =========================
   FOOD FILTER
========================= */

function filterFoods(
  q="",
  category=""
){

  let list=[...FOODS];


  const restaurants=
    getRestaurantsForLocation();


  const restaurantIds=
    restaurants.map(
      restaurant=>restaurant.id
    );


  const localFoods=
    list.filter(
      food=>
        restaurantIds.includes(
          food.restaurantId
        )
    );


  if(localFoods.length){
    list=localFoods;
  }


  /* SEARCH */

  if(q){

    const query=
      q.toLowerCase().trim();


    list=list.filter(
      food=>{

        const text=`
          ${food.name}
          ${food.restaurant}
          ${food.category}
          ${food.desc}
        `.toLowerCase();


        return text.includes(query);

      }
    );

  }


  /* CATEGORY */

  if(category){

    list=list.filter(
      food=>
        foodMatchesCategory(
          food,
          category
        )
    );

  }


  return list;

}


/* =========================
   CATEGORY TITLE
========================= */

function getCategoryTitle(category){

  if(!category){
    return "All food";
  }


  const item=
    CATEGORIES.find(
      item=>
        item.key.toLowerCase()===
        category.toLowerCase()
    );


  if(item){
    return item.name;
  }


  return category;

}


/* =========================
   RESTAURANTS PAGE
========================= */

function initRestaurants(){

  const params=
    new URLSearchParams(
      location.search
    );


  const q=
    params.get("q")||"";


  const category=
    params.get("category")||"";


  const categoryName=
    params.get("categoryName")||
    getCategoryTitle(category);


  const searchInput=
    $("#restaurant-search");


  if(searchInput){
    searchInput.value=q;
  }


  const categoryTitle=
    $("#food-results-title");


  if(categoryTitle){

    categoryTitle.textContent=
      category
        ?`${categoryName} food`
        :"All food";

  }


  /* =========================
     INITIAL RESTAURANTS
  ========================= */

  renderRestaurants(
    getRestaurantsForLocation()
  );


  /* =========================
     INITIAL FOODS
  ========================= */

  renderAllFoods(
    filterFoods(
      q,
      category
    )
  );


  /* =========================
     RESTAURANT FILTERS
  ========================= */

  $$("[data-restaurant-filter]")
    .forEach(button=>{

      button.addEventListener(
        "click",
        ()=>{

          $$("[data-restaurant-filter]")
            .forEach(item=>{
              item.classList.remove("active");
            });


          button.classList.add("active");


          filterRestaurants();

        }
      );

    });


  /* =========================
     SEARCH
  ========================= */

  const searchButton=
    $("#restaurant-search-btn");


  searchButton?.addEventListener(
    "click",
    ()=>{

      const query=
        $("#restaurant-search")
          ?.value
          .toLowerCase()
          .trim()||"";


      filterRestaurants();


      renderAllFoods(
        filterFoods(
          query,
          category
        )
      );

    }
  );


  searchInput?.addEventListener(
    "keydown",
    event=>{

      if(event.key==="Enter"){
        searchButton?.click();
      }

    }
  );

}


/* =========================
   RESTAURANT DETAIL
========================= */

function initRestaurantDetail(){

  const params=
    new URLSearchParams(
      location.search
    );


  const id=params.get("id");


  const restaurant=
    restaurantById(id);


  const hero=
    $("#restaurant-detail-hero");


  /* =========================
     NOT FOUND
  ========================= */

  if(!restaurant){

    if(hero){

      hero.innerHTML=`

        <div class="container">

          <div class="empty-state">

            <div class="empty-icon">
              🍽️
            </div>

            <h2>
              Restaurant not found
            </h2>

            <p>
              This restaurant may no longer
              be available.
            </p>

            <a
              href="restaurants.html"
              class="primary-btn">

              Browse restaurants

            </a>

          </div>

        </div>

      `;

    }

    return;

  }


  /* =========================
     RESTAURANT HERO
  ========================= */

  if(hero){

    hero.innerHTML=`

      <div class="container">

        <div class="restaurant-detail-hero">

          <div class="restaurant-detail-image">

            <img
              src="${getImagePath(
                restaurant.image
              )}"
              alt="${escapeHTML(
                restaurant.name
              )}"
              loading="eager"
              onerror="imageFallback(this)">

          </div>


          <div class="restaurant-detail-content">

            <span class="restaurant-tag">
              ${escapeHTML(
                restaurant.tag
              )}
            </span>


            <h1>
              ${escapeHTML(
                restaurant.name
              )}
            </h1>


            <p class="restaurant-detail-cuisine">
              ${escapeHTML(
                restaurant.cuisine
              )}
            </p>


            <div class="restaurant-detail-meta">

              <span>
                <strong>★</strong>
                ${Number(
                  restaurant.rating||0
                ).toFixed(1)}
              </span>


              <span>
                <strong>◷</strong>
                ${escapeHTML(
                  restaurant.time
                )}
              </span>


              <span>
                <strong>৳</strong>
                ${money(
                  restaurant.fee
                )}
                delivery
              </span>

            </div>


            <div class="restaurant-detail-actions">

              <button
                class="secondary-btn"
                data-favorite="${escapeHTML(
                  restaurant.id
                )}"
                type="button">

                ♡ Favorite

              </button>

            </div>

          </div>

        </div>

      </div>

    `;


    const favoriteButton=
      hero.querySelector(
        "[data-favorite]"
      );


    if(favoriteButton){

      favoriteButton.addEventListener(
        "click",
        ()=>{

          toggleFavorite(
            favoriteButton.dataset.favorite
          );


          updateDetailFavoriteButton(
            favoriteButton
          );

        }
      );


      updateDetailFavoriteButton(
        favoriteButton
      );

    }

  }


  const grid=
    $("#restaurant-food-grid");


  const categoryBox=
    $("#menu-categories");


  if(!grid){
    return;
  }


  const restaurantFoods=
    FOODS.filter(
      food=>
        food.restaurantId===id
    );


  /* =========================
     MENU CATEGORIES
  ========================= */

  if(categoryBox){

    const categories=[
      ...new Set(
        restaurantFoods
          .map(food=>food.category)
          .filter(Boolean)
      )
    ];


    categoryBox.innerHTML=`

      <button
        class="filter-btn active"
        data-menu-category="all"
        type="button">

        All

      </button>


      ${categories.map(
        category=>`

          <button
            class="filter-btn"
            data-menu-category="${escapeHTML(
              category
            )}"
            type="button">

            ${escapeHTML(category)}

          </button>

        `
      ).join("")}

    `;


    $$("[data-menu-category]",categoryBox)
      .forEach(button=>{

        button.addEventListener(
          "click",
          ()=>{

            $$(
              "[data-menu-category]",
              categoryBox
            ).forEach(item=>{
              item.classList.remove("active");
            });


            button.classList.add("active");


            const selected=
              button.dataset.menuCategory;


            let foods=
              restaurantFoods;


            if(selected!=="all"){

              foods=
                restaurantFoods.filter(
                  food=>
                    food.category===
                    selected
                );

            }


            renderRestaurantFoods(
              foods,
              grid
            );

          }
        );

      });

  }


  renderRestaurantFoods(
    restaurantFoods,
    grid
  );

}


/* =========================
   DETAIL FAVORITE
========================= */

function updateDetailFavoriteButton(button){

  if(!button){
    return;
  }


  const active=
    getFavorites().includes(
      button.dataset.favorite
    );


  button.innerHTML=
    active
      ?"♥ Favorited"
      :"♡ Favorite";


  button.classList.toggle(
    "active",
    active
  );

}


/* =========================
   DETAIL FOOD RENDER
========================= */

function renderRestaurantFoods(
  foods,
  grid
){

  if(!foods.length){

    grid.innerHTML=`

      <div class="empty-state">

        <div class="empty-icon">
          🍴
        </div>

        <h3>
          No menu available
        </h3>

        <p>
          This category has no food items yet.
        </p>

      </div>

    `;

    return;

  }


  grid.innerHTML=
    foods
      .map(productCard)
      .join("");


  bindFoodButtons(grid);

}


/* =========================
   PAGE INITIALIZATION
========================= */

document.addEventListener(
  "DOMContentLoaded",
  ()=>{

    const page=
      document.body.dataset.page;


    if(page==="home"){
      initHome();
    }


    if(page==="restaurants"){
      initRestaurants();
    }


    if(page==="restaurant"){
      initRestaurantDetail();
    }

  }
);