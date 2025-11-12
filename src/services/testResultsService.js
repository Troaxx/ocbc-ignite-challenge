const TEST_RESULTS_STORAGE_KEY = 'ocbc_test_results_history';

const testResultsService = {
  async getCurrentResults() {
    try {
      const response = await fetch('/test-results/results.json');
      if (!response.ok) {
        throw new Error('Failed to fetch test results');
      }
      const data = await response.json();
      return this.parseTestResults(data);
    } catch (error) {
      console.error('Error fetching test results:', error);
      return null;
    }
  },

  parseTestResults(data) {
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;
    let totalDuration = 0;
    let earliestStartTime = null;
    let latestEndTime = null;
    const testDetails = [];

    const processSpec = (spec) => {
      if (spec.specs && spec.specs.length > 0) {
        spec.specs.forEach(processSpec);
      }
      if (spec.tests && spec.tests.length > 0) {
        spec.tests.forEach(test => {
          test.results?.forEach((result, resultIndex) => {
            totalTests++;
            totalDuration += result.duration || 0;
            
            const testIsFailed = test.status === 'unexpected' || test.status === 'timedOut';
            const resultIsFailed = result.status === 'failed' || result.status === 'timedOut';
            const isFailed = testIsFailed || resultIsFailed;
            
            if (isFailed) {
              failedTests++;
            } else if (result.status === 'passed') {
              passedTests++;
            } else if (result.status === 'skipped') {
              skippedTests++;
            }

            const startTime = new Date(result.startTime);
            const endTime = new Date(startTime.getTime() + (result.duration || 0));

            if (!earliestStartTime || startTime < earliestStartTime) {
              earliestStartTime = startTime;
            }
            if (!latestEndTime || endTime > latestEndTime) {
              latestEndTime = endTime;
            }

            const errorDetails = this.extractErrorDetails(result, test);
            const attachments = this.extractAttachments(result, test);

            testDetails.push({
              title: spec.title,
              status: isFailed ? 'failed' : result.status,
              duration: result.duration,
              startTime: result.startTime,
              projectName: test.projectName || 'unknown',
              file: spec.file || test.location?.file || 'unknown',
              line: spec.line || test.location?.line || null,
              column: spec.column || test.location?.column || null,
              error: errorDetails,
              attachments: attachments,
              retry: result.retry || 0,
              workerIndex: result.workerIndex || null,
              stdout: result.stdout || [],
              stderr: result.stderr || []
            });
          });
        });
      }
    };

    if (data.suites) {
      data.suites.forEach(suite => {
        if (suite.specs && suite.specs.length > 0) {
          suite.specs.forEach(processSpec);
        }
        if (suite.suites && suite.suites.length > 0) {
          suite.suites.forEach(processSpec);
        }
      });
    }

    const runTimestamp = earliestStartTime ? earliestStartTime.getTime() : new Date().getTime();
    
    return {
      id: runTimestamp,
      timestamp: earliestStartTime ? earliestStartTime.toISOString() : new Date().toISOString(),
      totalTests,
      passedTests,
      failedTests,
      skippedTests,
      totalDuration,
      duration: latestEndTime && earliestStartTime 
        ? latestEndTime.getTime() - earliestStartTime.getTime() 
        : totalDuration,
      startTime: earliestStartTime ? earliestStartTime.toISOString() : null,
      endTime: latestEndTime ? latestEndTime.toISOString() : null,
      testDetails,
      raw: data
    };
  },

  archiveCurrentResults(results) {
    if (!results || !results.id) return;

    const history = this.getHistory();
    
    const existingIndex = history.findIndex(run => run.id === results.id);
    
    if (existingIndex === -1) {
      history.unshift(results);
    } else {
      history.splice(existingIndex, 1);
      history.unshift(results);
    }
    
    while (history.length > 5) {
      history.pop();
    }

    localStorage.setItem(TEST_RESULTS_STORAGE_KEY, JSON.stringify(history));
  },

  getHistory() {
    try {
      const stored = localStorage.getItem(TEST_RESULTS_STORAGE_KEY);
      if (!stored) return [];
      const history = JSON.parse(stored);
      return Array.isArray(history) ? history.slice(0, 5) : [];
    } catch (error) {
      console.error('Error reading test results history from localStorage:', error);
      return [];
    }
  },

  async getLatestResults() {
    const history = this.getHistory();
    const current = await this.getCurrentResults();
    
    if (current) {
      const existingRun = history.find(run => run.id === current.id);
      if (!existingRun) {
        this.archiveCurrentResults(current);
        return {
          current: current,
          history: this.getHistory()
        };
      }
    }
    
    return {
      current: current || null,
      history: history
    };
  },

  async getAllResults() {
    let history = this.getHistory();
    const current = await this.getCurrentResults();
    
    if (current) {
      const mostRecentInHistory = history.length > 0 ? history[0] : null;
      
      if (!mostRecentInHistory || mostRecentInHistory.id !== current.id) {
        this.archiveCurrentResults(current);
        history = this.getHistory();
      }
    }
    
    return {
      current: history.length > 0 ? history[0] : null,
      history: history.slice(0, 5),
      all: history.slice(0, 5)
    };
  },

  formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  },

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  },

  extractErrorDetails(result, test) {
    if (!result.error && !test.error) return null;

    const error = result.error || test.error;
    return {
      message: error.message || 'Test failed',
      stack: error.stack || null,
      value: error.value || null,
      snippet: error.snippet || null,
      location: error.location ? {
        file: error.location.file,
        line: error.location.line,
        column: error.location.column
      } : null
    };
  },

  extractAttachments(result, test) {
    const attachments = [];
    
    if (result.attachments) {
      result.attachments.forEach(attachment => {
        attachments.push({
          name: attachment.name,
          contentType: attachment.contentType,
          path: attachment.path,
          body: attachment.body,
          type: this.getAttachmentType(attachment.name, attachment.contentType)
        });
      });
    }

    if (test.attachments) {
      test.attachments.forEach(attachment => {
        attachments.push({
          name: attachment.name,
          contentType: attachment.contentType,
          path: attachment.path,
          body: attachment.body,
          type: this.getAttachmentType(attachment.name, attachment.contentType)
        });
      });
    }

    return attachments;
  },

  getAttachmentType(name, contentType) {
    if (!name && !contentType) return 'unknown';
    
    const nameLower = (name || '').toLowerCase();
    const contentTypeLower = (contentType || '').toLowerCase();

    if (nameLower.includes('screenshot') || contentTypeLower.includes('image')) {
      return 'screenshot';
    }
    if (nameLower.includes('trace') || contentTypeLower.includes('application')) {
      return 'trace';
    }
    if (nameLower.includes('video') || contentTypeLower.includes('video')) {
      return 'video';
    }
    if (nameLower.includes('har') || contentTypeLower.includes('har')) {
      return 'har';
    }
    return 'other';
  },

  formatErrorMessage(error) {
    if (!error) return null;
    
    if (error.message) {
      return this.stripAnsiCodes(error.message);
    }
    return 'Test failed without error message';
  },

  stripAnsiCodes(text) {
    if (!text) return text;
    return String(text)
      .replace(/\x1b\[[0-9;]*m/g, '')
      .replace(/\x1b\[[0-9;]*[A-Za-z]/g, '')
      .replace(/\x1b\[2m/g, '')
      .replace(/\x1b\[22m/g, '')
      .replace(/\x1b\[31m/g, '')
      .replace(/\x1b\[39m/g, '')
      .replace(/\x1b\[36m/g, '')
      .replace(/\x1b\[33m/g, '')
      .replace(/\x1b\[35m/g, '')
      .replace(/\x1b\[32m/g, '')
      .replace(/\x1b\[90m/g, '')
      .replace(/\x1b\[0m/g, '')
      .replace(/\x1b\[1m/g, '')
      .replace(/\\x1b\[[0-9;]*m/g, '')
      .replace(/\\x1b\[[0-9;]*[A-Za-z]/g, '')
      .replace(/\^\x1b\[22m/g, '^')
      .replace(/\x1b\[22m\^/g, '^')
      .trim();
  },

  formatStackTrace(stack) {
    if (!stack) return null;
    
    const lines = stack.split('\n');
    return lines.slice(0, 10).join('\n');
  },

  getFileName(filePath) {
    if (!filePath) return 'Unknown';
    const parts = filePath.split(/[/\\]/);
    return parts[parts.length - 1];
  }
};

export default testResultsService;

