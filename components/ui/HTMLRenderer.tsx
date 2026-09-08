"use client";

import parse from "html-react-parser";

interface HTMLRendererProps {
    html?: string | null;
    className?: string;
}

const HTMLRenderer = ({
    html,
    className = "",
}: HTMLRendererProps) => {
    if (!html) {
        return (
            <p className={`text-sm text-gray-400 ${className}`}>
                No content available
            </p>
        );
    }

    return (
        <div
            className={`
                text-sm
                leading-7
                text-gray-600
                [&_p]:mb-3
                [&_h1]:mb-4
                [&_h1]:text-2xl
                [&_h1]:font-bold
                [&_h2]:mb-3
                [&_h2]:text-xl
                [&_h2]:font-bold
                [&_h3]:mb-2
                [&_h3]:text-lg
                [&_h3]:font-semibold
                [&_strong]:font-semibold
                [&_ul]:mb-3
                [&_ul]:ml-5
                [&_ul]:list-disc
                [&_ol]:mb-3
                [&_ol]:ml-5
                [&_ol]:list-decimal
                [&_li]:mb-1
                [&_a]:text-primary
                [&_a]:underline
                [&_blockquote]:my-4
                [&_blockquote]:border-l-4
                [&_blockquote]:border-gray-200
                [&_blockquote]:pl-4
                ${className}
            `}
        >
            {parse(html)}
        </div>
    );
};

export default HTMLRenderer;