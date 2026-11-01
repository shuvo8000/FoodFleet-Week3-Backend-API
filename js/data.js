/* =========================
   BANGLADESH LOCATIONS
========================= */

const DIVISIONS={

    "Dhaka":[
        "Dhaka","Gazipur","Narayanganj","Tangail","Kishoreganj",
        "Manikganj","Munshiganj","Narsingdi","Faridpur","Gopalganj",
        "Madaripur","Rajbari","Shariatpur"
    ],

    "Chattogram":[
        "Chattogram","Cox's Bazar","Cumilla","Brahmanbaria","Chandpur",
        "Feni","Khagrachhari","Lakshmipur","Noakhali","Rangamati",
        "Bandarban"
    ],

    "Sylhet":[
        "Sylhet","Habiganj","Moulvibazar","Sunamganj"
    ],

    "Rajshahi":[
        "Rajshahi","Bogura","Joypurhat","Naogaon","Natore",
        "Chapainawabganj","Pabna","Sirajganj"
    ],

    "Khulna":[
        "Khulna","Bagerhat","Chuadanga","Jashore","Jhenaidah",
        "Kushtia","Magura","Meherpur","Narail","Satkhira"
    ],

    "Barishal":[
        "Barishal","Barguna","Bhola","Jhalokathi","Patuakhali",
        "Pirojpur"
    ],

    "Rangpur":[
        "Rangpur","Dinajpur","Gaibandha","Kurigram","Lalmonirhat",
        "Nilphamari","Panchagarh","Thakurgaon"
    ],

    "Mymensingh":[
        "Mymensingh","Jamalpur","Netrokona","Sherpur"
    ]
};

const CITIES=Object.values(DIVISIONS).flat();


/* =========================
   CATEGORIES
========================= */

const CATEGORIES=[

    {
        name:"Biryani",
        icon:"🍛",
        desc:"Rich & fragrant",
        key:"Biryani"
    },

    {
        name:"Fuchka",
        icon:"🥙",
        desc:"Tangy & crunchy",
        key:"Fuchka"
    },

    {
        name:"Chotpoti",
        icon:"🥣",
        desc:"Spicy street classic",
        key:"Chotpoti"
    },

    {
        name:"Burger",
        icon:"🍔",
        desc:"Juicy & smoky",
        key:"Burger"
    },

    {
        name:"Pizza",
        icon:"🍕",
        desc:"Cheesy favorites",
        key:"Pizza"
    },

    {
        name:"Singara",
        icon:"🥟",
        desc:"Crispy & savory",
        key:"Snacks"
    },

    {
        name:"Chicken",
        icon:"🍗",
        desc:"Crispy & tender",
        key:"Chicken"
    },

    {
        name:"Chinese",
        icon:"🥢",
        desc:"Wok-tossed",
        key:"Chinese"
    },

    {
        name:"Bangla Food",
        icon:"🍚",
        desc:"Comfort classics",
        key:"Bangla Food"
    },

    {
        name:"Dessert",
        icon:"🍩",
        desc:"Sweet endings",
        key:"Dessert"
    },

    {
        name:"Drinks",
        icon:"🧋",
        desc:"Cool sips",
        key:"Drinks"
    }
];

/* =========================
   RESTAURANTS
========================= */

const RESTAURANTS=[

    /* =========================
       DHAKA
    ========================= */

    {
        id:"r1",
        name:"Kacchi House",
        cuisine:"Kacchi · Bangla",
        rating:4.9,
        time:"25–35 min",
        fee:50,
        tag:"Local favorite",
        city:"Dhaka",
        division:"Dhaka",
        image:"food/kacchi.jpg"
    },

    {
        id:"r2",
        name:"Burger Theory",
        cuisine:"Burgers · Fast Food",
        rating:4.8,
        time:"20–30 min",
        fee:40,
        tag:"Fast delivery",
        city:"Dhaka",
        division:"Dhaka",
        image:"food/burger.jpg"
    },

    {
        id:"r3",
        name:"Pizza Napoli",
        cuisine:"Pizza · Italian",
        rating:4.7,
        time:"30–40 min",
        fee:60,
        tag:"Chef's pick",
        city:"Dhaka",
        division:"Dhaka",
        image:"food/pizza.jpg"
    },

    {
        id:"r4",
        name:"Wok & Bowl",
        cuisine:"Chinese · Asian",
        rating:4.6,
        time:"25–35 min",
        fee:45,
        tag:"Popular",
        city:"Dhaka",
        division:"Dhaka",
        image:"food/chowmein.jpg"
    },

    {
        id:"r5",
        name:"Nanna's Kitchen",
        cuisine:"Bangla · Home style",
        rating:4.8,
        time:"30–40 min",
        fee:35,
        tag:"Comfort food",
        city:"Dhaka",
        division:"Dhaka",
        image:"food/tehari.jpg"
    },

    {
        id:"r6",
        name:"Street Food Corner",
        cuisine:"Fuchka · Chotpoti · Snacks",
        rating:4.9,
        time:"15–25 min",
        fee:25,
        tag:"Street favorite",
        city:"Dhaka",
        division:"Dhaka",
        image:"food/fuchka.jpg"
    },


    /* =========================
       CHATTOGRAM
    ========================= */

    {
        id:"r7",
        name:"Chattogram Spice",
        cuisine:"Bangla · Seafood",
        rating:4.8,
        time:"25–35 min",
        fee:45,
        tag:"Chattogram favorite",
        city:"Chattogram",
        division:"Chattogram",
        image:"https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r8",
        name:"Mezban House",
        cuisine:"Mezban · Beef",
        rating:4.9,
        time:"25–35 min",
        fee:50,
        tag:"Local specialty",
        city:"Chattogram",
        division:"Chattogram",
        image:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r9",
        name:"Seafood Bay",
        cuisine:"Seafood · Asian",
        rating:4.7,
        time:"30–40 min",
        fee:60,
        tag:"Fresh seafood",
        city:"Chattogram",
        division:"Chattogram",
        image:"https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r10",
        name:"Pahari Kitchen",
        cuisine:"Pahari · Bangla",
        rating:4.6,
        time:"30–40 min",
        fee:55,
        tag:"Local taste",
        city:"Chattogram",
        division:"Chattogram",
        image:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r12",
        name:"Port City Kitchen",
        cuisine:"Bangla · Chinese",
        rating:4.6,
        time:"25–35 min",
        fee:40,
        tag:"Popular",
        city:"Chattogram",
        division:"Chattogram",
        image:"https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80"
    },


    /* =========================
       SYLHET
    ========================= */

    {
        id:"r13",
        name:"Sylhet Food House",
        cuisine:"Bangla · Rice meals",
        rating:4.7,
        time:"25–35 min",
        fee:40,
        tag:"Local taste",
        city:"Sylhet",
        division:"Sylhet",
        image:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r14",
        name:"Sylheti Kitchen",
        cuisine:"Sylheti · Beef",
        rating:4.9,
        time:"25–35 min",
        fee:45,
        tag:"Sylheti favorite",
        city:"Sylhet",
        division:"Sylhet",
        image:"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r15",
        name:"Seven Hills Restaurant",
        cuisine:"Bangla · Asian",
        rating:4.7,
        time:"30–40 min",
        fee:50,
        tag:"Popular",
        city:"Sylhet",
        division:"Sylhet",
        image:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r16",
        name:"Tea Garden Bites",
        cuisine:"Snacks · Drinks",
        rating:4.6,
        time:"20–30 min",
        fee:30,
        tag:"Tea time",
        city:"Sylhet",
        division:"Sylhet",
        image:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r17",
        name:"Surma Kitchen",
        cuisine:"Bangla · Home style",
        rating:4.8,
        time:"25–35 min",
        fee:35,
        tag:"Home taste",
        city:"Sylhet",
        division:"Sylhet",
        image:"https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r18",
        name:"Jaflong Food Corner",
        cuisine:"Bangla · Local Food",
        rating:4.7,
        time:"25–35 min",
        fee:40,
        tag:"Local favorite",
        city:"Sylhet",
        division:"Sylhet",
        image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80"
    },


    /* =========================
       RAJSHAHI
    ========================= */


    {
        id:"r20",
        name:"Padma Biryani House",
        cuisine:"Biryani · Bangla",
        rating:4.9,
        time:"25–35 min",
        fee:40,
        tag:"Local favorite",
        city:"Rajshahi",
        division:"Rajshahi",
        image:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r21",
        name:"Rajshahi Grill",
        cuisine:"Grill · Kebab",
        rating:4.7,
        time:"25–35 min",
        fee:45,
        tag:"Grill favorite",
        city:"Rajshahi",
        division:"Rajshahi",
        image:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r22",
        name:"Mango Garden Cafe",
        cuisine:"Cafe · Snacks",
        rating:4.6,
        time:"20–30 min",
        fee:30,
        tag:"Fresh picks",
        city:"Rajshahi",
        division:"Rajshahi",
        image:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r23",
        name:"Padma View Restaurant",
        cuisine:"Bangla · Rice Meals",
        rating:4.7,
        time:"25–35 min",
        fee:35,
        tag:"Family choice",
        city:"Rajshahi",
        division:"Rajshahi",
        image:"https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r24",
        name:"North Bengal Bites",
        cuisine:"Bangla · Snacks",
        rating:4.6,
        time:"20–30 min",
        fee:30,
        tag:"Local taste",
        city:"Rajshahi",
        division:"Rajshahi",
        image:"https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&w=900&q=80"
    },


    /* =========================
       KHULNA
    ========================= */

    {
        id:"r25",
        name:"Khulna Street Bites",
        cuisine:"Street Food · Snacks",
        rating:4.7,
        time:"15–25 min",
        fee:30,
        tag:"Street favorite",
        city:"Khulna",
        division:"Khulna",
        image:"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r26",
        name:"Sundarban Kitchen",
        cuisine:"Bangla · Seafood",
        rating:4.8,
        time:"25–35 min",
        fee:45,
        tag:"Local favorite",
        city:"Khulna",
        division:"Khulna",
        image:"https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r27",
        name:"Rupsha Restaurant",
        cuisine:"Bangla · Rice Meals",
        rating:4.7,
        time:"25–35 min",
        fee:35,
        tag:"Family choice",
        city:"Khulna",
        division:"Khulna",
        image:"https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80"
    },


    {
        id:"r29",
        name:"Royal Snacks",
        cuisine:"Snacks · Fast Food",
        rating:4.6,
        time:"15–25 min",
        fee:25,
        tag:"Fast delivery",
        city:"Khulna",
        division:"Khulna",
        image:"https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r30",
        name:"Moyur River Cafe",
        cuisine:"Cafe · Drinks",
        rating:4.7,
        time:"20–30 min",
        fee:30,
        tag:"Chill spot",
        city:"Khulna",
        division:"Khulna",
        image:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80"
    },


    /* =========================
       BARISHAL
    ========================= */

    {
        id:"r31",
        name:"Barishal Food Point",
        cuisine:"Bangla · Home style",
        rating:4.6,
        time:"25–35 min",
        fee:35,
        tag:"Home taste",
        city:"Barishal",
        division:"Barishal",
        image:"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r32",
        name:"Kirtankhola Kitchen",
        cuisine:"Bangla · Rice Meals",
        rating:4.8,
        time:"25–35 min",
        fee:40,
        tag:"Local favorite",
        city:"Barishal",
        division:"Barishal",
        image:"https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r33",
        name:"Barishal Mezban",
        cuisine:"Mezban · Beef",
        rating:4.7,
        time:"30–40 min",
        fee:45,
        tag:"Traditional",
        city:"Barishal",
        division:"Barishal",
        image:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r34",
        name:"River View Bites",
        cuisine:"Seafood · Bangla",
        rating:4.7,
        time:"25–35 min",
        fee:50,
        tag:"Fresh seafood",
        city:"Barishal",
        division:"Barishal",
        image:"https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r35",
        name:"Barishal Snacks",
        cuisine:"Snacks · Street Food",
        rating:4.6,
        time:"15–25 min",
        fee:25,
        tag:"Quick bites",
        city:"Barishal",
        division:"Barishal",
        image:"https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r36",
        name:"Padma South Kitchen",
        cuisine:"Bangla · Biryani",
        rating:4.8,
        time:"25–35 min",
        fee:40,
        tag:"Popular",
        city:"Barishal",
        division:"Barishal",
        image:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=80"
    },


    /* =========================
       RANGPUR
    ========================= */

    {
        id:"r37",
        name:"Rangpur Bites",
        cuisine:"Bangla · Snacks",
        rating:4.7,
        time:"20–30 min",
        fee:30,
        tag:"Local favorite",
        city:"Rangpur",
        division:"Rangpur",
        image:"food/singara.jpg"
    },

    {
        id:"r38",
        name:"Teesta Kitchen",
        cuisine:"Bangla · Home style",
        rating:4.8,
        time:"25–35 min",
        fee:35,
        tag:"Home taste",
        city:"Rangpur",
        division:"Rangpur",
        image:"https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80"
    },



    {
        id:"r40",
        name:"Rangpur Grill House",
        cuisine:"Grill · Kebab",
        rating:4.7,
        time:"30–40 min",
        fee:45,
        tag:"Grill favorite",
        city:"Rangpur",
        division:"Rangpur",
        image:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r41",
        name:"Rangpur Street Eats",
        cuisine:"Street Food · Snacks",
        rating:4.6,
        time:"15–25 min",
        fee:25,
        tag:"Quick bites",
        city:"Rangpur",
        division:"Rangpur",
        image:"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r42",
        name:"Green North Cafe",
        cuisine:"Cafe · Drinks",
        rating:4.7,
        time:"20–30 min",
        fee:30,
        tag:"Fresh picks",
        city:"Rangpur",
        division:"Rangpur",
        image:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80"
    },


    /* =========================
       MYMENSINGH
    ========================= */

    {
        id:"r43",
        name:"Mymensingh Kitchen",
        cuisine:"Bangla · Local food",
        rating:4.7,
        time:"25–35 min",
        fee:35,
        tag:"Comfort food",
        city:"Mymensingh",
        division:"Mymensingh",
        image:"https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r44",
        name:"Brahmaputra Bites",
        cuisine:"Bangla · Rice Meals",
        rating:4.8,
        time:"25–35 min",
        fee:40,
        tag:"Local favorite",
        city:"Mymensingh",
        division:"Mymensingh",
        image:"https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r45",
        name:"Mymensingh Kacchi",
        cuisine:"Kacchi · Biryani",
        rating:4.8,
        time:"25–35 min",
        fee:45,
        tag:"Popular",
        city:"Mymensingh",
        division:"Mymensingh",
        image:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r46",
        name:"Old Town Grill",
        cuisine:"Grill · Kebab",
        rating:4.7,
        time:"30–40 min",
        fee:45,
        tag:"Grill favorite",
        city:"Mymensingh",
        division:"Mymensingh",
        image:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r47",
        name:"Mymensingh Street Food",
        cuisine:"Street Food · Snacks",
        rating:4.6,
        time:"15–25 min",
        fee:25,
        tag:"Street favorite",
        city:"Mymensingh",
        division:"Mymensingh",
        image:"https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&w=900&q=80"
    },

    {
        id:"r48",
        name:"Agriculture Cafe",
        cuisine:"Cafe · Drinks",
        rating:4.7,
        time:"20–30 min",
        fee:30,
        tag:"Chill spot",
        city:"Mymensingh",
        division:"Mymensingh",
        image:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80"
    }
];


/* =========================
   FOOD ITEMS
========================= */

const FOODS=[

    {
        id:"f1",
        name:"Special Kacchi",
        restaurantId:"r1",
        restaurant:"Kacchi House",
        category:"Biryani",
        price:280,
        oldPrice:320,
        rating:4.9,
        spicy:true,
        image:"food/kacchi.jpg",
        desc:"Fragrant basmati rice, tender mutton and a house spice blend."
    },

    {
        id:"f2",
        name:"Chicken Biryani",
        restaurantId:"r1",
        restaurant:"Kacchi House",
        category:"Biryani",
        price:220,
        oldPrice:250,
        rating:4.8,
        spicy:true,
        image:"food/chicken-biryani.jpg",
        desc:"Aromatic chicken biryani with rich, slow-cooked masala."
    },

    {
        id:"f3",
        name:"Smoky Beef Burger",
        restaurantId:"r2",
        restaurant:"Burger Theory",
        category:"Burger",
        price:260,
        oldPrice:300,
        rating:4.9,
        spicy:true,
        image:"food/burger.jpg",
        desc:"Smoked beef patty, caramelized onion and signature sauce."
    },

    {
        id:"f4",
        name:"Crispy Chicken Burger",
        restaurantId:"r2",
        restaurant:"Burger Theory",
        category:"Chicken",
        price:230,
        rating:4.7,
        spicy:false,
        image:"food/chicken-burger.jpg",
        desc:"Crunchy chicken, lettuce and creamy pepper mayo."
    },

    {
        id:"f5",
        name:"Chicken Pepperoni Pizza",
        restaurantId:"r3",
        restaurant:"Pizza Napoli",
        category:"Pizza",
        price:390,
        oldPrice:450,
        rating:4.8,
        spicy:true,
        image:"food/pizza.jpg",
        desc:"Stone-baked crust with chicken pepperoni and mozzarella."
    },

    {
        id:"f6",
        name:"Chicken Chowmein",
        restaurantId:"r4",
        restaurant:"Wok & Bowl",
        category:"Chinese",
        price:190,
        rating:4.6,
        spicy:true,
        image:"food/chowmein.jpg",
        desc:"Wok-tossed noodles, chicken, vegetables and chili oil."
    },

    {
        id:"f7",
        name:"Beef Tehari",
        restaurantId:"r5",
        restaurant:"Nanna's Kitchen",
        category:"Bangla Food",
        price:240,
        rating:4.8,
        spicy:true,
        image:"food/tehari.jpg",
        desc:"Comforting Bangla tehari with tender beef and fragrant rice."
    },

    {
        id:"f8",
        name:"Dal & Rice Combo",
        restaurantId:"r5",
        restaurant:"Nanna's Kitchen",
        category:"Bangla Food",
        price:150,
        rating:4.5,
        spicy:false,
        image:"food/dal-bhat.jpg",
        desc:"Simple homestyle dal, rice and seasonal bhorta."
    },

    {
        id:"f9",
        name:"Fuchka",
        restaurantId:"r6",
        restaurant:"Street Food Corner",
        category:"Street Food",
        price:100,
        rating:4.9,
        spicy:true,
        image:"food/fuchka.jpg",
        desc:"Crispy puri filled with spiced potato, tamarind water and masala."
    },

    {
        id:"f10",
        name:"Chotpoti",
        restaurantId:"r6",
        restaurant:"Street Food Corner",
        category:"Street Food",
        price:120,
        rating:4.8,
        spicy:true,
        image:"food/chotpoti.jpg",
        desc:"Chickpeas, potato, egg and tangy tamarind chutney."
    },

    {
        id:"f11",
        name:"Doi Fuchka",
        restaurantId:"r6",
        restaurant:"Street Food Corner",
        category:"Street Food",
        price:140,
        rating:4.7,
        spicy:false,
        image:"food/doi-fuchka.jpg",
        desc:"Fuchka topped with creamy doi, chutney and crunchy spices."
    },

    {
        id:"f12",
        name:"Singara",
        restaurantId:"r6",
        restaurant:"Street Food Corner",
        category:"Snacks",
        price:20,
        rating:4.7,
        spicy:false,
        image:"food/singara.jpg",
        desc:"Crispy pastry filled with spiced potato and peas."
    },

    {
        id:"f13",
        name:"Samosa",
        restaurantId:"r6",
        restaurant:"Street Food Corner",
        category:"Snacks",
        price:25,
        rating:4.6,
        spicy:true,
        image:"food/samosa.jpg",
        desc:"Crispy triangular snack with savory potato filling."
    },

    {
        id:"f14",
        name:"Chicken Roast",
        restaurantId:"r5",
        restaurant:"Nanna's Kitchen",
        category:"Bangla Food",
        price:260,
        rating:4.8,
        spicy:true,
        image:"food/chicken-roast.jpg",
        desc:"Tender chicken roast with aromatic Bangladeshi spices."
    },

    {
        id:"f15",
        name:"Beef Kala Bhuna",
        restaurantId:"r5",
        restaurant:"Nanna's Kitchen",
        category:"Bangla Food",
        price:320,
        rating:4.9,
        spicy:true,
        image:"food/kala-bhuna.jpg",
        desc:"Slow-cooked beef with dark roasted spices and onion."
    },

    {
        id:"f16",
        name:"Classic Donut Box",
        restaurantId:"r7",
        restaurant:"Misti Bari",
        category:"Dessert",
        price:180,
        rating:4.7,
        spicy:false,
        image:"food/donut.jpg",
        desc:"Six soft donuts with chocolate and vanilla glaze."
    },

    {
        id:"f17",
        name:"Mishti Doi",
        restaurantId:"r7",
        restaurant:"Misti Bari",
        category:"Dessert",
        price:120,
        rating:4.8,
        spicy:false,
        image:"food/mishti-doi.jpg",
        desc:"Traditional sweetened yogurt with a creamy caramel note."
    },

    {
        id:"f18",
        name:"Iced Mocha",
        restaurantId:"r7",
        restaurant:"Misti Bari",
        category:"Drinks",
        price:160,
        rating:4.7,
        spicy:false,
        image:"food/iced-mocha.jpg",
        desc:"Cold espresso, chocolate and creamy milk over ice."
    },

    {
        id:"f19",
        name:"Jhalmuri",
        restaurantId:"r6",
        restaurant:"Street Food Corner",
        category:"Street Food",
        price:80,
        rating:4.7,
        spicy:true,
        image:"food/jhalmuri.jpg",
        desc:"Puffed rice mixed with onion, chili, mustard oil and spices."
    },

    {
        id:"f20",
        name:"Alur Chop",
        restaurantId:"r6",
        restaurant:"Street Food Corner",
        category:"Snacks",
        price:30,
        rating:4.6,
        spicy:true,
        image:"food/alur-chop.jpg",
        desc:"Crispy potato fritter with a spicy seasoned filling."
    },

    {
        id:"f21",
        name:"Chicken Roast with Polao",
        restaurantId:"r8",
        restaurant:"Chattogram Spice",
        category:"Bangla Food",
        price:290,
        rating:4.8,
        spicy:true,
        image:"food/chicken-roast.jpg",
        desc:"Tender chicken roast served with fragrant polao rice."
    },

    {
        id:"f22",
        name:"Chingri Bhuna",
        restaurantId:"r8",
        restaurant:"Chattogram Spice",
        category:"Bangla Food",
        price:340,
        rating:4.8,
        spicy:true,
        image:"food/chingri-bhuna.jpg",
        desc:"Spicy Bangladeshi shrimp cooked with onion and roasted spices."
    },

    {
        id:"f23",
        name:"Sylheti Beef Curry",
        restaurantId:"r9",
        restaurant:"Sylhet Food House",
        category:"Bangla Food",
        price:280,
        rating:4.7,
        spicy:true,
        image:"food/beef-curry.jpg",
        desc:"Tender beef cooked with traditional Sylheti spices."
    },

    {
        id:"f24",
        name:"Rajshahi Chicken Biryani",
        restaurantId:"r10",
        restaurant:"Rajshahi Kitchen",
        category:"Biryani",
        price:230,
        rating:4.8,
        spicy:true,
        image:"food/chicken-biryani.jpg",
        desc:"Fragrant rice and tender chicken cooked with aromatic spices."
    },

    {
        id:"f25",
        name:"Jhalmuri Special",
        restaurantId:"r11",
        restaurant:"Khulna Street Bites",
        category:"Street Food",
        price:90,
        rating:4.7,
        spicy:true,
        image:"food/jhalmuri.jpg",
        desc:"Fresh puffed rice with mustard oil, chili and crunchy toppings."
    },

    {
        id:"f26",
        name:"Barishali Khichuri",
        restaurantId:"r12",
        restaurant:"Barishal Food Point",
        category:"Bangla Food",
        price:180,
        rating:4.7,
        spicy:true,
        image:"food/khichuri.jpg",
        desc:"Warm rice and lentil khichuri with traditional Bangladeshi spices."
    },

    {
        id:"f27",
        name:"Rangpur Singara Box",
        restaurantId:"r13",
        restaurant:"Rangpur Bites",
        category:"Snacks",
        price:80,
        rating:4.7,
        spicy:false,
        image:"food/singara.jpg",
        desc:"Fresh crispy singara served as a convenient snack box."
    },

    {
        id:"f28",
        name:"Mymensingh Beef Bhuna",
        restaurantId:"r14",
        restaurant:"Mymensingh Kitchen",
        category:"Bangla Food",
        price:300,
        rating:4.7,
        spicy:true,
        image:"food/beef-bhuna.jpg",
        desc:"Slow-cooked beef with onion and traditional Bangladeshi spices."
    }
];


/* =========================
   DEFAULT USER
========================= */

const DEFAULT_USER={

    id:"u1",
    name:"Shuvo",
    mobile:"01700000000",
    password:"123456",
    nid:"",
    dob:"",
    address:"Dhanmondi, Dhaka",
    city:"Dhaka",
    division:"Dhaka",
    photo:"",
    createdAt:"2026-10-01T00:00:00.000Z"
};


/* =========================
   DEMO ORDER
========================= */

const DEMO_ORDER={

    id:"FF1024",

    date:new Date(
        Date.now()-86400000*2
    ).toISOString(),

    restaurant:"Kacchi House",
    restaurantId:"r1",

    items:[
        {
            id:"f1",
            name:"Special Kacchi",
            price:280,
            qty:1,
            image:"food/kacchi.jpg"
        }
    ],

    subtotal:280,
    delivery:50,
    discount:0,
    total:330,

    address:"Dhanmondi, Dhaka",
    city:"Dhaka",
    division:"Dhaka",

    paymentMethod:"Cash on Delivery",

    status:"Delivered"
};


/* =========================
   SEED LOCAL DATA
========================= */

function seedData(){

    let users=getData("ff_users",[]);

    if(!users.length){

        users=[DEFAULT_USER];

    }else if(
        !users.some(
            user=>user.id===DEFAULT_USER.id
        )
    ){

        users.unshift(DEFAULT_USER);
    }

    setData("ff_users",users);


    /* LOCATION */

    if(!localStorage.getItem("ff_city")){

        localStorage.setItem(
            "ff_city",
            "Dhaka"
        );
    }

    if(!localStorage.getItem("ff_division")){

        localStorage.setItem(
            "ff_division",
            "Dhaka"
        );
    }


    /* CART */

    if(!localStorage.getItem("ff_cart")){

        setData(
            "ff_cart",
            []
        );
    }


    /* FAVORITES */

    if(!localStorage.getItem("ff_favorites")){

        setData(
            "ff_favorites",
            []
        );
    }


    /* ORDERS */

    if(!localStorage.getItem("ff_orders")){

        setData(
            "ff_orders",
            [DEMO_ORDER]
        );
    }
}


/* =========================
   START DATA
========================= */

seedData();