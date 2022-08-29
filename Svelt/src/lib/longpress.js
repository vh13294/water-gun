/**
 * @param {HTMLDivElement} node
 */
export function longPress(node, duration = 50) {
    let timer;

    const handleAction = () => {
        timer = setTimeout(repeat, duration);
    };

    const handleClear = () => {
        clearTimeout(timer)
    };

    const repeat = () => {
        node.dispatchEvent(new CustomEvent('longpress'));
        handleAction()
    }

    node.addEventListener('mousedown', handleAction);
    node.addEventListener('touchstart', handleAction);
    node.addEventListener('mouseup', handleClear);
    node.addEventListener('touchend', handleClear);

    return {
        destroy() {
            node.removeEventListener('mousedown', handleAction);
            node.removeEventListener('touchstart', handleAction);
            node.removeEventListener('mouseup', handleClear);
            node.removeEventListener('touchend', handleClear);
        }
    };
}