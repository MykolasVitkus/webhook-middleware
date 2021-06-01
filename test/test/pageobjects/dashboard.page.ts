import Page from './page';

/**
 * Dashboard page
 */
class DashboardPage extends Page {
    get statisticsContainer() {
        return $('[data-test="statisticsContainer"]');
    }
}

export default new DashboardPage();
