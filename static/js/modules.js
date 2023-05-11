function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

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
