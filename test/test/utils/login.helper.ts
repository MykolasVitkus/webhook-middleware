import LoginPage from '../pageobjects/login.page';
import DashboardPage from '../pageobjects/dashboard.page';

class LoginHelper {
    static async login(username: string, password: string): Promise<void> {
        await LoginPage.open();
        await LoginPage.login(username, password);
        await expect(DashboardPage.statisticsContainer).toBeDisplayed();
    }
}

export default LoginHelper;
