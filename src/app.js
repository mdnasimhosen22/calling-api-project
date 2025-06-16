const foodSection = document.getElementById("foods-section");
const loadFoods = async () => {
  // প্রিলোডার দেখানো হলো 
  showLoader();

  try {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s="
    );
    const data = await res.json();
    foodSection.className =
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6";
    showFoods(data.meals);
  } catch (err) {
    console.error("Initial load failed:", err);
  } finally {
    // লোড শেষ হলে প্রিলোডার লুকাও
    hideLoader();
  }
};

const showFoods = (foods) => {
  foodSection.innerHTML = "";
  foods.forEach((food) => {
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="card bg-base-100 shadow-sm">
        <figure>
          <img src="${food.strMealThumb}" alt="${food.strMeal}"
           class="rounded w-full h-auto"/>
        </figure>
        <div class="card-body p-2">
          <h2 class="card-title font-bold ">${food.strMeal}</h2>
          <p>${food.strInstructions.slice(0, 100)}...</p>
          <div class="card-actions justify-end -ml-12 pt-5 md:ml-5 lg:-ml-25 xl:ml-0">
            <button class="view-details-btn bg-amber-400 text-white w-25 h-8 ml-[205px] cursor-pointer">View Details</button>
          </div>
        </div>
      </div>
    `;
    const createdCard = card.firstElementChild;

    // view details handelars

    const button_handelars = createdCard.querySelector(".view-details-btn");

    button_handelars.addEventListener("click", () => {
      showModal(food);
    });
    foodSection.appendChild(card.firstElementChild);
  });
};

// ✅ Modal দেখানো / popap diye card er details dekhano

const showLoader = () => {
  document.getElementById("preloader").classList.remove("hidden");
};

const hideLoader = () => {
  document.getElementById("preloader").classList.add("hidden");
};

// search hander
document.getElementById("search-input").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    handleSearch();
  }
});
const handleSearch = async () => {
  const input = document.getElementById("search-input").value;
  const foodSection = document.getElementById("foods-section");

  foodSection.classList.add("hidden");
  // 🔥 Loader দেখাও
  showLoader();

  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`
    );
    const data = await res.json();

    if (!data.meals) {
      foodSection.className = "flex justify-center items-center min-h-[60vh]";
      foodSection.innerHTML = `
        <div class="text-center bg-white shadow-2xl shadow-blue-700 my-5 w-80 p-4">
          <img src="./images/Icon.png" alt="No data" class="w-48 mx-auto mb-4" />
          <h2 class="text-xl font-semibold text-red-500">
            No meals found for "<span class="font-bold">${input}</span>"
          </h2>
        </div>
      `;
    } else {
      foodSection.className =
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6";
      showFoods(data.meals);
    }

    document.getElementById("search-input").value = "";

    // ✅ ক্যাটেগরি বাটন রিসেট (যদি লাগে)
    const buttons = document.querySelectorAll("#search-input button");
    buttons.forEach((btn) => btn.classList.remove("bg-blue-500", "text-white"));
  } catch (err) {
    console.error("Search Failed:", err);
  } finally {
    // ✅ Loader লুকাও সবশেষে
    hideLoader();
  }
};

const showModal = async (foods) => {
  const modal = document.getElementById("foods-modal");
  const content = document.getElementById("details-container");
  const modalContent = document.getElementById("modal-content");
  modal.classList.remove("hidden");

  // আনিমেশন trigger
  setTimeout(() => {
    modalContent.classList.remove("opacity-0", "scale-95");
    modalContent.classList.add("opacity-100", "scale-100");
  }, 50);
  content.innerHTML = `
    <div class="p-4 border rounded bg-white shadow">
      <img src="${foods.strMealThumb}" alt="${foods.strMeal}" class="w-full mb-2 rounded"/>
       <h2 class="text-xl font-bold mb-2">${foods.strMeal}</h2>
      <p class="text-gray-700">${foods.strInstructions}</p>
    </div>
  `;
};

// ✅ close Modal
const closeModal = () => {
  const modal = document.getElementById("foods-modal");
  const modalContent = document.getElementById("modal-content");

  // animation reverse করাও
  modalContent.classList.remove("opacity-100", "scale-100");
  modalContent.classList.add("opacity-0", "scale-95");

  // transition শেষে modal hide করাও
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 300); // duration same as animation time
};

let calcScrollValue = () => {
  let scrollProgress = document.getElementById("progress");
  // let progressValue = document.getElementById("progress-value");
  let pos = document.documentElement.scrollTop;
  let calcHight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrollValue = Math.round((pos * 100) / calcHight);
  if (pos > 100) {
    scrollProgress.style.display = "grid";
  } else {
    scrollProgress.style.display = "none";
  }
  scrollProgress.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
  scrollProgress.style.background = `conic-gradient(#03cc65 ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
};
window.onscroll = calcScrollValue;
window.onload = calcScrollValue;

loadFoods();
