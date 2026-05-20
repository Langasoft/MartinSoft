document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const inputClient = document.getElementById("input-client");
  const inputMotivo = document.getElementById("input-motivo");
  const inputDescripcion = document.getElementById("input-descripcion");
  const inputComentario = document.getElementById("input-comentario");
  const inputAcciones = document.getElementById("input-acciones");
  const inputQueCotiza = document.getElementById("input-que-cotiza");
  const selectIva = document.getElementById("select-iva");
  const selectCurrency = document.getElementById("select-currency");
  const btnAddItem = document.getElementById("btn-add-item");
  const itemsContainer = document.getElementById("items-container");
  const btnGeneratePdf = document.getElementById("btn-generate-pdf");

  // Preview Elements
  const pdfClient = document.getElementById("pdf-client");
  const pdfMotivo = document.getElementById("pdf-motivo");
  const pdfDescripcion = document.getElementById("pdf-descripcion");
  const pdfComentario = document.getElementById("pdf-comentario");
  const pdfAcciones = document.getElementById("pdf-acciones");
  const pdfQueCotiza = document.getElementById("pdf-que-cotiza");
  const pdfIvaRate = document.getElementById("pdf-iva-rate");
  const pdfCurrency = document.getElementById("pdf-currency");
  const pdfTotalValue = document.getElementById("pdf-total-value");
  const pdfItemsList = document.getElementById("pdf-items-list");
  const pdfDate = document.getElementById("pdf-date");

  // Auto-populate Date
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  pdfDate.textContent = `${day}/${month}/${year}`;

  // State
  let itemItems = [];

  // Initialize with one empty item row
  addItemRow();

  // Event Listeners for Standard Inputs
  inputClient.addEventListener("input", updatePreview);
  inputMotivo.addEventListener("input", updatePreview);
  inputDescripcion.addEventListener("input", updatePreview);
  inputComentario.addEventListener("input", updatePreview);
  inputAcciones.addEventListener("input", updatePreview);
  inputQueCotiza.addEventListener("input", updatePreview);

  selectIva.addEventListener("change", updatePreview);
  selectCurrency.addEventListener("change", updatePreview);

  btnAddItem.addEventListener("click", () => {
    addItemRow();
    updatePreview();
  });

  btnGeneratePdf.addEventListener("click", () => {
    window.print();
  });

  // Functions
  function addItemRow(initialDesc = "", initialVal = "") {
    const id =
      "item-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);

    const row = document.createElement("div");
    row.className = "job-item-row";
    row.id = id;

    const inputDesc = document.createElement("input");
    inputDesc.type = "text";
    inputDesc.placeholder = "Describa el item";
    inputDesc.value = initialDesc;
    inputDesc.required = true;
    inputDesc.style.flexGrow = "1";
    inputDesc.addEventListener("input", updatePreview);

    const inputVal = document.createElement("input");
    inputVal.type = "text";
    inputVal.placeholder = "Valor";
    inputVal.value = initialVal;
    inputVal.style.flexGrow = "0";
    inputVal.style.width = "120px";
    inputVal.addEventListener("input", updatePreview);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn-danger-icon";
    deleteBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;

    deleteBtn.addEventListener("click", () => {
      if (itemsContainer.children.length > 1) {
        row.remove();
        itemItems = itemItems.filter((item) => item.id !== id);
        updatePreview();
      } else {
        inputDesc.value = "";
        inputVal.value = "";
        updatePreview();
      }
    });

    row.appendChild(inputDesc);
    row.appendChild(inputVal);
    row.appendChild(deleteBtn);
    itemsContainer.appendChild(row);

    itemItems.push({
      id: id,
      descElement: inputDesc,
      valElement: inputVal,
    });

    if (itemsContainer.children.length > 1) {
      inputDesc.focus();
    }
  }

  function updatePreview() {
    // Update client
    pdfClient.textContent = inputClient.value.trim() || "";

    // Update motivo
    pdfMotivo.textContent = inputMotivo.value.trim() || "";

    // Update descripcion
    pdfDescripcion.textContent = inputDescripcion.value.trim() || "";

    // Update comentario
    const comentarioText = inputComentario.value.trim();
    pdfComentario.textContent = comentarioText || "";

    // Update acciones
    const accionesText = inputAcciones.value.trim();
    pdfAcciones.textContent = accionesText || "";

    // Update que cotiza
    pdfQueCotiza.textContent = inputQueCotiza.value.trim() || "";

    // Update currency
    const currency = selectCurrency.value;
    pdfCurrency.textContent = currency;

    // Update IVA
    pdfIvaRate.textContent = selectIva.value;

    // Update items list and calculate total
    pdfItemsList.innerHTML = "";
    let totalValue = 0;
    let hasItems = false;

    itemItems.forEach((item) => {
      const desc = item.descElement.value.trim();
      const valText = item.valElement.value.trim();
      const valNum = parseFloat(valText.replace(",", "."));

      if (desc) {
        hasItems = true;
        const itemDiv = document.createElement("div");
        itemDiv.className = "pdf-item-row";
        
        const itemLabel = document.createElement("span");
        itemLabel.className = "pdf-item-label";
        itemLabel.textContent = desc;
        
        const itemDots = document.createElement("span");
        itemDots.className = "pdf-item-dots";
        
        const itemAmount = document.createElement("span");
        itemAmount.className = "pdf-item-amount";
        itemAmount.textContent = valText ? `${currency} ${valText}` : "";
        
        itemDiv.appendChild(itemLabel);
        itemDiv.appendChild(itemDots);
        itemDiv.appendChild(itemAmount);
        pdfItemsList.appendChild(itemDiv);

        if (!isNaN(valNum)) {
          totalValue += valNum;
        }
      }
    });

    // Update total
    pdfTotalValue.textContent = totalValue.toString();

    if (!hasItems) {
      pdfItemsList.innerHTML = "";
    }
  }

  updatePreview();
});
