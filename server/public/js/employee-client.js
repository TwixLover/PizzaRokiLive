  console.log("Employee panel loaded");
  const socket = io();
  const container = document.getElementById("orders-container");


  document.addEventListener("change", async (e) => {
    if (!e.target.classList.contains("status-select")) return;

    const id = e.target.dataset.id;
    const status = e.target.value;

    await fetch(`/employee/${id}/status`, {
      method: "PUT",
        credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
  });

  socket.on("new-order", (order) => {

    const wrapper = document.createElement("div");
    wrapper.className = "col-md-6 col-lg-4 order-wrapper";
    wrapper.dataset.id = order.id;

    wrapper.innerHTML = `
      <div class="order-card">
        <div>
          <strong>${order.delivery_first_name} ${order.delivery_last_name}</strong>
          <div class="small text-secondary" style="display:flex; flex-direction:column;">
            ${order.delivery_street} ${order.delivery_house_number},
            <br>
            ${order.delivery_phone}
          </div>
        </div>
        <hr>
        <div class="items-container">
          ${order.items.map(item => `
            <div class="item-box">
              <strong>${item.quantity}x ${item.name || "Custom Pizza"}</strong>
              ${item.size ? `<div class="small text-muted">Size: ${item.size} cm</div>` : ""}
              ${item.toppings?.length ? `<div class="small text-warning">${item.toppings.join(", ")}</div>` : ""}
            </div>
          `).join("")}
        </div>
        <div class="total">
          Total: ${order.total_amount} RSD
        </div>
        <select class="form-select status-select" data-id="${order.id}">
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="ready">Ready</option>
          <option value="driver_on_the_way">Driver on the way</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
    `;

    container.prepend(wrapper);
  });


  socket.on("order-delivered", (data) => {
    const el = document.querySelector(`[data-id="${data.id}"]`);
    if (el) el.remove();
  });
