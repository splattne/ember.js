export default function firstChildElement(element) {
  let child = element.firstChild;

  while (child && child.nodeType !== 1) {
    child = child.nextSibling;
  }

  if (!child) {
    throw new Error(`First child of <${element.tagName.toLowerCase()}> not found`);
  }

  return child;
}
