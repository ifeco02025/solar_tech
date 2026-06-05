const token = localStorage.getItem("token");

// ======================
// LOGOUT
// ======================
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  });
}

// ======================
// CREATE PRODUCT
// ======================
const productForm = document.getElementById("productForm");

if (productForm) {
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", document.getElementById("title").value);

    formData.append("category", document.getElementById("category").value);

    formData.append("price", document.getElementById("price").value);

    formData.append(
      "description",
      document.getElementById("description").value,
    );

    formData.append(
      "specifications",
      document.getElementById("specifications").value,
    );

    const images = document.getElementById("images").files;

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      const editId = productForm.dataset.editId;

      let url = "/api/products";
      let method = "POST";

      if (editId) {
        url = `/api/products/${editId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      console.log("SERVER RESPONSE:", data);

      if (!response.ok) {
        alert(data.message || "Operation Failed");
        return;
      }

      alert(
        editId
          ? "Product Updated Successfully"
          : "Product Uploaded Successfully",
      );

      productForm.reset();

      preview.innerHTML = "";

      delete productForm.dataset.editId;

      getProducts();
      getProductsTable();
    } catch (error) {
      console.log(error);
    }
  });
}

const imagesInput = document.getElementById("images");
const preview = document.getElementById("preview");

if (imagesInput && preview) {
  imagesInput.addEventListener("change", () => {
    preview.innerHTML = "";

    Array.from(imagesInput.files).forEach((file) => {
      const url = URL.createObjectURL(file);

      preview.innerHTML += `
        <img src="${url}" width="80"
          style="margin:5px;border-radius:8px;">
      `;
    });
  });
}

// ======================
// CARD VIEW (OPTIONAL)
// ======================
async function getProducts() {
  try {
    const response = await fetch("/api/products");
    const products = await response.json();

    const container = document.getElementById("productsContainer");

    if (!container) return;

    container.innerHTML = "";

    products.forEach((product) => {
      container.innerHTML += `
        <div class="admin-product">

       <img src="${product.images[0]}" />

          <h3>${product.title}</h3>

          <p>${product.price}</p>

          <div class="admin-actions">

            <button onclick="deleteProduct('${product._id}')" class="delete-btn">
              Delete
            </button>

          </div>

        </div>
      `;
    });
  } catch (error) {
    console.log(error);
  }
}

// ======================
// TABLE VIEW (NEW - MAIN)
// ======================
async function getProductsTable() {
  try {
    const response = await fetch("/api/products");
    const products = await response.json();

    const table = document.getElementById("productTable");

    if (!table) return;

    table.innerHTML = "";

    products.forEach((p) => {
      table.innerHTML += `
        <tr>
          <td>
      <img 
  src="${p.images && p.images.length > 0 ? p.images[0] : "/images/no-image.png"}" 
  width="50"
/>
          </td>

          <td>${p.title}</td>
          <td>${p.category}</td>
          <td>${p.price}</td>
          <td>${p.description}</td>

          <td>
<button class="edit-btn" data-id="${p._id}">
  Edit
</button>

<button class="delete-btn" data-id="${p._id}">
  Delete
</button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("click", async (e) => {
  // DELETE
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;

    const ok = confirm("Delete this product?");

    if (!ok) return;

    try {
      await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Product deleted");

      getProductsTable();
    } catch (error) {
      console.log(error);
    }
  }

  // EDIT
  if (e.target.classList.contains("edit-btn")) {
    const id = e.target.dataset.id;

    window.location.href = `/edit-product?id=${id}`;
  }
});

// ======================
// DELETE PRODUCT
// ======================
window.deleteProduct = async (id) => {
  const confirmDelete = confirm(
    "Are you sure you want to delete this product?",
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    alert(data.message);

    getProducts();
    getProductsTable();
  } catch (error) {
    console.log(error);
  }
};

// ======================

window.editProduct = async (id) => {
  try {
    const response = await fetch("/api/products");

    const products = await response.json();

    const product = products.find((p) => p._id === id);

    if (!product) return;

    document.getElementById("title").value = product.title;

    document.getElementById("category").value = product.category;

    document.getElementById("price").value = product.price;

    document.getElementById("description").value = product.description;

    document.getElementById("specifications").value = JSON.stringify(
      product.specifications,
    );

    productForm.dataset.editId = id;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } catch (error) {
    console.log(error);
  }
};
// ======================
// INIT LOAD
// ======================
getProducts();
getProductsTable();
