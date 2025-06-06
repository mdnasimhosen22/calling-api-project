const foodSection = document.getElementById("foods-section");

const loadFoods = async () => {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s="
  );
  const data = await res.json();
  showFoods(data.meals);
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

const handleSearch = async () => {
  const input = document.getElementById("search-input").value;
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`
  );
  const data = await res.json();
  if (!data.meals) {
    foodSection.className = "flex justify-center items-center min-h-[60vh] ";
    foodSection.innerHTML = `
    <div class="text-center bg-white shadow-2xl shadow-blue-700 my-5 w-80 p-4">
      <img src="../images/Icon.png" alt="No data" class="w-48 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-red-500">No meals found for "<span class="font-bold">${input}</span>"</h2>
    </div>
  `;
    document.getElementById("search-input").value = "";
    return;
  } else {
    foodSection.className =
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6";
    showFoods(data.meals);
  }
  showFoods(data.meals);
  document.getElementById("search-input").value = "";

  // ক্যাটেগরি Active স্টেট রিসেট
  const buttons = document.querySelectorAll("#search-input button");
  buttons.forEach((btn) => btn.classList.remove("bg-blue-500", "text-white"));
};

// ✅ Modal দেখানো / popap diye card er details dekhano
const showModal = async (foods) => {
  const modal = document.getElementById("foods-modal");
  const content = document.getElementById("details-container");
  modal.classList.remove("hidden");

  content.innerHTML = `
    <div class="p-4 border rounded bg-white shadow">
      <h2 class="text-xl font-bold mb-2">${foods.strMeal}</h2>
      <img src="${foods.strMealThumb}" alt="${foods.strMeal}" class="w-full mb-2 rounded"/>
      <p class="text-gray-700">${foods.strInstructions}</p>
    </div>
  `;
};

// ✅ Modal বন্ধ
const closeModal = () => {
  document.getElementById("foods-modal").classList.add("hidden");
};

handleSearch();
loadFoods();
// showFoodDetails();
// showModal();
