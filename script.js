const lang = navigator.language.slice(0, 2);

const supported = ["fr", "en", "es", "pt", "de", "it"];

if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
  if (supported.includes(lang)) {
    window.location.href = `/${lang}.html`;
  } else {
    window.location.href = "/en.html";
  }
}
