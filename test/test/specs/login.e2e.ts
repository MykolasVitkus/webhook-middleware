import LoginPage from '../pageobjects/login.page';
import DashboardPage from '../pageobjects/dashboard.page';

describe('Login', () => {
    it('should login with valid credentials', async () => {
        await LoginPage.open();

        await LoginPage.login('username', 'password');
        await expect(DashboardPage.statisticsContainer).toBeDisplayed();
    });
});
