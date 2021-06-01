import Page from './page';

class PublishersPage extends Page {
    get pageTitle() {
        return $('[data-test="publishersTitle"]');
    }

    async waitPageDisplayed() {
        (await this.pageTitle).waitForDisplayed();
    }
}

export default new PublishersPage();
