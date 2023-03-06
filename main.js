let news = [];
let url;
let page = 1;
let total_pages = 0;

let menuButton = document.querySelectorAll(".menu-area button");
let searchButton = document.getElementById("search-button");

menuButton.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

const getNews = async () => {
  // 에러 핸들링
  try {
    url.searchParams.set("page", page);
    console.log(url);
    let header = new Headers({
      "x-api-key": "U_TO32x98uZoPlruPOmKCW91hYZT2Tsa4od7oZoWq9E",
    }); // api-key
    let response = await fetch(url, { headers: header }); // 서버에 데이터를 요청
    let data = await response.json(); // json 형식으로 데이터 변환

    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("No result values were found.");
      }

      news = data.articles;
      page = data.page;
      total_pages = data.total_pages;

      render();
      pagination();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
    console.log("잡힌 에러는 ", error.message);
  }
};

// 최신 뉴스를 불러오는 함수
const getLatestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=business&page_size=10`
  ); // url
  getNews();
};

// 카테고리 전환에 따른 뉴스 리턴
const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=${topic}&page_size=10`
  );
  getNews();
};

// 키워드에 따른 뉴스 리턴
const getNewsByKeyword = async () => {
  let keyword = document.getElementById("search-area").value; // 키워드 가져오기
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&from=2021/12/15&countries=US&page_size=10`
  );
  getNews();
};

// 뉴스를 화면에 그리기
const render = () => {
  let newsHTML = "";

  newsHTML = news
    .map((item) => {
      return `<div class="row article-area">
        <div class="col-lg-4">
            <img class="image-area" src="${item.media}" />
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>${item.summary}</p>
            <div>${item.rights} * ${item.published_date}</div>
        </div>
    </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

// 에러 화면에 보여주기
const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-warning text-center" role="alert">
  ${message}
</div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
};

// 페이지네이션
const pagination = () => {
  let paginationHTML = `<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous">
    <span aria-hidden="true">&lt;</span>
  </a>
</li>`;
  let pageGroup = Math.ceil(page / 5); // 현재 페이지가 속한 그룹
  let firstPage = pageGroup * 5 - 4; // 그룹의 첫 번째 페이지
  let lastPage = pageGroup * 5; // 그룹의 마지막 페이지

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      page == i ? "active" : ""
    }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  }

  paginationHTML += `<li class="page-item">
  <a class="page-link" href="#" aria-label="Next">
    <span aria-hidden="true">&gt;</span>
  </a>
</li>`;

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

// 페이지를 이동 이벤트
const moveToPage = (pageNum) => {
  page = pageNum; // 기존 페이지를 클릭한 페이지로 변경

  getNews();
};

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();
