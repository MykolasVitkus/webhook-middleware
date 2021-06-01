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
});
