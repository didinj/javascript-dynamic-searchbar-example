const searchInput = document.getElementById("searchInput");
const itemList = document.getElementById("itemList");
const items = itemList.getElementsByTagName("li");
const noResults = document.getElementById("noResults");
const clearBtn = document.getElementById("clearBtn");

let currentFocus = -1;

searchInput.addEventListener("keyup", function() {
  clearBtn.style.display = searchInput.value ? "block" : "none";
  // Normalize input: trim spaces + lowercase
  const filter = searchInput.value.trim().toLowerCase();
  let found = false;

  for (let i = 0; i < items.length; i++) {
    const itemText = items[i].textContent.toLowerCase();

    // Check flexible matching: all words in input must exist in item text
    const terms = filter.split(/\s+/); // split by spaces
    const matches = terms.every(term => itemText.includes(term));

    if (matches && filter !== "") {
      items[i].style.display = "";
      found = true;

      // Highlight all matched terms
      let highlightedText = items[i].textContent;
      terms.forEach(term => {
        if (term) {
          const regex = new RegExp(`(${term})`, "gi");
          highlightedText = highlightedText.replace(
            regex,
            "<span class='highlight'>$1</span>"
          );
        }
      });
      items[i].innerHTML = highlightedText;
    } else if (filter === "") {
      items[i].style.display = "";
      items[i].innerHTML = items[i].textContent; // reset
    } else {
      items[i].style.display = "none";
    }
  }

  // Toggle "No results" message
  noResults.style.display = found || filter === "" ? "none" : "block";
});

clearBtn.addEventListener("click", function() {
  searchInput.value = "";
  clearBtn.style.display = "none";
  searchInput.dispatchEvent(new Event("keyup")); // reset list
  searchInput.focus();
});

searchInput.addEventListener("keydown", function(e) {
  const visibleItems = Array.from(items).filter(
    item => item.style.display !== "none"
  );

  if (e.key === "ArrowDown") {
    currentFocus = (currentFocus + 1) % visibleItems.length;
    setActive(visibleItems);
    e.preventDefault();
  } else if (e.key === "ArrowUp") {
    currentFocus =
      (currentFocus - 1 + visibleItems.length) % visibleItems.length;
    setActive(visibleItems);
    e.preventDefault();
  } else if (e.key === "Enter") {
    if (currentFocus > -1 && visibleItems[currentFocus]) {
      alert("You selected: " + visibleItems[currentFocus].textContent);
      searchInput.value = visibleItems[currentFocus].textContent;
      searchInput.dispatchEvent(new Event("keyup"));
      currentFocus = -1;
    }
    e.preventDefault();
  }
});

function setActive(list) {
  list.forEach(item => item.classList.remove("active"));
  if (currentFocus >= 0 && list[currentFocus]) {
    list[currentFocus].classList.add("active");
  }
}
