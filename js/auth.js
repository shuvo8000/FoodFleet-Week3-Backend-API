/* =========================
   AUTH MESSAGE
========================= */

function showAuthMessage(id,text,type="error"){

    const el=$("#"+id);

    if(!el) return;

    el.textContent=text;
    el.className=`form-message ${type}`;

}


/* =========================
   BD MOBILE
========================= */

function validBDMobile(value){

    return /^01[3-9]\d{8}$/.test(value);

}


/* =========================
   CLEAN MOBILE
========================= */

function cleanMobile(value){

    return String(value)
        .replace(/\s+/g,"")
        .trim();

}


/* =========================
   REDIRECT
========================= */

function redirectHome(){

    location.href="../index.html";

}


/* =========================
   BUTTON LOADING
========================= */

function setAuthLoading(button,loading,text){

    if(!button) return;

    if(loading){

        button.dataset.originalText=
            button.textContent;

        button.disabled=true;
        button.textContent=text;

    }else{

        button.disabled=false;

        button.textContent=
            button.dataset.originalText||
            "Continue";

    }

}


/* =========================
   LOGIN
========================= */

function initLogin(){

    const form=$("#login-form");

    if(!form) return;

    form.addEventListener(
        "submit",
        event=>{

            event.preventDefault();

            const mobile=cleanMobile(
                $("#login-mobile")?.value||""
            );

            const password=
                $("#login-password")?.value||"";

            const button=
                form.querySelector(
                    'button[type="submit"]'
                );


            showAuthMessage(
                "login-message",
                ""
            );


            /* MOBILE */

            if(!validBDMobile(mobile)){

                showAuthMessage(
                    "login-message",
                    "Enter a valid Bangladesh mobile number."
                );

                $("#login-mobile")?.focus();

                return;

            }


            /* PASSWORD */

            if(!password){

                showAuthMessage(
                    "login-message",
                    "Please enter your password."
                );

                $("#login-password")?.focus();

                return;

            }


            /* USERS */

            const users=getData(
                "ff_users",
                []
            );


            const user=users.find(
                item=>
                    cleanMobile(item.mobile)===mobile&&
                    item.password===password
            );


            if(!user){

                showAuthMessage(
                    "login-message",
                    "Mobile number or password is incorrect."
                );

                $("#login-password")?.focus();

                return;

            }


            /* SESSION */

            localStorage.setItem(
                "ff_current_user",
                user.id
            );


            /* LOCATION */

            if(user.division){

                localStorage.setItem(
                    "ff_division",
                    user.division
                );

            }else{

                localStorage.setItem(
                    "ff_division",
                    "Dhaka"
                );

            }


            /* REMOVE OLD CITY DATA */

            localStorage.removeItem(
                "ff_city"
            );


            /* REMOVE CITY FROM OLD USER DATA */

            if(user.city){

                delete user.city;

                const userIndex=users.findIndex(
                    item=>item.id===user.id
                );

                if(userIndex!==-1){

                    users[userIndex]=user;

                    setData(
                        "ff_users",
                        users
                    );

                }

            }


            /* CART */

            if(!localStorage.getItem("ff_cart")){

                setData(
                    "ff_cart",
                    []
                );

            }


            const firstName=
                (user.name||"User")
                    .split(/\s+/)[0];


            showAuthMessage(
                "login-message",
                `Welcome back, ${firstName}!`,
                "success"
            );


            setAuthLoading(
                button,
                true,
                "Signing in..."
            );


            setTimeout(
                redirectHome,
                700
            );

        }
    );

}


/* =========================
   REGISTER
========================= */

function initRegister(){

    const form=$("#register-form");

    if(!form) return;

    form.addEventListener(
        "submit",
        event=>{

            event.preventDefault();


            const name=
                $("#register-name")
                    ?.value
                    .trim()||"";


            const mobile=
                cleanMobile(
                    $("#register-mobile")
                        ?.value||""
                );


            const password=
                $("#register-password")
                    ?.value||"";


            const confirmPassword=
                $("#register-confirm")
                    ?.value||"";


            const nid=
                $("#register-nid")
                    ?.value
                    .trim()||"";


            const dob=
                $("#register-dob")
                    ?.value||"";


            const address=
                $("#register-address")
                    ?.value
                    .trim()||"";


            const button=
                form.querySelector(
                    'button[type="submit"]'
                );


            showAuthMessage(
                "register-message",
                ""
            );


            /* NAME */

            if(name.length<2){

                showAuthMessage(
                    "register-message",
                    "Please enter your full name."
                );

                $("#register-name")?.focus();

                return;

            }


            /* MOBILE */

            if(!validBDMobile(mobile)){

                showAuthMessage(
                    "register-message",
                    "Enter a valid Bangladesh mobile number."
                );

                $("#register-mobile")?.focus();

                return;

            }


            /* PASSWORD */

            if(password.length<6){

                showAuthMessage(
                    "register-message",
                    "Password must be at least 6 characters."
                );

                $("#register-password")?.focus();

                return;

            }


            /* CONFIRM PASSWORD */

            if(password!==confirmPassword){

                showAuthMessage(
                    "register-message",
                    "Passwords do not match."
                );

                $("#register-confirm")?.focus();

                return;

            }


            /* ADDRESS */

            if(address.length<5){

                showAuthMessage(
                    "register-message",
                    "Please enter your delivery address."
                );

                $("#register-address")?.focus();

                return;

            }


            /* USERS */

            const users=getData(
                "ff_users",
                []
            );


            /* DUPLICATE MOBILE */

            const existingUser=users.find(
                user=>
                    cleanMobile(user.mobile)===mobile
            );


            if(existingUser){

                showAuthMessage(
                    "register-message",
                    "This mobile number is already registered."
                );

                $("#register-mobile")?.focus();

                return;

            }


            /* LOCATION */

            const division=
                getDivision()||"Dhaka";


            /* NEW USER */

            const user={

                id:"u"+Date.now(),

                name:name,

                mobile:mobile,

                password:password,

                nid:nid,

                dob:dob,

                address:address,

                division:division,

                photo:"",

                createdAt:
                    new Date().toISOString()

            };


            users.push(user);


            setData(
                "ff_users",
                users
            );


            /* SESSION */

            localStorage.setItem(
                "ff_current_user",
                user.id
            );


            /* LOCATION */

            localStorage.setItem(
                "ff_division",
                division
            );


            /* REMOVE OLD CITY */

            localStorage.removeItem(
                "ff_city"
            );


            /* EMPTY CART */

            setData(
                "ff_cart",
                []
            );


            /* EMPTY FAVORITES */

            if(!localStorage.getItem("ff_favorites")){

                setData(
                    "ff_favorites",
                    []
                );

            }


            const firstName=
                name.split(/\s+/)[0];


            showAuthMessage(
                "register-message",
                `Account created successfully. Welcome, ${firstName}!`,
                "success"
            );


            setAuthLoading(
                button,
                true,
                "Creating account..."
            );


            setTimeout(
                redirectHome,
                800
            );

        }
    );

}


/* =========================
   PASSWORD VISIBILITY
========================= */

function initPasswordToggle(){

    const toggle=$("#toggle-password");

    const input=$("#login-password");

    if(!toggle||!input) return;


    toggle.addEventListener(
        "click",
        ()=>{

            const visible=
                input.type==="text";


            input.type=
                visible
                    ?"password"
                    :"text";


            toggle.textContent=
                visible
                    ?"Show"
                    :"Hide";


            toggle.setAttribute(
                "aria-label",
                visible
                    ?"Show password"
                    :"Hide password"
            );

        }
    );

}


/* =========================
   MOBILE INPUT CLEANING
========================= */

function initMobileInputs(){

    const inputs=[
        $("#login-mobile"),
        $("#register-mobile")
    ];


    inputs.forEach(
        input=>{

            if(!input) return;


            input.addEventListener(
                "input",
                ()=>{

                    input.value=
                        input.value
                            .replace(/\D/g,"")
                            .slice(0,11);

                }
            );

        }
    );

}


/* =========================
   AUTH PAGE INIT
========================= */

document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        initLogin();
        initRegister();
        initPasswordToggle();
        initMobileInputs();

    }
);