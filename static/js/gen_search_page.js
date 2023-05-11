const base_api = "https://find-all-at.ott-plus.repl.co/";

function go_to_content(e) {
  if (e.srcElement.id != "poster_home_inv") {
    temp = e.srcElement.id.split("__");
  } else {
    temp = e.srcElement.classList["add"].split("__");
  }

  let ID = temp;

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
  inp2.value = 2;

  form.appendChild(inp);
  form.appendChild(inp2);

  body.appendChild(form);

  form.submit();
}

async function fetch_gen_search(what, which) {
  let movi;
  if (which == "gen") {
    movi = base_api + "genres/" + what;
  } else {
    movi = base_api + "search/" + what;
  }
  let oldElement = document.getElementById("Data");
  let oldContent = oldElement.innerHTML;

  let newPageContent = document.createElement("div");
  let img = document.createElement("img");
  img.setAttribute("src", loading_gif);
  img.classList.add("loading");
  newPageContent.appendChild(img);

  oldElement.innerHTML = "";
  oldElement.appendChild(newPageContent);

  let data;
  let shuffleddata;
  // console.log(data);
  if (which == "gen") {
    if (sessionStorage.getItem(what)) {
      data = await JSON.parse(localStorage.getItem(what));
      console.log("session");
    } else {
      const response = await fetch(movi);
      data = await response.json();
      console.log("api");
    }
    sessionStorage.setItem(what, true);

    try {
      localStorage.removeItem(what);
    } catch {
      console.log("error handeled");
    }

    localStorage.setItem(what, JSON.stringify(data));
    let myArray = [];
    for (let id in data) {
      myArray.push(id);
    }
    shuffleddata = shuffleArray(myArray);
    // console.log(data);
  } else {
    const response = await fetch(movi);
    data = await response.json();
    console.log("api");
    let myArray = [];
    for (let id in data) {
      myArray.push(id);
    }
    try {
      localStorage.removeItem(which);
    } catch {
      console.log("error handeled");
    }

    localStorage.setItem(which, JSON.stringify(data));
    shuffleddata = myArray;
  }

  oldElement.innerHTML = "";
  let banner_img;

  if (JSON.stringify(data).length <= 2) {
    let newPageContent = document.createElement("div");
    let img = document.createElement("img");
    img.setAttribute("src", page_not_found_loc);
    img.classList.add("not_found");
    newPageContent.appendChild(img);

    oldElement.appendChild(newPageContent);
    return;
  }

  if (which == "gen") {
    let grid_top = document.createElement("div");
    let grid_left = document.createElement("div");
    let grid_right = document.createElement("div");
    let grid_bottom = document.createElement("div");
    grid_top.classList.add("one_ui_gen_grad_top");
    grid_left.classList.add("one_ui_gen_grad_left");
    grid_right.classList.add("one_ui_gen_grad_right");
    grid_bottom.classList.add("one_ui_gen_grad_bottom");

    let banner = document.createElement("div");
    banner.classList.add("banner_gen");
    banner_img = document.createElement("img");
    banner_img.setAttribute("src", gen_ban_base + what + ".png");
    banner_img.classList.add("animate");
    banner.appendChild(banner_img);

    oldElement.appendChild(grid_top);
    oldElement.appendChild(grid_left);
    oldElement.appendChild(grid_right);
    oldElement.appendChild(grid_bottom);
    oldElement.appendChild(banner);
  }
  // oldElement.appendChild(mega_div);

  let genres_div = document.createElement("div");
  genres_div.classList.add("genres_div_flex");
  genres_div.classList.add("animate");
  oldElement.appendChild(genres_div);
  for (let i = 0; i < shuffleddata.length; i++) {
    let id = shuffleddata[i];
    let div;
    let img;
    let div_id;
    if (which == "gen") {
      div_id = "div__" + what + "__" + id.toString();
    } else {
      div_id = "div__" + which + "__" + id.toString();
    }

    // *************************** creating div ****************************
    div = document.createElement("div");
    div.setAttribute("id", div_id);
    // div.setAttribute("class", "image-div");

    genres_div.appendChild(div);

    //**************************** targetting inner div id ***************
    let idiv = document.getElementById(div_id);
    //************************** creating images dynamically************************ */
    img = document.createElement("img");
    let ID;
    if (which == "gen") {
      ID = what + "__" + id.toString();
    } else {
      ID = which + "__" + id.toString();
    }

    img.setAttribute("id", ID);
    img.setAttribute("class", "gen_tls");
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

    document.getElementById(ID).addEventListener("click", go_to_content);
  }
  setTimeout(() => {
    genres_div.classList.add("animate_loaded");
    if (which == "gen") {
      banner_img.classList.add("animate_loaded");
    }
  }, 100);

  if (which == "gen") {
    window.scrollTo({
      top: 1000,
      behavior: "smooth"
    });
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 1000);
  } else {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}



fetch_gen_search(what, which);
