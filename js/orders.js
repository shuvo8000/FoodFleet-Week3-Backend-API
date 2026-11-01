const ORDER_STATUS=[
    "Order Confirmed",
    "Restaurant Preparing",
    "Rider Picked Up",
    "Out for Delivery",
    "Delivered"
];


/* =========================
   STATUS ICONS
========================= */

const STATUS_ICONS=[
    "✓",
    "🍳",
    "🛵",
    "📍",
    "✓"
];


/* =========================
   STATUS TIMELINE
========================= */

function statusSteps(status){

    let currentIndex=
        ORDER_STATUS.indexOf(status);

    if(currentIndex<0){
        currentIndex=0;
    }


    return `
        <div class="timeline">

            ${ORDER_STATUS.map((step,index)=>{

                const done=index<currentIndex;
                const current=index===currentIndex;

                return `
                    <div class="
                        timeline-step
                        ${done?"done":""}
                        ${current?"current":""}
                    ">

                        <div class="timeline-marker">

                            ${
                                done
                                ?"✓"
                                :current
                                    ?STATUS_ICONS[index]
                                    :index+1
                            }

                        </div>


                        <div class="timeline-content">

                            <b>
                                ${escapeHTML(step)}
                            </b>


                            ${
                                current
                                ?
                                `
                                    <small>

                                        ${
                                            step==="Delivered"
                                            ?"Order delivered successfully."
                                            :step==="Order Confirmed"
                                                ?"Your order is being processed."
                                                :step==="Restaurant Preparing"
                                                    ?"The restaurant is preparing your food."
                                                    :step==="Rider Picked Up"
                                                        ?"Your rider has picked up the order."
                                                        :"Your order is on the way."
                                        }

                                    </small>
                                `
                                :""
                            }

                        </div>


                        ${
                            index<ORDER_STATUS.length-1
                            ?"<i></i>"
                            :""
                        }

                    </div>
                `;

            }).join("")}

        </div>
    `;
}


/* =========================
   ORDER DATE
========================= */

function formatOrderDate(date){

    const orderDate=new Date(date);

    if(isNaN(orderDate.getTime())){
        return "Date unavailable";
    }


    return orderDate.toLocaleString(
        "en-BD",
        {
            month:"short",
            day:"numeric",
            year:"numeric",
            hour:"numeric",
            minute:"2-digit"
        }
    );
}


/* =========================
   FOOD DESCRIPTION
========================= */

function getFoodDescription(item){

    if(item.description){
        return item.description;
    }


    const descriptions={
        "Special Kacchi":
            "Rich, aromatic kacchi with tender meat.",

        "Crispy Chicken Burger":
            "Crispy chicken, fresh veggies, special sauce.",

        "Chicken Burger":
            "Juicy chicken with fresh vegetables and sauce.",

        "Beef Burger":
            "Juicy beef patty with fresh veggies and sauce.",

        "Chicken Biryani":
            "Fragrant rice with tender chicken and spices.",

        "Beef Tehari":
            "Aromatic rice cooked with tender beef and spices."
    };


    return descriptions[item.name]||
        "Freshly prepared and delivered by FoodFleet.";
}


/* =========================
   FOOD IMAGE
========================= */

function getOrderFoodImage(item){

    if(item.image){
        return getImagePath(item.image);
    }


    return "../assets/images/food/default-food.jpg";
}


/* =========================
   RENDER ORDERS
========================= */

function renderOrders(){

    const list=$("#orders-list");

    if(!list){
        return;
    }


    const orders=getOrders();


    /* =========================
       EMPTY STATE
    ========================= */

    if(!orders.length){

        list.innerHTML=`

            <div class="empty-state">

                <div class="empty-icon">
                    🧾
                </div>


                <h2>
                    No orders yet
                </h2>


                <p>
                    Your delicious order history
                    will appear here.
                </p>


                <a
                    class="primary-btn"
                    href="restaurants.html">

                    Start an order
                    <span>→</span>

                </a>

            </div>

        `;

        return;
    }


    /* =========================
       ORDER LIST
    ========================= */

    list.innerHTML=orders.map(order=>{

        const items=
            Array.isArray(order.items)
            ?order.items
            :[];


        const itemCount=items.reduce(
            (sum,item)=>{

                return sum+
                    Math.max(
                        0,
                        Number(item.qty)||0
                    );

            },
            0
        );


        const status=
            ORDER_STATUS.includes(order.status)
            ?order.status
            :"Order Confirmed";


        const subtotal=
            Number(order.subtotal)||0;


        const delivery=
            Number(order.delivery)||0;


        const discount=
            Number(order.discount)||0;


        const total=
            Number(order.total)||
            Math.max(
                0,
                subtotal+delivery-discount
            );


        const payment=
            order.paymentMethod||
            "Cash on Delivery";


        const address=
            order.address||
            "Delivery address";


        const division=
            order.division||
            getDivision()||
            "Dhaka";


        return `

            <article
                class="order-card"
                data-order-id="${escapeHTML(
                    order.id||""
                )}">


                <!-- =========================
                     ORDER HEADER
                ========================== -->

                <div class="order-head">


                    <div class="order-head-left">

                        <div class="order-title-row">

                            <div class="order-receipt-icon">
                                🧾
                            </div>


                            <div>

                                <span class="eyebrow">
                                    Order #${escapeHTML(
                                        order.id||
                                        "Unknown"
                                    )}
                                </span>


                                <h3>
                                    ${escapeHTML(
                                        order.restaurant||
                                        "FoodFleet Restaurant"
                                    )}
                                </h3>


                                <small>
                                    ${formatOrderDate(
                                        order.date
                                    )}
                                </small>

                            </div>

                        </div>

                    </div>


                    <div class="order-head-right">

                        <span class="
                            status-pill
                            ${
                                status==="Delivered"
                                ?"status-delivered"
                                :"status-active"
                            }">

                            ${
                                status==="Delivered"
                                ?"✓ "
                                :"● "
                            }

                            ${escapeHTML(status)}

                        </span>


                        <button
                            class="order-menu-btn"
                            type="button"
                            aria-label="Order options">

                            ⋯

                        </button>

                    </div>

                </div>


                <!-- =========================
                     FOOD ITEMS
                ========================== -->

                <div class="order-items">

                    ${
                        items.length

                        ?

                        items.map(item=>{

                            const qty=
                                Math.max(
                                    1,
                                    Number(item.qty)||1
                                );


                            const price=
                                Number(item.price)||0;


                            const itemTotal=
                                price*qty;


                            const description=
                                getFoodDescription(item);


                            const image=
                                getOrderFoodImage(item);


                            return `

                                <div class="order-item-row">


                                    <div class="order-item-info">


                                        <div class="order-food-image">

                                            <img
                                                src="${image}"
                                                alt="${escapeHTML(
                                                    item.name||
                                                    "Food item"
                                                )}"
                                                loading="lazy"
                                                onerror="imageFallback(this)">

                                        </div>


                                        <div class="order-food-copy">

                                            <div class="order-food-title">

                                                <span>
                                                    ${escapeHTML(
                                                        item.name||
                                                        "Food item"
                                                    )}
                                                </span>

                                                <small>
                                                    × ${qty}
                                                </small>

                                            </div>


                                            <p>
                                                ${escapeHTML(
                                                    description
                                                )}
                                            </p>

                                        </div>

                                    </div>


                                    <b class="order-item-price">
                                        ${money(itemTotal)}
                                    </b>

                                </div>

                            `;

                        }).join("")

                        :

                        `

                            <div class="order-item-row">

                                <div class="order-item-info">

                                    <div class="order-food-image">
                                        🍴
                                    </div>

                                    <div class="order-food-copy">

                                        <div class="order-food-title">

                                            <span>
                                                Food item
                                            </span>

                                        </div>

                                        <p>
                                            No item details available.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        `
                    }

                </div>


                <!-- =========================
                     ORDER DETAILS
                ========================== -->

                <div class="order-details">


                    <div>

                        <span>
                            Items
                        </span>

                        <b>

                            ${itemCount}

                            ${
                                itemCount===1
                                ?" item"
                                :" items"
                            }

                        </b>

                    </div>


                    <div>

                        <span>
                            Payment
                        </span>

                        <b>
                            ${escapeHTML(payment)}
                        </b>

                    </div>


                    <div>

                        <span>
                            Delivery to
                        </span>

                        <b>
                            📍 ${escapeHTML(
                                division
                            )} Division
                        </b>

                    </div>

                </div>


                <!-- =========================
                     PRICE
                ========================== -->

                <div class="order-price-box">


                    <div>

                        <span>
                            Subtotal
                        </span>

                        <b>
                            ${money(subtotal)}
                        </b>

                    </div>


                    <div>

                        <span>
                            Delivery
                        </span>

                        <b>
                            ${money(delivery)}
                        </b>

                    </div>


                    ${
                        discount
                        ?
                        `
                            <div class="discount-line">

                                <span>
                                    Discount
                                </span>

                                <b>
                                    −${money(discount)}
                                </b>

                            </div>
                        `
                        :""
                    }


                    <div class="order-total-row">

                        <span>
                            Total
                        </span>

                        <strong>
                            ${money(total)}
                        </strong>

                    </div>

                </div>


                <!-- =========================
                     DELIVERY ADDRESS
                ========================== -->

                <div class="order-foot">

                    <div>

                        <span class="address-label">
                            📍 Delivery address
                        </span>


                        <p>
                            ${escapeHTML(address)}
                        </p>

                    </div>

                </div>


                <!-- =========================
                     TIMELINE
                ========================== -->

                ${statusSteps(status)}

            </article>

        `;

    }).join("");
}


/* =========================
   DEMO ORDER TRACKING
========================= */

function updateOrderStatuses(){

    const orders=getOrders();

    let changed=false;


    orders.forEach(order=>{

        if(!order.date){
            return;
        }


        const currentStatus=
            ORDER_STATUS.includes(order.status)
            ?order.status
            :"Order Confirmed";


        const currentIndex=
            ORDER_STATUS.indexOf(
                currentStatus
            );


        if(currentStatus==="Delivered"){
            return;
        }


        const createdTime=
            new Date(order.date).getTime();


        if(isNaN(createdTime)){
            return;
        }


        const elapsed=
            (Date.now()-createdTime)/1000;


        let newIndex=currentIndex;


        /*
         * DEMO TRACKING
         *
         * 0-10 sec   Order Confirmed
         * 10-20 sec  Restaurant Preparing
         * 20-30 sec  Rider Picked Up
         * 30-45 sec  Out for Delivery
         * 45+ sec    Delivered
         */

        if(elapsed>=45){

            newIndex=4;

        }else if(elapsed>=30){

            newIndex=3;

        }else if(elapsed>=20){

            newIndex=2;

        }else if(elapsed>=10){

            newIndex=1;

        }


        if(newIndex>currentIndex){

            order.status=
                ORDER_STATUS[newIndex];


            if(
                order.status==="Delivered"
            ){

                order.deliveredAt=
                    new Date().toISOString();

            }


            changed=true;

        }

    });


    if(changed){

        setData(
            "ff_orders",
            orders
        );

        renderOrders();

    }
}


/* =========================
   START TRACKING
========================= */

let orderTrackingStarted=false;


function startOrderTracking(){

    if(orderTrackingStarted){
        return;
    }


    orderTrackingStarted=true;


    updateOrderStatuses();


    setInterval(
        updateOrderStatuses,
        3000
    );
}


/* =========================
   INITIALIZE
========================= */

document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        renderOrders();

        startOrderTracking();

    }
);