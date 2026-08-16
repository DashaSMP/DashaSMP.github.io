async function loadProducts() {
    try {
        const response = await fetch("https://drops-highland-distribute-video.trycloudflare.com/api/products");

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const products = await response.json();

        const container = document.getElementById("products");

        container.innerHTML = products.map(product => `
            <div class="card">
                <h2>${product.name}</h2>

                <div class="price">
                    $${Number(product.price).toFixed(2)}
                </div>

                <p>رتبة في DashaSMP</p>

                <button onclick="buyRank(${product.id})">
                    شراء
                </button>
            </div>
        `).join("");

    } catch (error) {
        console.error(error);

        document.getElementById("products").innerHTML =
            "حدث خطأ في تحميل الرتب";
    }
}

async function buyRank(productId) {

    const player = prompt("اكتب اسم Minecraft:");

    if (!player) return;

    const response = await fetch("/api/orders", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            productId: productId,
            player: player
        })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.error || "حدث خطأ");
        return;
    }

    alert(
        "تم إنشاء الطلب بنجاح!\nرقم الطلب: " +
        data.orderId
    );
}

loadProducts();
