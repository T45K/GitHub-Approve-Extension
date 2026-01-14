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

        // 1. "Submit review"ボタンを押し、ドロワーを出現させる
        const submitReviewButton = Array.from(document.querySelectorAll('button')).find(button => {
            const buttonText = button.textContent.trim();
            return buttonText.includes('Submit review') && 
                   button.classList.contains('ReviewMenuButton-module__ReviewMenuButton--RFyxN');
        });
        
        if (submitReviewButton) {
            submitReviewButton.click();
            
            // ドロワーが表示されるのを待つ
            setTimeout(async () => {
                // LGTMの画像を取得
                const response = await chrome.runtime.sendMessage({ action: 'fetchLgtmImage' });
                if (!response.success) {
                    console.error('Failed to fetch LGTM image:', response.error);
                    return;
                }
                const lgtmImageUrl = response.imageUrl;
                
                // テキストエリアにLGTM画像を設定
                const textareas = document.querySelectorAll('textarea');
                for (const textarea of textareas) {
                    if (textarea.placeholder === 'Leave a comment') {
                        textarea.value = `![LGTM](${lgtmImageUrl})`;
                        break;
                    }
                }
                
                // 2. ドロワー内の "Approve" ラジオボタンを押す
                const approveRadio = Array.from(document.querySelectorAll('input[type="radio"]')).find(radio => 
                    radio.value === 'approve' && !radio.disabled
                );
                
                if (approveRadio) {
                    approveRadio.click();
                    
                    // 3. 最後に、ドロワー内の "Submit review"ボタンを押す
                    setTimeout(() => {
                        const submitButtons = Array.from(document.querySelectorAll('button')).filter(button => {
                            const buttonText = button.textContent.trim();
                            return buttonText.includes('Submit review');
                        });
                        
                        // ドロワー内の最後のSubmit reviewボタンをクリック
                        if (submitButtons.length > 0) {
                            submitButtons[submitButtons.length - 1].click();
                        }
                    }, 500);
                }
            }, 500);
        }
    });

    // ボタンをページに追加
    document.body.appendChild(button);
}

// ページが読み込まれたときにボタンを追加
window.addEventListener('load', addApproveButton);
