// Sample product data with individual images
const products = [
    {
        id: 1,
        name: "Classic White Tee",
        price: 29.99,
        description: "A timeless white t-shirt made from 100% organic cotton. Perfect for any casual occasion.",
        image: "/static/garments/garment1.png"
    },
    {
        id: 2,
        name: "Vintage Black Tee",
        price: 34.99,
        description: "A sleek black t-shirt with a vintage wash for that perfect worn-in look.",
        image: "/static/garments/garment2.png"
    },
    {
        id: 3,
        name: "Heather Gray V-Neck",
        price: 32.99,
        description: "A soft, heather gray v-neck t-shirt that's both comfortable and stylish.",
        image: "/static/garments/garment3.png"
    }
    ,
    {
        id: 4,
        name: "Navy Blue Crew Neck",
        price: 31.99,
        description: "A classic navy blue crew neck t-shirt that pairs well with any outfit.",
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 5,
        name: "Striped Sailor Tee",
        price: 36.99,
        description: "A nautical-inspired striped t-shirt perfect for a day by the sea.",
        image: "https://images.unsplash.com/photo-1565366896067-2a579f7f7f53?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 6,
        name: "Pastel Pink Tee",
        price: 33.99,
        description: "A soft, pastel pink t-shirt for a subtle pop of color in your wardrobe.",
        image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 7,
        name: "Olive Green Pocket Tee",
        price: 35.99,
        description: "An olive green t-shirt with a convenient chest pocket for a utilitarian look.",
        image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 8,
        name: "Burgundy Long Sleeve",
        price: 39.99,
        description: "A cozy burgundy long sleeve t-shirt for those cooler days.",
        image: "https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 9,
        name: "Graphic Print Tee",
        price: 37.99,
        description: "A unique graphic print t-shirt to showcase your personality.",
        image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 10,
        name: "Tie-Dye Festival Tee",
        price: 38.99,
        description: "A vibrant tie-dye t-shirt perfect for festivals and summer fun.",
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
];

let cartItems = 0;
const cartItemsElement = document.getElementById('cartItems');
const productGrid = document.getElementById('productGrid');
const productModal = document.getElementById('productModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');
const addToCartBtn = document.getElementById('addToCartBtn');
const closeModal = document.getElementById('closeModal');
const shopNowBtn = document.getElementById('shopNowBtn');
const mobileMenuButton = document.getElementById('mobileMenuButton');
const closeMobileMenu = document.getElementById('closeMobileMenu');
const mobileMenu = document.getElementById('mobileMenu');

function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="group relative bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-lg transition-shadow">
            <div class="aspect-square relative">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-gray-800">${product.name}</h3>
                <p class="text-gray-600 font-bold">$${product.price}</p>
                <button class="view-details w-full mt-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out" data-id="${product.id}">
                    View Details
                </button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', () => showProductDetails(button.dataset.id));
    });
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
        modalImage.src = product.image;
        modalImage.alt = product.name;
        modalTitle.textContent = product.name;
        modalDescription.textContent = product.description;
        modalPrice.textContent = `$${product.price}`;
        
        // Update the Virtual Try On button to include the selected garment
        const tryOnButton = productModal.querySelector('.try-on-btn');
        tryOnButton.onclick = () => {
            // Pass the garment image as a URL parameter
            window.location.href = `vton.html?garment=${encodeURIComponent(product.image)}`;
        };
        
        productModal.classList.remove('hidden');
    }
}

function addToCart() {
    cartItems++;
    cartItemsElement.textContent = cartItems;
    cartItemsElement.classList.remove('hidden');
}

// Event Listeners
addToCartBtn.addEventListener('click', addToCart);
closeModal.addEventListener('click', () => productModal.classList.add('hidden'));
shopNowBtn.addEventListener('click', () => {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
});

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.remove('translate-x-full');
});

closeMobileMenu.addEventListener('click', () => {
    mobileMenu.classList.add('translate-x-full');
});

// Initialize
renderProducts();