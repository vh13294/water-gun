export function longPress(node: HTMLDivElement, duration = 50) {
  let timer: NodeJS.Timeout;

  const handleAction = () => {
    timer = setTimeout(repeat, duration);
  };

  const handleClear = () => {
    clearTimeout(timer);
  };

  const repeat = () => {
    node.dispatchEvent(new CustomEvent("longpress"));
    handleAction();
  };

  node.addEventListener("mousedown", handleAction);
  node.addEventListener("touchstart", handleAction, { passive: true });
  node.addEventListener("mouseup", handleClear);
  node.addEventListener("touchend", handleClear, { passive: true });

  return {
    destroy() {
      node.removeEventListener("mousedown", handleAction);
      node.removeEventListener("touchstart", handleAction);
      node.removeEventListener("mouseup", handleClear);
      node.removeEventListener("touchend", handleClear);
    },
  };
}
