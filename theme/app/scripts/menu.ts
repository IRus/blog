export function menu() {
    const baseUrl = `${document.location.protocol}//${document.location.host}`;
    const path = document.location.pathname;
    const links = document.querySelectorAll("a.navbar-item, a.navbar-link");
    links.forEach((element: HTMLLinkElement) => {
        const linkPath = element.href.replace(baseUrl, "");

        if (linkPath === path) {
            element.classList.add("is-active");
        }

        if (linkPath === "/categories/" && path.startsWith("/categories/")) {
            element.classList.add("is-active");
        }
    });
}
