const importTvTimeBtn =
  document.getElementById("importTvTimeBtn");

const tvtimeImport =
  document.getElementById("tvtimeImport");

importTvTimeBtn?.addEventListener("click", () => {
  tvtimeImport.click();
});

tvtimeImport?.addEventListener("change", async (e) => {

  const file = e.target.files[0];

  if (!file) return;

  const zip = await JSZip.loadAsync(file);

  const files = Object.keys(zip.files);

  console.log(files);

});
