const registerSection = document.getElementById("register-section");
const loginSection = document.getElementById("login-section");
const homeSection = document.getElementById("home-section");
const userNameDisplay = document.getElementById("user-name");
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const registerError = document.getElementById("register-error");
const loginError = document.getElementById("login-error");
const home = document.getElementById("home");

function showproject() {
  home.innerHTML = `
    <div class="container-fluid px-4 py-5">
      <div class="row">
        <!-- Sidebar with Add Product Form -->
        <div class="col-lg-3">
          <div class="card shadow-sm mb-4 sticky-top" style="top: 1rem;">
            <div class="card-body p-4">
              <h3 class="card-title mb-4">Add New Product</h3>
              
              <div class="form-floating mb-3">
                <input
                  oninput="isvalidproductfield(productnameregex,this)"
                  type="text"
                  class="form-control"
                  id="productname"
                  placeholder="Product Name"
                />
                <label for="productname">Product Name</label>
                <p class="text-danger small mt-1 d-none">Must begin with a capital letter</p>
              </div>

              <div class="form-floating mb-3">
                <input
                  oninput="isvalidproductfield(productpriceregex,this)"
                  type="number"
                  class="form-control"
                  id="productprice"
                  placeholder="Price"
                />
                <label for="productprice">Price</label>
                <p class="text-danger small mt-1 d-none">Must be a positive number</p>
              </div>

              <div class="form-floating mb-3">
                <select
                  onchange="isvalidproductfield(productcategoryregex,this)"
                  class="form-select"
                  id="productcategory"
                >
                  <option disabled hidden selected>Select Category</option>
                  <option>tv</option>
                  <option>phone</option>
                  <option>labtop</option>
                  <option>printer</option>
                  <option>camera</option>
                </select>
                <label for="productcategory">Category</label>
                <p class="text-danger small mt-1 d-none">Please select a category</p>
              </div>

              <div class="form-floating mb-3">
                <textarea
                  oninput="isvalidproductfield(productdescribtionregex,this)"
                  class="form-control"
                  id="productdescribtion"
                  placeholder="Description"
                  style="height: 100px"
                ></textarea>
                <label for="productdescribtion">Description</label>
                <p class="text-danger small mt-1 d-none">Must be at least 5 characters</p>
              </div>

              <div class="mb-3">
                <label for="productimage" class="form-label">Product Image</label>
                <input
                  type="file"
                  class="form-control"
                  id="productimage"
                />
                <p class="text-danger small mt-1 d-none">Please choose an image</p>
              </div>

              <div class="form-floating mb-4">
                <input
                  oninput="isvalidproductfield(productamountregex,this)"
                  type="number"
                  class="form-control"
                  id="productamount"
                  placeholder="Amount"
                />
                <label for="productamount">Amount</label>
                <p class="text-danger small mt-1 d-none">Please enter a valid amount</p>
              </div>

              <div class="d-grid gap-2">
                <button
                  id="addproductbutton"
                  onclick="addproduct()"
                  class="btn btn-primary btn-lg"
                >
                  Add Product
                </button>
                <button
                  id="updateproductbutton"
                  onclick="updateproducts()"
                  class="btn btn-success btn-lg d-none"
                >
                  Update Product
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="col-lg-9">
          <!-- Search Bar -->
          <div class="card shadow-sm mb-4">
            <div class="card-body p-3">
              <input
                oninput="searchbyproductname(this.value)"
                type="search"
                class="form-control form-control-lg"
                placeholder="Search products..."
              />
            </div>
          </div>

          <!-- Products Grid -->
          <div id="productcontainerelement" class="row g-4"></div>
        </div>
      </div>
    </div>`;

  initializeVariables();
  if (localStorage.getItem("ourproducts") != null) {
    productlist = JSON.parse(localStorage.getItem("ourproducts"));
    displayproducts(productlist);
  }
}

function showSection(section) {
  registerSection.style.display = "none";
  loginSection.style.display = "none";
  homeSection.style.display = "none";
  section.style.display = "block";
}

document
  .getElementById("login-link")
  .addEventListener("click", () => showSection(loginSection));
document
  .getElementById("register-link")
  .addEventListener("click", () => showSection(registerSection));

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  if (localStorage.getItem(email)) {
    registerError.textContent = "Email is already registered!";
  } else {
    localStorage.setItem(email, JSON.stringify({ name, password }));
    localStorage.setItem("currentUser", JSON.stringify({ name, email }));
    alert("Registration successful! Redirecting to home.");
    userNameDisplay.textContent = name;
    showSection(homeSection);
    showproject();
  }
});

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const user = JSON.parse(localStorage.getItem(email));

  if (user && user.password === password) {
    userNameDisplay.textContent = user.name;
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ name: user.name, email })
    );
    alert("Login successful! Redirecting to home.");
    showSection(homeSection);
    showproject();
  } else {
    loginError.textContent = "Invalid email or password!";
  }
});

document.getElementById("logout").addEventListener("click", function () {
  localStorage.removeItem("currentUser");
  document.getElementById("home").innerHTML = "";
  alert("Logged out!");
  showSection(loginSection);
});

if (localStorage.getItem("currentUser")) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  userNameDisplay.textContent = currentUser.name;
  showSection(homeSection);
  showproject();
} else {
  showSection(loginSection);
}

var productlist = [];
var updatedproductindex;

var productpriceregex = /^\d+$/;
var productnameregex = /^[A-Z].+$/;
var productcategoryregex = /^tv|phone|printer|camera|labtop$/;
var productdescribtionregex = /^.{5,}$/;
var productamountregex = /^[0-9]+$/;

function initializeVariables() {
  window.productnameinput = document.getElementById("productname");
  window.productpriceinput = document.getElementById("productprice");
  window.productcategoryinput = document.getElementById("productcategory");
  window.productdescribtioninput =
    document.getElementById("productdescribtion");
  window.productimageinput = document.getElementById("productimage");
  window.productamountinput = document.getElementById("productamount");
  window.productcontainerelement = document.getElementById(
    "productcontainerelement"
  );
  window.addproductbutton = document.getElementById("addproductbutton");
  window.updateproductbutton = document.getElementById("updateproductbutton");
}

function deleteproduct(deletedindex) {
  productlist.splice(deletedindex, 1);
  localStorage.setItem("ourproducts", JSON.stringify(productlist));
  displayproducts(productlist);
}

function searchbyproductname(term) {
  var filteredproduct = productlist.filter((product) =>
    product.productname.toLowerCase().includes(term.toLowerCase())
  );
  displayproducts(filteredproduct);
}

function addproduct() {
  if (
    isvalidproductfield(productnameregex, productnameinput) &&
    isvalidproductfield(productpriceregex, productpriceinput) &&
    isvalidproductfield(productcategoryregex, productcategoryinput) &&
    isvalidproductfield(productdescribtionregex, productdescribtioninput) &&
    validproductimage()
  ) {
    var product = {
      productname: productnameinput.value,
      productprice: productpriceinput.value,
      productcategory: productcategoryinput.value,
      productdescription: productdescribtioninput.value,
      productimage: productimageinput.files[0].name,
      productamount: productamountinput.value,
    };

    productlist.push(product);
    localStorage.setItem("ourproducts", JSON.stringify(productlist));
    displayproducts(productlist);
    resetproductsinput();
  }
}

function resetproductsinput() {
  productnameinput.value = "";
  productpriceinput.value = "";
  productcategoryinput.value = "Choose your category";
  productdescribtioninput.value = "";
  productamountinput.value = "";
}

function displayproducts(arr) {
  var containerelement = arr
    .map(
      (product, i) => `
    <div class="col-md-6 col-xl-4">
      <div class="card h-100 shadow-sm hover-shadow">
        <div class="card-img-top p-3" style="height: 200px;">
          <img src="./images/${product.productimage}" 
               class="w-100 h-100 object-fit-contain" 
               alt="${product.productname}">
        </div>
        <div class="card-body">
          <h5 class="card-title">${product.productname}</h5>
          <p class="card-text text-muted mb-2">${product.productdescription}</p>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-primary">${product.productcategory}</span>
            <span class="text-success fw-bold">$${product.productprice}</span>
          </div>
          <p class="card-text">
            <small class="text-muted">Stock: ${product.productamount}</small>
          </p>
        </div>
        <div class="card-footer bg-transparent border-top-0">
          <div class="d-flex justify-content-end gap-2">
            <button onclick="deleteproduct(${i})" 
                    class="btn btn-outline-danger btn-sm">
              <i class="fa-solid fa-trash-can"></i>
            </button>
            <button onclick="moveproductdetailstoinput(${i})" 
                    class="btn btn-outline-success btn-sm">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  productcontainerelement.innerHTML = containerelement;
}

function moveproductdetailstoinput(index) {
  const product = productlist[index];
  productnameinput.value = product.productname;
  productpriceinput.value = product.productprice;
  productcategoryinput.value = product.productcategory;
  productdescribtioninput.value = product.productdescription;
  productamountinput.value = product.productamount;
  addproductbutton.classList.replace("d-block", "d-none");
  updateproductbutton.classList.replace("d-none", "d-block");
  updatedproductindex = index;
}

function updateproducts() {
  productlist[updatedproductindex] = {
    ...productlist[updatedproductindex],
    productname: productnameinput.value,
    productprice: productpriceinput.value,
    productdescription: productdescribtioninput.value,
    productcategory: productcategoryinput.value,
    productamount: productamountinput.value,
  };

  if (productimageinput.files.length > 0) {
    productlist[updatedproductindex].productimage =
      productimageinput.files[0].name;
  }

  displayproducts(productlist);
  localStorage.setItem("ourproducts", JSON.stringify(productlist));
  resetproductsinput();
  addproductbutton.classList.replace("d-none", "d-block");
  updateproductbutton.classList.replace("d-block", "d-none");
}

function isvalidproductfield(regex, element) {
  const isValid = regex.test(element.value);
  element.classList.toggle("is-valid", isValid);
  element.classList.toggle("is-invalid", !isValid);
  element.nextElementSibling.classList.toggle("d-none", isValid);
  element.nextElementSibling.classList.toggle("d-block", !isValid);
  return isValid;
}

function validproductimage() {
  const isValid = productimageinput.files.length > 0;
  productimageinput.nextElementSibling.classList.toggle("d-none", isValid);
  productimageinput.nextElementSibling.classList.toggle("d-block", !isValid);
  return isValid;
}
