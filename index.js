'use strict'
const BASE_URL = 'https://user-list.alphacamp.io';
const INDEX_URL = BASE_URL + '/api/v1/users/';

// 設計函式＋利用 for 迴圈 + 利用渲染
const dataPanel = document.querySelector('#data-panel')
const users = [];
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderUserList(data) {
  let rawHTML = '';
  data.forEach((item) => {
    // 替換掉 name, surname, birthday, image
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card border-info text-center mb-3" style="width: 18rem;">
            <img src="${item.avatar}" class="card-img-top" alt="user image">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <ul class="list-group list-group-flush card-info">
              <li class="list-group-item card-info-surname">${item.surname}</li>
              <li class="list-group-item card-info-email">${item.email}</li>
            </ul>
            <button type="button" 
                class="btn btn-outline-info btn-show-info"
                data-bs-toggle="modal"
                data-bs-target="#info-modal"
                data-id="${item.id}"
                >More information
            </button>
          </div>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML;
}

// 寫 modal 函式
function showInfoModal(id) {
  const modalName = document.querySelector('#info-modal-name');
  const modalImage = document.querySelector('#info-modal-image');
  const modalBirth = document.querySelector('#info-modal-birthday');
  const modalGender = document.querySelector('#info-modal-gender');
  const modalAge = document.querySelector('#info-modal-age');
  const modalRegion = document.querySelector('#info-modal-region');

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data;
    modalName.innerText = data.name;
    modalBirth.innerText = data.birthday;
    modalGender.innerText = data.gender;
    modalAge.innerText = data.age;
    modalRegion.innerText = data.region;
    modalImage.innerHTML = `<img src="${data.avatar}" alt="user-image" class="img-fluid">`
  })
}

// 綁定搜索事件
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault();
  // 取值
  const keyword = searchInput.value.trim().toLowerCase();
  console.log('click')
  // 成立放名字的空陣列
  let filteredUsers = [];
  // 以 filter 來比對字串
  filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(keyword)
  )

  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的用戶`)
  }

  renderUserList(filteredUsers)
})

// 把事件綁定在 dataPanel 上
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-info')) {
    showInfoModal(Number(event.target.dataset.id))
  }
})



// 把數據取出來
axios.get(INDEX_URL).then((response) => {
  users.push(...response.data.results)
  renderUserList(users)
}).catch(function (error) {
  console.log(error);
});