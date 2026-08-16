const API_URL = "https://drops-highland-distribute-video.trycloudflare.com";

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/api/products`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const products = await response.json();

        const container = document.getElementById("products");

        if (!products.length) {
            container.innerHTML = "لا توجد رتب حاليًا";
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="card">
                <h2>${escapeHTML(product.name)}</h2>

                <div class="price">
                    $${Number(product.price).toFixed(2)}
                </div>

                <p>رتبة في DashaSMP</p>

                <button onclick="buyRank(${Number(product.id)})">
                    شراء
                </button>
            </div>
        `).join("");

    } catch (error) {
        console.error("Products error:", error);

        document.getElementById("products").innerHTML =
            "حدث خطأ في تحميل الرتب";
    }
}

async function buyRank(productId) {
    const player = prompt("اكتب اسم Minecraft:");

    if (!player) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/orders`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                productId: productId,
                player: player.trim()
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "حدث خطأ");
        }

        alert(
            "تم إنشاء الطلب بنجاح!\n" +
            "رقم الطلب: " +
            data.orderId
        );

    } catch (error) {
        console.error("Order error:", error);

        alert(
            "تعذر إنشاء الطلب.\n" +
            "تأكد أن الـBackend وCloudflare Tunnel يعملان."
        );
    }
}

function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[character]));
}

loadProducts();
