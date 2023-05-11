// ********************** constents ***********************

const base_api = "https://find-all-at.ott-plus.repl.co/";
let home_top = [];
// ********************** functions ***********************

function live_click(e) {
  if (drag_count < 5) {
    let temp = e.srcElement.id.split("__");
    let localkey = temp[0];
    let content_id = temp[1].toString();

    let local = JSON.parse(localStorage.getItem(localkey));

    let watch_src = local[content_id]["Watch"][0]["Link"];
    console.log(watch_src);
    // history.pushState(null, null, watch_src);
    window.open(watch_src);

    // homeLink.removeEventListener("click", smoothScroll);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function live_icon_click() {
  let body = document.getElementById("Data");

  let form = document.createElement("form");
  form.method = "GET";
  form.action = "/livetv";

  body.appendChild(form);
  form.submit();
}

function go_to_content(e) {
  if (drag_count < 5) {
    if (e.srcElement.id != "poster_home_inv") {
      temp = e.srcElement.id.split("__");
    } else {
      temp = e.srcElement.classList["add"].split("__");
    }

    let ID = temp;

    const send_data = { ID: ID, drag_count: drag_count };

    let body = document.getElementById("Data");

    let form = document.createElement("form");
    form.method = "GET";
    form.action = "/content";
    let inp = document.createElement("input");
    let inp2 = document.createElement("input");

    inp.type = "hidden";
    inp.name = "ID";
    inp.value = ID;
    inp2.type = "hidden";
    inp2.name = "drag_count";
    inp2.value = drag_count;

    form.appendChild(inp);
    form.appendChild(inp2);

    body.appendChild(form);

    form.submit();
  }
}

function get_gen_search_page(what, which) {
  let body = document.getElementById("Data");

  let form = document.createElement("form");
  form.method = "GET";
  if (which == "gen") {
    form.action = "/genres";
  } else {
    form.action = "/search";
  }
  let inp = document.createElement("input");
  let inp2 = document.createElement("input");

  inp.type = "hidden";
  inp.name = "what";
  inp.value = what;
  inp2.type = "hidden";
  inp2.name = "which";
  inp2.value = which;

  form.appendChild(inp);
  form.appendChild(inp2);

  body.appendChild(form);

  form.submit();
}

function gen_btn_click(e) {
  let temp = e.srcElement.id.split("__");
  let content_id = temp[1].toString();
  console.log(content_id);
  get_gen_search_page(content_id, "gen");
}

async function add_genres() {
  let what = "get_genres_info";
  const movi = base_api + what;

  let data;
  if (sessionStorage.getItem("loadedBefore")) {
    data = await JSON.parse(localStorage.getItem(what));
    console.log("session");
  } else {
    const response = await fetch(movi);
    data = await response.json();
    console.log("api");
  }

  try {
    localStorage.removeItem(what);
  } catch {
    console.log("error handeled");
  }

  localStorage.setItem(what, JSON.stringify(data));

  let genres = document.getElementById(what);

  for (let id in data) {
    let ID = what + "__" + data[id]["Short_Name"];
    let text = data[id]["Translation"];

    let gen_btn = document.createElement("button");
    gen_btn.textContent = text;
    gen_btn.setAttribute("id", ID);
    gen_btn.classList.add("genre_item");

    gen_btn.addEventListener("click", gen_btn_click);
    genres.appendChild(gen_btn);
  }
}

async function fetched_api(what) {
  const movi = "api/" + what;

  let data;
  if (sessionStorage.getItem("loadedBefore")) {
    data = await JSON.parse(localStorage.getItem(what));
    console.log("session");
  } else {
    const response = await fetch(movi);
    data = await response.json();
    console.log("api");
  }

  try {
    localStorage.removeItem(what);
  } catch {
    console.log("error handeled");
  }

  localStorage.setItem(what, JSON.stringify(data));

  if (what == "get_livetv") {
    return;
  }

  let trending = document.getElementById(what);
  // ************** for loop ***************

  let myArray = [];
  for (let id in data) {
    myArray.push(id);
  }
  let shuffleddata = shuffleArray(myArray);

  // console.log(shuffleddata);

  for (let i = 0; i < shuffleddata.length; i++) {
    let id = shuffleddata[i];
    let div;
    let img;

    let div_id = "div__" + what + "__" + id.toString();

    // *************************** creating div ****************************
    div = document.createElement("div");
    div.setAttribute("id", div_id);
    div.setAttribute("class", "image-div");

    trending.appendChild(div);

    //**************************** targetting inner div id ***************
    let idiv = document.getElementById(div_id);
    //************************** creating images dynamically************************ */
    img = document.createElement("img");
    let ID = what + "__" + id.toString();

    img.setAttribute("id", ID);
    img.setAttribute("class", "tls");
    if (what == "popular_livetv") {
      img.classList.add("live");
    }

    if (data[id].Poster != null) {
      img.setAttribute("src", data[id].Poster);
    } else {
      img.setAttribute("src", poster_alt_src);
    }

    idiv.appendChild(img);

    // title = document.createElement("h1");
    // title.setAttribute("class", "title");
    // title.innerText = title_fetch;
    // idiv.appendChild(title);

    // displaying in next page
    if (what != "popular_livetv") {
      document.getElementById(ID).addEventListener("click", go_to_content);
    } else {
      document.getElementById(ID).addEventListener("click", live_click);
    }

    // *************************** this we will use after ********************
    // ihtml += `
    // <img class="bg"src="${url}" alt="error">
    // `
    // bg.innerHTML = ihtml;
    // let url = data[item].Cover
    // let poster = data[item].Poster
    // ["Cover"]
    // Poster+=`
    // <img class="poster-image1"src="${poster}" alt="error">`
    //     pg.innerHTML=Poster;
  }

  if (what != "popular_livetv" && what != "popular_mix") {
    shuffleddata = shuffleArray(shuffleddata);
    for (let i = 0; i < 3; i++) {
      home_top.push(what + "__" + shuffleddata[i].toString());
    }
  }
}

const nav_el = document.querySelectorAll('a[href^="home#"]');
const scrool_to = (event) => {
  event.preventDefault();
  const targetId = event.currentTarget.getAttribute("href").split("home")[1];
  console.log(targetId);
  const targetElement = document.querySelector(targetId);
  let topOffset;
  if (targetId == "#top") {
    topOffset = 0;
  } else {
    topOffset = targetElement.offsetTop - 50;
  }

  console.log(topOffset);
  window.scrollTo({
    top: topOffset,
    behavior: "smooth"
  });
};

// ********************** calling functions ***************

window.onload = function () {
  let what;
  what = "popular_mix";
  fetched_api(what);

  what = "popular_movies";
  fetched_api(what);

  what = "popular_show";
  fetched_api(what);

  what = "popular_livetv";
  fetched_api(what);

  what = "get_livetv";
  fetched_api(what);

  add_genres();

  document
    .getElementById("live_logo")
    .addEventListener("click", live_icon_click);

  home_top = shuffleArray(home_top);

  const back_cover_home = document.getElementById("back_cover_home");
  const poster_home = document.getElementById("poster_home");
  const poster_title_home = document.getElementById("poster_title_home");
  const poster_click = document.getElementById("poster_home_inv");

  // console.log(home_top);
  // let temp = home_top[0].split("__");
  // let localkey = temp[0];
  // let content_id = temp[1].toString();

  // let local = JSON.parse(localStorage.getItem(localkey));
  // let Poster_src = local[content_id]["Poster"];
  // let Cover_src = local[content_id]["Cover"];
  // let Title_src = local[content_id]["Title"];

  // back_cover_home.setAttribute("src", Cover_src);
  // poster_home.setAttribute("src", Poster_src);
  // poster_click.classList.add = home_top[0];
  // poster_title_home.textContent = Title_src;

  back_cover_home.classList.add("loaded");
  poster_home.classList.add("loaded");
  poster_title_home.classList.add("loaded");
  // poster animation ******************************************************************
  let tim_int = 5;
  let count = 0;

  setTimeout(() => {
    back_cover_home.classList.remove("loaded");
    poster_home.classList.remove("loaded");
    poster_title_home.classList.remove("loaded");
  }, (tim_int - 1) * 1000);

  document
    .getElementById("poster_home_inv")
    .addEventListener("click", go_to_content);

  setInterval(() => {
    poster_click.classList.remove = home_top[count];
    count++;

    setTimeout(() => {
      back_cover_home.classList.remove("loaded");
      poster_home.classList.remove("loaded");
      poster_title_home.classList.remove("loaded");
    }, (tim_int - 1) * 1000);
    if (count == 6) {
      count = 0;
    }
    let temp = home_top[count].split("__");
    let localkey = temp[0];
    let content_id = temp[1].toString();

    let local = JSON.parse(localStorage.getItem(localkey));
    let Poster_src = local[content_id]["Poster"];
    let Cover_src = local[content_id]["Cover"];
    let Title_src = local[content_id]["Title"];

    if (Cover_src != null) {
      back_cover_home.setAttribute("src", Cover_src);
    } else {
      back_cover_home.setAttribute("src", back_alt_src);
    }
    poster_home.setAttribute("src", Poster_src);
    poster_click.classList.add = home_top[count];
    poster_title_home.textContent = Title_src;
    back_cover_home.classList.add("loaded");
    poster_home.classList.add("loaded");
    poster_title_home.classList.add("loaded");
  }, tim_int * 1000);

  sessionStorage.setItem("loadedBefore", true);

  nav_el.forEach((link) => {
    link.addEventListener("click", scrool_to);
  });

  // Check if the current page is the home page
  // if (currentUrl.indexOf("index.html") !== -1) {
  //   // Code to run if the current page is the home page

  // }
};
// change navebar to black when scrooled down and back transp when up

// scroll event*****************

const cursorl = document.querySelectorAll(".cursorl");
const home_dict = {
  popular_mix: 0,
  popular_livetv: 1,
  popular_movies: 2,
  popular_show: 3
};

let drag_count = 0;
let isDragStart = false,
  prevPagex,
  prevScrollLeft;
const dragStart = (e) => {
  drag_count = 1;
  let temp = e.srcElement.id.split("__");
  const index = temp.indexOf("div");
  if (index > -1) {
    // only splice array when item is found
    temp.splice(index, 1); // 2nd parameter means remove one item only
  }

  // console.log(temp[0]);
  isDragStart = true;
  prevPagex = e.pageX;
  prevScrollLeft = cursorl[home_dict[temp[0]]].scrollLeft;
};
const dragging = (e) => {
  // console.log(e.srcElement.id)
  let temp = e.srcElement.id.split("__");
  const index = temp.indexOf("div");
  if (index > -1) {
    // only splice array when item is found
    temp.splice(index, 1); // 2nd parameter means remove one item only
  }

  // console.log(temp[0]);
  if (!isDragStart) return;
  drag_count += 1;
  e.preventDefault();
  let positionDiff = e.pageX - prevPagex;
  cursorl[home_dict[temp[0]]].scrollLeft = prevScrollLeft - positionDiff;
};

function dragStop() {
  isDragStart = false;
}

for (let i = 0; i < cursorl.length; i++) {
  cursorl[i].addEventListener("mousedown", dragStart);
  cursorl[i].addEventListener("mousemove", dragging);
  cursorl[i].addEventListener("mouseup", dragStop);

  cursorl[i].addEventListener("wheel", (e) => {
    if (e.deltaX) {
      e.preventDefault();
      cursorl[i].scrollLeft += e.deltaX;
    }
  });
}

let search = document.getElementById("search");

search.addEventListener("click", () => {
  const input = document.getElementById("input").value; // the contents written on text box are stored in this variable

  if (input.length != 0) {
    get_gen_search_page(input, "search");
  }
});

function search_click() {
  let sel = document.getElementById("input");
  sel.select();
}

let input = document.getElementById("input");
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("search").click();
  }
});

// ***************** info on hover ****************

// let img_div=document.getElementsByClassName('image-div')[0].addEventListener("mouseover",)

// let a = document.querySelectorAll(".hover")
// a.forEach(element => {

//     element.addEventListener("mouseover", (hover => {

//         //console.log(hover)

//         document.querySelector(".la").style.color = "white"
//     }));
// });
