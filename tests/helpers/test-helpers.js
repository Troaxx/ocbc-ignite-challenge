// Helper functions for tests

export async function loginAsAdmin(page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'eladtester@test.test');
  await page.fill('input[type="password"]', 'elad12345678');
  await page.click('button[type="submit"]');
  await page.waitForURL('/');
}

export async function resetDatabase(page) {
  await page.evaluate(() => {
    localStorage.clear();
    if (window.dataService) {
      window.dataService.resetDatabase();
    }
  });
}

export async function createTestClient(page, clientData = {}) {
  const timestamp = Date.now();
  const defaultClient = {
    id: `TEST${timestamp}`,
    name: 'Test Client',
    age: '30',
    city: 'Test City',
    phone: '123-456-7890',
    cash: '1000',
    credit: '500',
    ...clientData
  };

  await page.goto('/addClient');
  
  for (const [field, value] of Object.entries(defaultClient)) {
    await page.fill(`input[name="${field}"]`, value.toString());
  }
  
  await page.click('button[type="submit"]');
  await page.waitForURL('/clientManage');
  
  return defaultClient;
}

export async function getClientCashAmount(page, clientCardLocator) {
  const cashText = await clientCardLocator.locator('text=Cash:').textContent();
  return parseFloat(cashText.match(/[\d.]+/)[0]);
}

export async function getClientCreditAmount(page, clientCardLocator) {
  const creditText = await clientCardLocator.locator('text=Credit:').textContent();
  return parseFloat(creditText.match(/[\d.]+/)[0]);
}

export async function openTransactionModal(page, buttonText) {
  await page.waitForSelector('.ClientActionCard');
  await page.click(`button:has-text("${buttonText}")`);
  await page.waitForSelector('.modal-overlay');
}

export async function performDeposit(page, amount) {
  await openTransactionModal(page, 'Deposit');
  await page.fill('input[type="number"]', amount.toString());
  await page.click('button:has-text("Deposit Amount")');
  await page.waitForTimeout(1000);
}

export async function performWithdraw(page, amount) {
  await openTransactionModal(page, 'Withdraw');
  await page.fill('input[type="number"]', amount.toString());
  await page.click('button:has-text("Draw Amount")');
  await page.waitForTimeout(1000);
}

export async function performTransfer(page, amount, targetIndex = 1) {
  await openTransactionModal(page, 'Transfer');
  await page.selectOption('select', { index: targetIndex });
  await page.fill('input[type="number"]', amount.toString());
  await page.click('button:has-text("Transfer Amount")');
  await page.waitForTimeout(1000);
}

export async function getDatabaseState(page) {
  return await page.evaluate(() => {
    const data = localStorage.getItem('ocbc_clients_database');
    return data ? JSON.parse(data) : null;
  });
}

export async function searchClientById(page, clientId) {
  await page.fill('input[placeholder*="Search"]', clientId);
  await page.waitForTimeout(500);
}

