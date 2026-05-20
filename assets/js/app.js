document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const inputClient = document.getElementById("input-client");
  const inputTitle = document.getElementById("input-title");
  const inputComment = document.getElementById("input-comment");
  const inputValue = document.getElementById("input-value");
  const selectIva = document.getElementById("select-iva");
  const selectCurrency = document.getElementById("select-currency");
  const btnAddJob = document.getElementById("btn-add-job");
  const jobsContainer = document.getElementById("jobs-container");
  const btnGeneratePdf = document.getElementById("btn-generate-pdf");

  // Preview Elements
  const pdfClient = document.getElementById("pdf-client");
  const pdfTitle = document.getElementById("pdf-title");
  const pdfComment = document.getElementById("pdf-comment");
  const pdfCommentContainer = document.getElementById("pdf-comment-container");
  const pdfValueBase = document.getElementById("pdf-value-base");
  const pdfIvaRate = document.getElementById("pdf-iva-rate");
  const pdfCurrency = document.getElementById("pdf-currency");
  const pdfJobsList = document.getElementById("pdf-jobs-list");
  const pdfDate = document.getElementById("pdf-date");

  // Auto-populate Date
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  pdfDate.textContent = `${day}/${month}/${year}`;

  // State
  let jobItems = [];

  // Initialize with one empty job row
  addJobRow();

  // Event Listeners for Standard Inputs
  inputClient.addEventListener("input", updatePreview);
  inputTitle.addEventListener("input", updatePreview);
  inputComment.addEventListener("input", updatePreview);
  inputValue.addEventListener("input", updatePreview);

  selectIva.addEventListener("change", updatePreview);
  selectCurrency.addEventListener("change", updatePreview);

  btnAddJob.addEventListener("click", () => {
    addJobRow();
    updatePreview();
  });

  btnGeneratePdf.addEventListener("click", () => {
    window.print();
  });

  // Functions
  function addJobRow(initialValue = "") {
    const id =
      "job-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);

    const row = document.createElement("div");
    row.className = "job-item-row";
    row.id = id;

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Describa el trabajo a realizar";
    input.value = initialValue;
    input.required = true;
    input.addEventListener("input", updatePreview);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn-danger-icon";
    deleteBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;

    deleteBtn.addEventListener("click", () => {
      if (jobsContainer.children.length > 1) {
        row.remove();
        jobItems = jobItems.filter((item) => item.id !== id);
        updatePreview();
      } else {
        input.value = "";
        updatePreview();
      }
    });

    row.appendChild(input);
    row.appendChild(deleteBtn);
    jobsContainer.appendChild(row);

    jobItems.push({
      id: id,
      inputElement: input,
    });

    if (jobsContainer.children.length > 1) {
      input.focus();
    }
  }

  function updatePreview() {
    // Update client
    pdfClient.textContent = inputClient.value.trim() || "";

    // Update title
    pdfTitle.textContent = inputTitle.value.trim() || "";

    // Update comments
    const commentText = inputComment.value.trim();
    pdfComment.textContent = commentText || "";

    // Update value
    const valText = inputValue.value.trim();
    pdfValueBase.textContent = valText || "";

    // Update IVA
    pdfIvaRate.textContent = selectIva.value;

    // Update currency
    pdfCurrency.textContent = selectCurrency.value;

    // Update jobs list
    pdfJobsList.innerHTML = "";
    let hasJobs = false;

    jobItems.forEach((item) => {
      const text = item.inputElement.value.trim();
      if (text) {
        hasJobs = true;
        const li = document.createElement("li");
        li.textContent = text;
        pdfJobsList.appendChild(li);
      }
    });

    if (!hasJobs) {
      pdfJobsList.innerHTML = "";
    }
  }

  updatePreview();
});
