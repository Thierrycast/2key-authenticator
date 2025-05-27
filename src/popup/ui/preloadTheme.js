(() => {
  const tema = localStorage.getItem("preferenciaTema") || "dark";
  document.documentElement.setAttribute("data-theme", tema);
})();
