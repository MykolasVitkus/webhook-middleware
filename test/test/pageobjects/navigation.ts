class Navigation {
    get navigationItemPrefix(): string {
        return 'nav';
    }

    async openThroughNav(page: string): Promise<void> {
        const navButton = await $(
            `[data-test=${this.navigationItemPrefix}${page}]`,
        );
        await navButton.click();
    }
}

export default new Navigation();
