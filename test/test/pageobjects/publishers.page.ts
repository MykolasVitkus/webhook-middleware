import Page from './page';

class PublishersPage extends Page {
    get pageTitle() {
        return $('[data-test="publishersTitle"]');
    }

    get newButton() {
        return $('[data-test="publishersNew"]');
    }

    get createPageTitle() {
        return $('[data-test="createPublishersTitle"]');
    }

    get createPublisherName() {
        return $('[data-test="createPublisherName"]');
    }

    get createPublisherNameError() {
        return $('[data-test="createPublisherNameError"]');
    }

    get createPublisherSubmitButton() {
        return $('[data-test="createPublisherSubmit"]');
    }

    get editPageTitle() {
        return $('[data-test="editPublishersTitle"]');
    }

    get editPublisherName() {
        return $('[data-test="editPublisherName"]');
    }

    get editPublisherNameError() {
        return $('[data-test="editPublisherNameError"]');
    }

    get editPublisherSubmitButton() {
        return $('[data-test="editPublisherSubmit"]');
    }

    get lastPublisherName() {
        return $('[data-test="lastPublisherName"]');
    }

    get lastPublisherUrl() {
        return $('[data-test="lastPublisherUrl"]');
    }

    get lastPublisherEdit() {
        return $('[data-test="lastPublisherEdit"]');
    }

    get lastPublisherDelete() {
        return $('[data-test="lastPublisherDelete"]');
    }

    get deletePublisherModalTitle() {
        return $('[data-test="deletePublisherModalTitle"]');
    }

    get deletePublisherModalDeny() {
        return $('[data-test="deletePublisherModalDeny"]');
    }

    get deletePublisherModalConfirm() {
        return $('[data-test="deletePublisherModalConfirm"]');
    }

    async waitPageDisplayed() {
        (await this.pageTitle).waitForDisplayed();
    }

    async clickNewButton() {
        (await this.newButton).click();
    }

    async waitCreatePageDisplayed() {
        (await this.createPageTitle).waitForDisplayed();
    }

    async waitEditPageDisplayed() {
        (await this.editPageTitle).waitForDisplayed();
    }

    async createPublisher(name: string) {
        await (await this.createPublisherName).setValue(name);
        await (await this.createPublisherSubmitButton).click();
    }
}

export default new PublishersPage();
