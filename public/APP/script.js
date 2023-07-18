// @ts-nocheck

/** add data to page - start */
const html_head_first = document.getElementById("html_head_first");
html_head_first.insertAdjacentHTML("afterend", html_head_first.attributes.value.value);
html_head_first.remove();
const html_head_last = document.getElementById("html_head_last");
html_head_last.insertAdjacentHTML("afterend", html_head_last.attributes.value.value);
html_head_last.remove();
const html_body_first = document.getElementById("html_body_first");
html_body_first.insertAdjacentHTML("afterend", html_body_first.attributes.value.value);
html_body_first.remove();
const html_body_last = document.getElementById("html_body_last");
html_body_last.insertAdjacentHTML("afterend", html_body_last.attributes.value.value);
html_body_last.remove();
const html_resume = document.getElementById("html_resume");
html_resume.insertAdjacentHTML("afterend", html_resume.attributes.value.value);
html_resume.remove();
/** add data to page - end */

/** listen to doc - start */
const copyItemListener = new MutationObserver(() => { listenToCopy(); });
copyItemListener.observe(document.documentElement, { childList: true, subtree: true });
/** listen to doc - end */

/** top navbar - start */
const navbarNavLink = document.querySelectorAll(".navbar-nav .nav-link");
navbarNavLink && Array.from(navbarNavLink).forEach(tag => {
    if (new RegExp("^" + tag.attributes.href.value).exec(location.pathname))
        tag.classList.add("active");
    else tag.classList.remove("active");
});
/** top navbar - end */

/** all user search - start */
const querySearch = location.search.split("&");
document.getElementById("search-template-name") &&
    document.getElementById("search-template-name").addEventListener("input",
        (e) => querySearch["template_name"] = e.currentTarget.value);
document.getElementById("search-skip") &&
    document.getElementById("search-skip").addEventListener("input",
        (e) => querySearch["skip"] = e.currentTarget.value);
document.getElementById("search-limit") &&
    document.getElementById("search-limit").addEventListener("input",
        (e) => querySearch["limit"] = e.currentTarget.value);
document.getElementById("search-sort") &&
    document.getElementById("search-sort").addEventListener("input",
        (e) => querySearch["sort"] = e.currentTarget.value);
document.getElementById("search") &&
    document.getElementById("search").addEventListener("click", (e) => {
        let finalSearchQuery = "";
        for (let i in querySearch)
            if (i === "template_name" || i === "skip" || i === "limit" || i === "sort")
                finalSearchQuery += `${i}=${querySearch[i]}&`;
        location.search = finalSearchQuery;
    });
/** all user search - end */

/** copy On Clipboard - start */
function listenToCopy() {
    Array.from(document.getElementsByClassName("copy-to-clipboard"))
        .forEach(element => element.addEventListener("click", (e) => {
            navigator.clipboard.writeText(e.currentTarget.attributes.copy.value);
        }));
}
listenToCopy();
/** copy On Clipboard - end */