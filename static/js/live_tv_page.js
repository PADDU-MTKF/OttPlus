const base_api = "api/";

function live_click(e) {
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

async function live_icon_click() {
  let what = "get_livetv";
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
  let myArray = [];

  for (let i in data) {
    if (i != "LiveTvSource") {
      myArray.push(i);
    }
  }
  let shuffleddata = shuffleArray(myArray);

  // Get a reference to the element you want to keep
  let oldElement = document.getElementById("Data");
  let oldContent = oldElement.innerHTML;

  let grid_top = document.createElement("div");
  let grid_left = document.createElement("div");
  let grid_right = document.createElement("div");
  let grid_bottom = document.createElement("div");
  grid_top.classList.add("one_ui_cover_grad_top");
  grid_left.classList.add("one_ui_cover_grad_left");
  grid_right.classList.add("one_ui_cover_grad_right");
  grid_bottom.classList.add("one_ui_cover_grad_bottom");

  let banner = document.createElement("div");
  banner.classList.add("banner");
  let banner_img = document.createElement("img");
  banner_img.setAttribute("src", livetv_banner);
  banner_img.classList.add("animate");
  banner.appendChild(banner_img);

  let mega_div = document.createElement("div");
  mega_div.classList.add("live_page");
  mega_div.classList.add("animate");
  // console.log(data);

  let source = data["LiveTvSource"];
  for (let id in source) {
    let div_id = "div__" + what + "__" + id.toString();

    let div = document.createElement("div");
    div.setAttribute("id", div_id);
    div.setAttribute("class", "image-div");

    // let idiv = document.getElementById(div_id);
    //************************** creating images dynamically************************ */
    let img = document.createElement("img");
    let ID = what + "__" + id.toString();

    img.setAttribute("id", ID);
    img.addEventListener("click", () => {
      let watch_src = source[id]["Watch"][0]["Link"];
      // history.pushState(null, null, watch_src);
      window.open(watch_src);
    });

    img.setAttribute("class", "tls");

    img.classList.add("live");

    if (source[id]["Watch"][0]["Provider_Logo"] != null) {
      img.setAttribute("src", source[id]["Watch"][0]["Provider_Logo"]);
    } else {
      img.setAttribute("src", post_alt);
    }

    // console.log(data[id].Poster);
    div.appendChild(img);
    mega_div.appendChild(div);
  }
  for (let i = 0; i < shuffleddata.length; i++) {
    let id = shuffleddata[i];
    let div_id = "div__" + what + "__" + id.toString();

    let div = document.createElement("div");
    div.setAttribute("id", div_id);
    div.setAttribute("class", "image-div");

    // let idiv = document.getElementById(div_id);
    //************************** creating images dynamically************************ */
    let img = document.createElement("img");
    let ID = what + "__" + id.toString();

    img.setAttribute("id", ID);
    img.addEventListener("click", live_click);
    img.setAttribute("class", "tls");

    img.classList.add("live");

    if (data[id].Poster != null) {
      img.setAttribute("src", data[id].Poster);
    } else {
      img.setAttribute("src", post_alt);
    }

    // console.log(data[id].Poster);
    div.appendChild(img);
    mega_div.appendChild(div);
  }

  oldElement.innerHTML = "";
  oldElement.appendChild(grid_top);
  oldElement.appendChild(grid_left);
  oldElement.appendChild(grid_right);
  oldElement.appendChild(grid_bottom);
  oldElement.appendChild(banner);
  oldElement.appendChild(mega_div);
  setTimeout(() => {
    banner_img.classList.add("animate_loaded");
    mega_div.classList.add("animate_loaded");
  }, 100);

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
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

live_icon_click();
