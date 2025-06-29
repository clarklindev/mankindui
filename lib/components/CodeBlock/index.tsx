import React, { useState } from 'react';
import { Button } from '../Button';
import { ClipboardIcon, ClipboardCheckIcon } from '../../icons';
import { useTheme } from '../../context/';
import { Icon } from '../Icon';
import ReactDOMServer from 'react-dom/server';

interface CodeBlockProps {
    readOnly?: boolean;
    editable?: boolean;
    children?: string | React.ReactNode | undefined;
    showClipboardIcon?: boolean;
    darkIcon?: string;
    lightIcon?: string;
}

const CodeBlock = ({ children, showClipboardIcon = true, darkIcon = 'black', lightIcon = 'white' }: CodeBlockProps) => {
    const [hasCopied, setHasCopied] = useState(false);
    const { colorScheme } = useTheme();

    const showCopiedIconThenReset = () => {
        setHasCopied(true);

        const delay = setTimeout(() => {
            setHasCopied(false);
        }, 2000);

        // No need for clearInterval since we are using setTimeout
        return () => {
            clearTimeout(delay);
        };
    };

    const handleClick = async () => {
        let textToCopy = '';

        // Check if children is a string
        if (typeof children === 'string') {
            textToCopy = children;
        } else if (React.isValidElement(children)) {
            // If children is a React element, we can render it to static HTML
            const htmlContent = ReactDOMServer.renderToStaticMarkup(children);

            // Parse the HTML and extract text content (removes all HTML tags)
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            textToCopy = doc.body.textContent || '';
        }

        // Use the Clipboard API to copy the text
        if (textToCopy) {
            try {
                await navigator.clipboard.writeText(textToCopy);
                showCopiedIconThenReset();
                console.log('Content copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    };

    return (
        <div className="w-full min-h-10 flex items-center relative">
            <Button intent="icon" className="absolute top-0 right-0 p-2" onClick={handleClick}>
                <Icon size="M">
                    {hasCopied ? (
                        <ClipboardCheckIcon stroke={colorScheme === 'dark' ? lightIcon : darkIcon} />
                    ) : (
                        showClipboardIcon && <ClipboardIcon stroke={colorScheme === 'dark' ? lightIcon : darkIcon} />
                    )}
                </Icon>
            </Button>
            {children}
        </div>
    );
};

export { CodeBlock };
