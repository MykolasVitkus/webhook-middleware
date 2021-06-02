import LoginPage from '../pageobjects/login.page';
import PublishersPage from '../pageobjects/publishers.page';
import Navigation from '../pageobjects/navigation';
import LoginHelper from '../utils/login.helper';

describe('Publishers', () => {
    it('open Publishers page', async () => {
        await LoginPage.open();
        await LoginHelper.login('username', 'password');
        await Navigation.openThroughNav('Publishers');
        await PublishersPage.waitPageDisplayed();
        await expect(PublishersPage.pageTitle).toHaveText('Publishers', {
            wait: 100,
        });
    });

    describe('create a publisher', () => {
        it('open publisher create page', async () => {
            await PublishersPage.clickNewButton();
            await PublishersPage.waitCreatePageDisplayed();
            await expect(
                PublishersPage.createPageTitle,
            ).toHaveText('Add Publisher', { wait: 100 });
        });

        it('submit with no name', async () => {
            await (await PublishersPage.createPublisherSubmitButton).click();
            await expect(PublishersPage.createPublisherNameError).toHaveText(
                'This value cannot be empty.',
            );
        });

        it('enter name and submit', async () => {
            await PublishersPage.createPublisher('Test Publisher');
            await PublishersPage.waitPageDisplayed();
            await expect(PublishersPage.pageTitle).toHaveText('Publishers', {
                wait: 100,
            });
            await expect(PublishersPage.lastPublisherName).toHaveText(
                'Test Publisher',
            );
        });
    });

    describe('edit a publisher', () => {
        it('open publisher edit page', async () => {
            await (await PublishersPage.lastPublisherEdit).click();
            await PublishersPage.waitEditPageDisplayed();
            await expect(
                PublishersPage.editPageTitle,
            ).toHaveText('Edit Publisher', { wait: 100 });
        });

        // it('clear and submit', async () => {
        //     await (await PublishersPage.editPublisherName).clearValue();
        //     const value = await (
        //         await PublishersPage.editPublisherName
        //     ).getValue();
        //     console.log('value', value);
        //     await browser.pause(1000);
        //     await (await PublishersPage.editPublisherSubmitButton).click();
        //     await browser.pause(10000);
        //     await expect(PublishersPage.editPublisherNameError).toHaveText(
        //         'This value cannot be empty.',
        //     );
        // });

        it('enter new name and submit', async () => {
            await (await PublishersPage.editPublisherName).addValue(' Edited');
            await (await PublishersPage.editPublisherSubmitButton).click();
            await PublishersPage.waitPageDisplayed();
            await expect(PublishersPage.pageTitle).toHaveText('Publishers', {
                wait: 100,
            });
            await expect(PublishersPage.lastPublisherName).toHaveText(
                'Test Publisher Edited',
            );
        });
    });

    describe('delete a publisher', () => {
        it('deny confirmation dialog', async () => {
            const url = await (await PublishersPage.lastPublisherUrl).getHTML(
                false,
            );
            await (await PublishersPage.lastPublisherDelete).click();
            await (
                await PublishersPage.deletePublisherModalTitle
            ).waitForDisplayed();
            await expect(PublishersPage.deletePublisherModalTitle).toHaveText(
                'Delete Publisher',
            );
            await (await PublishersPage.deletePublisherModalDeny).click();
            const newUrl = await (
                await PublishersPage.lastPublisherUrl
            ).getHTML(false);
            expect(url).toEqual(newUrl);
        });

        it('confirm confirmation dialog', async () => {
            const url = await (await PublishersPage.lastPublisherUrl).getHTML(
                false,
            );
            await (await PublishersPage.lastPublisherDelete).click();
            await (
                await PublishersPage.deletePublisherModalTitle
            ).waitForDisplayed();
            await expect(PublishersPage.deletePublisherModalTitle).toHaveText(
                'Delete Publisher',
            );
            await (await PublishersPage.deletePublisherModalConfirm).click();
            const newUrl = await (
                await PublishersPage.lastPublisherUrl
            ).getHTML(false);
            expect(url).not.toEqual(newUrl);
        });
    });
});
