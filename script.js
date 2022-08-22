const commands = [];
const search = document.querySelector("#search");
const btnSearch = document.querySelector(".btn-search");

getCommands();

function getCommands() {
    fetch("./commands.json")
        .then((res) => res.json())
        .then((data) => {
            commands.push(...data);
            commands.sort((a, b) => {
                if (a.command < b.command) {
                    return -1;
                }

                if (a.command > b.command) {
                    return 1;
                }

                return 0;
            });

            renderCommands(commands);
        });
}

function renderCommands(data) {
    const output = document.querySelector("#commands-list");
    output.innerText = "";

    data.forEach((command) => {
        const container = document.createElement("li");
        const header = document.createElement("header");

        const commandTitle = document.createElement("h2");
        commandTitle.innerText = command.command;
        const commandMeaning = document.createElement("small");
        commandMeaning.innerText = command.meaning;

        const code = document.createElement("code");
        code.classList.add("main-code");
        code.innerText = command.code;

        const description = document.createElement("p");
        description.innerText = command.description;

        const wrapper = document.createElement("section");

        const exampleTitle = document.createElement("h3");

        if (command.examples.length > 1) {
            exampleTitle.innerText = "Beispiele:";
        } else {
            exampleTitle.innerText = "Beispiel:";
        }

        wrapper.append(exampleTitle);

        command.examples.forEach((example) => {
            const exampleWrapper = document.createElement("div");
            exampleWrapper.classList.add("example-wrapper");

            const exampleCode = document.createElement("code");
            exampleCode.innerText = example.code;

            const exampleDescription = document.createElement("p");
            exampleDescription.innerText = example.description;

            exampleWrapper.append(exampleCode, exampleDescription);

            wrapper.append(exampleWrapper);
        });

        const spacer = document.createElement("div");
        spacer.classList.add("spacer");

        header.append(commandTitle, commandMeaning);
        container.append(header, code, description, wrapper);
        output.append(container, spacer);
    });

    setIndividualHeights();
}

window.addEventListener("resize", setIndividualHeights);

function setIndividualHeights() {
    const list = document.querySelector("#commands-list");
    const children = list.children;

    for (let child of children) {
        const height = child.offsetHeight;
        child.style.setProperty("--rows", Math.floor(height));
    }
}

btnSearch.addEventListener("click", filterCommands);
search.addEventListener("input", filterCommands);

function filterCommands(e) {
    let searchTerm;

    if (e.target.value) {
        searchTerm = new RegExp("\\b" + e.target.value.trim(), "i");
    } else {
        searchTerm = new RegExp("\\b" + search.value.trim(), "i");
    }

    const searchResults = commands.filter((command) => searchTerm.test([...command.tags]));

    renderCommands(searchResults);
}
