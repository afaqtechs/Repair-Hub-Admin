const Styles = {
    // ─────────────────────────────────────────────
    // Inputs
    // ─────────────────────────────────────────────

    input:
        "w-full h-10 rounded-md bg-gray-100 px-3 text-sm text-gray-800 " +
        "placeholder:text-gray-400 " +
        "outline-none border-0 ring-0 " +
        "focus:outline-none focus:border-0 focus:ring-0 focus-visible:outline-none focus-visible:ring-0 " +
        "disabled:cursor-not-allowed disabled:opacity-60 " +
        "transition-colors duration-200",

    // ─────────────────────────────────────────────
    // Buttons
    // ─────────────────────────────────────────────

    button:
        "inline-flex h-9 items-center justify-center gap-1.5 " +
        "rounded-md px-3 text-sm font-medium text-gray-700 " +
        "bg-white border border-gray-200 " +
        "hover:bg-gray-50 hover:text-gray-900 " +
        "active:bg-gray-100 " +
        "focus:outline-none focus:ring-0 " +
        "transition-colors duration-200",

    // ─────────────────────────────────────────────
    // Dark badge / status
    // ─────────────────────────────────────────────

    badge:
        "inline-flex h-8 items-center gap-1.5 rounded-md px-3 " +
        "border border-gray-700 bg-gray-800 " +
        "text-xs font-medium text-gray-200 " +
        "hover:bg-gray-700 " +
        "transition-colors duration-200",

    // ─────────────────────────────────────────────
    // Primary submit button
    // ─────────────────────────────────────────────

    submitButton:
        "inline-flex h-10 items-center justify-center gap-1.5 " +
        "rounded-md px-4 text-sm font-medium text-white " +
        "bg-gray-900 border border-gray-800 " +
        "hover:bg-gray-800 " +
        "active:bg-gray-700 " +
        "focus:outline-none focus:ring-0 " +
        "disabled:cursor-not-allowed disabled:opacity-60 " +
        "transition-colors duration-200",

    // ─────────────────────────────────────────────
    // Cards
    // ─────────────────────────────────────────────

    card:
        "rounded-lg bg-white border border-gray-200 p-5 text-gray-700 " +
        "shadow-sm",

    // ─────────────────────────────────────────────
    // Generic border
    // ─────────────────────────────────────────────

    border:
        "border border-gray-200",

    // ─────────────────────────────────────────────
    // Error box
    // ─────────────────────────────────────────────

    errorBox:
        "flex items-start gap-2 rounded-md " +
        "border border-red-200 bg-red-50 px-3 py-2 " +
        "text-sm text-red-600",

    // ─────────────────────────────────────────────
    // Success box
    // ─────────────────────────────────────────────

    successBox:
        "flex items-start gap-2 rounded-md " +
        "border border-green-200 bg-green-50 px-3 py-2 " +
        "text-sm text-green-600",

    // ─────────────────────────────────────────────
    // Muted text
    // ─────────────────────────────────────────────

    mutedText:
        "text-sm text-gray-500",

    // ─────────────────────────────────────────────
    // Page section
    // ─────────────────────────────────────────────

    sectionTitle:
        "text-lg font-semibold text-gray-900",

    sectionDescription:
        "mt-1 text-sm text-gray-500",
};

export default Styles;