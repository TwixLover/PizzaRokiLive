document.addEventListener("click", async (e) => {

  

  if (e.target.classList.contains("js-save")) {

    const card = e.target.closest(".menu-card");
    const id = card.dataset.id;

    const payload = {
      name: card.querySelector(".js-name").value,
      description: card.querySelector(".js-description").value,
      base_price: card.querySelector(".js-price").value,
      image_url: card.querySelector(".js-image").value
    };

    await fetch(`/admin/menu/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    location.reload();
  }

  

  if (e.target.classList.contains("js-delete")) {

    const card = e.target.closest(".menu-card");
    const id = card.dataset.id;

    if (!confirm("Biztosan törölni szeretnéd ezt a menü elemet?")) {
      return;
    }

    await fetch(`/admin/menu/${id}`, {
      method: "DELETE"
    });

    card.remove();
  }



  if (e.target.classList.contains("js-add-item")) {

    const payload = {
      name: document.querySelector(".js-new-name").value,
      description: document.querySelector(".js-new-description").value,
      base_price: document.querySelector(".js-new-price").value,
      image_url: document.querySelector(".js-new-image").value,
      type: document.querySelector(".js-new-type").value
    };

    await fetch("/admin/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    location.reload();
  }

  

  if (e.target.classList.contains("js-user-save")) {

    const card = e.target.closest(".user-card");
    const id = card.dataset.id;

    const payload = {
      email: card.querySelector(".js-user-email").value,
      first_name: card.querySelector(".js-user-first-name").value,
      last_name: card.querySelector(".js-user-last-name").value,
      phone: card.querySelector(".js-user-phone").value,
      street: card.querySelector(".js-user-street").value,
      house_number: card.querySelector(".js-user-house-number").value,
      city: card.querySelector(".js-user-city").value,
      postal_code: card.querySelector(".js-user-postal-code").value,
      role: card.querySelector(".js-user-role").value
    };

    await fetch(`/admin/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    alert("Felhasználó sikeresen mentve.");
  }

 

  if (e.target.classList.contains("js-user-delete")) {

    const card = e.target.closest(".user-card");
    const id = card.dataset.id;

    if (!confirm("Biztosan törölni szeretnéd ezt a felhasználót?")) {
      return;
    }

    await fetch(`/admin/user/${id}`, {
      method: "DELETE"
    });

    card.remove();
  }

});



const menuSearch = document.querySelector(".js-admin-search");

if (menuSearch) {

  menuSearch.addEventListener("input", () => {

    const value = menuSearch.value.toLowerCase();

    document.querySelectorAll(".menu-card").forEach(card => {

      const name =
        card.querySelector(".js-name").value.toLowerCase();

      if (
        value === "" ||
        name.includes(value)
      ) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }

    });

  });

}



const userSearch = document.querySelector(".js-user-search");

if (userSearch) {

  userSearch.addEventListener("input", () => {

    const value = userSearch.value.toLowerCase();

    document.querySelectorAll(".user-card").forEach(card => {

      const email =
        card.querySelector(".js-user-email").value.toLowerCase();

      const firstName =
        card.querySelector(".js-user-first-name").value.toLowerCase();

      const lastName =
        card.querySelector(".js-user-last-name").value.toLowerCase();

      const role =
        card.querySelector(".js-user-role").value.toLowerCase();

      const searchText =
        `${email} ${firstName} ${lastName} ${role}`;

      if (
        value === "" ||
        searchText.includes(value)
      ) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }

    });

  });

}