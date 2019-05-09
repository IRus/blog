// TODO: Consider react
//   Save state in hash
export function tabs(selector: string) {
    // Get all "navbar-burger" elements
    const $tabLinks = Array.prototype.slice.call(document.querySelectorAll(`${selector}.tabs li a`), 0);

    let $current: HTMLElement = null;

    // Add a click event on each of them
    $tabLinks.map((el: HTMLElement) => {
        if ($current == null) {
            $current = el;
        }

        const tab = el.dataset.tab;
        const $tab = document.querySelector(tab);

        $tab.classList.toggle("is-hidden");

        el.addEventListener("click", () => {
            const target = el.dataset.tab;
            const $target = document.querySelector(target);
            $target.classList.toggle("is-hidden");
            el.parentElement.classList.toggle("is-active");

            $current.parentElement.classList.toggle("is-active");
            const oldTab = $current.dataset.tab;
            const $oldTab = document.querySelector(oldTab);
            $oldTab.classList.toggle("is-hidden");
            $current = el;
        });

        return tab;
    });
}
