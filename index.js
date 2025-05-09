// Randomize product displays on page load
document.addEventListener('DOMContentLoaded', function() {
   // Make all product-highlight sections fully clickable
   document.querySelectorAll('.product-highlight').forEach(highlight => {
     // Find the Amazon link inside this highlight
     const link = highlight.querySelector('a[href*="amazon.com"]');
     if (link) {
       const url = link.getAttribute('href');
       
       // Make the "Ver en Amazon" button have the amazon-button class
       link.classList.add('amazon-button');
       
       // Make the entire section clickable
       highlight.style.cursor = 'pointer';
       highlight.addEventListener('click', function(e) {
         // Only navigate if they didn't click the button itself
         if (!e.target.closest('a')) {
           window.open(url, '_blank');
         }
       });
     }
   });

   // Display message about images if they're not loading
   setTimeout(function() {
     const images = document.querySelectorAll('.amazon-product img, .product-highlight img');
     let imagesLoaded = true;
     
     images.forEach(img => {
       if (!img.complete || img.naturalHeight === 0) {
         imagesLoaded = false;
       }
     });
     
     if (!imagesLoaded) {
       const infoDiv = document.createElement('div');
       infoDiv.style.padding = '15px';
       infoDiv.style.margin = '20px 0';
       infoDiv.style.backgroundColor = '#fff4dd';
       infoDiv.style.border = '1px solid #ffd980';
       infoDiv.style.borderRadius = '8px';
       infoDiv.innerHTML = `
         <h3 style="margin-top: 0;">⚠️ Problemas con las imágenes?</h3>
         <p>Las imágenes de Amazon pueden no cargarse directamente. Para mostrar imágenes reales:</p>
         <ol style="text-align: left;">
           <li>Descarga las imágenes desde Amazon manualmente</li>
           <li>Súbelas a tu servidor junto con este archivo HTML</li>
           <li>Actualiza los enlaces en el código para que apunten a las imágenes locales</li>
         </ol>
       `;
       
       document.querySelector('.container').insertBefore(infoDiv, document.querySelector('footer'));
     }
   }, 3000);
   
   // Fetch products from JSON file
   fetch('formatted_ads.json')
     .then(response => response.json())
     .then(data => {
       // Process the loaded products
       const products = data.map(item => {
         // Format the price to include $ if it doesn't already
         const price = typeof item.price === 'number' ? `$${item.price}` : item.price;
         
         // Use the image directly from the JSON file
         const image = item.img;
         
         return {
           title: item.title,
           image: image,
           price: price,
           url: item.url
         };
       });
       
       // Shuffle function
       function shuffleArray(array) {
         for (let i = array.length - 1; i > 0; i--) {
           const j = Math.floor(Math.random() * (i + 1));
           [array[i], array[j]] = [array[j], array[i]];
         }
         return array;
       }
       
       // Get random products
       const shuffledProducts = shuffleArray([...products]);
       
       // Create product HTML
       function createProductHTML(product) {
         return `
           <div class="amazon-product">
             <a href="${product.url}" target="_blank">
               <img src="${product.image}" alt="${product.title}">
               <div class="title">${product.title}</div>
               <div class="price">${product.price}</div>
               <button class="buy-button">Comprar Ahora</button>
             </a>
           </div>
         `;
       }
       
       // Replace existing products with random ones
       const productContainers = document.querySelectorAll('.amazon-products');
       if (productContainers.length > 0) {
         // First ad space - 2 products
         let html1 = '';
         for (let i = 0; i < 2; i++) {
           html1 += createProductHTML(shuffledProducts[i]);
         }
         productContainers[0].innerHTML = html1;
         
         // Second ad space - 2 different products
         if (productContainers.length > 1) {
           let html2 = '';
           for (let i = 2; i < 4; i++) {
             html2 += createProductHTML(shuffledProducts[i]);
           }
           productContainers[1].innerHTML = html2;
         }
       }
       
       // Update product-highlight sections
       const highlightSections = document.querySelectorAll('.product-highlight');
       highlightSections.forEach((section, index) => {
         // Use products starting from index 4 to avoid duplicates with the ad spaces
         const productIndex = 4 + index;
         if (productIndex < shuffledProducts.length) {
           const product = shuffledProducts[productIndex];
           section.innerHTML = `
             <img src="${product.image}" alt="${product.title}">
             <div class="product-info">
               <h3>${product.title}</h3>
               <div class="price">${product.price}</div>
               <a href="${product.url}" target="_blank">Ver en Amazon</a>
             </div>
           `;
         }
       });
     })
     .catch(error => {
       console.error('Error loading products:', error);
       
       // Fallback message if JSON file fails to load
       const infoDiv = document.createElement('div');
       infoDiv.style.padding = '15px';
       infoDiv.style.margin = '20px 0';
       infoDiv.style.backgroundColor = '#ffeded';
       infoDiv.style.border = '1px solid #ff8080';
       infoDiv.style.borderRadius = '8px';
       infoDiv.innerHTML = `
         <h3 style="margin-top: 0;">⚠️ Error cargando productos</h3>
         <p>No se pudo cargar el archivo de productos. Verifica que formatted_ads.json existe y está accesible.</p>
       `;
       
       document.querySelectorAll('.amazon-products').forEach(container => {
         container.innerHTML = '';
         container.appendChild(infoDiv.cloneNode(true));
       });
       
       // Also update product-highlight sections with error message
       document.querySelectorAll('.product-highlight').forEach(section => {
         section.innerHTML = '';
         section.appendChild(infoDiv.cloneNode(true));
       });
     });
 });