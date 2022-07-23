/**
 * author: 带只拖鞋去流浪
 */

// 想了想还是不搞你们了 ^_^
// (function _confirm() {
//     if (confirm('纯原生编写，未使用任何 UI 库')) return;
//     _confirm();
// })();

(function _initHTML() {
    const avatorWidgetContainer = document.getElementById('avator-widget-container');
    for(let i=1; i<10;i++){
        avatorWidgetContainer.innerHTML += `
            <div class="avator-widget-item">
                <img src="" class="your-avator-img">
                <img src="./images/p${i}.png" alt="" class="avator-widget-img">
                <div class="avator-download-div">
                    <button class="download-btn">下载</button>
                </div>
            </div>
        `;
    }

    // 解决最后一行不能对其问题
    // 因为每行最多不超过10个
    for (let i = 0; i < 10; i++) {
        avatorWidgetContainer.innerHTML += `<div style="width:200px;"></div>`;
    }
})();

(function _addEventListener() {
    const fileIpt = document.getElementById('fileIpt');
    const addBtn = document.getElementById('addBtn');
    const downloadBtns = document.querySelectorAll('.avator-download-div > .download-btn');
    fileIpt.addEventListener('change', fileChange);
    addBtn.addEventListener('click', () => {
        fileIpt.click();
    });
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', downloadAvator);
    });
})();

async function fileChange(event) {
    const [file] = event.target.files;
    try {
        const url = await getBase64(file);

        const imgParentNodes = document.querySelectorAll('.avator-widget-container > .avator-widget-item');
        imgParentNodes.forEach(node => {
            const yourAvatorImg = node.getElementsByClassName('your-avator-img')[0];
            yourAvatorImg.src = url;
        });

    } catch (error) {
        console.error(error);
    }
}

async function downloadAvator(event) {
    const viewDiv = event.target.parentElement.parentElement;
    viewDiv.style.cssText += `border:none; border-radius:0;`;
    const printCanvas = await html2canvas(viewDiv, {
        backgroundColor: "rgb(254,254,255)",
    });

    viewDiv.style.cssText += `
        border: 1px solid #eee;
        border-radius: 10px;
    `;

    const dataURL = printCanvas.toDataURL(`image/png`);
    let blob = dataURL2Blob(dataURL);

    let aLink = document.createElement("a");
    let evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", true, true);
    aLink.download = `avator.png`;
    const url = URL.createObjectURL(blob);
    aLink.href = url;

    aLink.dispatchEvent(
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
        })
    ); // 兼容火狐
    URL.revokeObjectURL(url);
}

/**
 * @description Base64 ==> Blob
 * @param {*} dataURI 
 * @returns 
 */
function dataURL2Blob(dataURI) {
    let byteString = atob(dataURI.split(",")[1]);
    let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    let ab = new ArrayBuffer(byteString.length);
    let dw = new DataView(ab);
    for (let i = 0; i < byteString.length; i++) {
        dw.setUint8(i, byteString.charCodeAt(i));
    }
    return new Blob([ab], {
        type: mimeString,
    });
}

/**
 * @description File ==> Base64
 * @param {*} file 
 * @returns 
 */
function getBase64(file) {
    return new Promise((resolve, reject) => {
        let url = '';

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            url = fileReader.result;
        };

        fileReader.onerror = err => {
            reject(err);
        };

        fileReader.onloadend = () => {
            resolve(url);
        };
    })
}