document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".srch");
    const searchBtn = document.querySelector(".btn");

    if (searchBtn && searchInput) {
        
        // Function to remove previous highlights
        function removeHighlights() {
            const highlights = document.querySelectorAll(".search-highlight");
            highlights.forEach(span => {
                const parent = span.parentNode;
                parent.replaceChild(document.createTextNode(span.textContent), span);
                parent.normalize();
            });
        }

        // Function to highlight search query in the page body
        function highlightText(text) {
            removeHighlights();
            if (!text) return;

            const body = document.body;
            const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            let nodesToModify = [];

            while (node = walker.nextNode()) {
                // Ignore script, style, and input elements
                if (node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE' || node.parentNode.tagName === 'INPUT') {
                    continue;
                }
                if (node.nodeValue.toLowerCase().includes(text.toLowerCase())) {
                    nodesToModify.push(node);
                }
            }

            nodesToModify.forEach(n => {
                const val = n.nodeValue;
                const regex = new RegExp(`(${text})`, 'gi');
                const span = document.createElement('span');
                span.innerHTML = val.replace(regex, '<mark class="search-highlight" style="background-color: yellow; color: black; font-weight: bold;">$1</mark>');
                n.parentNode.replaceChild(span, n);
            });

            // Scroll to the first highlighted match if available
            const firstMatch = document.querySelector('.search-highlight');
            if (firstMatch) {
                firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                alert("Keine Ergebnisse gefunden für: " + text);
            }
        }

        // Trigger search on button click
        searchBtn.addEventListener("click", function (e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            if (query !== "") {
                highlightText(query);
            } else {
                removeHighlights();
                alert("Bitte geben Sie einen Suchbegriff ein!");
            }
        });

        // Trigger search on Enter key press
        searchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                searchBtn.click();
            }
        });

        // Clear highlights automatically if input is cleared manually
        searchInput.addEventListener("input", function () {
            if (searchInput.value.trim() === "") {
                removeHighlights();
            }
        });
    }
});