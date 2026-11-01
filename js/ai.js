/* =========================
   BUILD AI
========================= */

function buildAI(){

  const root=$("#ai-root");

  if(!root) return;

  root.innerHTML=`

    <button
      id="ai-fab"
      class="ai-fab"
      type="button"
      aria-label="Open FoodFleet AI">

      <span class="ai-fab-icon">✦</span>
      <span>FoodFleet AI</span>

    </button>


    <aside
      id="ai-panel"
      class="ai-panel"
      aria-label="FoodFleet AI assistant">

      <div class="ai-header">

        <div class="ai-header-left">

          <span class="ai-avatar">✦</span>

          <div class="ai-header-text">

            <b>FoodFleet AI</b>

            <small>
              Your local food assistant
            </small>

          </div>

        </div>


        <button
          id="ai-close"
          class="ai-close"
          type="button"
          aria-label="Close FoodFleet AI">

          ×

        </button>

      </div>


      <div class="ai-status">

        <span></span>

        Online · Ready to help

      </div>


      <div
        id="ai-messages"
        class="ai-messages"
        aria-live="polite">
      </div>


      <div class="ai-prompts">

        <button type="button">
          🛒 What's in my cart?
        </button>

        <button type="button">
          📦 Show my latest order
        </button>

        <button type="button">
          💰 Food under ৳300
        </button>

        <button type="button">
          🌶️ Find spicy food
        </button>

        <button type="button">
          ⭐ Popular restaurants
        </button>

      </div>


      <form
        id="ai-form"
        class="ai-input">

        <input
          id="ai-query"
          type="text"
          placeholder="Ask FoodFleet AI..."
          autocomplete="off"
          maxlength="180">

        <button
          type="submit"
          aria-label="Send message">

          ↑

        </button>

      </form>

    </aside>
  `;


  /* =========================
     OPEN AI
  ========================= */

  const openAI=()=>{

    const panel=$("#ai-panel");

    if(!panel) return;

    panel.classList.add("open");

    const messages=$("#ai-messages");

    if(messages && !messages.children.length){

      aiMessage(
        "bot",
        `Welcome to FoodFleet AI! 👋

I'm your local food assistant. I can help you find food, check your cart, track orders, and recommend restaurants.

How can I help you today? 😊`
      );

    }

    setTimeout(
      ()=>{
        $("#ai-query")?.focus();
      },
      150
    );

  };


  /* =========================
     FAB
  ========================= */

  $("#ai-fab").onclick=()=>{

    const panel=$("#ai-panel");

    if(!panel) return;

    if(panel.classList.contains("open")){

      panel.classList.remove("open");

    }else{

      openAI();

    }

  };


  /* =========================
     CLOSE AI
  ========================= */

  $("#ai-close").onclick=()=>{

    $("#ai-panel")?.classList.remove("open");

  };


  /* =========================
     QUICK PROMPTS
  ========================= */

  $$(".ai-prompts button").forEach(
    button=>{

      button.onclick=()=>{

        sendAI(
          button.textContent
            .replace(/^[^\w৳]+/,"")
            .trim()
        );

      };

    }
  );


  /* =========================
     FORM
  ========================= */

  $("#ai-form").onsubmit=event=>{

    event.preventDefault();

    const input=$("#ai-query");

    const query=
      input?.value.trim()||"";

    if(!query) return;

    sendAI(query);

  };


  /* =========================
     AUTO OPEN - HOME ONLY
  ========================= */

  if(
    document.body &&
    document.body.dataset.page==="home"
  ){

    setTimeout(
      ()=>{
        openAI();
      },
      700
    );

  }

}


/* =========================
   AI MESSAGE
========================= */

function aiMessage(who,text){

  const box=$("#ai-messages");

  if(!box) return;

  const message=
    document.createElement("div");

  message.className=
    `ai-msg ${who}`;

  message.textContent=text;

  box.appendChild(message);

  requestAnimationFrame(
    ()=>{
      box.scrollTop=
        box.scrollHeight;
    }
  );

}


/* =========================
   ORDER HELPERS
========================= */

function latestOrder(){

  const orders=getOrders();

  if(!orders.length){

    return null;

  }

  return [...orders].sort(
    (a,b)=>{

      const dateA=
        new Date(
          a.date||
          a.createdAt||
          0
        ).getTime();

      const dateB=
        new Date(
          b.date||
          b.createdAt||
          0
        ).getTime();

      return dateB-dateA;

    }
  )[0];

}


function orderItemCount(order){

  return (order?.items||[]).reduce(
    (sum,item)=>
      sum+
      Math.max(
        0,
        Number(item.qty)||0
      ),
    0
  );

}


/* =========================
   FOOD HELPERS
========================= */

function foodRatingSort(a,b){

  return (
    (Number(b.rating)||0)-
    (Number(a.rating)||0)
  );

}


function priceSort(a,b){

  return (
    (Number(a.price)||0)-
    (Number(b.price)||0)
  );

}


function foodListText(foods){

  return foods.map(
    food=>
      `• ${food.name} — ${money(food.price)} · ★ ${food.rating}`
  ).join("\n");

}


function restaurantListText(restaurants){

  return restaurants.map(
    restaurant=>
      `• ${restaurant.name} — ★ ${restaurant.rating} · ${restaurant.time}`
  ).join("\n");

}


/* =========================
   BUDGET
========================= */

function aiRecommendUnder(limit){

  const foods=
    [...FOODS]
      .filter(
        food=>
          Number(food.price)<=limit
      )
      .sort(foodRatingSort)
      .slice(0,4);

  if(!foods.length){

    return `
I couldn't find a dish under ${money(limit)}.

Try increasing your budget a little.
    `.trim();

  }

  return `
Here are some picks under ${money(limit)} 🍽️

${foodListText(foods)}

Want something spicy, sweet, or filling?
  `.trim();

}


/* =========================
   LOCATION RESTAURANTS
========================= */

function aiLocationRestaurants(){

  const division=
    getDivision()||
    "Dhaka";

  let restaurants=
    RESTAURANTS.filter(
      restaurant=>
        restaurant.division===division
    );

  if(!restaurants.length){

    restaurants=[
      ...RESTAURANTS
    ];

  }

  return restaurants;

}


/* =========================
   CATEGORY DETECTION
========================= */

function findFoodCategory(text){

  const categories={

    biryani:[
      "biryani",
      "biriyani",
      "kacchi"
    ],

    burger:[
      "burger",
      "burgers"
    ],

    pizza:[
      "pizza",
      "pizzas"
    ],

    fuchka:[
      "fuchka",
      "fuska",
      "phuchka"
    ],

    chotpoti:[
      "chotpoti",
      "chatpoti"
    ],

    singara:[
      "singara",
      "samosa",
      "snacks",
      "snack"
    ],

    chicken:[
      "chicken"
    ],

    chinese:[
      "chinese",
      "chowmein",
      "noodles",
      "noodle"
    ],

    bangla:[
      "bangla",
      "bangladeshi",
      "tehari",
      "kala bhuna",
      "bhuna",
      "khichuri",
      "polao"
    ],

    dessert:[
      "dessert",
      "desserts",
      "mishti",
      "misti",
      "doi",
      "donut",
      "sweet"
    ],

    drinks:[
      "drink",
      "drinks",
      "juice",
      "coffee",
      "mocha"
    ]

  };


  for(const category in categories){

    if(
      categories[category].some(
        word=>text.includes(word)
      )
    ){

      return category;

    }

  }

  return "";

}


/* =========================
   CATEGORY FOOD MATCH
========================= */

function foodMatchesAI(food,category){

  const name=
    (food.name||"").toLowerCase();

  const foodCategory=
    (food.category||"").toLowerCase();


  switch(category){

    case "biryani":

      return (
        foodCategory==="biryani"||
        name.includes("biryani")||
        name.includes("kacchi")
      );


    case "burger":

      return (
        foodCategory==="burger"||
        name.includes("burger")
      );


    case "pizza":

      return (
        foodCategory==="pizza"||
        name.includes("pizza")
      );


    case "fuchka":

      return /fuchka|fuska|phuchka/.test(name);


    case "chotpoti":

      return name.includes("chotpoti");


    case "singara":

      return (
        foodCategory==="snacks"||
        name.includes("singara")||
        name.includes("samosa")||
        name.includes("chop")
      );


    case "chicken":

      return (
        name.includes("chicken")||
        foodCategory==="chicken"
      );


    case "chinese":

      return (
        foodCategory==="chinese"||
        name.includes("chowmein")||
        name.includes("noodle")
      );


    case "bangla":

      return (
        foodCategory==="bangla food"||
        /tehari|kala bhuna|bhuna|khichuri|polao|curry/.test(name)
      );


    case "dessert":

      return (
        foodCategory==="dessert"||
        /doi|donut|mishti|sweet/.test(name)
      );


    case "drinks":

      return (
        foodCategory==="drinks"||
        /mocha|coffee|juice|drink/.test(name)
      );


    default:

      return false;

  }

}


/* =========================
   FOOD NAME SEARCH
========================= */

function findFoodByName(text){

  const exact=
    FOODS.find(
      food=>
        text.includes(
          food.name.toLowerCase()
        )
    );

  if(exact){

    return exact;

  }


  return FOODS.find(food=>{

    const words=
      food.name
        .toLowerCase()
        .split(/\s+/)
        .filter(
          word=>word.length>3
        );

    return words.some(
      word=>text.includes(word)
    );

  });

}


/* =========================
   AI RESPONSE
========================= */

function getAIResponse(query){

  const text=
    query
      .toLowerCase()
      .replace(/[?!.,]/g," ")
      .replace(/\s+/g," ")
      .trim();


  if(!text){

    return "Tell me what you'd like to know about FoodFleet.";

  }


  /* =========================
     CART
  ========================= */

  if(/cart|basket|bag/.test(text)){

    const cart=getCart();

    if(!cart.length){

      return `
Your cart is empty right now. 🛒

Add something delicious and I'll help you check it.
      `.trim();

    }


    const count=
      cart.reduce(
        (sum,item)=>
          sum+
          Math.max(
            0,
            Number(item.qty)||0
          ),
        0
      );


    const subtotal=
      cart.reduce(
        (sum,item)=>
          sum+
          (Number(item.price)||0)*
          (Number(item.qty)||0),
        0
      );


    return `
You have ${count} item${count===1?"":"s"} in your cart. 🛒

${cart.map(item=>
  `• ${item.name} × ${item.qty} — ${money(
    (Number(item.price)||0)*
    (Number(item.qty)||0)
  )}`
).join("\n")}

Subtotal: ${money(subtotal)}
    `.trim();

  }


  /* =========================
     LATEST ORDER
  ========================= */

  if(
    (
      /latest|last|recent|previous/.test(text)&&
      /order|ordered|bought|purchase/.test(text)
    )||
    /order status|where.*order|order.*where/.test(text)
  ){

    const order=latestOrder();

    if(!order){

      return `
You don't have any orders yet. 🍽️

Find a restaurant and place your first FoodFleet order!
      `.trim();

    }


    const items=
      (order.items||[])
        .map(
          item=>
            `• ${item.name} × ${item.qty}`
        )
        .join("\n");


    const division=
      order.division||
      getDivision()||
      "Dhaka";


    return `
Your latest order is #${order.id}. 🍽️

${items}

Restaurant: ${order.restaurant||"FoodFleet Restaurant"}
Total: ${money(Number(order.total)||0)}
Status: ${order.status||"Order Confirmed"} 🚴

Delivery location: ${division} Division
    `.trim();

  }


  /* =========================
     ORDER COUNT
  ========================= */

  if(
    /how many.*order|number of order|my orders|orders do i have/.test(text)
  ){

    const orders=getOrders();

    return orders.length
      ?`You have ${orders.length} FoodFleet order${orders.length===1?"":"s"} in your order history. 📦`
      :"You don't have any FoodFleet orders yet.";

  }


  /* =========================
     BUDGET
  ========================= */

  const budgetMatch=
    text.match(
      /(?:under|below|within|budget of|less than|up to)\s*(?:৳|tk|taka)?\s*(\d+)/
    );


  if(budgetMatch){

    const limit=
      Number(budgetMatch[1]);

    if(limit>0){

      return aiRecommendUnder(limit);

    }

  }


  /* =========================
     SPICY
  ========================= */

  if(/spicy|hot|chili|chilli|jhal/.test(text)){

    const foods=
      [...FOODS]
        .filter(
          food=>food.spicy
        )
        .sort(foodRatingSort)
        .slice(0,4);

    if(!foods.length){

      return "I couldn't find any spicy dishes right now.";

    }

    return `
If you want some heat 🌶️, try:

${foodListText(foods)}

Want me to find something spicy within a budget?
    `.trim();

  }


  /* =========================
     SWEET
  ========================= */

  if(
    /sweet|dessert|desserts|mishti|misti/.test(text)
  ){

    const foods=
      FOODS
        .filter(
          food=>
            foodMatchesAI(
              food,
              "dessert"
            )
        )
        .sort(foodRatingSort)
        .slice(0,4);

    if(!foods.length){

      return "I couldn't find a dessert option right now.";

    }

    return `
For something sweet 🍰:

${foodListText(foods)}
    `.trim();

  }


  /* =========================
     CATEGORY
  ========================= */

  const category=
    findFoodCategory(text);

  if(category){

    const foods=
      FOODS
        .filter(
          food=>
            foodMatchesAI(
              food,
              category
            )
        )
        .sort(foodRatingSort)
        .slice(0,4);

    if(foods.length){

      return `
Here are some ${category} options:

${foodListText(foods)}
      `.trim();

    }

  }


  /* =========================
     POPULAR RESTAURANTS
  ========================= */

  if(
    /popular restaurant|popular restaurants|best restaurant|good restaurant|restaurant recommendation|restaurant recommend/.test(text)
  ){

    const division=
      getDivision()||
      "Dhaka";

    const restaurants=
      aiLocationRestaurants()
        .sort(
          (a,b)=>
            (Number(b.rating)||0)-
            (Number(a.rating)||0)
        )
        .slice(0,4);

    return `
Popular restaurants in ${division} Division 📍:

${restaurantListText(restaurants)}

These are based on the FoodFleet demo data.
    `.trim();

  }


  /* =========================
     NEARBY
  ========================= */

  if(
    /restaurants near me|near me|restaurants nearby|nearby restaurant|restaurants around me/.test(text)
  ){

    const division=
      getDivision()||
      "Dhaka";

    const restaurants=
      aiLocationRestaurants()
        .slice(0,4);

    return `
Restaurants available in ${division} Division 📍:

${restaurantListText(restaurants)}
    `.trim();

  }


  /* =========================
     FOOD PRICE
  ========================= */

  const priceFood=
    findFoodByName(text);

  if(
    priceFood&&
    /price|cost|how much|tk|taka|৳/.test(text)
  ){

    return `
${priceFood.name} costs ${money(priceFood.price)} at ${priceFood.restaurant}. 🍽️

Rating: ★ ${priceFood.rating}
    `.trim();

  }


  /* =========================
     CHEAPEST
  ========================= */

  if(
    /cheap|cheapest|lowest price|lowest priced|least expensive/.test(text)
  ){

    const food=
      [...FOODS]
        .sort(priceSort)[0];

    if(!food){

      return "I couldn't find any food items right now.";

    }

    return `
The lowest-priced dish in the current FoodFleet menu is:

${food.name} — ${money(food.price)}
Restaurant: ${food.restaurant}

Give me a budget and I can find more options.
    `.trim();

  }


  /* =========================
     MOST EXPENSIVE
  ========================= */

  if(
    /expensive|highest price|most expensive/.test(text)
  ){

    const food=
      [...FOODS]
        .sort(
          (a,b)=>
            (Number(b.price)||0)-
            (Number(a.price)||0)
        )[0];

    if(!food){

      return "I couldn't find any food items right now.";

    }

    return `
One of the highest-priced dishes in the current menu is:

${food.name} — ${money(food.price)}
Restaurant: ${food.restaurant}
    `.trim();

  }


  /* =========================
     RECOMMENDATION
  ========================= */

  if(
    /hungry|recommend|recommendation|suggest|suggestion|what should i eat|what should i order|craving|what can i eat|something to eat|give me food/.test(text)
  ){

    const favorites=
      getFavorites();

    const favoriteFoods=
      FOODS.filter(
        food=>
          favorites.includes(food.id)
      );


    if(favoriteFoods.length){

      const picks=
        [...favoriteFoods]
          .sort(foodRatingSort)
          .slice(0,3);

      return `
Based on your FoodFleet favorites, you might enjoy:

${foodListText(picks)}

You can also tell me a budget, like "under ৳300".
      `.trim();

    }


    const picks=
      [...FOODS]
        .sort(foodRatingSort)
        .slice(0,3);


    return `
Here are a few popular picks to consider today 😋:

${foodListText(picks)}

Tell me your budget or say "find spicy food" for a more specific recommendation.
    `.trim();

  }


  /* =========================
     FAVORITES
  ========================= */

  if(
    /favorite|favorites|favourite|favourites|saved food/.test(text)
  ){

    const favorites=
      getFavorites();

    if(!favorites.length){

      return `
You haven't saved any favorites yet. ❤️

Tap the heart on a food or restaurant to save it.
      `.trim();

    }


    const foods=
      FOODS
        .filter(
          food=>
            favorites.includes(food.id)
        )
        .slice(0,5);


    if(!foods.length){

      return `
You have ${favorites.length} saved favorite item${favorites.length===1?"":"s"}, but they aren't available in the current menu data.
      `.trim();

    }


    return `
Your saved food favorites ❤️:

${foodListText(foods)}
    `.trim();

  }


  /* =========================
     LOCATION
  ========================= */

  if(
    /city|location|where am i|where do you deliver|delivery area|deliver here|division/.test(text)
  ){

    const division=
      getDivision()||
      "Dhaka";


    return `
Your current FoodFleet location is:

📍 ${division} Division

FoodFleet uses your selected division to show relevant restaurants and delivery options.
    `.trim();

  }


  /* =========================
     GREETING
  ========================= */

  if(
    /^(hi|hello|hey|assalamualaikum|salam|good morning|good afternoon|good evening)$/.test(text)
  ){

    return `
Hello! 👋

I'm FoodFleet AI. I can help you with:

• Cart
• Orders
• Food prices
• Budget recommendations
• Spicy food
• Restaurants
• Favorites
• Delivery location

What would you like to know?
    `.trim();

  }


  /* =========================
     HELP
  ========================= */

  if(
    /help|what can you do|commands|options/.test(text)
  ){

    return `
I can help you with:

• "What's in my cart?"
• "Show my latest order"
• "Recommend something under ৳300"
• "Find spicy food"
• "Show popular restaurants"
• "How much is Special Kacchi?"
• "Show my favorites"
• "Where do you deliver?"

Just ask naturally. 😊
    `.trim();

  }


  /* =========================
     FALLBACK
  ========================= */

  return `
I can help you with your FoodFleet experience. 😊

Try asking:

• "What's in my cart?"
• "Recommend something under ৳300"
• "Find spicy food"
• "Show popular restaurants"
• "How much is Kacchi?"
• "Show my latest order"
  `.trim();

}


/* =========================
   SEND AI MESSAGE
========================= */

function sendAI(query){

  const q=
    query.trim();

  if(!q) return;

  aiMessage(
    "user",
    q
  );

  const input=
    $("#ai-query");

  if(input){

    input.value="";

  }

  const button=
    $("#ai-form button");

  if(button){

    button.disabled=true;

  }


  setTimeout(
    ()=>{

      const response=
        getAIResponse(q);

      aiMessage(
        "bot",
        response
      );

      if(button){

        button.disabled=false;

      }

      input?.focus();

    },
    300
  );

}


/* =========================
   INIT
========================= */

document.addEventListener(
  "DOMContentLoaded",
  buildAI
);