export function longPress(node, duration = 50) {
    let timer;

    const handleMousedown = () => {
        console.log("mousedown")
        timer = setTimeout(repeat, duration);
    };

    const handleClear = () => {
        clearTimeout(timer)
    };

    const repeat = () => {
        node.dispatchEvent(new CustomEvent('longpress'));
        handleMousedown()
    }

    node.addEventListener('mousedown', handleMousedown);
    node.addEventListener('mouseup', handleClear);

    return {
        destroy() {
            node.removeEventListener('mousedown', handleMousedown);
            node.removeEventListener('mouseup', handleClear);
        }
    };
}