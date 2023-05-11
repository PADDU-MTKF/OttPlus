// ************************** content page function ******************************
function content_page() {
  let temp;
  if (drag_count < 5) {
    temp = ID.split(",");
    console.log(temp);
    let localkey = temp[0];
    let content_id = temp[1];

    let local = JSON.parse(localStorage.getItem(localkey));
    console.log(local[content_id]);

    let Title_src = local[content_id]["Title"];
    let Overview_src = local[content_id]["Owerview"];
    let Certification_src = local[content_id]["Certification"];
    let Cover_src;
    if (local[content_id]["Cover"] == null) {
      Cover_src = cover_alt;
    } else {
      Cover_src = local[content_id]["Cover"];
    }
    let Content_Type_src = local[content_id]["Content_Type"];
    let Genres_src = local[content_id]["Genres"];
    let Poster_src = local[content_id]["Poster"];
    let Rating_src = local[content_id]["Rating"];
    let Release_Year_src = local[content_id]["Release_Year"];
    let Runtime_src = local[content_id]["Runtime"];
    let Total_Seasons_src = local[content_id]["Total_Seasons"];

    let watch_src = local[content_id]["Watch"];
    console.log(watch_src);

    const logo_div = document.createElement("div");
    logo_div.setAttribute("class", "logo_div");
    let streaming = document.createElement("h4");
    if (watch_src.length > 0) {
      streaming.textContent = "STREAMING ON: ";
      logo_div.appendChild(streaming);

      let provider_arr = [];

      let ul = document.createElement("ul");
      for (let i = 0; i < watch_src.length; i++) {
        // let inner_logo_div=document.createElement('div')

        let link = watch_src[i]["Link"];
        let logo = watch_src[i]["Provider_Logo"];
        let Provider = watch_src[i]["Provider"];
        console.log(provider_arr);
        // if(logo.length==0){
        //   let watch_empty=document.createElement('h3')
        // }
        // cheking if there is logo and link
        if (provider_arr.includes(Provider)) {
          continue;
        }
        provider_arr.push(Provider);
        let li = document.createElement("li");
        ul.appendChild(li);
        let a = document.createElement("a");
        a.setAttribute("href", link);
        li.appendChild(a);

        let img = document.createElement("img");
        img.setAttribute("class", "logo_img");
        img.setAttribute("src", logo);
        a.setAttribute("target", "_blank");
        a.appendChild(img);
        logo_div.appendChild(ul);

        // console.log(link)
        // console.log(logo)
      }
    } else {
      streaming.textContent = "No Streaming Sources....";
      logo_div.appendChild(streaming);
    }

    Genres_src = Genres_src[0] + " , " + Genres_src[1];

    let Season_time_src;
    if (Content_Type_src == "movie") {
      Season_time_src = Runtime_src;
    } else {
      Season_time_src = "Total Seasons: " + Total_Seasons_src.toString();
    }

    // Get a reference to the element you want to keep
    let oldElement = document.getElementById("Data");
    let oldContent = oldElement.innerHTML;

    // Create a new div element to hold the content for the new page
    let newPageContent = document.createElement("div");

    let Season_time = document.createElement("a");
    Season_time.textContent = Season_time_src;

    let Genres = document.createElement("a");
    Genres.textContent = Genres_src;

    // let Poster = document.createElement('img');
    // Poster.setAttribute('src', Poster_src);

    let Rating = document.createElement("a");
    Rating.textContent = Rating_src;

    let Release_Year = document.createElement("a");
    Release_Year.textContent = Release_Year_src;

    // Create a new heading element for the new page
    let Title = document.createElement("a");
    // font modification
    let title_caps = Title_src.toUpperCase();
    Title.textContent = title_caps;
    Title.setAttribute("class", "content_font");

    let Overview = document.createElement("p");
    console.log(Overview_src);
    Overview.textContent = Overview_src;

    let Certification = document.createElement("h5");
    Certification.textContent = Certification_src;

    let cover_div = document.createElement("div");
    cover_div.setAttribute("class", "content_poster");
    let Cover = document.createElement("img");
    Cover.setAttribute("src", Cover_src);
    cover_div.appendChild(Cover);

    // horizontal gradient div
    let gradient_div = document.createElement("div");
    gradient_div.setAttribute("class", "horizontal_cover_gradient");
    cover_div.appendChild(gradient_div);

    //top gradient div
    let top_gradient_div = document.createElement("div");
    top_gradient_div.setAttribute("class", "top_cover_gradient");
    cover_div.appendChild(top_gradient_div);

    // bottom gradient div
    let bottom_gradient = document.createElement("div");
    bottom_gradient.setAttribute("class", "bottom_cover_gradient");
    cover_div.appendChild(bottom_gradient);

    //content page text div
    let content_page_text = document.createElement("div");
    content_page_text.setAttribute("class", "content_page_text_div");
    newPageContent.appendChild(content_page_text);

    // text div inside title div
    let title_div = document.createElement("div");
    title_div.setAttribute("class", "title_div_text");
    content_page_text.appendChild(title_div);

    // text div inside certfication div
    let certfication_div = document.createElement("div");
    certfication_div.setAttribute("class", "certificaton_div_text");
    content_page_text.appendChild(certfication_div);

    //discription
    title_div.appendChild(Title);

    certfication_div.appendChild(Overview);
    // certification li items
    let ul_items = document.createElement("ul");
    certfication_div.appendChild(ul_items);
    let li_items;

    //creating li items and inserting
    let certification_arr_temp = [Season_time, Genres, Certification, Rating];
    let certification_arr = [];

    for (let i = 0; i < 4; i++) {
      if (certification_arr_temp[i].innerHTML) {
        certification_arr.push(certification_arr_temp[i]);
        // console.log(certification_arr[i].innerText);
      }
    }

    for (let i = 0; i < certification_arr.length; i++) {
      li_items = document.createElement("li");
      if (i == certification_arr.length - 1 && Rating_src != null) {
        let im = document.createElement("img");
        im.setAttribute("src", imdb_src);
        im.classList.add("imdb");
        li_items.appendChild(im);
      }

      li_items.appendChild(certification_arr[i]);
      ul_items.appendChild(li_items);
    }

    content_page_text.appendChild(logo_div);

    newPageContent.appendChild(cover_div);

    // Replace the innerHTML of the old element with the new page content
    // const nav_el = document.querySelectorAll('a[href^="index.html#"]');

    oldElement.innerHTML = "";
    oldElement.appendChild(newPageContent);
  }
}

// console.log("i am inside content");
content_page();
