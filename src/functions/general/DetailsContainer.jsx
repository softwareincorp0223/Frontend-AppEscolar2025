import { useEffect, useRef } from "react";

export default function DetailsContainer({ visible, children, top = 150 }) {
    const ref = useRef(null);

    useEffect(() => {
        if (visible) {
            ref.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        } else {
            window.scrollTo({
                top: top,
                behavior: "smooth",
            });
        }
    }, [visible, top]);

    if (!visible) return null;

    return (
        <div ref={ref}>
            {children}
        </div>
    );
}