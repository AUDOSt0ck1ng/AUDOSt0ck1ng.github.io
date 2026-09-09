# assets/

網站實際會載入的圖片全部放這裡。只要 `index.html` 或 CSS 引用得到的檔案，
就必須放在這個資料夾底下。

    assets/art/        插畫、背景美術
    assets/projects/   專案截圖

`ori_docs/` 是開發期的暫存區（原始輸出、草稿、筆記），而且它被 `.gitignore`
忽略 —— 裡面的東西**不會被部署到 GitHub Pages**。所以絕對不要從網站引用
`ori_docs/` 的路徑：本機打開看起來正常，上線後會 404。

命名規則：全小寫、用連字號分隔、副檔名要對應真實格式
（`stentor01.png`、`alice-and-rabbit.png`）。


## 命名規則：圖片組

專案截圖是以【組】為單位，命名規則是「前綴 + 兩位數字」：

    stentor01.png   stentor02.png   stentor03.png
    persona01.jpg   persona02.png
    kyokyobot01.png kyokyobot02.png

同一個前綴就是同一組，網頁上會疊成一疊卡片，點後面露出來的那張就把它轉到最前面。
**只有 `01` 就是單張**，不會出現任何疊層、編號或點擊行為，看起來跟普通截圖一模一樣。

編號從 `01` 連續排，中間不要跳號。一組最多 6 張（要再多要加
`art-direction.css` 裡 `.deck-card:nth-child(n)` 那幾行）。

目前的圖：

| 檔案 | 用在哪 | 顯示方式 |
|---|---|---|
| `art/alice-and-rabbit.png` | 首屏右側背景 | 滿版裁切 |
| `art/three-oclock-tea-party.png` | 頁尾 Contact 背景 | 滿版裁切 |
| `projects/stentor01–03.png` | Featured 專案截圖 | 從頂端裁切，有高度上限 |
| `projects/persona01.jpg`、`persona02.png` | Persona 卡片 | 完整顯示，不裁切 |
| `projects/avatar01–02.png` | AVATAR 卡片 | 完整顯示，不裁切 |
| `projects/kyokyobot01–02.png` | KyoKyoBot 卡片 | 完整顯示，不裁切 |

四組現在都是多張，所以都會疊層。


## 加一張圖到現有的組

1. 檔案丟進 `assets/projects/`，命名接著排（例如 `stentor04.png`）。
2. 到 `index.html` 找到那個 `<div class="deck">`，**複製裡面那行
   `<div class="deck-card">`，改掉 `src`、`alt`、`width`、`height`**。
   順序就是疊層順序，第一行在最前面。

       <div class="deck" data-deck="stentor">
         <div class="deck-card"><img src="assets/projects/stentor01.png" alt="..." width="1028" height="1295"></div>
         <div class="deck-card"><img src="assets/projects/stentor02.png" alt="..." width="1020" height="1283"></div>
       </div>

   截圖本身**不是連結**：在圖上誤點一下不該把人帶離頁面。
3. 就這樣。疊層、編號（`01 / 03`）、點擊轉到最前面、無障礙標籤都是
   `script.js` 自己算的，不用手動填數量。

> 為什麼不是丟檔案進去就自動出現？因為 GitHub Pages 是純靜態的，
> 前端讀不到資料夾內容。寫在 HTML 裡換來的好處：沒有探測用的 404、
> 關掉 JS 也看得到圖、而且能填 `width`/`height` 避免圖載入時版面跳動。


## 把某一張換成別張

1. 新圖丟進 `assets/art/` 或 `assets/projects/`。
2. 改 `index.html` 裡那一行的 `src`。
3. **把 `width` / `height` 改成新圖的實際像素尺寸。** 這兩個屬性不是拿來
   縮放的，是給瀏覽器先算好版位、避免圖載入時整頁跳動。填錯會讓版面抖動，
   Featured 那張還會裁到錯的地方。

   查尺寸：

       python -c "from PIL import Image;im=Image.open('assets/projects/stentor01.png');print(im.size)"

4. `alt` 一併改成新圖的內容描述（首屏和頁尾那兩張是純裝飾，`alt=""` 保持空的
   就對了，不要填字）。


## 各個位置對圖片的要求

**首屏 `art/alice-and-rabbit.png`** — `object-fit:cover` 滿版裁切，等於一定會被
裁。主體請放中間偏右；螢幕窄的時候會改成對齊 58%（`art-direction.css` 的
`.hero-artwork`）。橫圖為佳。

**頁尾 `art/three-oclock-tea-party.png`** — 一樣滿版裁切，但左側會被漸層蓋掉當
文字底（`.tea-art::after`），所以**左邊三分之一不要放重點**。適合很寬的橫幅比例。

**Featured 截圖 `projects/stentor01.png`** — 從頂端往下裁，高度上限
800px / 660px / 540px（依螢幕寬度，`.project-shot .deck-card img`）。因為是
**從上往下裁**，重點請放截圖的上半部。

**卡片 `projects/persona*`、`avatar*`、`kyokyobot*`** — `object-fit:contain`
完整顯示不裁切，卡片高度跟著圖的比例長。所以**各張卡片的首圖長寬比最好接近**，
不然卡片會一高一低。AVATAR 那組首圖是直式的，所以有一條
`[data-deck="avatar"] .deck-card img { aspect-ratio:1429/795 }` 把它鎖成橫幅，
上下留黑邊，跟另外兩張卡片對齊。

**同一組內的圖也請用接近的比例。** 疊層的高度是取那一組裡最高的那張，
比例差太多的話，矮的那張轉到最前面時上下會空一塊。


## 檔案大小

首屏那張是 `fetchpriority="high"`，會擋住首次繪製，盡量壓在 500KB 以內。
其他的都有 `loading="lazy"`，寬鬆一點沒關係，但單張還是建議 1MB 以下。
截圖用 PNG，照片或插畫用 JPEG 或 WebP。


## 兩張插畫是 WebP + PNG 雙檔

`art/` 裡的兩張插畫各有 `.webp` 和 `.png`，HTML 用 `<picture>` 包起來：
支援 WebP 的瀏覽器拿 `.webp`（334KB / 284KB），舊瀏覽器回到 `.png`（2.4MB / 2.2MB）。

    <picture>
      <source type="image/webp" srcset="assets/art/alice-and-rabbit.webp">
      <img class="hero-artwork" src="assets/art/alice-and-rabbit.png" alt="" width="1672" height="897" fetchpriority="high">
    </picture>

`width` / `height` 只寫在 `<img>` 上，且兩個檔尺寸必須一樣。
**換圖的時候兩個檔都要重新產，不能只換其中一個：**

    python -c "from PIL import Image;Image.open('assets/art/alice-and-rabbit.png').convert('RGB').save('assets/art/alice-and-rabbit.webp','WEBP',quality=92,method=6)"

`<picture>` 本身是 inline 盒子，會破掉 `.wonderland` / `.tea-art` 的百分比高度，
所以 `art-direction.css` 裡有一行 `.wonderland picture,.tea-art picture { display:contents }`
把它從版面上拿掉。再加新的 `<picture>` 記得跟著加進這個選擇器。
