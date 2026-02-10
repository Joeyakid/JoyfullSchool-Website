export default function Footer() {
    return (
        <footer className="bg-surface border-t border-border-soft py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <p className="text-text-muted text-sm text-center">
                    &copy; {new Date().getFullYear()} Academic Portal. All rights reserved.
                </p>
                <p className="text-text-muted text-xs mt-2 text-center">
                    Designed for efficiency and clarity.
                </p>
            </div>
        </footer>
    );
}
