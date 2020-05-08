//the createAutocomplete function accepts an object as parameter which we're destructuring
const createAutocomplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  //everything within our dropdown search results (ROOT)
  root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input"/>
        <div class="dropdown">
            <div class="dropdown-menu"> 
                <div class="dropdown-content results"></div>
            </div>
        </div>
  `;

  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  const onInput = async (event) => {
    //we get our search results list from here
    const searchResultsList = await fetchData(event.target.value.trim());

    //If there are no search results, we need to close the dropdown
    if (!searchResultsList.length) {
      dropdown.classList.remove("is-active");

      //The return statement prevents the rest of the code from running
      return;
    }

    // Clear out results before the next search
    resultsWrapper.innerHTML = "";

    dropdown.classList.add("is-active");
    for (let item of searchResultsList) {
      const option = document.createElement("a");

      option.classList.add("dropdown-item");

      //Creating the innerHTML for each HTML
      option.innerHTML = renderOption(item);

      option.addEventListener("click", (event) => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);

        onOptionSelect(item);
      });

      resultsWrapper.appendChild(option);
    }
  };

  input.addEventListener("input", debounce(onInput, 500));

  //Clearing the dropdown if anywhere else is clicked. So we say if the event target is not one of the elements in the root, we should do something
  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
