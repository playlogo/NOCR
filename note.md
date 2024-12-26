document.querySelector("#productList").outerHTML

<https://www.3djake.de/3d-drucker-und-mehr/outlet>

You are a website data extraction specialist. Only respond in JSON!

## Task

Extract product details from the provided HTML code and structure the response strictly in JSON format as specified below.

## JSON Format

```json
{
 "products": [
  {
    "name": string, // Full name and brand of the product.
    "image": string, // URL of the highest resolution image available for the product.
    "link": string, // URL to the product's details page. Add https://www.3djake.de/ if not given
    "kind": string, // One of the following categories: "FDM 3D Printer", "RESIN 3D Printer", "RESIN Utils", "CNC", "Other".
    "priceBeforeSale"?: number, // (Optional) The original price of the product before any discounts, e.g., 45.99 for €45.99.
    "price": number // The current sale price of the product.
  }
]
}
```

## Instructions

Parse the HTML to extract product information.
Ensure each product is accurately classified under kind. Use "Other" if no category matches.
If a product does not have a before-sale price, omit the priceBeforeSale field from that product's JSON object.
Always provide the highest resolution image URL for the image field.
Output only the resulting JSON.

## HTML Code

```html
<ul id="productList" class="grid-view ga-productlist" data-json="{&quot;name&quot;:&quot;Catalog_category&quot;}">        <li is="product-card" class="productCard ga-product" data-json="{&quot;brand&quot;:&quot;Phrozen&quot;,&quot;name&quot;:&quot;Sonic Mighty 8K - defekt&quot;,&quot;id&quot;:&quot;sonic-mighty-8k-defekt&quot;,&quot;position&quot;:null,&quot;category&quot;:&quot;Category-999&quot;,&quot;articleNumbers&quot;:&quot;3DJ-SMT8K-D&quot;}"> <figure class="productCard__img"> <a class="productCard__img__link" href="/phrozen/sonic-mighty-8k-defekt">        <img srcset="https://3d.nice-cdn.com/upload/image/product/large/default/24352_af96386f.160x160.jpg 160w, https://3d.nice-cdn.com/upload/image/product/large/default/24352_af96386f.256x256.jpg 256w, https://3d.nice-cdn.com/upload/image/product/large/default/24352_af96386f.320x320.jpg 320w, https://3d.nice-cdn.com/upload/image/product/large/default/24352_af96386f.512x512.jpg 512w" sizes="(min-width: 1210px) 256px, (min-width: 1024px) calc(77vw / 3), (min-width: 568px) 33.3vw, 50vw" src="https://3d.nice-cdn.com/upload/image/product/large/default/24352_af96386f.160x160.jpg" width="256" height="256" loading="eager" class="productCard__img__src js" fetchpriority="auto" alt="Phrozen Sonic Mighty 8K - defekt"> </a> </figure>  <div class="productCard__cta" is="product-card-cta"><form class="productCard__form" method="post" action="/phrozen/sonic-mighty-8k-defekt"> <input type="hidden" name="token" value="ac374dbe3dd4e4e33fce53b8172c51d7"> <input type="hidden" name="cid" value="13609"> <input type="hidden" name="count" value="1"> <input type="hidden" name="hideToCartMessage" value="true"> <input type="hidden" name="shopaction" value="additem"> <input type="hidden" name="sliderNeighbourhood" value=""> <button class="btn productCard__cta__btn productCard__cta__btn--primary productCard__cta--add js" type="submit" aria-label="Warenkorb"> <div class="productCard__cta__content"> <span class="productCard__cta__txt">Warenkorb</span> </div> <svg class="productCard__cta__confirmed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 261.2 204.3"> <polyline points="21.9,118.1 78.6,183.4 239.3,21.4 "></polyline> </svg> </button> </form></div> <div class="productCard__content"> <div class="productCard__rating"></div> <h3 class="productCard__title"> <a class="productCard__link js" href="/phrozen/sonic-mighty-8k-defekt" data-said="6899"> <strong class="productCard__brand">Phrozen</strong>  Sonic Mighty 8K -​ defekt</a> </h3>    <div class="productCard__tags">   <span class="flag sale-tag small percent">-20%</span>    </div>      <ul class="productCard__benefits"><li>Mängel\n</li><li>Gebrauchsspuren\n</li><li>Fehlende Teile\n</li></ul> </div> <div class="productCard__footer">  <div class="productCard__price">  <span class=" price--reduced">191,99&nbsp;€</span> <span class=" instead-price">239,99&nbsp;€</span>    </div>   <p class="productCard__stock state-green"> Zustellung bis 31. Dezember</p>  </div> </li>   <li is="product-card" class="productCard ga-product" data-json="{&quot;brand&quot;:&quot;Anycubic&quot;,&quot;name&quot;:&quot;Wash &amp; Cure Max - defekt&quot;,&quot;id&quot;:&quot;wash-cure-max-defekt&quot;,&quot;position&quot;:null,&quot;category&quot;:&quot;Category-999&quot;,&quot;articleNumbers&quot;:&quot;3DJ-WACM-D&quot;}"> <figure class="productCard__img"> <a class="productCard__img__link" href="/anycubic-1/wash-cure-max-defekt">        <img srcset="https://3d.nice-cdn.com/upload/image/product/large/default/47518_2a781207.160x160.jpg 160w, https://3d.nice-cdn.com/upload/image/product/large/default/47518_2a781207.256x256.jpg 256w, https://3d.nice-cdn.com/upload/image/product/large/default/47518_2a781207.320x320.jpg 320w, https://3d.nice-cdn.com/upload/image/product/large/default/47518_2a781207.512x512.jpg 512w" sizes="(min-width: 1210px) 256px, (min-width: 1024px) calc(77vw / 3), (min-width: 568px) 33.3vw, 50vw" src="https://3d.nice-cdn.com/upload/image/product/large/default/47518_2a781207.160x160.jpg" width="256" height="256" loading="eager" class="productCard__img__src js" fetchpriority="auto" alt="Anycubic Wash &amp; Cure Max - defekt"> </a> </figure>  <div class="productCard__cta" is="product-card-cta"><form class="productCard__form" method="post" action="/anycubic-1/wash-cure-max-defekt"> <input type="hidden" name="token" value="ac374dbe3dd4e4e33fce53b8172c51d7"> <input type="hidden" name="cid" value="24334"> <input type="hidden" name="count" value="1"> <input type="hidden" name="hideToCartMessage" value="true"> <input type="hidden" name="shopaction" value="additem"> <input type="hidden" name="sliderNeighbourhood" value=""> <button class="btn productCard__cta__btn productCard__cta__btn--primary productCard__cta--add js" type="submit" aria-label="Warenkorb"> <div class="productCard__cta__content"> <span class="productCard__cta__txt">Warenkorb</span> </div> <svg class="productCard__cta__confirmed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 261.2 204.3"> <polyline points="21.9,118.1 78.6,183.4 239.3,21.4 "></polyline> </svg> </button> </form></div> <div class="productCard__content"> <div class="productCard__rating"></div> <h3 class="productCard__title"> <a class="productCard__link js" href="/anycubic-1/wash-cure-max-defekt" data-said="12952"> <strong class="productCard__brand">Anycubic</strong>  Wash &amp; Cure Max -​ defekt</a> </h3>         <ul class="productCard__benefits"><li>Mängel\n</li><li>Gebrauchsspuren\n</li><li>Fehlende Teile\n</li></ul> </div> <div class="productCard__footer">  <div class="productCard__price">  <span>89,99&nbsp;€</span>    </div>   <p class="productCard__stock state-green"> Zustellung bis 31. Dezember</p>  </div> </li>   </ul> 
```

#

```text
🔩 109€: Phrozen Sonic Mighty...
🌡️ 295€: aassasasa
👀 89€: Phrozen Sonic Mighty
```

console.log(Deno.env.get("GREETING")); // "Hello, world."

// 31
