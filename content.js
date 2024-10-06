// content.js
function addApproveButton() {
    // チェックし、すでにボタンが追加されていないことを確認
    if (document.getElementById('approve-button')) return;

    // ボタンを作成
    const button = document.createElement('button');
    button.id = 'approve-button';
    button.textContent = 'Approve PR';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.style.backgroundColor = '#28a745';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '10px';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // ボタンがクリックされたときの処理
    button.addEventListener('click', async () => {
        const match = window.location.href.match(/https:\/\/github\.com\/(.*)\/(.*)\/pull\/(\d+)/);
        if (!match) return;

        const lgtmImageUrl = (await (await fetch('https://lgtmoon.dev/api/images/random')).json()).images[0].url;
        document.getElementById('pull_request_review_body').value = lgtmImageUrl

        document.querySelector("input[value='approve']").click();
        Array.from(document.querySelectorAll("span")).find(span => span.textContent.trim() === 'Submit review').click();
    });

    // ボタンをページに追加
    document.body.appendChild(button);
}

// ページが読み込まれたときにボタンを追加
window.addEventListener('load', addApproveButton);
