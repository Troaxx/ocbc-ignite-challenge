/**
 * Selenium Tests for Legacy Browser Compatibility
 * Focus: Critical Path Testing (P0 Tests)
 * Browsers: IE11, Older Chrome/Firefox versions
 */

import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import firefox from 'selenium-webdriver/firefox.js';

const BASE_URL = 'http://localhost:5173';
const TIMEOUT = 10000;

class SeleniumTestRunner {
  constructor(browserName = 'chrome') {
    this.browserName = browserName;
    this.driver = null;
    this.results = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  async setup() {
    console.log(`\n🔧 Setting up ${this.browserName} driver...`);
    
    const options = this.browserName === 'chrome' 
      ? new chrome.Options()
      : new firefox.Options();
    
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--no-sandbox');
    
    this.driver = await new Builder()
      .forBrowser(this.browserName)
      .setChromeOptions(this.browserName === 'chrome' ? options : undefined)
      .setFirefoxOptions(this.browserName === 'firefox' ? options : undefined)
      .build();
    
    await this.driver.manage().setTimeouts({ implicit: TIMEOUT });
    console.log('✅ Driver setup complete');
  }

  async teardown() {
    if (this.driver) {
      await this.driver.quit();
      console.log('🧹 Driver closed');
    }
  }

  async test(name, testFn) {
    try {
      console.log(`\n▶️  Running: ${name}`);
      await testFn();
      this.results.passed++;
      console.log(`✅ PASSED: ${name}`);
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({ test: name, error: error.message });
      console.log(`❌ FAILED: ${name}`);
      console.log(`   Error: ${error.message}`);
    }
  }

  async waitAndFindElement(by, timeout = TIMEOUT) {
    return await this.driver.wait(until.elementLocated(by), timeout);
  }

  async clearLocalStorage() {
    await this.driver.executeScript('localStorage.clear();');
  }

  printResults() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Total: ${this.results.passed + this.results.failed}`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.errors.forEach(({ test, error }) => {
        console.log(`   - ${test}: ${error}`);
      });
    }
    console.log('='.repeat(50) + '\n');
  }
}

async function runCriticalPathTests(browser = 'chrome') {
  const runner = new SeleniumTestRunner(browser);
  
  try {
    await runner.setup();

    // TC-001: Valid Login
    await runner.test('TC-001: Valid login with credentials', async () => {
      await runner.clearLocalStorage();
      await runner.driver.get(`${BASE_URL}/login`);
      
      const emailInput = await runner.waitAndFindElement(By.css('input[type="email"]'));
      const passwordInput = await runner.driver.findElement(By.css('input[type="password"]'));
      const submitButton = await runner.driver.findElement(By.css('button[type="submit"]'));
      
      await emailInput.sendKeys('eladtester@test.test');
      await passwordInput.sendKeys('elad12345678');
      await submitButton.click();
      
      await runner.driver.wait(until.urlIs(`${BASE_URL}/`), TIMEOUT);
      
      const heading = await runner.waitAndFindElement(By.css('h1'));
      const text = await heading.getText();
      if (!text.includes('Welcome')) {
        throw new Error('Login failed - Welcome message not found');
      }
    });

    // TC-005: Protected Routes
    await runner.test('TC-005: Protected route redirects to login', async () => {
      await runner.clearLocalStorage();
      await runner.driver.get(`${BASE_URL}/clientManage`);
      
      await runner.driver.wait(until.urlIs(`${BASE_URL}/login`), TIMEOUT);
    });

    // TC-013: Load Clients
    await runner.test('TC-013: Load and display clients', async () => {
      await runner.driver.get(`${BASE_URL}/login`);
      
      const emailInput = await runner.driver.findElement(By.css('input[type="email"]'));
      const passwordInput = await runner.driver.findElement(By.css('input[type="password"]'));
      await emailInput.sendKeys('eladtester@test.test');
      await passwordInput.sendKeys('elad12345678');
      await runner.driver.findElement(By.css('button[type="submit"]')).click();
      
      await runner.driver.wait(until.urlIs(`${BASE_URL}/`), TIMEOUT);
      
      await runner.driver.get(`${BASE_URL}/clientManage`);
      
      const clientCards = await runner.driver.wait(
        until.elementsLocated(By.css('.client-card')),
        TIMEOUT
      );
      
      if (clientCards.length === 0) {
        throw new Error('No client cards found');
      }
    });

    // TC-026: Add New Client
    await runner.test('TC-026: Add new client successfully', async () => {
      await runner.driver.get(`${BASE_URL}/addClient`);
      
      const timestamp = Date.now();
      const testId = `SEL${timestamp}`;
      
      await runner.driver.findElement(By.css('input[name="id"]')).sendKeys(testId);
      await runner.driver.findElement(By.css('input[name="name"]')).sendKeys('Selenium Test');
      await runner.driver.findElement(By.css('input[name="age"]')).sendKeys('30');
      await runner.driver.findElement(By.css('input[name="city"]')).sendKeys('Test City');
      await runner.driver.findElement(By.css('input[name="phone"]')).sendKeys('111-222-3333');
      await runner.driver.findElement(By.css('input[name="cash"]')).sendKeys('1000');
      await runner.driver.findElement(By.css('input[name="credit"]')).sendKeys('500');
      
      await runner.driver.findElement(By.css('button[type="submit"]')).click();
      
      await runner.driver.wait(until.urlContains('/clientManage'), TIMEOUT);
    });

    // TC-008: Navigation Test
    await runner.test('TC-008: Navigate between pages', async () => {
      await runner.driver.get(`${BASE_URL}/`);
      
      const manageLink = await runner.driver.findElement(By.xpath("//*[contains(text(), 'Manage Client')]"));
      await manageLink.click();
      
      await runner.driver.wait(until.urlContains('/clientManage'), TIMEOUT);
    });

    // TC-051: Page Load and Rendering
    await runner.test('TC-051: Home page renders correctly', async () => {
      await runner.driver.get(`${BASE_URL}/`);
      
      const greetContainer = await runner.waitAndFindElement(By.css('.greet-container, h1'));
      const text = await greetContainer.getText();
      
      if (text.length === 0) {
        throw new Error('Page content not rendered');
      }
    });

    // TC-014: Search Functionality
    await runner.test('TC-014: Search client by ID', async () => {
      await runner.driver.get(`${BASE_URL}/clientManage`);
      
      const searchInput = await runner.waitAndFindElement(By.css('input[placeholder*="Search"]'));
      await searchInput.sendKeys('1');
      
      await runner.driver.sleep(1000);
      
      const clientCards = await runner.driver.findElements(By.css('.client-card'));
      if (clientCards.length === 0) {
        throw new Error('Search returned no results');
      }
    });

    // Print Results
    runner.printResults();
    
    return runner.results;

  } catch (error) {
    console.error('❌ Test suite error:', error);
    throw error;
  } finally {
    await runner.teardown();
  }
}

export { runCriticalPathTests, SeleniumTestRunner };

