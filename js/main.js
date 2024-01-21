
function saveMemo() {
  // 입력값 가져오기
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  let siteUrl = document.getElementById('siteUrl').value;

  // 기존 메모 목록 가져오기
  const memoList = getMemoList();

  // 맨 끝에 있는 '/' 제거
  siteUrl = siteUrl.replace(/\/$/, '');

  // 새로운 메모 추가
  const memo = {
    t: title,
    c: content,
    u: siteUrl.replace('https://', '') // https:// 제거
  };
  memoList.push(memo);

  // URL 업데이트
  const params = new URLSearchParams();
  memoList.forEach((memo, index) => {
    params.set(`t${index + 1}`, memo.t);
    params.set(`c${index + 1}`, memo.c);
    params.set(`u${index + 1}`, memo.u);
  });
  window.history.pushState({}, null, `?${params.toString()}`);

  // 메모 목록 업데이트
  updateMemoList();
}

function getMemoList() {
  const urlParams = new URLSearchParams(window.location.search);
  let memoList = [];
  let index = 1;

  // t1, c1, u1부터 순서대로 존재하는 동안 메모를 가져와 목록에 추가
  while (urlParams.has(`t${index}`)) {
    const title = urlParams.get(`t${index}`) || '';
    const content = urlParams.get(`c${index}`) || '';
    const siteUrl = urlParams.get(`u${index}`) || '';

    memoList.push({ t: title, c: content, u: siteUrl });

    index++;
  }

  return memoList;
}


function updateMemoList() {
  const memoListElement = document.getElementById('memoList');
  memoListElement.innerHTML = '';

  // 현재 URL의 쿼리 매개변수에서 메모 목록 가져오기
  const memoList = getMemoList();

  // 메모 목록 출력
  memoList.forEach((memo, index) => {
      const listItem = document.createElement('li');
      const memoLink = document.createElement('a');
      const deleteButton = document.createElement('button');
      const titleParagraph = document.createElement('p');
      const contentParagraph = document.createElement('p');

      // Font Awesome 아이콘 추가
      const icon = document.createElement('i');
      icon.className = 'fas fa-link'; // 원하는 아이콘 클래스로 변경 가능

      titleParagraph.appendChild(icon);
      titleParagraph.innerHTML += ` 제목: ${memo.t}`;

      contentParagraph.textContent = `내용: ${memo.c}`;

      memoLink.innerHTML = '바로가기';
      memoLink.href = "https://" + memo.u;
      memoLink.target = "_blank";

      deleteButton.textContent = '삭제';
      deleteButton.onclick = () => deleteMemo(index);

      listItem.appendChild(titleParagraph);
      listItem.appendChild(contentParagraph);
      listItem.appendChild(memoLink);
      listItem.appendChild(deleteButton);
      memoListElement.appendChild(listItem);
  });
}


function deleteMemo(index) {
  const memoList = getMemoList();

  if (index >= 0 && index < memoList.length) {
    memoList.splice(index, 1); // 해당 인덱스의 메모 삭제
    const params = new URLSearchParams();

    // 업데이트된 메모 목록을 URL에 반영
    memoList.forEach((memo, index) => {
      params.set(`t${index + 1}`, memo.t);
      params.set(`c${index + 1}`, memo.c);
      params.set(`u${index + 1}`, memo.u);
    });

    // 쿼리 매개변수로 업데이트된 메모 목록을 URL에 반영
    window.history.pushState({}, null, `?${params.toString()}`);

    // 메모 목록 업데이트
    updateMemoList();
  }
}

function deleteAllMemos() {
  const memoList = getMemoList();

  if (memoList.length > 0) {
      if (confirm("전체 메모를 삭제하시겠습니까?")) {
          // 전체 메모 삭제
          const params = new URLSearchParams();
          window.history.pushState({}, null, `?${params.toString()}`);

          // 메모 목록 업데이트
          updateMemoList();
      }
  } else {
      alert("삭제할 메모가 없습니다.");
  }
}

// 페이지 로드 시 메모 목록 업데이트
window.addEventListener('load', updateMemoList);

// 앵커 링크 클릭 시 해당 메모의 URL로 이동
window.addEventListener('hashchange', () => {
  const memoList = getMemoList();
  // const memoIndex = parseInt(window.location.hash.substring(1));

  if (!isNaN(memoIndex) && memoIndex >= 0 && memoIndex < memoList.length) {
    const memo = memoList[memoIndex];
    window.location.href = `${memo.u}`;
  }
});