/* =========================================================
   PROFILE HELPERS
========================================================= */

function getProfileInitials(name="User"){
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(word=>word[0])
    .join("")
    .slice(0,2)
    .toUpperCase()||"U";
}


/* =========================================================
   GET CURRENT USER DATA
========================================================= */

function getProfileUser(){
  const user=currentUser();

  if(!user){
    return null;
  }

  const users=getData("ff_users",[]);
  const savedUser=users.find(item=>item.id===user.id);

  return savedUser||user;
}


/* =========================================================
   PROFILE PHOTO
========================================================= */

function renderProfilePhoto(user){

  const photoBox=$("#profile-photo");
  const removeButton=$("#remove-photo-btn");

  if(!photoBox){
    return;
  }

  const initials=getProfileInitials(user?.name||"User");

  photoBox.classList.remove("has-photo");

  if(user?.photo){

    photoBox.innerHTML=`
      <img
        src="${user.photo}"
        alt="${escapeHTML(user.name||"User")} profile photo"
        class="profile-uploaded-photo"
        onerror="this.remove();this.parentElement.classList.remove('has-photo');this.parentElement.innerHTML='<span class=&quot;profile-initials&quot;>${initials}</span>';"
      >
    `;

    photoBox.classList.add("has-photo");

    if(removeButton){
      removeButton.style.display="inline-flex";
    }

  }else{

    photoBox.innerHTML=`
      <span class="profile-initials">
        ${initials}
      </span>
    `;

    if(removeButton){
      removeButton.style.display="none";
    }
  }
}


/* =========================================================
   PROFILE CARD PHOTO
========================================================= */

function getProfilePhotoHTML(user){

  const initials=getProfileInitials(
    user?.name||"User"
  );

  if(user?.photo){

    return `
      <div class="profile-card-photo">
        <img
          src="${user.photo}"
          alt="${escapeHTML(user.name||"User")} profile photo"
          onerror="
            this.style.display='none';
            this.parentElement.innerHTML='<span class=&quot;profile-card-avatar&quot;>${initials}</span>';
          "
        >
      </div>
    `;

  }

  return `
    <div class="profile-card-photo">
      <span class="profile-card-avatar">
        ${initials}
      </span>
    </div>
  `;
}


/* =========================================================
   RENDER PROFILE
========================================================= */

function renderProfile(){

  const user=getProfileUser();

  if(!user){

    location.href="login.html";

    return;
  }


  /* PROFILE SUMMARY */

  const profileCard=$("#profile-card");

  if(profileCard){

    const division=
      user.division||
      getDivision()||
      "Not selected";

    const orders=getOrders();
    const favorites=getFavorites();

    profileCard.innerHTML=`

      ${getProfilePhotoHTML(user)}

      <div class="profile-card-info">

        <h2>
          ${escapeHTML(user.name||"User")}
        </h2>

        <p class="profile-mobile">
          ${escapeHTML(user.mobile||"")}
        </p>

        <div class="profile-meta">

          <span>
            📦 ${orders.length} Orders
          </span>

          <span>
            ❤️ ${favorites.length} Favorites
          </span>

          <span>
            📍 ${escapeHTML(division)} Division
          </span>

        </div>

        <p class="profile-description">
          Your FoodFleet profile is stored locally in this browser.
        </p>

      </div>

    `;
  }


  /* FORM */

  const name=$("#profile-name");
  const mobile=$("#profile-mobile");
  const address=$("#profile-address");
  const division=$("#profile-division");


  if(name){
    name.value=user.name||"";
  }


  if(mobile){
    mobile.value=user.mobile||"";
  }


  if(address){
    address.value=user.address||"";
  }


  /* DIVISION */

  if(division){

    division.innerHTML=`

      <option value="">
        Select division
      </option>

      ${Object.keys(DIVISIONS)
        .map(item=>`

          <option value="${escapeHTML(item)}">
            ${escapeHTML(item)} Division
          </option>

        `)
        .join("")}

    `;

    division.value=
      user.division||
      getDivision()||
      "";
  }


  /* PHOTO */

  renderProfilePhoto(user);
}


/* =========================================================
   SAVE PROFILE PHOTO
========================================================= */

function saveProfilePhoto(file){

  const user=getProfileUser();

  if(!user||!file){
    return;
  }


  /* IMAGE TYPE */

  const allowedTypes=[
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if(!allowedTypes.includes(file.type)){

    toast(
      "Please select a JPG, PNG or WebP image.",
      "error"
    );

    return;
  }


  /* IMAGE SIZE */

  if(file.size>2*1024*1024){

    toast(
      "Profile photo must be smaller than 2MB.",
      "error"
    );

    return;
  }


  const reader=new FileReader();


  reader.onload=event=>{

    const imageData=event.target.result;

    if(!imageData){
      toast(
        "Could not load the selected image.",
        "error"
      );
      return;
    }


    const users=getData(
      "ff_users",
      []
    );


    const index=users.findIndex(
      item=>item.id===user.id
    );


    if(index===-1){

      toast(
        "User profile not found.",
        "error"
      );

      return;
    }


    /* SAVE PHOTO */

    users[index].photo=imageData;


    try{

      setData(
        "ff_users",
        users
      );

      localStorage.setItem(
        "ff_current_user",
        users[index].id
      );

    }catch(error){

      console.error(error);

      toast(
        "Image is too large for browser storage.",
        "error"
      );

      return;
    }


    /* FORCE IMMEDIATE UI UPDATE */

    renderProfile();
    updateHeader();


    toast(
      "Profile photo updated ✓"
    );

  };


  reader.onerror=()=>{

    toast(
      "Could not read the selected image.",
      "error"
    );

  };


  reader.readAsDataURL(file);
}


/* =========================================================
   REMOVE PROFILE PHOTO
========================================================= */

function removeProfilePhoto(){

  const user=getProfileUser();

  if(!user){
    return;
  }


  if(!user.photo){

    toast(
      "No profile photo to remove.",
      "error"
    );

    return;
  }


  if(!confirm(
    "Remove your profile photo?"
  )){
    return;
  }


  const users=getData(
    "ff_users",
    []
  );


  const index=users.findIndex(
    item=>item.id===user.id
  );


  if(index===-1){

    toast(
      "User profile not found.",
      "error"
    );

    return;
  }


  users[index].photo="";


  setData(
    "ff_users",
    users
  );


  localStorage.setItem(
    "ff_current_user",
    users[index].id
  );


  renderProfile();
  updateHeader();


  toast(
    "Profile photo removed ✓"
  );
}


/* =========================================================
   SAVE PROFILE
========================================================= */

function saveProfile(){

  const user=getProfileUser();

  if(!user){

    location.href="login.html";

    return;
  }


  const name=
    $("#profile-name")
      ?.value
      .trim()||"";


  const mobile=
    $("#profile-mobile")
      ?.value
      .trim()||"";


  const address=
    $("#profile-address")
      ?.value
      .trim()||"";


  const division=
    $("#profile-division")
      ?.value||"";


  /* NAME */

  if(name.length<2){

    toast(
      "Enter your full name.",
      "error"
    );

    $("#profile-name")?.focus();

    return;
  }


  /* MOBILE */

  if(
    typeof validBDMobile==="function"&&
    !validBDMobile(mobile)
  ){

    toast(
      "Enter a valid Bangladesh mobile number.",
      "error"
    );

    $("#profile-mobile")?.focus();

    return;
  }


  /* DIVISION */

  if(!division){

    toast(
      "Select your division.",
      "error"
    );

    $("#profile-division")?.focus();

    return;
  }


  const users=getData(
    "ff_users",
    []
  );


  const index=users.findIndex(
    item=>item.id===user.id
  );


  if(index===-1){

    toast(
      "User profile not found.",
      "error"
    );

    return;
  }


  /* DUPLICATE MOBILE */

  const mobileUsed=users.some(
    item=>
      item.id!==user.id&&
      item.mobile===mobile
  );


  if(mobileUsed){

    toast(
      "This mobile number is already registered.",
      "error"
    );

    $("#profile-mobile")?.focus();

    return;
  }


  /* UPDATE */

  users[index].name=name;
  users[index].mobile=mobile;
  users[index].address=address;
  users[index].division=division;


  /* REMOVE OLD CITY DATA */

  delete users[index].city;


  setData(
    "ff_users",
    users
  );


  localStorage.setItem(
    "ff_current_user",
    users[index].id
  );


  localStorage.setItem(
    "ff_division",
    division
  );


  localStorage.removeItem(
    "ff_city"
  );


  renderProfile();
  updateHeader();


  toast(
    "Profile updated ✓"
  );
}


/* =========================================================
   LOGOUT
========================================================= */

function logoutUser(){

  if(!confirm(
    "Do you want to log out of FoodFleet?"
  )){
    return;
  }


  localStorage.removeItem(
    "ff_current_user"
  );


  toast(
    "Logged out successfully"
  );


  setTimeout(
    ()=>{
      location.href="../index.html";
    },
    500
  );
}


/* =========================================================
   CLEAR LOCAL DATA
========================================================= */

function clearFoodFleetData(){

  if(!confirm(
    "This will delete all FoodFleet demo data from this browser. Continue?"
  )){
    return;
  }


  [
    "ff_users",
    "ff_current_user",
    "ff_cart",
    "ff_orders",
    "ff_city",
    "ff_division",
    "ff_favorites",
    "ff_promo"
  ].forEach(
    key=>{
      localStorage.removeItem(key);
    }
  );


  toast(
    "Local data cleared"
  );


  setTimeout(
    ()=>{
      location.href="../index.html";
    },
    700
  );
}


/* =========================================================
   PAGE INIT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  ()=>{

    renderProfile();


    /* PHOTO UPLOAD */

    const photoInput=$("#profile-photo-input");

    if(photoInput){

      photoInput.addEventListener(
        "change",
        event=>{

          const file=
            event.target.files?.[0];

          if(!file){
            return;
          }


          saveProfilePhoto(file);


          /* allow selecting same file again */

          event.target.value="";
        }
      );

    }


    /* REMOVE PHOTO */

    const removeButton=$("#remove-photo-btn");

    if(removeButton){

      removeButton.addEventListener(
        "click",
        removeProfilePhoto
      );

    }


    /* SAVE PROFILE */

    const profileForm=$("#profile-form");

    if(profileForm){

      profileForm.addEventListener(
        "submit",
        event=>{

          event.preventDefault();

          saveProfile();

        }
      );

    }


    /* LOGOUT */

    const logoutButton=$("#logout-btn");

    if(logoutButton){

      logoutButton.addEventListener(
        "click",
        logoutUser
      );

    }


    /* CLEAR DATA */

    const clearButton=$("#clear-data-btn");

    if(clearButton){

      clearButton.addEventListener(
        "click",
        clearFoodFleetData
      );

    }

  }
);