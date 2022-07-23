# 说明
挂件素材是本人用 `PhotoShop` 做的。
且图片来源于网络，如果侵犯了您的权益，请及时联系删除。

采用原生 `html` + `css` + `javascript` 编写，使用到了 html2canvas。纯前端，不会保存您的任何数据。


# `File` 转 `Base64`
获取到的是一个 `File` 对象，因此转成 `Base64` 后以 `<img src="base64">` 形式展示。
```javascript
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
```

# `input:file` 处理
将原来的 `input` 隐藏掉，目的是为了更好的 UI 和用户体验。
```html
<input type="file" name="" id="fileIpt" accept="image/png, image/jpg, image/jpeg" style="display:none;">
<div class="add-avator" id="addBtn"> + </div>
```

```javascript
const fileIpt = document.getElementById('fileIpt');
const addBtn = document.getElementById('addBtn');

fileIpt.addEventListener('change', fileChange);
addBtn.addEventListener('click', () => {
    fileIpt.click();
});
```


# `Flex` 最后一行不能对齐
考虑到没有固定每行的个数，并且每行最多不超过10个，因此我们使用如下的方式去占位。你可能会疑问为什么这样写，因为都是透明div，而且高度为0，并不影响效果，只是占位而已，让原来的最后一行变成不是最后一行。

```javascript
const avatorWidgetContainer = document.getElementById('avator-widget-container');

// 解决最后一行不能对其问题
// 因为每行最多不超过10个
for(let i=0;i<10;i++){
    avatorWidgetContainer.innerHTML += `<div style="width:200px;"></div>`;
}
```


# 使用 `html2Canvas`
你可以查看官网去下载 `html2canvas.min.js`，相关参数也在官网也有详细说明。获取到的是一个 `canvas`。
```javascript
const viewDiv = event.target.parentElement.parentElement;
const printCanvas = await html2canvas(viewDiv, {
    backgroundColor: "rgb(254,254,255)",
});
```
转成 base64
```javascript
const dataURL = printCanvas.toDataURL(`image/png`);
```


# `base64` 转二进制编码 `Blob`
```javascript
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
```

```javascript
let blob = dataURL2Blob(dataURL);
```


# `Blob` 转 `URL`
```javascript
URL.createObjectURL(blob);
```


# 通过 `<a href="url"></a>` 下载
```javascript
let aLink = document.createElement("a");
let evt = document.createEvent("HTMLEvents");
evt.initEvent("click", true, true);
aLink.download = `avator.png`;
const url = URL.createObjectURL(blob);
aLink.href = url;
```

# 模拟点击
```javascript
aLink.dispatchEvent(
    new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
    })
); // 兼容火狐
URL.revokeObjectURL(url);
```